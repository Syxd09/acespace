export interface ProductItem {
  slug: string;
  name: string;
  categoryName: string;
  code: string;
  tagline: string;
  heroDescription: string;
  overview: string;
  image: string;
  galleryImages: { src: string; alt: string; caption: string }[];
  keyFeatures: string[];
  specifications: { label: string; value: string }[];
  applications: string[];
  compatibleMaterials: string[];
  certifications: string[];
  cadAvailable: boolean;
}

export const productsData: ProductItem[] = [
  {
    slug: 'benchtops',
    name: 'Benchtops & Worktops',
    categoryName: 'BENCHTOPS',
    code: 'PRD-BT-01',
    tagline: 'Seamless kitchen islands and worktops with continuous waterfall drops.',
    heroDescription:
      'Custom kitchen islands and commercial counters crafted from DuPont™ Corian®. Chemical acrylic fusion creates continuous planes with zero silicone joints or dirt traps.',
    overview:
      'Unlike natural stone or laminate, solid surface can be joined on-site into seamless lengths. Scratches buff out easily, and coved splashbacks eliminate perimeter mould forever.',
    image: '/images/images/app_residential_calacatta_greige_1.jpg',
    galleryImages: [
      {
        src: '/images/images/app_residential_calacatta_greige_1.jpg',
        alt: 'Monolithic kitchen island benchtop with seamless waterfall gable end in Calacatta Greige',
        caption: 'Seamless Calacatta Greige kitchen island with mitred 60mm apron drop edge.'
      },
      {
        src: '/images/images/app_residential_calacatta_greige_2.jpg',
        alt: 'Close-up of seamless 45-degree waterfall mitre join',
        caption: 'Precision mitred waterfall gable end with unbroken grain continuation.'
      },
      {
        src: '/images/images/app_residential_stonecrest_smoke_1.jpg',
        alt: 'Integrated Stonecrest Smoke solid surface kitchen island',
        caption: 'Tactile Stonecrest Smoke monolithic island with continuous under-mount basin.'
      }
    ],
    keyFeatures: [
      'Seamless chemical bonding with zero visible joints',
      'Coved splashback transitions that eliminate silicone grime',
      'Mitred waterfall edges with continuous veining',
      'Sub-surface steel and moisture-resistant reinforcement',
      'Renewable surface—everyday scuffs buff out on-site'
    ],
    specifications: [
      { label: 'Standard Slab Dimension', value: '3660 mm (L) × 760 mm (W)' },
      { label: 'Thickness Options', value: '12 mm (solid body) / 19 mm / 60 mm built-up edge' },
      { label: 'Edge Profiles', value: 'Mitred square, 3mm bevel, pencil round, full bullnose' },
      { label: 'Splashback Junction', value: '10mm radius seamless coved upstand' },
      { label: 'Hygiene Rating', value: 'NSF/ANSI 51 certified for food contact zones' },
      { label: 'Heat Resistance', value: 'Tolerates up to 100°C dry heat (use built-in trivets for cookware)' }
    ],
    applications: [
      'Residential Kitchen Islands & Countertops',
      'Commercial Reception Counters & Desks',
      'Hospitality Cocktail Bars & Restaurant Service Lines',
      'Executive Boardroom Meeting Tables',
      'Laboratory & Healthcare Workstations'
    ],
    compatibleMaterials: [
      'Calacatta Greige',
      'Stonique',
      'Stonecrest Smoke',
      'Cirrus White',
      'Travertine Roma'
    ],
    certifications: [
      'NSF/ANSI 51 Certified',
      'GREENGUARD Gold',
      'EN 13501-1 Fire Rating B-s1, d0',
      'ISO 846 Microbial Resistance'
    ],
    cadAvailable: true
  },
  {
    slug: 'sinks',
    name: 'Integrated Sinks',
    categoryName: 'SINKS',
    code: 'PRD-SNK-02',
    tagline: 'Integrated sinks welded directly into solid surface counters.',
    heroDescription:
      'Under-mount sinks fused seamlessly into your benchtop. With no raised rims or silicone caulking, water and food debris wipe straight into the bowl.',
    overview:
      'Milled and bonded from matching DuPont™ Corian® mineral composite, each sink becomes one continuous piece with the counter. Soft rounded internal corners make cleaning effortless.',
    image: '/images/integrated-sink-installation.jpg',
    galleryImages: [
      {
        src: '/images/integrated-sink-installation.jpg',
        alt: 'Seamless undermount integrated solid surface vanity sink',
        caption: 'Seamless sink-to-benchtop transition with precision drainage grooves.'
      },
      {
        src: '/images/images/app_residential_stonique_1.jpg',
        alt: 'Double bowl integrated sink installation in Stonique',
        caption: 'Twin-bowl kitchen preparation sink with integrated waste disposal collar.'
      }
    ],
    keyFeatures: [
      '100% silicone-free chemical fusion to countertop',
      'Zero rims or crevices where grime and moisture can gather',
      'Smooth curved corners for easy wipe-down cleaning',
      'Thermal shock resistant base for hot culinary liquids',
      'Directly carved sloped drainage grooves'
    ],
    specifications: [
      { label: 'Configuration Options', value: 'Single bowl, 1.5 bowl, double bowl, utility deep bowl' },
      { label: 'Bowl Depth', value: '180 mm to 240 mm' },
      { label: 'Internal Corner Radius', value: '10 mm radius coved hygiene profile' },
      { label: 'Waste Outlet', value: 'Standard 90 mm basket waste & garbage disposal compatible' },
      { label: 'Colour Options', value: 'Stonique, Cirrus White, Whipped Cream, Linen' }
    ],
    applications: [
      'Architectural Kitchen Workstations',
      'Sculleries & Butler Pantries',
      'Commercial Preparation Kitchens',
      'Laboratories & Clean Rooms'
    ],
    compatibleMaterials: ['Stonique', 'Cirrus White', 'Linen', 'Whipped Cream'],
    certifications: ['NSF/ANSI 51', 'CE Certified EN 13310', 'CUPC Listed'],
    cadAvailable: true
  },
  {
    slug: 'washplanes',
    name: 'Linear Washplanes',
    categoryName: 'WASHPLANES',
    code: 'PRD-WP-03',
    tagline: 'Minimalist sloped washplanes for commercial and public amenities.',
    heroDescription:
      'Continuous linear washplanes designed for offices, airports, and restaurants. A gentle slope directs water into a concealed drainage trough, eliminating standing water.',
    overview:
      'Traditional individual basins often leave water pooled on countertops. Ace Spaces washplanes provide an unbroken horizontal surface spanning up to 5 meters, built for hands-free wall-mounted taps.',
    image: '/images/washplane-commercial-multistation.jpg',
    galleryImages: [
      {
        src: '/images/washplane-commercial-multistation.jpg',
        alt: 'Multi-station linear solid surface washplane in marble-veined finish with integrated deck',
        caption: 'Multi-station continuous commercial washplane with integrated undermount basin deck and towel rails.'
      },
      {
        src: '/images/washplane-trough-cantilever.jpg',
        alt: 'Monolithic cantilevered trough washplane in dark aggregate finish',
        caption: 'Monolithic floating trough washplane with multi-tap sensor array for high-traffic amenities.'
      }
    ],
    keyFeatures: [
      'Concealed linear drainage trough prevents water pooling',
      'Spans up to 5 meters with invisible chemical joints',
      'Concealed steel cantilever support framing',
      'Lift-out access covers for easy plumbing maintenance',
      'CNC cutouts for sensor tapware and soap dispensers'
    ],
    specifications: [
      { label: 'Module Lengths', value: '1-Station (900mm), 2-Station (1500mm), 3-Station (2200mm), Custom up to 5000mm' },
      { label: 'Depth from Wall', value: '500 mm to 600 mm' },
      { label: 'Drainage Channel', value: 'Continuous concealed stainless steel / solid surface trough' },
      { label: 'Mounting Type', value: 'Heavy-gauge powder-coated structural cantilever brackets' },
      { label: 'Access System', value: 'Tool-free lift-out drainage cover plates' }
    ],
    applications: [
      'Corporate Headquarters & Office Towers',
      'Airport & Transit Terminal Amenities',
      'Luxury Shopping Galleries & Theatres',
      'High-End Restaurants & Hotel Restrooms'
    ],
    compatibleMaterials: [
      'Excavage',
      'Pebble Lane',
      'Stonecrest Smoke',
      'Archeologic',
      'Terrazzo Laguna'
    ],
    certifications: ['DDA / ADA Compliant options', 'GREENGUARD Gold', 'BREEAM / LEED credits'],
    cadAvailable: true
  },
  {
    slug: 'basins-vanities',
    name: 'Basins & Vanities',
    categoryName: 'BASINS & VANITIES',
    code: 'PRD-BV-04',
    tagline: 'Monolithic bathroom vanities with seamlessly sculpted washbowls.',
    heroDescription:
      'Custom bathroom vanities for residences and boutique hotels. Countertop and washbowl are fused into one continuous form that resists cosmetics, water marks, and daily wear.',
    overview:
      'Available as wall-hung cantilevered slabs or joinery-mounted vanity consoles. The non-porous mineral acrylic surface does not harbor mould or water marks.',
    image: '/images/basin-vanity-thermoformed-double.jpg',
    galleryImages: [
      {
        src: '/images/basin-vanity-thermoformed-double.jpg',
        alt: 'Thermoformed wall-hung double basin vanity with coved splashback',
        caption: 'Bespoke floating dual-basin vanity console with seamless coved wall splashback.'
      },
      {
        src: '/images/basin-vanity-round-vessel.jpg',
        alt: 'Countertop solid surface round vessel basin on vanity unit',
        caption: 'Circular solid surface vessel basin on minimalist bathroom vanity suite.'
      }
    ],
    keyFeatures: [
      'Seamless integrated bowl with zero silicone joints',
      'Wall-hung floating or furniture-mounted configurations',
      'Oval, capsule, or crisp rectangular basin profiles',
      'Resistant to makeup, skincare oils, and hair products',
      'Integrated towel slots and concealed waste covers'
    ],
    specifications: [
      { label: 'Length Options', value: '600mm, 900mm, 1200mm, 1500mm, 1800mm, custom' },
      { label: 'Vanity Depth', value: '460 mm to 550 mm' },
      { label: 'Apron Drop Height', value: '40 mm to 200 mm mitred fascia' },
      { label: 'Basin Shapes', value: 'Oval thermoformed, rectangular sloping, pill-shaped capsule' },
      { label: 'Taphole Options', value: 'Zero (wall tapware), single centre, or custom multiple' }
    ],
    applications: [
      'Luxury Master En-Suites',
      'Boutique Hotel Guestrooms',
      'Powder Rooms & Guest Bathrooms',
      'Spa & Wellness Centres'
    ],
    compatibleMaterials: [
      'Artista Mist',
      'Stonique',
      'Cirrus White',
      'Golden Onyx',
      'Linen'
    ],
    certifications: ['WaterMark Approved', 'EN 14688 Sanitary Appliances', 'GREENGUARD Gold'],
    cadAvailable: true
  },
  {
    slug: 'public-bathrooms-eot',
    name: 'Public Bathrooms & End-of-Trip (EOT)',
    categoryName: 'PUBLIC BATHROOMS AND EOT SOLUTIONS',
    code: 'PRD-EOT-05',
    tagline: 'Durable washstations and privacy partitions for commercial amenities.',
    heroDescription:
      'Heavy-duty vanity suites and privacy screens built for corporate end-of-trip facilities, gyms, and commercial washrooms. Non-porous solid surface resists moisture and heavy use.',
    overview:
      'Built to handle high-traffic daily use. Surfaces wipe clean without harsh chemicals, and minor scuffs or marks can be refreshed on-site with a simple scouring pad.',
    image: '/images/eot-bathroom-cubicle-partitions.jpg',
    galleryImages: [
      {
        src: '/images/eot-bathroom-cubicle-partitions.jpg',
        alt: 'Full-height commercial toilet cubicle partitions and matching solid surface washbasin',
        caption: 'Full-height solid surface toilet cubicle partition system with seamless privacy rebating and integrated washbasin.'
      },
      {
        src: '/images/eot-urinal-modesty-screens.jpg',
        alt: 'Wall-mounted solid surface urinal modesty partition screens with radius corners',
        caption: 'Wall-mounted solid surface urinal modesty privacy screens with soft radius corners against fluted architectural cladding.'
      }
    ],
    keyFeatures: [
      'Full-height floor-to-ceiling privacy cubicle partitions',
      'Urinal modesty screens with rounded safety corners',
      'Through-body material that will not chip or peel',
      'Resistant to moisture, steam, and cleaning chemicals',
      'Integrated grooming amenities and appliance holders'
    ],
    specifications: [
      { label: 'Traffic Rating', value: 'Heavy commercial (500+ daily cycles)' },
      { label: 'Cubicle & Screen Height', value: 'Full-height floor-to-ceiling (up to 3000mm) or suspended cantilever' },
      { label: 'Graffiti Removal', value: '100% surface renewable with light scouring pad' },
      { label: 'Substrate Integration', value: 'Anodized aluminum framing and moisture-proof compact laminate' },
      { label: 'Accessories', value: 'Integrated Dyson Airblade wash & dry taps, waste hatches, heat rings' },
      { label: 'Fire Rating', value: 'ASTM E84 Class A / EN 13501-1' }
    ],
    applications: [
      'Premium Grade Office End-of-Trip (EOT) Stations',
      'High-End Health Clubs & Day Spas',
      'University Campus Amenities & Student Hubs',
      'Convention Centers & Sporting Stadium Suites'
    ],
    compatibleMaterials: [
      'Terrazzo Laguna',
      'Stonecrest Smoke',
      'Stonique',
      'Basalt Terrazzo'
    ],
    certifications: ['ASTM E84 Class A', 'NSF 51 Non-porous', 'Green Star & WELL compliant'],
    cadAvailable: true
  },
  {
    slug: 'health-aged-care',
    name: 'Health & Aged Care Solutions',
    categoryName: 'HEALTH & AGED CARE SOLUTIONS',
    code: 'PRD-HAC-06',
    tagline: 'Hygienic scrub sinks and clinical counters with zero grout lines.',
    heroDescription:
      'Engineered for hospitals, surgical suites, and clinics. Solid surface is completely non-porous and free of grout lines, making it the premier material for clinical hygiene.',
    overview:
      'Microorganisms thrive in moist silicone seams. Ace Spaces clinical fixtures eliminate these failure points with coved corners, anti-splash basins, and resistance to hospital disinfectants.',
    image: '/images/images/app_commercial_grinds_stonique.jpg',
    galleryImages: [
      {
        src: '/images/images/app_commercial_grinds_stonique.jpg',
        alt: 'Surgical scrub sink with coved splashback and anti-splash sloping front in Stonique',
        caption: 'Double-bay surgical scrub trough with zero-joint wall integration.'
      },
      {
        src: '/images/healthcare-clinical-reception-station.jpg',
        alt: 'Hygienic curved nurse station and clinical reception desk in solid surface',
        caption: 'Seamless clinical nurse station and patient reception desk with thermoformed curved gables.'
      }
    ],
    keyFeatures: [
      'Non-porous surface that does not harbor bacteria',
      'Seamless 20mm coved corners prevent moisture accumulation',
      'Resistant to bleach, alcohol, and iodine cleaners',
      'Wheelchair-accessible DDA compliant knee clearance',
      'NSF/ANSI 51 certified for sterile environments'
    ],
    specifications: [
      { label: 'Clinical Standards', value: 'Complies with Australasian Health Facility Guidelines (AHFG) & AIA' },
      { label: 'Microbial Resistance', value: 'Zero microbial growth per ASTM G21 & ISO 846' },
      { label: 'Thermal Disinfection', value: 'Tolerates 85°C high-temperature washouts' },
      { label: 'DDA Compliance', value: 'AS 1428.1 / ADA wheelchair clearances' },
      { label: 'Joint Specification', value: 'Chemical methyl-methacrylate thermo-weld' }
    ],
    applications: [
      'Hospital Surgical Scrub Bays & Pre-Op Theatres',
      'Clean Utility & Medication Preparation Benches',
      'Patient Room Accessible En-Suites & Vanities',
      'Aged Care & Assisted Living Communal Bathrooms',
      'Dental Operatory Cabinets & Sterilization Rooms'
    ],
    compatibleMaterials: ['Stonique', 'Cirrus White', 'Whipped Cream', 'Archeologic'],
    certifications: ['NSF/ANSI 51', 'ASTM G21 Fungus Resistant', 'ASTM G22 Bacteria Resistant'],
    cadAvailable: true
  },
  {
    slug: 'bespoke',
    name: 'Bespoke Architectural Fabrications',
    categoryName: 'BESPOKE',
    code: 'PRD-BSK-07',
    tagline: 'Custom curved monoliths, reception desks, and illuminated fixtures.',
    heroDescription:
      'Pushing solid surface beyond straight lines. We heat mineral sheets to 160°C to vacuum-form fluid curved desks, fluted wall panels, and backlit translucent counters.',
    overview:
      'When heated in our platen ovens, DuPont™ Corian® becomes flexible enough to form over timber bucks down to 25mm radii without micro-cracking. Once cooled, it returns to rigid stone strength.',
    image: '/images/bespoke-sculptural-lounge-monolith.jpg',
    galleryImages: [
      {
        src: '/images/bespoke-sculptural-lounge-monolith.jpg',
        alt: 'Sculptural monolithic solid surface curved lounge and 3D botanical wall relief panels',
        caption: 'Monolithic organic curved solid surface lounge seating paired with 3D precision-carved botanical wall reliefs and acoustic wave surfaces.'
      },
      {
        src: '/images/bespoke-backlit-gallery-feature-wall.jpg',
        alt: 'Backlit translucent solid surface architectural feature wall with relief medallions and curved archways',
        caption: 'Translucent solid surface illuminated gallery feature wall with recessed lighting niches and organic arch portals.'
      }
    ],
    keyFeatures: [
      'Vacuum membrane forming for complex 3D curves',
      '5-Axis CNC routing for precise joinery tolerances',
      'Concealed internal steel sub-frames for large spans',
      'Translucent grades for ambient backlighting',
      'Full workshop dry-fit before on-site installation'
    ],
    specifications: [
      { label: 'Thermoforming Temperature', value: '155°C – 165°C calibrated heating cycle' },
      { label: 'Minimum Bending Radius', value: '25 mm internal radius without whitening (sheet dependent)' },
      { label: 'CNC Working Envelope', value: '4000 mm × 2000 mm × 800 mm 5-axis volume' },
      { label: 'Light Transmission (Translucent Series)', value: 'Up to 38% light dispersion' },
      { label: 'Joint Technology', value: 'Color-matched seamless chemical fusion' }
    ],
    applications: [
      'Flagship Retail Experience Counters & Brand Podiums',
      'Corporate Headquarters Feature Reception Desks',
      'Luxury Hotel Atrium Sculptures & Concierge Bars',
      'Bespoke Residential Furniture & Feature Stair Linings'
    ],
    compatibleMaterials: [
      'Golden Onyx',
      'Bleached Nuwood',
      'Calacatta Greige',
      'Stonecrest Smoke'
    ],
    certifications: ['Custom engineered per project specifications'],
    cadAvailable: true
  },
  {
    slug: 'design-certainty',
    name: 'Design Certainty Service',
    categoryName: 'DESIGN CERTAINTY SERVICE',
    code: 'SVC-DCS-08',
    tagline: 'CAD drawings, on-site laser templating, and guaranteed site fitment.',
    heroDescription:
      'End-to-end technical support for architects and builders. We review your plans, create detailed shop drawings, and verify site measurements with 3D laser scanning.',
    overview:
      'From initial sketches to final handover, our workshop engineers partner with your studio to optimize sheet yield, verify joint locations, and ensure a flawless fit.',
    image: '/images/images/app_commercial_bleached_nuwood.jpg',
    galleryImages: [
      {
        src: '/images/images/app_commercial_bleached_nuwood.jpg',
        alt: 'Architectural studio review and precision fabrication planning',
        caption: 'Parametric CAD review table with continuous Bleached Nuwood surface.'
      },
      {
        src: '/images/images/app_residential_calacatta_greige_1.jpg',
        alt: 'On-site laser 3D templating in Calacatta Greige residence',
        caption: 'Sub-millimetre digital scanning ensuring flawless installation fit.'
      }
    ],
    keyFeatures: [
      'Detailed 2D CAD shop drawings and 3D BIM models',
      'On-site 3D digital laser templating for true walls',
      'Expansion calculations and structural sub-framing',
      'Physical material sample coupons and mockups',
      '10-Year installed warranty sign-off'
    ],
    specifications: [
      { label: 'Deliverables', value: '2D PDF shop drawings, 3D BIM/CAD models, material sample packs, engineering sign-off' },
      { label: 'Turnaround Time', value: '48 to 72 hours for initial shop drawing submittals' },
      { label: 'Laser Templating Accuracy', value: '± 0.5 mm digital 3D spatial scanning' },
      { label: 'Warranty', value: '10-Year Comprehensive Ace Spaces & DuPont™ Corian® Warranty' }
    ],
    applications: [
      'Architectural Specifiers & Interior Design Practices',
      'Commercial Fit-Out Contractors & Project Managers',
      'Hospitality Developers & Luxury Residential Builders'
    ],
    compatibleMaterials: ['All 48 Authentic DuPont™ Corian® Solid Surface Materials'],
    certifications: ['Certified Master Fabricator Network', 'DuPont™ Corian® Quality Network'],
    cadAvailable: true
  }
];

export function getProductBySlug(slug: string): ProductItem | undefined {
  return productsData.find((p) => p.slug === slug);
}
