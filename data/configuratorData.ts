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
  shape: 'oval' | 'round' | 'rectangular' | 'soft-rect' | 'sloped' | 'ub-sloped' | 'uc-sloped' | 'wdt-sloped' | 'capsule' | 'none';
  width: number; // mm
  depth: number; // mm
  height: number; // mm
  covedRadius: number; // mm
  description: string;
  priceModifier: number; // INR
}

export type CornerType = 'sharp' | 'fillet' | 'chamfer' | 'shift';

export interface CornerConfig {
  type: CornerType;
  radiusMm: number; // 10, 20, 30, 50, 80
  chamferMm: number; // 10, 20, 35
  shiftMm: number; // -65 to +250mm
}

export interface CornerTreatmentConfig {
  leftType: 'sharp' | 'fillet' | 'chamfer' | 'shift';
  leftRadius: number;
  leftChamfer: number;
  leftShift: number;
  rightType: 'sharp' | 'fillet' | 'chamfer' | 'shift';
  rightRadius: number;
  rightChamfer: number;
  rightShift: number;
}

export type SinkIntegrationType = 'integrated' | 'undermount' | 'topmount' | 'none';

export interface SinkIntegrationOption {
  id: SinkIntegrationType;
  name: string;
  code: string;
  description: string;
  priceModifier: number;
}

export type TapLocationType = 'top-mounted' | 'wall-mounted';

export interface TapLocationOption {
  id: TapLocationType;
  name: string;
  description: string;
}

export interface DownstandConfig {
  front: boolean;
  left: boolean;
  right: boolean;
  heightMm: number; // 12, 30, 100, 150, 200, custom
  height?: number; // Compatibility alias
}

export type UpstandLengthMode = 'full' | 'none' | 'specific' | 'standard';

export interface UpstandConfig {
  type: 'none' | 'standard' | 'raised' | 'full' | 'custom';
  heightMm: number; // 0, 50, 100, 150, 300
  isCoved: boolean;
  backMode: UpstandLengthMode;
  backLengthMm: number;
  leftMode: UpstandLengthMode;
  leftLengthMm: number;
  rightMode: UpstandLengthMode;
  rightLengthMm: number;
  height?: number; // Compatibility alias
  coved?: boolean; // Compatibility alias
}

export interface TowelHolderConfig {
  enabled: boolean;
  lengthMm: number; // 300, 450
  position: 'left' | 'center' | 'right';
  filletMm: 4 | 12 | 25 | number;
  length?: number; // Compatibility alias
  cornerRadius?: number; // Compatibility alias
}

export type TopEdgeFinishType = 'sharp' | 'fillet' | 'chamfer';

export interface TopEdgeConfig {
  type: TopEdgeFinishType;
  radiusMm: number;
  chamferMm: number;
}

export interface DrainOption {
  id: string;
  name: string;
  code: string;
  finish: string;
  description: string;
  priceInr: number;
  priceModifier?: number;
  isMatchedColor?: boolean;
}

export interface ProductConfiguration {
  id?: string;
  presetId: string;
  title: string;

  // Dimensions (mm)
  width: number;
  depth: number;
  thickness: 12 | 19 | 24 | 60;

  // Advanced Corner Profiles
  cornerLeft: CornerConfig;
  cornerRight: CornerConfig;
  cornerConfig?: CornerTreatmentConfig;

  // Tap Configuration
  tapLocation: TapLocationType;
  tapHoles: 0 | 1 | 2 | 3;
  tapHoleDiameterMm: number;

  // Sink & Basin
  sinkIntegration: SinkIntegrationType;
  basinModelId: string;
  basinPlacement: 'center' | 'left' | 'right' | 'dual' | 'none';
  basinOffsetMm: number; // Offset from center/left
  basinWidthMm?: number;
  basinDepthMm?: number;
  basinHeightMm?: number;
  basinSizeCode?: string;
  wdtSlopeDirection?: 'left-to-right' | 'right-to-left';
  wdtSlopeAngleDeg?: number;

  // Downstands (Aprons)
  downstands: DownstandConfig;
  frontApronHeight: number; // Direct access / legacy sync
  hasLeftApron: boolean;
  hasRightApron: boolean;

  // Upstands & Splashbacks
  upstands: UpstandConfig;
  rearUpstandHeight: number; // Direct access / legacy sync
  hasLeftUpstand: boolean;
  hasRightUpstand: boolean;
  isCovedUpstand: boolean;

  // Towel Holder
  towelHolder: TowelHolderConfig;

