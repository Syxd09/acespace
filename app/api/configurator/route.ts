import { NextRequest, NextResponse } from 'next/server';
import {
  saveConfigurationRecord,
  getSavedConfigurationById,
  getAllSavedConfigurations,
  deleteSavedConfiguration,
} from '@/data/configuratorStore';
import {
  ProductConfiguration,
  calculateIndicativePrice,
  CONFIGURATOR_PRESETS,
  CONFIGURATOR_MATERIALS,
  AVAILABLE_BASINS,
  EDGE_PROFILES,
} from '@/data/configuratorData';
import { verifyAdminRequest } from '@/lib/adminAuth';
import { checkRateLimit } from '@/lib/rateLimit';

export const dynamic = 'force-dynamic';

const noCacheHeaders = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
  'Pragma': 'no-cache',
  'Expires': '0',
  'Surrogate-Control': 'no-store',
};

// GET: Retrieve a specific configuration by ID or list all (Admin only)
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  // If a specific configuration ID or reference code is requested
  if (id) {
    const config = getSavedConfigurationById(id);
    if (!config) {
      return NextResponse.json(
        { success: false, error: 'Configuration not found.' },
        { status: 404, headers: noCacheHeaders }
      );
    }
    return NextResponse.json(
      { success: true, configuration: config },
      { status: 200, headers: noCacheHeaders }
    );
  }

  // If requesting the full list, verify admin session
  const isAdmin = verifyAdminRequest(req);
  if (isAdmin) {
    const configs = getAllSavedConfigurations();
    return NextResponse.json(
      { success: true, count: configs.length, configurations: configs },
      { status: 200, headers: noCacheHeaders }
    );
  }

  // Public catalog payload
  return NextResponse.json(
    {
      success: true,
      presets: CONFIGURATOR_PRESETS,
      materials: CONFIGURATOR_MATERIALS,
      basins: AVAILABLE_BASINS,
      edgeProfiles: EDGE_PROFILES,
    },
    { status: 200, headers: noCacheHeaders }
  );
}

// POST: Save or validate a configuration with authoritative server-side pricing
export async function POST(req: NextRequest) {
  try {
    // Rate limit: 20 saves per 10 minutes per IP
    const rateLimit = checkRateLimit(req, 'configurator_save', 20, 10 * 60 * 1000);
    if (!rateLimit.success) {
      return NextResponse.json(
        { success: false, error: `Rate limit reached. Please retry in ${rateLimit.retryAfterSeconds}s.` },
        { status: 429, headers: noCacheHeaders }
      );
    }

    const body = await req.json();
    const config = body.config as ProductConfiguration;

    if (!config || typeof config !== 'object') {
      return NextResponse.json(
        { success: false, error: 'Valid configuration object is required.' },
        { status: 400, headers: noCacheHeaders }
      );
    }

    // Validation of Architectural Parameters
    if (!config.width || config.width < 500 || config.width > 4200) {
      return NextResponse.json(
        { success: false, error: 'Width must be between 500 mm and 4200 mm.' },
        { status: 400, headers: noCacheHeaders }
      );
    }

    if (!config.depth || config.depth < 350 || config.depth > 1200) {
      return NextResponse.json(
        { success: false, error: 'Depth must be between 350 mm and 1200 mm.' },
        { status: 400, headers: noCacheHeaders }
      );
    }

    if (![12, 19, 24, 60].includes(config.thickness)) {
      return NextResponse.json(
        { success: false, error: 'Invalid slab thickness.' },
        { status: 400, headers: noCacheHeaders }
      );
    }

    // Sanitize text inputs
    config.projectName = (config.projectName || 'Architectural Specification').trim().slice(0, 120);
    config.clientStudio = (config.clientStudio || '').trim().slice(0, 120);
    config.locationCity = (config.locationCity || 'Bengaluru').trim().slice(0, 80);
    config.specialInstructions = (config.specialInstructions || '').trim().slice(0, 2000);
    config.quantity = Math.max(1, Math.min(100, Math.floor(config.quantity || 1)));

    // Authoritative Server-side Price Calculation
    const pricing = calculateIndicativePrice(config);

    // Save record
    const record = saveConfigurationRecord(config, body.quoteRequest);

    return NextResponse.json(
      {
        success: true,
        configuration: record,
        pricing,
        shareUrl: `https://acespacesindia.vercel.app/configurator?id=${record.configNumber}`,
      },
      { status: 200, headers: noCacheHeaders }
    );
  } catch (err) {
    console.error('Error saving configuration:', err);
    return NextResponse.json(
      { success: false, error: 'Internal server error while processing 3D configuration.' },
      { status: 500, headers: noCacheHeaders }
    );
  }
}

// DELETE: Admin deletion of stored design record
export async function DELETE(req: NextRequest) {
  if (!verifyAdminRequest(req)) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized.' },
      { status: 401, headers: noCacheHeaders }
    );
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) {
    return NextResponse.json(
      { success: false, error: 'Configuration ID required.' },
      { status: 400, headers: noCacheHeaders }
    );
  }

  const deleted = deleteSavedConfiguration(id);
  return NextResponse.json(
    { success: deleted },
    { status: deleted ? 200 : 404, headers: noCacheHeaders }
  );
}
