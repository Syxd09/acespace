import { NextRequest, NextResponse } from 'next/server';
import {
  getInquiries,
  saveInquiry,
  updateInquiryStatus,
  deleteInquiry,
  InquiryStatus,
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

const VALID_INQUIRY_STATUSES: InquiryStatus[] = ['new', 'in-discussion', 'sample-sent', 'closed'];
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// GET: Retrieve client inquiries with optional status filtering (Admin only)
export async function GET(req: NextRequest) {
  if (!verifyAdminRequest(req)) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized. Admin session required.' },
      { status: 401, headers: noCacheHeaders }
    );
  }

  const { searchParams } = new URL(req.url);
  const statusFilter = searchParams.get('status');

  let inquiries = getInquiries();
  if (statusFilter && VALID_INQUIRY_STATUSES.includes(statusFilter as InquiryStatus)) {
    inquiries = inquiries.filter((i) => i.status === statusFilter);
  }

  return NextResponse.json(
    { success: true, count: inquiries.length, inquiries },
    { status: 200, headers: noCacheHeaders }
  );
}

// POST: Public submission of contact inquiries with robust input validation
export async function POST(req: NextRequest) {
  try {
    // Rate limit: 6 inquiries per 10 minutes per IP
    const rateLimit = checkRateLimit(req, 'inquiries', 6, 10 * 60 * 1000);
    if (!rateLimit.success) {
      return NextResponse.json(
        { success: false, error: `Inquiry submission limit reached. Please retry in ${rateLimit.retryAfterSeconds}s.` },
        { status: 429, headers: { ...noCacheHeaders, 'Retry-After': rateLimit.retryAfterSeconds.toString() } }
      );
    }

    const body = await req.json();
    const { name, email, phone, projectType, message } = body;

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'Valid client name is required.' },
        { status: 400, headers: noCacheHeaders }
      );
    }

    if (!email || typeof email !== 'string' || !EMAIL_REGEX.test(email.trim()) || email.length > 120) {
      return NextResponse.json(
        { success: false, error: 'Valid architectural correspondence email is required.' },
        { status: 400, headers: noCacheHeaders }
      );
    }

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'Project inquiry message cannot be empty.' },
        { status: 400, headers: noCacheHeaders }
      );
    }

    if (message.length > 4000) {
      return NextResponse.json(
        { success: false, error: 'Message payload exceeds maximum allowable length of 4000 characters.' },
        { status: 400, headers: noCacheHeaders }
      );
    }

    const inquiry = saveInquiry({
      name: name.trim(),
      email: email.trim(),
      phone: typeof phone === 'string' ? phone.trim() : undefined,
      projectType: typeof projectType === 'string' ? projectType.trim() : 'General Consultation',
      message: message.trim(),
    });

    return NextResponse.json(
      {
        success: true,
        inquiryId: inquiry.id,
        inquiryNumber: inquiry.inquiryNumber,
        inquiry,
      },
      { status: 200, headers: noCacheHeaders }
    );
  } catch (err) {
    console.error('Error saving inquiry:', err);
    return NextResponse.json(
      { success: false, error: (err as Error).message },
      { status: 500, headers: noCacheHeaders }
    );
  }
}

// PATCH: Update inquiry status or notes (Admin only)
export async function PATCH(req: NextRequest) {
  if (!verifyAdminRequest(req)) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized. Admin session required.' },
      { status: 401, headers: noCacheHeaders }
    );
  }

  try {
    const body = await req.json();
    const { id, status, notes } = body;

    if (!id || !status) {
      return NextResponse.json(
        { success: false, error: 'Inquiry ID and status required.' },
        { status: 400, headers: noCacheHeaders }
      );
    }

    if (!VALID_INQUIRY_STATUSES.includes(status as InquiryStatus)) {
      return NextResponse.json(
        { success: false, error: `Invalid status. Must be one of: ${VALID_INQUIRY_STATUSES.join(', ')}` },
        { status: 400, headers: noCacheHeaders }
      );
    }

    const updated = updateInquiryStatus(id, status as InquiryStatus, notes);
    if (!updated) {
      return NextResponse.json(
        { success: false, error: 'Inquiry not found.' },
        { status: 404, headers: noCacheHeaders }
      );
    }

    return NextResponse.json(
      { success: true, inquiry: updated },
      { status: 200, headers: noCacheHeaders }
    );
  } catch (err) {
    return NextResponse.json(
      { success: false, error: (err as Error).message },
      { status: 500, headers: noCacheHeaders }
    );
  }
}

// DELETE: Remove inquiry (Admin only)
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
      { success: false, error: 'Inquiry ID required.' },
      { status: 400, headers: noCacheHeaders }
    );
  }

  const deleted = deleteInquiry(id);
  return NextResponse.json(
    { success: deleted },
    { status: deleted ? 200 : 404, headers: noCacheHeaders }
  );
}
