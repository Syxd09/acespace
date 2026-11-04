import { NextRequest, NextResponse } from 'next/server';
import { getSavedConfigurationById } from '@/data/configuratorStore';
import { ProductConfiguration, CONFIGURATOR_PRESETS, AVAILABLE_BASINS, CONFIGURATOR_MATERIALS, DRAIN_OPTIONS } from '@/data/configuratorData';
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
 * GET /api/model/[filename] (e.g. /api/model/basin.glb or /api/model/vanity.glb)
 * Serves fully compliant binary glTF 2.0 (.glb) architectural 3D models
 * with 1:1 metric scale for Google Scene Viewer (Android) and Apple Quick Look (iOS).
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { filename: string } }
) {
  try {
    const { filename } = params;
    const { searchParams } = new URL(req.url);

    const type = searchParams.get('type') || (filename.toLowerCase().includes('basin') ? 'basin' : 'vanity');

    // =========================================================================
    // CASE A: STANDALONE COUNTERTOP BASIN MODEL (.glb)
    // =========================================================================
    if (type === 'basin') {
      const modelId = searchParams.get('model') || searchParams.get('m') || DEFAULT_BASIN_CONFIG.modelId;
      const matSlug = searchParams.get('material') || searchParams.get('mat') || DEFAULT_BASIN_CONFIG.materialSlug;
      const drainId = searchParams.get('drain') || searchParams.get('d') || DEFAULT_BASIN_CONFIG.drainTypeId;

      const foundModel = STANDALONE_BASIN_MODELS.find(m => m.id === modelId) || STANDALONE_BASIN_MODELS[0];
      const foundMat = CONFIGURATOR_MATERIALS.find(m => m.slug === matSlug) || CONFIGURATOR_MATERIALS[0];
      const foundDrain = DRAIN_OPTIONS.find(d => d.id === drainId) || DRAIN_OPTIONS[0];

      // Custom or model dimensions
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

      const downloadFilename = filename.endsWith('.glb') ? filename : `acespaces-basin-${basinConfig.modelCode}.glb`;

      return new NextResponse(Buffer.from(glbUint8Array), {
        status: 200,
        headers: {
          ...corsHeaders,
          'Content-Type': 'model/gltf-binary',
          'Content-Disposition': `inline; filename="${downloadFilename}"`,
          'Cache-Control': 'public, max-age=3600, s-maxage=86400',
        },
      });
    }

    // =========================================================================
    // CASE B: ARCHITECTURAL VANITY / BENCHTOP / WASHPLANE MODEL (.glb)
    // =========================================================================
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

    // 2. Stored record ID
    if (!config && id) {
      const record = getSavedConfigurationById(id);
      if (record) {
        config = record.config;
      }
    }

    // 3. Fallback to preset
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

    const mesh = buildProductMesh(config);
    const glbUint8Array = exportGeometryToGlb(mesh);

    const downloadFilename = filename.endsWith('.glb') ? filename : `acespaces-${config.presetId || 'vanity'}.glb`;

    return new NextResponse(Buffer.from(glbUint8Array), {
      status: 200,
      headers: {
        ...corsHeaders,
        'Content-Type': 'model/gltf-binary',
        'Content-Disposition': `inline; filename="${downloadFilename}"`,
        'Cache-Control': 'public, max-age=3600, s-maxage=86400',
      },
    });
  } catch (error) {
    console.error('Error generating GLB architectural model:', error);
    return NextResponse.json(
      { error: 'Failed to generate 3D GLB model' },
      { status: 500, headers: corsHeaders }
    );
  }
}
