import { BasinConfiguration } from '@/data/basinConfiguratorData';
import { ProceduralMeshData } from './meshBuilder';

/**
 * Builds high-precision 3D metric mesh geometry for a standalone solid surface countertop basin.
 * Metric scale: 1.0 unit = 1.0 meter (1000mm).
 * Center of basin is at (X: 0, Z: 0), with the base resting on the ground at Y: 0.
 */
export function buildStandaloneBasinMesh(cfg: BasinConfiguration): ProceduralMeshData {
  const verts: number[] = [];
  const norms: number[] = [];
  const colors: number[] = [];
  const indices: number[] = [];

  // Color tokens
  const COLOR_DEFAULT: [number, number, number, number] = [1.0, 1.0, 1.0, 0.0];      // Base stone / Corian
  const COLOR_SHADOW: [number, number, number, number] = [0.91, 0.91, 0.91, 0.0];      // Ambient cavity shading
  const COLOR_CHROME: [number, number, number, number] = [0.86, 0.89, 0.93, 1.0];      // Polished mirror chrome
  const COLOR_DARK_HOLE: [number, number, number, number] = [0.06, 0.07, 0.08, 1.0];   // Deep drain throat
  const COLOR_PULL_RING: [number, number, number, number] = [0.80, 0.82, 0.86, 1.0];   // Metallic bead-chain

  // Dimensions in meters
  const W = cfg.width / 1000;
  const D = cfg.depth / 1000;
  const H = cfg.height / 1000;

  const halfW = W / 2;
  const halfD = D / 2;
  const wallT = 0.012; // 12mm solid surface rim thickness
  const floorY = 0.014; // 14mm thick bottom substrate

  // Geometric primitives
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

  const pushQuad = (
    p1: [number, number, number],
    p2: [number, number, number],
    p3: [number, number, number],
    p4: [number, number, number],
    n: [number, number, number],
    c: [number, number, number, number] = COLOR_DEFAULT
  ) => {
    pushQuadSmooth(p1, p2, p3, p4, n, n, n, n, c);
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

  const pushCylinder = (
    baseCenter: [number, number, number],
    axis: 'y' | 'z',
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

      if (axis === 'y') {
        const p1: [number, number, number] = [bx + c1 * radius, by, bz + s1 * radius];
        const p2: [number, number, number] = [bx + c2 * radius, by, bz + s2 * radius];
        const p3: [number, number, number] = [bx + c2 * radius, by + length, bz + s2 * radius];
        const p4: [number, number, number] = [bx + c1 * radius, by + length, bz + s1 * radius];
        pushQuadSmooth(p1, p2, p3, p4, [c1, 0, s1], [c2, 0, s2], [c2, 0, s2], [c1, 0, s1], c);
      }
    }
  };

  const pushBox = (
    minX: number, minY: number, minZ: number,
    maxX: number, maxY: number, maxZ: number,
    c: [number, number, number, number] = COLOR_DEFAULT
  ) => {
    if (minX >= maxX || minY >= maxY || minZ >= maxZ) return;
    pushQuad([minX, maxY, maxZ], [maxX, maxY, maxZ], [maxX, maxY, minZ], [minX, maxY, minZ], [0, 1, 0], c);
    pushQuad([minX, minY, minZ], [maxX, minY, minZ], [maxX, minY, maxZ], [minX, minY, maxZ], [0, -1, 0], c);
    pushQuad([minX, minY, maxZ], [maxX, minY, maxZ], [maxX, maxY, maxZ], [minX, maxY, maxZ], [0, 0, 1], c);
    pushQuad([maxX, minY, minZ], [minX, minY, minZ], [minX, maxY, minZ], [maxX, maxY, minZ], [0, 0, -1], c);
    pushQuad([minX, minY, minZ], [minX, minY, maxZ], [minX, maxY, maxZ], [minX, maxY, minZ], [-1, 0, 0], c);
    pushQuad([maxX, minY, maxZ], [maxX, minY, minZ], [maxX, maxY, minZ], [maxX, maxY, maxZ], [1, 0, 0], c);
  };

  // Superellipse profile evaluator for oval, circular, and capsule shapes
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

  // Push architectural pop-up drain mechanism
  const pushDetailedDrain = (drainY: number) => {
    const drainType = cfg.drainTypeId || 'click-clack-chrome';
    const segs = 32;
    const rBezelOut = 0.038; // 76mm diameter outer flange
    const rBezelIn = 0.029;  // 58mm inner rim
    const bezelH = 0.003;
    const throatDepth = 0.010;

    if (drainType !== 'freeflow-corian') {
      for (let i = 0; i < segs; i++) {
        const a1 = (i / segs) * Math.PI * 2;
        const a2 = ((i + 1) / segs) * Math.PI * 2;
        const c1 = Math.cos(a1);
        const s1 = Math.sin(a1);
        const c2 = Math.cos(a2);
        const s2 = Math.sin(a2);

        // Chrome beveled outer flange ring
        const pb1: [number, number, number] = [rBezelOut * c1, drainY, rBezelOut * s1];
        const pb2: [number, number, number] = [rBezelOut * c2, drainY, rBezelOut * s2];
        const pb3: [number, number, number] = [rBezelIn * c2, drainY + bezelH, rBezelIn * s2];
        const pb4: [number, number, number] = [rBezelIn * c1, drainY + bezelH, rBezelIn * s1];
        pushQuadSmooth(pb1, pb2, pb3, pb4, [c1 * 0.707, 0.707, s1 * 0.707], [c2 * 0.707, 0.707, s2 * 0.707], [c2 * 0.707, 0.707, s2 * 0.707], [c1 * 0.707, 0.707, s1 * 0.707], COLOR_CHROME);

        // Dark drainage throat well
        const pw1: [number, number, number] = [rBezelIn * c1, drainY + bezelH, rBezelIn * s1];
        const pw2: [number, number, number] = [rBezelIn * c2, drainY + bezelH, rBezelIn * s2];
        const pw3: [number, number, number] = [rBezelIn * c2, drainY - throatDepth, rBezelIn * s2];
        const pw4: [number, number, number] = [rBezelIn * c1, drainY - throatDepth, rBezelIn * s1];
        pushQuad(pw1, pw2, pw3, pw4, [-c1, 0, -s1], COLOR_DARK_HOLE);

        // Bottom well shelf
        const pt1: [number, number, number] = [rBezelIn * c1, drainY - throatDepth, rBezelIn * s1];
        const pt2: [number, number, number] = [rBezelIn * c2, drainY - throatDepth, rBezelIn * s2];
        pushTri([0, drainY - throatDepth, 0], pt1, pt2, [0, 1, 0], COLOR_DARK_HOLE);
      }
    }

    // 1. Click-Clack Pop-Up (Chrome)
    if (drainType === 'click-clack-chrome') {
      const rPlug = 0.026;
      const popUpY = drainY + 0.005;
      for (let i = 0; i < segs; i++) {
        const a1 = (i / segs) * Math.PI * 2;
        const a2 = ((i + 1) / segs) * Math.PI * 2;
        const c1 = Math.cos(a1);
        const s1 = Math.sin(a1);
        const c2 = Math.cos(a2);
        const s2 = Math.sin(a2);

        const pp1: [number, number, number] = [rPlug * c1, popUpY, rPlug * s1];
        const pp2: [number, number, number] = [rPlug * c2, popUpY, rPlug * s2];
        pushTri([0, popUpY + 0.002, 0], pp1, pp2, [0, 1, 0], COLOR_CHROME);

        const pLip1: [number, number, number] = [rPlug * c1, popUpY - 0.002, rPlug * s1];
        const pLip2: [number, number, number] = [rPlug * c2, popUpY - 0.002, rPlug * s2];
        pushQuad(pLip1, pLip2, pp2, pp1, [c1, 0, s1], COLOR_CHROME);
      }
      pushCylinder([0, drainY - throatDepth, 0], 'y', throatDepth + 0.005, 0.006, 12, COLOR_CHROME);
    }
    // 2. Click-Clack Pop-Up (Matching Corian Cap)
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

        const pp1: [number, number, number] = [rPlug * c1, popUpY, rPlug * s1];
        const pp2: [number, number, number] = [rPlug * c2, popUpY, rPlug * s2];
        pushTri([0, popUpY + 0.001, 0], pp1, pp2, [0, 1, 0], COLOR_DEFAULT);

        const pLip1: [number, number, number] = [rPlug * c1, popUpY - 0.003, rPlug * s1];
        const pLip2: [number, number, number] = [rPlug * c2, popUpY - 0.003, rPlug * s2];
        pushQuad(pLip1, pLip2, pp2, pp1, [c1, 0, s1], COLOR_DEFAULT);
      }
      pushCylinder([0, drainY - throatDepth, 0], 'y', throatDepth + 0.005, 0.006, 12, COLOR_CHROME);
    }
    // 3. Slotted Free-Flow Grate (Stainless Steel)
    else if (drainType === 'freeflow-chrome') {
      const grateY = drainY + bezelH;
      const rGrate = rBezelIn;
      const rHub = 0.008;

      for (let i = 0; i < 16; i++) {
        const a1 = (i / 16) * Math.PI * 2;
        const a2 = ((i + 1) / 16) * Math.PI * 2;
        pushTri([0, grateY, 0], [rHub * Math.cos(a1), grateY, rHub * Math.sin(a1)], [rHub * Math.cos(a2), grateY, rHub * Math.sin(a2)], [0, 1, 0], COLOR_CHROME);
      }

      const spokes = 8;
      const spokeHalfW = 0.0022;
      for (let s = 0; s < spokes; s++) {
        const ang = (s / spokes) * Math.PI * 2;
        const cosA = Math.cos(ang);
        const sinA = Math.sin(ang);
        const perpX = -sinA * spokeHalfW;
        const perpZ = cosA * spokeHalfW;

        const p1: [number, number, number] = [rHub * cosA + perpX, grateY, rHub * sinA + perpZ];
        const p2: [number, number, number] = [rGrate * cosA + perpX, grateY, rGrate * sinA + perpZ];
        const p3: [number, number, number] = [rGrate * cosA - perpX, grateY, rGrate * sinA - perpZ];
        const p4: [number, number, number] = [rHub * cosA - perpX, grateY, rHub * sinA - perpZ];
        pushQuad(p1, p2, p3, p4, [0, 1, 0], COLOR_CHROME);
      }
    }
    // 4. Corian Hidden Continuous Flow Slit
    else if (drainType === 'freeflow-corian') {
      const plateSize = 0.068;
      const wellSize = 0.078;
      const halfP = plateSize / 2;
      const halfW = wellSize / 2;
      const plateY = drainY + 0.003;
      const slitDepth = 0.012;

      pushBox(-halfW, drainY - slitDepth, -halfW, halfW, drainY, halfW, COLOR_DARK_HOLE);
      pushBox(-halfP, plateY - 0.006, -halfP, halfP, plateY, halfP, COLOR_DEFAULT);
    }
    // 5. Classic Bead-Chain & Rubber Stopper
    else if (drainType === 'rubber-plug') {
      const rPlug = 0.026;
      const plugY = drainY + 0.002;

      for (let i = 0; i < segs; i++) {
        const a1 = (i / segs) * Math.PI * 2;
        const a2 = ((i + 1) / segs) * Math.PI * 2;
        const pp1: [number, number, number] = [rPlug * Math.cos(a1), plugY, rPlug * Math.sin(a1)];
        const pp2: [number, number, number] = [rPlug * Math.cos(a2), plugY, rPlug * Math.sin(a2)];
        pushTri([0, plugY, 0], pp1, pp2, [0, 1, 0], COLOR_DARK_HOLE);
      }

      pushCylinder([0, plugY, 0], 'y', 0.008, 0.004, 10, COLOR_CHROME);

      // Triangular Chrome Pull Ring
      const ringR = 0.011;
      const ringTilt = 0.35;
      for (let i = 0; i < 16; i++) {
        const a1 = (i / 16) * Math.PI * 2;
        const a2 = ((i + 1) / 16) * Math.PI * 2;
        const rx1 = ringR * Math.cos(a1);
        const rz1 = ringR * Math.sin(a1) * Math.cos(ringTilt);
        const ry1 = plugY + 0.008 + ringR * Math.sin(a1) * Math.sin(ringTilt);
        const rx2 = ringR * Math.cos(a2);
        const rz2 = ringR * Math.sin(a2) * Math.cos(ringTilt);
        const ry2 = plugY + 0.008 + ringR * Math.sin(a2) * Math.sin(ringTilt);
        pushQuad([rx1, ry1 - 0.0012, rz1], [rx2, ry2 - 0.0012, rz2], [rx2, ry2 + 0.0012, rz2], [rx1, ry1 + 0.0012, rz1], [0, 1, 0], COLOR_CHROME);
      }

      // Beaded chain curving forward across basin floor
      for (let b = 0; b < 12; b++) {
        const t = b / 12;
        const cx = 0.06 * t + 0.02 * Math.sin(t * Math.PI);
        const cz = 0.07 * Math.pow(t, 1.2);
        const cy = drainY + 0.003 * Math.sin(t * Math.PI * 0.5) + 0.002;
        pushBox(cx - 0.0018, cy, cz - 0.0018, cx + 0.0018, cy + 0.0036, cz + 0.0018, COLOR_CHROME);
      }
    }

    // 6. Architectural Underside Waste Assembly (visible when inspecting below Y = 0)
    const rShank = 0.022; // 44mm standard 1 1/4" threaded chrome waste tailpipe
    const rNut = 0.038;   // 76mm chrome hexagonal locknut
    const rWasher = 0.042; // 84mm friction sealing washer
    const shankDepth = 0.070; // 70mm plumbing waste extension below base

    // Underside friction sealing washer at Y = 0 to -0.004m
    pushCylinder([0, -0.004, 0], 'y', 0.004, rWasher, 24, COLOR_DARK_HOLE);

    // Chrome Hexagonal Locking Nut (Y = -0.015m to -0.004m)
    pushCylinder([0, -0.015, 0], 'y', 0.011, rNut, 18, COLOR_CHROME);

    // Threaded Waste Tailpipe (Y = 0 down to -0.070m)
    pushCylinder([0, -shankDepth, 0], 'y', shankDepth, rShank, 24, COLOR_CHROME);

    // Dark drainage opening at bottom of tailpipe
    for (let i = 0; i < 24; i++) {
      const a1 = (i / 24) * Math.PI * 2;
      const a2 = ((i + 1) / 24) * Math.PI * 2;
      const c1 = Math.cos(a1);
      const s1 = Math.sin(a1);
      const c2 = Math.cos(a2);
      const s2 = Math.sin(a2);
      pushTri([0, -shankDepth, 0], [rShank * c1, -shankDepth, rShank * s1], [rShank * c2, -shankDepth, rShank * s2], [0, -1, 0], COLOR_DARK_HOLE);
    }
  };

  // =========================================================================
  // GEOMETRY GENERATOR PER SHAPE
  // =========================================================================
  const isRound = cfg.shape === 'round';
  const isCapsule = cfg.shape === 'capsule';
  const isOval = cfg.shape === 'oval';
  const isRectangular = cfg.shape === 'rectangular';

  if (isOval || isCapsule || isRound) {
    const segs = 64;
    const rings = 18;
    const pExp = isRound ? 2.0 : isCapsule ? 2.5 : 2.0;

    const rxExtRim = halfW;
    const rzExtRim = halfD;
    const rxIntRim = Math.max(0.04, rxExtRim - wallT);
    const rzIntRim = Math.max(0.04, rzExtRim - wallT);

    const baseScale = 0.72; // Elegant boat flare: bottom base is 72% of top rim
    const rxBase = rxExtRim * baseScale;
    const rzBase = rzExtRim * baseScale;

    // 1. Flat Bottom Base Plate (Resting at Y = 0)
    for (let i = 0; i < segs; i++) {
      const th1 = (i / segs) * Math.PI * 2;
      const th2 = ((i + 1) / segs) * Math.PI * 2;
      const pt1 = getSuperellipsePt(th1, rxBase, rzBase, pExp);
      const pt2 = getSuperellipsePt(th2, rxBase, rzBase, pExp);

      pushTri([0, 0, 0], [pt1.x, 0, pt1.z], [pt2.x, 0, pt2.z], [0, -1, 0], COLOR_DEFAULT);
    }

    // 2. Exterior Curved Side Wall (from Y: 0 up to Y: H)
    for (let j = 0; j < rings; j++) {
      const t1 = j / rings;
      const t2 = (j + 1) / rings;
      const y1 = H * t1;
      const y2 = H * t2;

      // Smooth ergonomic vessel curve
      const s1 = baseScale + (1 - baseScale) * Math.pow(Math.sin(t1 * Math.PI * 0.5), 0.85);
      const s2 = baseScale + (1 - baseScale) * Math.pow(Math.sin(t2 * Math.PI * 0.5), 0.85);

      const r1x = rxExtRim * s1;
      const r1z = rzExtRim * s1;
      const r2x = rxExtRim * s2;
      const r2z = rzExtRim * s2;

      for (let i = 0; i < segs; i++) {
        const th1 = (i / segs) * Math.PI * 2;
        const th2 = ((i + 1) / segs) * Math.PI * 2;

        const pt11 = getSuperellipsePt(th1, r1x, r1z, pExp);
        const pt21 = getSuperellipsePt(th2, r1x, r1z, pExp);
        const pt22 = getSuperellipsePt(th2, r2x, r2z, pExp);
        const pt12 = getSuperellipsePt(th1, r2x, r2z, pExp);

        const p1: [number, number, number] = [pt11.x, y1, pt11.z];
        const p2: [number, number, number] = [pt21.x, y1, pt21.z];
        const p3: [number, number, number] = [pt22.x, y2, pt22.z];
        const p4: [number, number, number] = [pt12.x, y2, pt12.z];

        const n1: [number, number, number] = [pt11.nx, (1 - t1) * 0.35, pt11.nz];
        const n2: [number, number, number] = [pt21.nx, (1 - t1) * 0.35, pt21.nz];
        const n3: [number, number, number] = [pt22.nx, (1 - t2) * 0.35, pt22.nz];
        const n4: [number, number, number] = [pt12.nx, (1 - t2) * 0.35, pt12.nz];

        pushQuadSmooth(p1, p2, p3, p4, n1, n2, n3, n4, COLOR_DEFAULT);
      }
    }

    // 3. Top Rim Flat Lip (at Y: H)
    for (let i = 0; i < segs; i++) {
      const th1 = (i / segs) * Math.PI * 2;
      const th2 = ((i + 1) / segs) * Math.PI * 2;

      const pExt1 = getSuperellipsePt(th1, rxExtRim, rzExtRim, pExp);
      const pExt2 = getSuperellipsePt(th2, rxExtRim, rzExtRim, pExp);
      const pInt1 = getSuperellipsePt(th1, rxIntRim, rzIntRim, pExp);
      const pInt2 = getSuperellipsePt(th2, rxIntRim, rzIntRim, pExp);

      pushQuad(
        [pExt1.x, H, pExt1.z],
        [pExt2.x, H, pExt2.z],
        [pInt2.x, H, pInt2.z],
        [pInt1.x, H, pInt1.z],
        [0, 1, 0],
        COLOR_DEFAULT
      );
    }

    // 4. Interior Dished Washbasin Cavity
    const rDrainHole = 0.038;
    for (let j = 0; j < rings; j++) {
      const t1 = j / rings;
      const t2 = (j + 1) / rings;
      const y1 = floorY + (H - floorY) * t1;
      const y2 = floorY + (H - floorY) * t2;

      const s1 = rDrainHole / rxIntRim + (1 - rDrainHole / rxIntRim) * Math.pow(Math.sin(t1 * Math.PI * 0.5), 0.75);
      const s2 = rDrainHole / rxIntRim + (1 - rDrainHole / rxIntRim) * Math.pow(Math.sin(t2 * Math.PI * 0.5), 0.75);

      const r1x = rxIntRim * s1;
      const r1z = rzIntRim * s1;
      const r2x = rxIntRim * s2;
      const r2z = rzIntRim * s2;

      for (let i = 0; i < segs; i++) {
        const th1 = (i / segs) * Math.PI * 2;
        const th2 = ((i + 1) / segs) * Math.PI * 2;

        const pt11 = getSuperellipsePt(th1, r1x, r1z, pExp);
        const pt21 = getSuperellipsePt(th2, r1x, r1z, pExp);
        const pt22 = getSuperellipsePt(th2, r2x, r2z, pExp);
        const pt12 = getSuperellipsePt(th1, r2x, r2z, pExp);

        const p1: [number, number, number] = [pt11.x, y1, pt11.z];
        const p2: [number, number, number] = [pt21.x, y1, pt21.z];
        const p3: [number, number, number] = [pt22.x, y2, pt22.z];
        const p4: [number, number, number] = [pt12.x, y2, pt12.z];

        const n1: [number, number, number] = [-pt11.nx * 0.8, 0.45, -pt11.nz * 0.8];
        const n2: [number, number, number] = [-pt21.nx * 0.8, 0.45, -pt21.nz * 0.8];
        const n3: [number, number, number] = [-pt22.nx * 0.8, 0.45, -pt22.nz * 0.8];
        const n4: [number, number, number] = [-pt12.nx * 0.8, 0.45, -pt12.nz * 0.8];

        pushQuadSmooth(p1, p2, p3, p4, n1, n2, n3, n4, COLOR_SHADOW);
      }
    }

    // Push detailed drain in cavity floor
    pushDetailedDrain(floorY);
  } else if (isRectangular) {
    // RECTANGULAR BASINS (sq-1, sq-2, sq-3, sq-4, sq-11)
    const crExt = Math.min(0.045, Math.min(halfW, halfD) * 0.35); // 45mm external corner radius
    const crInt = Math.max(0.015, crExt - wallT);
    const cornerSegs = 8;
    const rings = 12;

    const baseScale = 0.82; // 82% scale at bottom base
    const baseW = halfW * baseScale;
    const baseD = halfD * baseScale;
    const baseCr = crExt * baseScale;

    // Helper: generate 2D loop for rounded rectangle
    const getRectLoop = (w: number, d: number, r: number) => {
      const pts: { x: number; z: number; nx: number; nz: number }[] = [];
      const c1X = w - r, c1Z = d - r;
      const c2X = w - r, c2Z = -d + r;
      const c3X = -w + r, c3Z = -d + r;
      const c4X = -w + r, c4Z = d - r;

      // Corner 1: (+X, +Z)
      for (let i = 0; i < cornerSegs; i++) {
        const a = (i / cornerSegs) * (Math.PI * 0.5);
        pts.push({ x: c1X + r * Math.sin(a), z: c1Z + r * Math.cos(a), nx: Math.sin(a), nz: Math.cos(a) });
      }
      // Corner 2: (+X, -Z)
      for (let i = 0; i < cornerSegs; i++) {
        const a = (i / cornerSegs) * (Math.PI * 0.5);
        pts.push({ x: c2X + r * Math.cos(a), z: c2Z - r * Math.sin(a), nx: Math.cos(a), nz: -Math.sin(a) });
      }
      // Corner 3: (-X, -Z)
      for (let i = 0; i < cornerSegs; i++) {
        const a = (i / cornerSegs) * (Math.PI * 0.5);
        pts.push({ x: c3X - r * Math.sin(a), z: c3Z - r * Math.cos(a), nx: -Math.sin(a), nz: -Math.cos(a) });
      }
      // Corner 4: (-X, +Z)
      for (let i = 0; i < cornerSegs; i++) {
        const a = (i / cornerSegs) * (Math.PI * 0.5);
        pts.push({ x: c4X - r * Math.cos(a), z: c4Z + r * Math.sin(a), nx: -Math.cos(a), nz: Math.sin(a) });
      }
      return pts;
    };

    const basePts = getRectLoop(baseW, baseD, baseCr);
    const extPts = getRectLoop(halfW, halfD, crExt);
    const intPts = getRectLoop(halfW - wallT, halfD - wallT, crInt);
    const numPts = basePts.length;

    // 1. Bottom Base
    for (let i = 0; i < numPts; i++) {
      const p1 = basePts[i];
      const p2 = basePts[(i + 1) % numPts];
      pushTri([0, 0, 0], [p1.x, 0, p1.z], [p2.x, 0, p2.z], [0, -1, 0], COLOR_DEFAULT);
    }

    // 2. Exterior Walls (from Y: 0 to Y: H)
    for (let j = 0; j < rings; j++) {
      const t1 = j / rings;
      const t2 = (j + 1) / rings;
      const y1 = H * t1;
      const y2 = H * t2;

      const s1 = baseScale + (1 - baseScale) * Math.pow(Math.sin(t1 * Math.PI * 0.5), 0.85);
      const s2 = baseScale + (1 - baseScale) * Math.pow(Math.sin(t2 * Math.PI * 0.5), 0.85);

      const loop1 = getRectLoop(halfW * s1, halfD * s1, crExt * s1);
      const loop2 = getRectLoop(halfW * s2, halfD * s2, crExt * s2);

      for (let i = 0; i < numPts; i++) {
        const pt11 = loop1[i];
        const pt21 = loop1[(i + 1) % numPts];
        const pt22 = loop2[(i + 1) % numPts];
        const pt12 = loop2[i];

        pushQuadSmooth(
          [pt11.x, y1, pt11.z],
          [pt21.x, y1, pt21.z],
          [pt22.x, y2, pt22.z],
          [pt12.x, y2, pt12.z],
          [pt11.nx, (1 - t1) * 0.25, pt11.nz],
          [pt21.nx, (1 - t1) * 0.25, pt21.nz],
          [pt22.nx, (1 - t2) * 0.25, pt22.nz],
          [pt12.nx, (1 - t2) * 0.25, pt12.nz],
          COLOR_DEFAULT
        );
      }
    }

    // 3. Top Rim Lip
    for (let i = 0; i < numPts; i++) {
      const pExt1 = extPts[i];
      const pExt2 = extPts[(i + 1) % numPts];
      const pInt1 = intPts[i];
      const pInt2 = intPts[(i + 1) % numPts];

      pushQuad(
        [pExt1.x, H, pExt1.z],
        [pExt2.x, H, pExt2.z],
        [pInt2.x, H, pInt2.z],
        [pInt1.x, H, pInt1.z],
        [0, 1, 0],
        COLOR_DEFAULT
      );
    }

    // 4. Interior Dished Cavity Walls
    const innerW = halfW - wallT;
    const innerD = halfD - wallT;
    for (let j = 0; j < rings; j++) {
      const t1 = j / rings;
      const t2 = (j + 1) / rings;
      const y1 = floorY + (H - floorY) * t1;
      const y2 = floorY + (H - floorY) * t2;

      const s1 = 0.25 + 0.75 * Math.pow(Math.sin(t1 * Math.PI * 0.5), 0.75);
      const s2 = 0.25 + 0.75 * Math.pow(Math.sin(t2 * Math.PI * 0.5), 0.75);

      const loop1 = getRectLoop(innerW * s1, innerD * s1, crInt * s1);
      const loop2 = getRectLoop(innerW * s2, innerD * s2, crInt * s2);

      for (let i = 0; i < numPts; i++) {
        const pt11 = loop1[i];
        const pt21 = loop1[(i + 1) % numPts];
        const pt22 = loop2[(i + 1) % numPts];
        const pt12 = loop2[i];

        pushQuadSmooth(
          [pt11.x, y1, pt11.z],
          [pt21.x, y1, pt21.z],
          [pt22.x, y2, pt22.z],
          [pt12.x, y2, pt12.z],
          [-pt11.nx * 0.7, 0.45, -pt11.nz * 0.7],
          [-pt21.nx * 0.7, 0.45, -pt21.nz * 0.7],
          [-pt22.nx * 0.7, 0.45, -pt22.nz * 0.7],
          [-pt12.nx * 0.7, 0.45, -pt12.nz * 0.7],
          COLOR_SHADOW
        );
      }
    }

    // Push detailed drain
    pushDetailedDrain(floorY);
  }

  // Material RGB conversion
  const rawHex = (cfg.materialHex || '#f3f2ee').replace('#', '');
  const r = parseInt(rawHex.substring(0, 2), 16) / 255;
  const g = parseInt(rawHex.substring(2, 4), 16) / 255;
  const b = parseInt(rawHex.substring(4, 6), 16) / 255;

  return {
    positions: new Float32Array(verts),
    normals: new Float32Array(norms),
    colors: new Float32Array(colors),
    indices: new Uint16Array(indices),
    colorRgb: [isNaN(r) ? 0.95 : r, isNaN(g) ? 0.94 : g, isNaN(b) ? 0.92 : b],
    name: `Ace Spaces ${cfg.modelName} Solid Surface Basin`,
  };
}
