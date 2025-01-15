import { NextResponse } from 'next/server';
import crypto from 'crypto';

// CORS configuration
const ALLOWED_ORIGIN = 'https://lodgepolepines.github.io';

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    }
  });
}

export async function POST(req: Request) {
    // CORS headers for the POST response
    const corsHeaders = {
      'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    try {
        const { password } = await req.json();

        if (!password) {
            return NextResponse.json({ success: false }, { 
                status: 400,
                headers: corsHeaders
            });
        }

        // Hash the input password
        const inputHash = crypto
            .createHash('sha256')
            .update(password)
            .digest('hex');
        
        // Compare with stored hash
        const isValid = inputHash === process.env.CORRECT_PASSWORD_HASH;

        return NextResponse.json({ success: isValid }, {
            headers: corsHeaders
        });
    } catch {
        return NextResponse.json({ success: false }, { 
            status: 500,
            headers: corsHeaders
        });
    }
}