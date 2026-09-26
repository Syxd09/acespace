export interface Project {
  slug: string;
  title: string;
  subtitle: string;
  category: 'residential' | 'hospitality' | 'commercial' | 'retail' | 'healthcare';
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
    materialUsed: 'Calacatta Greige',
    materialSlug: 'calacatta-greige',
    application: 'Monolithic Kitchen Island, Integrated Sink, Full-height Backsplash',
    fabrication: 'Seamless Inconspicuous Joining, 45° Mitred Waterfall Edges, Thermoformed Basin Transition',
    image: '/images/images/app_residential_calacatta_greige_1.jpg',
    challenge: 'Achieving an uninterrupted 4.2m island surface with zero visible seams while incorporating an integrated undercut sink basin with continuous linear grain alignment.',
    solution: 'Engineered a specialized workshop pre-assembly with laser templating and color-matched adhesive curing on site, achieving an entirely monolithic appearance with sub-millimeter precision.',
    specs: [
      { label: 'Surface Material', value: 'Calacatta Greige (12mm)' },
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
    materialUsed: 'Stonecrest Smoke',
    materialSlug: 'stonecrest-smoke',
    application: 'Curved Reception Counter, Feature Wall Cladding, Washroom Vanities',
    fabrication: 'Multi-radius Thermoforming, Sub-surface LED Backlighting, Concealed Steel Substructure',
    image: '/images/images/app_residential_stonecrest_smoke_1.jpg',
    challenge: 'Forming a continuous 180° curved desk facade without surface blanching or micro-stress marks in a high-traffic lobby environment.',
    solution: 'Utilized CNC-machined timber buck tooling with temperature-controlled heating blankets to thermoform Stonecrest Smoke at 160°C, producing perfectly fluid geometry.',
    specs: [
      { label: 'Surface Material', value: 'Stonecrest Smoke (12mm)' },
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
    materialUsed: 'Bleached Nuwood',
    materialSlug: 'bleached-nuwood',
    application: 'Design Review Tables, Sample Library Islands, Kitchenette Counters',
    fabrication: '5-Axis CNC Milling, Concealed Cable Chutes, Flush Wireless Charging Embeds',
    image: '/images/images/app_commercial_bleached_nuwood.jpg',
    challenge: 'Embedding sub-surface inductive power charging points without disrupting the smooth, refined aesthetic of the conference table.',
    solution: 'Precision CNC undercut the 12mm mineral sheet from behind to a 3mm membrane thickness, allowing wireless magnetic charging fields to pass cleanly through the solid surface.',
    specs: [
      { label: 'Surface Material', value: 'Bleached Nuwood (12mm)' },
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
    materialUsed: 'Golden Onyx',
    materialSlug: 'golden-onyx',
    application: 'Illuminated Display Pedestals, Cashwrap Counter, Translucent Screen Wall',
    fabrication: '6mm Sheet Thermo-bonding, Internal Dimmable 2700K LED Diffusers, Mitred Plinths',
    image: '/images/images/coriansolidsurface-goldenonyx-application.jpg',
    challenge: 'Eliminating visible internal LED hot-spots and internal framing shadows across the translucent display faces.',
    solution: 'Engineered an internal dual-layer optical diffuser cavity behind Golden Onyx, delivering perfectly uniform, velvety warm illumination.',
    specs: [
      { label: 'Surface Material', value: 'Golden Onyx (Translucent)' },
      { label: 'Color Temperature', value: '2700K Warm Ambient' },
      { label: 'Plinth Count', value: '8 Modular Freestanding Units' },
      { label: 'Light Diffusion', value: 'Uniform 98% Field Distribution' }
    ]
  },
  {
    slug: 'clinical-precision',
    title: 'Clinical precision & surgical hygiene',
    subtitle: 'Specialist medical & surgical center',
    category: 'healthcare',
    location: 'Hyderabad, India',
    year: '2024',
    architect: 'Arch-Med Spatial Design',
    area: '540 sq.m',
    description: 'Wall-to-wall seamless surgical scrub stations, operatory countertops, and patient consultation desks fabricated with pure non-porous solid surfaces with zero grout lines or bacterial traps.',
    materialUsed: 'Stonique',
    materialSlug: 'stonique',
    application: 'Surgical Scrub Sinks, Operatory Workbenches, Clinical Reception Desk',
    fabrication: 'Thermoformed Integral 10mm Coves, Silicone-Free Acrylic Joint Welds, Marine Containment Edges',
    image: '/images/images/app_commercial_grinds_stonique.jpg',
    challenge: 'Eliminating mold-prone silicone sealant joints at the wall-to-counter and counter-to-sink junctions while meeting strict ISO 846 Class 0 cleanroom hygiene standards.',
    solution: 'Designed and fabricated custom thermoformed 10mm integral coves that transition seamlessly from counter into backsplash and sink, creating a single continuous hermetic plane.',
    specs: [
      { label: 'Surface Material', value: 'Stonique (12mm Clinical Matte)' },
      { label: 'Hygiene Standard', value: 'ISO 846 Method A & C Rating 0' },
      { label: 'Chemical Immunity', value: 'Bleach, 70% IPA, Chlorhexidine Resistant' },
      { label: 'Joint Tolerance', value: '< 0.05mm Silicone-Free Thermo-Weld' }
    ]
  }
];
