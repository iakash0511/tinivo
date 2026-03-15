import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { client } from '@/lib/sanity.client';
import { signToken } from '@/lib/auth';

export async function POST(req: Request) {
    try {
        const { name, email, phone, password } = await req.json();

        if (!email || !password || !phone) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // 1. Check if user already exists
        const existingUser = await client.fetch(`*[_type == "user" && email == $email][0]`, { email });
        if (existingUser) {
            return NextResponse.json({ error: 'User with this email already exists.' }, { status: 400 });
        }

        // 2. Hash Password
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        // 3. Create user record in Sanity (phoneVerified set to true — skipping OTP)
        const doc = {
            _type: 'user',
            name,
            email,
            phone,
            passwordHash,
            phoneVerified: true,
        };

        const writeClient = client.withConfig({ token: process.env.SANITY_WRITE_TOKEN });
        const newUser = await writeClient.create(doc);

        // 4. Issue JWT immediately so the user is logged in right after signup
        const payload = {
            userId: newUser._id,
            email: newUser.email,
            phone: newUser.phone,
        };
        const sessionToken = signToken(payload, '7d');

        return NextResponse.json({
            message: 'Account created successfully',
            token: sessionToken,
        }, { status: 201 });

    } catch (error: any) {
        console.error('Signup Error:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
