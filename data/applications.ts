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
    title: 'Luxury Residentials',
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
      { name: 'Calacatta Greige Sheet', slug: 'css-calacatta-greige-sheet', finish: 'Satin Honed' },
      { name: 'Artista Sage Sheet', slug: 'css-artista-sage-sheet', finish: 'Tactile Satin' },
      { name: 'Stonecrest Smoke Sheet', slug: 'css-stonecrest-smoke-sheet', finish: 'Velvet Matte' }
    ],
    fabricationNote:
      'Color-matched acrylic thermo-welded joints ensure zero grout lines, 100% moisture barrier, and zero bacterial harborage.',
    images: [
      {
        src: '/images/images/app_residential_calacatta_greige_1.jpg',
        alt: 'Monolithic Calacatta Greige kitchen island and continuous splashback in residential interior',
        caption: 'Monolithic Kitchen Island & Continuous Splashback in Calacatta Greige',
        tag: 'Monolithic Island'
      },
      {
        src: '/images/images/app_residential_calacatta_greige_2.jpg',
        alt: 'Seamless 45-degree mitred waterfall edge and surface join close-up',
        caption: 'Seamless 45° Mitred Waterfall Gable Join with Zero Silicones',
        tag: 'Waterfall Mitre Detail'
      },
      {
        src: '/images/images/app_residential_stonecrest_smoke_1.jpg',
        alt: 'Architectural Stonecrest Smoke kitchen island with integrated undermount basin',
        caption: 'Tactile Graphite Island with Continuous Integrated Undermount Basin',
        tag: 'Integrated Sink'
      },
      {
        src: '/images/images/app_residential_cirrus_white_1.jpg',
        alt: 'Thermo-welded sink transition and seamless drainage detail in Cirrus White',
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
    id: 'spiritual',
    sectorNumber: '02',
    title: 'Spiritual',
    tagline: 'Sacred geometries and luminous tranquility',
    heroDescription:
      'In sacred and contemplative architecture, solid mineral surfaces bring reverent purity—sculpting monolithic mandir altars, backlit transcendent jali screens, and seamless sanctum walls with zero joints.',
    overview:
      'Spiritual spaces demand materials of pristine visual stillness, monolithic integrity, and delicate light translucence. From bespoke home pooja mandirs to expansive spiritual retreat halls, Ace Spaces engineers solid mineral surfaces into sculptural deity plinths, CNC-perforated lattice screens (jalis), and oil-resistant ritual ablution basins.',
    elements: [
      'Monolithic Pooja Mandirs & Prayer Shrines',
      'Backlit Translucent Jali (Lattice) Screens with Intricate Sacred Geometry',
      'Sculptural Deity Plinths & Sanctum Altar Steps',
      'Seamless Ritual Water & Oil Ablution Basins',
      'Continuous Floor-to-Ceiling Sanctuary Wall Cladding'
    ],
    recommendedMaterials: [
      { name: 'Stonique Sheet', slug: 'css-stonique-sheet', finish: 'Clinical Matte' },
      { name: 'Calacatta Greige Sheet', slug: 'css-calacatta-greige-sheet', finish: 'Honed Satin' },
      { name: 'Artista Mist Sheet', slug: 'css-artista-mist-sheet', finish: 'Velvet Honed' }
    ],
    fabricationNote:
      'Precision 5-axis CNC router carving produces microscopic 0.5mm lattice filigree, while sub-surface LED cavities emit uniform, shadowless halo illumination.',
    images: [
      {
        src: '/images/images/coriansolidsurface-goldenonyx-application.jpg',
        alt: 'Translucent illuminated spiritual sanctum and altar feature in Golden Onyx',
        caption: 'Backlit Translucent Altar Monolith & Illuminated Sanctum in Golden Onyx',
        tag: 'Backlit Sanctum'
      },
      {
        src: '/images/images/app_residential_cirrus_white_1.jpg',
        alt: 'Pristine seamless mandir prayer shrine with zero joints in Cirrus White',
        caption: 'Monolithic Pooja Shrine with Seamless Coved Transitions in Cirrus White',
        tag: 'Pooja Shrine'
      },
      {
        src: '/images/images/coriansolidsurface-silverlinear-hospitality-application.jpg',
        alt: 'Sculptural temple feature wall and deity plinth in monolithic solid surface',
        caption: 'Curved Sanctuary Feature Wall & Sculptural Deity Plinth',
        tag: 'Sanctuary Wall'
      }
    ],
    specifications: [
      {
        title: 'High-Precision 5-Axis CNC Jali Carving',
        description: 'Intricate traditional and contemporary sacred lattice patterns milled down to 0.5mm detail without edge chipping, delamination, or visible fastener points.'
      },
      {
        title: 'Sub-Surface Warm Illumination (2700K)',
        description: 'Translucent mineral formulations diffused from within, creating a warm, ethereal sub-surface glow behind sacred icons and ornamental panels.'
      },
      {
        title: 'Incense, Oil & Kumkum Resistance',
        description: '100% non-porous mineral matrix prevents oily camphor, agarbatti soot, kumkum powders, and milk offerings from penetrating or staining.'
      }
    ],
    hygieneAndPerformance: [
      { feature: 'Oil & Soot Resistance', standard: 'Non-Porous Mineral Matrix', benefit: 'Ghee, oil lamps, and incense smoke residue wipe clean without discoloration.' },
      { feature: 'Purity Certification', standard: 'NSF Standard 51 Clean Surface', benefit: 'Certified sanitary composition free from microbial or fungal absorption.' },
      { feature: 'Acoustic Reverberation', standard: 'Mineral Composite Damping', benefit: 'Absorbs flutter echoes for a deeper, more peaceful meditative acoustic ambiance.' }
    ],
    typicalThickness: '12mm / 19mm with integrated backlighting diffusion cavity',
    jointVisibility: '< 0.05mm (Hermetically welded)',
    leadTime: '3 to 4 weeks for bespoke CNC jali carving'
  },
  {
    id: 'hospitality',
    sectorNumber: '03',
    title: 'Hospitalities (Food Places)',
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
      { name: 'Stonecrest Smoke Sheet', slug: 'css-stonecrest-smoke-sheet', finish: 'Tactile Matte' },
      { name: 'Laguna Terrazzo Sheet', slug: 'css-laguna-terrazzo-sheet', finish: 'Satin Smooth' },
      { name: 'Artista Sage Sheet', slug: 'css-artista-sage-sheet', finish: 'Tactile Satin' }
    ],
    fabricationNote:
      'Multi-radius oven thermoforming and internal optical light cavities deliver soft, diffused illumination without hot-spots.',
    images: [
      {
        src: '/images/images/coriansolidsurface-silverlinear-hospitality-application.jpg',
        alt: 'Monolithic grand hotel reception desk and lobby surface in hospitality interior',
        caption: 'Monolithic Reception Desk & Lobby Cladding in Silver Linear',
        tag: 'Reception Monolith'
      },
      {
        src: '/images/images/app_residential_artista_sage_1.jpg',
        alt: 'Continuous curved elevator lobby and architectural corridor cladding in Artista Sage',
        caption: 'Curved Elevator Portal & Corridor Cladding in Artista Sage',
        tag: 'Curved Cladding'
      },
      {
        src: '/images/images/app_residential_artista_mist_1.jpg',
        alt: 'Luxury boutique hotel suite double vanity in Artista Mist',
        caption: 'Bespoke Boutique Suite Double Basin Floating Vanity in Artista Mist',
        tag: 'Suite Vanities'
      }
    ],
    specifications: [
      {
        title: 'Sub-Surface Optical Light Cavities',
        description: 'Translucent onyx and crystal sheets are backed by dimmable 2700K optical diffusion panels for shadowless monolithic glow.'
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
    id: 'healthcare',
    sectorNumber: '04',
    title: 'Healthcare',
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
      { name: 'Stonique Sheet', slug: 'css-stonique-sheet', finish: 'Clinical Matte' },
      { name: 'Excavage Sheet', slug: 'css-excavage-sheet', finish: 'Fine Honed Matte' },
      { name: 'Artista Mist Sheet', slug: 'css-artista-mist-sheet', finish: 'Velvet Honed' }
    ],
    fabricationNote:
      'Custom thermoformed integral coved corners and silicone-free chemical welding guarantee zero bacterial harborage points.',
    images: [
      {
        src: '/images/images/app_commercial_grinds_stonique.jpg',
        alt: 'Hygienic dental clinic consultation and reception space in Stonique solid surface',
        caption: 'Non-Porous Clinical Consultation & Reception Counter in Stonique',
        tag: 'Clinical Reception'
      },
      {
        src: '/images/images/app_residential_stonique_1.jpg',
        alt: 'Specialist operatory treatment room countertops and splashbacks in seamless solid surface',
        caption: 'Hygienic Operatory Countertops & Integrated Splashbacks in Stonique',
        tag: 'Operatory Surfaces'
      },
      {
        src: '/images/images/app_commercial_grinds_archeologic.jpg',
        alt: 'Sterile scrub sink with thermo-welded basin and zero silicone seals',
        caption: 'Seamless Scrub Basin with Continuous Wall Splash Transition in Archeologic',
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
  },
  {
    id: 'commercial',
    sectorNumber: '05',
    title: 'Commercial Interiors',
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
      { name: 'Excavage Sheet', slug: 'css-excavage-sheet', finish: 'Fine Honed Matte' },
      { name: 'Stonecrest Smoke Sheet', slug: 'css-stonecrest-smoke-sheet', finish: 'Velvet Matte' },
      { name: 'Artista Mist Sheet', slug: 'css-artista-mist-sheet', finish: 'Velvet Honed' }
    ],
    fabricationNote:
      'Sub-surface 5-axis CNC milling allows Qi wireless charging electromagnetic fields to pass directly through the solid surface.',
    images: [
      {
        src: '/images/images/app_commercial_bleached_nuwood.jpg',
        alt: 'Collaborative workshop and architectural studio review island in Bleached Nuwood',
        caption: 'Collaborative Studio Review Island & Communal Workstation in Bleached Nuwood',
        tag: 'Collaboration Island'
      },
      {
        src: '/images/images/app_commercial_grinds_excavage.jpg',
        alt: 'Wall-to-wall seamless commercial washroom trough vanity in Excavage',
        caption: 'Continuous Wall-to-Wall Commercial Washroom Trough in Excavage',
        tag: 'Commercial Trough'
      },
      {
        src: '/images/images/app_commercial_grinds_pebble_lane.jpg',
        alt: 'Seamless basin junction and concealed sloped drain detail in Pebble Lane solid surface',
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
    id: 'exterior-cladding',
    sectorNumber: '06',
    title: 'Exterior Cladding',
    tagline: 'Monolithic architectural facades & weather envelopes',
    heroDescription:
      'Engineered to withstand tropical sun, driving monsoon rains, and thermal expansion, Ace Spaces solid surface ventilated facades create fluid, seamless building envelopes with zero moisture penetration.',
    overview:
      'Exterior architectural cladding demands exceptional UV resistance, thermal stability, and low flame-spread ratings. Utilizing advanced DuPont™ Corian® mineral formulations, Ace Spaces fabricates 3-dimensional thermoformed panels, curved soffits, and rain-screen facade cassettes with invisible mechanical undercut anchor fixtures.',
    elements: [
      'Ventilated Rain-Screen Facade Cassettes',
      'Curved 3D Thermoformed Building Portals & Soffits',
      'Perforated Solar Shading & Architectural Brise-Soleil',
      'Seamless Canopy Linings & Column Encasements',
      'UV-Stable Architectural Parapet & Coping Profiles'
    ],
    recommendedMaterials: [
      { name: 'Stonique Sheet', slug: 'css-stonique-sheet', finish: 'Clinical Matte' },
      { name: 'Stonecrest Smoke Sheet', slug: 'css-stonecrest-smoke-sheet', finish: 'Tactile Matte' },
      { name: 'Calacatta Greige Sheet', slug: 'css-calacatta-greige-sheet', finish: 'Honed Satin' }
    ],
    fabricationNote:
      'Keil undercut rear anchor system and precision CNC expansion joints allow thermal movement while presenting a flawless monolithic facade.',
    images: [
      {
        src: '/images/images/coriansolidsurface-beechnuwood-application.jpg',
        alt: 'Exterior architectural facade cladding and canopy soffits in durable solid surface',
        caption: 'Ventilated Facade Cassettes & Thermoformed Soffit in Beech Nuwood',
        tag: 'Facade Cassettes'
      },
      {
        src: '/images/images/app_commercial_bleached_nuwood.jpg',
        alt: 'Exterior architectural rain-screen panel detail and UV-resistant finish',
        caption: 'Seamless Architectural Weather Envelope with Concealed Mechanical Anchors',
        tag: 'Rain-Screen System'
      },
      {
        src: '/images/images/coriansolidsurface-carbonaggregate-application.jpg',
        alt: 'Thermoformed exterior curved column encasement in monolithic composite',
        caption: 'Thermoformed Monolithic Column Encasement & Portal Cladding',
        tag: 'Column Cladding'
      }
    ],
    specifications: [
      {
        title: 'Undercut Anchor Mechanical Fixing',
        description: 'Keil undercut rear anchor system ensures completely invisible facade fastenings tested for high wind-load engineering.'
      },
      {
        title: 'Ventilated Rain-Screen Thermal Barrier',
        description: 'Continuous air cavity allows natural moisture dissipation and enhances building thermal insulation (R-value).'
      },
      {
        title: 'UV & Weatherproof Integrity',
        description: 'Tested under intense Xenon-arc weathering for 10-year colorfast stability against UV radiation and monsoonal humidity.'
      }
    ],
    hygieneAndPerformance: [
      { feature: 'UV Stability', standard: 'ASTM G155 Delta E < 2.0', benefit: 'Immune to solar bleaching, chalking, or thermal degradation.' },
      { feature: 'Wind Load Resistance', standard: 'ASTM E330 / IS 875', benefit: 'Withstands severe typhoon pressures and structural dynamic building movements.' },
      { feature: 'Fire Rating', standard: 'EN 13501-1 Class B-s1,d0', benefit: 'Self-extinguishing with minimal smoke toxicity for high-rise facade codes.' }
    ],
    typicalThickness: '12mm through-body solid surface with aluminum rail substructure',
    jointVisibility: '< 0.05mm (Flush sealed or open ventilated joint)',
    leadTime: '3 to 5 weeks depending on facade engineering shop drawings'
  }
];

export function getApplicationSector(idOrSlug: string): ApplicationSector | undefined {
  const norm = idOrSlug.toLowerCase();
  return applicationSectors.find((s) => {
    if (s.id === norm) return true;
    if (s.title.toLowerCase().replace(/\s+/g, '-') === norm) return true;
    // Flexible alias resolution across all 6 applications:
    if (
      s.id === 'residential' &&
      ['residential', 'luxury-residentials', 'luxury-residential', 'residentials', 'residential-architecture'].includes(norm)
    ) {
      return true;
    }
    if (
      s.id === 'spiritual' &&
      ['spiritual', 'mandir', 'pooja', 'temple', 'spiritual-spaces', 'sacred-spaces'].includes(norm)
    ) {
      return true;
    }
    if (
      s.id === 'hospitality' &&
      ['hospitality', 'hospitalities', 'food-places', 'dining', 'food', 'restaurants', 'cafes'].includes(norm)
    ) {
      return true;
    }
    if (
      s.id === 'healthcare' &&
      ['custom', 'healthcare', 'hospital', 'hospitals', 'clinical', 'clinical-specialist-spaces', 'medical'].includes(norm)
    ) {
      return true;
    }
    if (
      s.id === 'commercial' &&
      ['commercial', 'commercial-interiors', 'workplace', 'offices', 'corporate', 'retail'].includes(norm)
    ) {
      return true;
    }
    if (
      s.id === 'exterior-cladding' &&
      ['exterior-cladding', 'cladding', 'exterior', 'facades', 'facade', 'exteriors'].includes(norm)
    ) {
      return true;
    }
    return false;
  });
}
