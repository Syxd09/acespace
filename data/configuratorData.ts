export interface ConfiguratorPreset {
  id: string;
  name: string;
  category: 'vanities' | 'washplanes' | 'benchtops' | 'commercial';
  tagline: string;
  description: string;
  defaultConfig: ProductConfiguration;
}

export interface BasinModel {
  id: string;
  name: string;
  code: string;
  shape: 'oval' | 'rectangular' | 'sloped' | 'capsule' | 'none';
  width: number; // mm
  depth: number; // mm
  height: number; // mm
  covedRadius: number; // mm
  description: string;
  priceModifier: number; // INR
}

export interface EdgeProfileOption {
  id: 'sharp' | 'rounded' | 'chamfer';
  name: string;
  code: string;
  description: string;
  radiusMm?: number;
  pricePerMeter: number;
}

export interface CornerProfileOption {
  id: 'square' | 'radius-small' | 'radius-large';
  name: string;
  radiusMm: number;
  description: string;
}

export interface ProductConfiguration {
  id?: string;
  presetId: string;
  title: string;
  // Dimensions (mm)
  width: number;
  depth: number;
  thickness: 12 | 19 | 24 | 60;
  // Aprons / Downstands (mm)
  frontApronHeight: number;
  hasLeftApron: boolean;
  hasRightApron: boolean;
  // Upstands / Splashbacks (mm)
  rearUpstandHeight: number;
  hasLeftUpstand: boolean;
  hasRightUpstand: boolean;
  isCovedUpstand: boolean;
  // Basin
  basinModelId: string;
  basinPlacement: 'center' | 'left' | 'right' | 'dual' | 'none';
  basinOffsetMm: number; // Offset from left/center
  tapHoles: 0 | 1 | 3;
  tapPosition: 'center' | 'left' | 'wall';
  // Edge & Corner
  edgeProfileId: 'sharp' | 'rounded' | 'chamfer';
  cornerProfileId: 'square' | 'radius-small' | 'radius-large';
  // Material
  materialSlug: string;
  materialName: string;
  materialHex: string;
  materialFinish: string;
  // Project References
  projectName: string;
  clientStudio: string;
  locationCity: string;
  specialInstructions: string;
  // Commercial
  quantity: number;
}

export const AVAILABLE_BASINS: BasinModel[] = [
  {
    id: 'coved-oval',
    name: 'Ace Coved Oval Basin',
    code: 'BSN-OVAL-450',
    shape: 'oval',
    width: 480,
    depth: 330,
    height: 140,
    covedRadius: 10,
    description: 'Thermoformed seamless oval washbowl with 10mm coved internal hygiene perimeter.',
    priceModifier: 14500,
  },
  {
    id: 'crisp-rect',
    name: 'Ace Rectangular Slope Basin',
    code: 'BSN-RECT-520',
    shape: 'rectangular',
    width: 520,
    depth: 350,
    height: 130,
    covedRadius: 6,
    description: 'Sharp architectural rectangular basin featuring precision laser-cut drainage slit.',
    priceModifier: 17800,
  },
  {
    id: 'linear-trough',
    name: 'Linear Washplane Trough',
    code: 'BSN-TRGH-600',
    shape: 'sloped',
    width: 600,
    depth: 360,
    height: 120,
    covedRadius: 8,
    description: 'Minimalist sloped continuous washplane channel with concealed rear perimeter drain.',
    priceModifier: 22400,
  },
  {
    id: 'capsule-pill',
    name: 'Ace Capsule Pill Basin',
    code: 'BSN-CAPS-500',
    shape: 'capsule',
    width: 500,
    depth: 320,
    height: 135,
    covedRadius: 12,
    description: 'Modern rounded capsule profile engineered for bespoke powder suites and boutique hotels.',
    priceModifier: 16200,
  },
  {
    id: 'none',
    name: 'Flat Continuous Deck (No Basin)',
    code: 'BSN-NONE-000',
    shape: 'none',
    width: 0,
    depth: 0,
    height: 0,
    covedRadius: 0,
    description: 'Unbroken solid surface worktop for cooktops, reception decks, and preparation islands.',
    priceModifier: 0,
  },
];

