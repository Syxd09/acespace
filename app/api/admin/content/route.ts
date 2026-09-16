import { NextRequest, NextResponse } from 'next/server';
import { getSiteContent, saveSiteContent, resetSiteContent } from '@/data/contentStore';
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

// GET is public so all visitors see live catalog
export async function GET() {
  const content = getSiteContent();
  return NextResponse.json(content, {
    status: 200,
    headers: noCacheHeaders,
  });
}

// POST requires admin authentication
export async function POST(req: NextRequest) {
  if (!verifyAdminRequest(req)) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized. Admin session required.' },
      { status: 401, headers: noCacheHeaders }
    );
  }

  try {
    const body = await req.json();

    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      return NextResponse.json(
        { success: false, error: 'Invalid content payload. Expected a root content object.' },
        { status: 400, headers: noCacheHeaders }
      );
    }

    // Defensive guards: prevent wiping essential catalog collections
    if ('materials' in body && (!Array.isArray(body.materials) || body.materials.length === 0)) {
      return NextResponse.json(
        { success: false, error: 'Materials collection cannot be emptied or non-array.' },
        { status: 400, headers: noCacheHeaders }
      );
    }

    if ('projects' in body && !Array.isArray(body.projects)) {
      return NextResponse.json(
        { success: false, error: 'Projects collection must be an array.' },
        { status: 400, headers: noCacheHeaders }
      );
    }

    if ('heroSlides' in body && (!Array.isArray(body.heroSlides) || body.heroSlides.length === 0)) {
      return NextResponse.json(
        { success: false, error: 'Hero slides collection must contain at least one slide.' },
        { status: 400, headers: noCacheHeaders }
      );
    }

    const updated = saveSiteContent(body);
    return NextResponse.json(
      { success: true, content: updated },
      { status: 200, headers: noCacheHeaders }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500, headers: noCacheHeaders }
    );
  }
}

// DELETE requires admin authentication
export async function DELETE(req: NextRequest) {
  if (!verifyAdminRequest(req)) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized. Admin session required.' },
      { status: 401, headers: noCacheHeaders }
    );
  }

  const content = resetSiteContent();
  return NextResponse.json(
    { success: true, message: 'Reset to architectural defaults', content },
    { status: 200, headers: noCacheHeaders }
  );
}
