import { NextRequest, NextResponse } from 'next/server';
import { getSavedConfigurationById } from '@/data/configuratorStore';
import { ProductConfiguration, CONFIGURATOR_PRESETS } from '@/data/configuratorData';
import { buildProductMesh } from '@/lib/configurator/meshBuilder';
import { exportGeometryToGlb } from '@/lib/configurator/glbExporter';

import { decodeUrlParamsToConfig } from '@/lib/configurator/urlParams';

export const dynamic = 'force-dynamic';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  });
}

/**
 * GET /api/configurator/model?id=cfg_...
 * Generates and serves a real binary glTF 2.0 (.glb) architectural model
 * formatted with 1:1 metric scale for Google Scene Viewer and Apple Quick Look AR.
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const presetId = searchParams.get('presetId') || searchParams.get('p');

    let config: ProductConfiguration | undefined;

    // 1. Try decoding direct zero-DB URL parameters (100% resilient across serverless cold starts)
    const decodedFromParams = decodeUrlParamsToConfig(searchParams);
    if (decodedFromParams && decodedFromParams.width) {
      const basePreset = CONFIGURATOR_PRESETS.find(p => p.id === (decodedFromParams.presetId || presetId)) || CONFIGURATOR_PRESETS[0];
      config = {
        ...basePreset.defaultConfig,
        ...decodedFromParams,
      } as ProductConfiguration;
    }

    // 2. If no direct parameters, try stored record ID
    if (!config && id) {
      const record = getSavedConfigurationById(id);
      if (record) {
        config = record.config;
      }
    }

    // 3. Fallback to preset if provided
    if (!config && presetId) {
      const preset = CONFIGURATOR_PRESETS.find(p => p.id === presetId);
      if (preset) {
        config = preset.defaultConfig;
      }
    }

    // 4. Default fallback preset
    if (!config) {
      config = CONFIGURATOR_PRESETS[0]?.defaultConfig;
    }

    if (!config) {
      return NextResponse.json(
        { error: 'Configuration not found' },
        { status: 404, headers: corsHeaders }
      );
    }

    // Build metric procedural mesh and export binary GLB
    const mesh = buildProductMesh(config);
    const glbUint8Array = exportGeometryToGlb(mesh);

    const filename = `acespaces-${config.presetId || 'vanity'}.glb`;

    return new NextResponse(Buffer.from(glbUint8Array), {
      status: 200,
      headers: {
        ...corsHeaders,
        'Content-Type': 'model/gltf-binary',
        'Content-Disposition': `inline; filename="${filename}"`,
        'Cache-Control': 'public, max-age=3600, s-maxage=86400',
      },
    });
  } catch (error) {
    console.error('Error generating GLB model:', error);
    return NextResponse.json(
      { error: 'Failed to generate 3D GLB model' },
      { status: 500, headers: corsHeaders }
    );
  }
}

/**
 * POST /api/configurator/model
 * Accepts raw ProductConfiguration JSON body and returns live binary GLB
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const config = body.config || body;

    if (!config || !config.width) {
      return NextResponse.json(
        { error: 'Invalid configuration payload' },
        { status: 400, headers: corsHeaders }
      );
    }

    const mesh = buildProductMesh(config);
    const glbUint8Array = exportGeometryToGlb(mesh);
    const filename = `acespaces-${config.referenceCode || 'custom'}.glb`;

    return new NextResponse(Buffer.from(glbUint8Array), {
      status: 200,
      headers: {
        ...corsHeaders,
        'Content-Type': 'model/gltf-binary',
        'Content-Disposition': `inline; filename="${filename}"`,
        'Cache-Control': 'no-cache',
      },
    });
  } catch (error) {
    console.error('Error generating GLB model from POST:', error);
    return NextResponse.json(
      { error: 'Failed to generate 3D GLB model' },
      { status: 500, headers: corsHeaders }
    );
  }
}
