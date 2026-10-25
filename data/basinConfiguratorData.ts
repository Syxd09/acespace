import { AVAILABLE_BASINS, BasinModel, CONFIGURATOR_MATERIALS, SwatchMaterial, DRAIN_OPTIONS, DrainOption } from './configuratorData';

// Filter only Square, Oval, Circle, and Capsule models (strictly no uc, ub, wdt, or none)
export const STANDALONE_BASIN_MODELS: BasinModel[] = AVAILABLE_BASINS.filter(b => {
  if (b.id === 'none' || b.id === 'ub' || b.id === 'uc' || b.id === 'wdt') return false;
  return b.category === 'oval' || b.category === 'circular' || b.category === 'square';
});

export interface BasinConfiguration {
  id?: string;
  modelId: string;
  modelName: string;
  modelCode: string;
  shape: 'oval' | 'round' | 'rectangular' | 'capsule';
  width: number;  // mm
  depth: number;  // mm
  height: number; // mm
  covedRadius: number; // mm

  // Material & Colour
  materialSlug: string;
  materialName: string;
  materialHex: string;
  materialFinish: string;

  // Drain System
  drainTypeId: string;
  drainName: string;

  // Project Specifications
  projectName: string;
  clientStudio: string;
  locationCity: string;
  specialInstructions: string;

  // Commercial
  quantity: number;
}

export interface BasinPriceBreakdown {
  baseModelPrice: number;
  materialTierPremium: number;
  drainAccessoryPrice: number;
  unitPrice: number;
  totalIndicative: number;
}

export const DEFAULT_BASIN_CONFIG: BasinConfiguration = {
  modelId: 'oval-5',
  modelName: 'Oval 5',
  modelCode: 'oval 5',
  shape: 'oval',
  width: 560,
  depth: 395,
  height: 160,
  covedRadius: 12,
  materialSlug: 'corian-glacier-white',
  materialName: 'Corian® Glacier White',
  materialHex: '#f6f3ef',
  materialFinish: 'Honed Satin Matte',
  drainTypeId: 'click-clack-chrome',
  drainName: 'Click-Clack Pop-Up (Polished Chrome)',
  projectName: 'Master Suite Project',
  clientStudio: 'Architectural Specifier',
  locationCity: 'Bengaluru',
  specialInstructions: '',
  quantity: 1,
};

export function calculateBasinIndicativePrice(cfg: BasinConfiguration): BasinPriceBreakdown {
  const model = STANDALONE_BASIN_MODELS.find(m => m.id === cfg.modelId) || STANDALONE_BASIN_MODELS[0];
  const baseModelPrice = model ? model.priceModifier : 14500;

  // Material Tier Surcharge (INR)
  const swatch = CONFIGURATOR_MATERIALS.find(m => m.slug === cfg.materialSlug);
  const tier = swatch ? swatch.priceTier : 1;
  const tierSurchargeMap: Record<number, number> = {
    1: 0,      // Solid Whites & Basics
    2: 2400,   // Mineral Grain Fleck
    3: 4200,   // Veined / DeepColor / Terrazzo
    4: 6500,   // Translucent Onyx / Prima
  };
  const materialTierPremium = tierSurchargeMap[tier] || 0;

  // Drain Accessory
  const drain = DRAIN_OPTIONS.find(d => d.id === cfg.drainTypeId) || DRAIN_OPTIONS[0];
  const drainAccessoryPrice = drain ? drain.priceInr : 1850;

  const unitPrice = baseModelPrice + materialTierPremium + drainAccessoryPrice;
  const totalIndicative = unitPrice * (cfg.quantity || 1);

  return {
    baseModelPrice,
    materialTierPremium,
    drainAccessoryPrice,
    unitPrice,
    totalIndicative,
  };
}

export { CONFIGURATOR_MATERIALS, DRAIN_OPTIONS };
export type { SwatchMaterial, DrainOption, BasinModel };