  // Top Edge Finishing
  topEdge: TopEdgeConfig;
  edgeProfileId: 'sharp' | 'rounded' | 'chamfer'; // Legacy sync

  // Drain System
  drainTypeId: string;
  drainOption?: string;

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

  // Optional convenience / legacy aliases
  referenceCode?: string;
  colorName?: string;
  tapPosition?: string;
  cornerProfileId?: string;
}

export const SINK_INTEGRATIONS: SinkIntegrationOption[] = [
  {
    id: 'integrated',
    name: 'Seamless Integrated Coved Basin',
    code: 'INT-COVED',
    description: 'Thermo-welded seamless fusion with zero visible joints or dirt-harboring silicone perimeters.',
    priceModifier: 0,
  },
  {
    id: 'undermount',
    name: 'Precision Undermount Cut-out',
    code: 'INT-UNDER',
    description: 'Calibrated CNC perimeter cut-out with water-sealed sub-deck mounting hardware brackets.',
    priceModifier: -2500,
  },
  {
    id: 'topmount',
    name: 'Top-Mount Vessel Island',
    code: 'INT-VESSEL',
    description: 'Deck hole boring with polished perimeter rim engineered for countertop vessel bowls.',
    priceModifier: -4000,
  },
  {
    id: 'none',
    name: 'Solid Surface Deck (No Basin)',
    code: 'INT-SOLID',
    description: 'Continuous uninterrupted surface for kitchen islands, reception counters, or desks.',
    priceModifier: -14500,
  },
];

export const TAP_LOCATIONS: TapLocationOption[] = [
  {
    id: 'top-mounted',
    name: 'Top-Mounted Deck Faucet',
    description: 'Precision CNC drilled 35mm deck hole with water-tight collar clearance behind the basin.',
  },
  {
    id: 'wall-mounted',
    name: 'Wall-Mounted Concealed Faucet',
    description: 'Continuous uncluttered deck surface; faucet spout and mixer install directly into wall cavity.',
  },
];

export const SINK_INTEGRATION_OPTIONS = SINK_INTEGRATIONS;
export const TAP_LOCATION_OPTIONS = TAP_LOCATIONS;

export const CORNER_TREATMENT_OPTIONS = [
  { id: 'shift', name: 'Shift', description: 'Step setback profile (20–150mm)', priceModifier: 1200, defaultRadius: 0, defaultChamfer: 0, defaultShift: 50 },
  { id: 'fillet', name: 'Fillet', description: 'CNC radius curve (R5–R100)', priceModifier: 600, defaultRadius: 25, defaultChamfer: 0, defaultShift: 0 },
  { id: 'chamfer', name: 'Chamfer', description: 'Angled bevel transit (5–80mm)', priceModifier: 450, defaultRadius: 0, defaultChamfer: 20, defaultShift: 0 },
  { id: 'sharp', name: 'Sharp', description: 'Clean geometric edge', priceModifier: 0, defaultRadius: 0, defaultChamfer: 0, defaultShift: 0 },
];
export const CORNER_PROFILES = CORNER_TREATMENT_OPTIONS;

export const DOWNSTAND_HEIGHT_OPTIONS = [
  { height: 12, label: '12mm Shadowline', description: 'Ultra-thin architectural reveal' },
  { height: 30, label: '30mm Standard', description: 'Balanced residential apron' },
  { height: 100, label: '100mm Drop Fascia', description: 'Substantial mitred front lip' },
  { height: 150, label: '150mm Deep Apron', description: 'Commercial & hotel console drop' },
  { height: 200, label: '200mm Monolith', description: 'Heavy architectural vanity block' },
];

export const UPSTAND_MODE_OPTIONS = [
  { id: 'full', name: 'Full Length Wall', description: 'Runs complete vanity span' },
  { id: 'standard', name: 'Standard 80mm', description: 'Low perimeter lip' },
  { id: 'none', name: 'No Splashback', description: 'Flush edge touching wall tile' },
];

export const TOWEL_HOLDER_OPTIONS = {
  lengths: [300, 450] as const,
  positions: ['left', 'center', 'right'] as const,
  cornerRadii: [4, 12, 25] as const,
};