export const EDGE_PROFILES: EdgeProfileOption[] = [
  {
    id: 'sharp',
    name: 'Sharp Arris (2mm Eased)',
    code: 'EDG-ARRIS-2',
    description: 'Crisp architectural 90-degree edge with microscopic 2mm micro-bevel for durability.',
    radiusMm: 2,
    pricePerMeter: 650,
  },
  {
    id: 'rounded',
    name: 'Soft Pencil Round (R6)',
    code: 'EDG-RND-6',
    description: 'Smooth tactile 6mm radius bullnose ideal for high-traffic and healthcare ergonomics.',
    radiusMm: 6,
    pricePerMeter: 900,
  },
  {
    id: 'chamfer',
    name: '45° Architectural Bevel',
    code: 'EDG-CHAMF-45',
    description: 'Sculptural 5mm 45-degree chamfer catching geometric light transitions across the fascia.',
    radiusMm: 5,
    pricePerMeter: 1100,
  },
];

export const CORNER_PROFILES: CornerProfileOption[] = [
  {
    id: 'square',
    name: 'Crisp 90° Square',
    radiusMm: 0,
    description: 'Classic planar alignment designed for inset walls or alcove installations.',
  },
  {
    id: 'radius-small',
    name: 'Soft Radius (R20)',
    radiusMm: 20,
    description: 'Gentle rounded exterior corner preventing accidental hip contact in corridors.',
  },
  {
    id: 'radius-large',
    name: 'Sculptural Radius (R50)',
    radiusMm: 50,
    description: 'Bold organic curved corners delivering a soft, monolithic architectural statement.',
  },
];

