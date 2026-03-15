import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { client } from '@/lib/sanity.client';
import { signToken } from '@/lib/auth';

export async function POST(req: Request) {
    try {
        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // 1. Find the user in Sanity
        const user = await client.fetch(`*[_type == "user" && email == $email][0]{
      _id,
      email,
      passwordHash,
      phone,
      phoneVerified
    }`, { email });

        if (!user) {
            return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
        }

        // Optional Check: Ensure phone is verified before login. Enable if strict verification is required.
        // if (!user.phoneVerified) {
        //   return NextResponse.json({ error: 'Please verify your phone number via OTP first.' }, { status: 403 });
        // }

        // 2. Compare Password
        const isValid = await bcrypt.compare(password, user.passwordHash);

        if (!isValid) {
            return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
        }

        // 3. Generate JWT
        const payload = {
            userId: user._id,
            email: user.email,
            phone: user.phone,
        };
        const sessionToken = signToken(payload, '7d');

        return NextResponse.json({ message: 'Login successful', token: sessionToken }, { status: 200 });
    } catch (error: any) {
        console.error('Login Error:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
