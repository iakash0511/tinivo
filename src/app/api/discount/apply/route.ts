import { NextResponse } from 'next/server';
import { client } from '@/lib/sanity.client';
import { verifyToken } from '@/lib/auth';

export async function POST(req: Request) {
    try {
        const { code, cartValue } = await req.json();

        // Optional: we can require user to be logged in to use certain codes
        const authHeader = req.headers.get('authorization');
        let userId = null;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            const payload = verifyToken(authHeader.split(' ')[1]);
            if (payload) {
                userId = payload.userId;
            }
        }

        if (!code || typeof cartValue !== 'number') {
            return NextResponse.json({ error: 'Missing code or cartValue' }, { status: 400 });
        }

        const UPPER_CODE = code.toUpperCase();

        // 1. Fetch the discount code from Sanity
        const discountDoc = await client.fetch(
            `*[_type == "discountCode" && code == $code && active == true][0]`,
            { code: UPPER_CODE }
        );

        if (!discountDoc) {
            return NextResponse.json({ error: 'Invalid or inactive discount code.' }, { status: 400 });
        }

        // 2. Validate Expiry
        if (discountDoc.expiryDate && new Date(discountDoc.expiryDate) < new Date()) {
            return NextResponse.json({ error: 'This discount code has expired.' }, { status: 400 });
        }

        // 3. Validate Minimum Cart Value
        if (discountDoc.minCartValue && cartValue < discountDoc.minCartValue) {
            return NextResponse.json({ error: `Cart value must be at least ₹${discountDoc.minCartValue} to use this code.` }, { status: 400 });
        }

        // 4. Validate Max Total Uses
        if (discountDoc.maxTotalUses && discountDoc.usesTotal >= discountDoc.maxTotalUses) {
            return NextResponse.json({ error: 'This discount code has reached its maximum usage limit.' }, { status: 400 });
        }

        // 5. Validate Assigned Users (if any)
        if (discountDoc.assignedUsers && discountDoc.assignedUsers.length > 0) {
            if (!userId) {
                return NextResponse.json({ error: 'You must be logged in to use this specific code.' }, { status: 401 });
            }
            const isAssigned = discountDoc.assignedUsers.some((ref: { _ref: string }) => ref._ref === userId);
            if (!isAssigned) {
                return NextResponse.json({ error: 'This discount code is not available for your account.' }, { status: 403 });
            }
        }

        // 6. Calculate the actual discount
        let discountAmount = 0;
        if (discountDoc.discountType === 'percent') {
            discountAmount = (cartValue * discountDoc.value) / 100;
            // Optional: enforce a max discount if you add a maxDiscountAmount field in the future
        } else if (discountDoc.discountType === 'flat') {
            discountAmount = discountDoc.value;
        }

        // Do NOT let discount exceed cart value
        if (discountAmount > cartValue) {
            discountAmount = cartValue;
        }

        // Success response
        // NOTE: We don't increment usesTotal here because this might just be "applying" the code in the cart.
        // The actual increment should happen carefully when the Order is Placed/Confirmed.
        // For now we just return the valid discount so the cart can update.

        return NextResponse.json({
            message: 'Discount applied',
            discountAmount,
            code: discountDoc.code,
            discountType: discountDoc.discountType,
            value: discountDoc.value,
        }, { status: 200 });

    } catch (error: unknown) {
        console.error('Discount Apply Error:', error);
        const message = error instanceof Error ? error.message : 'Internal Server Error';
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
