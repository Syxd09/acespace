export interface Project {
  slug: string;
  title: string;
  subtitle: string;
  category: 'residential' | 'hospitality' | 'commercial' | 'retail';
  location: string;
  year: string;
  architect: string;
  area: string;
  description: string;
  materialUsed: string;
  materialSlug: string;
  application: string;
  fabrication: string;
  image: string;
  challenge: string;
  solution: string;
  specs: { label: string; value: string }[];
}

export const projects: Project[] = [
  {
    slug: 'private-residence',
    title: 'A quieter kind of luxury',
    subtitle: 'Private residence',
    category: 'residential',
    location: 'Bengaluru, India',
    year: '2024',
    architect: 'Studio Vardhan Architects',
    area: '420 sq.m',
    description: 'A continuous mineral surface moves from a 4.2-meter kitchen island into vertical backsplash planes, creating a seamless sculptural gesture that grounds the open living pavilion.',
    materialUsed: 'Alto / Ivory Vein',
    materialSlug: 'alto-ivory-vein',
    application: 'Monolithic Kitchen Island, Integrated Sink, Full-height Backsplash',
    fabrication: 'Seamless Inconspicuous Joining, 45° Mitred Waterfall Edges, Thermoformed Basin Transition',
    image: '/assets/hero-ace.png',
    challenge: 'Achieving an uninterrupted 4.2m island surface with zero visible seams while incorporating an integrated undercut sink basin with continuous linear grain alignment.',
    solution: 'Engineered a specialized workshop pre-assembly with laser templating and color-matched adhesive curing on site, achieving an entirely monolithic appearance with sub-millimeter precision.',
    specs: [
      { label: 'Surface Material', value: 'Alto / Ivory Vein (12mm)' },
      { label: 'Island Length', value: '4200 mm × 1100 mm' },
      { label: 'Edge Profile', value: 'Shark-nose Chamfer with 50mm Apron' },
      { label: 'Joinery Type', value: 'Thermo-welded Color Matched Matrix' }
    ]
  },
  {
    slug: 'quiet-arrival',
    title: 'Quiet arrival',
    subtitle: 'Hospitality reception',
    category: 'hospitality',
    location: 'Mumbai, India',
    year: '2024',
    architect: 'Atelier Kora',
    area: '650 sq.m',
    description: 'A monolithic reception desk and curved feature screen crafted with low-reflectivity tactile matte surfaces, catching warm indirect light for an ambient arrival experience.',
    materialUsed: 'Obsidian / Still',
    materialSlug: 'obsidian-still',
    application: 'Curved Reception Counter, Feature Wall Cladding, Washroom Vanities',
    fabrication: 'Multi-radius Thermoforming, Sub-surface LED Backlighting, Concealed Steel Substructure',
    image: '/assets/material-macro.png',
    challenge: 'Forming a continuous 180° curved desk facade without surface blanching or micro-stress marks in a high-traffic lobby environment.',
    solution: 'Utilized CNC-machined timber buck tooling with temperature-controlled heating blankets to thermoform Obsidian / Still at 160°C, producing perfectly fluid geometry.',
    specs: [
      { label: 'Surface Material', value: 'Obsidian / Still (19mm)' },
      { label: 'Desk Dimensions', value: '5400 mm Curved Arc' },
      { label: 'Finish Level', value: 'Tactile Honed Matte (600-grit hand finish)' },
      { label: 'Structural Core', value: 'Reinforced CNC Aluminium Ribbing' }
    ]
  },
  {
    slug: 'open-practice',
    title: 'Open practice',
    subtitle: 'Architectural studio & workshop',
    category: 'commercial',
    location: 'Bengaluru, India',
    year: '2023',
    architect: 'Ace Collaborative Design',
    area: '380 sq.m',
    description: 'Workplace experience centerpiece featuring modular sample review islands, tactile communal collaboration bars, and integrated concealed wire management.',
    materialUsed: 'Noma / Chalk',
    materialSlug: 'noma-chalk',
    application: 'Design Review Tables, Sample Library Islands, Kitchenette Counters',
    fabrication: '5-Axis CNC Milling, Concealed Cable Chutes, Flush Wireless Charging Embeds',
    image: '/assets/hero-ace.png',
    challenge: 'Embedding sub-surface inductive power charging points without disrupting the smooth, chalk-white matte aesthetic of the conference table.',
    solution: 'Precision CNC undercut the 12mm mineral sheet from behind to a 3mm membrane thickness, allowing wireless magnetic charging fields to pass cleanly through the solid surface.',
    specs: [
      { label: 'Surface Material', value: 'Noma / Chalk (12mm)' },
      { label: 'Table Size', value: '3200 mm × 1400 mm' },
      { label: 'Technology Integration', value: 'Invisible Sub-surface Qi Chargers' },
      { label: 'Edge Profile', value: 'Square Edge with 2mm Micro-radius' }
    ]
  },
  {
    slug: 'material-display',
    title: 'Material display',
    subtitle: 'Bespoke retail installation',
    category: 'retail',
    location: 'New Delhi, India',
    year: '2023',
    architect: 'Studio Mono',
    area: '210 sq.m',
    description: 'Multi-layered illuminated material displays exploring backlighting and translucent mineral fields to highlight precision jewelry and horology craft.',
    materialUsed: 'Lumen / Shell',
    materialSlug: 'lumen-shell',
    application: 'Illuminated Display Pedestals, Cashwrap Counter, Translucent Screen Wall',
    fabrication: '6mm Sheet Thermo-bonding, Internal Dimmable 2700K LED Diffusers, Mitred Plinths',
    image: '/assets/material-macro.png',
    challenge: 'Eliminating visible internal LED hot-spots and internal framing shadows across the translucent display faces.',
    solution: 'Engineered an internal dual-layer optical diffuser cavity behind Lumen / Shell, delivering perfectly uniform, velvety warm illumination.',
    specs: [
      { label: 'Surface Material', value: 'Lumen / Shell (6mm Translucent)' },
      { label: 'Color Temperature', value: '2700K Warm Ambient' },
      { label: 'Plinth Count', value: '8 Modular Freestanding Units' },
      { label: 'Light Diffusion', value: 'Uniform 98% Field Distribution' }
    ]
  }
];
