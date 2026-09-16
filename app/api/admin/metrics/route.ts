import { NextRequest, NextResponse } from 'next/server';
import { getStoreMetrics } from '@/data/orderStore';
import { verifyAdminRequest } from '@/lib/adminAuth';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

const noCacheHeaders = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
  'Pragma': 'no-cache',
  'Expires': '0',
  'Surrogate-Control': 'no-store',
};

// GET: Retrieve consolidated store metrics and operational analytics (Admin only)
export async function GET(req: NextRequest) {
  if (!verifyAdminRequest(req)) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized. Admin session required.' },
      { status: 401, headers: noCacheHeaders }
    );
  }

  try {
    const metrics = getStoreMetrics();
    return NextResponse.json(
      {
        success: true,
        timestamp: new Date().toISOString(),
        metrics,
      },
      { status: 200, headers: noCacheHeaders }
    );
  } catch (err) {
    return NextResponse.json(
      { success: false, error: (err as Error).message },
      { status: 500, headers: noCacheHeaders }
    );
  }
}
