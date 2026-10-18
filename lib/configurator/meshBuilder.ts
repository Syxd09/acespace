import { ProductConfiguration } from '@/data/configuratorData';

export interface ProceduralMeshData {
  positions: Float32Array; // 3 floats per vertex (in meters)
  normals: Float32Array;   // 3 floats per normal
  colors: Float32Array;    // 4 floats per vertex [r, g, b, isCustom]
  indices: Uint16Array;    // 3 indices per triangle
  colorRgb?: [number, number, number]; // [r, g, b] 0..1
  name?: string;
}

interface BasinSpec {
  id: string;
  width: number;
  depth: number;
  height: number;
  shape: 'oval' | 'round' | 'rectangular' | 'sloped' | 'capsule' | 'none' | 'soft-rect' | 'ub-sloped' | 'uc-sloped' | 'wdt-sloped';
  covedRadius: number;
}

function resolveBasinSpec(modelId?: string, cfg?: ProductConfiguration): BasinSpec {
  let spec: BasinSpec;
  switch (modelId) {
    case 'RO':
    case 'round-bowl':
      spec = { id: 'round-bowl', width: 0.42, depth: 0.42, height: 0.135, shape: 'round', covedRadius: 0.012 };
      break;
    case 'OV':
    case 'coved-oval':
      spec = { id: 'coved-oval', width: 0.50, depth: 0.35, height: 0.14, shape: 'oval', covedRadius: 0.012 };
      break;
    case 'A':
    case 'coved-rect':
      spec = { id: 'coved-rect', width: 0.50, depth: 0.35, height: 0.135, shape: 'rectangular', covedRadius: 0.015 };
      break;
    case 'B':
    case 'crisp-rect':
      spec = { id: 'crisp-rect', width: 0.52, depth: 0.35, height: 0.13, shape: 'soft-rect', covedRadius: 0.035 };
      break;
    case 'DB':
    case 'double-basin':
      spec = { id: 'double-basin', width: 0.56, depth: 0.36, height: 0.135, shape: 'oval', covedRadius: 0.014 };
      break;
    case 'UB':
    case 'undermount-box':
      spec = { id: 'undermount-box', width: 0.50, depth: 0.35, height: 0.14, shape: 'ub-sloped', covedRadius: 0.008 };
      break;
    case 'UC':
    case 'undermount-channel':
      spec = { id: 'undermount-channel', width: 0.58, depth: 0.36, height: 0.12, shape: 'uc-sloped', covedRadius: 0.010 };
      break;
    case 'WDT':
    case 'washdesk-trough':
      spec = { id: 'washdesk-trough', width: 0.60, depth: 0.26, height: 0.12, shape: 'wdt-sloped', covedRadius: 0.008 };
      break;
    case 'linear-trough':
      spec = { id: 'linear-trough', width: 0.60, depth: 0.36, height: 0.12, shape: 'sloped', covedRadius: 0.008 };
      break;
    case 'capsule-pill':
      spec = { id: 'capsule-pill', width: 0.50, depth: 0.32, height: 0.135, shape: 'capsule', covedRadius: 0.014 };
      break;
    case 'none':
      return { id: 'none', width: 0, depth: 0, height: 0, shape: 'none', covedRadius: 0 };
    default:
      spec = { id: 'coved-oval', width: 0.50, depth: 0.35, height: 0.14, shape: 'oval', covedRadius: 0.012 };
      break;
  }

  // Override with user's customized sink width, depth, and height from UI
  if (cfg) {
    if (cfg.basinWidthMm && cfg.basinWidthMm > 0) spec.width = cfg.basinWidthMm / 1000;
    if (cfg.basinDepthMm && cfg.basinDepthMm > 0) spec.depth = cfg.basinDepthMm / 1000;
    if (cfg.basinHeightMm && cfg.basinHeightMm > 0) spec.height = cfg.basinHeightMm / 1000;
  }

  return spec;
}

/**
 * Builds complete metric 3D mesh geometry for solid surface architectural products.
 * Metric scale: 1.0 unit = 1.0 meter (1000mm).
 */