export const CONFIGURATOR_PRESETS: ConfiguratorPreset[] = [
  {
    id: 'single-basin-vanity',
    name: 'Floating Single Basin Vanity',
    category: 'vanities',
    tagline: 'Wall-hung architectural console with seamlessly fused coved washbowl',
    description: 'Engineered for luxury residential en-suites and guest suites. Seamless monolithic solid surface top with integrated basin, 120mm mitred apron, and optional 80mm coved upstand.',
    defaultConfig: {
      presetId: 'single-basin-vanity',
      title: 'Floating Single Basin Vanity',
      width: 1200,
      depth: 520,
      thickness: 12,
      frontApronHeight: 120,
      hasLeftApron: true,
      hasRightApron: true,
      rearUpstandHeight: 80,
      hasLeftUpstand: false,
      hasRightUpstand: false,
      isCovedUpstand: true,
      basinModelId: 'coved-oval',
      basinPlacement: 'center',
      basinOffsetMm: 0,
      tapHoles: 1,
      tapPosition: 'center',
      edgeProfileId: 'rounded',
      cornerProfileId: 'radius-small',
      materialSlug: 'corian-glacier-white',
      materialName: 'Corian® Glacier White',
      materialHex: '#f3f2ee',
      materialFinish: 'Honed Satin Matte',
      projectName: 'Master Suite Project',
      clientStudio: '',
      locationCity: 'Bengaluru',
      specialInstructions: '',
      quantity: 1,
    },
  },
  {
    id: 'double-basin-vanity',
    name: 'Master Double Basin Console',
    category: 'vanities',
    tagline: 'Dual integrated coved bowls with expansive central grooming plane',
    description: 'High-end master bath vanity suite featuring two identical thermo-welded coved bowls, dual mirror symmetry, 150mm fascia apron drop, and concealed towel rails.',
    defaultConfig: {
      presetId: 'double-basin-vanity',
      title: 'Master Double Basin Console',
      width: 1800,
      depth: 540,
      thickness: 12,
      frontApronHeight: 140,
      hasLeftApron: true,
      hasRightApron: true,
      rearUpstandHeight: 100,
      hasLeftUpstand: true,
      hasRightUpstand: true,
      isCovedUpstand: true,
      basinModelId: 'crisp-rect',
      basinPlacement: 'dual',
      basinOffsetMm: 380,
      tapHoles: 1,
      tapPosition: 'center',
      edgeProfileId: 'sharp',
      cornerProfileId: 'square',
      materialSlug: 'corian-calacatta-greige',
      materialName: 'Corian® Calacatta Greige',
      materialHex: '#dfdbd2',
      materialFinish: 'Satin Smooth',
      projectName: 'Luxury Villa En-Suite',
      clientStudio: '',
      locationCity: 'Bengaluru',
      specialInstructions: 'Provide twin under-bench timber support brackets.',
      quantity: 1,
    },
  },
  {
    id: 'wall-washplane',
    name: 'Linear Commercial Washplane',
    category: 'washplanes',
    tagline: 'Continuous sloped drainage trough for high-traffic executive amenities',
    description: 'Designed for corporate headquarters, fine dining, and airports. Water glides across a 15-degree sloped plane into a hidden rear drainage trough with zero pooling.',
    defaultConfig: {
      presetId: 'wall-washplane',
      title: 'Linear Commercial Washplane',
      width: 1500,
      depth: 550,
      thickness: 19,
      frontApronHeight: 160,
      hasLeftApron: true,
      hasRightApron: true,
      rearUpstandHeight: 120,
      hasLeftUpstand: false,
      hasRightUpstand: false,
      isCovedUpstand: true,
      basinModelId: 'linear-trough',
      basinPlacement: 'center',
      basinOffsetMm: 0,
      tapHoles: 0,
      tapPosition: 'wall',
      edgeProfileId: 'chamfer',
      cornerProfileId: 'square',
      materialSlug: 'corian-concrete',
      materialName: 'Corian® Concrete',
      materialHex: '#9c9b96',
      materialFinish: 'Architectural Matte',
      projectName: 'Corporate Tower Amenities',
      clientStudio: '',
      locationCity: 'Bengaluru',
      specialInstructions: 'Wall mounted sensor tapware by others.',
      quantity: 1,
    },
  },
  {
    id: 'integrated-worktop',
    name: 'Monolithic Kitchen Island Benchtop',
    category: 'benchtops',
    tagline: 'Infinite seamless length with 60mm mitred apron and seamless sink',
    description: 'Continuous culinary worktop engineered with heavy-duty substrate reinforcement, 45-degree waterfall edge transitions, and flush-integrated prep sink.',
    defaultConfig: {
      presetId: 'integrated-worktop',
      title: 'Monolithic Kitchen Island Benchtop',
      width: 2400,
      depth: 850,
      thickness: 60,
      frontApronHeight: 60,
      hasLeftApron: true,
      hasRightApron: true,
      rearUpstandHeight: 0,
      hasLeftUpstand: false,
      hasRightUpstand: false,
      isCovedUpstand: false,
      basinModelId: 'crisp-rect',
      basinPlacement: 'right',
      basinOffsetMm: 450,
      tapHoles: 1,
      tapPosition: 'center',
      edgeProfileId: 'sharp',
      cornerProfileId: 'square',
      materialSlug: 'corian-artista-mist',
      materialName: 'Corian® Artista Mist',
      materialHex: '#d2d3cb',
      materialFinish: 'Velvet Satin',
      projectName: 'Penthouse Kitchen Worktop',
      clientStudio: '',
      locationCity: 'Bengaluru',
      specialInstructions: 'Match veining continuously down the right waterfall gable end.',
      quantity: 1,
    },
  },
  {
    id: 'commercial-washstation',
    name: 'Healthcare & Clinical Washstation',
    category: 'commercial',
    tagline: 'Zero-silica, non-porous bacteriological barrier with 150mm coved upstand',
    description: 'Certified for surgical scrub zones, hospital consultation bays, and cleanrooms. Seamless 10mm radius coved upstands ensure zero grime seams or bacteria accumulation.',
    defaultConfig: {
      presetId: 'commercial-washstation',
      title: 'Healthcare & Clinical Washstation',
      width: 1100,
      depth: 580,
      thickness: 12,
      frontApronHeight: 180,
      hasLeftApron: true,
      hasRightApron: true,
      rearUpstandHeight: 200,
      hasLeftUpstand: true,
      hasRightUpstand: true,
      isCovedUpstand: true,
      basinModelId: 'coved-oval',
      basinPlacement: 'center',
      basinOffsetMm: 0,
      tapHoles: 1,
      tapPosition: 'center',
      edgeProfileId: 'rounded',
      cornerProfileId: 'radius-large',
      materialSlug: 'corian-designer-white',
      materialName: 'Corian® Designer White',
      materialHex: '#ffffff',
      materialFinish: 'Hygienic Polished Matte',
      projectName: 'Clinical Scrub Station',
      clientStudio: '',
      locationCity: 'Bengaluru',
      specialInstructions: 'NSF/ANSI 51 certification batch report required.',
      quantity: 1,
    },
  },
];

