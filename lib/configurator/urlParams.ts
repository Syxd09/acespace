import { ProductConfiguration, CONFIGURATOR_MATERIALS } from '@/data/configuratorData';

/**
 * Compact parameter serialization for solid surface configurator.
 * Encodes key architectural dimensions into URL query parameters
 * so mobile devices can hydrate the 3D model with ZERO database dependencies.
 */
export function encodeConfigToUrlParams(config: ProductConfiguration): string {
  const params = new URLSearchParams();

  params.set('p', config.presetId);
  params.set('w', config.width.toString());
  params.set('d', config.depth.toString());
  params.set('t', config.thickness.toString());
  params.set('m', config.materialSlug);

  // Basin & Sink
  if (config.basinModelId) params.set('b', config.basinModelId);
  if (config.basinPlacement) params.set('bp', config.basinPlacement);
  if (config.sinkIntegration) params.set('si', config.sinkIntegration);
  if (config.basinOffsetMm) params.set('bo', config.basinOffsetMm.toString());

  // Tap
  if (config.tapLocation) params.set('tl', config.tapLocation);
  if (typeof config.tapHoles === 'number') params.set('th', config.tapHoles.toString());

  // Downstands
  if (config.downstands) {
    if (config.downstands.heightMm) params.set('dh', config.downstands.heightMm.toString());
    const df = [
      config.downstands.front ? '1' : '0',
      config.downstands.left ? '1' : '0',
      config.downstands.right ? '1' : '0',
    ].join('');
    if (df !== '111') params.set('df', df);
  }

  // Upstands
  if (config.upstands && config.upstands.type !== 'none') {
    params.set('ut', config.upstands.type);
    if (config.upstands.heightMm) params.set('uh', config.upstands.heightMm.toString());
  }

  // Corners
  if (config.cornerLeft && config.cornerLeft.type !== 'sharp') {
    params.set('cl', `${config.cornerLeft.type}_${config.cornerLeft.radiusMm || 0}_${config.cornerLeft.chamferMm || 0}`);
  }
  if (config.cornerRight && config.cornerRight.type !== 'sharp') {
    params.set('cr', `${config.cornerRight.type}_${config.cornerRight.radiusMm || 0}_${config.cornerRight.chamferMm || 0}`);
  }

  return params.toString();
}

/**
 * Decodes URL search parameters into a full ProductConfiguration object,
 * merging on top of the preset defaults.
 */
export function decodeUrlParamsToConfig(searchParams: URLSearchParams | { [key: string]: string | undefined }): Partial<ProductConfiguration> | null {
  const getParam = (key: string): string | null => {
    if (searchParams instanceof URLSearchParams) {
      return searchParams.get(key);
    }
    return searchParams[key] || null;
  };

  const presetId = getParam('p') || getParam('preset');
  const widthStr = getParam('w') || getParam('width');
  const depthStr = getParam('d') || getParam('depth');
  const thickStr = getParam('t') || getParam('thickness');
  const matSlug = getParam('m') || getParam('material');

  // If no dimensions are encoded, return null
  if (!widthStr && !presetId) return null;

  const result: Partial<ProductConfiguration> = {};

  if (presetId) result.presetId = presetId;
  if (widthStr) result.width = parseInt(widthStr, 10);
  if (depthStr) result.depth = parseInt(depthStr, 10);
  if (thickStr) result.thickness = parseInt(thickStr, 10) as any;

  if (matSlug) {
    result.materialSlug = matSlug;
    const foundMat = CONFIGURATOR_MATERIALS.find(m => m.slug === matSlug);
    if (foundMat) {
      result.materialName = foundMat.name;
      result.materialHex = foundMat.hexColor;
      result.materialFinish = foundMat.finish;
    }
  }

  const basinId = getParam('b');
  if (basinId) result.basinModelId = basinId;

  const basinPlace = getParam('bp');
  if (basinPlace) result.basinPlacement = basinPlace as any;

  const sinkInt = getParam('si');
  if (sinkInt) result.sinkIntegration = sinkInt as any;

  const basinOffset = getParam('bo');
  if (basinOffset) result.basinOffsetMm = parseInt(basinOffset, 10);

  const tapLoc = getParam('tl');
  if (tapLoc) result.tapLocation = tapLoc as any;

  const tapH = getParam('th');
  if (tapH) result.tapHoles = parseInt(tapH, 10) as any;

  // Downstands
  const downstandH = getParam('dh');
  const downstandSides = getParam('df');
  if (downstandH || downstandSides) {
    const front = downstandSides ? downstandSides[0] === '1' : true;
    const left = downstandSides ? downstandSides[1] === '1' : true;
    const right = downstandSides ? downstandSides[2] === '1' : true;
    const heightMm = downstandH ? parseInt(downstandH, 10) : 150;
    result.downstands = {
      front,
      left,
      right,
      heightMm,
    };
    result.frontApronHeight = front ? heightMm : 0;
    result.hasLeftApron = left;
    result.hasRightApron = right;
  }

  // Upstands
  const upstandType = getParam('ut');
  const upstandH = getParam('uh');
  if (upstandType) {
    const heightMm = upstandH ? parseInt(upstandH, 10) : 100;
    result.upstands = {
      type: upstandType as any,
      heightMm,
      isCoved: true,
      backMode: 'full',
      backLengthMm: result.width || 1200,
      leftMode: 'none',
      leftLengthMm: 0,
      rightMode: 'none',
      rightLengthMm: 0,
    };
    result.rearUpstandHeight = heightMm;
    result.hasLeftUpstand = false;
    result.hasRightUpstand = false;
    result.isCovedUpstand = true;
  }

  return result;
}
