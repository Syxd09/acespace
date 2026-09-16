import { NextRequest, NextResponse } from 'next/server';
import {
  getDispatchSubscribers,
  addDispatchSubscriber,
  removeDispatchSubscriber,
} from '@/data/orderStore';
import { verifyAdminRequest } from '@/lib/adminAuth';
import { checkRateLimit } from '@/lib/rateLimit';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

const noCacheHeaders = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
  'Pragma': 'no-cache',
  'Expires': '0',
  'Surrogate-Control': 'no-store',
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// GET: Retrieve subscribers with optional status filter (Admin only)
export async function GET(req: NextRequest) {
  if (!verifyAdminRequest(req)) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized. Admin session required.' },
      { status: 401, headers: noCacheHeaders }
    );
  }

  const { searchParams } = new URL(req.url);
  const statusFilter = searchParams.get('status');

  let subscribers = getDispatchSubscribers();
  if (statusFilter === 'active' || statusFilter === 'unsubscribed') {
    subscribers = subscribers.filter((s) => s.status === statusFilter);
  }

  return NextResponse.json(
    { success: true, count: subscribers.length, subscribers },
    { status: 200, headers: noCacheHeaders }
  );
}

// POST: Public signup to newsletter dispatch with RFC validation
export async function POST(req: NextRequest) {
  try {
    // Rate limit: 6 newsletter signups per 10 minutes per IP
    const rateLimit = checkRateLimit(req, 'dispatch', 6, 10 * 60 * 1000);
    if (!rateLimit.success) {
      return NextResponse.json(
        { success: false, error: `Too many dispatch subscription requests. Please retry in ${rateLimit.retryAfterSeconds}s.` },
        { status: 429, headers: { ...noCacheHeaders, 'Retry-After': rateLimit.retryAfterSeconds.toString() } }
      );
    }

    const body = await req.json();
    const { email, source } = body;

    if (!email || typeof email !== 'string' || !EMAIL_REGEX.test(email.trim()) || email.trim().length > 120) {
      return NextResponse.json(
        { success: false, error: 'A valid email address is required for Ace Dispatch subscription.' },
        { status: 400, headers: noCacheHeaders }
      );
    }

    const cleanSource = typeof source === 'string' && source.trim().length > 0 
      ? source.trim().slice(0, 100) 
      : 'Footer Dispatch Box';

    const { subscriber, alreadySubscribed } = addDispatchSubscriber(
      email.trim(),
      cleanSource
    );

    return NextResponse.json(
      {
        success: true,
        alreadySubscribed,
        subscriber,
      },
      { status: 200, headers: noCacheHeaders }
    );
  } catch (err) {
    console.error('Error adding dispatch subscriber:', err);
    return NextResponse.json(
      { success: false, error: (err as Error).message },
      { status: 500, headers: noCacheHeaders }
    );
  }
}

// DELETE: Remove subscriber (Admin only)
export async function DELETE(req: NextRequest) {
  if (!verifyAdminRequest(req)) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized. Admin session required.' },
      { status: 401, headers: noCacheHeaders }
    );
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json(
      { success: false, error: 'Subscriber ID required.' },
      { status: 400, headers: noCacheHeaders }
    );
  }

  const deleted = removeDispatchSubscriber(id);
  return NextResponse.json(
    { success: deleted },
    { status: deleted ? 200 : 404, headers: noCacheHeaders }
  );
}