// Curated solid surface materials with verified real swatches
export interface ConfiguratorMaterialSwatch {
  slug: string;
  name: string;
  code: string;
  collection: string;
  colorFamily: 'white' | 'cream' | 'grey' | 'earth' | 'black' | 'translucent';
  hexColor: string;
  finish: string;
  priceTier: 1 | 2 | 3 | 4; // 1 = Solid, 2 = Mineral blend, 3 = Veined, 4 = Translucent Onyx
  inStock: boolean;
  texturePattern?: string;
}

export const CONFIGURATOR_MATERIALS: ConfiguratorMaterialSwatch[] = [
  {
    slug: 'corian-glacier-white',
    name: 'Glacier White',
    code: 'GW-01',
    collection: 'Solid Series',
    colorFamily: 'white',
    hexColor: '#f3f2ee',
    finish: 'Honed Matte',
    priceTier: 1,
    inStock: true,
  },
  {
    slug: 'corian-cameo-white',
    name: 'Cameo White',
    code: 'CW-02',
    collection: 'Solid Series',
    colorFamily: 'cream',
    hexColor: '#eeebe1',
    finish: 'Satin Smooth',
    priceTier: 1,
    inStock: true,
  },
  {
    slug: 'corian-designer-white',
    name: 'Designer White',
    code: 'DW-03',
    collection: 'Solid Series',
    colorFamily: 'white',
    hexColor: '#ffffff',
    finish: 'Ultra Pure Matte',
    priceTier: 1,
    inStock: true,
  },
  {
    slug: 'corian-artista-beige',
    name: 'Artista Beige',
    code: 'AB-04',
    collection: 'Artista Series',
    colorFamily: 'cream',
    hexColor: '#e8e2d5',
    finish: 'Fine Grain Satin',
    priceTier: 2,
    inStock: true,
  },
  {
    slug: 'corian-artista-mist',
    name: 'Artista Mist',
    code: 'AM-05',
    collection: 'Artista Series',
    colorFamily: 'grey',
    hexColor: '#d2d3cb',
    finish: 'Velvet Satin',
    priceTier: 2,
    inStock: true,
  },
  {
    slug: 'corian-calacatta-greige',
    name: 'Calacatta Greige',
    code: 'CG-06',
    collection: 'Heritage Veined',
    colorFamily: 'cream',
    hexColor: '#dfdbd2',
    finish: 'Subtle Veined Matte',
    priceTier: 3,
    inStock: true,
  },
  {
    slug: 'corian-cirrus-white',
    name: 'Cirrus White',
    code: 'CI-07',
    collection: 'Heritage Veined',
    colorFamily: 'white',
    hexColor: '#e9e8e2',
    finish: 'Wisp Feather Vein',
    priceTier: 3,
    inStock: true,
  },
  {
    slug: 'corian-concrete',
    name: 'Corian® Concrete',
    code: 'CC-08',
    collection: 'Industrial Mineral',
    colorFamily: 'grey',
    hexColor: '#9c9b96',
    finish: 'Tactile Honed',
    priceTier: 2,
    inStock: true,
  },
  {
    slug: 'corian-stonecrest-smoke',
    name: 'Stonecrest Smoke',
    code: 'SS-09',
    collection: 'Architectural Slate',
    colorFamily: 'grey',
    hexColor: '#636662',
    finish: 'Satin Honed',
    priceTier: 3,
    inStock: true,
  },
  {
    slug: 'corian-deep-nocturne',
    name: 'Deep Nocturne',
    code: 'DN-10',
    collection: 'DeepColor™ Technology',
    colorFamily: 'black',
    hexColor: '#1a1b1a',
    finish: 'Deep Lustre Matte',
    priceTier: 3,
    inStock: true,
  },
  {
    slug: 'corian-terrazzo-laguna',
    name: 'Terrazzo Laguna',
    code: 'TL-11',
    collection: 'Particulate Terrazzo',
    colorFamily: 'grey',
    hexColor: '#8a8e87',
    finish: 'Smooth Ground Terrazzo',
    priceTier: 3,
    inStock: true,
  },
  {
    slug: 'corian-golden-onyx',
    name: 'Golden Onyx (Translucent)',
    code: 'GO-12',
    collection: 'Illumination Series',
    colorFamily: 'translucent',
    hexColor: '#e6c88b',
    finish: 'Backlit Translucent',
    priceTier: 4,
    inStock: true,
  },
];

