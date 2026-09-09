import { NextRequest, NextResponse } from 'next/server';
import { checkPasskey, createSessionToken, verifyAdminRequest } from '@/lib/adminAuth';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { passkey } = body;

    if (!passkey || !checkPasskey(passkey)) {
      return NextResponse.json(
        { success: false, error: 'Invalid studio passkey.' },
        { status: 401 }
      );
    }

    const token = createSessionToken();
    const response = NextResponse.json({
      success: true,
      message: 'Studio authenticated successfully.',
      token,
    });

    // Set secure HTTP-only cookie
    response.cookies.set('acespaces_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
      path: '/',
    });

    return response;
  } catch (err) {
    return NextResponse.json(
      { success: false, error: 'Authentication failed.' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  const isAuthenticated = verifyAdminRequest(req);
  return NextResponse.json({ authenticated: isAuthenticated });
}

export async function DELETE() {
  const response = NextResponse.json({ success: true, message: 'Signed out.' });
  response.cookies.delete('acespaces_session');
  return response;
}
