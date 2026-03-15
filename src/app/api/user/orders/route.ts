import { NextResponse } from 'next/server';
import { client } from '@/lib/sanity.client';
import { verifyToken } from '@/lib/auth';

export async function GET(req: Request) {
    try {
        const authHeader = req.headers.get('authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const token = authHeader.split(' ')[1];
        const payload = verifyToken(token);

        if (!payload || !payload.userId) {
            return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
        }

        const orders = await client.fetch(
            `*[_type == "order" && userId == $userId] | order(_createdAt desc){
                _id,
                _createdAt,
                orderId,
                paymentStatus,
                shippingStatus,
                total,
                items[]{
                  name,
                  quantity,
                  price
                }
            }`,
            { userId: payload.userId }
        );

        return NextResponse.json({ orders }, { status: 200 });
    } catch (error: unknown) {
        console.error("Fetch Orders Error:", error);
        const message = error instanceof Error ? error.message : 'Internal Server Error';
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
