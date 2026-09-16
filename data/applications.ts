export interface ApplicationImage {
  src: string;
  alt: string;
  caption: string;
  tag: string;
}

export interface ApplicationSector {
  id: string;
  sectorNumber: string;
  title: string;
  tagline: string;
  heroDescription: string;
  overview: string;
  elements: string[];
  recommendedMaterials: { name: string; slug: string; finish: string }[];
  fabricationNote: string;
  images: ApplicationImage[];
  specifications: {
    title: string;
    description: string;
  }[];
  hygieneAndPerformance: {
    feature: string;
    standard: string;
    benefit: string;
  }[];
  typicalThickness: string;
  jointVisibility: string;
  leadTime: string;
}

export const applicationSectors: ApplicationSector[] = [
  {
    id: 'residential',
    sectorNumber: '01',
    title: 'Residential Architecture',
    tagline: 'Quiet luxury for daily living',
    heroDescription:
      'In private homes, surfaces must balance effortless tactile beauty with complete non-porous resilience against cooking oils, heat, and daily life.',
    overview:
      'From expansive open-plan kitchen pavilions to private master en-suites, Ace Spaces solid surfaces unify vertical wall planes and horizontal countertops into monolithic architectural volumes with zero visible seams.',
    elements: [
      'Monolithic Kitchen Islands with Waterfall Gable Ends',
      'Continuous Full-Height Backsplashes with Zero Grout Lines',
      'Integrated Under-mount Sink Basins with Thermo-Welded Silicone-Free Transitions',
      'Floating Powder Room Vanities with Concealed Steel Brackets',
      'Floor-to-Ceiling Seamless Shower Enclosures & Coved Wall Transitions'
    ],
    recommendedMaterials: [
      { name: 'Alto / Ivory Vein', slug: 'alto-bianco-vein', finish: 'Satin Honed' },
      { name: 'Noma / Chalk', slug: 'noma-white-chalk', finish: 'Ultra-Matte' },
      { name: 'Alto / Fior di Bosco', slug: 'alto-fior-di-bosco', finish: 'Velvet Matte' }
    ],
    fabricationNote:
      'Color-matched acrylic thermo-welded joints ensure zero grout lines, 100% moisture barrier, and zero bacterial harborage.',
    images: [
      {
        src: '/assets/applications/calacatta-greige-kitchen.jpg',
        alt: 'Monolithic Calacatta Greige kitchen island and continuous splashback in residential interior',
        caption: 'Monolithic Kitchen Island & Continuous Splashback in Alto Calacatta Greige',
        tag: 'Monolithic Island'
      },
      {
        src: '/assets/applications/calacatta-greige-kitchen-detail.jpg',
        alt: 'Seamless 45-degree mitred waterfall edge and surface join close-up',
        caption: 'Seamless 45° Mitred Waterfall Gable Join with Zero Silicones',
        tag: 'Waterfall Mitre Detail'
      },
      {
        src: '/assets/applications/stonecrest-smoke-kitchen.jpg',
        alt: 'Architectural Stonecrest Smoke kitchen island with integrated undermount basin',
        caption: 'Tactile Graphite Island with Continuous Integrated Undermount Basin',
        tag: 'Integrated Sink'
      },
      {
        src: '/assets/applications/stonecrest-smoke-kitchen-detail.jpg',
        alt: 'Thermo-welded sink transition and seamless drainage detail',
        caption: 'Thermo-Welded Basin Transition with Coved Internal Corners',
        tag: 'Coved Basin Detail'
      }
    ],
    specifications: [
      {
        title: '45° Mitred Waterfall Gables',
        description: 'CNC-cut 45-degree bevelled edges bonded with two-part color-matched acrylic adhesive, producing an unbroken directional stone movement down to finished flooring.'
      },
      {
        title: 'Thermoformed Integrated Basins',
        description: 'Sink bowls and wash basins are chemically thermo-welded directly to the countertop deck. The joint is hand-honed to a continuous radius with zero grout lines or mildew traps.'
      },
      {
        title: 'Sub-Surface Steel Stiffeners',
        description: 'Large cantilevers up to 450mm require zero vertical post legs through internal routed high-tensile structural steel box sections.'
      }
    ],
    hygieneAndPerformance: [
      { feature: 'Porosity Rating', standard: 'ASTM D570 < 0.03%', benefit: 'Zero absorption of turmeric, red wine, citrus acids, or olive oils.' },
      { feature: 'Food Contact Safe', standard: 'NSF / ANSI Standard 51', benefit: 'Certified safe for direct culinary preparation without sealing or re-polishing.' },
      { feature: 'Joint Integrity', standard: 'Tensile Strength > 42 MPa', benefit: 'Permanent chemical weld stronger than the substrate material itself.' }
    ],
    typicalThickness: '12mm / 20mm Solid Through-Body',
    jointVisibility: '< 0.08mm (Virtually Inconspicuous)',
    leadTime: '2 to 3 weeks from approved shop drawings'
  },
  {
    id: 'hospitality',
    sectorNumber: '02',
    title: 'Hospitality & Dining',
    tagline: 'Sculptural arrival and ambient depth',
    heroDescription:
      'High-traffic hotels, lounge bars, and restaurants demand surfaces that hold up to rigorous commercial cleaning while creating dramatic ambient lighting moments.',
    overview:
      'Hospitality venues require memorable sculptural centerpieces that withstand heavy pedestrian impact, cocktail spills, and high-frequency sanitization without losing their tactile warmth.',
    elements: [
      'Curved Multi-Radius Monolithic Reception Desks',
      'Backlit Translucent Cocktail Bars with Sub-Surface LED Diffusers',
      'Heavy-Duty Spill-Proof Dining & Lounge Table Tops',
      'Thermoformed Curved Lift Lobby Wall Cladding & Archways',
      'Multi-User Public Washroom Trough Sinks with Concealed Sloped Drains'
    ],
    recommendedMaterials: [
      { name: 'Obsidian / Still', slug: 'obsidian-still', finish: 'Tactile Matte' },
      { name: 'Lumen / Shell', slug: 'lumen-shell', finish: 'Translucent Satin' },
      { name: 'Terra / Sage', slug: 'terra-sage', finish: 'Velvet Honed' }
    ],
    fabricationNote:
      'Multi-radius oven thermoforming and internal optical light cavities deliver soft, diffused illumination without hot-spots.',
    images: [
      {
        src: '/assets/applications/stonecrest-smoke-hotel-lobby.jpg',
        alt: 'Monolithic grand hotel reception desk and lobby surface in Stonecrest Smoke',
        caption: 'Monolithic Reception Desk & Lobby Cladding in Stonecrest Smoke',
        tag: 'Reception Monolith'
      },
      {
        src: '/assets/applications/artista-sage-hotel-elevator.jpg',
        alt: 'Continuous curved elevator lobby and architectural corridor cladding in Artista Sage',
        caption: 'Curved Elevator Portal & Corridor Cladding in Artista Sage',
        tag: 'Curved Cladding'
      },
      {
        src: '/assets/applications/artista-mist-bathroom.jpg',
        alt: 'Luxury boutique hotel suite double vanity in Artista Mist',
        caption: 'Bespoke Boutique Suite Double Basin Floating Vanity in Artista Mist',
        tag: 'Suite Vanities'
      }
    ],
    specifications: [
      {
        title: 'Sub-Surface Optical Light Cavities',
        description: 'Lumen series sheets are calibrated to 6mm thickness and backed by dimmable 2700K optical diffusion panels for shadowless monolithic glow.'
      },
      {
        title: 'Heavy Impact Edge Built-ups',
        description: 'Countertops feature 40mm to 80mm drop aprons reinforced with internal phenolic ply ribs to resist luggage strikes and stool impacts.'
      },
      {
        title: 'Thermal Vacuum Bending',
        description: 'Sheets are heated to 160°C in industrial convection ovens and formed over CNC male/female timber bucks for fluid curved architecture.'
      }
    ],
    hygieneAndPerformance: [
      { feature: 'Alcohol & Stain Defense', standard: 'SEFA 8.1 Chemical Rating', benefit: 'Immune to ethanol, acidic mixers, espresso, and cleaning agents.' },
      { feature: 'Fire Rating', standard: 'EN 13501-1 Class B-s1,d0', benefit: 'Low smoke toxicity and non-flammable compliance for public spaces.' },
      { feature: 'Renewability', standard: 'Field Repairable Honing', benefit: 'Scuffs and scratches buff out on-site in minutes without replacing sheets.' }
    ],
    typicalThickness: '12mm sheet with 50mm-100mm mitred fascia',
    jointVisibility: '< 0.05mm',
    leadTime: '3 to 4 weeks for curved thermoformed geometries'
  },
  {
    id: 'commercial',
    sectorNumber: '03',
    title: 'Commercial & Workplaces',
    tagline: 'Precision environments for focused collaboration',
    heroDescription:
      'Modern studio spaces and corporate headquarters require durable, refined work surfaces that seamlessly conceal technology and wiring infrastructure.',
    overview:
      'Workplace architecture has evolved beyond sterile cubicles into crafted mineral environments. Ace Spaces surfaces integrate flush power management, seamless collaboration islands, and non-reflective finishes for glare-free visual comfort.',
    elements: [
      'Executive Boardroom Collaboration Monoliths',
      'Sub-Surface Wireless Charging Desks with Concealed Qi Transmitters',
      'Acoustic Mineral Wall Panelling & Elevator Portals',
      'High-Traffic Team Pantry Bars with Integrated Draining Boards',
      'Auditorium Rostrums and Reception Feature Walls'
    ],
    recommendedMaterials: [
      { name: 'Noma / Chalk', slug: 'noma-white-chalk', finish: 'Ultra-Matte' },
      { name: 'Strata / Sand Fine', slug: 'strata-sand-fine', finish: 'Fine Textured' },
      { name: 'Obsidian / Coal', slug: 'obsidian-coal', finish: 'Honed Matte' }
    ],
    fabricationNote:
      'Sub-surface 5-axis CNC milling allows Qi wireless charging electromagnetic fields to pass directly through the solid surface.',
    images: [
      {
        src: '/assets/applications/excavage-education.jpg',
        alt: 'Collaborative workshop and architectural studio review island in Excavage Mineral',
        caption: 'Collaborative Studio Review Island & Communal Workstation in Excavage',
        tag: 'Collaboration Island'
      },
      {
        src: '/assets/applications/excavage-bathroom.jpg',
        alt: 'Wall-to-wall seamless commercial washroom trough vanity in Excavage',
        caption: 'Continuous Wall-to-Wall Commercial Washroom Trough in Excavage',
        tag: 'Commercial Trough'
      },
      {
        src: '/assets/applications/excavage-bathroom-vanity-detail.jpg',
        alt: 'Seamless basin junction and concealed sloped drain detail in Excavage solid surface',
        caption: 'Precision CNC-Milled Sloped Drain Detail with Zero Bacterial Traps',
        tag: 'Sloped Drain Detail'
      }
    ],
    specifications: [
      {
        title: 'Invisible Induction Charging Embeds',
        description: 'Underside pocket milling leaves a 3mm membrane above the charging coil, allowing smartphones to charge simply by resting on the bare surface.'
      },
      {
        title: 'Concealed Cable Pass-Throughs',
        description: 'Flush removable mineral caps fit with 0.5mm tolerances, hiding cables while maintaining an uninterrupted monolithic surface.'
      },
      {
        title: 'Anti-Glare Low Gloss Finish',
        description: 'Diamond-pad honed to 8-12 gloss units to prevent eye fatigue from overhead LED office lighting and monitors.'
      }
    ],
    hygieneAndPerformance: [
      { feature: 'Scratch Resistance', standard: 'Barcol Hardness > 60', benefit: 'Resists laptop cases, metal buckles, and daily office accessories.' },
      { feature: 'Zero VOC Emissions', standard: 'UL GREENGUARD Gold', benefit: 'Compliant with LEED v4, WELL Building, and IGBC green building standards.' },
      { feature: 'Sound Dampening', standard: 'Mineral Composite Matrix', benefit: 'Softer acoustic impact than stainless steel, glass, or polished porcelain.' }
    ],
    typicalThickness: '12mm / 19mm with structural under-frame',
    jointVisibility: '< 0.08mm',
    leadTime: '2 to 3 weeks'
  },
  {
    id: 'retail',
    sectorNumber: '04',
    title: 'Retail & Experience Centres',
    tagline: 'Curated stages for brand expression',
    heroDescription:
      'Luxury retail interiors use solid surfaces as monolithic sculptural plinths and display counters that focus attention entirely on the product.',
    overview:
      'High-end retail and brand pavilions require bespoke textures, sculptural arches, and illuminated display pedestals that invite touch while maintaining complete brand prestige.',
    elements: [
      'Translucent Illuminated Product Display Pedestals',
      'Point-of-Sale Monolithic Counters with Concealed Cash Drawers',
      'Curved Architectural Feature Archways & Portals',
      'Branded Visual Merchandising Fixtures with Relief Engravings',
      'VIP Client Consultation Salons & Jewelry Display Trays'
    ],
    recommendedMaterials: [
      { name: 'Strata / Terrazzo Ash', slug: 'strata-terrazzo-ash', finish: 'Satin Smooth' },
      { name: 'Lumen / Shell', slug: 'lumen-shell', finish: 'Translucent Polish' },
      { name: 'Noma / Linen', slug: 'noma-linen', finish: 'Fine Honed' }
    ],
    fabricationNote:
      'High-precision 5-axis CNC routing enables intricate typography, logo relief engravings, and microscopic backlit light perforations.',
    images: [
      {
        src: '/assets/applications/laguna-terrazzo-bathroom.jpg',
        alt: 'Sculptural Terrazzo luxury display pavilion and washstand in Laguna Terrazzo',
        caption: 'Bespoke Display Pavilion & Monolithic Washstand in Laguna Terrazzo',
        tag: 'Terrazzo Pavilion'
      },
      {
        src: '/assets/applications/laguna-terrazzo-vanity-detail.jpg',
        alt: 'Close-up of curved terrazzo radii and precision-finished joint',
        caption: 'Curved Internal Radius & Inconspicuous Terrazzo Joint Detail',
        tag: 'Terrazzo Joint Detail'
      },
      {
        src: '/assets/applications/stonique-bathroom-vanity.jpg',
        alt: 'Sculptural floating display plinth and vanity in pure white Stonique',
        caption: 'Sculptural Floating Display Plinth & Basin in Pure White Stonique',
        tag: 'Floating Plinth'
      }
    ],
    specifications: [
      {
        title: 'CNC Relief Branding',
        description: 'Brand marks, typography, and texture patterns milled to 0.1mm tolerances directly into the stone body without decals.'
      },
      {
        title: 'Internal Steel Framework',
        description: 'Cantilevered cashwraps and floating pedestals built with integrated powder-coated steel space-frames to support heavy loads.'
      },
      {
        title: 'Micro-Radius Chamfering',
        description: 'Edges hand-worked to 2mm radius to ensure safety for customers while preserving crisp architectural geometry.'
      }
    ],
    hygieneAndPerformance: [
      { feature: 'UV Color Fastness', standard: 'Delta E < 1.0 after 1000h Xenon', benefit: 'Zero fading or yellowing under intense retail display halogen and LED spots.' },
      { feature: 'Surface Cleanliness', standard: 'Wipe-Clean Non-Porous', benefit: 'Fingerprints and cosmetic pigments wipe away effortlessly with water and microfiber.' },
      { feature: 'Modularity', standard: 'Demountable Joint Engineering', benefit: 'Fixtures can be disassembled and re-deployed across seasonal store rollouts.' }
    ],
    typicalThickness: '12mm / 24mm built-up profile',
    jointVisibility: '< 0.05mm',
    leadTime: '3 weeks'
  },
  {
    id: 'healthcare',
    sectorNumber: '05',
    title: 'Hospitals & Healthcare Spaces',
    tagline: 'Non-porous hygienic precision & infection control',
    heroDescription:
      'Hospitals, surgical suites, sterile dental operatories, and diagnostic laboratories demand certified non-porous mineral surfaces immune to bacterial and fungal harboring.',
    overview:
      'Where hygiene and infection control are non-negotiable, Ace Spaces solid surfaces provide seamless, coved transitions from wall to counter to sink with zero silicone caulking, eliminating the microscopic breeding grounds where MRSA, mold, and pathogens accumulate.',
    elements: [
      'Seamless Surgical Scrub Sinks with Sloped Splash Walls',
      'Hospital Nurse Stations & Patient Reception Monoliths',
      'Operatory Treatment Countertops with Integrated Containment Rims',
      'Cleanroom Seamless Wall Cladding with Coved Floor Skirtings',
      'Diagnostic Laboratory Workbenches with Acid & Disinfectant Resistance',
      'Patient Room Seamless Vanity Bowls & Coved Shower Surrounds'
    ],
    recommendedMaterials: [
      { name: 'Noma / White Chalk (Stonique)', slug: 'noma-white-chalk', finish: 'Clinical Matte' },
      { name: 'Alto / Bianco Vein', slug: 'alto-bianco-vein', finish: 'Satin Pure' },
      { name: 'Strata / Sand Fine', slug: 'strata-sand-fine', finish: 'Fine Textured' },
      { name: 'Noma / Linen', slug: 'noma-linen', finish: 'Velvet Matte' },
      { name: 'Strata / Terrazzo Ash', slug: 'strata-terrazzo-ash', finish: 'Satin Polished' },
      { name: 'Obsidian / Still', slug: 'obsidian-still', finish: 'Tactile Matte' }
    ],
    fabricationNote:
      'Custom thermoformed integral coved corners and silicone-free chemical welding guarantee zero bacterial harborage points.',
    images: [
      {
        src: '/assets/applications/stonique-healthcare-clinic-1.jpg',
        alt: 'Hygienic dental clinic consultation and reception space in Stonique solid surface',
        caption: 'Non-Porous Clinical Consultation & Reception Counter in Stonique',
        tag: 'Clinical Reception'
      },
      {
        src: '/assets/applications/stonique-healthcare-clinic-2.jpg',
        alt: 'Specialist operatory treatment room countertops and splashbacks in seamless solid surface',
        caption: 'Hygienic Operatory Countertops & Integrated Splashbacks',
        tag: 'Operatory Surfaces'
      },
      {
        src: '/assets/applications/stonique-bathroom-vanity.jpg',
        alt: 'Sterile scrub sink with thermo-welded basin and zero silicone seals',
        caption: 'Seamless Scrub Basin with Continuous Wall Splash Transition',
        tag: 'Scrub Station'
      }
    ],
    specifications: [
      {
        title: 'Integral Coved Skirting',
        description: 'Countertops transition directly into backsplashes via a smooth 10mm cove radius, completely replacing mould-prone silicone caulk.'
      },
      {
        title: 'Containment Marine Edges',
        description: 'Countertop perimeters can be machined with an integrated 4mm raised water-retaining lip to stop chemical spillage onto flooring.'
      },
      {
        title: 'Disinfectant Compatibility',
        description: 'Immune to bleach, 70% isopropyl alcohol, quaternary ammonium solutions, and chlorhexidine gluconate.'
      }
    ],
    hygieneAndPerformance: [
      { feature: 'Microbial Harboring', standard: 'ISO 846 Method A & C Rating 0', benefit: 'Incapable of supporting fungal or bacterial growth even under high humidity.' },
      { feature: 'NSF Healthcare', standard: 'NSF / ANSI 51 Non-Food Zone & Food Zone', benefit: 'Highest international standard for cleanable commercial hygiene.' },
      { feature: 'Chemical Resistance', standard: 'DIN 68861 Part 1 1B', benefit: 'Immune to medical iodine, sodium hypochlorite, and staining pigments.' }
    ],
    typicalThickness: '12mm solid throughout',
    jointVisibility: '< 0.05mm (Hermetically sealed)',
    leadTime: '2 to 3 weeks'
  }
];

export function getApplicationSector(idOrSlug: string): ApplicationSector | undefined {
  const norm = idOrSlug.toLowerCase();
  return applicationSectors.find((s) => {
    if (s.id === norm) return true;
    if (s.title.toLowerCase().replace(/\s+/g, '-') === norm) return true;
    // Flexible alias resolution for healthcare / hospital / custom / clinical
    if (
      s.id === 'healthcare' &&
      ['custom', 'healthcare', 'hospital', 'hospitals', 'clinical', 'clinical-specialist-spaces'].includes(norm)
    ) {
      return true;
    }
    return false;
  });
}
