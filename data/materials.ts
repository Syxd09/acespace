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
}

export const materials: Material[] = [
  {
    slug: 'noma-chalk',
    name: 'Noma / Chalk',
    collection: 'Noma collection',
    type: 'mineral',
    finish: 'Honed',
    colour: 'Warm white',
    description: 'A quiet mineral surface with a soft, chalky depth. Designed to carry light across larger planes.',
    swatch: 'one',
    image: '/assets/material-macro.png',
    applications: ['Kitchen', 'Bathroom', 'Wall lining', 'Furniture']
  },
  {
    slug: 'alto-ivory-vein',
    name: 'Alto / Ivory Vein',
    collection: 'Alto collection',
    type: 'veined',
    finish: 'Satin',
    colour: 'Ivory',
    description: 'Subtle linear movement through an ivory field, for surfaces that reward a closer look.',
    swatch: 'two',
    image: '/assets/hero-ace.png',
    applications: ['Kitchen island', 'Backsplash', 'Vanity', 'Feature wall']
  },
  {
    slug: 'obsidian-still',
    name: 'Obsidian / Still',
    collection: 'Obsidian collection',
    type: 'textured',
    finish: 'Matte',
    colour: 'Graphite',
    description: 'Deep, mineral and tactile. A grounding surface for hospitality and custom furniture.',
    swatch: 'three',
    image: '/assets/material-macro.png',
    applications: ['Bar counters', 'Reception desks', 'Feature walls', 'Custom furniture']
  },
  {
    slug: 'strata-silt',
    name: 'Strata / Silt',
    collection: 'Strata collection',
    type: 'textured',
    finish: 'Textured',
    colour: 'Earth',
    description: 'A layered, earth-toned texture inspired by sediment and slow geological time.',
    swatch: 'four',
    image: '/assets/hero-ace.png',
    applications: ['Exterior cladding', 'Feature walls', 'Integrated basins']
  },
  {
    slug: 'lumen-shell',
    name: 'Lumen / Shell',
    collection: 'Lumen collection',
    type: 'translucent',
    finish: 'Satin',
    colour: 'Shell',
    description: 'A luminous surface with a warm translucency for softly backlit architectural moments.',
    swatch: 'five',
    image: '/assets/material-macro.png',
    applications: ['Backlit elements', 'Screen walls', 'Light fixtures', 'Lounge screens']
  },
  {
    slug: 'obsidian-coal',
    name: 'Obsidian / Coal',
    collection: 'Obsidian collection',
    type: 'mineral',
    finish: 'Honed',
    colour: 'Black',
    description: 'A near-black mineral surface with a considered, light-absorbing presence.',
    swatch: 'six',
    image: '/assets/hero-ace.png',
    applications: ['Commercial counters', 'Executive desks', 'Architectural detailing']
  }
];
