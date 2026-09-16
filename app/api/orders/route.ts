import { NextRequest, NextResponse } from 'next/server';
import {
  getSampleOrders,
  saveSampleOrder,
  updateSampleOrderStatus,
  deleteSampleOrder,
  getStoreMetrics,
  SampleOrder,
  OrderStatus,
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

const VALID_ORDER_STATUSES: OrderStatus[] = ['in-progress', 'submitted', 'dispatched', 'delivered', 'cancelled'];
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// GET: Retrieve sample orders or store metrics (Admin only)
export async function GET(req: NextRequest) {
  if (!verifyAdminRequest(req)) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized. Admin session required.' },
      { status: 401, headers: noCacheHeaders }
    );
  }

  const { searchParams } = new URL(req.url);
  const view = searchParams.get('view');
  if (view === 'metrics') {
    const metrics = getStoreMetrics();
    return NextResponse.json(
      { success: true, metrics },
      { status: 200, headers: noCacheHeaders }
    );
  }

  const statusFilter = searchParams.get('status');
  let orders = getSampleOrders();

  if (statusFilter && VALID_ORDER_STATUSES.includes(statusFilter as OrderStatus)) {
    orders = orders.filter((o) => o.status === statusFilter);
  }

  return NextResponse.json(
    { success: true, count: orders.length, orders },
    { status: 200, headers: noCacheHeaders }
  );
}

// POST: Public submission of sample orders or in-progress drafts
export async function POST(req: NextRequest) {
  try {
    // Rate limit: 40 requests per 10 minutes per IP
    const rateLimit = checkRateLimit(req, 'orders', 40, 10 * 60 * 1000);
    if (!rateLimit.success) {
      return NextResponse.json(
        { success: false, error: 'Too many order requests. Please retry in a few moments.' },
        { status: 429, headers: { ...noCacheHeaders, 'Retry-After': rateLimit.retryAfterSeconds.toString() } }
      );
    }

    const body = await req.json();

    // Defensive validation of items array
    if (!body.items || !Array.isArray(body.items) || body.items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Cart must contain at least one architectural sample item.' },
        { status: 400, headers: noCacheHeaders }
      );
    }

    if (body.items.length > 25) {
      return NextResponse.json(
        { success: false, error: 'Maximum allowable sample order size is 25 specimens per request.' },
        { status: 400, headers: noCacheHeaders }
      );
    }

    // Optional customer email validation if provided
    if (body.customer?.email && typeof body.customer.email === 'string') {
      const emailTrimmed = body.customer.email.trim();
      if (emailTrimmed.length > 0 && (!EMAIL_REGEX.test(emailTrimmed) || emailTrimmed.length > 120)) {
        return NextResponse.json(
          { success: false, error: 'Customer email format is invalid.' },
          { status: 400, headers: noCacheHeaders }
        );
      }
    }

    const isAdmin = verifyAdminRequest(req);
    const savedOrder = saveSampleOrder(body as Partial<SampleOrder>, isAdmin);

    return NextResponse.json(
      {
        success: true,
        orderId: savedOrder.id,
        orderNumber: savedOrder.orderNumber,
        status: savedOrder.status,
        order: savedOrder,
      },
      { status: 200, headers: noCacheHeaders }
    );
  } catch (err) {
    console.error('Error saving sample order:', err);
    const errMsg = (err as Error).message || 'Error processing sample order.';
    const isAuthError = errMsg.includes('authorization') || errMsg.includes('Unauthorized');
    return NextResponse.json(
      { success: false, error: errMsg },
      { status: isAuthError ? 403 : 500, headers: noCacheHeaders }
    );
  }
}

// PATCH: Update order status or notes (Admin only)
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
        { success: false, error: 'Order ID and status are required.' },
        { status: 400, headers: noCacheHeaders }
      );
    }

    if (!VALID_ORDER_STATUSES.includes(status as OrderStatus)) {
      return NextResponse.json(
        { success: false, error: `Invalid order status. Must be one of: ${VALID_ORDER_STATUSES.join(', ')}` },
        { status: 400, headers: noCacheHeaders }
      );
    }

    const updated = updateSampleOrderStatus(id, status as OrderStatus, notes);
    if (!updated) {
      return NextResponse.json(
        { success: false, error: 'Order not found.' },
        { status: 404, headers: noCacheHeaders }
      );
    }

    return NextResponse.json(
      { success: true, order: updated },
      { status: 200, headers: noCacheHeaders }
    );
  } catch (err) {
    return NextResponse.json(
      { success: false, error: (err as Error).message },
      { status: 500, headers: noCacheHeaders }
    );
  }
}

// DELETE: Remove sample order (Admin only)
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
      { success: false, error: 'Order ID required.' },
      { status: 400, headers: noCacheHeaders }
    );
  }

  const deleted = deleteSampleOrder(id);
  return NextResponse.json(
    { success: deleted },
    { status: deleted ? 200 : 404, headers: noCacheHeaders }
  );
}
