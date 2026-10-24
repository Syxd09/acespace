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
    // ==========================================
    // STORE INVENTORY MODELS (Fixed Dimensions from Catalog)
    // ==========================================
    case 'oval-5':
    case 'oval 5':
      spec = { id: 'oval-5', width: 0.560, depth: 0.395, height: 0.160, shape: 'oval', covedRadius: 0.012 };
      break;
    case 'capsule-6':
    case 'capsule 6':
      spec = { id: 'capsule-6', width: 0.530, depth: 0.355, height: 0.150, shape: 'capsule', covedRadius: 0.012 };
      break;
    case 'oval-7':
    case 'oval 7':
      spec = { id: 'oval-7', width: 0.365, depth: 0.230, height: 0.120, shape: 'oval', covedRadius: 0.010 };
      break;
    case 'oval-10':
    case 'oval 10':
      spec = { id: 'oval-10', width: 0.365, depth: 0.265, height: 0.125, shape: 'oval', covedRadius: 0.010 };
      break;
    case 'oval-12':
    case 'oval 12':
      spec = { id: 'oval-12', width: 0.490, depth: 0.350, height: 0.150, shape: 'oval', covedRadius: 0.012 };
      break;

    case 'circ-8':
    case 'circ 8':
      spec = { id: 'circ-8', width: 0.320, depth: 0.320, height: 0.150, shape: 'round', covedRadius: 0.010 };
      break;
    case 'circ-9':
    case 'circ 9':
      spec = { id: 'circ-9', width: 0.385, depth: 0.385, height: 0.150, shape: 'round', covedRadius: 0.010 };
      break;

    case 'sq-1':
    case 'sq 1':
      spec = { id: 'sq-1', width: 0.580, depth: 0.375, height: 0.185, shape: 'rectangular', covedRadius: 0.015 };
      break;
    case 'sq-2':
    case 'sq 2':
      spec = { id: 'sq-2', width: 0.530, depth: 0.405, height: 0.210, shape: 'rectangular', covedRadius: 0.015 };
      break;
    case 'sq-3':
    case 'sq 3':
      spec = { id: 'sq-3', width: 0.385, depth: 0.385, height: 0.160, shape: 'rectangular', covedRadius: 0.015 };
      break;
    case 'sq-4':
    case 'sq 4':
      spec = { id: 'sq-4', width: 0.475, depth: 0.350, height: 0.160, shape: 'rectangular', covedRadius: 0.015 };
      break;
    case 'sq-11':
    case 'sq 11':
      spec = { id: 'sq-11', width: 0.425, depth: 0.330, height: 0.200, shape: 'rectangular', covedRadius: 0.015 };
      break;

    // ==========================================
    // CUSTOMIZABLE TROUGHS & CHANNELS (W, D, H)
    // ==========================================
    case 'ub':
    case 'UB':
    case 'undermount-box':
      spec = { id: 'ub', width: 0.50, depth: 0.35, height: 0.14, shape: 'ub-sloped', covedRadius: 0.008 };
      break;
    case 'uc':
    case 'UC':
    case 'undermount-channel':
      spec = { id: 'uc', width: 0.58, depth: 0.36, height: 0.12, shape: 'uc-sloped', covedRadius: 0.010 };
      break;
    case 'wdt':
    case 'WDT':
    case 'washdesk-trough':
    case 'linear-trough':
      spec = { id: 'wdt', width: 0.60, depth: 0.26, height: 0.12, shape: 'wdt-sloped', covedRadius: 0.008 };
      break;

    // Legacy Fallbacks
    case 'RO':
    case 'round-bowl':
      spec = { id: 'circ-8', width: 0.320, depth: 0.320, height: 0.150, shape: 'round', covedRadius: 0.010 };
      break;
    case 'OV':
    case 'coved-oval':
      spec = { id: 'oval-5', width: 0.560, depth: 0.395, height: 0.160, shape: 'oval', covedRadius: 0.012 };
      break;
    case 'A':
    case 'coved-rect':
      spec = { id: 'sq-1', width: 0.580, depth: 0.375, height: 0.185, shape: 'rectangular', covedRadius: 0.015 };
      break;
    case 'B':
    case 'crisp-rect':
      spec = { id: 'sq-4', width: 0.475, depth: 0.350, height: 0.160, shape: 'rectangular', covedRadius: 0.015 };
      break;
    case 'DB':
    case 'double-basin':
      spec = { id: 'oval-12', width: 0.490, depth: 0.350, height: 0.150, shape: 'oval', covedRadius: 0.012 };
      break;
    case 'capsule-pill':
      spec = { id: 'capsule-6', width: 0.530, depth: 0.355, height: 0.150, shape: 'capsule', covedRadius: 0.012 };
      break;
    case 'none':
      return { id: 'none', width: 0, depth: 0, height: 0, shape: 'none', covedRadius: 0 };
    default:
      spec = { id: 'oval-5', width: 0.560, depth: 0.395, height: 0.160, shape: 'oval', covedRadius: 0.012 };
      break;
  }

  // ONLY allow customizing width, depth, and height for wdt, uc, ub!
  // All store models have locked fixed dimensions from the manufacturer catalog.
  const isCustomizableModel = spec.id === 'ub' || spec.id === 'uc' || spec.id === 'wdt' ||
    modelId === 'ub' || modelId === 'uc' || modelId === 'wdt' ||
    modelId === 'UB' || modelId === 'UC' || modelId === 'WDT' ||
    modelId === 'undermount-box' || modelId === 'undermount-channel' || modelId === 'washdesk-trough';

  if (cfg && isCustomizableModel) {
    if (cfg.basinWidthMm && cfg.basinWidthMm > 0) spec.width = cfg.basinWidthMm / 1000;
    if (cfg.basinDepthMm && cfg.basinDepthMm > 0) spec.depth = cfg.basinDepthMm / 1000;
    if (cfg.basinHeightMm && cfg.basinHeightMm > 0) spec.height = cfg.basinHeightMm / 1000;
  }

  return spec;
}

interface PerimeterPoint {
  x: number;
  z: number;
  nx: number;
  nz: number;
}

/**
 * Generates an exact counter-clockwise perimeter loop for a rounded rectangle
 * with straight planar edges and cylindrical corner fillets.
 */