// Calculation of realistic indicative quote based on actual solid surface fabrication engineering
export interface PriceBreakdown {
  baseSubstrate: number;
  thicknessSurcharge: number;
  apronDownstand: number;
  upstandSplashback: number;
  edgeTooling: number;
  basinIntegration: number;
  tapCutouts: number;
  totalIndicative: number;
}

export function calculateIndicativePrice(cfg: ProductConfiguration): PriceBreakdown {
  const widthM = cfg.width / 1000;
  const depthM = cfg.depth / 1000;
  const areaSqm = widthM * depthM;

  // Material Tier Base Rate per SQM (INR)
  const swatch = CONFIGURATOR_MATERIALS.find(m => m.slug === cfg.materialSlug);
  const tier = swatch ? swatch.priceTier : 1;
  const tierBaseRateMap: Record<number, number> = {
    1: 18500, // Solid
    2: 24000, // Mineral Blend
    3: 31000, // Veined / DeepColor
    4: 42000, // Translucent Illumination
  };
  const baseRatePerSqm = tierBaseRateMap[tier] || 18500;
  const baseSubstrate = Math.round(areaSqm * baseRatePerSqm);

  // Thickness factor
  let thicknessSurcharge = 0;
  if (cfg.thickness === 19) thicknessSurcharge = Math.round(baseSubstrate * 0.35);
  if (cfg.thickness === 24) thicknessSurcharge = Math.round(baseSubstrate * 0.6);
  if (cfg.thickness === 60) thicknessSurcharge = Math.round(baseSubstrate * 0.85);

  // Front + Side Apron drops (Fabrication & 45-degree mitred chemical welding)
  let totalApronM = (cfg.width / 1000);
  if (cfg.hasLeftApron) totalApronM += (cfg.depth / 1000);
  if (cfg.hasRightApron) totalApronM += (cfg.depth / 1000);
  const apronHeightFactor = (cfg.frontApronHeight / 100);
  const apronDownstand = Math.round(totalApronM * 2800 * Math.max(0.6, apronHeightFactor));

  // Upstand / Splashback (Coved chemical fusion)
  let totalUpstandM = (cfg.rearUpstandHeight > 0 ? (cfg.width / 1000) : 0);
  if (cfg.hasLeftUpstand) totalUpstandM += (cfg.depth / 1000);
  if (cfg.hasRightUpstand) totalUpstandM += (cfg.depth / 1000);
  const covedPremium = cfg.isCovedUpstand ? 1.4 : 1.0;
  const upstandHeightFactor = (cfg.rearUpstandHeight / 100);
  const upstandSplashback = Math.round(totalUpstandM * 2200 * covedPremium * Math.max(0.5, upstandHeightFactor));

  // CNC Edge profiling & hand finishing
  const edgeProfile = EDGE_PROFILES.find(e => e.id === cfg.edgeProfileId);
  const edgeRate = edgeProfile ? edgeProfile.pricePerMeter : 650;
  const exposedPerimeterM = (cfg.width / 1000) + (cfg.depth / 1000) * 2;
  const edgeTooling = Math.round(exposedPerimeterM * edgeRate);

  // Basin selection & molecular bonding
  let basinIntegration = 0;
  if (cfg.basinModelId !== 'none') {
    const basin = AVAILABLE_BASINS.find(b => b.id === cfg.basinModelId);
    const basinCost = basin ? basin.priceModifier : 14500;
    const basinQty = cfg.basinPlacement === 'dual' ? 2 : 1;
    basinIntegration = basinCost * basinQty;
  }

  // Tap hole CNC drilling
  const tapCutouts = cfg.tapHoles * 750;

  const totalIndicative = (baseSubstrate + thicknessSurcharge + apronDownstand + upstandSplashback + edgeTooling + basinIntegration + tapCutouts) * (cfg.quantity || 1);

  return {
    baseSubstrate,
    thicknessSurcharge,
    apronDownstand,
    upstandSplashback,
    edgeTooling,
    basinIntegration,
    tapCutouts,
    totalIndicative,
  };
}
