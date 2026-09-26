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
    tagline: 'Monolithic surfaces with seamless waterfalls and coved transitions',
    heroDescription:
      'Engineered for residential kitchens, luxury hospitality, and high-performance commercial reception counters. Ace Spaces solid surface benchtops feature inconspicuous chemically welded joints, mitred apron drop fronts, and continuous coved splashbacks that permanently eliminate silicone mould rims.',
    overview:
      'Unlike stone or laminate, solid surface benchtops can be joined on-site to create infinite continuous work surfaces with zero visible seams. Heat-formed waterfall ends flow gracefully to the floor, while thermo-welded joints provide an impervious, hygienic barrier against moisture and bacteria.',
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
      'Inconspicuous molecularly fused joints create seamless infinite lengths',
      'Coved splashback transitions permanently eliminate dirty silicone lines',
      'Mitred waterfall gable ends with continuous through-body veining',
      'Sub-surface steel and moisture-resistant substrate reinforcement',
      'Renewable surface — scratches and stains can be restored on-site'
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
      'ISO 846 Microbial Resistance Rating 0'
    ],
    cadAvailable: true
  },
  {
    slug: 'sinks',
    name: 'Integrated Sinks',
    categoryName: 'SINKS',
    code: 'PRD-SNK-02',
    tagline: 'Thermo-welded undermount basins with zero silicone grime joints',
    heroDescription:
      'Seamlessly integrated kitchen and utility sinks chemically bonded directly to solid surface benchtops. The absence of top-mount rims, silicone sealants, and grout lines ensures that food debris and water can be wiped directly into the bowl with effortless hygiene.',
    overview:
      'Fabricated from the same high-performance mineral acrylic composite as the surrounding worktop, Ace Spaces integrated sinks become one monolithic entity. Heat-resistant cast bottoms and gently curved internal corners prevent dirt accumulation, while thermal shock resistance withstands boiling liquids and daily culinary use.',
    image: '/images/images/app_residential_cirrus_white_1.jpg',
    galleryImages: [
      {
        src: '/images/images/app_residential_cirrus_white_1.jpg',
        alt: 'Under-mount integrated solid surface sink in Cirrus White',
        caption: 'Seamless sink-to-benchtop transition with precision drainage grooves.'
      },
      {
        src: '/images/images/app_residential_stonique_1.jpg',
        alt: 'Double bowl integrated sink installation in Stonique',
        caption: 'Twin-bowl kitchen preparation sink with integrated waste disposal collar.'
      }
    ],
    keyFeatures: [
      '100% silicone-free molecular fusion to solid surface benchtop',
      'No rim, lip, or ledge where grease, grime, or mould can foster',
      '10mm soft radius internal corners for effortless wipe-down cleaning',
      'Thermal shock resistant reinforced base prevents hot water warping',
      'Integrated runnel drainage grooves carved directly into the adjacent benchtop'
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
    tagline: 'Continuous sloped drainage planes for high-traffic public & commercial amenities',
    heroDescription:
      'Engineered for premium commercial amenities, corporate headquarters, airports, and luxury hospitality venues. Ace Spaces linear washplanes feature gentle sloping planes that guide water toward a concealed continuous trough drain, delivering a dramatic, minimalist aesthetic paired with high-volume capacity.',
    overview:
      'Traditional individual basins in commercial restrooms frequently trap water and cause puddling around faucets. Ace Spaces solid surface washplanes provide a clean, monolithic horizontal plane spanning up to 5 meters without joints. Designed for wall-mounted sensor taps and soap dispensers, they optimize flow rate, eliminate standing water, and reduce maintenance costs.',
    image: '/images/images/app_commercial_grinds_excavage.jpg',
    galleryImages: [
      {
        src: '/images/images/app_commercial_grinds_excavage.jpg',
        alt: 'Multi-station linear solid surface washplane in Excavage',
        caption: 'Triple-station continuous commercial washplane with integrated sensor faucets.'
      },
      {
        src: '/images/images/app_commercial_grinds_pebble_lane.jpg',
        alt: 'Single basin sloped washplane in Pebble Lane',
        caption: 'Wall-hung executive washplane with removable access tray for trap cleaning.'
      }
    ],
    keyFeatures: [
      'Continuous linear drainage trough eliminates standing water puddling',
      'Multi-station modules up to 5000mm length with completely invisible field seams',
      'Concealed heavy-duty steel cantilever support brackets',
      'Removable acoustic-dampened solid surface access plates for rapid plumbing maintenance',
      'Precision CNC cutouts for sensor tapware, soap dispensers, and waste chutes'
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
    tagline: 'Architectural bathroom vanities with seamlessly fused bowls',
    heroDescription:
      'Tailored for master bathrooms, boutique hotels, and guest powder suites. Ace Spaces basins and vanities feature seamlessly integrated solid surface washbowls welded directly to the vanity top, creating a monolithic, zero-grout sculpted fixture that resists makeup, cosmetics, and standing water.',
    overview:
      'From floating wall-hung cantilevered slabs with soft apron skirts to double-basin vanity suites with concealed tissue slots and integrated towel rails, our bathroom vanities unite horizontal countertop and vertical bowl into a fluid single piece. Scratches buff out easily, ensuring everlasting elegance.',
    image: '/images/images/app_residential_artista_mist_1.jpg',
    galleryImages: [
      {
        src: '/images/images/app_residential_artista_mist_1.jpg',
        alt: 'Monolithic wall-hung bathroom vanity with integrated basin in Artista Mist',
        caption: 'Bespoke floating vanity console with 120mm mitred apron and integrated coved basin.'
      },
      {
        src: '/images/images/app_residential_stonique_2.jpg',
        alt: 'Pure white floating vanity suite in Stonique',
        caption: 'Double basin vanity console with seamless drawer fronts and integrated finger-pulls.'
      }
    ],
    keyFeatures: [
      'Seamlessly fused bowl eliminates silicone caulking and black mould',
      'Wall-hung cantilever or joinery-mounted vanity configurations',
      'Available with soft oval, capsule, or crisp rectangular basin profiles',
      'Built-in accessory details: towel slots, recessed soap niches, waste chutes',
      'Stain-proof against cosmetic pigments, skincare oils, and hair dyes'
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
    tagline: 'Heavy-duty grooming counters, locker amenities & vandal-resistant washstations',
    heroDescription:
      'High-performance commercial washroom and End-of-Trip (EOT) grooming stations designed for active corporate lifestyle facilities, fitness clubs, and commercial property towers. Non-porous solid surface structures resist heavy daily impacts, moisture saturation, and graffiti.',
    overview:
      'Modern commercial developments compete on the quality of their End-of-Trip (EOT) commuter facilities. Ace Spaces provides turn-key vanity suites, grooming islands with built-in hair styling appliance holders, wireless charging points, and full-height wet wall linings that withstand heavy steam, damp towels, and intense multi-shift cleaning regimens.',
    image: '/images/images/app_commercial_terrazzo_laguna.jpg',
    galleryImages: [
      {
        src: '/images/images/app_commercial_terrazzo_laguna.jpg',
        alt: 'Corporate end-of-trip grooming counter with vanity mirror illumination in Terrazzo Laguna',
        caption: 'Executive EOT groom station featuring heat-resistant appliance cradles and coved edges.'
      },
      {
        src: '/images/images/app_commercial_grinds_stonique.jpg',
        alt: 'Heavy duty commercial washroom bank in Stonique',
        caption: 'Vandal-resistant solid surface vanity bank with under-counter service access panels.'
      }
    ],
    keyFeatures: [
      'Impact-resistant through-body solid surface that cannot delaminate or chip like stone',
      'Graffiti and chemical resistant — aerosol paint and markers buff off with Scotch-Brite',
      'Integrated amenities: heat-resistant hairdryer cradles, power pop-ups, waste slots',
      'Full-height non-porous wall cladding for high-steam shower locker zones',
      'Seamless joinery panels that prevent moisture swelling from wet bags and towels'
    ],
    specifications: [
      { label: 'Traffic Rating', value: 'Heavy commercial (500+ daily cycles)' },
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
    tagline: 'Infection-controlled scrub sinks, clinical counters & accessible DDA vanities',
    heroDescription:
      'Purpose-engineered for acute hospitals, medical surgeries, surgical suites, and aged-care residences. Solid surface is the premier clinical material specified globally for surgical scrub sinks, clean-utility benches, and wheelchair-accessible DDA vanities because it is 100% non-porous, inherently antimicrobial, and void of grout lines.',
    overview:
      'Healthcare infections frequently originate in micro-crevices around sink silicones and tile grout. Ace Spaces clinical fixtures eliminate these failure points with continuous coved radiuses, thermoformed anti-splash scrub troughs, and chemical resistance against harsh hospital cleansers including chlorine bleach, betadine, and isopropyl alcohol.',
    image: '/images/images/app_commercial_grinds_stonique.jpg',
    galleryImages: [
      {
        src: '/images/images/app_commercial_grinds_stonique.jpg',
        alt: 'Surgical scrub sink with coved splashback and anti-splash sloping front in Stonique',
        caption: 'Double-bay surgical scrub trough with zero-joint wall integration.'
      },
      {
        src: '/images/images/app_commercial_grinds_archeologic.jpg',
        alt: 'Accessible DDA compliant bathroom vanity in Archeologic',
        caption: 'Wheelchair-accessible front contour vanity with concealed protective pipe cover.'
      }
    ],
    keyFeatures: [
      'Zero porosity prevents harborage of MRSA, E. coli, COVID-19, and pathogens',
      'Antimicrobial through-body structure does not rely on transient chemical coatings',
      'Seamless 20mm coved internal corners prevent water pooling and bacterial colonies',
      'Chemical resistance against bleach, hydrogen peroxide, Betadine, and medical stains',
      'Wheelchair-accessible DDA/ADA compliant knee clearance profiles with soft ergonomic edges'
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
    tagline: '3D thermoformed organic volumes, fluid reception desks & illuminated retail fixtures',
    heroDescription:
      'Pushing the boundary between architectural joinery and sculptural artwork. Ace Spaces bespoke fabrication studio transforms 2D solid surface sheets into compound-curved organic desks, illuminated retail plinths, acoustic ceiling ribbons, and backlit interior monuments using 5-axis CNC machining and calibrated thermoforming.',
    overview:
      'Solid surface exhibits unique thermoplastic properties: when heated to 160°C in our computer-controlled platen ovens, it achieves the flexibility of leather and can be vacuum-formed over custom timber bucks down to tight 25mm radii without structural blanching. Once cooled, it returns to stone-like permanence.',
    image: '/images/images/coriansolidsurface-silverlinear-hospitality-application.jpg',
    galleryImages: [
      {
        src: '/images/images/coriansolidsurface-silverlinear-hospitality-application.jpg',
        alt: 'Compound curved solid surface cocktail bar with integrated mood lighting',
        caption: 'Dual-axis thermoformed bar counter with organic fluted texture and LED underglow.'
      },
      {
        src: '/images/images/coriansolidsurface-goldenonyx-application.jpg',
        alt: 'Sculptural illuminated reception desk monolith in Golden Onyx',
        caption: 'Monolithic illuminated reception desk with internal optical diffuser cavity.'
      }
    ],
    keyFeatures: [
      'Vacuum membrane thermoforming capable of complex double-curved 3D geometry',
      '5-Axis CNC milling delivering sub-millimetre tolerances for interlocking joints',
      'Internal structural steel and rib cage fabrication for massive architectural spans',
      'Sub-surface wireless charging pockets, recessed lighting grooves, and ventilation grilles',
      'Complete workshop mock-up, dry-assembly, and on-site crane/rigging installation'
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
    tagline: 'Complete technical advisory: CAD/BIM shop drawings, CNC toolpathing, and on-site templating',
    heroDescription:
      'Eliminating technical risk for architects, interior designers, and head contractors. Our Design Certainty Service provides end-to-end engineering support from initial concept sketches and digital 3D templating through to CNC nesting, structural framing certification, and guaranteed site fitment.',
    overview:
      'Complex solid surface architecture requires meticulous detailing. With our Design Certainty Service, our senior fabrication engineers partner with your design studio to draft submittal-ready CAD shop drawings, optimize sheet yield to reduce project costs, verify expansion joints and thermal movement, and conduct precision laser 3D scanning on site before fabrication begins.',
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
      'Submittal-ready architectural shop drawings with joinery section details',
      '3D CAD & BIM models (Revit, Rhino, SketchUp, STEP) ready for project integration',
      'On-site laser 3D scanning and digital templating to capture true wall plumb and level',
      'Structural substrate framing and expansion joint calculations',
      'Physical prototype mock-ups and custom finish sample coupons',
      '10-Year commercial product and fabrication warranty certification'
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