function getRoundedRectPoints(
  cX: number,
  cZ: number,
  halfW: number,
  halfD: number,
  radius: number,
  cornerSegs: number = 6,
  edgeSegs: number = 6
): PerimeterPoint[] {
  const r = Math.min(radius, Math.min(halfW, halfD) * 0.90);
  const pts: PerimeterPoint[] = [];

  // Corner 1: Front-Right (+X, +Z)
  const c1X = cX + halfW - r;
  const c1Z = cZ + halfD - r;
  for (let i = 0; i < cornerSegs; i++) {
    const psi = (i / cornerSegs) * (Math.PI * 0.5);
    const sn = Math.sin(psi);
    const cs = Math.cos(psi);
    pts.push({
      x: c1X + r * sn,
      z: c1Z + r * cs,
      nx: -sn,
      nz: -cs,
    });
  }

  // Right Edge (+X)
  const c2X = cX + halfW - r;
  const c2Z = cZ - halfD + r;
  for (let i = 0; i < edgeSegs; i++) {
    const u = i / edgeSegs;
    pts.push({
      x: cX + halfW,
      z: c1Z + (c2Z - c1Z) * u,
      nx: -1,
      nz: 0,
    });
  }

  // Corner 2: Back-Right (+X, -Z)
  for (let i = 0; i < cornerSegs; i++) {
    const psi = (i / cornerSegs) * (Math.PI * 0.5);
    const cs = Math.cos(psi);
    const sn = Math.sin(psi);
    pts.push({
      x: c2X + r * cs,
      z: c2Z - r * sn,
      nx: -cs,
      nz: sn,
    });
  }

  // Back Edge (-Z)
  const c3X = cX - halfW + r;
  const c3Z = cZ - halfD + r;
  for (let i = 0; i < edgeSegs; i++) {
    const u = i / edgeSegs;
    pts.push({
      x: c2X + (c3X - c2X) * u,
      z: cZ - halfD,
      nx: 0,
      nz: 1,
    });
  }

  // Corner 3: Back-Left (-X, -Z)
  for (let i = 0; i < cornerSegs; i++) {
    const psi = (i / cornerSegs) * (Math.PI * 0.5);
    const sn = Math.sin(psi);
    const cs = Math.cos(psi);
    pts.push({
      x: c3X - r * sn,
      z: c3Z - r * cs,
      nx: sn,
      nz: cs,
    });
  }

  // Left Edge (-X)
  const c4X = cX - halfW + r;
  const c4Z = cZ + halfD - r;
  for (let i = 0; i < edgeSegs; i++) {
    const u = i / edgeSegs;
    pts.push({
      x: cX - halfW,
      z: c3Z + (c4Z - c3Z) * u,
      nx: 1,
      nz: 0,
    });
  }

  // Corner 4: Front-Left (-X, +Z)
  for (let i = 0; i < cornerSegs; i++) {
    const psi = (i / cornerSegs) * (Math.PI * 0.5);
    const cs = Math.cos(psi);
    const sn = Math.sin(psi);
    pts.push({
      x: c4X - r * cs,
      z: c4Z + r * sn,
      nx: cs,
      nz: -sn,
    });
  }

  // Front Edge (+Z)
  for (let i = 0; i < edgeSegs; i++) {
    const u = i / edgeSegs;
    pts.push({
      x: c4X + (c1X - c4X) * u,
      z: cZ + halfD,
      nx: 0,
      nz: -1,
    });
  }

  return pts;
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
   * Helper: Superellipse / Squircle Profile Evaluator
   * Provides mathematically smooth, continuous profiles for oval (pExp=2), capsule (pExp=2.5), and soft-rect (pExp=3.8).
   * Generates exact matching perimeters and analytical XZ normals without discontinuous jumps.
   */
  const getSuperellipsePt = (th: number, radX: number, radZ: number, pExp: number) => {
    const c = Math.cos(th);
    const s = Math.sin(th);
    const absC = Math.abs(c);
    const absS = Math.abs(s);
    const x = radX * Math.sign(c) * (absC < 1e-7 ? 0 : Math.pow(absC, 2 / pExp));
    const z = radZ * Math.sign(s) * (absS < 1e-7 ? 0 : Math.pow(absS, 2 / pExp));
    const nx = (absC < 1e-7 ? 0 : Math.sign(c) * Math.pow(absC, Math.max(0, 2 - 2 / pExp))) / radX;
    const nz = (absS < 1e-7 ? 0 : Math.sign(s) * Math.pow(absS, Math.max(0, 2 - 2 / pExp))) / radZ;
    const len = Math.hypot(nx, nz) || 1;
    return { x, z, nx: nx / len, nz: nz / len };
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
    if (basinSpec.shape === 'oval' || basinSpec.shape === 'round' || basinSpec.shape === 'capsule' || basinSpec.shape === 'soft-rect') {
      const segs = 48;
      const isCapsule = basinSpec.shape === 'capsule' || basinSpec.id === 'capsule-6';
      const isSoftRect = basinSpec.shape === 'soft-rect';
      const pExp = isSoftRect ? 3.8 : isCapsule ? 2.5 : 2.0;

      for (let i = 0; i < segs; i++) {
        const th1 = (i / segs) * Math.PI * 2;
        const th2 = ((i + 1) / segs) * Math.PI * 2;
        const midTh = (th1 + th2) / 2;

        const pt1 = getSuperellipsePt(th1, rx, rz, pExp);
        const pt2 = getSuperellipsePt(th2, rx, rz, pExp);
        const p1X = bX + pt1.x;
        const p1Z = bZ + pt1.z;
        const p2X = bX + pt2.x;
        const p2Z = bZ + pt2.z;

        let cX = bX;
        let cZ = bZ;
        if (Math.cos(midTh) >= 0 && Math.sin(midTh) >= 0) { cX = bMaxX; cZ = bMaxZ; }
        else if (Math.cos(midTh) < 0 && Math.sin(midTh) >= 0) { cX = bMinX; cZ = bMaxZ; }
        else if (Math.cos(midTh) < 0 && Math.sin(midTh) < 0) { cX = bMinX; cZ = bMinZ; }
        else { cX = bMaxX; cZ = bMinZ; }

        pushTri([cX, topY, cZ], [p1X, topY, p1Z], [p2X, topY, p2Z], [0, 1, 0]);
        pushTri([cX, bottomDeckY, cZ], [p2X, bottomDeckY, p2Z], [p1X, bottomDeckY, p1Z], [0, -1, 0]);
      }
    } else if (basinSpec.shape === 'rectangular' || basinSpec.id.startsWith('sq') || basinSpec.id === 'coved-rect' || basinSpec.id === 'crisp-rect') {
      // Watertight corner fillets for square store models (sq 1, sq 2, sq 3, sq 4, sq 11) - UB, UC, WDT remain crisp sharp 90°
      const cr = basinSpec.id === 'sq-4' ? 0.035 : 0.025;
      const cornerSegs = 6;
      const edgeSegs = 6;
      const rimPts = getRoundedRectPoints(bX, bZ, rx, rz, cr, cornerSegs, edgeSegs);

      // Corner 1: Front-Right (+X, +Z)
      const c1X = bMaxX;
      const c1Z = bMaxZ;
      for (let i = 0; i < cornerSegs; i++) {
        const p1: [number, number, number] = [rimPts[i].x, topY, rimPts[i].z];
        const p2: [number, number, number] = [rimPts[i + 1].x, topY, rimPts[i + 1].z];
        pushTri([c1X, topY, c1Z], p2, p1, [0, 1, 0]);
        pushTri([c1X, bottomDeckY, c1Z], [p1[0], bottomDeckY, p1[2]], [p2[0], bottomDeckY, p2[2]], [0, -1, 0]);
      }

      // Corner 2: Back-Right (+X, -Z)
      const k2 = cornerSegs + edgeSegs;
      const c2X = bMaxX;
      const c2Z = bMinZ;
      for (let i = 0; i < cornerSegs; i++) {
        const p1: [number, number, number] = [rimPts[k2 + i].x, topY, rimPts[k2 + i].z];
        const p2: [number, number, number] = [rimPts[k2 + i + 1].x, topY, rimPts[k2 + i + 1].z];
        pushTri([c2X, topY, c2Z], p2, p1, [0, 1, 0]);
        pushTri([c2X, bottomDeckY, c2Z], [p1[0], bottomDeckY, p1[2]], [p2[0], bottomDeckY, p2[2]], [0, -1, 0]);
      }

      // Corner 3: Back-Left (-X, -Z)
      const k3 = 2 * (cornerSegs + edgeSegs);
      const c3X = bMinX;
      const c3Z = bMinZ;
      for (let i = 0; i < cornerSegs; i++) {
        const p1: [number, number, number] = [rimPts[k3 + i].x, topY, rimPts[k3 + i].z];
        const p2: [number, number, number] = [rimPts[k3 + i + 1].x, topY, rimPts[k3 + i + 1].z];
        pushTri([c3X, topY, c3Z], p2, p1, [0, 1, 0]);
        pushTri([c3X, bottomDeckY, c3Z], [p1[0], bottomDeckY, p1[2]], [p2[0], bottomDeckY, p2[2]], [0, -1, 0]);
      }

      // Corner 4: Front-Left (-X, +Z)
      const k4 = 3 * (cornerSegs + edgeSegs);
      const c4X = bMinX;
      const c4Z = bMaxZ;
      for (let i = 0; i < cornerSegs; i++) {
        const p1: [number, number, number] = [rimPts[k4 + i].x, topY, rimPts[k4 + i].z];
        const p2: [number, number, number] = [rimPts[k4 + i + 1].x, topY, rimPts[k4 + i + 1].z];
        pushTri([c4X, topY, c4Z], p2, p1, [0, 1, 0]);
        pushTri([c4X, bottomDeckY, c4Z], [p1[0], bottomDeckY, p1[2]], [p2[0], bottomDeckY, p2[2]], [0, -1, 0]);
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
      const topRimY = isTopMount ? topY + 0.012 : topY;
      const bH = basinSpec.height;
      // Bowl depth is strictly measured from the countertop top rim down to the floor of the bowl:
      const bowlFloorY = topRimY - bH;
      const totalDepth = bH;
      const wallThick = 0.012; // 12mm standard solid surface
      const underBaseY = bowlFloorY - wallThick;
      const rxRim = bW / 2;
      const rzRim = bD / 2;

      if (basinSpec.id === 'sq-4') {
        // ===========================================================
        // SQ 4: ARCHITECTURAL CURVED DISH-SHAPED RECTANGULAR BASIN (Image 4: 475 x 350 x 160)
        // Continuous parabolic/coved dish profile sweeping from top rim down to drain
        // ===========================================================
        const cr = 0.035;
        const cornerSegs = 6;
        const edgeSegs = 6;
        const rings = 18;
        const rDrain = 0.040;

        // Top-Mount Outer Rim Lip resting on countertop deck (when TOP is selected)
        if (isTopMount) {
          const lipThick = 0.012;
          const outerLipPts = getRoundedRectPoints(bX, bZ, rxRim + lipThick, rzRim + lipThick, cr + lipThick, cornerSegs, edgeSegs);
          const innerLipPts = getRoundedRectPoints(bX, bZ, rxRim, rzRim, cr, cornerSegs, edgeSegs);
          const nPts = innerLipPts.length;
          for (let i = 0; i < nPts; i++) {
            const nextI = (i + 1) % nPts;
            const pIn1: [number, number, number] = [innerLipPts[i].x, topRimY, innerLipPts[i].z];
            const pIn2: [number, number, number] = [innerLipPts[nextI].x, topRimY, innerLipPts[nextI].z];
            const pOut1: [number, number, number] = [outerLipPts[i].x, topRimY - 0.003, outerLipPts[i].z];
            const pOut2: [number, number, number] = [outerLipPts[nextI].x, topRimY - 0.003, outerLipPts[nextI].z];
            pushQuad(pIn1, pIn2, pOut2, pOut1, [0, 1, 0], COLOR_DEFAULT);
            const pDeck1: [number, number, number] = [outerLipPts[i].x, topY, outerLipPts[i].z];
            const pDeck2: [number, number, number] = [outerLipPts[nextI].x, topY, outerLipPts[nextI].z];
            pushQuad(pOut1, pOut2, pDeck2, pDeck1, [-outerLipPts[i].nx, 0.4, -outerLipPts[i].nz], COLOR_DEFAULT);
          }
        }

        // 1. Curved Interior Dish Cavity (sweeping down to drain)
        let prevPts = getRoundedRectPoints(bX, bZ, rxRim, rzRim, cr, cornerSegs, edgeSegs);
        let prevY = topRimY;
        let prevNy = 0.0;
        let prevNHoriz = 1.0;
        const nRim = prevPts.length;

        for (let s = 1; s <= rings; s++) {
          const t = s / rings;
          const ang = t * Math.PI * 0.5;
          const sinA = Math.sin(ang); // 0 at top to 1 at floor
          const cosA = Math.cos(ang); // 1 at top to 0 at floor
          const curY = topRimY - bH * (1 - Math.cos(ang));
          const radFac = Math.sin(ang); // 1 at top to 0 at drain
          const curW = rxRim - (rxRim - rDrain) * (1 - cosA);
          const curD = rzRim - (rzRim - rDrain) * (1 - cosA);
          const curCr = Math.max(0.010, cr * cosA);
          const curPts = getRoundedRectPoints(bX, bZ, curW, curD, curCr, cornerSegs, edgeSegs);

          const curNy = sinA;
          const curNHoriz = cosA;

          for (let i = 0; i < nRim; i++) {
            const nextI = (i + 1) % nRim;
            const pA1: [number, number, number] = [prevPts[i].x, prevY, prevPts[i].z];
            const pA2: [number, number, number] = [prevPts[nextI].x, prevY, prevPts[nextI].z];
            const pB2: [number, number, number] = [curPts[nextI].x, curY, curPts[nextI].z];
            const pB1: [number, number, number] = [curPts[i].x, curY, curPts[i].z];

            const nA1: [number, number, number] = [prevPts[i].nx * prevNHoriz, prevNy, prevPts[i].nz * prevNHoriz];
            const nA2: [number, number, number] = [prevPts[nextI].nx * prevNHoriz, prevNy, prevPts[nextI].nz * prevNHoriz];
            const nB2: [number, number, number] = [curPts[nextI].nx * curNHoriz, curNy, curPts[nextI].nz * curNHoriz];
            const nB1: [number, number, number] = [curPts[i].nx * curNHoriz, curNy, curPts[i].nz * curNHoriz];

            pushQuadSmooth(pA1, pA2, pB2, pB1, nA1, nA2, nB2, nB1, COLOR_DEFAULT);
          }

          prevPts = curPts;
          prevY = curY;
          prevNy = curNy;
          prevNHoriz = curNHoriz;
        }

        // Flat horizontal connection to drain opening
        const dishFloorPts = prevPts;
        for (let i = 0; i < nRim; i++) {
          const nextI = (i + 1) % nRim;
          const phi1 = Math.atan2(dishFloorPts[i].z - bZ, dishFloorPts[i].x - bX);
          const phi2 = Math.atan2(dishFloorPts[nextI].z - bZ, dishFloorPts[nextI].x - bX);
          const d1: [number, number, number] = [bX + rDrain * Math.cos(phi1), bowlFloorY, bZ + rDrain * Math.sin(phi1)];
          const d2: [number, number, number] = [bX + rDrain * Math.cos(phi2), bowlFloorY, bZ + rDrain * Math.sin(phi2)];
          const pF1: [number, number, number] = [dishFloorPts[i].x, bowlFloorY, dishFloorPts[i].z];
          const pF2: [number, number, number] = [dishFloorPts[nextI].x, bowlFloorY, dishFloorPts[nextI].z];
          pushQuad(pF1, pF2, d2, d1, [0, 1, 0], COLOR_DEFAULT);
        }

        // 2. Exterior Curved Underside Shell (smooth dished underbelly with 12mm thickness)
        const outerRx = rxRim + wallThick;
        const outerRz = rzRim + wallThick;
        let prevOutPts = getRoundedRectPoints(bX, bZ, outerRx, outerRz, cr + wallThick, cornerSegs, edgeSegs);
        let prevOutY = bottomDeckY;
        let prevOutNy = 0.0;
        let prevOutNHoriz = 1.0;

        for (let s = 1; s <= rings; s++) {
          const t = s / rings;
          const ang = t * Math.PI * 0.5;
          const sinA = Math.sin(ang);
          const cosA = Math.cos(ang);
          const curY = bottomDeckY - (bottomDeckY - underBaseY) * (1 - cosA);
          const curW = outerRx - (outerRx - rDrain) * (1 - cosA);
          const curD = outerRz - (outerRz - rDrain) * (1 - cosA);
          const curCr = Math.max(0.012, (cr + wallThick) * cosA);
          const curOutPts = getRoundedRectPoints(bX, bZ, curW, curD, curCr, cornerSegs, edgeSegs);

          const curNy = -sinA;
          const curNHoriz = cosA;

          for (let i = 0; i < nRim; i++) {
            const nextI = (i + 1) % nRim;
            const pTop1: [number, number, number] = [prevOutPts[i].x, prevOutY, prevOutPts[i].z];
            const pTop2: [number, number, number] = [prevOutPts[nextI].x, prevOutY, prevOutPts[nextI].z];
            const pBot2: [number, number, number] = [curOutPts[nextI].x, curY, curOutPts[nextI].z];
            const pBot1: [number, number, number] = [curOutPts[i].x, curY, curOutPts[i].z];

            const nA1: [number, number, number] = [-prevOutPts[i].nx * prevOutNHoriz, prevOutNy, -prevOutPts[i].nz * prevOutNHoriz];
            const nA2: [number, number, number] = [-prevOutPts[nextI].nx * prevOutNHoriz, prevOutNy, -prevOutPts[nextI].nz * prevOutNHoriz];
            const nB2: [number, number, number] = [-curOutPts[nextI].nx * curNHoriz, curNy, -curOutPts[nextI].nz * curNHoriz];
            const nB1: [number, number, number] = [-curOutPts[i].nx * curNHoriz, curNy, -curOutPts[i].nz * curNHoriz];

            pushQuadSmooth(pTop2, pTop1, pBot1, pBot2, nA2, nA1, nB1, nB2, COLOR_DEFAULT);
          }

          prevOutPts = curOutPts;
          prevOutY = curY;
          prevOutNy = curNy;
          prevOutNHoriz = curNHoriz;
        }

        // Underside drain connection
        for (let i = 0; i < nRim; i++) {
          const nextI = (i + 1) % nRim;
          const phi1 = Math.atan2(prevOutPts[i].z - bZ, prevOutPts[i].x - bX);
          const phi2 = Math.atan2(prevOutPts[nextI].z - bZ, prevOutPts[nextI].x - bX);
          const d1: [number, number, number] = [bX + rDrain * Math.cos(phi1), underBaseY, bZ + rDrain * Math.sin(phi1)];
          const d2: [number, number, number] = [bX + rDrain * Math.cos(phi2), underBaseY, bZ + rDrain * Math.sin(phi2)];
          const pF1: [number, number, number] = [prevOutPts[i].x, underBaseY, prevOutPts[i].z];
          const pF2: [number, number, number] = [prevOutPts[nextI].x, underBaseY, prevOutPts[nextI].z];
          pushQuad(pF2, pF1, d1, d2, [0, -1, 0], COLOR_DEFAULT);
        }

        pushDetailedSinkDrain(bX, bowlFloorY, bZ, underBaseY, false);

      } else if (basinSpec.shape === 'rectangular' || basinSpec.id.startsWith('sq') || basinSpec.id === 'coved-rect' || basinSpec.id === 'crisp-rect') {
        // ===========================================================
        // SQ 1, SQ 2, SQ 3, SQ 11: ARCHITECTURAL RECTANGULAR BOX BASINS (Images 3 & 4)
        // Straight planar walls with smooth R25 corner fillets, R20 coved floor transition, and flat floor
        // ===========================================================
        const isTapered = basinSpec.id === 'sq-3';
        const taper = isTapered ? 0.014 : 0.0; // 14mm inward taper for SQ 3
        const cr = 0.025; // 25mm corner fillet radius
        const coveR = 0.020; // 20mm cove transition to floor
        const coveFloorY = bowlFloorY + coveR;
        const cornerSegs = 6;
        const edgeSegs = 6;

        // Top-Mount Outer Rim Lip resting on countertop deck (when TOP is selected)
        if (isTopMount) {
          const lipThick = 0.012;
          const outerLipPts = getRoundedRectPoints(bX, bZ, rxRim + lipThick, rzRim + lipThick, cr + lipThick, cornerSegs, edgeSegs);
          const innerLipPts = getRoundedRectPoints(bX, bZ, rxRim, rzRim, cr, cornerSegs, edgeSegs);
          const nPts = innerLipPts.length;
          for (let i = 0; i < nPts; i++) {
            const nextI = (i + 1) % nPts;
            const pIn1: [number, number, number] = [innerLipPts[i].x, topRimY, innerLipPts[i].z];
            const pIn2: [number, number, number] = [innerLipPts[nextI].x, topRimY, innerLipPts[nextI].z];
            const pOut1: [number, number, number] = [outerLipPts[i].x, topRimY - 0.003, outerLipPts[i].z];
            const pOut2: [number, number, number] = [outerLipPts[nextI].x, topRimY - 0.003, outerLipPts[nextI].z];
            pushQuad(pIn1, pIn2, pOut2, pOut1, [0, 1, 0], COLOR_DEFAULT);
            const pDeck1: [number, number, number] = [outerLipPts[i].x, topY, outerLipPts[i].z];
            const pDeck2: [number, number, number] = [outerLipPts[nextI].x, topY, outerLipPts[nextI].z];
            pushQuad(pOut1, pOut2, pDeck2, pDeck1, [-outerLipPts[i].nx, 0.4, -outerLipPts[i].nz], COLOR_DEFAULT);
          }
        }

        // 1. VERTICAL (OR TAPERED FOR SQ 3) WALLS (from topRimY down to coveFloorY)
        const rimPts = getRoundedRectPoints(bX, bZ, rxRim, rzRim, cr, cornerSegs, edgeSegs);
        const lowerWallW = rxRim - taper;
        const lowerWallD = rzRim - taper;
        const lowerWallPts = getRoundedRectPoints(bX, bZ, lowerWallW, lowerWallD, cr, cornerSegs, edgeSegs);
        const nRim = rimPts.length;

        const vSteps = 2;
        for (let v = 0; v < vSteps; v++) {
          const uA = v / vSteps;
          const uB = (v + 1) / vSteps;
          const yA = topRimY - (topRimY - coveFloorY) * uA;
          const yB = topRimY - (topRimY - coveFloorY) * uB;

          const ptsA = getRoundedRectPoints(bX, bZ, rxRim - taper * uA, rzRim - taper * uA, cr, cornerSegs, edgeSegs);
          const ptsB = getRoundedRectPoints(bX, bZ, rxRim - taper * uB, rzRim - taper * uB, cr, cornerSegs, edgeSegs);

          for (let i = 0; i < nRim; i++) {
            const nextI = (i + 1) % nRim;
            const pA1: [number, number, number] = [ptsA[i].x, yA, ptsA[i].z];
            const pA2: [number, number, number] = [ptsA[nextI].x, yA, ptsA[nextI].z];
            const pB2: [number, number, number] = [ptsB[nextI].x, yB, ptsB[nextI].z];
            const pB1: [number, number, number] = [ptsB[i].x, yB, ptsB[i].z];

            const n1: [number, number, number] = [ptsA[i].nx, 0, ptsA[i].nz];
            const n2: [number, number, number] = [ptsA[nextI].nx, 0, ptsA[nextI].nz];

            pushQuadSmooth(pA1, pA2, pB2, pB1, n1, n2, n2, n1, COLOR_DEFAULT);
          }
        }

        // Pill-shaped overflow slot on inside rear wall
        const ofY = topRimY - 0.026;
        const ofHalfW = 0.024;
        const ofHalfH = 0.005;
        const ofZ = bZ - rzRim + 0.003;
        pushQuad(
          [bX - ofHalfW, ofY - ofHalfH, ofZ],
          [bX + ofHalfW, ofY - ofHalfH, ofZ],
          [bX + ofHalfW, ofY + ofHalfH, ofZ],
          [bX - ofHalfW, ofY + ofHalfH, ofZ],
          [0, 0, 1],
          COLOR_SHADOW
        );

        // 2. BOTTOM COVE CURVATURE (from coveFloorY down to bowlFloorY)
        const coveSteps = 6;
        let prevCovePts = lowerWallPts;
        let prevY = coveFloorY;
        let prevNy = 0;
        let prevNHoriz = 1.0;

        for (let s = 1; s <= coveSteps; s++) {
          const ang = (s / coveSteps) * (Math.PI * 0.5);
          const sinA = Math.sin(ang);
          const cosA = Math.cos(ang);
          const curY = bowlFloorY + coveR * (1 - sinA);
          const offset = coveR * (1 - cosA);
          const curW = lowerWallW - offset;
          const curD = lowerWallD - offset;
          const curR = Math.max(0.006, cr - offset);
          const curCovePts = getRoundedRectPoints(bX, bZ, curW, curD, curR, cornerSegs, edgeSegs);

          const curNy = sinA;
          const curNHoriz = cosA;

          for (let i = 0; i < nRim; i++) {
            const nextI = (i + 1) % nRim;
            const pA1: [number, number, number] = [prevCovePts[i].x, prevY, prevCovePts[i].z];
            const pA2: [number, number, number] = [prevCovePts[nextI].x, prevY, prevCovePts[nextI].z];
            const pB2: [number, number, number] = [curCovePts[nextI].x, curY, curCovePts[nextI].z];
            const pB1: [number, number, number] = [curCovePts[i].x, curY, curCovePts[i].z];

            const nA1: [number, number, number] = [prevCovePts[i].nx * prevNHoriz, prevNy, prevCovePts[i].nz * prevNHoriz];
            const nA2: [number, number, number] = [prevCovePts[nextI].nx * prevNHoriz, prevNy, prevCovePts[nextI].nz * prevNHoriz];
            const nB2: [number, number, number] = [curCovePts[nextI].nx * curNHoriz, curNy, curCovePts[nextI].nz * curNHoriz];
            const nB1: [number, number, number] = [curCovePts[i].nx * curNHoriz, curNy, curCovePts[i].nz * curNHoriz];

            pushQuadSmooth(pA1, pA2, pB2, pB1, nA1, nA2, nB2, nB1, COLOR_DEFAULT);
          }

          prevCovePts = curCovePts;
          prevY = curY;
          prevNy = curNy;
          prevNHoriz = curNHoriz;
        }

        // 3. FLAT HORIZONTAL FLOOR (at bowlFloorY) with centered drain connection
        const floorPts = prevCovePts;
        const rDrain = 0.034; // 68mm drain opening, completely covered by 76mm chrome flange
        for (let i = 0; i < nRim; i++) {
          const nextI = (i + 1) % nRim;
          const phi1 = Math.atan2(floorPts[i].z - bZ, floorPts[i].x - bX);
          const phi2 = Math.atan2(floorPts[nextI].z - bZ, floorPts[nextI].x - bX);

          const d1: [number, number, number] = [bX + rDrain * Math.cos(phi1), bowlFloorY, bZ + rDrain * Math.sin(phi1)];
          const d2: [number, number, number] = [bX + rDrain * Math.cos(phi2), bowlFloorY, bZ + rDrain * Math.sin(phi2)];

          const pF1: [number, number, number] = [floorPts[i].x, bowlFloorY, floorPts[i].z];
          const pF2: [number, number, number] = [floorPts[nextI].x, bowlFloorY, floorPts[nextI].z];

          pushQuad(pF1, pF2, d2, d1, [0, 1, 0], COLOR_DEFAULT);
        }

        // 4. EXTERIOR UNDERSIDE SHELL (for 360° inspection from underneath)
        const outerRx = rxRim + wallThick;
        const outerRz = rzRim + wallThick;
        const outerLowerW = lowerWallW + wallThick;
        const outerLowerD = lowerWallD + wallThick;
        const outerCr = cr + wallThick;
        const outerCoveR = coveR + wallThick;

        // Outer vertical/tapered walls from bottomDeckY down to coveFloorY
        for (let v = 0; v < vSteps; v++) {
          const uA = v / vSteps;
          const uB = (v + 1) / vSteps;
          const yA = bottomDeckY - (bottomDeckY - coveFloorY) * uA;
          const yB = bottomDeckY - (bottomDeckY - coveFloorY) * uB;

          const ptsA = getRoundedRectPoints(bX, bZ, outerRx - taper * uA, outerRz - taper * uA, outerCr, cornerSegs, edgeSegs);
          const ptsB = getRoundedRectPoints(bX, bZ, outerRx - taper * uB, outerRz - taper * uB, outerCr, cornerSegs, edgeSegs);

          for (let i = 0; i < nRim; i++) {
            const nextI = (i + 1) % nRim;
            const pTop1: [number, number, number] = [ptsA[i].x, yA, ptsA[i].z];
            const pTop2: [number, number, number] = [ptsA[nextI].x, yA, ptsA[nextI].z];
            const pBot2: [number, number, number] = [ptsB[nextI].x, yB, ptsB[nextI].z];
            const pBot1: [number, number, number] = [ptsB[i].x, yB, ptsB[i].z];

            const nOut1: [number, number, number] = [-ptsA[i].nx, 0, -ptsA[i].nz];
            const nOut2: [number, number, number] = [-ptsA[nextI].nx, 0, -ptsA[nextI].nz];

            pushQuadSmooth(pTop2, pTop1, pBot1, pBot2, nOut2, nOut1, nOut1, nOut2, COLOR_DEFAULT);
          }
        }

        // Outer cove curvature from coveFloorY down to underBaseY
        let prevOutPts = getRoundedRectPoints(bX, bZ, outerLowerW, outerLowerD, outerCr, cornerSegs, edgeSegs);
        let prevOutY = coveFloorY;
        let prevOutNy = 0;
        let prevOutNHoriz = 1.0;

        for (let s = 1; s <= coveSteps; s++) {
          const ang = (s / coveSteps) * (Math.PI * 0.5);
          const sinA = Math.sin(ang);
          const cosA = Math.cos(ang);
          const curOutY = underBaseY + outerCoveR * (1 - sinA);
          const offset = outerCoveR * (1 - cosA);
          const curW = outerLowerW - offset;
          const curD = outerLowerD - offset;
          const curR = Math.max(0.008, outerCr - offset);
          const curOutPts = getRoundedRectPoints(bX, bZ, curW, curD, curR, cornerSegs, edgeSegs);

          const curOutNy = -sinA;
          const curOutNHoriz = cosA;

          for (let i = 0; i < nRim; i++) {
            const nextI = (i + 1) % nRim;
            const pTop1: [number, number, number] = [prevOutPts[i].x, prevOutY, prevOutPts[i].z];
            const pTop2: [number, number, number] = [prevOutPts[nextI].x, prevOutY, prevOutPts[nextI].z];
            const pBot2: [number, number, number] = [curOutPts[nextI].x, curOutY, curOutPts[nextI].z];
            const pBot1: [number, number, number] = [curOutPts[i].x, curOutY, curOutPts[i].z];

            const nA1: [number, number, number] = [-prevOutPts[i].nx * prevOutNHoriz, prevOutNy, -prevOutPts[i].nz * prevOutNHoriz];
            const nA2: [number, number, number] = [-prevOutPts[nextI].nx * prevOutNHoriz, prevOutNy, -prevOutPts[nextI].nz * prevOutNHoriz];
            const nB2: [number, number, number] = [-curOutPts[nextI].nx * curOutNHoriz, curOutNy, -curOutPts[nextI].nz * curOutNHoriz];
            const nB1: [number, number, number] = [-curOutPts[i].nx * curOutNHoriz, curOutNy, -curOutPts[i].nz * curOutNHoriz];

            pushQuadSmooth(pTop2, pTop1, pBot1, pBot2, nA2, nA1, nB1, nB2, COLOR_DEFAULT);
          }

          prevOutPts = curOutPts;
          prevOutY = curOutY;
          prevOutNy = curOutNy;
          prevOutNHoriz = curOutNHoriz;
        }

        // Underside bottom base plate at underBaseY
        const outFloorPts = prevOutPts;
        for (let i = 0; i < nRim; i++) {
          const nextI = (i + 1) % nRim;
          const phi1 = Math.atan2(outFloorPts[i].z - bZ, outFloorPts[i].x - bX);
          const phi2 = Math.atan2(outFloorPts[nextI].z - bZ, outFloorPts[nextI].x - bX);

          const d1: [number, number, number] = [bX + rDrain * Math.cos(phi1), underBaseY, bZ + rDrain * Math.sin(phi1)];
          const d2: [number, number, number] = [bX + rDrain * Math.cos(phi2), underBaseY, bZ + rDrain * Math.sin(phi2)];

          const pF1: [number, number, number] = [outFloorPts[i].x, underBaseY, outFloorPts[i].z];
          const pF2: [number, number, number] = [outFloorPts[nextI].x, underBaseY, outFloorPts[nextI].z];

          pushQuad(pF2, pF1, d1, d2, [0, -1, 0], COLOR_DEFAULT);
        }

        // 5. Detailed Chrome Drain Fitting & Underside Boss
        pushDetailedSinkDrain(bX, bowlFloorY, bZ, underBaseY, false);

      } else if (basinSpec.shape === 'oval' || basinSpec.shape === 'round' || basinSpec.shape === 'capsule' || basinSpec.shape === 'soft-rect') {
        // ===========================================================
        // OVAL (5, 7, 10, 12), CAPSULE (6), CIRCULAR (8, 9): ARCHITECTURAL CURVED BOWLS (Images 1 & 2)
        // True smooth continuous 3D ellipsoidal/hemispherical bowl geometry
        // ===========================================================
        const isCapsule = basinSpec.shape === 'capsule' || basinSpec.id === 'capsule-6';
        const isRound = basinSpec.shape === 'round' || basinSpec.id === 'circ-8' || basinSpec.id === 'circ-9';
        const isSoftRect = basinSpec.shape === 'soft-rect';
        const pExp = isSoftRect ? 3.8 : isCapsule ? 2.5 : 2.0;
        const rings = 22;
        const segs = 48;
        const rDrain = 0.034; // 68mm drain opening, completely covered by 76mm chrome flange

        // 1. Seamless Smooth Curved Inner Cavity
        for (let j = 0; j < rings; j++) {
          const t1 = j / rings;
          const t2 = (j + 1) / rings;

          // phi goes from 0 at the drain (bowlFloorY) to PI/2 at the top rim (topRimY)
          const phi1 = t1 * (Math.PI * 0.5);
          const phi2 = t2 * (Math.PI * 0.5);

          // Smooth continuous vertical bowl profile with horizontal tangent at the drain:
          const y1 = bowlFloorY + bH * (1 - Math.cos(phi1));
          const y2 = bowlFloorY + bH * (1 - Math.cos(phi2));

          const s1 = Math.sin(phi1);
          const s2 = Math.sin(phi2);

          const r1x = rDrain + (rxRim - rDrain) * s1;
          const r2x = rDrain + (rxRim - rDrain) * s2;
          const r1z = rDrain + (rzRim - rDrain) * s1;
          const r2z = rDrain + (rzRim - rDrain) * s2;

          const curExp1 = 2.0 + (pExp - 2.0) * s1;
          const curExp2 = 2.0 + (pExp - 2.0) * s2;

          const nRad1 = Math.cos(phi1);
          const nRad2 = Math.cos(phi2);
          const nY1 = Math.sin(phi1);
          const nY2 = Math.sin(phi2);

          for (let i = 0; i < segs; i++) {
            const th1 = (i / segs) * Math.PI * 2;
            const th2 = ((i + 1) / segs) * Math.PI * 2;

            const pt1A = getSuperellipsePt(th1, r1x, r1z, curExp1);
            const pt2A = getSuperellipsePt(th2, r1x, r1z, curExp1);
            const pt2B = getSuperellipsePt(th2, r2x, r2z, curExp2);
            const pt1B = getSuperellipsePt(th1, r2x, r2z, curExp2);

            const p1: [number, number, number] = [bX + pt1A.x, y1, bZ + pt1A.z];
            const p2: [number, number, number] = [bX + pt2A.x, y1, bZ + pt2A.z];
            const p3: [number, number, number] = [bX + pt2B.x, y2, bZ + pt2B.z];
            const p4: [number, number, number] = [bX + pt1B.x, y2, bZ + pt1B.z];

            const n1: [number, number, number] = [-pt1A.nx * nRad1, nY1, -pt1A.nz * nRad1];
            const n2: [number, number, number] = [-pt2A.nx * nRad1, nY1, -pt2A.nz * nRad1];
            const n3: [number, number, number] = [-pt2B.nx * nRad2, nY2, -pt2B.nz * nRad2];
            const n4: [number, number, number] = [-pt1B.nx * nRad2, nY2, -pt1B.nz * nRad2];

            pushQuadSmooth(p4, p3, p2, p1, n4, n3, n2, n1, COLOR_DEFAULT);
          }
        }

        // Top-Mount Outer Rim Lip resting on countertop deck (when TOP is selected)
        if (isTopMount) {
          const lipThick = 0.012;
          for (let i = 0; i < segs; i++) {
            const th1 = (i / segs) * Math.PI * 2;
            const th2 = ((i + 1) / segs) * Math.PI * 2;

            const pt1In = getSuperellipsePt(th1, rxRim, rzRim, pExp);
            const pt2In = getSuperellipsePt(th2, rxRim, rzRim, pExp);
            const pt1Out = getSuperellipsePt(th1, rxRim + lipThick, rzRim + lipThick, pExp);
            const pt2Out = getSuperellipsePt(th2, rxRim + lipThick, rzRim + lipThick, pExp);

            const pr1: [number, number, number] = [bX + pt1In.x, topRimY, bZ + pt1In.z];
            const pr2: [number, number, number] = [bX + pt2In.x, topRimY, bZ + pt2In.z];
            const pro1: [number, number, number] = [bX + pt1Out.x, topRimY - 0.003, bZ + pt1Out.z];
            const pro2: [number, number, number] = [bX + pt2Out.x, topRimY - 0.003, bZ + pt2Out.z];
            pushQuad(pr1, pr2, pro2, pro1, [0, 1, 0], COLOR_DEFAULT);

            const pd1: [number, number, number] = [bX + pt1Out.x, topY, bZ + pt1Out.z];
            const pd2: [number, number, number] = [bX + pt2Out.x, topY, bZ + pt2Out.z];
            pushQuad(pro1, pro2, pd2, pd1, [pt1Out.nx, 0.4, pt1Out.nz], COLOR_DEFAULT);
          }
        }

        // 2. Exterior Underside Shell (Smooth curved underbelly for 360° inspection)
        for (let j = 0; j < rings; j++) {
          const t1 = j / rings;
          const t2 = (j + 1) / rings;

          const phi1 = t1 * (Math.PI * 0.5);
          const phi2 = t2 * (Math.PI * 0.5);

          const y1 = underBaseY + (bottomDeckY - underBaseY) * (1 - Math.cos(phi1));
          const y2 = underBaseY + (bottomDeckY - underBaseY) * (1 - Math.cos(phi2));

          const s1 = Math.sin(phi1);
          const s2 = Math.sin(phi2);

          const r1x = rDrain + (rxRim + wallThick - rDrain) * s1;
          const r2x = rDrain + (rxRim + wallThick - rDrain) * s2;
          const r1z = rDrain + (rzRim + wallThick - rDrain) * s1;
          const r2z = rDrain + (rzRim + wallThick - rDrain) * s2;

          const curExp1 = 2.0 + (pExp - 2.0) * s1;
          const curExp2 = 2.0 + (pExp - 2.0) * s2;

          const nRad1 = Math.cos(phi1);
          const nRad2 = Math.cos(phi2);
          const nY1 = -Math.sin(phi1);
          const nY2 = -Math.sin(phi2);

          for (let i = 0; i < segs; i++) {
            const th1 = (i / segs) * Math.PI * 2;
            const th2 = ((i + 1) / segs) * Math.PI * 2;

            const pt1A = getSuperellipsePt(th1, r1x, r1z, curExp1);
            const pt2A = getSuperellipsePt(th2, r1x, r1z, curExp1);
            const pt2B = getSuperellipsePt(th2, r2x, r2z, curExp2);
            const pt1B = getSuperellipsePt(th1, r2x, r2z, curExp2);

            const pe1: [number, number, number] = [bX + pt1A.x, y1, bZ + pt1A.z];
            const pe2: [number, number, number] = [bX + pt2A.x, y1, bZ + pt2A.z];
            const pe3: [number, number, number] = [bX + pt2B.x, y2, bZ + pt2B.z];
            const pe4: [number, number, number] = [bX + pt1B.x, y2, bZ + pt1B.z];

            const n1: [number, number, number] = [pt1A.nx * nRad1, nY1, pt1A.nz * nRad1];
            const n2: [number, number, number] = [pt2A.nx * nRad1, nY1, pt2A.nz * nRad1];
            const n3: [number, number, number] = [pt2B.nx * nRad2, nY2, pt2B.nz * nRad2];
            const n4: [number, number, number] = [pt1B.nx * nRad2, nY2, pt1B.nz * nRad2];

            pushQuadSmooth(pe1, pe2, pe3, pe4, n1, n2, n3, n4, COLOR_DEFAULT);
          }
        }

        // Detailed Chrome Drain Fitting & Underside Boss (Images 1 & 2)
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

        // Top-Mount 12mm Solid Surface Outer Rim Border (resting flush on countertop deck)
        if (isTopMount) {
          const borderW = 0.012;
          // Top horizontal border rim resting at topRimY (CCW facing +Y)
          pushQuad([minX - borderW, topRimY, maxZ + borderW], [maxX + borderW, topRimY, maxZ + borderW], [maxX + borderW, topRimY, maxZ], [minX - borderW, topRimY, maxZ], [0, 1, 0], COLOR_DEFAULT);
          pushQuad([minX - borderW, topRimY, minZ], [maxX + borderW, topRimY, minZ], [maxX + borderW, topRimY, minZ - borderW], [minX - borderW, topRimY, minZ - borderW], [0, 1, 0], COLOR_DEFAULT);
          pushQuad([minX - borderW, topRimY, maxZ], [minX, topRimY, maxZ], [minX, topRimY, minZ], [minX - borderW, topRimY, minZ], [0, 1, 0], COLOR_DEFAULT);
          pushQuad([maxX, topRimY, maxZ], [maxX + borderW, topRimY, maxZ], [maxX + borderW, topRimY, minZ], [maxX, topRimY, minZ], [0, 1, 0], COLOR_DEFAULT);

          // Outer vertical perimeter drop down to countertop deck (topY)
          pushQuad([minX - borderW, topY, maxZ + borderW], [maxX + borderW, topY, maxZ + borderW], [maxX + borderW, topRimY, maxZ + borderW], [minX - borderW, topRimY, maxZ + borderW], [0, 0, 1], COLOR_DEFAULT);
          pushQuad([maxX + borderW, topY, minZ - borderW], [minX - borderW, topY, minZ - borderW], [minX - borderW, topRimY, minZ - borderW], [maxX + borderW, topRimY, minZ - borderW], [0, 0, -1], COLOR_DEFAULT);
          pushQuad([minX - borderW, topY, minZ - borderW], [minX - borderW, topY, maxZ + borderW], [minX - borderW, topRimY, maxZ + borderW], [minX - borderW, topRimY, minZ - borderW], [-1, 0, 0], COLOR_DEFAULT);
          pushQuad([maxX + borderW, topY, maxZ + borderW], [maxX + borderW, topY, minZ - borderW], [maxX + borderW, topRimY, minZ - borderW], [maxX + borderW, topRimY, maxZ + borderW], [1, 0, 0], COLOR_DEFAULT);
        }

        // 1. Front Vertical Reveal Wall (drops from deck rim down to sloped ramp, facing -Z)
        pushQuad(
          [maxX, frontFloorY, maxZ],
          [minX, frontFloorY, maxZ],
          [minX, topRimY, maxZ],
          [maxX, topRimY, maxZ],
          [0, 0, -1],
          COLOR_DEFAULT
        );

        // 2. Sloped Washplane Ramp (descending from front drop towards rear trench, CCW facing +Y/-Z)
        const dzR = maxZ - trenchFrontZ;
        const dyR = frontFloorY - rampFloorEndY;
        const lenR = Math.hypot(dyR, dzR);
        const nRamp: [number, number, number] = [0, dzR / lenR, -dyR / lenR];
        pushQuad(
          [minX, frontFloorY, maxZ],
          [maxX, frontFloorY, maxZ],
          [maxX, rampFloorEndY, trenchFrontZ],
          [minX, rampFloorEndY, trenchFrontZ],
          nRamp,
          COLOR_DEFAULT
        );

        // 3. Step Drop into Rear Trench (at trenchFrontZ, facing -Z)
        pushQuad(
          [maxX, trenchFloorY, trenchFrontZ],
          [minX, trenchFloorY, trenchFrontZ],
          [minX, rampFloorEndY, trenchFrontZ],
          [maxX, rampFloorEndY, trenchFrontZ],
          [0, 0, -1],
          COLOR_DEFAULT
        );

        // 4. Rear Drainage Trench Floor (facing +Y)
        pushQuad(
          [minX, trenchFloorY, trenchFrontZ],
          [maxX, trenchFloorY, trenchFrontZ],
          [maxX, trenchFloorY, minZ],
          [minX, trenchFloorY, minZ],
          [0, 1, 0],
          COLOR_DEFAULT
        );

        // 5. Rear Vertical Wall (rising from trench floor up to deck top rim, facing +Z)
        pushQuad(
          [minX, trenchFloorY, minZ],
          [maxX, trenchFloorY, minZ],
          [maxX, topRimY, minZ],
          [minX, topRimY, minZ],
          [0, 0, 1],
          COLOR_DEFAULT
        );

        // 6. Left Vertical Sidewall (Watertight enclosure at minX, facing +X)
        pushQuad(
          [minX, rampFloorEndY, trenchFrontZ],
          [minX, frontFloorY, maxZ],
          [minX, topRimY, maxZ],
          [minX, topRimY, trenchFrontZ],
          [1, 0, 0],
          COLOR_DEFAULT
        );
        pushQuad(
          [minX, trenchFloorY, trenchFrontZ],
          [minX, trenchFloorY, minZ],
          [minX, topRimY, minZ],
          [minX, topRimY, trenchFrontZ],
          [1, 0, 0],
          COLOR_DEFAULT
        );

        // 7. Right Vertical Sidewall (Watertight enclosure at maxX, facing -X)
        pushQuad(
          [maxX, frontFloorY, maxZ],
          [maxX, rampFloorEndY, trenchFrontZ],
          [maxX, topRimY, trenchFrontZ],
          [maxX, topRimY, maxZ],
          [-1, 0, 0],
          COLOR_DEFAULT
        );
        pushQuad(
          [maxX, trenchFloorY, minZ],
          [maxX, trenchFloorY, trenchFrontZ],
          [maxX, topRimY, trenchFrontZ],
          [maxX, topRimY, minZ],
          [-1, 0, 0],
          COLOR_DEFAULT
        );

        // 8. Watertight Underside Shell & Solid Side Cheeks (Zero-gap manifold enclosure)
        const wallT = 0.012;
        pushBox(minX - wallT, frontFloorY - wallT, maxZ, maxX + wallT, bottomDeckY, maxZ + wallT, COLOR_DEFAULT);
        pushQuad(
          [maxX + wallT, rampFloorEndY - wallT, trenchFrontZ],
          [minX - wallT, rampFloorEndY - wallT, trenchFrontZ],
          [minX - wallT, frontFloorY - wallT, maxZ],
          [maxX + wallT, frontFloorY - wallT, maxZ],
          [0, -dzR / lenR, dyR / lenR],
          COLOR_DEFAULT
        );
        pushBox(minX - wallT, trenchFloorY - wallT, minZ - wallT, maxX + wallT, bottomDeckY, trenchFrontZ, COLOR_DEFAULT);

        // Exterior Left & Right Vertical Side Cheeks (Seals outer side profile so no gaps exist)
        pushQuad(
          [minX - wallT, rampFloorEndY - wallT, trenchFrontZ],
          [minX - wallT, frontFloorY - wallT, maxZ],
          [minX - wallT, bottomDeckY, maxZ],
          [minX - wallT, bottomDeckY, trenchFrontZ],
          [-1, 0, 0],
          COLOR_DEFAULT
        );
        pushQuad(
          [maxX + wallT, frontFloorY - wallT, maxZ],
          [maxX + wallT, rampFloorEndY - wallT, trenchFrontZ],
          [maxX + wallT, bottomDeckY, trenchFrontZ],
          [maxX + wallT, bottomDeckY, maxZ],
          [1, 0, 0],
          COLOR_DEFAULT
        );

        // Sloped Edge Thickness Closures (Sealing gap between inner sidewall & outer underbelly)
        pushQuad(
          [minX - wallT, frontFloorY - wallT, maxZ],
          [minX, frontFloorY, maxZ],
          [minX, rampFloorEndY, trenchFrontZ],
          [minX - wallT, rampFloorEndY - wallT, trenchFrontZ],
          [-1, -1, 0],
          COLOR_DEFAULT
        );
        pushQuad(
          [maxX, frontFloorY, maxZ],
          [maxX + wallT, frontFloorY - wallT, maxZ],
          [maxX + wallT, rampFloorEndY - wallT, trenchFrontZ],
          [maxX, rampFloorEndY, trenchFrontZ],
          [1, -1, 0],
          COLOR_DEFAULT
        );

        // Underside Deck Bridge Flanges (Flush connection to countertop deck cutout)
        pushQuad([minX - wallT, bottomDeckY, minZ], [minX - wallT, bottomDeckY, maxZ], [minX, bottomDeckY, maxZ], [minX, bottomDeckY, minZ], [0, -1, 0], COLOR_DEFAULT);
        pushQuad([maxX, bottomDeckY, minZ], [maxX, bottomDeckY, maxZ], [maxX + wallT, bottomDeckY, maxZ], [maxX + wallT, bottomDeckY, minZ], [0, -1, 0], COLOR_DEFAULT);

        // 9. Concealed / Slot Drain in Rear Trench
        pushDetailedSinkDrain(bX, trenchFloorY + 0.001, minZ + trenchDepth * 0.5, trenchFloorY - wallT, false);

      } else if (basinSpec.shape === 'uc-sloped' || basinSpec.id === 'undermount-channel' || basinSpec.id === 'uc') {
        // UC (Undermount Channel): Continuous sleek slope starting from deck rim to deep rear drainage channel (Images 3 & 4)
        const minX = bX - bW / 2;
        const maxX = bX + bW / 2;
        const minZ = bZ - bD / 2; // Rear wall
        const maxZ = bZ + bD / 2; // Front wall
        const trenchDepth = Math.min(0.060, Math.max(0.042, bD * 0.16)); // ~48mm rear sump trench
        const trenchFrontZ = minZ + trenchDepth;
        // Sloped washplane ramp begins flush at countertop deck level (topY) with zero gap
        const frontFloorY = topY;
        const trenchFloorY = bowlFloorY; // Deep rear channel floor
        const rampFloorEndY = topRimY - Math.max(0.055, (topRimY - bowlFloorY) * 0.50); // Continuous long incline

        // Top-Mount 12mm Solid Surface Outer Rim Border (resting flush on countertop deck with zero gap)
        if (isTopMount) {
          const borderW = 0.012;
          // Top horizontal border rim resting at topRimY (CCW facing +Y)
          pushQuad([minX - borderW, topRimY, maxZ + borderW], [maxX + borderW, topRimY, maxZ + borderW], [maxX + borderW, topRimY, maxZ], [minX - borderW, topRimY, maxZ], [0, 1, 0], COLOR_DEFAULT);
          pushQuad([minX - borderW, topRimY, minZ], [maxX + borderW, topRimY, minZ], [maxX + borderW, topRimY, minZ - borderW], [minX - borderW, topRimY, minZ - borderW], [0, 1, 0], COLOR_DEFAULT);
          pushQuad([minX - borderW, topRimY, maxZ], [minX, topRimY, maxZ], [minX, topRimY, minZ], [minX - borderW, topRimY, minZ], [0, 1, 0], COLOR_DEFAULT);
          pushQuad([maxX, topRimY, maxZ], [maxX + borderW, topRimY, maxZ], [maxX + borderW, topRimY, minZ], [maxX, topRimY, minZ], [0, 1, 0], COLOR_DEFAULT);

          // Outer vertical perimeter drop down to countertop deck (topY)
          pushQuad([minX - borderW, topY, maxZ + borderW], [maxX + borderW, topY, maxZ + borderW], [maxX + borderW, topRimY, maxZ + borderW], [minX - borderW, topRimY, maxZ + borderW], [0, 0, 1], COLOR_DEFAULT);
          pushQuad([maxX + borderW, topY, minZ - borderW], [minX - borderW, topY, minZ - borderW], [minX - borderW, topRimY, minZ - borderW], [maxX + borderW, topRimY, minZ - borderW], [0, 0, -1], COLOR_DEFAULT);
          pushQuad([minX - borderW, topY, minZ - borderW], [minX - borderW, topY, maxZ + borderW], [minX - borderW, topRimY, maxZ + borderW], [minX - borderW, topRimY, minZ - borderW], [-1, 0, 0], COLOR_DEFAULT);
          pushQuad([maxX + borderW, topY, maxZ + borderW], [maxX + borderW, topY, minZ - borderW], [maxX + borderW, topRimY, minZ - borderW], [maxX + borderW, topRimY, maxZ + borderW], [1, 0, 0], COLOR_DEFAULT);

          // Front Inner Lip Reveal (at maxZ between frontFloorY=topY and topRimY, CCW facing -Z into basin)
          pushQuad(
            [maxX, frontFloorY, maxZ],
            [minX, frontFloorY, maxZ],
            [minX, topRimY, maxZ],
            [maxX, topRimY, maxZ],
            [0, 0, -1],
            COLOR_DEFAULT
          );
        }

        // 1. Continuous Sloped Washplane Ramp (descending full length to rear trench, CCW facing +Y/-Z)
        const dzR = maxZ - trenchFrontZ;
        const dyR = frontFloorY - rampFloorEndY;
        const lenR = Math.hypot(dyR, dzR);
        const nRamp: [number, number, number] = [0, dzR / lenR, -dyR / lenR];
        pushQuad(
          [minX, frontFloorY, maxZ],
          [maxX, frontFloorY, maxZ],
          [maxX, rampFloorEndY, trenchFrontZ],
          [minX, rampFloorEndY, trenchFrontZ],
          nRamp,
          COLOR_DEFAULT
        );

        // 2. Step Drop into Rear Trench (at trenchFrontZ, facing -Z)
        pushQuad(
          [maxX, trenchFloorY, trenchFrontZ],
          [minX, trenchFloorY, trenchFrontZ],
          [minX, rampFloorEndY, trenchFrontZ],
          [maxX, rampFloorEndY, trenchFrontZ],
          [0, 0, -1],
          COLOR_DEFAULT
        );

        // 3. Rear Drainage Trench Floor (facing +Y)
        pushQuad(
          [minX, trenchFloorY, trenchFrontZ],
          [maxX, trenchFloorY, trenchFrontZ],
          [maxX, trenchFloorY, minZ],
          [minX, trenchFloorY, minZ],
          [0, 1, 0],
          COLOR_DEFAULT
        );

        // 4. Rear Vertical Wall (rising from trench floor up to topRimY, facing +Z)
        pushQuad(
          [minX, trenchFloorY, minZ],
          [maxX, trenchFloorY, minZ],
          [maxX, topRimY, minZ],
          [minX, topRimY, minZ],
          [0, 0, 1],
          COLOR_DEFAULT
        );

        // 5. Left Vertical Sidewall (Watertight enclosure at minX, facing +X)
        pushQuad(
          [minX, rampFloorEndY, trenchFrontZ],
          [minX, frontFloorY, maxZ],
          [minX, topRimY, maxZ],
          [minX, topRimY, trenchFrontZ],
          [1, 0, 0],
          COLOR_DEFAULT
        );
        pushQuad(
          [minX, trenchFloorY, trenchFrontZ],
          [minX, trenchFloorY, minZ],
          [minX, topRimY, minZ],
          [minX, topRimY, trenchFrontZ],
          [1, 0, 0],
          COLOR_DEFAULT
        );

        // 6. Right Vertical Sidewall (Watertight enclosure at maxX, facing -X)
        pushQuad(
          [maxX, frontFloorY, maxZ],
          [maxX, rampFloorEndY, trenchFrontZ],
          [maxX, topRimY, trenchFrontZ],
          [maxX, topRimY, maxZ],
          [-1, 0, 0],
          COLOR_DEFAULT
        );
        pushQuad(
          [maxX, trenchFloorY, minZ],
          [maxX, trenchFloorY, trenchFrontZ],
          [maxX, topRimY, trenchFrontZ],
          [maxX, topRimY, minZ],
          [-1, 0, 0],
          COLOR_DEFAULT
        );

        // 7. Watertight Underside Shell (Continuous wedge tapering to rear sump, matching side profile of Image 4)
        const wallT = 0.012;
        pushQuad(
          [maxX + wallT, rampFloorEndY - wallT, trenchFrontZ],
          [minX - wallT, rampFloorEndY - wallT, trenchFrontZ],
          [minX - wallT, bottomDeckY, maxZ],
          [maxX + wallT, bottomDeckY, maxZ],
          [0, -dzR / lenR, dyR / lenR],
          COLOR_DEFAULT
        );
        pushBox(minX - wallT, trenchFloorY - wallT, minZ - wallT, maxX + wallT, bottomDeckY, trenchFrontZ, COLOR_DEFAULT);

        // Exterior Left & Right Vertical Side Cheeks (Seals outer wedge profile so zero gaps exist)
        pushTri(
          [minX - wallT, bottomDeckY, maxZ],
          [minX - wallT, bottomDeckY, trenchFrontZ],
          [minX - wallT, rampFloorEndY - wallT, trenchFrontZ],
          [-1, 0, 0],
          COLOR_DEFAULT
        );
        pushTri(
          [maxX + wallT, bottomDeckY, trenchFrontZ],
          [maxX + wallT, bottomDeckY, maxZ],
          [maxX + wallT, rampFloorEndY - wallT, trenchFrontZ],
          [1, 0, 0],
          COLOR_DEFAULT
        );

        // Sloped Edge Thickness Closures (Sealing gap between inner sidewall & outer underbelly)
        pushQuad(
          [minX - wallT, bottomDeckY, maxZ],
          [minX, frontFloorY, maxZ],
          [minX, rampFloorEndY, trenchFrontZ],
          [minX - wallT, rampFloorEndY - wallT, trenchFrontZ],
          [-1, -1, 0],
          COLOR_DEFAULT
        );
        pushQuad(
          [maxX, frontFloorY, maxZ],
          [maxX + wallT, bottomDeckY, maxZ],
          [maxX + wallT, rampFloorEndY - wallT, trenchFrontZ],
          [maxX, rampFloorEndY, trenchFrontZ],
          [1, -1, 0],
          COLOR_DEFAULT
        );

        // Underside Deck Bridge Flanges (Flush connection to countertop deck cutout)
        pushQuad([minX - wallT, bottomDeckY, minZ], [minX - wallT, bottomDeckY, maxZ], [minX, bottomDeckY, maxZ], [minX, bottomDeckY, minZ], [0, -1, 0], COLOR_DEFAULT);
        pushQuad([maxX, bottomDeckY, minZ], [maxX, bottomDeckY, maxZ], [maxX + wallT, bottomDeckY, maxZ], [maxX + wallT, bottomDeckY, minZ], [0, -1, 0], COLOR_DEFAULT);

        // 8. Concealed / Slot Drain in Rear Trench
        pushDetailedSinkDrain(bX, trenchFloorY + 0.001, minZ + trenchDepth * 0.5, trenchFloorY - wallT, false);

      } else if (basinSpec.shape === 'wdt-sloped' || basinSpec.id === 'washdesk-trough') {
        // WDT (Washdesk Trough): Sloping SIDEWAYS (left-to-right or right-to-left across the trough span)
        const isLeftDeep = (cfg.wdtSlopeDirection || 'right-to-left') === 'right-to-left';
        const minX = bX - bW / 2;
        const maxX = bX + bW / 2;
        const minZ = bZ - bD / 2; // Rear wall
        const maxZ = bZ + bD / 2; // Front wall
        const deepFloorY = bowlFloorY; // Deep floor level (~120-140mm below deck)

        // Top-Mount 12mm Solid Surface Outer Rim Border (resting flush on countertop deck)
        if (isTopMount) {
          const borderW = 0.012;
          // Top horizontal border rim resting at topRimY (CCW facing +Y)
          pushQuad([minX - borderW, topRimY, maxZ + borderW], [maxX + borderW, topRimY, maxZ + borderW], [maxX + borderW, topRimY, maxZ], [minX - borderW, topRimY, maxZ], [0, 1, 0], COLOR_DEFAULT);
          pushQuad([minX - borderW, topRimY, minZ], [maxX + borderW, topRimY, minZ], [maxX + borderW, topRimY, minZ - borderW], [minX - borderW, topRimY, minZ - borderW], [0, 1, 0], COLOR_DEFAULT);
          pushQuad([minX - borderW, topRimY, maxZ], [minX, topRimY, maxZ], [minX, topRimY, minZ], [minX - borderW, topRimY, minZ], [0, 1, 0], COLOR_DEFAULT);
          pushQuad([maxX, topRimY, maxZ], [maxX + borderW, topRimY, maxZ], [maxX + borderW, topRimY, minZ], [maxX, topRimY, minZ], [0, 1, 0], COLOR_DEFAULT);

          // Outer vertical perimeter drop down to countertop deck (topY)
          pushQuad([minX - borderW, topY, maxZ + borderW], [maxX + borderW, topY, maxZ + borderW], [maxX + borderW, topRimY, maxZ + borderW], [minX - borderW, topRimY, maxZ + borderW], [0, 0, 1], COLOR_DEFAULT);
          pushQuad([maxX + borderW, topY, minZ - borderW], [minX - borderW, topY, minZ - borderW], [minX - borderW, topRimY, minZ - borderW], [maxX + borderW, topRimY, minZ - borderW], [0, 0, -1], COLOR_DEFAULT);
          pushQuad([minX - borderW, topY, minZ - borderW], [minX - borderW, topY, maxZ + borderW], [minX - borderW, topRimY, maxZ + borderW], [minX - borderW, topRimY, minZ - borderW], [-1, 0, 0], COLOR_DEFAULT);
          pushQuad([maxX + borderW, topY, maxZ + borderW], [maxX + borderW, topY, minZ - borderW], [maxX + borderW, topRimY, minZ - borderW], [maxX + borderW, topRimY, maxZ + borderW], [1, 0, 0], COLOR_DEFAULT);
        }

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

        // 1. Sideways Sloped Basin Floor (CCW facing +Y)
        pushQuad(
          [minX, floorLeftY, maxZ],
          [maxX, floorRightY, maxZ],
          [maxX, floorRightY, minZ],
          [minX, floorLeftY, minZ],
          nFloor,
          COLOR_DEFAULT
        );

        // 2. Front Vertical Trapezoid Wall (at maxZ, CCW facing -Z into basin)
        pushQuad(
          [maxX, floorRightY, maxZ],
          [minX, floorLeftY, maxZ],
          [minX, topRimY, maxZ],
          [maxX, topRimY, maxZ],
          [0, 0, -1],
          COLOR_DEFAULT
        );

        // 3. Rear Vertical Trapezoid Wall (at minZ, CCW facing +Z into basin)
        pushQuad(
          [minX, floorLeftY, minZ],
          [maxX, floorRightY, minZ],
          [maxX, topRimY, minZ],
          [minX, topRimY, minZ],
          [0, 0, 1],
          COLOR_DEFAULT
        );

        // 4. Left Vertical End Wall (at minX, CCW facing +X into basin)
        pushQuad(
          [minX, floorLeftY, maxZ],
          [minX, floorLeftY, minZ],
          [minX, topRimY, minZ],
          [minX, topRimY, maxZ],
          [1, 0, 0],
          COLOR_DEFAULT
        );

        // 5. Right Vertical End Wall (at maxX, CCW facing -X into basin)
        pushQuad(
          [maxX, floorRightY, minZ],
          [maxX, floorRightY, maxZ],
          [maxX, topRimY, maxZ],
          [maxX, topRimY, minZ],
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

        // Watertight Deck Cutout Flanges at bottomDeckY (Eliminate any seam gaps under countertop deck)
        pushQuad([minX - wallT, bottomDeckY, maxZ + wallT], [maxX + wallT, bottomDeckY, maxZ + wallT], [maxX, bottomDeckY, maxZ], [minX, bottomDeckY, maxZ], [0, -1, 0], COLOR_DEFAULT);
        pushQuad([maxX + wallT, bottomDeckY, minZ - wallT], [minX - wallT, bottomDeckY, minZ - wallT], [minX, bottomDeckY, minZ], [maxX, bottomDeckY, minZ], [0, -1, 0], COLOR_DEFAULT);
        pushQuad([minX - wallT, bottomDeckY, minZ - wallT], [minX - wallT, bottomDeckY, maxZ + wallT], [minX, bottomDeckY, maxZ], [minX, bottomDeckY, minZ], [0, -1, 0], COLOR_DEFAULT);
        pushQuad([maxX, bottomDeckY, maxZ], [maxX, bottomDeckY, minZ], [maxX + wallT, bottomDeckY, minZ - wallT], [maxX + wallT, bottomDeckY, maxZ + wallT], [0, -1, 0], COLOR_DEFAULT);

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
