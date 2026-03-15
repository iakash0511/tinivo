import { NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebaseAdmin';
import { client } from '@/lib/sanity.client';
import { signToken } from '@/lib/auth';

export async function POST(req: Request) {
    try {
        const { idToken, userId } = await req.json();

        if (!idToken || !userId) {
            return NextResponse.json({ error: 'Missing required tokens or user id' }, { status: 400 });
        }

        // 1. Verify idToken with Firebase Admin SDK
        const decodedToken = await adminAuth.verifyIdToken(idToken);
        const { uid, phone_number } = decodedToken;

        // 2. Double check if the user actually exists in Sanity
        const user = await client.fetch(`*[_type == "user" && _id == $userId][0]`, { userId });
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Optional phone number matching check
        // if (user.phone !== phone_number) {
        //  return NextResponse.json({ error: 'Verified phone does not match registered phone.' }, { status: 400 });
        // }

        // 3. Mark the user as verified
        const writeClient = client.withConfig({ token: process.env.SANITY_WRITE_TOKEN });
        await writeClient
            .patch(userId)
            .set({
                phoneVerified: true,
                firebaseUid: uid,
            })
            .commit();

        // 4. Issue a JWT Token
        const payload = {
            userId: user._id,
            email: user.email,
            phone: user.phone,
        };
        const sessionToken = signToken(payload, '7d');

        // 5. Send token back to client (Client can store it in cookie/local storage)
        return NextResponse.json({
            message: 'OTP verified and login successful',
            token: sessionToken,
        }, { status: 200 });

    } catch (error: any) {
        console.error('Verify OTP Error:', error);
        return NextResponse.json({ error: error.message || 'OTP Verification Failed' }, { status: 400 });
    }
}