export const TOP_EDGE_OPTIONS = [
  { id: 'sharp', name: 'Micro-Arris Sharp', description: 'Pencil-fine 1mm arris breakdown', defaultRadius: 1, defaultChamfer: 0 },
  { id: 'fillet', name: 'Rounded Bullnose', description: 'CNC machined radius curve', defaultRadius: 6, defaultChamfer: 0 },
  { id: 'chamfer', name: '45° Chamfer Bevel', description: 'Clean technical bevel transit', defaultRadius: 0, defaultChamfer: 3 },
];
export const EDGE_PROFILES = TOP_EDGE_OPTIONS;

export const AVAILABLE_BASINS: BasinModel[] = [
  {
    id: 'round-bowl',
    name: 'Ace Cylindrical Round Bowl',
    code: 'RO',
    shape: 'round',
    width: 420,
    depth: 420,
    height: 135,
    covedRadius: 10,
    description: 'Precision cylindrical round solid surface washbowl with seamless coved internal base.',
    priceModifier: 13800,
  },
  {
    id: 'coved-oval',
    name: 'Ace Coved Oval Basin',
    code: 'OV',
    shape: 'oval',
    width: 500,
    depth: 350,
    height: 135,
    covedRadius: 10,
    description: 'Thermoformed seamless oval washbowl with 10mm coved internal hygiene perimeter.',
    priceModifier: 14500,
  },
  {
    id: 'coved-rect',
    name: 'Ace Rectangular Coved Basin',
    code: 'A',
    shape: 'rectangular',
    width: 500,
    depth: 350,
    height: 135,
    covedRadius: 15,
    description: 'Thermoformed seamless rectangular solid surface basin with precision coved internal corners, soft underbelly shell, and integrated overflow slot.',
    priceModifier: 16800,
  },
  {
    id: 'crisp-rect',
    name: 'Ace Soft-Rectangular Basin',
    code: 'B',
    shape: 'soft-rect',
    width: 520,
    depth: 350,
    height: 130,
    covedRadius: 35,
    description: 'Thermoformed architectural basin with soft-rectangular profile, generous corner radii, and scooped curved underbelly.',
    priceModifier: 17800,
  },
  {
    id: 'double-basin',
    name: 'Ace Double Basin / Curved Base',
    code: 'DB',
    shape: 'oval',
    width: 560,
    depth: 360,
    height: 135,
    covedRadius: 14,
    description: 'Bespoke double curved washbowl with organic contoured profile.',
    priceModifier: 19500,
  },
  {
    id: 'undermount-box',
    name: 'Ace Undermount Box Basin',
    code: 'UB',
    shape: 'ub-sloped',
    width: 500,
    depth: 350,
    height: 140,
    covedRadius: 8,
    description: 'Bespoke undermount basin with vertical front reveal, inclined washplane ramp, and concealed rear drainage channel.',
    priceModifier: 16500,
  },
  {
    id: 'undermount-channel',
    name: 'Ace Undermount Sloped Channel',
    code: 'UC',
    shape: 'uc-sloped',
    width: 580,
    depth: 360,
    height: 120,
    covedRadius: 10,
    description: 'Continuous full-fall undermount channel basin with seamless deck transit and deep rear slot drainage sump.',
    priceModifier: 18200,
  },
  {
    id: 'washdesk-trough',
    name: 'Washdesk Trough',
    code: 'WDT',
    shape: 'wdt-sloped',
    width: 600,
    depth: 260,
    height: 120,
    covedRadius: 8,
    description: 'Precision architectural washdesk trough sloping forward from rear to a deep front trough with integrated waste outlet.',
    priceModifier: 21800,
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

export const RO_SIZE_OPTIONS = [
  { code: 'RO250', label: 'RO250', diameter: 250, height: 120 },
  { code: 'RO285', label: 'RO285', diameter: 285, height: 125 },
  { code: 'RO300', label: 'RO300', diameter: 300, height: 130 },
  { code: 'RO350', label: 'RO350', diameter: 350, height: 135 },
  { code: 'RO400', label: 'RO400', diameter: 400, height: 140 },
];

export const WDT_DEPTH_OPTIONS = [
  { code: 'WDT180', label: 'WDT180', depth: 180 },
  { code: 'WDT230', label: 'WDT230', depth: 230 },
  { code: 'WDT260', label: 'WDT260', depth: 260 },
  { code: 'WDT280', label: 'WDT280', depth: 280 },
  { code: 'WDT300', label: 'WDT300', depth: 300 },
  { code: 'WDT320', label: 'WDT320', depth: 320 },
  { code: 'WDT350', label: 'WDT350', depth: 350 },
  { code: 'WDT370', label: 'WDT370', depth: 370 },
  { code: 'WDT400', label: 'WDT400', depth: 400 },
];

export const SINK_WIDTH_OPTIONS = [420, 500, 600, 700, 900];
export const SINK_DEPTH_OPTIONS = [260, 300, 350, 400];

export const DRAIN_OPTIONS: DrainOption[] = [
  {
    id: 'click-clack-chrome',
    name: 'Click-Clack Pop-Up (Polished Chrome)',
    code: 'DRN-CC-CHROME',
    finish: 'Polished Mirror Chrome Brass',
    description: 'Classic spring-loaded push-operated pop-up waste with solid brass mechanism.',
    priceInr: 1850,
    priceModifier: 1850,
  },
  {
    id: 'click-clack-corian',
    name: 'Click-Clack Pop-Up (Matching Corian® Cap)',
    code: 'DRN-CC-CORIAN',
    finish: 'DuPont™ Corian® Solid Surface Disc',
    description: 'Architectural pop-up waste with top disc hand-crafted in the exact matching Corian® mineral.',
    priceInr: 3800,
    priceModifier: 3800,
    isMatchedColor: true,
  },
  {
    id: 'freeflow-chrome',
    name: 'Architectural Slotted Free-Flow Grate',
    code: 'DRN-FF-CHROME',
    finish: 'Satin Brushed Stainless Steel',
    description: 'Always-open non-closing drain designed for commercial public washrooms & washplanes.',
    priceInr: 2200,
    priceModifier: 2200,
  },
  {
    id: 'freeflow-corian',
    name: 'Corian® Hidden Continuous Flow Slit',
    code: 'DRN-FF-CORIAN',
    finish: 'Seamless Corian® Cover Insert',
    description: 'Concealed channel drainage insert creating the illusion of water vanishing into a fine line.',
    priceInr: 4500,
    priceModifier: 4500,
    isMatchedColor: true,
  },
  {
    id: 'rubber-plug',
    name: 'Classic Bead-Chain & Rubber Stopper',
    code: 'DRN-PLUG-CH',
    finish: 'Chrome Flange & Heavy-Duty Plug',
    description: 'Time-tested manual rubber plug with stainless steel beaded tether chain.',
    priceInr: 950,
    priceModifier: 950,
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
      cornerLeft: { type: 'sharp', radiusMm: 0, chamferMm: 0, shiftMm: 0 },
      cornerRight: { type: 'sharp', radiusMm: 0, chamferMm: 0, shiftMm: 0 },
      tapLocation: 'top-mounted',
      tapHoles: 1,
      tapHoleDiameterMm: 35,
      sinkIntegration: 'integrated',
      basinModelId: 'coved-oval',
      basinPlacement: 'center',
      basinOffsetMm: 0,
      downstands: { front: true, left: true, right: true, heightMm: 120 },
      frontApronHeight: 120,
      hasLeftApron: true,
      hasRightApron: true,
      upstands: {
        type: 'standard',
        heightMm: 80,
        isCoved: true,
        backMode: 'full',
        backLengthMm: 1200,
        leftMode: 'none',
        leftLengthMm: 0,
        rightMode: 'none',
        rightLengthMm: 0,
      },
      rearUpstandHeight: 80,
      hasLeftUpstand: false,
      hasRightUpstand: false,
      isCovedUpstand: true,
      towelHolder: { enabled: false, lengthMm: 350, position: 'right', filletMm: 12 },
      topEdge: { type: 'fillet', radiusMm: 6, chamferMm: 2 },
      edgeProfileId: 'rounded',
      drainTypeId: 'click-clack-corian',
      materialSlug: 'corian-glacier-white',
      materialName: 'Corian® Glacier White',
      materialHex: '#f3f2ee',
      materialFinish: 'Honed Satin Matte',
      projectName: 'Bespoke En-Suite',
      clientStudio: 'Private Residence',
      locationCity: 'Bengaluru',
      specialInstructions: '',
      quantity: 1,
    },
  },
  {
    id: 'double-basin-vanity',
    name: 'Dual Basin Master Console',
    category: 'vanities',
    tagline: 'Wide format twin-basin console for master bathrooms and suites',
    description: 'Generous 2000mm width accommodating twin integrated washbasins with centered grooming spacing. Mitred 150mm fascia drop with optional integrated towel-holder cut-out.',
    defaultConfig: {
      presetId: 'double-basin-vanity',
      title: 'Dual Basin Master Console',
      width: 2000,
      depth: 550,
      thickness: 12,
      cornerLeft: { type: 'fillet', radiusMm: 20, chamferMm: 0, shiftMm: 0 },
      cornerRight: { type: 'fillet', radiusMm: 20, chamferMm: 0, shiftMm: 0 },
      tapLocation: 'top-mounted',
      tapHoles: 1,
      tapHoleDiameterMm: 35,
      sinkIntegration: 'integrated',
      basinModelId: 'crisp-rect',
      basinPlacement: 'dual',
      basinOffsetMm: 0,
      downstands: { front: true, left: true, right: true, heightMm: 150 },
      frontApronHeight: 150,
      hasLeftApron: true,
      hasRightApron: true,
      upstands: {
        type: 'standard',
        heightMm: 100,
        isCoved: true,
        backMode: 'full',
        backLengthMm: 2000,
        leftMode: 'full',
        leftLengthMm: 550,
        rightMode: 'full',
        rightLengthMm: 550,
      },
      rearUpstandHeight: 100,
      hasLeftUpstand: true,
      hasRightUpstand: true,
      isCovedUpstand: true,
      towelHolder: { enabled: true, lengthMm: 450, position: 'center', filletMm: 12 },
      topEdge: { type: 'fillet', radiusMm: 3, chamferMm: 2 },
      edgeProfileId: 'rounded',
      drainTypeId: 'click-clack-corian',
      materialSlug: 'corian-calacatta-greige',
      materialName: 'Corian® Calacatta Greige',
      materialHex: '#ebe6dd',
      materialFinish: 'Semi-Gloss Architectural',
      projectName: 'Master Suite Project',
      clientStudio: 'Studio Collaboration',
      locationCity: 'Mumbai',
      specialInstructions: '',
      quantity: 1,
    },
  },
  {
    id: 'washplane-linear',
    name: 'Continuous Linear Washplane',
    category: 'washplanes',
    tagline: 'Slope-to-drain commercial washplane for airports and hotels',
    description: 'Precision-sloped continuous trough designed for touchless sensor faucets and soap dispensers. High-traffic vandal-resistant design with hidden perimeter drainage slot.',
    defaultConfig: {
      presetId: 'washplane-linear',
      title: 'Continuous Linear Washplane',
      width: 1800,
      depth: 500,
      thickness: 19,
      cornerLeft: { type: 'sharp', radiusMm: 0, chamferMm: 0, shiftMm: 0 },
      cornerRight: { type: 'sharp', radiusMm: 0, chamferMm: 0, shiftMm: 0 },
      tapLocation: 'wall-mounted',
      tapHoles: 0,
      tapHoleDiameterMm: 35,
      sinkIntegration: 'integrated',
      basinModelId: 'linear-trough',
      basinPlacement: 'center',
      basinOffsetMm: 0,
      downstands: { front: true, left: true, right: true, heightMm: 200 },
      frontApronHeight: 200,
      hasLeftApron: true,
      hasRightApron: true,
      upstands: {
        type: 'full',
        heightMm: 250,
        isCoved: true,
        backMode: 'full',
        backLengthMm: 1800,
        leftMode: 'none',
        leftLengthMm: 0,
        rightMode: 'none',
        rightLengthMm: 0,
      },
      rearUpstandHeight: 250,
      hasLeftUpstand: false,
      hasRightUpstand: false,
      isCovedUpstand: true,
      towelHolder: { enabled: false, lengthMm: 350, position: 'left', filletMm: 12 },
      topEdge: { type: 'sharp', radiusMm: 1, chamferMm: 2 },
      edgeProfileId: 'sharp',
      drainTypeId: 'freeflow-corian',
      materialSlug: 'corian-designer-white',
      materialName: 'Corian® Designer White',
      materialHex: '#ffffff',
      materialFinish: 'Honed Matte',
      projectName: 'Corporate Headquarters',
      clientStudio: 'Commercial Specifier',
      locationCity: 'Hyderabad',
      specialInstructions: 'Concealed channel drain with rear access panel.',
      quantity: 1,
    },
  },
  {
    id: 'worktop-island',
    name: 'Monolithic Kitchen Island Countertop',
    category: 'benchtops',
    tagline: 'Massive seamless solid surface benchtop with 60mm waterfall edge',
    description: 'Seamless monolithic island worktop for high-end culinary architecture. Non-porous, food-contact certified, stain-resistant Corian® surface with 60mm mitred drop edge.',
    defaultConfig: {
      presetId: 'worktop-island',
      title: 'Monolithic Kitchen Island Countertop',
      width: 2800,
      depth: 1000,
      thickness: 60,
      cornerLeft: { type: 'chamfer', radiusMm: 0, chamferMm: 20, shiftMm: 0 },
      cornerRight: { type: 'chamfer', radiusMm: 0, chamferMm: 20, shiftMm: 0 },
      tapLocation: 'top-mounted',
      tapHoles: 1,
      tapHoleDiameterMm: 35,
      sinkIntegration: 'undermount',
      basinModelId: 'crisp-rect',
      basinPlacement: 'left',
      basinOffsetMm: 200,
      downstands: { front: true, left: true, right: true, heightMm: 60 },
      frontApronHeight: 60,
      hasLeftApron: true,
      hasRightApron: true,
      upstands: {
        type: 'none',
        heightMm: 0,
        isCoved: false,
        backMode: 'none',
        backLengthMm: 0,
        leftMode: 'none',
        leftLengthMm: 0,
        rightMode: 'none',
        rightLengthMm: 0,
      },
      rearUpstandHeight: 0,
      hasLeftUpstand: false,
      hasRightUpstand: false,
      isCovedUpstand: false,
      towelHolder: { enabled: false, lengthMm: 350, position: 'right', filletMm: 12 },
      topEdge: { type: 'chamfer', radiusMm: 3, chamferMm: 5 },
      edgeProfileId: 'chamfer',
      drainTypeId: 'click-clack-chrome',
      materialSlug: 'corian-neutral-concrete',
      materialName: 'Corian® Neutral Concrete',
      materialHex: '#9c9b96',
      materialFinish: 'Textured Satin',
      projectName: 'Penthouse Kitchen',
      clientStudio: 'Interior Architecture Desk',
      locationCity: 'New Delhi',
      specialInstructions: '',
      quantity: 1,
    },
  },
  {
    id: 'healthcare-station',
    name: 'Hospital Surgical Scrub Station',
    category: 'commercial',
    tagline: 'Infection-controlled seamless washstation for surgical scrub bays',
    description: 'Certified zero-silica solid surface formulation meeting NABH and international clinical hygiene standards. Full continuous coved upstand preventing microbial ingress.',
    defaultConfig: {
      presetId: 'healthcare-station',
      title: 'Hospital Surgical Scrub Station',
      width: 1600,
      depth: 600,
      thickness: 19,
      cornerLeft: { type: 'fillet', radiusMm: 50, chamferMm: 0, shiftMm: 0 },
      cornerRight: { type: 'fillet', radiusMm: 50, chamferMm: 0, shiftMm: 0 },
      tapLocation: 'wall-mounted',
      tapHoles: 0,
      tapHoleDiameterMm: 35,
      sinkIntegration: 'integrated',
      basinModelId: 'crisp-rect',
      basinPlacement: 'center',
      basinOffsetMm: 0,
      downstands: { front: true, left: true, right: true, heightMm: 250 },
      frontApronHeight: 250,
      hasLeftApron: true,
      hasRightApron: true,
      upstands: {
        type: 'full',
        heightMm: 300,
        isCoved: true,
        backMode: 'full',
        backLengthMm: 1600,
        leftMode: 'full',
        leftLengthMm: 600,
        rightMode: 'full',
        rightLengthMm: 600,
      },
      rearUpstandHeight: 300,
      hasLeftUpstand: true,
      hasRightUpstand: true,
      isCovedUpstand: true,
      towelHolder: { enabled: false, lengthMm: 350, position: 'left', filletMm: 12 },
      topEdge: { type: 'fillet', radiusMm: 12, chamferMm: 2 },
      edgeProfileId: 'rounded',
      drainTypeId: 'freeflow-chrome',
      materialSlug: 'corian-glacier-white',
      materialName: 'Corian® Glacier White',
      materialHex: '#f3f2ee',
      materialFinish: 'Clinical Ultra-Smooth',
      projectName: 'Apollo Super Speciality',
      clientStudio: 'Healthcare Facility Specifier',
      locationCity: 'Chennai',
      specialInstructions: 'Antimicrobial coved joints throughout.',
      quantity: 1,
    },
  },
];

export interface SwatchMaterial {
  id?: string;
  category?: string;
  slug: string;
  name: string;
  code: string;
  collection: string;
  colorFamily: 'white' | 'grey' | 'warm' | 'dark' | 'translucent';
  hexColor: string;
  finish: string;
  priceTier: 1 | 2 | 3 | 4;
  inStock: boolean;
}

export type ConfiguratorMaterialSwatch = SwatchMaterial;

export const CONFIGURATOR_MATERIALS: SwatchMaterial[] = [
  {
    id: 'corian-glacier-white',
    category: 'white',
    slug: 'corian-glacier-white',
    name: 'Glacier White',
    code: 'GW-01',
    collection: 'Solid Series',
    colorFamily: 'white',
    hexColor: '#f3f2ee',
    finish: 'Honed Matte / Semi-Gloss',
    priceTier: 1,
    inStock: true,
  },
  {
    id: 'corian-designer-white',
    category: 'white',
    slug: 'corian-designer-white',
    name: 'Designer White',
    code: 'DW-02',
    collection: 'Solid Series',
    colorFamily: 'white',
    hexColor: '#ffffff',
    finish: 'Crisp Architectural Matte',
    priceTier: 1,
    inStock: true,
  },
  {
    id: 'corian-cameo-white',
    category: 'cream',
    slug: 'corian-cameo-white',
    name: 'Cameo White',
    code: 'CW-03',
    collection: 'Solid Series',
    colorFamily: 'warm',
    hexColor: '#eeebe1',
    finish: 'Warm Ivory Satin',
    priceTier: 1,
    inStock: true,
  },
  {
    id: 'corian-bone',
    category: 'cream',
    slug: 'corian-bone',
    name: 'Bone',
    code: 'BN-04',
    collection: 'Solid Series',
    colorFamily: 'warm',
    hexColor: '#dfdacb',
    finish: 'Natural Neutral Matte',
    priceTier: 1,
    inStock: true,
  },
  {
    id: 'corian-neutral-concrete',
    category: 'grey',
    slug: 'corian-neutral-concrete',
    name: 'Neutral Concrete',
    code: 'NC-05',
    collection: 'Concrete Series',
    colorFamily: 'grey',
    hexColor: '#9c9b96',
    finish: 'Micro-Textured Architectural',
    priceTier: 2,
    inStock: true,
  },
  {
    id: 'corian-dove-grey',
    category: 'grey',
    slug: 'corian-dove-grey',
    name: 'Dove Grey',
    code: 'DG-06',
    collection: 'Solid Series',
    colorFamily: 'grey',
    hexColor: '#b8b7b2',
    finish: 'Smooth Satin Matte',
    priceTier: 2,
    inStock: true,
  },
  {
    id: 'corian-sanded-icicle',
    category: 'white',
    slug: 'corian-sanded-icicle',
    name: 'Sanded Icicle',
    code: 'SI-07',
    collection: 'Mineral Grain Series',
    colorFamily: 'white',
    hexColor: '#e8e8e3',
    finish: 'Fine Crystalline Grain',
    priceTier: 2,
    inStock: true,
  },
  {
    id: 'corian-calacatta-greige',
    category: 'cream',
    slug: 'corian-calacatta-greige',
    name: 'Calacatta Greige',
    code: 'CG-08',
    collection: 'Heritage Veined Series',
    colorFamily: 'warm',
    hexColor: '#ebe6dd',
    finish: 'Calacatta Vein Polish',
    priceTier: 3,
    inStock: true,
  },
  {
    id: 'corian-deep-nocturne',
    category: 'black',
    slug: 'corian-deep-nocturne',
    name: 'Deep Nocturne (Jet Black)',
    code: 'DN-09',
    collection: 'DeepColor™ Technology',
    colorFamily: 'dark',
    hexColor: '#1d1e1f',
    finish: 'Velvet Black Low-Sheen',
    priceTier: 3,
    inStock: true,
  },
  {
    id: 'corian-carbon-concrete',
    category: 'black',
    slug: 'corian-carbon-concrete',
    name: 'Carbon Concrete',
    code: 'CC-10',
    collection: 'Concrete Series',
    colorFamily: 'dark',
    hexColor: '#4f5052',
    finish: 'Tactile Industrial Matte',
    priceTier: 3,
    inStock: true,
  },
  {
    id: 'corian-terrazzo-laguna',
    category: 'grey',
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
    id: 'corian-golden-onyx',
    category: 'translucent',
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

export interface PriceBreakdown {
  baseSubstrate: number;
  thicknessSurcharge: number;
  apronDownstand: number;
  upstandSplashback: number;
  edgeTooling: number;
  basinIntegration: number;
  tapCutouts: number;
  towelCutout: number;
  drainAccessory: number;
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

  // Front + Side Downstands (Mitred 45° drop fascia)
  const frontH = cfg.downstands?.heightMm ?? cfg.frontApronHeight ?? 0;
  const hasFront = cfg.downstands?.front ?? (frontH > 0);
  const hasLeft = cfg.downstands?.left ?? cfg.hasLeftApron;
  const hasRight = cfg.downstands?.right ?? cfg.hasRightApron;

  let totalApronM = hasFront ? widthM : 0;
  if (hasLeft) totalApronM += depthM;
  if (hasRight) totalApronM += depthM;
  const apronHeightFactor = Math.max(0.6, frontH / 100);
  const apronDownstand = Math.round(totalApronM * 2800 * apronHeightFactor);

  // Upstands / Splashbacks (Coved chemical fusion)
  const isBackDisabled = cfg.upstands?.backMode === 'none';
  const isStdUpstand = !isBackDisabled && cfg.upstands?.backMode === 'standard';
  const upstandH = isBackDisabled ? 0 : isStdUpstand ? 80 : (cfg.upstands?.heightMm ?? cfg.upstands?.height ?? cfg.rearUpstandHeight ?? 150);
  const isCoved = Boolean(cfg.upstands?.isCoved ?? cfg.upstands?.coved ?? cfg.isCovedUpstand);
  let totalUpstandM = (upstandH > 0 && !isBackDisabled) ? widthM : 0;
  if (cfg.upstands?.leftMode === 'full' || (cfg.upstands?.leftLengthMm ?? 0) > 0 || Boolean(cfg.hasLeftUpstand)) totalUpstandM += depthM;
  if (cfg.upstands?.rightMode === 'full' || (cfg.upstands?.rightLengthMm ?? 0) > 0 || Boolean(cfg.hasRightUpstand)) totalUpstandM += depthM;

  const covedPremium = isCoved ? 1.4 : 1.0;
  const upstandHeightFactor = Math.max(0.5, upstandH / 100);
  const upstandSplashback = Math.round(totalUpstandM * 2200 * covedPremium * upstandHeightFactor);

  // Edge & Corner Tooling
  const edgeRate = cfg.topEdge?.type === 'chamfer' ? 1100 : cfg.topEdge?.type === 'fillet' ? 900 : 650;
  const exposedPerimeterM = widthM + depthM * 2;
  let edgeTooling = Math.round(exposedPerimeterM * edgeRate);

  // Custom Corner Shift or Fillet Surcharge
  if (cfg.cornerLeft?.type === 'shift' || cfg.cornerRight?.type === 'shift') edgeTooling += 1500;
  if (cfg.cornerLeft?.type === 'fillet' && cfg.cornerLeft.radiusMm > 30) edgeTooling += 800;
  if (cfg.cornerRight?.type === 'fillet' && cfg.cornerRight.radiusMm > 30) edgeTooling += 800;

  // Basin Selection & Integration
  let basinIntegration = 0;
  if (cfg.basinModelId !== 'none' && cfg.sinkIntegration !== 'none') {
    const basin = AVAILABLE_BASINS.find(b => b.id === cfg.basinModelId);
    const basinCost = basin ? basin.priceModifier : 14500;
    const integrationOption = SINK_INTEGRATIONS.find(s => s.id === cfg.sinkIntegration);
    const integrationModifier = integrationOption ? integrationOption.priceModifier : 0;
    const basinQty = cfg.basinPlacement === 'dual' ? 2 : 1;
    basinIntegration = (basinCost + integrationModifier) * basinQty;
  }

  // Tap Hole CNC Machining
  const tapCutouts = (cfg.tapLocation === 'top-mounted' ? cfg.tapHoles : 0) * 750;

  // Towel Holder Slot Cutout Machining
  const towelCutout = cfg.towelHolder?.enabled ? 2400 : 0;

  // Drain Accessory
  const drain = DRAIN_OPTIONS.find(d => d.id === cfg.drainTypeId);
  const drainAccessory = drain ? drain.priceInr : 1850;

  const totalIndicative = (
    baseSubstrate +
    thicknessSurcharge +
    apronDownstand +
    upstandSplashback +
    edgeTooling +
    basinIntegration +
    tapCutouts +
    towelCutout +
    drainAccessory
  ) * (cfg.quantity || 1);

  return {
    baseSubstrate,
    thicknessSurcharge,
    apronDownstand,
    upstandSplashback,
    edgeTooling,
    basinIntegration,
    tapCutouts,
    towelCutout,
    drainAccessory,
    totalIndicative,
  };
}
