export interface Material {
  slug: string;
  name: string;
  collection: string;
  type: 'mineral' | 'veined' | 'textured' | 'translucent';
  finish: string;
  colour: string;
  description: string;
  swatch: string;
  image: string;
  applications: string[];
  thicknessOptions: string[];
  dimensions: string;
  lightTransmission: string;
  fireRating: string;
  careGuide: string;
}

export const materials: Material[] = [
  {
    slug: 'noma-chalk',
    name: 'Noma / Chalk',
    collection: 'Noma collection',
    type: 'mineral',
    finish: 'Honed Matte',
    colour: 'Warm Chalk White',
    description: 'A quiet mineral surface with a soft, chalky depth. Designed to carry light across larger planes without specular glare.',
    swatch: 'one',
    image: '/assets/material-macro.png',
    applications: ['Monolithic Kitchen Islands', 'Bathroom Vanities', 'Wall Linings', 'Integrated Sinks'],
    thicknessOptions: ['6mm (Cladding)', '12mm (Standard)', '19mm (Heavy Duty)'],
    dimensions: '3660 mm × 760 mm',
    lightTransmission: 'Non-translucent / Opaque',
    fireRating: 'Class 1 / Class A Fire Rated',
    careGuide: 'Daily soap-water wipe down. Non-porous surface resists wine, coffee and oil without sealing.'
  },
  {
    slug: 'alto-ivory-vein',
    name: 'Alto / Ivory Vein',
    collection: 'Alto collection',
    type: 'veined',
    finish: 'Satin Smooth',
    colour: 'Soft Ivory & Sand',
    description: 'Subtle linear directional movement through an ivory field, providing organic architectural presence.',
    swatch: 'two',
    image: '/assets/hero-ace.png',
    applications: ['Kitchen Islands', 'Waterfall Countertops', 'Custom Vanities', 'Feature Walls'],
    thicknessOptions: ['12mm (Standard)', '19mm (Countertop)'],
    dimensions: '3660 mm × 760 mm',
    lightTransmission: 'Low Translucency (6%)',
    fireRating: 'Class 1 Fire Rated',
    careGuide: 'Resistant to thermal shocks and daily staining agents. Micro-scratches buff out seamlessly.'
  },
  {
    slug: 'obsidian-still',
    name: 'Obsidian / Still',
    collection: 'Obsidian collection',
    type: 'textured',
    finish: 'Tactile Matte',
    colour: 'Deep Graphite',
    description: 'Deep, mineral and tactile. A grounding, shadow-rich surface for hospitality bars and custom furniture.',
    swatch: 'three',
    image: '/assets/material-macro.png',
    applications: ['Hospitality Bar Tops', 'Reception Desks', 'Credenzas', 'Executive Workspaces'],
    thicknessOptions: ['12mm (Standard)', '19mm (Heavy Duty)'],
    dimensions: '3660 mm × 760 mm',
    lightTransmission: 'Non-translucent',
    fireRating: 'Class 1 Fire Rated',
    careGuide: 'Enhanced fingerprint resistance with high-density mineral structure.'
  },
  {
    slug: 'strata-silt',
    name: 'Strata / Silt',
    collection: 'Strata collection',
    type: 'textured',
    finish: 'Micro-Textured Honed',
    colour: 'Warm Earth & Ochre',
    description: 'A layered, earth-toned texture inspired by alluvial sediment and slow geological formation.',
    swatch: 'four',
    image: '/assets/hero-ace.png',
    applications: ['Exterior Feature Claddings', 'Lobby Wall Features', 'Integrated Basins', 'Bespoke Plinths'],
    thicknessOptions: ['6mm (Cladding)', '12mm (Standard)'],
    dimensions: '3660 mm × 760 mm',
    lightTransmission: 'Non-translucent',
    fireRating: 'Class 1 Fire Rated',
    careGuide: 'UV stable mineral formulation suitable for covered exterior and sun-drenched interior spaces.'
  },
  {
    slug: 'lumen-shell',
    name: 'Lumen / Shell',
    collection: 'Lumen collection',
    type: 'translucent',
    finish: 'Satin Diffuse',
    colour: 'Warm Shell Amber',
    description: 'A luminous surface with high light dispersion for softly backlit architectural installations and warm ambient fixtures.',
    swatch: 'five',
    image: '/assets/material-macro.png',
    applications: ['Backlit Bar Fronts', 'Luminous Columns', 'Ambient Light Screens', 'Retail Display Plinths'],
    thicknessOptions: ['6mm (Backlit)', '12mm (Standard)'],
    dimensions: '3660 mm × 760 mm',
    lightTransmission: 'High Translucency (38% at 6mm)',
    fireRating: 'Class 1 Fire Rated',
    careGuide: 'Clean with microfibre cloth and neutral detergent. Seamless joins maintain unbroken light diffusion.'
  },
  {
    slug: 'obsidian-coal',
    name: 'Obsidian / Coal',
    collection: 'Obsidian collection',
    type: 'mineral',
    finish: 'Deep Honed',
    colour: 'Midnight Black',
    description: 'A monolithic, near-black mineral surface with an intense, light-absorbing presence and velvet touch.',
    swatch: 'six',
    image: '/assets/hero-ace.png',
    applications: ['Commercial Reception Counters', 'Boardroom Tables', 'Architectural Paneling'],
    thicknessOptions: ['12mm (Standard)', '19mm (Heavy Duty)'],
    dimensions: '3660 mm × 760 mm',
    lightTransmission: 'Non-translucent',
    fireRating: 'Class 1 Fire Rated',
    careGuide: 'Non-porous solid composition prevents liquid penetration. Easily refinishable on-site.'
  }
];
