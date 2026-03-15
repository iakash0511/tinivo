import * as admin from 'firebase-admin';

// Provide explicit error guidance if envs are missing
if (!process.env.FIREBASE_PRIVATE_KEY) {
    console.error("FATAL ERROR: FIREBASE_PRIVATE_KEY is missing from environment variables.");
    console.warn("Please add FIREBASE_PRIVATE_KEY to your .env.local file to enable OTP Verification.");
}

if (!admin.apps.length) {
    try {
        admin.initializeApp({
            credential: admin.credential.cert({
                projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
                clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                // Handle newlines in private key safely
                privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
            }),
        });
    } catch (error) {
        console.error('Firebase admin initialization error:', error);
    }
}

export const adminAuth = admin.apps.length ? admin.auth() : null;
