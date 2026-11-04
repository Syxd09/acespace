import { NextRequest, NextResponse } from 'next/server';
import { getSavedConfigurationById } from '@/data/configuratorStore';
import { ProductConfiguration, CONFIGURATOR_PRESETS, CONFIGURATOR_MATERIALS, DRAIN_OPTIONS } from '@/data/configuratorData';
import { buildProductMesh } from '@/lib/configurator/meshBuilder';
import { exportGeometryToGlb } from '@/lib/configurator/glbExporter';
import { decodeUrlParamsToConfig } from '@/lib/configurator/urlParams';
import { BasinConfiguration, DEFAULT_BASIN_CONFIG, STANDALONE_BASIN_MODELS } from '@/data/basinConfiguratorData';
import { buildStandaloneBasinMesh } from '@/lib/configurator/basinMeshBuilder';

export const dynamic = 'force-dynamic';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Cross-Origin-Resource-Policy': 'cross-origin',
};

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  });
}

/**
 * GET /api/configurator/model
 * Generates and serves a real binary glTF 2.0 (.glb) architectural model
 * formatted with 1:1 metric scale for Google Scene Viewer and Apple Quick Look AR.
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type');

    // Case 1: Basin request
    if (type === 'basin') {
      const modelId = searchParams.get('model') || searchParams.get('m') || DEFAULT_BASIN_CONFIG.modelId;
      const matSlug = searchParams.get('material') || searchParams.get('mat') || DEFAULT_BASIN_CONFIG.materialSlug;
      const drainId = searchParams.get('drain') || searchParams.get('d') || DEFAULT_BASIN_CONFIG.drainTypeId;

      const foundModel = STANDALONE_BASIN_MODELS.find(m => m.id === modelId) || STANDALONE_BASIN_MODELS[0];
      const foundMat = CONFIGURATOR_MATERIALS.find(m => m.slug === matSlug) || CONFIGURATOR_MATERIALS[0];
      const foundDrain = DRAIN_OPTIONS.find(d => d.id === drainId) || DRAIN_OPTIONS[0];

      const width = parseInt(searchParams.get('w') || '', 10) || foundModel.width || DEFAULT_BASIN_CONFIG.width;
      const depth = parseInt(searchParams.get('d') || '', 10) || foundModel.depth || DEFAULT_BASIN_CONFIG.depth;
      const height = parseInt(searchParams.get('h') || '', 10) || foundModel.height || DEFAULT_BASIN_CONFIG.height;

      const basinConfig: BasinConfiguration = {
        modelId: foundModel.id,
        modelName: foundModel.name,
        modelCode: foundModel.code,
        shape: (foundModel.category === 'circular' ? 'round' : foundModel.category === 'oval' ? 'oval' : 'rectangular') as any,
        width,
        depth,
        height,
        covedRadius: 12,
        materialSlug: foundMat.slug,
        materialName: foundMat.name,
        materialHex: foundMat.hexColor,
        materialFinish: foundMat.finish,
        drainTypeId: foundDrain.id,
        drainName: foundDrain.name,
        projectName: 'AR Spatial Preview',
        clientStudio: 'Ace Spaces Specifier',
        locationCity: 'Bengaluru',
        specialInstructions: '',
        quantity: 1,
      };

      const mesh = buildStandaloneBasinMesh(basinConfig);
      const glbUint8Array = exportGeometryToGlb(mesh);
      const filename = `acespaces-basin-${basinConfig.modelCode}.glb`;

      return new NextResponse(Buffer.from(glbUint8Array), {
        status: 200,
        headers: {
          ...corsHeaders,
          'Content-Type': 'model/gltf-binary',
          'Content-Disposition': `inline; filename="${filename}"`,
          'Cache-Control': 'public, max-age=3600, s-maxage=86400',
        },
      });
    }

    // Case 2: Vanity / Parametric product
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
