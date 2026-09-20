import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Chat sessions are kept strictly private in the user's client browser session (sessionStorage).
 * No chat data is persisted to the server or stored in the admin panel.
 */
export async function POST() {
  return NextResponse.json({
    success: true,
    stored: false,
    message: 'Chats are strictly ephemeral and vanish when user closes the website.',
  });
}