export function buildProductMesh(cfg: ProductConfiguration): ProceduralMeshData {
  const verts: number[] = [];
  const norms: number[] = [];
  const colors: number[] = [];
  const indices: number[] = [];

  // Material & Detail Color Tokens
  const COLOR_DEFAULT: [number, number, number, number] = [1.0, 1.0, 1.0, 0.0];      // Uses stone uColor
  const COLOR_SHADOW: [number, number, number, number] = [0.89, 0.89, 0.89, 0.0];      // Ambient occlusion inside basin
  const COLOR_CHROME: [number, number, number, number] = [0.86, 0.89, 0.93, 1.0];      // Metallic polished chrome
  const COLOR_STOPPER: [number, number, number, number] = [0.93, 0.95, 0.98, 1.0];     // Pop-up stopper cap
  const COLOR_DARK_HOLE: [number, number, number, number] = [0.06, 0.07, 0.08, 1.0];   // Deep dark recessed drain throat
  const COLOR_PULL_RING: [number, number, number, number] = [0.80, 0.82, 0.86, 1.0];   // Ring-pull loop
  const COLOR_TAPWARE: [number, number, number, number] = [0.84, 0.86, 0.90, 1.0];     // Brushed chrome tapware

  // Dimensions in meters (1000mm = 1.0m)
  const W = cfg.width / 1000;
  const D = cfg.depth / 1000;
  const T = cfg.thickness / 1000;

  // Upstands & Wall Splashbacks (Supports Standard 80mm lip, Custom full height & side returns)
  const isBackDisabled = cfg.upstands?.backMode === 'none';
  const isStdUpstand = !isBackDisabled && cfg.upstands?.backMode === 'standard';
  const defaultCustomH = 150;
  const configuredH = (cfg.upstands?.heightMm && cfg.upstands.heightMm > 0)
    ? cfg.upstands.heightMm
    : (cfg.upstands?.height && cfg.upstands.height > 0)
    ? cfg.upstands.height
    : (cfg.rearUpstandHeight && cfg.rearUpstandHeight > 0)
    ? cfg.rearUpstandHeight
    : defaultCustomH;

  const rawUpstandH = isBackDisabled ? 0 : isStdUpstand ? 80 : configuredH;
  const upstandH = rawUpstandH / 1000;
  const hasBackUpstand = !isBackDisabled && upstandH > 0;
  const sideUpstandH = (configuredH > 0 ? configuredH : 80) / 1000;
  const effectiveUpstandH = hasBackUpstand ? upstandH : sideUpstandH;

  const hasLeftUpstand = (cfg.upstands?.leftMode === 'full' || (cfg.upstands?.leftLengthMm ?? 0) > 0 || Boolean(cfg.hasLeftUpstand)) && (effectiveUpstandH > 0);
  const hasRightUpstand = (cfg.upstands?.rightMode === 'full' || (cfg.upstands?.rightLengthMm ?? 0) > 0 || Boolean(cfg.hasRightUpstand)) && (effectiveUpstandH > 0);

  // Downstands & Aprons
  const downstandH = (cfg.downstands?.heightMm ?? cfg.frontApronHeight ?? 0) / 1000;
  const hasFrontDownstand = cfg.downstands?.front ?? (downstandH > 0);
  const hasLeftDownstand = cfg.downstands?.left ?? cfg.hasLeftApron;
  const hasRightDownstand = cfg.downstands?.right ?? cfg.hasRightApron;

  // Corner Profiles
  const leftCornerType = cfg.cornerLeft?.type || cfg.cornerConfig?.leftType || 'sharp';
  const rightCornerType = cfg.cornerRight?.type || cfg.cornerConfig?.rightType || 'sharp';

  const leftShift = (leftCornerType === 'shift' ? (cfg.cornerLeft?.shiftMm || cfg.cornerConfig?.leftShift || 50) : 0) / 1000;
  const rightShift = (rightCornerType === 'shift' ? (cfg.cornerRight?.shiftMm || cfg.cornerConfig?.rightShift || 50) : 0) / 1000;

  const leftFilletR = leftCornerType === 'fillet' ? Math.min((cfg.cornerLeft?.radiusMm || cfg.cornerConfig?.leftRadius || 25) / 1000, 0.12) : 0;
  const leftChamferC = leftCornerType === 'chamfer' ? Math.min((cfg.cornerLeft?.chamferMm || cfg.cornerConfig?.leftChamfer || 20) / 1000, 0.10) : 0;

  const rightFilletR = rightCornerType === 'fillet' ? Math.min((cfg.cornerRight?.radiusMm || cfg.cornerConfig?.rightRadius || 25) / 1000, 0.12) : 0;
  const rightChamferC = rightCornerType === 'chamfer' ? Math.min((cfg.cornerRight?.chamferMm || cfg.cornerConfig?.rightChamfer || 20) / 1000, 0.10) : 0;

  const leftX = -(W / 2) + Math.max(0, leftShift);
  const rightX = (W / 2) - Math.max(0, rightShift);
  const halfD = D / 2;
  const topY = 0;
  const bottomDeckY = topY - T;

  // Helpers: Geometry Primitives
  const pushQuad = (
    p1: [number, number, number],
    p2: [number, number, number],
    p3: [number, number, number],
    p4: [number, number, number],
    n: [number, number, number],
    c: [number, number, number, number] = COLOR_DEFAULT
  ) => {
    const idx = verts.length / 3;
    verts.push(...p1, ...p2, ...p3, ...p4);
    norms.push(...n, ...n, ...n, ...n);
    colors.push(...c, ...c, ...c, ...c);
    indices.push(idx, idx + 1, idx + 2, idx, idx + 2, idx + 3);
  };

  const pushQuadSmooth = (
    p1: [number, number, number],
    p2: [number, number, number],
    p3: [number, number, number],
    p4: [number, number, number],
    n1: [number, number, number],
    n2: [number, number, number],
    n3: [number, number, number],
    n4: [number, number, number],
    c: [number, number, number, number] = COLOR_DEFAULT
  ) => {
    const idx = verts.length / 3;
    verts.push(...p1, ...p2, ...p3, ...p4);
    norms.push(...n1, ...n2, ...n3, ...n4);
    colors.push(...c, ...c, ...c, ...c);
    indices.push(idx, idx + 1, idx + 2, idx, idx + 2, idx + 3);
  };

  const pushTri = (
    p1: [number, number, number],
    p2: [number, number, number],
    p3: [number, number, number],
    n: [number, number, number],
    c: [number, number, number, number] = COLOR_DEFAULT
  ) => {
    const idx = verts.length / 3;
    verts.push(...p1, ...p2, ...p3);
    norms.push(...n, ...n, ...n);
    colors.push(...c, ...c, ...c);
    indices.push(idx, idx + 1, idx + 2);
  };

  const pushBox = (
    minX: number, minY: number, minZ: number,
    maxX: number, maxY: number, maxZ: number,
    c: [number, number, number, number] = COLOR_DEFAULT
  ) => {
    if (minX >= maxX || minY >= maxY || minZ >= maxZ) return;
    // Top face (+Y)
    pushQuad([minX, maxY, maxZ], [maxX, maxY, maxZ], [maxX, maxY, minZ], [minX, maxY, minZ], [0, 1, 0], c);
    // Bottom face (-Y)
    pushQuad([minX, minY, minZ], [maxX, minY, minZ], [maxX, minY, maxZ], [minX, minY, maxZ], [0, -1, 0], c);
    // Front face (+Z)
    pushQuad([minX, minY, maxZ], [maxX, minY, maxZ], [maxX, maxY, maxZ], [minX, maxY, maxZ], [0, 0, 1], c);
    // Rear face (-Z)
    pushQuad([maxX, minY, minZ], [minX, minY, minZ], [minX, maxY, minZ], [maxX, maxY, minZ], [0, 0, -1], c);
    // Left face (-X)
    pushQuad([minX, minY, minZ], [minX, minY, maxZ], [minX, maxY, maxZ], [minX, maxY, minZ], [-1, 0, 0], c);
    // Right face (+X)
    pushQuad([maxX, minY, maxZ], [maxX, minY, minZ], [maxX, maxY, minZ], [maxX, maxY, maxZ], [1, 0, 0], c);
  };

  // Cylinder Helper (used for tapware & nozzles)
  const pushCylinder = (
    baseCenter: [number, number, number],
    axis: 'x' | 'y' | 'z',
    length: number,
    radius: number,
    segs = 16,
    c: [number, number, number, number] = COLOR_DEFAULT
  ) => {
    const [bx, by, bz] = baseCenter;
    for (let i = 0; i < segs; i++) {
      const a1 = (i / segs) * Math.PI * 2;
      const a2 = ((i + 1) / segs) * Math.PI * 2;
      const c1 = Math.cos(a1);
      const s1 = Math.sin(a1);
      const c2 = Math.cos(a2);
      const s2 = Math.sin(a2);

      if (axis === 'z') {
        const p1: [number, number, number] = [bx + c1 * radius, by + s1 * radius, bz];
        const p2: [number, number, number] = [bx + c2 * radius, by + s2 * radius, bz];
        const p3: [number, number, number] = [bx + c2 * radius, by + s2 * radius, bz + length];
        const p4: [number, number, number] = [bx + c1 * radius, by + s1 * radius, bz + length];
        pushQuadSmooth(p1, p2, p3, p4, [c1, s1, 0], [c2, s2, 0], [c2, s2, 0], [c1, s1, 0], c);
      } else if (axis === 'y') {
        const p1: [number, number, number] = [bx + c1 * radius, by, bz + s1 * radius];
        const p2: [number, number, number] = [bx + c2 * radius, by, bz + s2 * radius];
        const p3: [number, number, number] = [bx + c2 * radius, by + length, bz + s2 * radius];
        const p4: [number, number, number] = [bx + c1 * radius, by + length, bz + s1 * radius];
        pushQuadSmooth(p1, p2, p3, p4, [c1, 0, s1], [c2, 0, s2], [c2, 0, s2], [c1, 0, s1], c);
      } else {
        const p1: [number, number, number] = [bx, by + c1 * radius, bz + s1 * radius];
        const p2: [number, number, number] = [bx, by + c2 * radius, bz + s2 * radius];
        const p3: [number, number, number] = [bx + length, by + c2 * radius, bz + s2 * radius];
        const p4: [number, number, number] = [bx + length, by + c1 * radius, bz + s1 * radius];
        pushQuadSmooth(p1, p2, p3, p4, [0, c1, s1], [0, c2, s2], [0, c2, s2], [0, c1, s1], c);
      }
    }
  };

  /**
   * Helper: Push Detailed Architectural Pop-Up Sink Drain Waste Fitting (Images 1, 2, 3, 5)
   * Features:
   * 1. Polished chrome beveled outer bezel flange (76mm diameter)
   * 2. Recessed dark annular drainage well / throat gap
   * 3. Chrome circular pop-up stopper plug cap (50mm diameter)
   * 4. Metallic plug ring-pull loop resting on plug (Images 3 & 5)
   * 5. Underside cylindrical drain boss collar & tailpiece (Image 2)
   */
  /**
   * Helper: Push Detailed Architectural Pop-Up Sink Drain Waste Fitting (Images 1, 2, 3, 5)
   * Features:
   * 1. Polished chrome beveled outer bezel flange (76mm diameter)
   * 2. Recessed dark annular drainage well / throat gap
   * 3. Chrome circular pop-up stopper plug cap (50mm diameter)
   * 4. Metallic plug ring-pull loop resting on plug (Images 3 & 5)
   * 5. Underside cylindrical drain boss collar & tailpiece (Image 2)
   */
  const pushDetailedSinkDrain = (
    drainX: number,
    drainY: number,
    drainZ = 0,
    underY?: number,
    isVessel = false
  ) => {
    const drainType = cfg.drainOption || cfg.drainTypeId || 'click-clack-chrome';
    const segs = 32;
    const rBezelOut = 0.038; // 76mm outer flange
    const rBezelIn = 0.029;  // 58mm inner rim
    const bezelH = 0.003;    // 3mm slight elevation
    const throatDepth = 0.010; // 10mm recessed dark well

    // 1. Polished Chrome Beveled Outer Bezel Ring (for all except concealed corian slit)
    if (drainType !== 'freeflow-corian') {
      for (let i = 0; i < segs; i++) {
        const a1 = (i / segs) * Math.PI * 2;
        const a2 = ((i + 1) / segs) * Math.PI * 2;
        const c1 = Math.cos(a1);
        const s1 = Math.sin(a1);
        const c2 = Math.cos(a2);
        const s2 = Math.sin(a2);

        // Beveled 45° chrome outer rim
        const pb1: [number, number, number] = [drainX + rBezelOut * c1, drainY, drainZ + rBezelOut * s1];
        const pb2: [number, number, number] = [drainX + rBezelOut * c2, drainY, drainZ + rBezelOut * s2];
        const pb3: [number, number, number] = [drainX + rBezelIn * c2, drainY + bezelH, drainZ + rBezelIn * s2];
        const pb4: [number, number, number] = [drainX + rBezelIn * c1, drainY + bezelH, drainZ + rBezelIn * s1];

        const nb1: [number, number, number] = [c1 * 0.707, 0.707, s1 * 0.707];
        const nb2: [number, number, number] = [c2 * 0.707, 0.707, s2 * 0.707];
        pushQuadSmooth(pb1, pb2, pb3, pb4, nb1, nb2, nb2, nb1, COLOR_CHROME);

        // Recessed Dark Annular Drainage Throat Well
        const pw1: [number, number, number] = [drainX + rBezelIn * c1, drainY + bezelH, drainZ + rBezelIn * s1];
        const pw2: [number, number, number] = [drainX + rBezelIn * c2, drainY + bezelH, drainZ + rBezelIn * s2];
        const pw3: [number, number, number] = [drainX + rBezelIn * c2, drainY - throatDepth, drainZ + rBezelIn * s2];
        const pw4: [number, number, number] = [drainX + rBezelIn * c1, drainY - throatDepth, drainZ + rBezelIn * s1];
        pushQuad(pw1, pw2, pw3, pw4, [-c1, 0, -s1], COLOR_DARK_HOLE);

        // Well bottom shelf
        const pt1: [number, number, number] = [drainX + rBezelIn * c1, drainY - throatDepth, drainZ + rBezelIn * s1];
        const pt2: [number, number, number] = [drainX + rBezelIn * c2, drainY - throatDepth, drainZ + rBezelIn * s2];
        const pt3: [number, number, number] = [drainX, drainY - throatDepth, drainZ];
        pushTri(pt3, pt1, pt2, [0, 1, 0], COLOR_DARK_HOLE);
      }
    }

    // -----------------------------------------------------------
    // DRAIN HARDWARE MECHANISMS BASED ON drainType
    // -----------------------------------------------------------

    // OPTION 1: Click-Clack Pop-Up (Polished Chrome)
    if (drainType === 'click-clack-chrome') {
      const rPlug = 0.026;
      const popUpY = drainY + 0.005; // Elevated pop-up position
      for (let i = 0; i < segs; i++) {
        const a1 = (i / segs) * Math.PI * 2;
        const a2 = ((i + 1) / segs) * Math.PI * 2;
        const c1 = Math.cos(a1);
        const s1 = Math.sin(a1);
        const c2 = Math.cos(a2);
        const s2 = Math.sin(a2);

        // Chrome Stopper Dome Disc
        const pp1: [number, number, number] = [drainX + rPlug * c1, popUpY, drainZ + rPlug * s1];
        const pp2: [number, number, number] = [drainX + rPlug * c2, popUpY, drainZ + rPlug * s2];
        const pCenter: [number, number, number] = [drainX, popUpY + 0.002, drainZ];
        pushTri(pCenter, pp1, pp2, [0, 1, 0], COLOR_CHROME);

        // Stopper beveled lip rim
        const pLip1: [number, number, number] = [drainX + rPlug * c1, popUpY - 0.002, drainZ + rPlug * s1];
        const pLip2: [number, number, number] = [drainX + rPlug * c2, popUpY - 0.002, drainZ + rPlug * s2];
        pushQuad(pLip1, pLip2, pp2, pp1, [c1, 0, s1], COLOR_CHROME);
      }
      // Central brass spring post
      pushCylinder([drainX, drainY - throatDepth, drainZ], 'y', throatDepth + 0.005, 0.006, 12, COLOR_CHROME);
    }

    // OPTION 2: Click-Clack Pop-Up (Matching Corian® Cap)
    else if (drainType === 'click-clack-corian') {
      const rPlug = 0.026;
      const popUpY = drainY + 0.005;
      for (let i = 0; i < segs; i++) {
        const a1 = (i / segs) * Math.PI * 2;
        const a2 = ((i + 1) / segs) * Math.PI * 2;
        const c1 = Math.cos(a1);
        const s1 = Math.sin(a1);
        const c2 = Math.cos(a2);
        const s2 = Math.sin(a2);

        // Matching Corian® solid surface stopper disc
        const pp1: [number, number, number] = [drainX + rPlug * c1, popUpY, drainZ + rPlug * s1];
        const pp2: [number, number, number] = [drainX + rPlug * c2, popUpY, drainZ + rPlug * s2];
        const pCenter: [number, number, number] = [drainX, popUpY + 0.001, drainZ];
        pushTri(pCenter, pp1, pp2, [0, 1, 0], COLOR_DEFAULT);

        // Rounded Corian disc rim
        const pLip1: [number, number, number] = [drainX + rPlug * c1, popUpY - 0.003, drainZ + rPlug * s1];
        const pLip2: [number, number, number] = [drainX + rPlug * c2, popUpY - 0.003, drainZ + rPlug * s2];
        pushQuad(pLip1, pLip2, pp2, pp1, [c1, 0, s1], COLOR_DEFAULT);
      }
      // Sub-cap mechanical stem
      pushCylinder([drainX, drainY - throatDepth, drainZ], 'y', throatDepth + 0.005, 0.006, 12, COLOR_CHROME);
    }

    // OPTION 3: Architectural Slotted Free-Flow Grate (Stainless Steel Grille)
    else if (drainType === 'freeflow-chrome') {
      const grateY = drainY + bezelH;
      const rGrate = rBezelIn;
      const rHub = 0.008; // Central solid hub

      // Central solid hub disc
      for (let i = 0; i < 16; i++) {
        const a1 = (i / 16) * Math.PI * 2;
        const a2 = ((i + 1) / 16) * Math.PI * 2;
        const ph1: [number, number, number] = [drainX + rHub * Math.cos(a1), grateY, drainZ + rHub * Math.sin(a1)];
        const ph2: [number, number, number] = [drainX + rHub * Math.cos(a2), grateY, drainZ + rHub * Math.sin(a2)];
        pushTri([drainX, grateY, drainZ], ph1, ph2, [0, 1, 0], COLOR_CHROME);
      }

      // 8 Radial Stainless Steel Grate Spokes with open drainage slits
      const spokes = 8;
      const spokeHalfW = 0.0022; // 4.4mm wide chrome bars
      for (let s = 0; s < spokes; s++) {
        const ang = (s / spokes) * Math.PI * 2;
        const cosA = Math.cos(ang);
        const sinA = Math.sin(ang);
        const perpX = -sinA * spokeHalfW;
        const perpZ = cosA * spokeHalfW;

        const p1: [number, number, number] = [drainX + rHub * cosA + perpX, grateY, drainZ + rHub * sinA + perpZ];
        const p2: [number, number, number] = [drainX + rGrate * cosA + perpX, grateY, drainZ + rGrate * sinA + perpZ];
        const p3: [number, number, number] = [drainX + rGrate * cosA - perpX, grateY, drainZ + rGrate * sinA - perpZ];
        const p4: [number, number, number] = [drainX + rHub * cosA - perpX, grateY, drainZ + rHub * sinA - perpZ];

        pushQuad(p1, p2, p3, p4, [0, 1, 0], COLOR_CHROME);
      }

      // Concentric structural reinforcement ring
      const rMidRing = (rHub + rGrate) * 0.55;
      const ringW = 0.002;
      for (let i = 0; i < 24; i++) {
        const a1 = (i / 24) * Math.PI * 2;
        const a2 = ((i + 1) / 24) * Math.PI * 2;
        const pr1: [number, number, number] = [drainX + (rMidRing - ringW) * Math.cos(a1), grateY, drainZ + (rMidRing - ringW) * Math.sin(a1)];
        const pr2: [number, number, number] = [drainX + (rMidRing - ringW) * Math.cos(a2), grateY, drainZ + (rMidRing - ringW) * Math.sin(a2)];
        const pr3: [number, number, number] = [drainX + (rMidRing + ringW) * Math.cos(a2), grateY, drainZ + (rMidRing + ringW) * Math.sin(a2)];
        const pr4: [number, number, number] = [drainX + (rMidRing + ringW) * Math.cos(a1), grateY, drainZ + (rMidRing + ringW) * Math.sin(a1)];
        pushQuad(pr1, pr2, pr3, pr4, [0, 1, 0], COLOR_CHROME);
      }
    }

    // OPTION 4: Corian® Hidden Continuous Flow Slit (Concealed Drain Cover)
    else if (drainType === 'freeflow-corian') {
      const plateSize = 0.065; // 65mm x 65mm architectural square Corian plate
      const wellSize = 0.075;  // 75mm x 75mm recessed drainage trench well
      const halfP = plateSize / 2;
      const halfW = wellSize / 2;
      const plateY = drainY + 0.002;
      const slitDepth = 0.012;

      // Dark perimeter well trench
      pushBox(drainX - halfW, drainY - slitDepth, drainZ - halfW, drainX + halfW, drainY, drainZ + halfW, COLOR_DARK_HOLE);

      // Seamless Matching Corian® Cover Insert Plate floating over the well
      pushBox(drainX - halfP, plateY - 0.006, drainZ - halfP, drainX + halfP, plateY, drainZ + halfP, COLOR_DEFAULT);
    }

    // OPTION 5: Classic Bead-Chain & Rubber Stopper
    else if (drainType === 'rubber-plug') {
      const rPlug = 0.026;
      const plugY = drainY + 0.002;

      // Heavy-duty black rubber stopper plug seated tightly in drain throat
      for (let i = 0; i < segs; i++) {
        const a1 = (i / segs) * Math.PI * 2;
        const a2 = ((i + 1) / segs) * Math.PI * 2;
        const c1 = Math.cos(a1);
        const s1 = Math.sin(a1);
        const c2 = Math.cos(a2);
        const s2 = Math.sin(a2);

        const pp1: [number, number, number] = [drainX + rPlug * c1, plugY, drainZ + rPlug * s1];
        const pp2: [number, number, number] = [drainX + rPlug * c2, plugY, drainZ + rPlug * s2];
        const pCenter: [number, number, number] = [drainX, plugY, drainZ];
        pushTri(pCenter, pp1, pp2, [0, 1, 0], COLOR_DARK_HOLE);
      }

      // Chrome central eyelet post
      pushCylinder([drainX, plugY, drainZ], 'y', 0.008, 0.004, 10, COLOR_CHROME);

      // Chrome triangular pull ring on top of the rubber plug
      const ringR = 0.011;
      const ringTilt = 0.35;
      for (let i = 0; i < 16; i++) {
        const a1 = (i / 16) * Math.PI * 2;
        const a2 = ((i + 1) / 16) * Math.PI * 2;
        const rx1 = drainX + ringR * Math.cos(a1);
        const rz1 = drainZ + ringR * Math.sin(a1) * Math.cos(ringTilt);
        const ry1 = plugY + 0.008 + ringR * Math.sin(a1) * Math.sin(ringTilt);
        const rx2 = drainX + ringR * Math.cos(a2);
        const rz2 = drainZ + ringR * Math.sin(a2) * Math.cos(ringTilt);
        const ry2 = plugY + 0.008 + ringR * Math.sin(a2) * Math.sin(ringTilt);
        pushQuad([rx1, ry1 - 0.0012, rz1], [rx2, ry2 - 0.0012, rz2], [rx2, ry2 + 0.0012, rz2], [rx1, ry1 + 0.0012, rz1], [0, 1, 0], COLOR_CHROME);
      }

      // Stainless steel beaded ball-chain draping gracefully across the basin floor
      const chainBeads = 12;
      for (let b = 0; b < chainBeads; b++) {
        const t = b / chainBeads;
        // Curve draping forward-right across the bowl floor
        const cx = drainX + 0.08 * t + 0.03 * Math.sin(t * Math.PI);
        const cz = drainZ + 0.09 * Math.pow(t, 1.2);
        const cy = drainY + 0.003 * Math.sin(t * Math.PI * 0.5) + 0.002;
        pushBox(cx - 0.0018, cy, cz - 0.0018, cx + 0.0018, cy + 0.0036, cz + 0.0018, COLOR_CHROME);
      }
    }

    // 5. Underside Cylindrical Drain Boss & Metallic Tailpiece (Image 2)
    if (!isVessel && underY !== undefined) {
      const bossR = 0.038; // 76mm cylindrical boss
      const bossH = 0.016; // 16mm protrusion downward
      const tailR = 0.030; // 60mm chrome tailpiece
      const holeR = 0.022; // 44mm central waste opening

      // Cylindrical Boss Wall (Solid surface downward drop)
      pushCylinder([drainX, underY - bossH, drainZ], 'y', bossH, bossR, segs, COLOR_DEFAULT);

      // Boss bottom ring shelf
      for (let i = 0; i < segs; i++) {
        const a1 = (i / segs) * Math.PI * 2;
        const a2 = ((i + 1) / segs) * Math.PI * 2;
        const c1 = Math.cos(a1);
        const s1 = Math.sin(a1);
        const c2 = Math.cos(a2);
        const s2 = Math.sin(a2);

        const p1: [number, number, number] = [drainX + bossR * c1, underY - bossH, drainZ + bossR * s1];
        const p2: [number, number, number] = [drainX + bossR * c2, underY - bossH, drainZ + bossR * s2];
        const p3: [number, number, number] = [drainX + tailR * c2, underY - bossH, drainZ + tailR * s2];
        const p4: [number, number, number] = [drainX + tailR * c1, underY - bossH, drainZ + tailR * s1];
        pushQuad(p1, p2, p3, p4, [0, -1, 0], COLOR_DEFAULT);
      }

      // Chrome Tailpiece Ring Dropping Below Boss
      pushCylinder([drainX, underY - bossH - 0.005, drainZ], 'y', 0.005, tailR, segs, COLOR_CHROME);

      // Hollow Central Waste Outlet Orifice
      for (let i = 0; i < segs; i++) {
        const a1 = (i / segs) * Math.PI * 2;
        const a2 = ((i + 1) / segs) * Math.PI * 2;
        const c1 = Math.cos(a1);
        const s1 = Math.sin(a1);
        const c2 = Math.cos(a2);
        const s2 = Math.sin(a2);

        const pt1: [number, number, number] = [drainX + tailR * c1, underY - bossH - 0.005, drainZ + tailR * s1];
        const pt2: [number, number, number] = [drainX + tailR * c2, underY - bossH - 0.005, drainZ + tailR * s2];
        const ph2: [number, number, number] = [drainX + holeR * c2, underY - bossH - 0.005, drainZ + holeR * s2];
        const ph1: [number, number, number] = [drainX + holeR * c1, underY - bossH - 0.005, drainZ + holeR * s1];
        pushQuad(pt1, pt2, ph2, ph1, [0, -1, 0], COLOR_DARK_HOLE);
      }
    }
  };


  // Basin Spec & Integration state
  const basinSpec = resolveBasinSpec(cfg.basinModelId, cfg);
  const isNoBasin = cfg.basinModelId === 'none' || cfg.basinPlacement === 'none' || cfg.sinkIntegration === 'none' || basinSpec.shape === 'none';
  const isVesselOnDeck = cfg.sinkIntegration === 'undermount'; // "ON" = Sit-On Freestanding Vessel on Deck
  const isTopMount = cfg.sinkIntegration === 'topmount'; // "TOP" = Top-Mount Semi-Inset with collar on deck & bowl recessed below
  const isStraightDrum = cfg.sinkIntegration === 'undermount'; // "ON" sits on deck as a freestanding washbowl

  // Basin center X
  const deckMidX = (leftX + rightX) / 2;
  const availableHalfW = (rightX - leftX) / 2;
  const bX = cfg.basinPlacement === 'left'
    ? deckMidX - availableHalfW * 0.42
    : cfg.basinPlacement === 'right'
    ? deckMidX + availableHalfW * 0.42
    : deckMidX;

  // -------------------------------------------------------------
  // Top Edge Profile Finishing Parameters (Chamfer / Fillet on perimeter)
  // -------------------------------------------------------------
  const topEdgeType = cfg.topEdge?.type || (cfg.edgeProfileId === 'rounded' ? 'fillet' : cfg.edgeProfileId) || 'sharp';
  let edgeOffset = 0;
  if (topEdgeType === 'chamfer') {
    const chamferMm = cfg.topEdge?.chamferMm ?? (cfg.edgeProfileId === 'chamfer' ? 3 : 2);
    edgeOffset = Math.min(Math.max(1, chamferMm) / 1000, T);
  } else if (topEdgeType === 'fillet') {
    const radiusMm = cfg.topEdge?.radiusMm ?? (cfg.edgeProfileId === 'rounded' ? 6 : 4);
    edgeOffset = Math.min(Math.max(1, radiusMm) / 1000, T);
  }

  const deckFrontZ = halfD - edgeOffset;
  const fasciaTopY = topY - edgeOffset;

  // Basin center Z - safely position basin to guarantee deck bridge clearance for tapware
  const rz = basinSpec.depth / 2;
  const hasTopTap = cfg.tapLocation === 'top-mounted' && (cfg.tapHoles ?? 1) > 0;
  const upstandThick = hasBackUpstand ? 0.015 : 0;
  const rearObstacleZ = -halfD + upstandThick;

  let bZ = 0;
  if (!isNoBasin) {
    if (hasTopTap) {
      // Tap clearance: 30mm obstacle-to-tap, 35mm hole dia, 25mm tap-to-basin rim
      const minRearBridge = 0.090;
      const minCenterZ = rearObstacleZ + minRearBridge + rz;
      const maxCenterZ = deckFrontZ - 0.035 - rz;
      if (minCenterZ <= maxCenterZ) {
        bZ = Math.max(0, minCenterZ);
      } else {
        bZ = Math.max(0, (rearObstacleZ + minRearBridge + deckFrontZ - 0.035) / 2);
      }
    } else {
      const minCenterZ = rearObstacleZ + 0.035 + rz;
      const maxCenterZ = deckFrontZ - 0.035 - rz;
      bZ = Math.max(minCenterZ, Math.min(0, maxCenterZ));
    }
  }

  // -------------------------------------------------------------
  // 1. Deck Solid Surface Slab (Seamless Watertight Hull)
  // -------------------------------------------------------------
  const leftCornerExt = Math.max(leftFilletR, leftChamferC);
  const rightCornerExt = Math.max(rightFilletR, rightChamferC);

  // Main central deck body
  const deckInnerLeftX = leftX + leftCornerExt;
  const deckInnerRightX = rightX - rightCornerExt;

  // Helper: Front Edge Finish (45° Chamfer or Rounded Bullnose Arc)
  const pushFrontEdgeFinish = (xStart: number, xEnd: number) => {
    if (edgeOffset <= 0.0005) return;

    if (topEdgeType === 'chamfer') {
      const invSqrt2 = Math.SQRT1_2;
      pushQuad(
        [xStart, fasciaTopY, halfD],
        [xEnd, fasciaTopY, halfD],
        [xEnd, topY, deckFrontZ],
        [xStart, topY, deckFrontZ],
        [0, invSqrt2, invSqrt2],
        COLOR_DEFAULT
      );
    } else if (topEdgeType === 'fillet') {
      const arcSegs = 18;
      const cy = topY - edgeOffset;
      const cz = halfD - edgeOffset;
      const r = edgeOffset;

      for (let s = 0; s < arcSegs; s++) {
        const a1 = (Math.PI * 0.5) * (1 - s / arcSegs);
        const a2 = (Math.PI * 0.5) * (1 - (s + 1) / arcSegs);

        const y1 = cy + r * Math.sin(a1);
        const z1 = cz + r * Math.cos(a1);
        const y2 = cy + r * Math.sin(a2);
        const z2 = cz + r * Math.cos(a2);

        const n1: [number, number, number] = [0, Math.sin(a1), Math.cos(a1)];
        const n2: [number, number, number] = [0, Math.sin(a2), Math.cos(a2)];

        pushQuadSmooth(
          [xStart, y2, z2],
          [xEnd, y2, z2],
          [xEnd, y1, z1],
          [xStart, y1, z1],
          n2, n2, n1, n1,
          COLOR_DEFAULT
        );
      }
    }
  };

  // Helper: Watertight Side Face at leftX or rightX matching edge finish profile
  const pushSideFace = (sideX: number, isRight: boolean) => {
    const normalX = isRight ? 1 : -1;
    const nSide: [number, number, number] = [normalX, 0, 0];

    if (edgeOffset <= 0.0005) {
      if (isRight) {
        pushQuad([sideX, bottomDeckY, halfD], [sideX, bottomDeckY, -halfD], [sideX, topY, -halfD], [sideX, topY, halfD], nSide);
      } else {
        pushQuad([sideX, bottomDeckY, -halfD], [sideX, bottomDeckY, halfD], [sideX, topY, halfD], [sideX, topY, -halfD], nSide);
      }
      return;
    }

    // 1. Main rectangular quad behind deckFrontZ (from -halfD to deckFrontZ)
    if (isRight) {
      pushQuad([sideX, bottomDeckY, deckFrontZ], [sideX, bottomDeckY, -halfD], [sideX, topY, -halfD], [sideX, topY, deckFrontZ], nSide);
    } else {
      pushQuad([sideX, bottomDeckY, -halfD], [sideX, bottomDeckY, deckFrontZ], [sideX, topY, deckFrontZ], [sideX, topY, -halfD], nSide);
    }

    // 2. Lower rectangular quad below fasciaTopY between deckFrontZ and halfD
    if (fasciaTopY > bottomDeckY + 0.0005) {
      if (isRight) {
        pushQuad([sideX, bottomDeckY, halfD], [sideX, bottomDeckY, deckFrontZ], [sideX, fasciaTopY, deckFrontZ], [sideX, fasciaTopY, halfD], nSide);
      } else {
        pushQuad([sideX, bottomDeckY, deckFrontZ], [sideX, bottomDeckY, halfD], [sideX, fasciaTopY, halfD], [sideX, fasciaTopY, deckFrontZ], nSide);
      }
    }

    // 3. Profile corner cap
    if (topEdgeType === 'chamfer') {
      if (isRight) {
        pushTri([sideX, fasciaTopY, deckFrontZ], [sideX, topY, deckFrontZ], [sideX, fasciaTopY, halfD], nSide);
      } else {
        pushTri([sideX, fasciaTopY, deckFrontZ], [sideX, fasciaTopY, halfD], [sideX, topY, deckFrontZ], nSide);
      }
    } else if (topEdgeType === 'fillet') {
      const cy = topY - edgeOffset;
      const cz = halfD - edgeOffset;
      const r = edgeOffset;
      const arcSegs = 18;

      for (let s = 0; s < arcSegs; s++) {
        const a1 = (Math.PI * 0.5) * (1 - s / arcSegs);
        const a2 = (Math.PI * 0.5) * (1 - (s + 1) / arcSegs);

        const y1 = cy + r * Math.sin(a1);
        const z1 = cz + r * Math.cos(a1);
        const y2 = cy + r * Math.sin(a2);
        const z2 = cz + r * Math.cos(a2);

        if (isRight) {
          pushTri([sideX, cy, cz], [sideX, y1, z1], [sideX, y2, z2], nSide);
        } else {
          pushTri([sideX, cy, cz], [sideX, y2, z2], [sideX, y1, z1], nSide);
        }
      }
    }
  };

  // -------------------------------------------------------------
  // Watertight Deck Solid Surface Slab (Segmented Hull)
  // -------------------------------------------------------------
  // Rear face (-Z) across full width from leftX to rightX
  pushQuad([rightX, bottomDeckY, -halfD], [leftX, bottomDeckY, -halfD], [leftX, topY, -halfD], [rightX, topY, -halfD], [0, 0, -1]);

  // Front vertical fascia face (+Z) between deckInnerLeftX and deckInnerRightX
  if (fasciaTopY > bottomDeckY + 0.0005) {
    pushQuad(
      [deckInnerLeftX, bottomDeckY, halfD],
      [deckInnerRightX, bottomDeckY, halfD],
      [deckInnerRightX, fasciaTopY, halfD],
      [deckInnerLeftX, fasciaTopY, halfD],
      [0, 0, 1]
    );
  }
  // Front edge finish (chamfer or bullnose arc)
  pushFrontEdgeFinish(deckInnerLeftX, deckInnerRightX);

  // Left side face and slab (behind corner cutout, or full side face if sharp)
  if (leftCornerExt > 0) {
    const leftZCut = halfD - leftCornerExt;
    pushQuad([leftX, topY, leftZCut], [deckInnerLeftX, topY, leftZCut], [deckInnerLeftX, topY, -halfD], [leftX, topY, -halfD], [0, 1, 0]);
    pushQuad([leftX, bottomDeckY, -halfD], [deckInnerLeftX, bottomDeckY, -halfD], [deckInnerLeftX, bottomDeckY, leftZCut], [leftX, bottomDeckY, leftZCut], [0, -1, 0]);
    pushQuad([leftX, bottomDeckY, -halfD], [leftX, bottomDeckY, leftZCut], [leftX, topY, leftZCut], [leftX, topY, -halfD], [-1, 0, 0]);
  } else {
    pushSideFace(leftX, false);
  }

  // Right side face and slab (behind corner cutout, or full side face if sharp)
  if (rightCornerExt > 0) {
    const rightZCut = halfD - rightCornerExt;
    pushQuad([deckInnerRightX, topY, rightZCut], [rightX, topY, rightZCut], [rightX, topY, -halfD], [deckInnerRightX, topY, -halfD], [0, 1, 0]);
    pushQuad([deckInnerRightX, bottomDeckY, -halfD], [rightX, bottomDeckY, -halfD], [rightX, bottomDeckY, rightZCut], [deckInnerRightX, bottomDeckY, rightZCut], [0, -1, 0]);
    pushQuad([rightX, bottomDeckY, rightZCut], [rightX, bottomDeckY, -halfD], [rightX, topY, -halfD], [rightX, topY, rightZCut], [1, 0, 0]);
  } else {
    pushSideFace(rightX, true);
  }

  if (isNoBasin || isVesselOnDeck) {
    // Continuous uninterrupted worktop deck slab
    // Top surface
    pushQuad([deckInnerLeftX, topY, deckFrontZ], [deckInnerRightX, topY, deckFrontZ], [deckInnerRightX, topY, -halfD], [deckInnerLeftX, topY, -halfD], [0, 1, 0]);
    // Bottom surface
    pushQuad([deckInnerLeftX, bottomDeckY, -halfD], [deckInnerRightX, bottomDeckY, -halfD], [deckInnerRightX, bottomDeckY, halfD], [deckInnerLeftX, bottomDeckY, halfD], [0, -1, 0]);
  } else {
    // Seamless Cutout Deck for Integrated (IN) / Undermount (ON)
    const rx = basinSpec.width / 2;
    const bMinX = bX - rx;
    const bMaxX = bX + rx;
    const bMinZ = bZ - rz;
    const bMaxZ = bZ + rz;

    // 1. TOP SURFACE QUADS (+Y) around basin cutout within central zone
    if (bMinX > deckInnerLeftX) {
      pushQuad([deckInnerLeftX, topY, deckFrontZ], [bMinX, topY, deckFrontZ], [bMinX, topY, -halfD], [deckInnerLeftX, topY, -halfD], [0, 1, 0]);
    }
    if (deckInnerRightX > bMaxX) {
      pushQuad([bMaxX, topY, deckFrontZ], [deckInnerRightX, topY, deckFrontZ], [deckInnerRightX, topY, -halfD], [bMaxX, topY, -halfD], [0, 1, 0]);
    }
    // Front Deck Bridge Top Quad
    pushQuad([bMinX, topY, deckFrontZ], [bMaxX, topY, deckFrontZ], [bMaxX, topY, bMaxZ], [bMinX, topY, bMaxZ], [0, 1, 0]);
    // Rear Deck Bridge Top Quad
    pushQuad([bMinX, topY, bMinZ], [bMaxX, topY, bMinZ], [bMaxX, topY, -halfD], [bMinX, topY, -halfD], [0, 1, 0]);

    // 2. BOTTOM SURFACE QUADS (-Y) around basin cutout within central zone
    if (bMinX > deckInnerLeftX) {
      pushQuad([deckInnerLeftX, bottomDeckY, -halfD], [bMinX, bottomDeckY, -halfD], [bMinX, bottomDeckY, halfD], [deckInnerLeftX, bottomDeckY, halfD], [0, -1, 0]);
    }
    if (deckInnerRightX > bMaxX) {
      pushQuad([bMaxX, bottomDeckY, -halfD], [deckInnerRightX, bottomDeckY, -halfD], [deckInnerRightX, bottomDeckY, halfD], [bMaxX, bottomDeckY, halfD], [0, -1, 0]);
    }
    // Front Deck Bridge Bottom Quad
    pushQuad([bMinX, bottomDeckY, bMaxZ], [bMaxX, bottomDeckY, bMaxZ], [bMaxX, bottomDeckY, halfD], [bMinX, bottomDeckY, halfD], [0, -1, 0]);
    // Rear Deck Bridge Bottom Quad
    pushQuad([bMinX, bottomDeckY, -halfD], [bMaxX, bottomDeckY, -halfD], [bMaxX, bottomDeckY, bMinZ], [bMinX, bottomDeckY, bMinZ], [0, -1, 0]);

    // 4. Watertight Spandrel Corner Triangulation around basin rim (Top & Bottom)
    if (basinSpec.shape === 'oval' || basinSpec.shape === 'round' || basinSpec.shape === 'capsule' || basinSpec.shape === 'soft-rect' || basinSpec.id === 'crisp-rect' || basinSpec.shape === 'rectangular' || basinSpec.id === 'coved-rect') {
      const segs = 48;
      const isRect = basinSpec.shape === 'rectangular' || basinSpec.id === 'coved-rect';
      const isSoftRect = basinSpec.shape === 'soft-rect' || basinSpec.id === 'crisp-rect';
      const pExp = isRect ? 6.5 : (isSoftRect ? 3.8 : 2.0);

      for (let i = 0; i < segs; i++) {
        const th1 = (i / segs) * Math.PI * 2;
        const th2 = ((i + 1) / segs) * Math.PI * 2;
        const midTh = (th1 + th2) / 2;

        const c1 = Math.cos(th1);
        const s1m = Math.sin(th1);
        const c2 = Math.cos(th2);
        const s2m = Math.sin(th2);

        const p1X = bX + rx * ((isRect || isSoftRect) ? Math.sign(c1) * Math.pow(Math.abs(c1), 2 / pExp) : c1);
        const p1Z = bZ + rz * ((isRect || isSoftRect) ? Math.sign(s1m) * Math.pow(Math.abs(s1m), 2 / pExp) : s1m);
        const p2X = bX + rx * ((isRect || isSoftRect) ? Math.sign(c2) * Math.pow(Math.abs(c2), 2 / pExp) : c2);
        const p2Z = bZ + rz * ((isRect || isSoftRect) ? Math.sign(s2m) * Math.pow(Math.abs(s2m), 2 / pExp) : s2m);

        let cX = bX;
        let cZ = bZ;
        if (Math.cos(midTh) >= 0 && Math.sin(midTh) >= 0) { cX = bMaxX; cZ = bMaxZ; }
        else if (Math.cos(midTh) < 0 && Math.sin(midTh) >= 0) { cX = bMinX; cZ = bMaxZ; }
        else if (Math.cos(midTh) < 0 && Math.sin(midTh) < 0) { cX = bMinX; cZ = bMinZ; }
        else { cX = bMaxX; cZ = bMinZ; }

        pushTri([cX, topY, cZ], [p1X, topY, p1Z], [p2X, topY, p2Z], [0, 1, 0]);
        pushTri([cX, bottomDeckY, cZ], [p2X, bottomDeckY, p2Z], [p1X, bottomDeckY, p1Z], [0, -1, 0]);
      }
    }
  }

  // -------------------------------------------------------------
  // Corner Profile 3D Geometry (Front-Left & Front-Right)
  // -------------------------------------------------------------
  // -------------------------------------------------------------
  // Corner Profile 3D Geometry (Front-Left & Front-Right)
  // Perfectly integrated with Top Edge Finishing (Section 08)
  // -------------------------------------------------------------
  const arcSegs = 18;
  const edgeSegs = 18;

  // FRONT-LEFT CORNER: Chamfer
  if (leftCornerType === 'chamfer' && leftChamferC > 0) {
    const cL = leftChamferC;
    const invSqrt2 = Math.SQRT1_2;
    const nChamfer: [number, number, number] = [-invSqrt2, 0, invSqrt2];
    const nChamferTop: [number, number, number] = [-invSqrt2 * 0.7071, 0.7071, invSqrt2 * 0.7071];
    const effEdgeOffset = Math.min(edgeOffset, cL * 0.90);

    const xFront = leftX + cL;
    const zFront = halfD;
    const xSide = leftX;
    const zSide = halfD - cL;

    // Bottom surface (-Y)
    pushTri([leftX + cL, bottomDeckY, halfD - cL], [xSide, bottomDeckY, zSide], [xFront, bottomDeckY, zFront], [0, -1, 0]);

    if (effEdgeOffset <= 0.0005) {
      // Micro-Arris Sharp
      pushTri([leftX + cL, topY, halfD - cL], [xFront, topY, zFront], [xSide, topY, zSide], [0, 1, 0]);
      pushQuad([xSide, bottomDeckY, zSide], [xFront, bottomDeckY, zFront], [xFront, topY, zFront], [xSide, topY, zSide], nChamfer);
    } else {
      const cy = topY - effEdgeOffset;
      const fasciaY = cy;

      // Vertical outer fascia
      if (fasciaY > bottomDeckY + 0.0005) {
        pushQuad(
          [xSide, bottomDeckY, zSide],
          [xFront, bottomDeckY, zFront],
          [xFront, fasciaY, zFront],
          [xSide, fasciaY, zSide],
          nChamfer
        );
      }

      const xInFront = xFront;
      const zInFront = zFront - effEdgeOffset;
      const xInSide = xSide + effEdgeOffset;
      const zInSide = zSide;

      // Top surface (+Y)
      pushTri([leftX + cL, topY, halfD - cL], [xInFront, topY, zInFront], [xInSide, topY, zInSide], [0, 1, 0]);

      if (topEdgeType === 'fillet') {
        // Rounded bullnose cylinder along the chamfer bevel
        for (let s = 0; s < edgeSegs; s++) {
          const th1 = (s / edgeSegs) * (Math.PI * 0.5);
          const th2 = ((s + 1) / edgeSegs) * (Math.PI * 0.5);

          const y1 = cy + effEdgeOffset * Math.sin(th1);
          const dR1 = effEdgeOffset * (1 - Math.cos(th1));
          const y2 = cy + effEdgeOffset * Math.sin(th2);
          const dR2 = effEdgeOffset * (1 - Math.cos(th2));

          const pFront1: [number, number, number] = [xFront, y1, zFront - dR1];
          const pFront2: [number, number, number] = [xFront, y2, zFront - dR2];
          const pSide1: [number, number, number] = [xSide + dR1, y1, zSide];
          const pSide2: [number, number, number] = [xSide + dR2, y2, zSide];

          const n1: [number, number, number] = [-invSqrt2 * Math.cos(th1), Math.sin(th1), invSqrt2 * Math.cos(th1)];
          const n2: [number, number, number] = [-invSqrt2 * Math.cos(th2), Math.sin(th2), invSqrt2 * Math.cos(th2)];

          pushQuadSmooth(pSide1, pFront1, pFront2, pSide2, n1, n1, n2, n2);

          // Side profile closure at zSide facing -Z
          pushTri([xSide + effEdgeOffset, cy, zSide], [pSide2[0], pSide2[1], zSide], [pSide1[0], pSide1[1], zSide], [0, 0, -1]);
        }
      } else {
        // 45° Chamfer bevel
        pushQuadSmooth(
          [xSide, fasciaY, zSide],
          [xFront, fasciaY, zFront],
          [xInFront, topY, zInFront],
          [xInSide, topY, zInSide],
          nChamferTop, nChamferTop, nChamferTop, nChamferTop
        );
        pushTri([xSide + effEdgeOffset, topY, zSide], [xSide, fasciaY, zSide], [xSide + effEdgeOffset, fasciaY, zSide], [0, 0, -1]);
      }
    }
  }
  // FRONT-LEFT CORNER: Fillet (Rounded radial arc with continuous Torus Bullnose)
  else if (leftCornerType === 'fillet' && leftFilletR > 0) {
    const rL = leftFilletR;
    const cX = leftX + rL;
    const cZ = halfD - rL;
    const effEdgeOffset = Math.min(edgeOffset, rL * 0.90);

    for (let i = 0; i < arcSegs; i++) {
      const a1 = Math.PI - (i / arcSegs) * (Math.PI / 2);
      const a2 = Math.PI - ((i + 1) / arcSegs) * (Math.PI / 2);

      const cos1 = Math.cos(a1);
      const sin1 = Math.sin(a1);
      const cos2 = Math.cos(a2);
      const sin2 = Math.sin(a2);

      const b1: [number, number, number] = [cX + rL * cos1, bottomDeckY, cZ + rL * sin1];
      const b2: [number, number, number] = [cX + rL * cos2, bottomDeckY, cZ + rL * sin2];

      // Bottom surface (-Y)
      pushTri([cX, bottomDeckY, cZ], b1, b2, [0, -1, 0]);

      if (effEdgeOffset <= 0.0005) {
        // Micro-Arris Sharp
        const t1: [number, number, number] = [cX + rL * cos1, topY, cZ + rL * sin1];
        const t2: [number, number, number] = [cX + rL * cos2, topY, cZ + rL * sin2];
        pushTri([cX, topY, cZ], t2, t1, [0, 1, 0]);

        const n1: [number, number, number] = [cos1, 0, sin1];
        const n2: [number, number, number] = [cos2, 0, sin2];
        pushQuadSmooth(b1, b2, t2, t1, n1, n2, n2, n1);
      } else {
        const rMajor = rL - effEdgeOffset;
        const cy = topY - effEdgeOffset;
        const fasciaY = cy;

        // Top surface (+Y) triangle fan from center to inner arc
        const t1: [number, number, number] = [cX + rMajor * cos1, topY, cZ + rMajor * sin1];
        const t2: [number, number, number] = [cX + rMajor * cos2, topY, cZ + rMajor * sin2];
        pushTri([cX, topY, cZ], t2, t1, [0, 1, 0]);

        // Vertical outer fascia
        const f1: [number, number, number] = [cX + rL * cos1, fasciaY, cZ + rL * sin1];
        const f2: [number, number, number] = [cX + rL * cos2, fasciaY, cZ + rL * sin2];
        const nHoriz1: [number, number, number] = [cos1, 0, sin1];
        const nHoriz2: [number, number, number] = [cos2, 0, sin2];

        if (fasciaY > bottomDeckY + 0.0005) {
          pushQuadSmooth(b1, b2, f2, f1, nHoriz1, nHoriz2, nHoriz2, nHoriz1);
        }

        if (topEdgeType === 'fillet') {
          // Mathematically continuous Torus Bullnose Quarter
          for (let s = 0; s < edgeSegs; s++) {
            const th1 = (s / edgeSegs) * (Math.PI * 0.5);
            const th2 = ((s + 1) / edgeSegs) * (Math.PI * 0.5);

            const y1 = cy + effEdgeOffset * Math.sin(th1);
            const rad1 = rMajor + effEdgeOffset * Math.cos(th1);
            const y2 = cy + effEdgeOffset * Math.sin(th2);
            const rad2 = rMajor + effEdgeOffset * Math.cos(th2);

            const p11: [number, number, number] = [cX + rad1 * cos1, y1, cZ + rad1 * sin1];
            const p21: [number, number, number] = [cX + rad1 * cos2, y1, cZ + rad1 * sin2];
            const p22: [number, number, number] = [cX + rad2 * cos2, y2, cZ + rad2 * sin2];
            const p12: [number, number, number] = [cX + rad2 * cos1, y2, cZ + rad2 * sin1];

            const norm11: [number, number, number] = [Math.cos(th1) * cos1, Math.sin(th1), Math.cos(th1) * sin1];
            const norm21: [number, number, number] = [Math.cos(th1) * cos2, Math.sin(th1), Math.cos(th1) * sin2];
            const norm22: [number, number, number] = [Math.cos(th2) * cos2, Math.sin(th2), Math.cos(th2) * sin2];
            const norm12: [number, number, number] = [Math.cos(th2) * cos1, Math.sin(th2), Math.cos(th2) * sin1];

            pushQuadSmooth(p11, p21, p22, p12, norm11, norm21, norm22, norm12);

            // Side profile closure at i = 0 (a1 = PI, z = halfD - rL) facing -Z
            if (i === 0) {
              const sideZ = cZ;
              pushTri([cX - rMajor, cy, sideZ], [p12[0], p12[1], sideZ], [p11[0], p11[1], sideZ], [0, 0, -1]);
            }
          }
        } else {
          // 45° Chamfer conical frustum quad
          const nDiag1: [number, number, number] = [cos1 * Math.SQRT1_2, Math.SQRT1_2, sin1 * Math.SQRT1_2];
          const nDiag2: [number, number, number] = [cos2 * Math.SQRT1_2, Math.SQRT1_2, sin2 * Math.SQRT1_2];
          pushQuadSmooth(f1, f2, t2, t1, nDiag1, nDiag2, nDiag2, nDiag1);

          if (i === 0) {
            const sideZ = cZ;
            pushTri([cX - rMajor, topY, sideZ], [f1[0], f1[1], sideZ], [cX - rMajor, fasciaY, sideZ], [0, 0, -1]);
          }
        }
      }
    }
  }

  // FRONT-RIGHT CORNER: Chamfer
  if (rightCornerType === 'chamfer' && rightChamferC > 0) {
    const cR = rightChamferC;
    const invSqrt2 = Math.SQRT1_2;
    const nChamfer: [number, number, number] = [invSqrt2, 0, invSqrt2];
    const nChamferTop: [number, number, number] = [invSqrt2 * 0.7071, 0.7071, invSqrt2 * 0.7071];
    const effEdgeOffset = Math.min(edgeOffset, cR * 0.90);

    const xFront = rightX - cR;
    const zFront = halfD;
    const xSide = rightX;
    const zSide = halfD - cR;

    // Bottom surface (-Y)
    pushTri([rightX - cR, bottomDeckY, halfD - cR], [xFront, bottomDeckY, zFront], [xSide, bottomDeckY, zSide], [0, -1, 0]);

    if (effEdgeOffset <= 0.0005) {
      // Micro-Arris Sharp
      pushTri([rightX - cR, topY, halfD - cR], [xSide, topY, zSide], [xFront, topY, zFront], [0, 1, 0]);
      pushQuad([xFront, bottomDeckY, zFront], [xSide, bottomDeckY, zSide], [xSide, topY, zSide], [xFront, topY, zFront], nChamfer);
    } else {
      const cy = topY - effEdgeOffset;
      const fasciaY = cy;

      if (fasciaY > bottomDeckY + 0.0005) {
        pushQuad(
          [xFront, bottomDeckY, zFront],
          [xSide, bottomDeckY, zSide],
          [xSide, fasciaY, zSide],
          [xFront, fasciaY, zFront],
          nChamfer
        );
      }

      const xInFront = xFront;
      const zInFront = zFront - effEdgeOffset;
      const xInSide = xSide - effEdgeOffset;
      const zInSide = zSide;

      // Top surface (+Y)
      pushTri([rightX - cR, topY, halfD - cR], [xInSide, topY, zInSide], [xInFront, topY, zInFront], [0, 1, 0]);

      if (topEdgeType === 'fillet') {
        for (let s = 0; s < edgeSegs; s++) {
          const th1 = (s / edgeSegs) * (Math.PI * 0.5);
          const th2 = ((s + 1) / edgeSegs) * (Math.PI * 0.5);

          const y1 = cy + effEdgeOffset * Math.sin(th1);
          const dR1 = effEdgeOffset * (1 - Math.cos(th1));
          const y2 = cy + effEdgeOffset * Math.sin(th2);
          const dR2 = effEdgeOffset * (1 - Math.cos(th2));

          const pFront1: [number, number, number] = [xFront, y1, zFront - dR1];
          const pFront2: [number, number, number] = [xFront, y2, zFront - dR2];
          const pSide1: [number, number, number] = [xSide - dR1, y1, zSide];
          const pSide2: [number, number, number] = [xSide - dR2, y2, zSide];

          const n1: [number, number, number] = [invSqrt2 * Math.cos(th1), Math.sin(th1), invSqrt2 * Math.cos(th1)];
          const n2: [number, number, number] = [invSqrt2 * Math.cos(th2), Math.sin(th2), invSqrt2 * Math.cos(th2)];

          pushQuadSmooth(pFront1, pSide1, pSide2, pFront2, n1, n1, n2, n2);

          // Side profile closure at zSide facing -Z
          pushTri([xSide - effEdgeOffset, cy, zSide], [pSide1[0], pSide1[1], zSide], [pSide2[0], pSide2[1], zSide], [0, 0, -1]);
        }
      } else {
        pushQuadSmooth(
          [xFront, fasciaY, zFront],
          [xSide, fasciaY, zSide],
          [xInSide, topY, zInSide],
          [xInFront, topY, zInFront],
          nChamferTop, nChamferTop, nChamferTop, nChamferTop
        );
        pushTri([xSide - effEdgeOffset, topY, zSide], [xSide - effEdgeOffset, fasciaY, zSide], [xSide, fasciaY, zSide], [0, 0, -1]);
      }
    }
  }
  // FRONT-RIGHT CORNER: Fillet (Rounded radial arc with continuous Torus Bullnose)
  else if (rightCornerType === 'fillet' && rightFilletR > 0) {
    const rR = rightFilletR;
    const cX = rightX - rR;
    const cZ = halfD - rR;
    const effEdgeOffset = Math.min(edgeOffset, rR * 0.90);

    for (let i = 0; i < arcSegs; i++) {
      const a1 = (Math.PI / 2) - (i / arcSegs) * (Math.PI / 2);
      const a2 = (Math.PI / 2) - ((i + 1) / arcSegs) * (Math.PI / 2);

      const cos1 = Math.cos(a1);
      const sin1 = Math.sin(a1);
      const cos2 = Math.cos(a2);
      const sin2 = Math.sin(a2);

      const b1: [number, number, number] = [cX + rR * cos1, bottomDeckY, cZ + rR * sin1];
      const b2: [number, number, number] = [cX + rR * cos2, bottomDeckY, cZ + rR * sin2];

      // Bottom surface (-Y)
      pushTri([cX, bottomDeckY, cZ], b2, b1, [0, -1, 0]);

      if (effEdgeOffset <= 0.0005) {
        // Micro-Arris Sharp
        const t1: [number, number, number] = [cX + rR * cos1, topY, cZ + rR * sin1];
        const t2: [number, number, number] = [cX + rR * cos2, topY, cZ + rR * sin2];
        pushTri([cX, topY, cZ], t1, t2, [0, 1, 0]);

        const n1: [number, number, number] = [cos1, 0, sin1];
        const n2: [number, number, number] = [cos2, 0, sin2];
        pushQuadSmooth(b1, b2, t2, t1, n1, n2, n2, n1);
      } else {
        const rMajor = rR - effEdgeOffset;
        const cy = topY - effEdgeOffset;
        const fasciaY = cy;

        // Top surface (+Y) triangle fan from center to inner arc
        const t1: [number, number, number] = [cX + rMajor * cos1, topY, cZ + rMajor * sin1];
        const t2: [number, number, number] = [cX + rMajor * cos2, topY, cZ + rMajor * sin2];
        pushTri([cX, topY, cZ], t1, t2, [0, 1, 0]);

        // Vertical outer fascia
        const f1: [number, number, number] = [cX + rR * cos1, fasciaY, cZ + rR * sin1];
        const f2: [number, number, number] = [cX + rR * cos2, fasciaY, cZ + rR * sin2];
        const nHoriz1: [number, number, number] = [cos1, 0, sin1];
        const nHoriz2: [number, number, number] = [cos2, 0, sin2];

        if (fasciaY > bottomDeckY + 0.0005) {
          pushQuadSmooth(b1, b2, f2, f1, nHoriz1, nHoriz2, nHoriz2, nHoriz1);
        }

        if (topEdgeType === 'fillet') {
          // Mathematically continuous Torus Bullnose Quarter
          for (let s = 0; s < edgeSegs; s++) {
            const th1 = (s / edgeSegs) * (Math.PI * 0.5);
            const th2 = ((s + 1) / edgeSegs) * (Math.PI * 0.5);

            const y1 = cy + effEdgeOffset * Math.sin(th1);
            const rad1 = rMajor + effEdgeOffset * Math.cos(th1);
            const y2 = cy + effEdgeOffset * Math.sin(th2);
            const rad2 = rMajor + effEdgeOffset * Math.cos(th2);

            const p11: [number, number, number] = [cX + rad1 * cos1, y1, cZ + rad1 * sin1];
            const p21: [number, number, number] = [cX + rad1 * cos2, y1, cZ + rad1 * sin2];
            const p22: [number, number, number] = [cX + rad2 * cos2, y2, cZ + rad2 * sin2];
            const p12: [number, number, number] = [cX + rad2 * cos1, y2, cZ + rad2 * sin1];

            const norm11: [number, number, number] = [Math.cos(th1) * cos1, Math.sin(th1), Math.cos(th1) * sin1];
            const norm21: [number, number, number] = [Math.cos(th1) * cos2, Math.sin(th1), Math.cos(th1) * sin2];
            const norm22: [number, number, number] = [Math.cos(th2) * cos2, Math.sin(th2), Math.cos(th2) * sin2];
            const norm12: [number, number, number] = [Math.cos(th2) * cos1, Math.sin(th2), Math.cos(th2) * sin1];

            pushQuadSmooth(p11, p21, p22, p12, norm11, norm21, norm22, norm12);

            // Side profile closure at i = arcSegs - 1 (a2 = 0, z = halfD - rR) facing -Z
            if (i === arcSegs - 1) {
              const sideZ = cZ;
              pushTri([cX + rMajor, cy, sideZ], [p21[0], p21[1], sideZ], [p22[0], p22[1], sideZ], [0, 0, -1]);
            }
          }
        } else {
          // 45° Chamfer conical frustum quad
          const nDiag1: [number, number, number] = [cos1 * Math.SQRT1_2, Math.SQRT1_2, sin1 * Math.SQRT1_2];
          const nDiag2: [number, number, number] = [cos2 * Math.SQRT1_2, Math.SQRT1_2, sin2 * Math.SQRT1_2];
          pushQuadSmooth(f1, f2, t2, t1, nDiag1, nDiag2, nDiag2, nDiag1);

          if (i === arcSegs - 1) {
            const sideZ = cZ;
            pushTri([cX + rMajor, topY, sideZ], [cX + rMajor, fasciaY, sideZ], [f2[0], f2[1], sideZ], [0, 0, -1]);
          }
        }
      }
    }
  }

  // -------------------------------------------------------------
  // 2. High-Precision Organic Washbasin Geometries
  // Exactly matching Reference Images 1, 2, 3, 4, 5
  // -------------------------------------------------------------
  if (!isNoBasin) {
    const bW = basinSpec.width;
    const bD = basinSpec.depth;

    // ===========================================================
    // CASE 1: "TOP" & "ON" - Freestanding Washbasin on Deck
    // ===========================================================
    if (isVesselOnDeck) {
      const vesselHeight = (basinSpec.height && basinSpec.height > 0) ? basinSpec.height : 0.135;
      const wallT = 0.012; // 12mm elegant solid surface rim lip
      const rimY = topY + vesselHeight;
      const floorY = topY + 0.012; // 12mm base thickness

      if (basinSpec.shape === 'oval' || basinSpec.shape === 'round') {
        const segs = 48;
        const rxExtRim = bW / 2;
        const rzExtRim = bD / 2;
        const rxIntRim = Math.max(0.04, rxExtRim - wallT);
        const rzIntRim = Math.max(0.04, rzExtRim - wallT);

        // Top Rim Flat Lip (12mm solid surface edge)
        for (let i = 0; i < segs; i++) {
          const th1 = (i / segs) * Math.PI * 2;
          const th2 = ((i + 1) / segs) * Math.PI * 2;
          const po1: [number, number, number] = [bX + rxExtRim * Math.cos(th1), rimY, bZ + rzExtRim * Math.sin(th1)];
          const po2: [number, number, number] = [bX + rxExtRim * Math.cos(th2), rimY, bZ + rzExtRim * Math.sin(th2)];
          const pi1: [number, number, number] = [bX + rxIntRim * Math.cos(th1), rimY, bZ + rzIntRim * Math.sin(th1)];
          const pi2: [number, number, number] = [bX + rxIntRim * Math.cos(th2), rimY, bZ + rzIntRim * Math.sin(th2)];
          pushQuad(po1, po2, pi2, pi1, [0, 1, 0]);
        }

        if (isStraightDrum) {
          // =======================================================
          // "ON" - Straight Vertical Cylindrical Drum Basin (Screenshot 2)
          // =======================================================
          // 1. Exterior vertical cylinder wall from topY up to rimY
          for (let i = 0; i < segs; i++) {
            const th1 = (i / segs) * Math.PI * 2;
            const th2 = ((i + 1) / segs) * Math.PI * 2;
            const c1 = Math.cos(th1);
            const s1m = Math.sin(th1);
            const c2 = Math.cos(th2);
            const s2m = Math.sin(th2);

            const p1: [number, number, number] = [bX + rxExtRim * c1, topY, bZ + rzExtRim * s1m];
            const p2: [number, number, number] = [bX + rxExtRim * c2, topY, bZ + rzExtRim * s2m];
            const p3: [number, number, number] = [bX + rxExtRim * c2, rimY, bZ + rzExtRim * s2m];
            const p4: [number, number, number] = [bX + rxExtRim * c1, rimY, bZ + rzExtRim * s1m];

            const n1: [number, number, number] = [c1, 0, s1m];
            const n2: [number, number, number] = [c2, 0, s2m];
            pushQuadSmooth(p1, p2, p3, p4, n1, n2, n2, n1, COLOR_DEFAULT);
          }

          // 2. Interior vertical cavity walls dropping from rimY to floorY
          for (let i = 0; i < segs; i++) {
            const th1 = (i / segs) * Math.PI * 2;
            const th2 = ((i + 1) / segs) * Math.PI * 2;
            const c1 = Math.cos(th1);
            const s1m = Math.sin(th1);
            const c2 = Math.cos(th2);
            const s2m = Math.sin(th2);

            const pi1: [number, number, number] = [bX + rxIntRim * c1, rimY, bZ + rzIntRim * s1m];
            const pi2: [number, number, number] = [bX + rxIntRim * c2, rimY, bZ + rzIntRim * s2m];
            const pi3: [number, number, number] = [bX + rxIntRim * c2, floorY, bZ + rzIntRim * s2m];
            const pi4: [number, number, number] = [bX + rxIntRim * c1, floorY, bZ + rzIntRim * s1m];

            const n1: [number, number, number] = [-c1, 0, -s1m];
            const n2: [number, number, number] = [-c2, 0, -s2m];
            pushQuadSmooth(pi1, pi2, pi3, pi4, n1, n2, n2, n1, COLOR_SHADOW);

            // Floor disc sector
            const pf1: [number, number, number] = [bX + rxIntRim * c1, floorY, bZ + rzIntRim * s1m];
            const pf2: [number, number, number] = [bX + rxIntRim * c2, floorY, bZ + rzIntRim * s2m];
            const pfC: [number, number, number] = [bX, floorY, bZ];
            pushTri(pfC, pf1, pf2, [0, 1, 0], COLOR_SHADOW);
          }
        } else {
          // =======================================================
          // "TOP" - Organic Curved Bowl / Hemisphere (Screenshot 1)
          // =======================================================
          const rings = 14;
          // Exterior Wall: Smooth boat-curved profile resting on deck (Screenshot 1)
          for (let j = 0; j < rings; j++) {
            const t1 = j / rings;
            const t2 = (j + 1) / rings;
            const y1 = topY + (rimY - topY) * t1;
            const y2 = topY + (rimY - topY) * t2;

            // Gentle boat-curve from 0.60 base to 1.0 rim
            const s1 = 0.60 + 0.40 * Math.pow(Math.sin(t1 * Math.PI * 0.5), 0.75);
            const s2 = 0.60 + 0.40 * Math.pow(Math.sin(t2 * Math.PI * 0.5), 0.75);

            const r1x = rxExtRim * s1;
            const r1z = rzExtRim * s1;
            const r2x = rxExtRim * s2;
            const r2z = rzExtRim * s2;

            for (let i = 0; i < segs; i++) {
              const th1 = (i / segs) * Math.PI * 2;
              const th2 = ((i + 1) / segs) * Math.PI * 2;
              const c1 = Math.cos(th1);
              const s1m = Math.sin(th1);
              const c2 = Math.cos(th2);
              const s2m = Math.sin(th2);

              const p1: [number, number, number] = [bX + r1x * c1, y1, bZ + r1z * s1m];
              const p2: [number, number, number] = [bX + r1x * c2, y1, bZ + r1z * s2m];
              const p3: [number, number, number] = [bX + r2x * c2, y2, bZ + r2z * s2m];
              const p4: [number, number, number] = [bX + r2x * c1, y2, bZ + r2z * s1m];

              const n1: [number, number, number] = [c1, (1 - t1) * 0.45, s1m];
              const n2: [number, number, number] = [c2, (1 - t1) * 0.45, s2m];
              const n3: [number, number, number] = [c2, (1 - t2) * 0.45, s2m];
              const n4: [number, number, number] = [c1, (1 - t2) * 0.45, s1m];
              pushQuadSmooth(p1, p2, p3, p4, n1, n2, n3, n4);
            }
          }

          // Interior Cavity: Gently curved washbowl cavity
          for (let j = 0; j < rings; j++) {
            const t1 = j / rings;
            const t2 = (j + 1) / rings;
            const y1 = floorY + (rimY - floorY) * t1;
            const y2 = floorY + (rimY - floorY) * t2;

            // Connects to drain opening (0.038m radius) at floor
            const s1 = 0.038 / rxIntRim + (1 - 0.038 / rxIntRim) * Math.pow(Math.sin(t1 * Math.PI * 0.5), 0.70);
            const s2 = 0.038 / rxIntRim + (1 - 0.038 / rxIntRim) * Math.pow(Math.sin(t2 * Math.PI * 0.5), 0.70);

            const r1x = rxIntRim * s1;
            const r1z = rzIntRim * s1;
            const r2x = rxIntRim * s2;
            const r2z = rzIntRim * s2;

            for (let i = 0; i < segs; i++) {
              const th1 = (i / segs) * Math.PI * 2;
              const th2 = ((i + 1) / segs) * Math.PI * 2;
              const c1 = Math.cos(th1);
              const s1m = Math.sin(th1);
              const c2 = Math.cos(th2);
              const s2m = Math.sin(th2);

              const p1: [number, number, number] = [bX + r1x * c1, y1, bZ + r1z * s1m];
              const p2: [number, number, number] = [bX + r1x * c2, y1, bZ + r1z * s2m];
              const p3: [number, number, number] = [bX + r2x * c2, y2, bZ + r2z * s2m];
              const p4: [number, number, number] = [bX + r2x * c1, y2, bZ + r2z * s1m];

              const n1: [number, number, number] = [-c1 * 0.8, 0.45, -s1m * 0.8];
              const n2: [number, number, number] = [-c2 * 0.8, 0.45, -s2m * 0.8];
              const n3: [number, number, number] = [-c2 * 0.8, 0.45, -s2m * 0.8];
              const n4: [number, number, number] = [-c1 * 0.8, 0.45, -s1m * 0.8];
              pushQuadSmooth(p4, p3, p2, p1, n4, n3, n2, n1, COLOR_SHADOW);
            }
          }
        }

        // Detailed Chrome Drain Hole in Vessel (Images 1 & 4)
        pushDetailedSinkDrain(bX, floorY + 0.001, bZ, undefined, true);
      } else {
        // Freestanding Rectangular Vessel on Deck (B / UB)
        const rx = bW / 2;
        const rz = bD / 2;
        const minX = bX - rx;
        const maxX = bX + rx;
        const minZ = bZ - rz;
        const maxZ = bZ + rz;

        // 1. Outer 4 vertical walls
        pushQuad([minX, topY, maxZ], [maxX, topY, maxZ], [maxX, rimY, maxZ], [minX, rimY, maxZ], [0, 0, 1]);
        pushQuad([maxX, topY, minZ], [minX, topY, minZ], [minX, rimY, minZ], [maxX, rimY, minZ], [0, 0, -1]);
        pushQuad([minX, topY, minZ], [minX, topY, maxZ], [minX, rimY, maxZ], [minX, rimY, minZ], [-1, 0, 0]);
        pushQuad([maxX, topY, maxZ], [maxX, topY, minZ], [maxX, rimY, minZ], [maxX, rimY, maxZ], [1, 0, 0]);

        // 2. Top Rim Flat Lip (15mm solid surface edge)
        const wallT = 0.015;
        const iMinX = minX + wallT;
        const iMaxX = maxX - wallT;
        const iMinZ = minZ + wallT;
        const iMaxZ = maxZ - wallT;
        pushQuad([minX, rimY, maxZ], [maxX, rimY, maxZ], [iMaxX, rimY, iMaxZ], [iMinX, rimY, iMaxZ], [0, 1, 0]);
        pushQuad([maxX, rimY, minZ], [minX, rimY, minZ], [iMinX, rimY, iMinZ], [iMaxX, rimY, iMinZ], [0, 1, 0]);
        pushQuad([minX, rimY, minZ], [minX, rimY, maxZ], [iMinX, rimY, iMaxZ], [iMinX, rimY, iMinZ], [0, 1, 0]);
        pushQuad([maxX, rimY, maxZ], [maxX, rimY, minZ], [iMaxX, rimY, iMinZ], [iMaxX, rimY, iMaxZ], [0, 1, 0]);

        // 3. Inner 4 vertical walls from rimY down to floorY (Solid, opaque with ambient shadow)
        pushQuad([iMaxX, floorY, iMaxZ], [iMinX, floorY, iMaxZ], [iMinX, rimY, iMaxZ], [iMaxX, rimY, iMaxZ], [0, 0, -1], COLOR_SHADOW);
        pushQuad([iMinX, floorY, iMinZ], [iMaxX, floorY, iMinZ], [iMaxX, rimY, iMinZ], [iMinX, rimY, iMinZ], [0, 0, 1], COLOR_SHADOW);
        pushQuad([iMinX, floorY, iMaxZ], [iMinX, floorY, iMinZ], [iMinX, rimY, iMinZ], [iMinX, rimY, iMaxZ], [1, 0, 0], COLOR_SHADOW);
        pushQuad([iMaxX, floorY, iMinZ], [iMaxX, floorY, iMaxZ], [iMaxX, rimY, iMaxZ], [iMaxX, rimY, iMinZ], [-1, 0, 0], COLOR_SHADOW);

        // 4. Flat solid horizontal basin floor at floorY (CCW winding, solid surface shadow)
        pushQuad([iMinX, floorY, iMaxZ], [iMaxX, floorY, iMaxZ], [iMaxX, floorY, iMinZ], [iMinX, floorY, iMinZ], [0, 1, 0], COLOR_SHADOW);

        // 5. Detailed Chrome Pop-Up Drain Hole placed directly on the floor
        pushDetailedSinkDrain(bX, floorY + 0.001, bZ, undefined, true);
      }
    }

    // ===========================================================
    // CASE 2: "IN" (Seamless Integrated) & "TOP" (Semi-Inset Top-Mount)
    // ===========================================================
    else {
      const isTopMount = cfg.sinkIntegration === 'topmount';
      const topRimY = isTopMount ? topY + 0.022 : topY;
      const bH = basinSpec.height;
      const bowlFloorY = bottomDeckY - bH;
      const totalDepth = topRimY - bowlFloorY; // Full depth from top rim to bowl floor
      const rxRim = bW / 2;
      const rzRim = bD / 2;

      if (basinSpec.shape === 'oval' || basinSpec.shape === 'round' || basinSpec.shape === 'capsule' || basinSpec.shape === 'soft-rect' || basinSpec.id === 'crisp-rect' || basinSpec.shape === 'rectangular' || basinSpec.id === 'coved-rect') {
        const isRect = basinSpec.shape === 'rectangular' || basinSpec.id === 'coved-rect';
        const isSoftRect = basinSpec.shape === 'soft-rect' || basinSpec.id === 'crisp-rect';
        const rings = isRect ? 22 : 18;
        const segs = 48;
        const rDrain = 0.038; // 76mm drain hole connection
        const coveH = 0.022;  // 22mm coved internal corner radius for Model A

        // 1. Seamless Coved Inner Cavity in COLOR_DEFAULT (Corian Glacier White)
        for (let j = 0; j < rings; j++) {
          const t1 = j / rings;
          const t2 = (j + 1) / rings;

          let y1: number, y2: number;
          let s1: number, s2: number, sz1: number, sz2: number;
          let pExp1: number, pExp2: number;
          let nRad1: number, nRad2: number, nY1: number, nY2: number;

          if (isRect) {
            // Model A: Architectural rectangular basin with vertical walls and smooth coved floor transitions (Images 3, 4, 5)
            const wallRatio = 0.32; // bottom 32% is cove, top 68% is vertical wall
            const calcRectSlice = (t: number) => {
              if (t >= wallRatio) {
                const u = (t - wallRatio) / (1 - wallRatio);
                const y = bowlFloorY + coveH + (totalDepth - coveH) * u;
                return { y, sx: rxRim, sz: rzRim, pExp: 6.5, nRad: 0.98, nY: 0.08 };
              } else {
                const u = t / wallRatio;
                const ang = u * Math.PI * 0.5;
                const sinAng = Math.sin(ang);
                const cosAng = Math.cos(ang);
                const y = bowlFloorY + coveH * sinAng;
                const radFac = 0.20 * sinAng + 0.80 * Math.pow(sinAng, 0.45);
                const sx = rDrain + (rxRim - rDrain) * radFac;
                const sz = rDrain + (rzRim - rDrain) * radFac;
                const pExp = 2.0 + 4.5 * Math.pow(u, 0.6);
                return { y, sx, sz, pExp, nRad: cosAng * 0.92, nY: sinAng * 0.92 };
              }
            };
            const sl1 = calcRectSlice(t1);
            const sl2 = calcRectSlice(t2);
            y1 = sl1.y; y2 = sl2.y;
            s1 = sl1.sx; s2 = sl2.sx;
            sz1 = sl1.sz; sz2 = sl2.sz;
            pExp1 = sl1.pExp; pExp2 = sl2.pExp;
            nRad1 = sl1.nRad; nRad2 = sl2.nRad;
            nY1 = sl1.nY; nY2 = sl2.nY;
          } else {
            // Models B, RO, OV, capsule
            const phi1 = t1 * (Math.PI * 0.5);
            const phi2 = t2 * (Math.PI * 0.5);
            y1 = bowlFloorY + totalDepth * Math.sin(phi1);
            y2 = bowlFloorY + totalDepth * Math.sin(phi2);
            pExp1 = isSoftRect ? (2.0 + 1.8 * Math.pow(Math.sin(phi1), 1.2)) : 2.0;
            pExp2 = isSoftRect ? (2.0 + 1.8 * Math.pow(Math.sin(phi2), 1.2)) : 2.0;
            s1 = rDrain + (rxRim - rDrain) * (0.15 * Math.sin(phi1) + 0.85 * Math.pow(Math.sin(phi1), 0.70));
            s2 = rDrain + (rxRim - rDrain) * (0.15 * Math.sin(phi2) + 0.85 * Math.pow(Math.sin(phi2), 0.70));
            sz1 = rDrain + (rzRim - rDrain) * (0.15 * Math.sin(phi1) + 0.85 * Math.pow(Math.sin(phi1), 0.70));
            sz2 = rDrain + (rzRim - rDrain) * (0.15 * Math.sin(phi2) + 0.85 * Math.pow(Math.sin(phi2), 0.70));
            nRad1 = Math.cos(phi1) * 0.65;
            nRad2 = Math.cos(phi2) * 0.65;
            nY1 = Math.sin(phi1);
            nY2 = Math.sin(phi2);
          }

          for (let i = 0; i < segs; i++) {
            const th1 = (i / segs) * Math.PI * 2;
            const th2 = ((i + 1) / segs) * Math.PI * 2;

            const c1 = Math.cos(th1);
            const s1m = Math.sin(th1);
            const c2 = Math.cos(th2);
            const s2m = Math.sin(th2);

            const xp1 = Math.sign(c1) * Math.pow(Math.abs(c1), 2 / pExp1);
            const zp1 = Math.sign(s1m) * Math.pow(Math.abs(s1m), 2 / pExp1);
            const xp2 = Math.sign(c2) * Math.pow(Math.abs(c2), 2 / pExp1);
            const zp2 = Math.sign(s2m) * Math.pow(Math.abs(s2m), 2 / pExp1);

            const xq1 = Math.sign(c1) * Math.pow(Math.abs(c1), 2 / pExp2);
            const zq1 = Math.sign(s1m) * Math.pow(Math.abs(s1m), 2 / pExp2);
            const xq2 = Math.sign(c2) * Math.pow(Math.abs(c2), 2 / pExp2);
            const zq2 = Math.sign(s2m) * Math.pow(Math.abs(s2m), 2 / pExp2);

            const p1: [number, number, number] = [bX + s1 * xp1, y1, bZ + sz1 * zp1];
            const p2: [number, number, number] = [bX + s1 * xp2, y1, bZ + sz1 * zp2];
            const p3: [number, number, number] = [bX + s2 * xq2, y2, bZ + sz2 * zq2];
            const p4: [number, number, number] = [bX + s2 * xq1, y2, bZ + sz2 * zq1];

            // Inward normals transitioning smoothly upward into deck plane [0, 1, 0] at rim
            const n1: [number, number, number] = [-xp1 * nRad1, nY1, -zp1 * nRad1];
            const n2: [number, number, number] = [-xp2 * nRad1, nY1, -zp2 * nRad1];
            const n3: [number, number, number] = [-xq2 * nRad2, nY2, -zq2 * nRad2];
            const n4: [number, number, number] = [-xq1 * nRad2, nY2, -zq1 * nRad2];

            pushQuadSmooth(p4, p3, p2, p1, n4, n3, n2, n1, COLOR_DEFAULT);
          }
        }

        // Pill-shaped overflow slot on inside rear wall (Image 3, 4, 5)
        if (isSoftRect || isRect) {
          const ofY = topRimY - 0.026;
          const ofHalfW = 0.024;
          const ofHalfH = 0.005;
          const ofZ = bZ - rzRim + 0.008;
          pushQuad(
            [bX - ofHalfW, ofY - ofHalfH, ofZ],
            [bX + ofHalfW, ofY - ofHalfH, ofZ],
            [bX + ofHalfW, ofY + ofHalfH, ofZ],
            [bX - ofHalfW, ofY + ofHalfH, ofZ],
            [0, 0, 1],
            COLOR_SHADOW
          );
        }

        // Top-Mount Outer Rim Lip resting on countertop deck (when TOP is selected)
        if (isTopMount) {
          const rExtX = rxRim + 0.016;
          const rExtZ = rzRim + 0.016;
          for (let i = 0; i < segs; i++) {
            const th1 = (i / segs) * Math.PI * 2;
            const th2 = ((i + 1) / segs) * Math.PI * 2;
            const c1 = Math.cos(th1);
            const s1m = Math.sin(th1);
            const c2 = Math.cos(th2);
            const s2m = Math.sin(th2);

            const xp1 = isSoftRect ? Math.sign(c1) * Math.pow(Math.abs(c1), 2 / 3.8) : c1;
            const zp1 = isSoftRect ? Math.sign(s1m) * Math.pow(Math.abs(s1m), 2 / 3.8) : s1m;
            const xp2 = isSoftRect ? Math.sign(c2) * Math.pow(Math.abs(c2), 2 / 3.8) : c2;
            const zp2 = isSoftRect ? Math.sign(s2m) * Math.pow(Math.abs(s2m), 2 / 3.8) : s2m;

            const pr1: [number, number, number] = [bX + rxRim * xp1, topRimY, bZ + rzRim * zp1];
            const pr2: [number, number, number] = [bX + rxRim * xp2, topRimY, bZ + rzRim * zp2];
            const pro1: [number, number, number] = [bX + rExtX * xp1, topRimY - 0.003, bZ + rExtZ * zp1];
            const pro2: [number, number, number] = [bX + rExtX * xp2, topRimY - 0.003, bZ + rExtZ * zp2];
            pushQuad(pr1, pr2, pro2, pro1, [0, 1, 0], COLOR_DEFAULT);

            const pd1: [number, number, number] = [bX + rExtX * xp1, topY, bZ + rExtZ * zp1];
            const pd2: [number, number, number] = [bX + rExtX * xp2, topY, bZ + rExtZ * zp2];
            pushQuad(pro1, pro2, pd2, pd1, [xp1, 0.4, zp1], COLOR_DEFAULT);
          }
        }

        // 2. Exterior Underside Shell (Smooth solid surface basin underbelly for 360° inspection - Image 4)
        const wallThick = 0.012;
        const underBaseY = bowlFloorY - 0.005;
        for (let j = 0; j < rings; j++) {
          const t1 = j / rings;
          const t2 = (j + 1) / rings;

          let y1: number, y2: number;
          let s1: number, s2: number, sz1: number, sz2: number;
          let pExp1: number, pExp2: number;
          let nRad1: number, nRad2: number, nY1: number, nY2: number;

          if (isRect) {
            const wallRatio = 0.32;
            const calcUnderSlice = (t: number) => {
              if (t >= wallRatio) {
                const u = (t - wallRatio) / (1 - wallRatio);
                const y = underBaseY + coveH + (totalDepth - T + 0.005 - coveH) * u;
                return { y, sx: rxRim + wallThick, sz: rzRim + wallThick, pExp: 6.5, nRad: 0.98, nY: -0.05 };
              } else {
                const u = t / wallRatio;
                const ang = u * Math.PI * 0.5;
                const sinAng = Math.sin(ang);
                const cosAng = Math.cos(ang);
                const y = underBaseY + coveH * sinAng;
                const radFac = 0.20 * sinAng + 0.80 * Math.pow(sinAng, 0.45);
                const sx = rDrain + (rxRim + wallThick - rDrain) * radFac;
                const sz = rDrain + (rzRim + wallThick - rDrain) * radFac;
                const pExp = 2.0 + 4.5 * Math.pow(u, 0.6);
                return { y, sx, sz, pExp, nRad: cosAng * 0.85, nY: -sinAng * 0.85 };
              }
            };
            const sl1 = calcUnderSlice(t1);
            const sl2 = calcUnderSlice(t2);
            y1 = sl1.y; y2 = sl2.y;
            s1 = sl1.sx; s2 = sl2.sx;
            sz1 = sl1.sz; sz2 = sl2.sz;
            pExp1 = sl1.pExp; pExp2 = sl2.pExp;
            nRad1 = sl1.nRad; nRad2 = sl2.nRad;
            nY1 = sl1.nY; nY2 = sl2.nY;
          } else {
            const phi1 = t1 * (Math.PI * 0.5);
            const phi2 = t2 * (Math.PI * 0.5);
            y1 = underBaseY + (totalDepth - T + 0.005) * Math.sin(phi1);
            y2 = underBaseY + (totalDepth - T + 0.005) * Math.sin(phi2);
            pExp1 = isSoftRect ? (2.0 + 1.8 * Math.pow(Math.sin(phi1), 1.2)) : 2.0;
            pExp2 = isSoftRect ? (2.0 + 1.8 * Math.pow(Math.sin(phi2), 1.2)) : 2.0;
            s1 = rDrain + (rxRim + wallThick - rDrain) * Math.sin(phi1);
            s2 = rDrain + (rxRim + wallThick - rDrain) * Math.sin(phi2);
            sz1 = rDrain + (rzRim + wallThick - rDrain) * Math.sin(phi1);
            sz2 = rDrain + (rzRim + wallThick - rDrain) * Math.sin(phi2);
            nRad1 = Math.cos(phi1);
            nRad2 = Math.cos(phi2);
            nY1 = -Math.sin(phi1);
            nY2 = -Math.sin(phi2);
          }

          for (let i = 0; i < segs; i++) {
            const th1 = (i / segs) * Math.PI * 2;
            const th2 = ((i + 1) / segs) * Math.PI * 2;

            const c1 = Math.cos(th1);
            const s1m = Math.sin(th1);
            const c2 = Math.cos(th2);
            const s2m = Math.sin(th2);

            const xp1 = Math.sign(c1) * Math.pow(Math.abs(c1), 2 / pExp1);
            const zp1 = Math.sign(s1m) * Math.pow(Math.abs(s1m), 2 / pExp1);
            const xp2 = Math.sign(c2) * Math.pow(Math.abs(c2), 2 / pExp1);
            const zp2 = Math.sign(s2m) * Math.pow(Math.abs(s2m), 2 / pExp1);

            const xq1 = Math.sign(c1) * Math.pow(Math.abs(c1), 2 / pExp2);
            const zq1 = Math.sign(s1m) * Math.pow(Math.abs(s1m), 2 / pExp2);
            const xq2 = Math.sign(c2) * Math.pow(Math.abs(c2), 2 / pExp2);
            const zq2 = Math.sign(s2m) * Math.pow(Math.abs(s2m), 2 / pExp2);

            const pe1: [number, number, number] = [bX + s1 * xp1, y1, bZ + sz1 * zp1];
            const pe2: [number, number, number] = [bX + s1 * xp2, y1, bZ + sz1 * zp2];
            const pe3: [number, number, number] = [bX + s2 * xq2, y2, bZ + sz2 * zq2];
            const pe4: [number, number, number] = [bX + s2 * xq1, y2, bZ + sz2 * zq1];

            const n1: [number, number, number] = [xp1 * nRad1, nY1, zp1 * nRad1];
            const n2: [number, number, number] = [xp2 * nRad1, nY1, zp2 * nRad1];
            const n3: [number, number, number] = [xq2 * nRad2, nY2, zq2 * nRad2];
            const n4: [number, number, number] = [xq1 * nRad2, nY2, zq1 * nRad2];

            pushQuadSmooth(pe1, pe2, pe3, pe4, n1, n2, n3, n4, COLOR_DEFAULT);
          }
        }

        // Detailed Chrome Drain Fitting & Underside Boss (Image 3 & Image 4)
        pushDetailedSinkDrain(bX, bowlFloorY, bZ, underBaseY, false);

      } else if (basinSpec.shape === 'ub-sloped' || basinSpec.id === 'undermount-box') {
        // UB (Undermount Box): Architecturally sloped ramp with vertical front reveal drop & deep rear drainage channel (Images 1 & 2)
        const minX = bX - bW / 2;
        const maxX = bX + bW / 2;
        const minZ = bZ - bD / 2; // Rear wall
        const maxZ = bZ + bD / 2; // Front wall
        const trenchDepth = Math.min(0.060, Math.max(0.042, bD * 0.16)); // ~48mm rear sump trench
        const trenchFrontZ = minZ + trenchDepth;
        const frontDropH = 0.038; // 38mm vertical front drop (Image 1 & 2)
        const frontFloorY = topRimY - frontDropH;
        const trenchFloorY = bowlFloorY; // Deep rear channel floor
        const rampFloorEndY = topRimY - frontDropH - Math.max(0.038, (topRimY - bowlFloorY) * 0.42); // Sloped ramp bottom

        // 1. Front Vertical Reveal Wall (drops from deck rim down to sloped ramp)
        pushQuad(
          [minX, frontFloorY, maxZ],
          [maxX, frontFloorY, maxZ],
          [maxX, topRimY, maxZ],
          [minX, topRimY, maxZ],
          [0, 0, -1],
          COLOR_DEFAULT
        );

        // 2. Sloped Washplane Ramp (descending from front drop towards rear trench)
        const dzR = maxZ - trenchFrontZ;
        const dyR = frontFloorY - rampFloorEndY;
        const lenR = Math.hypot(dyR, dzR);
        const nRamp: [number, number, number] = [0, dzR / lenR, dyR / lenR];
        pushQuad(
          [minX, rampFloorEndY, trenchFrontZ],
          [maxX, rampFloorEndY, trenchFrontZ],
          [maxX, frontFloorY, maxZ],
          [minX, frontFloorY, maxZ],
          nRamp,
          COLOR_DEFAULT
        );

        // 3. Step Drop into Rear Trench (at trenchFrontZ)
        pushQuad(
          [minX, trenchFloorY, trenchFrontZ],
          [maxX, trenchFloorY, trenchFrontZ],
          [maxX, rampFloorEndY, trenchFrontZ],
          [minX, rampFloorEndY, trenchFrontZ],
          [0, 0, -1],
          COLOR_DEFAULT
        );

        // 4. Rear Drainage Trench Floor
        pushQuad(
          [minX, trenchFloorY, minZ],
          [maxX, trenchFloorY, minZ],
          [maxX, trenchFloorY, trenchFrontZ],
          [minX, trenchFloorY, trenchFrontZ],
          [0, 1, 0],
          COLOR_DEFAULT
        );

        // 5. Rear Vertical Wall (rising from trench floor up to deck top rim)
        pushQuad(
          [maxX, trenchFloorY, minZ],
          [minX, trenchFloorY, minZ],
          [minX, topRimY, minZ],
          [maxX, topRimY, minZ],
          [0, 0, 1],
          COLOR_DEFAULT
        );

        // 6. Left Vertical Sidewall (Watertight enclosure at minX)
        pushQuad(
          [minX, rampFloorEndY, trenchFrontZ],
          [minX, frontFloorY, maxZ],
          [minX, topRimY, maxZ],
          [minX, topRimY, trenchFrontZ],
          [1, 0, 0],
          COLOR_DEFAULT
        );
        pushQuad(
          [minX, trenchFloorY, minZ],
          [minX, trenchFloorY, trenchFrontZ],
          [minX, topRimY, trenchFrontZ],
          [minX, topRimY, minZ],
          [1, 0, 0],
          COLOR_DEFAULT
        );

        // 7. Right Vertical Sidewall (Watertight enclosure at maxX)
        pushQuad(
          [maxX, frontFloorY, maxZ],
          [maxX, rampFloorEndY, trenchFrontZ],
          [maxX, topRimY, trenchFrontZ],
          [maxX, topRimY, maxZ],
          [-1, 0, 0],
          COLOR_DEFAULT
        );
        pushQuad(
          [maxX, trenchFloorY, trenchFrontZ],
          [maxX, trenchFloorY, minZ],
          [maxX, topRimY, minZ],
          [maxX, topRimY, trenchFrontZ],
          [-1, 0, 0],
          COLOR_DEFAULT
        );

        // 8. Watertight Underside Shell (Matching stepped cross-section of Image 1)
        const wallT = 0.012;
        pushBox(minX - wallT, frontFloorY - wallT, maxZ, maxX + wallT, bottomDeckY, maxZ + wallT, COLOR_DEFAULT);
        pushQuad(
          [maxX + wallT, rampFloorEndY - wallT, trenchFrontZ],
          [minX - wallT, rampFloorEndY - wallT, trenchFrontZ],
          [minX - wallT, frontFloorY - wallT, maxZ],
          [maxX + wallT, frontFloorY - wallT, maxZ],
          [0, -dzR / lenR, -dyR / lenR],
          COLOR_DEFAULT
        );
        pushBox(minX - wallT, trenchFloorY - wallT, minZ - wallT, maxX + wallT, bottomDeckY, trenchFrontZ, COLOR_DEFAULT);

        // 9. Concealed / Slot Drain in Rear Trench
        pushDetailedSinkDrain(bX, trenchFloorY + 0.001, minZ + trenchDepth * 0.5, trenchFloorY - wallT, false);

      } else if (basinSpec.shape === 'uc-sloped' || basinSpec.id === 'undermount-channel') {
        // UC (Undermount Channel): Continuous sleek slope starting from deck rim to deep rear drainage channel (Images 3 & 4)
        const minX = bX - bW / 2;
        const maxX = bX + bW / 2;
        const minZ = bZ - bD / 2; // Rear wall
        const maxZ = bZ + bD / 2; // Front wall
        const trenchDepth = Math.min(0.060, Math.max(0.042, bD * 0.16)); // ~48mm rear sump trench
        const trenchFrontZ = minZ + trenchDepth;
        const frontDropH = 0.014; // Minimal 14mm reveal from deck rim (Image 3 & 4)
        const frontFloorY = topRimY - frontDropH;
        const trenchFloorY = bowlFloorY; // Deep rear channel floor
        const rampFloorEndY = topRimY - Math.max(0.055, (topRimY - bowlFloorY) * 0.50); // Continuous long incline

        // 1. Front Minimal Lip
        pushQuad(
          [minX, frontFloorY, maxZ],
          [maxX, frontFloorY, maxZ],
          [maxX, topRimY, maxZ],
          [minX, topRimY, maxZ],
          [0, 0, -1],
          COLOR_DEFAULT
        );

        // 2. Continuous Sloped Washplane Ramp (descending full length to rear trench)
        const dzR = maxZ - trenchFrontZ;
        const dyR = frontFloorY - rampFloorEndY;
        const lenR = Math.hypot(dyR, dzR);
        const nRamp: [number, number, number] = [0, dzR / lenR, dyR / lenR];
        pushQuad(
          [minX, rampFloorEndY, trenchFrontZ],
          [maxX, rampFloorEndY, trenchFrontZ],
          [maxX, frontFloorY, maxZ],
          [minX, frontFloorY, maxZ],
          nRamp,
          COLOR_DEFAULT
        );

        // 3. Step Drop into Rear Trench (at trenchFrontZ)
        pushQuad(
          [minX, trenchFloorY, trenchFrontZ],
          [maxX, trenchFloorY, trenchFrontZ],
          [maxX, rampFloorEndY, trenchFrontZ],
          [minX, rampFloorEndY, trenchFrontZ],
          [0, 0, -1],
          COLOR_DEFAULT
        );

        // 4. Rear Drainage Trench Floor
        pushQuad(
          [minX, trenchFloorY, minZ],
          [maxX, trenchFloorY, minZ],
          [maxX, trenchFloorY, trenchFrontZ],
          [minX, trenchFloorY, trenchFrontZ],
          [0, 1, 0],
          COLOR_DEFAULT
        );

        // 5. Rear Vertical Wall
        pushQuad(
          [maxX, trenchFloorY, minZ],
          [minX, trenchFloorY, minZ],
          [minX, topRimY, minZ],
          [maxX, topRimY, minZ],
          [0, 0, 1],
          COLOR_DEFAULT
        );

        // 6. Left Vertical Sidewall (Watertight enclosure at minX)
        pushQuad(
          [minX, rampFloorEndY, trenchFrontZ],
          [minX, frontFloorY, maxZ],
          [minX, topRimY, maxZ],
          [minX, topRimY, trenchFrontZ],
          [1, 0, 0],
          COLOR_DEFAULT
        );
        pushQuad(
          [minX, trenchFloorY, minZ],
          [minX, trenchFloorY, trenchFrontZ],
          [minX, topRimY, trenchFrontZ],
          [minX, topRimY, minZ],
          [1, 0, 0],
          COLOR_DEFAULT
        );

        // 7. Right Vertical Sidewall (Watertight enclosure at maxX)
        pushQuad(
          [maxX, frontFloorY, maxZ],
          [maxX, rampFloorEndY, trenchFrontZ],
          [maxX, topRimY, trenchFrontZ],
          [maxX, topRimY, maxZ],
          [-1, 0, 0],
          COLOR_DEFAULT
        );
        pushQuad(
          [maxX, trenchFloorY, trenchFrontZ],
          [maxX, trenchFloorY, minZ],
          [maxX, topRimY, minZ],
          [maxX, topRimY, trenchFrontZ],
          [-1, 0, 0],
          COLOR_DEFAULT
        );

        // 8. Watertight Underside Shell (Continuous wedge tapering to rear sump, matching side profile of Image 4)
        const wallT = 0.012;
        pushQuad(
          [maxX + wallT, rampFloorEndY - wallT, trenchFrontZ],
          [minX - wallT, rampFloorEndY - wallT, trenchFrontZ],
          [minX - wallT, bottomDeckY, maxZ],
          [maxX + wallT, bottomDeckY, maxZ],
          [0, -dzR / lenR, -dyR / lenR],
          COLOR_DEFAULT
        );
        pushBox(minX - wallT, trenchFloorY - wallT, minZ - wallT, maxX + wallT, bottomDeckY, trenchFrontZ, COLOR_DEFAULT);

        // 9. Concealed / Slot Drain in Rear Trench
        pushDetailedSinkDrain(bX, trenchFloorY + 0.001, minZ + trenchDepth * 0.5, trenchFloorY - wallT, false);

      } else if (basinSpec.shape === 'wdt-sloped' || basinSpec.id === 'washdesk-trough') {
        // WDT (Washdesk Trough): Sloping SIDEWAYS (left-to-right or right-to-left across the trough span)
        const isLeftDeep = (cfg.wdtSlopeDirection || 'right-to-left') === 'right-to-left';
        const minX = bX - bW / 2;
        const maxX = bX + bW / 2;
        const minZ = bZ - bD / 2; // Rear wall
        const maxZ = bZ + bD / 2; // Front wall
        const deepFloorY = bowlFloorY; // Deep floor level (~120-140mm below deck)

        // User-configurable slope angle in degrees
        const slopeDeg = (typeof cfg.wdtSlopeAngleDeg === 'number' && cfg.wdtSlopeAngleDeg > 0)
          ? cfg.wdtSlopeAngleDeg
          : 8; // Default 8 degrees
        const rad = (slopeDeg * Math.PI) / 180;
        const calculatedFall = bW * Math.tan(rad);
        const maxAllowableFall = Math.max(0.030, (topRimY - deepFloorY) - 0.020);
        const actualFall = Math.min(maxAllowableFall, Math.max(0.015, calculatedFall));
        const shallowFloorY = deepFloorY + actualFall;

        const floorLeftY = isLeftDeep ? deepFloorY : shallowFloorY;
        const floorRightY = isLeftDeep ? shallowFloorY : deepFloorY;

        // Normal of sideways sloped floor (tilted across X):
        const dx = maxX - minX;
        const dy = floorRightY - floorLeftY;
        const len = Math.hypot(dy, dx);
        const nFloor: [number, number, number] = [-dy / len, dx / len, 0];

        // 1. Sideways Sloped Basin Floor
        pushQuad(
          [minX, floorLeftY, maxZ],
          [maxX, floorRightY, maxZ],
          [maxX, floorRightY, minZ],
          [minX, floorLeftY, minZ],
          nFloor,
          COLOR_DEFAULT
        );

        // 2. Front Vertical Trapezoid Wall (at maxZ, facing -Z into basin)
        pushQuad(
          [minX, floorLeftY, maxZ],
          [maxX, floorRightY, maxZ],
          [maxX, topRimY, maxZ],
          [minX, topRimY, maxZ],
          [0, 0, -1],
          COLOR_DEFAULT
        );

        // 3. Rear Vertical Trapezoid Wall (at minZ, facing +Z into basin)
        pushQuad(
          [maxX, floorRightY, minZ],
          [minX, floorLeftY, minZ],
          [minX, topRimY, minZ],
          [maxX, topRimY, minZ],
          [0, 0, 1],
          COLOR_DEFAULT
        );

        // 4. Left Vertical End Wall (at minX, facing +X into basin)
        pushQuad(
          [minX, floorLeftY, minZ],
          [minX, floorLeftY, maxZ],
          [minX, topRimY, maxZ],
          [minX, topRimY, minZ],
          [1, 0, 0],
          COLOR_DEFAULT
        );

        // 5. Right Vertical End Wall (at maxX, facing -X into basin)
        pushQuad(
          [maxX, floorRightY, maxZ],
          [maxX, floorRightY, minZ],
          [maxX, topRimY, minZ],
          [maxX, topRimY, maxZ],
          [-1, 0, 0],
          COLOR_DEFAULT
        );

        // 6. Watertight Underside Shell (Sideways wedge profile - matching WDT reference icon!)
        const wallT = 0.012;
        const underLeftY = floorLeftY - wallT;
        const underRightY = floorRightY - wallT;

        // Sloped underside belly (sloping sideways)
        pushQuad(
          [maxX + wallT, underRightY, minZ - wallT],
          [maxX + wallT, underRightY, maxZ + wallT],
          [minX - wallT, underLeftY, maxZ + wallT],
          [minX - wallT, underLeftY, minZ - wallT],
          [dy / len, -dx / len, 0],
          COLOR_DEFAULT
        );

        // Front exterior trapezoid face
        pushQuad(
          [minX - wallT, underLeftY, maxZ + wallT],
          [maxX + wallT, underRightY, maxZ + wallT],
          [maxX + wallT, bottomDeckY, maxZ + wallT],
          [minX - wallT, bottomDeckY, maxZ + wallT],
          [0, 0, 1],
          COLOR_DEFAULT
        );

        // Rear exterior trapezoid face
        pushQuad(
          [maxX + wallT, underRightY, minZ - wallT],
          [minX - wallT, underLeftY, minZ - wallT],
          [minX - wallT, bottomDeckY, minZ - wallT],
          [maxX + wallT, bottomDeckY, minZ - wallT],
          [0, 0, -1],
          COLOR_DEFAULT
        );

        // Left exterior end wall
        pushQuad(
          [minX - wallT, underLeftY, maxZ + wallT],
          [minX - wallT, underLeftY, minZ - wallT],
          [minX - wallT, bottomDeckY, minZ - wallT],
          [minX - wallT, bottomDeckY, maxZ + wallT],
          [-1, 0, 0],
          COLOR_DEFAULT
        );

        // Right exterior end wall
        pushQuad(
          [maxX + wallT, underRightY, minZ - wallT],
          [maxX + wallT, underRightY, maxZ + wallT],
          [maxX + wallT, bottomDeckY, maxZ + wallT],
          [maxX + wallT, bottomDeckY, minZ - wallT],
          [1, 0, 0],
          COLOR_DEFAULT
        );

        // 7. Pop-up Circular Chrome Drain at Deep End (Matching WDT icon)
        const drainOffset = Math.min(0.120, bW * 0.22);
        const drainX = isLeftDeep ? (minX + drainOffset) : (maxX - drainOffset);
        pushDetailedSinkDrain(drainX, deepFloorY + 0.001, bZ, deepFloorY - wallT, false);

      } else if (basinSpec.shape === 'sloped') {
        // Generic Linear Washplane Trough
        const minX = bX - bW / 2;
        const maxX = bX + bW / 2;
        const minZ = bZ - bD / 2;
        const maxZ = bZ + bD / 2;
        const floorBackY = bowlFloorY;
        const floorFrontY = topY - 0.030;

        pushQuad([minX, floorFrontY, maxZ], [maxX, floorFrontY, maxZ], [maxX, topY, maxZ], [minX, topY, maxZ], [0, 0, -1], COLOR_DEFAULT);
        pushQuad([minX, floorBackY, minZ + 0.045], [maxX, floorBackY, minZ + 0.045], [maxX, floorFrontY, maxZ], [minX, floorFrontY, maxZ], [0, 0.95, 0.31], COLOR_DEFAULT);
        pushQuad([maxX, floorBackY, minZ], [minX, floorBackY, minZ], [minX, topY, minZ], [maxX, topY, minZ], [0, 0, 1], COLOR_DEFAULT);
        pushQuad([minX, floorBackY, minZ], [minX, floorFrontY, maxZ], [minX, topY, maxZ], [minX, topY, minZ], [1, 0, 0], COLOR_DEFAULT);
        pushQuad([maxX, floorFrontY, maxZ], [maxX, floorBackY, minZ], [maxX, topY, minZ], [maxX, topY, maxZ], [-1, 0, 0], COLOR_DEFAULT);
        pushQuad([minX, floorBackY, minZ], [maxX, floorBackY, minZ], [maxX, floorBackY, minZ + 0.045], [minX, floorBackY, minZ + 0.045], [0, 1, 0], COLOR_DEFAULT);
        pushBox(minX - 0.012, floorBackY - 0.012, minZ - 0.012, maxX + 0.012, bottomDeckY, maxZ + 0.012, COLOR_DEFAULT);
        pushDetailedSinkDrain(bX, floorBackY + 0.001, minZ + 0.022, floorBackY - 0.012, false);

      } else {
        // B (Rectangular Box)
        const minX = bX - bW / 2;
        const maxX = bX + bW / 2;
        const minZ = bZ - bD / 2;
        const maxZ = bZ + bD / 2;

        // 4 vertical walls dropping from deck topRimY down to bowl floor
        pushQuad([minX, bowlFloorY, maxZ], [maxX, bowlFloorY, maxZ], [maxX, topRimY, maxZ], [minX, topRimY, maxZ], [0, 0, -1], COLOR_DEFAULT);
        pushQuad([maxX, bowlFloorY, minZ], [minX, bowlFloorY, minZ], [minX, topRimY, minZ], [maxX, topRimY, minZ], [0, 0, 1], COLOR_DEFAULT);
        pushQuad([minX, bowlFloorY, minZ], [minX, bowlFloorY, maxZ], [minX, topRimY, maxZ], [minX, topRimY, minZ], [1, 0, 0], COLOR_DEFAULT);
        pushQuad([maxX, bowlFloorY, maxZ], [maxX, bowlFloorY, minZ], [maxX, topRimY, minZ], [maxX, topRimY, maxZ], [-1, 0, 0], COLOR_DEFAULT);

        if (isTopMount) {
          const fl = 0.016;
          // Outer overlapping rim collar on deck
          pushQuad([minX - fl, topRimY, maxZ + fl], [maxX + fl, topRimY, maxZ + fl], [maxX, topRimY, maxZ], [minX, topRimY, maxZ], [0, 1, 0], COLOR_DEFAULT);
          pushQuad([maxX + fl, topRimY, minZ - fl], [minX - fl, topRimY, minZ - fl], [minX, topRimY, minZ], [maxX, topRimY, minZ], [0, 1, 0], COLOR_DEFAULT);
          pushQuad([minX - fl, topRimY, minZ - fl], [minX, topRimY, minZ], [minX, topRimY, maxZ], [minX - fl, topRimY, maxZ + fl], [0, 1, 0], COLOR_DEFAULT);
          pushQuad([maxX, topRimY, minZ], [maxX + fl, topRimY, minZ - fl], [maxX + fl, topRimY, maxZ + fl], [maxX, topRimY, maxZ], [0, 1, 0], COLOR_DEFAULT);
          // Vertical drop to deck topY
          pushQuad([minX - fl, topY, maxZ + fl], [maxX + fl, topY, maxZ + fl], [maxX + fl, topRimY, maxZ + fl], [minX - fl, topRimY, maxZ + fl], [0, 0, 1], COLOR_DEFAULT);
          pushQuad([maxX + fl, topY, minZ - fl], [minX - fl, topY, minZ - fl], [minX - fl, topRimY, minZ - fl], [maxX + fl, topRimY, minZ - fl], [0, 0, -1], COLOR_DEFAULT);
          pushQuad([minX - fl, topY, minZ - fl], [minX - fl, topY, maxZ + fl], [minX - fl, topRimY, maxZ + fl], [minX - fl, topRimY, minZ - fl], [-1, 0, 0], COLOR_DEFAULT);
          pushQuad([maxX + fl, topY, maxZ + fl], [maxX + fl, topY, minZ - fl], [maxX + fl, topRimY, minZ - fl], [maxX + fl, topRimY, maxZ + fl], [1, 0, 0], COLOR_DEFAULT);
        }

        // Flat horizontal basin floor
        pushQuad([minX, bowlFloorY, minZ], [maxX, bowlFloorY, minZ], [maxX, bowlFloorY, maxZ], [minX, bowlFloorY, maxZ], [0, 1, 0], COLOR_DEFAULT);

        // Underside shell
        pushBox(minX - 0.012, bowlFloorY - 0.012, minZ - 0.012, maxX + 0.012, bottomDeckY, maxZ + 0.012, COLOR_DEFAULT);

        // Detailed Chrome Pop-Up Drain
        pushDetailedSinkDrain(bX, bowlFloorY + 0.001, bZ, bowlFloorY - 0.012, false);
      }
    }
  }

  // -------------------------------------------------------------
  // 3. CNC Drilled Tap Holes on Deck (ONLY drilled bore holes; zero taps!)
  // Exactly matches user instruction: "i do not wnat any taps there i just want hole where i want it to be"
  // -------------------------------------------------------------
  if (hasTopTap) {
    const basinBackEdgeZ = !isNoBasin ? (bZ - rz) : halfD;
    // Position tap hole cleanly in the deck bridge behind the basin, centered between splashback and basin rim
    const rearClearanceStart = rearObstacleZ + 0.012;
    const tapHoleZ = !isNoBasin
      ? Math.min(basinBackEdgeZ - 0.032, (rearClearanceStart + basinBackEdgeZ) / 2)
      : (rearObstacleZ + 0.065);

    const holeRadius = Math.max(0.015, (cfg.tapHoleDiameterMm ? cfg.tapHoleDiameterMm / 2000 : 0.0175)); // Standard 35mm diameter CNC tap hole
    const arrisRadius = holeRadius + 0.0025; // 2.5mm machined CNC arris bevel rim
    const segs = 32;

    const drillHoleAt = (hx: number) => {
      const rimY = topY + 0.0006;
      for (let i = 0; i < segs; i++) {
        const a1 = (i / segs) * Math.PI * 2;
        const a2 = ((i + 1) / segs) * Math.PI * 2;
        const c1 = Math.cos(a1);
        const s1 = Math.sin(a1);
        const c2 = Math.cos(a2);
        const s2 = Math.sin(a2);

        // 1. CNC Machined Arris Bevel Ring on Deck Surface (crisp outline visible from all angles)
        const p1: [number, number, number] = [hx + arrisRadius * c1, rimY, tapHoleZ + arrisRadius * s1];
        const p2: [number, number, number] = [hx + arrisRadius * c2, rimY, tapHoleZ + arrisRadius * s2];
        const p3: [number, number, number] = [hx + holeRadius * c2, topY, tapHoleZ + holeRadius * s2];
        const p4: [number, number, number] = [hx + holeRadius * c1, topY, tapHoleZ + holeRadius * s1];
        pushQuadSmooth(p1, p2, p3, p4, [0, 1, 0], [0, 1, 0], [-c2 * 0.4, 0.9, -s2 * 0.4], [-c1 * 0.4, 0.9, -s1 * 0.4], COLOR_DEFAULT);

        // 2. Inward-facing cylindrical CNC bore hole walls penetrating down through the slab
        const pb1: [number, number, number] = [hx + holeRadius * c1, topY, tapHoleZ + holeRadius * s1];
        const pb2: [number, number, number] = [hx + holeRadius * c2, topY, tapHoleZ + holeRadius * s2];
        const pb3: [number, number, number] = [hx + holeRadius * c2, bottomDeckY - 0.008, tapHoleZ + holeRadius * s2];
        const pb4: [number, number, number] = [hx + holeRadius * c1, bottomDeckY - 0.008, tapHoleZ + holeRadius * s1];
        pushQuad(pb1, pb2, pb3, pb4, [-c1, 0, -s1], COLOR_DARK_HOLE);

        // 3. Bottom hole interior aperture floor disc
        const pFloor1: [number, number, number] = [hx + holeRadius * c1, bottomDeckY - 0.008, tapHoleZ + holeRadius * s1];
        const pFloor2: [number, number, number] = [hx + holeRadius * c2, bottomDeckY - 0.008, tapHoleZ + holeRadius * s2];
        pushTri([hx, bottomDeckY - 0.008, tapHoleZ], pFloor1, pFloor2, [0, 1, 0], COLOR_DARK_HOLE);
      }
    };

    const numHoles = cfg.tapHoles ?? 1;
    if (numHoles === 1) {
      drillHoleAt(bX);
    } else if (numHoles === 2) {
      drillHoleAt(bX - 0.075);
      drillHoleAt(bX + 0.075);
    } else if (numHoles === 3) {
      drillHoleAt(bX - 0.10);
      drillHoleAt(bX);
      drillHoleAt(bX + 0.10);
    }
  }

  // -------------------------------------------------------------
  // 5. Front Downstand Apron (with Towel Holder Slot Fillet)
  // -------------------------------------------------------------
  if (hasFrontDownstand && downstandH > 0) {
    const apronBottomY = bottomDeckY - downstandH;
    const apronZMin = halfD - 0.015;
    const apronZMax = halfD;

    const apronLeftX = leftX + leftCornerExt;
    const apronRightX = rightX - rightCornerExt;

    if (cfg.towelHolder?.enabled && downstandH >= 0.10) {
      const slotLength = Math.min((cfg.towelHolder.lengthMm || 350) / 1000, (apronRightX - apronLeftX) * 0.65);
      const slotHeight = 0.04;
      const deckMid = (apronLeftX + apronRightX) / 2;
      const slotCenterX = cfg.towelHolder.position === 'left'
        ? apronLeftX + slotLength / 2 + 0.08
        : cfg.towelHolder.position === 'right'
        ? apronRightX - slotLength / 2 - 0.08
        : deckMid;

      const slotMinX = slotCenterX - slotLength / 2;
      const slotMaxX = slotCenterX + slotLength / 2;
      const slotMidY = apronBottomY + downstandH / 2;
      const slotMinY = slotMidY - slotHeight / 2;
      const slotMaxY = slotMidY + slotHeight / 2;

      // Slot corner fillet (R4, R12, R25 mm)
      // Clamped so 2 * r does not exceed slotHeight (40mm)
      const maxPossibleR = slotHeight / 2;
      const reqFilletR = ((cfg.towelHolder.cornerRadius || cfg.towelHolder.filletMm || 12) / 1000);
      const slotFilletR = Math.max(0, Math.min(reqFilletR, maxPossibleR));

      // Apron panels around the towel slot
      if (slotMinX > apronLeftX) pushBox(apronLeftX, apronBottomY, apronZMin, slotMinX, bottomDeckY, apronZMax);
      if (apronRightX > slotMaxX) pushBox(slotMaxX, apronBottomY, apronZMin, apronRightX, bottomDeckY, apronZMax);
      pushBox(slotMinX, slotMaxY, apronZMin, slotMaxX, bottomDeckY, apronZMax);
      pushBox(slotMinX, apronBottomY, apronZMin, slotMaxX, slotMinY, apronZMax);

      const r = slotFilletR;
      if (r > 0.002) {
        const leftCX = slotMinX + r;
        const rightCX = slotMaxX - r;
        const topCY = slotMaxY - r;
        const botCY = slotMinY + r;

        // Top & Bottom horizontal reveals between the fillets
        if (rightCX > leftCX) {
          pushQuad([leftCX, slotMaxY, apronZMin], [rightCX, slotMaxY, apronZMin], [rightCX, slotMaxY, apronZMax], [leftCX, slotMaxY, apronZMax], [0, -1, 0]);
          pushQuad([leftCX, slotMinY, apronZMax], [rightCX, slotMinY, apronZMax], [rightCX, slotMinY, apronZMin], [leftCX, slotMinY, apronZMin], [0, 1, 0]);
        }

        // Left & Right straight vertical reveals (when slotHeight > 2 * r)
        if (topCY > botCY) {
          pushQuad([slotMinX, botCY, apronZMin], [slotMinX, topCY, apronZMin], [slotMinX, topCY, apronZMax], [slotMinX, botCY, apronZMax], [1, 0, 0]);
          pushQuad([slotMaxX, botCY, apronZMax], [slotMaxX, topCY, apronZMax], [slotMaxX, topCY, apronZMin], [slotMaxX, botCY, apronZMin], [-1, 0, 0]);
        }

        const segs = 6;

        // 1. Top-Left Corner Fillet & Solid Front/Rear Face Fill
        for (let s = 0; s < segs; s++) {
          const a1 = Math.PI - (s / segs) * (Math.PI * 0.5);
          const a2 = Math.PI - ((s + 1) / segs) * (Math.PI * 0.5);
          const x1 = leftCX + r * Math.cos(a1);
          const y1 = topCY + r * Math.sin(a1);
          const x2 = leftCX + r * Math.cos(a2);
          const y2 = topCY + r * Math.sin(a2);

          // Inner curved reveal
          pushQuadSmooth(
            [x1, y1, apronZMin],
            [x2, y2, apronZMin],
            [x2, y2, apronZMax],
            [x1, y1, apronZMax],
            [-Math.cos(a1), -Math.sin(a1), 0],
            [-Math.cos(a2), -Math.sin(a2), 0],
            [-Math.cos(a2), -Math.sin(a2), 0],
            [-Math.cos(a1), -Math.sin(a1), 0]
          );

          // Solid front & rear corner fill (prevent transparent gaps)
          pushTri([slotMinX, slotMaxY, apronZMax], [x1, y1, apronZMax], [x2, y2, apronZMax], [0, 0, 1]);
          pushTri([slotMinX, slotMaxY, apronZMin], [x2, y2, apronZMin], [x1, y1, apronZMin], [0, 0, -1]);
        }

        // 2. Bottom-Left Corner Fillet & Solid Front/Rear Face Fill
        for (let s = 0; s < segs; s++) {
          const a1 = Math.PI + (s / segs) * (Math.PI * 0.5);
          const a2 = Math.PI + ((s + 1) / segs) * (Math.PI * 0.5);
          const x1 = leftCX + r * Math.cos(a1);
          const y1 = botCY + r * Math.sin(a1);
          const x2 = leftCX + r * Math.cos(a2);
          const y2 = botCY + r * Math.sin(a2);

          // Inner curved reveal
          pushQuadSmooth(
            [x1, y1, apronZMin],
            [x2, y2, apronZMin],
            [x2, y2, apronZMax],
            [x1, y1, apronZMax],
            [-Math.cos(a1), -Math.sin(a1), 0],
            [-Math.cos(a2), -Math.sin(a2), 0],
            [-Math.cos(a2), -Math.sin(a2), 0],
            [-Math.cos(a1), -Math.sin(a1), 0]
          );

          // Solid front & rear corner fill (prevent transparent gaps)
          pushTri([slotMinX, slotMinY, apronZMax], [x2, y2, apronZMax], [x1, y1, apronZMax], [0, 0, 1]);
          pushTri([slotMinX, slotMinY, apronZMin], [x1, y1, apronZMin], [x2, y2, apronZMin], [0, 0, -1]);
        }

        // 3. Top-Right Corner Fillet & Solid Front/Rear Face Fill
        for (let s = 0; s < segs; s++) {
          const a1 = (Math.PI * 0.5) - (s / segs) * (Math.PI * 0.5);
          const a2 = (Math.PI * 0.5) - ((s + 1) / segs) * (Math.PI * 0.5);
          const x1 = rightCX + r * Math.cos(a1);
          const y1 = topCY + r * Math.sin(a1);
          const x2 = rightCX + r * Math.cos(a2);
          const y2 = topCY + r * Math.sin(a2);

          // Inner curved reveal
          pushQuadSmooth(
            [x1, y1, apronZMin],
            [x2, y2, apronZMin],
            [x2, y2, apronZMax],
            [x1, y1, apronZMax],
            [-Math.cos(a1), -Math.sin(a1), 0],
            [-Math.cos(a2), -Math.sin(a2), 0],
            [-Math.cos(a2), -Math.sin(a2), 0],
            [-Math.cos(a1), -Math.sin(a1), 0]
          );

          // Solid front & rear corner fill (prevent transparent gaps)
          pushTri([slotMaxX, slotMaxY, apronZMax], [x1, y1, apronZMax], [x2, y2, apronZMax], [0, 0, 1]);
          pushTri([slotMaxX, slotMaxY, apronZMin], [x2, y2, apronZMin], [x1, y1, apronZMin], [0, 0, -1]);
        }

        // 4. Bottom-Right Corner Fillet & Solid Front/Rear Face Fill
        for (let s = 0; s < segs; s++) {
          const a1 = - (s / segs) * (Math.PI * 0.5);
          const a2 = - ((s + 1) / segs) * (Math.PI * 0.5);
          const x1 = rightCX + r * Math.cos(a1);
          const y1 = botCY + r * Math.sin(a1);
          const x2 = rightCX + r * Math.cos(a2);
          const y2 = botCY + r * Math.sin(a2);

          // Inner curved reveal
          pushQuadSmooth(
            [x1, y1, apronZMin],
            [x2, y2, apronZMin],
            [x2, y2, apronZMax],
            [x1, y1, apronZMax],
            [-Math.cos(a1), -Math.sin(a1), 0],
            [-Math.cos(a2), -Math.sin(a2), 0],
            [-Math.cos(a2), -Math.sin(a2), 0],
            [-Math.cos(a1), -Math.sin(a1), 0]
          );

          // Solid front & rear corner fill (prevent transparent gaps)
          pushTri([slotMaxX, slotMinY, apronZMax], [x1, y1, apronZMax], [x2, y2, apronZMax], [0, 0, 1]);
          pushTri([slotMaxX, slotMinY, apronZMin], [x2, y2, apronZMin], [x1, y1, apronZMin], [0, 0, -1]);
        }
      } else {
        // Sharp rectangular slot reveals
        pushQuad([slotMinX, slotMaxY, apronZMin], [slotMaxX, slotMaxY, apronZMin], [slotMaxX, slotMaxY, apronZMax], [slotMinX, slotMaxY, apronZMax], [0, -1, 0]);
        pushQuad([slotMinX, slotMinY, apronZMax], [slotMaxX, slotMinY, apronZMax], [slotMaxX, slotMinY, apronZMin], [slotMinX, slotMinY, apronZMin], [0, 1, 0]);
        pushQuad([slotMinX, slotMinY, apronZMin], [slotMinX, slotMaxY, apronZMin], [slotMinX, slotMaxY, apronZMax], [slotMinX, slotMinY, apronZMax], [1, 0, 0]);
        pushQuad([slotMaxX, slotMinY, apronZMax], [slotMaxX, slotMaxY, apronZMax], [slotMaxX, slotMaxY, apronZMin], [slotMaxX, slotMinY, apronZMin], [-1, 0, 0]);
      }
    } else {
      pushBox(apronLeftX, apronBottomY, apronZMin, apronRightX, bottomDeckY, apronZMax);
    }

    // Apron drop under Corner Chamfers / Fillets
    const apronThick = 0.015;
    if (leftCornerType === 'chamfer' && leftChamferC > 0) {
      const cL = leftChamferC;
      const invSqrt2 = Math.SQRT1_2;
      const nChamfer: [number, number, number] = [-invSqrt2, 0, invSqrt2];
      pushQuad(
        [leftX, apronBottomY, halfD - cL],
        [leftX + cL, apronBottomY, halfD],
        [leftX + cL, bottomDeckY, halfD],
        [leftX, bottomDeckY, halfD - cL],
        nChamfer
      );
      // Bottom closure face across 15mm apron thickness
      const inX1 = leftX + apronThick;
      const inZ1 = halfD - cL;
      const inX2 = leftX + cL;
      const inZ2 = halfD - apronThick;
      pushQuad(
        [leftX, apronBottomY, halfD - cL],
        [inX1, apronBottomY, inZ1],
        [inX2, apronBottomY, inZ2],
        [leftX + cL, apronBottomY, halfD],
        [0, -1, 0]
      );
    } else if (leftCornerType === 'fillet' && leftFilletR > 0) {
      const rL = leftFilletR;
      const cX = leftX + rL;
      const cZ = halfD - rL;
      const arcSegs = 18;
      const rIn = Math.max(0, rL - apronThick);

      for (let i = 0; i < arcSegs; i++) {
        const a1 = Math.PI - (i / arcSegs) * (Math.PI / 2);
        const a2 = Math.PI - ((i + 1) / arcSegs) * (Math.PI / 2);
        const x1 = cX + rL * Math.cos(a1);
        const z1 = cZ + rL * Math.sin(a1);
        const x2 = cX + rL * Math.cos(a2);
        const z2 = cZ + rL * Math.sin(a2);
        const n1: [number, number, number] = [Math.cos(a1), 0, Math.sin(a1)];
        const n2: [number, number, number] = [Math.cos(a2), 0, Math.sin(a2)];

        // Exterior curved apron face
        pushQuadSmooth(
          [x1, apronBottomY, z1],
          [x2, apronBottomY, z2],
          [x2, bottomDeckY, z2],
          [x1, bottomDeckY, z1],
          n1, n2, n2, n1
        );

        // Bottom lip closure at apronBottomY
        if (rIn > 0.001) {
          const x1In = cX + rIn * Math.cos(a1);
          const z1In = cZ + rIn * Math.sin(a1);
          const x2In = cX + rIn * Math.cos(a2);
          const z2In = cZ + rIn * Math.sin(a2);
          pushQuadSmooth(
            [x2In, apronBottomY, z2In],
            [x2, apronBottomY, z2],
            [x1, apronBottomY, z1],
            [x1In, apronBottomY, z1In],
            [0, -1, 0], [0, -1, 0], [0, -1, 0], [0, -1, 0]
          );
        } else {
          pushTri([cX, apronBottomY, cZ], [x2, apronBottomY, z2], [x1, apronBottomY, z1], [0, -1, 0]);
        }
      }
    }

    if (rightCornerType === 'chamfer' && rightChamferC > 0) {
      const cR = rightChamferC;
      const invSqrt2 = Math.SQRT1_2;
      const nChamfer: [number, number, number] = [invSqrt2, 0, invSqrt2];
      pushQuad(
        [rightX - cR, apronBottomY, halfD],
        [rightX, apronBottomY, halfD - cR],
        [rightX, bottomDeckY, halfD - cR],
        [rightX - cR, bottomDeckY, halfD],
        nChamfer
      );
      // Bottom closure face across 15mm apron thickness
      const inX1 = rightX - cR;
      const inZ1 = halfD - apronThick;
      const inX2 = rightX - apronThick;
      const inZ2 = halfD - cR;
      pushQuad(
        [rightX - cR, apronBottomY, halfD],
        [inX1, apronBottomY, inZ1],
        [inX2, apronBottomY, inZ2],
        [rightX, apronBottomY, halfD - cR],
        [0, -1, 0]
      );
    } else if (rightCornerType === 'fillet' && rightFilletR > 0) {
      const rR = rightFilletR;
      const cX = rightX - rR;
      const cZ = halfD - rR;
      const arcSegs = 18;
      const rIn = Math.max(0, rR - apronThick);

      for (let i = 0; i < arcSegs; i++) {
        const a1 = (Math.PI / 2) - (i / arcSegs) * (Math.PI / 2);
        const a2 = (Math.PI / 2) - ((i + 1) / arcSegs) * (Math.PI / 2);
        const x1 = cX + rR * Math.cos(a1);
        const z1 = cZ + rR * Math.sin(a1);
        const x2 = cX + rR * Math.cos(a2);
        const z2 = cZ + rR * Math.sin(a2);
        const n1: [number, number, number] = [Math.cos(a1), 0, Math.sin(a1)];
        const n2: [number, number, number] = [Math.cos(a2), 0, Math.sin(a2)];

        // Exterior curved apron face
        pushQuadSmooth(
          [x1, apronBottomY, z1],
          [x2, apronBottomY, z2],
          [x2, bottomDeckY, z2],
          [x1, bottomDeckY, z1],
          n1, n2, n2, n1
        );

        // Bottom lip closure at apronBottomY
        if (rIn > 0.001) {
          const x1In = cX + rIn * Math.cos(a1);
          const z1In = cZ + rIn * Math.sin(a1);
          const x2In = cX + rIn * Math.cos(a2);
          const z2In = cZ + rIn * Math.sin(a2);
          pushQuadSmooth(
            [x1In, apronBottomY, z1In],
            [x1, apronBottomY, z1],
            [x2, apronBottomY, z2],
            [x2In, apronBottomY, z2In],
            [0, -1, 0], [0, -1, 0], [0, -1, 0], [0, -1, 0]
          );
        } else {
          pushTri([cX, apronBottomY, cZ], [x1, apronBottomY, z1], [x2, apronBottomY, z2], [0, -1, 0]);
        }
      }
    }
  }

  // 6. Left Return Downstand (Apron)
  if (hasLeftDownstand && downstandH > 0) {
    const apronBottomY = bottomDeckY - downstandH;
    const endZ = halfD - leftCornerExt;
    pushBox(leftX, apronBottomY, -halfD, leftX + 0.015, bottomDeckY, endZ);
  }

  // 7. Right Return Downstand (Apron)
  if (hasRightDownstand && downstandH > 0) {
    const apronBottomY = bottomDeckY - downstandH;
    const endZ = halfD - rightCornerExt;
    pushBox(rightX - 0.015, apronBottomY, -halfD, rightX, bottomDeckY, endZ);
  }

  // 8. Rear Upstand (Splashback Wall) - Supports Standard 80mm & Full Coved
  if (hasBackUpstand && effectiveUpstandH > 0) {
    const upstandTopY = topY + effectiveUpstandH;
    const upstandThick = 0.015;
    const upstandFrontZ = -halfD + upstandThick;

    // Upstand solid surface wall body
    pushBox(leftX, topY, -halfD, rightX, upstandTopY, upstandFrontZ, COLOR_DEFAULT);

    // Architectural Coved Wall Junction (R10 concave cove fusion)
    const isCoved = Boolean(cfg.isCovedUpstand ?? cfg.upstands?.coved ?? cfg.upstands?.isCoved);
    if (isCoved) {
      const coveR = Math.min(0.012, effectiveUpstandH * 0.25);
      const coveSegs = 8;
      for (let i = 0; i < coveSegs; i++) {
        const a1 = (i / coveSegs) * (Math.PI * 0.5);
        const a2 = ((i + 1) / coveSegs) * (Math.PI * 0.5);
        const y1 = topY + coveR * (1 - Math.sin(a1));
        const y2 = topY + coveR * (1 - Math.sin(a2));
        const z1 = upstandFrontZ + coveR * (1 - Math.cos(a1));
        const z2 = upstandFrontZ + coveR * (1 - Math.cos(a2));

        const n1: [number, number, number] = [0, Math.cos(a1), Math.sin(a1)];
        const n2: [number, number, number] = [0, Math.cos(a2), Math.sin(a2)];

        pushQuadSmooth(
          [leftX, y1, z1],
          [rightX, y1, z1],
          [rightX, y2, z2],
          [leftX, y2, z2],
          n1, n1, n2, n2,
          COLOR_DEFAULT
        );
      }
    }
  }

  // 9. Left Return Upstand
  if (hasLeftUpstand && effectiveUpstandH > 0) {
    const upstandTopY = topY + effectiveUpstandH;
    const startZ = hasBackUpstand ? -halfD + 0.015 : -halfD;
    pushBox(leftX, topY, startZ, leftX + 0.015, upstandTopY, halfD, COLOR_DEFAULT);

    const isCoved = Boolean(cfg.isCovedUpstand ?? cfg.upstands?.coved ?? cfg.upstands?.isCoved);
    if (isCoved) {
      const coveR = Math.min(0.012, effectiveUpstandH * 0.25);
      const coveSegs = 6;
      const innerX = leftX + 0.015;
      for (let i = 0; i < coveSegs; i++) {
        const a1 = (i / coveSegs) * (Math.PI * 0.5);
        const a2 = ((i + 1) / coveSegs) * (Math.PI * 0.5);
        const y1 = topY + coveR * (1 - Math.sin(a1));
        const y2 = topY + coveR * (1 - Math.sin(a2));
        const x1 = innerX + coveR * (1 - Math.cos(a1));
        const x2 = innerX + coveR * (1 - Math.cos(a2));
        const n1: [number, number, number] = [Math.cos(a1), Math.sin(a1), 0];
        const n2: [number, number, number] = [Math.cos(a2), Math.sin(a2), 0];
        pushQuadSmooth(
          [x1, y1, halfD],
          [x1, y1, startZ],
          [x2, y2, startZ],
          [x2, y2, halfD],
          n1, n1, n2, n2,
          COLOR_DEFAULT
        );
      }
    }
  }

  // 10. Right Return Upstand
  if (hasRightUpstand && effectiveUpstandH > 0) {
    const upstandTopY = topY + effectiveUpstandH;
    const startZ = hasBackUpstand ? -halfD + 0.015 : -halfD;
    pushBox(rightX - 0.015, topY, startZ, rightX, upstandTopY, halfD, COLOR_DEFAULT);

    const isCoved = Boolean(cfg.isCovedUpstand ?? cfg.upstands?.coved ?? cfg.upstands?.isCoved);
    if (isCoved) {
      const coveR = Math.min(0.012, effectiveUpstandH * 0.25);
      const coveSegs = 6;
      const innerX = rightX - 0.015;
      for (let i = 0; i < coveSegs; i++) {
        const a1 = (i / coveSegs) * (Math.PI * 0.5);
        const a2 = ((i + 1) / coveSegs) * (Math.PI * 0.5);
        const y1 = topY + coveR * (1 - Math.sin(a1));
        const y2 = topY + coveR * (1 - Math.sin(a2));
        const x1 = innerX - coveR * (1 - Math.cos(a1));
        const x2 = innerX - coveR * (1 - Math.cos(a2));
        const n1: [number, number, number] = [-Math.cos(a1), Math.sin(a1), 0];
        const n2: [number, number, number] = [-Math.cos(a2), Math.sin(a2), 0];
        pushQuadSmooth(
          [x1, y1, startZ],
          [x1, y1, halfD],
          [x2, y2, halfD],
          [x2, y2, startZ],
          n1, n1, n2, n2,
          COLOR_DEFAULT
        );
      }
    }
  }



  // Material Hex to RGB
  const hex = (cfg.materialHex || '#f3f2ee').replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;

  return {
    positions: new Float32Array(verts),
    normals: new Float32Array(norms),
    colors: new Float32Array(colors),
    indices: new Uint16Array(indices),
    colorRgb: [r, g, b],
    name: cfg.title || 'Ace Spaces Architectural Solid Surface',
  };
}
