import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req: Request) {
    try {
        const { password } = await req.json();

        if (!password) {
            return NextResponse.json({ success: false }, { status: 400 });
        }

        // Hash the input password
        const inputHash = crypto
            .createHash('sha256')
            .update(password)
            .digest('hex');
        
        // Compare with stored hash
        const isValid = inputHash === process.env.CORRECT_PASSWORD_HASH;

        return NextResponse.json({ success: isValid });
    } catch (error) {
        return NextResponse.json({ success: false }, { status: 500 });
    }
}