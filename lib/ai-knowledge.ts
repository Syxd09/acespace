import { materials as defaultMaterials, Material } from '@/data/materials';
import { getSiteContent } from '@/data/contentStore';

/**
 * Ace Spaces & Coro Crafted Collective - Private Studio Material Intelligence
 * 
 * Strict Closed-Domain Knowledge Base & Private Grounded Response Engine.
 * Grounded exclusively in Ace Spaces website data, DuPont™ Corian® specifications,
 * Coro Crafted Collective spatial applications, workshop machinery, and sample services.
 * 
 * Enforces airtight guardrails: refuses general non-architectural / external web queries.
 */

export interface KnowledgeSection {
  id: string;
  topic: string;
  keywords: string[];
  summary: string;
  details: string;
  specs?: Record<string, string>;
  suggestedActions?: { label: string; href?: string; prompt?: string }[];
}

export const STUDIO_KNOWLEDGE_BASE: KnowledgeSection[] = [
  {
    id: 'pricing-sizing',
    topic: 'Full Sheet Sizing, Slab Dimensions & Commercial Pricing Matrix',
    keywords: [
      'price', 'pricing', 'cost', 'quote', 'rate', 'rates', 'how much', 'sqft', 'square foot',
      'per sq ft', 'slab cost', 'sheet price', 'sheet size', 'full sheet', 'dimensions',
      'slab dimensions', 'size', 'sizing', 'how big', 'approx price', 'approximate price',
      'sheet dimension', 'slab size'
    ],
    summary: 'Standard slab dimensions are 3660 mm × 760 mm (~30 sq. ft). Raw material ranges from ₹650 to ₹1,850/sq. ft; installed rates range from ₹1,100 to ₹2,850/sq. ft.',
    details: `Ace Spaces operates as the authorized master distributor and fabrication foundry for 100% authentic DuPont™ Corian® solid surfaces across India.

### 1. Standard Slab Dimensions & Thickness
• **Full Sheet Dimensions**: **3660 mm length × 760 mm width** (12.0 ft × 2.5 ft).
• **Surface Area per Sheet**: ~30 sq. ft (2.78 m²).
• **Standard Thickness (12 mm)**: Benchmark architectural gauge for kitchen countertops, bathroom vanities, wall cladding, and integrated sinks.
• **Structural Thickness (19 mm)**: Heavy-duty gauge for standalone commercial reception plinths, high-traffic thresholds, and cantilevered furniture (+35% to +45% premium).
• **Backlit Gauge (6 mm)**: Available in the Lumen Translucent series for illuminated columns and feature walls.

### 2. Commercial Pricing Breakdown by Collection (12 mm Standard)
• **Architectural Solids** (Stonique, Cirrus White, River Pearl, Whipped Cream, Linen, Natural Gray):
  - Raw Slab Material: **₹650 - ₹850 / sq. ft.** (~₹19,500 - ₹25,500 per full sheet)
  - Installed & Finished: **₹1,100 - ₹1,450 / sq. ft.**
• **Artista Series & Nuwood Heritage** (Artista Mist, Artista Sage, Artista Drift, Artista Mocha, Bleached Nuwood, Provence Nuwood):
  - Raw Slab Material: **₹750 - ₹950 / sq. ft.** (~₹22,500 - ₹28,500 per full sheet)
  - Installed & Finished: **₹1,250 - ₹1,600 / sq. ft.**
• **Architectural Veined** (Calacatta Greige, Travertine Roma, Travertine Firenze, Vasto Greige, Carrara Crema, Carrara Lino, Venaro White):
  - Raw Slab Material: **₹950 - ₹1,400 / sq. ft.** (~₹28,500 - ₹42,000 per full sheet)
  - Installed & Finished: **₹1,600 - ₹2,200 / sq. ft.** (includes precision vein alignment)
• **Aggregates, Terrazzo & Grinds** (Stonecrest Smoke, Excavage, Archeologic, Pebble Lane, Terrazzo Laguna, Terrazzo Peppered, Basalt Terrazzo):
  - Raw Slab Material: **₹1,100 - ₹1,650 / sq. ft.** (~₹33,000 - ₹49,500 per full sheet)
  - Installed & Finished: **₹1,800 - ₹2,500 / sq. ft.**
• **Onyx & Translucent Series** (Golden Onyx, Jade Onyx, White Onyx, Gray Onyx - Backlit Series):
  - Raw Slab Material: **₹1,250 - ₹1,850 / sq. ft.** (~₹37,500 - ₹55,500 per full sheet)
  - Installed & Finished: **₹2,100 - ₹2,850 / sq. ft.** (includes rear optical cavity framing)


### 3. Fabrication & Bespoke Feature Add-ons
• **Mitred Waterfall Edge Apron (40mm-100mm drop)**: ₹350 - ₹650 / linear ft.
• **Integrated Seamless Corian Sink / Vanity Basin**: ₹12,000 - ₹22,000 / bowl.
• **Thermoformed Curved Radii (down to 25mm R)**: ₹1,800 - ₹3,200 / sq. ft. of curved surface.

You can inspect technical data on our [Technical Specifications](/materials#specs) page, explore swatches in our [Material Library](/materials#library), or submit drawings via the [WhatsApp Studio Desk](https://wa.me/919741044776) for an itemized estimate.`,
    specs: {
      'Full Sheet Dimensions': '3660 mm × 760 mm (12.0 ft × 2.5 ft)',
      'Sheet Area Yield': '~30 sq. ft. / 2.78 m²',
      'Available Gauges': '12 mm (standard), 19 mm (heavy-duty), 6 mm (backlit)',
      'Price Range (Raw)': '₹650 to ₹1,850 / sq. ft.',
      'Price Range (Installed)': '₹1,100 to ₹2,850 / sq. ft.'
    },
    suggestedActions: [
      { label: 'View Material Library', href: '/materials#library' },
      { label: 'View Specifications', href: '/materials#specs' },
      { label: 'WhatsApp Studio Line', href: 'https://wa.me/919741044776' }
    ]
  },
  {
    id: 'company-identity',
    topic: 'Ace Spaces Identity & DuPont™ Partnership',
    keywords: [
      'ace spaces', 'who are you', 'company', 'what is ace spaces',
      'partner', 'authorized', 'distributor', 'bangalore', 'bengaluru', 'location', 'address'
    ],
    summary: 'Ace Spaces is the parent enterprise, authorized DuPont™ Corian® distributor, and master architectural fabrication hub in Bangalore, India.',
    details: `Ace Spaces operates from a state-of-the-art central fabrication facility and distribution stockyard in Bangalore, Karnataka. 

As an authorized DuPont™ Corian® partner and stockist, Ace Spaces supplies full-dimension certified raw slabs (3660mm × 760mm in 12mm & 19mm gauges), precision-cut CNC blanks, and bespoke thermoformed assemblies to leading architects, interior designers, and luxury millworkers across India.

Every slab is backed by genuine DuPont™ chemical composition certifications, Greenguard Gold indoor air quality compliance, NSF/ANSI 51 food contact safety, and an official 10-year manufacturer-backed installed product warranty.`,
    specs: {
      'Headquarters': 'Bangalore (Bengaluru), Karnataka, India',
      'Alliance Status': 'Authorized DuPont™ Corian® Distributor & Master Fabricator',
      'Service Reach': 'Pan-India Specifier Dispatch & Bespoke Installation',
      'Warranty': '10-Year Limited Installed Product Warranty (DuPont™)'
    },
    suggestedActions: [
      { label: 'Browse Materials', href: '/materials#library' },
      { label: 'DuPont Alliance Details', href: '/about#dupont' },
      { label: 'WhatsApp Studio Line', href: 'https://wa.me/919741044776' }
    ]
  },
  {
    id: 'coro-connection',
    topic: 'The Coro Connection & Ecosystem Synergy',
    keywords: [
      'coro', 'Coro Crafted Collective', 'what is coro', 'connection', 'relationship', 'parent company',
      'sister', 'furniture', 'spatial', 'collective', 'who owns coro'
    ],
    summary: 'Ace Spaces is the parent enterprise and exclusive raw material provider for Coro Crafted Collective.',
    details: `Ace Spaces stands as the foundational parent entity and raw material authority powering Coro Crafted Collective.

While Coro Crafted Collective conceives finished interior architecture, collectible furniture, and complete spatial concepts, every monolithic plane, thermoformed vanity, and sculpted curve is born from the raw DuPont™ Corian® and proprietary mineral substrates engineered and fabricated right here at Ace Spaces.

Key Synergy:
1. Raw Material Source: Ace Spaces maintains the continuous slab stock, tooling, and 5-axis CNC machining.
2. Spatial Design: Coro Crafted Collective applies these materials into signature spaces, retail flagships, and residential sanctuaries.
3. Architect Access: Independent architects and designers enjoy the exact same high-grade materials and fabrication precision used in Coro's celebrated spaces.`,
    specs: {
      'Parent Company': 'Ace Spaces',
      'Spatial Brand': 'Coro Crafted Collective',
      'Shared Facility': 'Bangalore CNC & Thermoforming Workshop',
      'Material Lineage': 'Authentic DuPont™ Corian® & Proprietary Mineral Blends'
    },
    suggestedActions: [
      { label: 'Learn About The Coro Synergy', href: '/about#coro' },
      { label: 'Explore Selected Projects', href: '/projects' }
    ]
  },
  {
    id: 'dupont-intro',
    topic: 'What is DuPont™ - The Company & Corian®',
    keywords: [
      'what is dupont', 'dupont company', 'who is dupont', 'about dupont', 'dupont history',
      'dupont brand', 'dupont science', 'tell me about dupont', 'dupont corporation',
      'what does dupont do', 'dupont corian', 'what is corian', 'who makes corian',
      'dupont', 'du pont'
    ],
    summary: 'DuPont™ is an American multinational science and technology company founded in 1802. Their Corian® brand is the world\'s leading solid surface material, exclusively distributed in India by Ace Spaces.',
    details: `**DuPont™ - The Company**

DuPont (officially E.I. du Pont de Nemours and Company) is an American multinational science and specialty materials corporation founded in **1802** in Wilmington, Delaware, USA. With over two centuries of materials innovation, DuPont is one of the world's largest and most respected science-driven companies, operating across sectors including:

• **Advanced Materials** - high-performance polymers, films, and specialty surfaces
• **Electronics & Interconnect** - semiconductor materials and circuit board solutions
• **Safety & Construction** - Kevlar®, Tyvek®, and architectural surface materials
• **Water & Industrial** - filtration and separation technologies

---

**DuPont™ Corian® - The Solid Surface Material**

In **1967**, DuPont scientists invented **Corian®**, the world's first solid surface material. It is engineered from:
- ~66% **Aluminium Trihydrate (ATH)** - a natural purified mineral derived from bauxite ore
- ~33% **High-purity acrylic polymer (PMMA)**
- Stable mineral pigments for through-body color consistency

Corian® is 100% crystalline-silica free, non-porous, renewable, and thermoformable - making it the world benchmark for hygienic, seamless architectural surfaces.

---

**DuPont™ & Ace Spaces**

Ace Spaces is the **authorized DuPont™ Corian® distributor and master fabrication foundry in India**, holding the genuine manufacturer alliance, complete certification chain, and full warranty coverage on every slab supplied.`,
    specs: {
      'Founded': '1802, Wilmington, Delaware, USA',
      'Headquarters': 'Wilmington, Delaware, USA (Global)',
      'Key Innovation': 'Corian® Solid Surface - invented 1967',
      'Corian® Composition': '~66% ATH mineral + ~33% PMMA acrylic polymer',
      'India Distributor': 'Ace Spaces - Authorized DuPont™ Corian® Partner',
      'Warranty': '10-Year Manufacturer Installed Product Warranty'
    },
    suggestedActions: [
      { label: 'View Corian® Materials', href: '/materials#library' },
      { label: 'DuPont Alliance at Ace Spaces', href: '/about#dupont' },
      { label: 'WhatsApp Studio Line', href: 'https://wa.me/919741044776' }
    ]
  },
  {
    id: 'corian-composition-safety',
    topic: 'DuPont™ Corian® Material Composition & Zero-Silica Safety',
    keywords: [
      'corian', 'material', 'composition', 'what is corian', 'silica', 'zero silica', 'safe',
      'health', 'toxic', 'ath', 'acrylic', 'bauxite', 'greenguard', 'nsf', 'food safe', 'hygiene'
    ],
    summary: 'DuPont™ Corian® combines natural bauxite minerals (ATH) with high-purity acrylic resin, delivering 100% zero-silica safety and non-porous hygiene.',
    details: `DuPont™ Corian® is the benchmark solid surface material invented and refined by DuPont™.

Composition:
- ~66% Aluminium Trihydrate (ATH), a purified natural mineral filler derived from bauxite ore.
- ~33% High-purity acrylic polymer (polymethyl methacrylate / PMMA).
- Pure color pigments for consistent through-body tint.

Key Health & Architectural Benefits:
1. 100% ZERO Crystalline Silica: Completely safe for craftsmen, stone fabricators, and building occupants. Zero silicosis risk unlike engineered quartz or natural granite.
2. Non-Porous & Monolithic: Zero voids, crevices, or grout lines. Bacteria, mold, viruses, and stains cannot penetrate the surface.
3. NSF/ANSI 51 Food Safe: Certified for direct commercial food preparation areas, butcheries, and kitchen counters.
4. Greenguard Gold: Certified for ultra-low chemical emissions, safe for schools and clinical medical facilities.
5. Renewable & Reparable: Minor scratches can be buffed out on-site with standard micro-abrasive pads without replacing the slab.`,
    specs: {
      'Silica Content': '0% Crystalline Silica (100% Silicosis-Free)',
      'Hygiene Rating': 'NSF/ANSI 51 Certified Food Equipment Material',
      'Air Quality': 'Greenguard Gold Certified (Ultra-Low VOC)',
      'Fire Rating': 'Class 1 / Class A (ASTM E84)',
      'Porosity': '0.0% Non-porous through-body'
    },
    suggestedActions: [
      { label: 'View Material Library', href: '/materials' },
      { label: 'Request Material Sample', href: '/materials' }
    ]
  },
  {
    id: 'fabrication-machinery',
    topic: 'Workshop Fabrication Craft, 5-Axis CNC & Thermoforming',
    keywords: [
      'fabrication', 'machinery', 'cnc', 'tolerance', 'thermoforming', 'curving', 'bending',
      'oven', 'vacuum', 'radius', 'joints', 'joining', 'seams', 'seamless', 'honing', 'finish',
      'edge', 'profiles', 'shark nose', 'chamfer', 'apron'
    ],
    summary: 'Sub-0.2mm 5-axis CNC routing, 160 deg C vacuum membrane thermoforming down to 25mm radii, and imperceptible thermo-welded joints.',
    details: `Our Bengaluru workshop pairs digital robotics with master artisanal joinery across 4 systematic stages:

01 / 5-Axis CNC & Precision Cutting:
- Sub-0.2mm tolerances with automated tool changers.
- Nested CAD/CAM routing for sink cutouts, cooktop drop-ins, and sub-surface wireless charging pockets.

02 / Seamless Inconspicuous Joining:
- Two-part chemically active acrylic adhesive color-matched to the exact sheet batch.
- Molecular chemical weld creates a continuous homogenous surface with zero dirt traps and invisible seams.

03 / Vacuum Membrane Thermoforming:
- Sheets heated uniformly to 160 deg C in industrial platen ovens.
- Vacuum pressed over CNC-machined timber tooling to achieve 2D and 3D fluid radii down to 25mm without surface blanching.

04 / Progressive Hand Honing:
- 5-stage wet and dry sanding graduating from 120-grit up to 600-grit micro-abrasives.
- Creates an ultra-tactile matte or satin finish with flawless light absorption.

Edge Profiles Available:
- Shark-nose chamfer (minimalist floating reveal)
- Mitred waterfall apron (40mm to 100mm drop)
- Pencil round (3mm / 6mm R)
- Seamless coved backsplash (10mm sanitary radius)`,
    specs: {
      'CNC Tolerance': '< 0.2 mm repeatability',
      'Min Thermoform Radius': '25 mm inside radius',
      'Forming Temperature': '160 deg C industrial platen oven',
      'Finishing Sequence': '120 to 600-grit hand-honed micro-abrasive',
      'Joint Performance': 'Chemically welded, non-porous, inconspicuous'
    },
    suggestedActions: [
      { label: 'Explore Fabrication Page', href: '/fabrication' },
      { label: 'Send Architectural CAD', href: 'https://wa.me/919741044776' }
    ]
  },
  {
    id: 'collections-colours',
    topic: 'Material Collections, Slabs & Color Palettes',
    keywords: [
      'colours', 'colors', 'collections', 'palette', 'swatch', 'calacatta greige', 'stonique', 'stonecrest',
      'golden onyx', 'cirrus white', 'artista', 'nuwood', 'terrazzo', 'excavage', 'translucent',
      'backlit', 'slabs', 'thickness', '12mm', '19mm', 'dimensions'
    ],
    summary: 'Curated architectural palettes across Architectural Solids, Architectural Veined, Artista Series, Terrazzo & Aggregates, and Onyx Translucent series.',
    details: `Ace Spaces curates genuine DuPont™ Corian® solid surfaces across 5 core architectural series:

1. Architectural Solids (Pure & Monolithic):
- Stonique (COR-ST03): Pure clinical chalk white with zero visible grain.
- Cirrus White (COR-CW08): Light-diffusing, ethereal soft white matrix.
- Whipped Cream (COR-WC43): Velvet warm white that absorbs glare.
- River Pearl (COR-RP42): Luminous pearlescent off-white with delicate mineral depth.
- Natural Gray (COR-NG41): Pure neutral architectural grey for quiet monolithic geometry.

2. Architectural Veined (Directional & Sculptural):
- Calacatta Greige (COR-CG01): Ethereal warm greige ribbons over a soft mineral canvas.
- Travertine Roma (COR-TR11) & Travertine Firenze (COR-TF12): Classical striated mineral currents.
- Carrara Crema (COR-CC21) & Carrara Lino (COR-CL22): Muted Carrara marble veining with organic movement.
- Venaro White (COR-VW44) & Windswept (COR-WS45): Micro-fine organic vein accents and sweeping currents.

3. Artista Series & Nuwood Heritage:
- Artista Mist (COR-AM04), Artista Sage (COR-AS05), Artista Drift (COR-AD06), Artista Mocha (COR-AM07).
- Bleached Nuwood (COR-BN09) & Provence Nuwood (COR-PN10): Natural architectural timber grain translated into non-porous solid surface.

4. Terrazzo, Aggregates & Grinds:
- Stonecrest Smoke (COR-SS02): Monolithic graphite mineral with micro-aggregate textures.
- Excavage (COR-EX17), Archeologic (COR-AR18), Pebble Lane (COR-PL19): Tactile geological excavations.
- Terrazzo Laguna (COR-TL14), Terrazzo Peppered (COR-TP15), Basalt Terrazzo (COR-BT16).

5. Onyx & Translucent Series (Backlit & Illuminating):
- Golden Onyx (COR-GO23), Jade Onyx (COR-JO24), White Onyx (COR-WO25), Gray Onyx (COR-GO26): Up to 38% light transmission. Glows warmly under concealed 2700K-3500K LED matrices.

Standard Slab Specs:
- Standard Dimensions: 3660 mm length × 760 mm width
- Standard Thicknesses: 12 mm (standard architectural) & 19 mm (heavy commercial plinths)`,
    specs: {
      'Standard Slab Dimensions': '3660 mm × 760 mm (12.0 ft × 2.5 ft)',
      'Available Gauges': '12 mm (primary), 19 mm (heavy-duty)',
      'Finishes': 'Ultra-Matte, Velvet Matte, Satin Smooth, Polished Honed',
      'Light Transmission': 'From 3% (solids) up to 38% (Onyx series)'
    },
    suggestedActions: [
      { label: 'View Colour Library', href: '/materials#library' },
      { label: 'Build Sample Tray', href: '/materials' }
    ]
  },
  {
    id: 'applications-spaces',
    topic: 'Architectural Applications: Kitchens, Bathrooms, Commercial & Healthcare',
    keywords: [
      'kitchen', 'bathroom', 'applications', 'island', 'countertop', 'sink', 'basin',
      'vanity', 'commercial', 'healthcare', 'hospital', 'clinic', 'retail', 'reception',
      'backlit wall', 'waterfall'
    ],
    summary: 'Monolithic kitchen waterfall islands, integrated Coro sinks, sanitary clinical counters, and luminous commercial facades.',
    details: `Solid surfaces provide unmatched versatility across interior typologies:

1. Residential Kitchens:
- Seamless 4+ meter monolithic waterfall islands with zero visible seams.
- Integrated undermount or coved sinks fabricated from matching slab material.
- Sanitary coved upstands that eliminate grime-collecting silicone joints.
- Heat tolerance: Use built-in stainless steel trivet rods or hot pads for hot pots/pans.

2. Luxury Bathrooms & Spas:
- Monolithic vanity tops with integrated Coro slot basins or thermoformed ramps.
- Full-height shower wet walls with seamless corners - no grout to discolour or harbour mildew.
- Warm to the touch compared to cold natural granite or marble.

3. Commercial, Retail & Hospitality:
- Fluid organic reception counters thermoformed into sculptural curves.
- Retail display pedestals with sharp shark-nose edges.
- Backlit bar fronts and feature walls using Lucent series.

4. Healthcare & Clinical Environments:
- Certified non-porous surfaces resistant to medical disinfectants, iodine, and surgical cleaners.
- Fully seamless installations meeting stringent infection-control standards.`,
    specs: {
      'Kitchen Joins': 'Inconspicuous, water-impervious, food-safe',
      'Bath Integration': 'Integrated basins with continuous drain slopes',
      'Clinical Compliance': 'No bacterial harbouring, chemical-resistant',
      'Lighting Synergy': 'Backlightable at 12mm thickness with diffuser cavity'
    },
    suggestedActions: [
      { label: 'Explore Kitchen Applications', href: '/applications/kitchen' },
      { label: 'Explore Bathroom Vanities', href: '/applications/bathroom' },
      { label: 'Explore Healthcare Surfaces', href: '/applications/healthcare' }
    ]
  },
  {
    id: 'sample-tray-dispatch',
    topic: 'Physical Specifier Sample Tray & Pan-India Dispatch',
    keywords: [
      'sample', 'samples', 'order sample', 'sample tray', 'box', 'specimen', 'swatches',
      'delivery', 'dispatch', 'courier', 'cost', 'free', 'how to get samples'
    ],
    summary: 'Order curated 100mm × 100mm physical material specimens delivered directly to design practices and residences across India.',
    details: `Ace Spaces offers a dedicated Specimen Sample Box service for architects, interior designers, and project owners.

How to Order Samples:
1. Browse our Materials or Colours library on the website.
2. Click "Add to Sample Tray" on any material card.
3. Open your Sample Tray (located in the top navigation bar).
4. Review your shortlist (up to 6 curated 100mm × 100mm × 12mm specimens).
5. Enter your delivery address and dispatch details.

Sample Box Contents:
- 100 × 100 × 12mm true-finish material tiles with machined edge profiles.
- Technical spec sheet detailing light reflectance (LRV), fire rating, and weight.
- Specifier booklet on jointing adhesives and thermoforming guidelines.
- Rapid courier dispatch from our Bangalore stockyard directly across India.`,
    specs: {
      'Sample Dimensions': '100 mm × 100 mm × 12 mm true thickness',
      'Shortlist Limit': 'Up to 6 specimens per curated box',
      'Dispatch Hub': 'Bangalore Central Stockyard',
      'Shipping Coverage': 'All major metros & design practices across India'
    },
    suggestedActions: [
      { label: 'Browse & Add Samples', href: '/materials' },
      { label: 'View Colour Swatches', href: '/materials#library' }
    ]
  },
  {
    id: 'projects-case-studies',
    topic: 'Selected Architectural Projects & Case Studies',
    keywords: [
      'projects', 'portfolio', 'case studies', 'glass villa', 'whitefield', 'koramangala',
      'indiranagar', 'mumbai', 'quiet arrival', 'residential', 'hospitality'
    ],
    summary: 'Benchmark monolithic installations in Bengaluru and Mumbai designed with Studio Vardhan, Atelier Kora, and Coro Crafted Collective.',
    details: `Ace Spaces has fabricated key benchmark projects across residential, hospitality, and commercial categories:

1. Private Residence - "A Quieter Kind of Luxury" (Bengaluru):
- Architect: Studio Vardhan Architects (2024, 420 sq.m).
- Material: Alto / Ivory Vein (12mm).
- Application: 4.2-meter monolithic kitchen island with 45 deg  mitred waterfall edges and continuous vertical backsplash grain.

2. Quiet Arrival - Hospitality Reception (Mumbai):
- Architect: Atelier Kora (2024, 650 sq.m).
- Material: Obsidian / Still.
- Application: Multi-radius thermoformed reception desk, backlit feature screen, and washroom vanities with concealed steel substructure.

3. The Glass Villa (Sadashivanagar, Bengaluru):
- Monolithic dual-basin bathroom vanities and coved master tub surround in Noma White Chalk.

4. Tech Pavilion (Indiranagar, Bengaluru):
- Fluid 8-meter organic reception counter with integrated concealed inductive charging and subtle LED perimeter reveals.`,
    specs: {
      'Island Record': '4200 mm continuous monolithic island with zero visible joints',
      'Curvature Record': 'Compound multi-radius thermoforming on concealed skeleton',
      'Locations': 'Bengaluru, Mumbai, Hyderabad, Chennai, New Delhi'
    },
    suggestedActions: [
      { label: 'View All Projects', href: '/projects' },
      { label: 'Submit Your Project Drawings', href: 'https://wa.me/919741044776' }
    ]
  },
  {
    id: 'care-and-maintenance',
    topic: 'Care, Maintenance, Cleaning & Renewable Surface Repair',
    keywords: [
      'care', 'maintenance', 'cleaning', 'clean', 'scratch', 'heat', 'stain', 'repair',
      'sand', 'scratches', 'detergent', 'turmeric', 'wine', 'chemicals'
    ],
    summary: 'Routine maintenance requires simple warm water and mild soap. Minor scratches can be renewed on-site with fine abrasives.',
    details: `DuPont™ Corian® and Ace Spaces mineral surfaces are engineered for lifelong durability and complete renewability.

Daily Cleaning:
- Wipe with a damp microfibre cloth and warm water or neutral household detergent.
- For stubborn spots (coffee, wine, turmeric), use a mild abrasive liquid cleanser (e.g. Cif or dishwashing soap) with a soft sponge in gentle circular motions.

Heat Best Practices:
- Always use a trivet with rubber feet or a heat-resistant pad under hot pots, fryers, and electric cooking appliances. Do not place scorching cookware directly on the surface.

Renewability & Scratch Repair:
- Unlike laminate, porcelain tile, or granite where a chip or scratch ruins the entire slab, solid surfaces have through-body color.
- Fine scratches can be buffed out using a Scotch-Brite™ pad with mild soapy water.
- Deep gouges can be filled with color-matched acrylic resin by our certified workshop craftsmen and sanded flush, restoring the surface to brand-new condition.`,
    specs: {
      'Porosity': '0.0% Non-porous (cannot absorb liquids or oils)',
      'Renewability': '100% through-body homogeneous repairable',
      'Daily Cleaners': 'Neutral detergent, water, microfibre cloth',
      'Abrasive Pad': 'Scotch-Brite™ pad in circular motion for light scuffs'
    },
    suggestedActions: [
      { label: 'Review Materials Care', href: '/materials' },
      { label: 'Speak with Workshop Specialist', href: 'https://wa.me/919741044776' }
    ]
  },
  {
    id: 'studio-contact-consultation',
    topic: 'Studio Location, Consultations & WhatsApp Line',
    keywords: [
      'contact', 'whatsapp', 'phone', 'call', 'consultation', 'book', 'visit',
      'showroom', 'factory', 'workshop', 'hours', 'timing', 'email', 'specifier'
    ],
    summary: 'Studio workshop in Bangalore, active Mon-Sat 09:30-18:30 IST. Direct WhatsApp available in the top navbar.',
    details: `Connect with our architectural advisory desk:

- Direct WhatsApp Specifier Line: Accessible directly from the top navigation bar or via +91 97410 44776.
- Central Workshop & Stockyard: Bangalore, Karnataka, India.
- Studio Desk Availability: Monday - Saturday, 09:30 - 18:30 IST (UTC+5:30).
- Consultation Booking: Schedule physical or virtual design consultations via our Contact page (/contact).
- CAD & Floor Plan Submission: Share AutoCAD .dwg, Rhino .3dm, or PDF drawings directly via WhatsApp or the contact form for rapid material take-offs and quotation.`,
    specs: {
      'WhatsApp Studio Line': '+91 97410 44776',
      'Studio Location': 'Bangalore (Bengaluru), Karnataka, India',
      'Operating Hours': 'Mon-Sat, 09:30-18:30 IST (UTC+5:30)',
      'Drawings Accepted': 'CAD .dwg, .dxf, .3dm, .skp, and dimensional PDFs'
    },
    suggestedActions: [
      { label: 'WhatsApp Studio Line', href: 'https://wa.me/919741044776' },
      { label: 'Book Showroom Consultation', href: '/contact' }
    ]
  },
  {
    id: 'coro-maps-location',
    topic: 'Coro Crafted Collective & Ace Spaces Studio Headquarters',
    keywords: [
      'map', 'maps', 'location', 'directions', 'where is coro', 'where is ace spaces',
      'address', 'showroom', 'visit', 'studio address', 'navigation', 'google maps',
      'where are you', 'how to reach', 'headquarters', 'studio', 'bengaluru'
    ],
    summary: 'Coro Crafted Collective & Ace Spaces share one single unified studio headquarters in Bengaluru, Karnataka. Direct Google Maps navigation: https://maps.app.goo.gl/eNFxtR7WPqRS8gpd7',
    details: `Architects, interior designers, and project owners are welcome to experience our monolithic material volumes, full slab catalog, and spatial installations at our studio:

📍 **Coro Crafted Collective & Ace Spaces Studio Headquarters:**
Bengaluru, Karnataka, India.
*(This is our single, unified studio headquarters for both Ace Spaces and Coro Crafted Collective)*
*Hours: Monday - Saturday, 09:30 - 18:30 IST (Sundays by appointment).*

🗺️ **Direct Google Maps Navigation:**
[Open Studio Headquarters on Google Maps ↗](https://maps.app.goo.gl/eNFxtR7WPqRS8gpd7)

Here under one roof, you can:
• Examine our complete DuPont™ Corian® slab catalog across Noma, Alto, Strata, Terra, and Lumen series.
• Experience 1:1 scale monolithic kitchen waterfall islands, thermoformed vanities, and seamless basins.
• Curate and collect physical 100mm × 100mm × 12mm specifier sample boxes.
• Consult with our fabrication engineers on CAD drawings, CNC nested cuts, and thermoforming tooling.

You can book an architectural walkthrough on our [Contact Page](/contact), explore our [Fabrication Capabilities](/fabrication), or message our specifier desk directly via the [WhatsApp Studio Desk](https://wa.me/919741044776).`,
    specs: {
      'Studio & Headquarters': 'Coro Crafted Collective & Ace Spaces, Bengaluru',
      'Scope': 'Single unified studio & headquarters for both Ace Spaces and Coro Crafted Collective',
      'Google Maps Link': 'https://maps.app.goo.gl/eNFxtR7WPqRS8gpd7',
      'Operating Hours': 'Monday - Saturday, 09:30 - 18:30 IST'
    },
    suggestedActions: [
      { label: 'Open Studio on Google Maps ↗', href: 'https://maps.app.goo.gl/eNFxtR7WPqRS8gpd7' },
      { label: 'Book Studio Visit', href: '/contact' },
      { label: 'WhatsApp Specifier Desk', href: 'https://wa.me/919741044776' }
    ]
  },
  {
    id: 'founders-leadership',
    topic: 'Founders & Leadership: Vithal Savant & Prashant Vinayak Naik',
    keywords: [
      'founder', 'founders', 'who started', 'who founded', 'owner', 'leadership', 'vithal',
      'vithal savant', 'prashant', 'prashant naik', 'prashant vinayak naik', 'director',
      'team', 'management', 'story', 'history', 'partners', 'partner'
    ],
    summary: 'Founded in Bengaluru by Vithal Savant and Prashant Vinayak Naik with the manifesto: "From material to masterpiece — we engineer possibilities into form."',
    details: `**From material to masterpiece — we engineer possibilities into form.**

At Ace Spaces, we bring together premium solid-surface materials, precision engineering, and bespoke fabrication to transform ambitious ideas into exceptional spaces. Every detail is considered. Every dimension matters. Every creation is built around your vision.

Ace Spaces and Coro Crafted Collective were co-founded in Bengaluru by two partners with a unified vision: to disrupt brittle, silica-hazardous stone processing and establish a master foundry for monolithic, non-porous mineral architecture.

**Founding Partners & Leadership:**
• **Vithal Savant** - Co-Founder & Director:
  - Spearheads Ace Spaces' strategic partnerships, distribution alliances, and business development across India.
  - Architected the authorized distribution alliance with DuPont™ Corian® across India.
  - Oversees the material supply chain, stockyard operations, and pan-India specifier dispatch network.

• **Prashant Vinayak Naik** - Co-Founder & Director:
  - Leads Ace Spaces' digital manufacturing infrastructure, 5-axis CNC routing systems (<0.2mm tolerance), and industrial vacuum thermoforming technology.
  - Directs raw material research into zero-silica mineral matrices and proprietary resin formulations.
  - Oversees fabrication quality, bespoke installation projects, and the Coro Crafted Collective spatial design wing.

Together, they established **Ace Spaces** as the foundational raw material authority and **Coro Crafted Collective** as the spatial design wing - manifesting what is possible when advanced mineral surfaces are shaped into bespoke private residences, hotel atriums, and collectible furniture.`,
    specs: {
      'Co-Founder & Director': 'Vithal Savant',
      'Co-Founder & Director (2)': 'Prashant Vinayak Naik',
      'Founding Partners': 'Vithal Savant & Prashant Vinayak Naik',
      'Origin City': 'Bengaluru, Karnataka, India',
      'Manifesto': 'From material to masterpiece — we engineer possibilities into form.',
      'Mission': 'Engineering possibilities into form: Premium materials, precision engineering & bespoke fabrication.'
    },
    suggestedActions: [
      { label: 'Learn About Ace Spaces', href: '/about' },
      { label: 'The Coro Synergy', href: '/about#coro' },
      { label: 'Browse Materials', href: '/materials' }
    ]
  },
  {
    id: 'material-advisory-better-suggestions',
    topic: 'Material Advisory & Comparative Guidance (Marble vs Quartz vs Corian)',
    keywords: [
      'compare', 'comparison', 'versus', 'vs', 'marble', 'quartz', 'granite', 'laminate',
      'better material', 'suggest better', 'recommendation', 'pros and cons', 'stain', 'scratch'
    ],
    summary: 'Active comparative intelligence explaining why DuPont™ Corian® outperforms natural stone and quartz, with tailored material recommendations.',
    details: `When specifying interior surfaces, material chemistry dictates longevity:

**Critical Comparisons:**
1. **Corian® Solid Surface vs Natural Italian Marble:**
   • *The Marble Problem*: Highly porous. Acidic liquids (lemon juice, vinegar, wine) cause irreversible chemical etching, while Indian cooking spices (turmeric, oils) cause deep permanent yellowing. Joints cannot be hidden.
   • *The Corian® Advantage*: 0.0% non-porous through-body. Liquids never penetrate. Stains wipe off with soapy water, and 4m+ islands appear 100% seamless without joint lines.

2. **Corian® Solid Surface vs Engineered Quartz:**
   • *The Quartz Hazard*: Contains up to 90% crystalline silica. Cutting it releases deadly airborne silica dust (silicosis hazard). Quartz CANNOT be thermoformed into organic curves and shows dark, noticeable joint lines.
   • *The Corian® Advantage*: 100% Zero-Silica safe. Can be thermoformed into compound curves down to 25mm radii at 160 deg C and joined with invisible color-matched molecular welds.

**Proactive Material Suggestions by Use Case:**
• *Heavy Kitchen Islands*: Instead of cold, stain-prone marble, specify **Alto / Ivory Vein (AC-0201)** or **Noma / Linen (AC-0102)** in 12mm with a 50mm mitred apron and integrated coved sink.
• *High-Traffic Commercial Plinths*: Specify **19mm heavy-duty gauge** rather than 12mm.
• *Wellness Centers & Bar Countertops*: Specify the **Lucent Translucent series (Opal Lumina)** with 38% light transmission over standard opaque slabs for ambient glow.
• *Integrated Bathrooms*: Form an **integrated Coro sloping ramp basin** from the same slab to eliminate moldy silicone joints.`,
    specs: {
      'Porosity Comparison': 'Corian (0.0% non-porous) vs Marble (0.2-0.6% porous)',
      'Silica Safety': 'Corian (0% Silicosis-Free) vs Quartz (up to 90% Crystalline Silica)',
      'Thermoforming': 'Corian (25mm min radius) vs Quartz/Granite (Cannot be bent)',
      'Joint Visibility': 'Corian (Inconspicuous/Invisible) vs Stone (1-2mm visible seams)'
    },
    suggestedActions: [
      { label: 'Explore Noma & Alto Series', href: '/materials' },
      { label: 'Order Curated Sample Tray', href: '/materials' },
      { label: 'WhatsApp Consultation', href: 'https://wa.me/919741044776' }
    ]
  }
];

// Strict Out-of-Domain Guardrail Fallback
export const GUARDRAIL_DECLINE_MESSAGE = `I am Ace Spaces' private material intelligence assistant, exclusively dedicated to advising on DuPont™ Corian®, Coro architectural surfaces, bespoke fabrication, and studio specifications. 

Because I am a secure, private studio bot, I do not search the public internet or answer unrelated general inquiries (such as world news, politics, entertainment, coding, or unrelated brands).

Please feel free to ask me anything about:
• Ace Spaces & Coro Crafted Collective synergy
• DuPont™ Corian® composition & zero-silica safety
• Slab dimensions, colors & translucent backlit series
• 5-Axis CNC tolerances, seamless joining & thermoforming
• Kitchen islands, integrated sinks & vanity applications
• Ordering physical specifier sample boxes across India
• Studio consultations & the WhatsApp line in our navbar`;

function matchesPhrase(text: string, phrase: string): boolean {
  const escaped = phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`(^|[^a-zA-Z0-9])${escaped}([^a-zA-Z0-9]|$)`, 'i').test(text);
}

/**
 * Dynamically retrieves live materials present on the website.
 * Pulls from contentStore (which reflects custom-content.json / CMS edits),
 * falling back to defaultMaterials. This ensures the AI instantly knows newly added materials.
 */
export function getLiveMaterials(): Material[] {
  try {
    const content = getSiteContent();
    if (content?.materials && Array.isArray(content.materials) && content.materials.length > 0) {
      return content.materials;
    }
  } catch (err) {
    console.warn('Error reading dynamic live materials in AI knowledge base, using default catalog:', err);
  }
  return defaultMaterials;
}

/**
 * Helper to look up a specific material from the live catalog based on user query
 */
export function findMatchingMaterial(query: string, currentMaterials?: Material[]): Material | null {
  const q = query.toLowerCase().trim();
  if (!q) return null;

  const liveMats = currentMaterials || getLiveMaterials();

  // 1. Check exact or stripped material code (e.g. COR-CG01, CG01, COR-AS05, AS05, COR-VW64, VW64)
  const qAlphanumeric = q.replace(/[^a-z0-9]/g, '');
  for (const mat of liveMats) {
    const codeClean = mat.code.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (codeClean.length >= 4 && (qAlphanumeric.includes(codeClean) || q.includes(mat.code.toLowerCase()))) {
      return mat;
    }
    // Also check short suffix like CG01, AS05, VW64
    const shortCode = codeClean.replace(/^cor/, '');
    if (shortCode.length >= 4 && qAlphanumeric.includes(shortCode)) {
      return mat;
    }
  }

  // 2. Check full material specific name and slug
  for (const mat of liveMats) {
    const matNameLower = mat.name.toLowerCase();
    if (matchesPhrase(q, matNameLower)) {
      return mat;
    }
    if (q.includes(mat.slug)) {
      return mat;
    }
    // If name contains slash (e.g. "Collection / Name"), check specific name part
    if (mat.name.includes('/')) {
      const specificName = mat.name.split('/')[1]?.trim().toLowerCase();
      if (specificName && specificName.length >= 4 && matchesPhrase(q, specificName)) {
        return mat;
      }
    }
  }

  // 3. Check distinctive multi-word or single-word titles
  for (const mat of liveMats) {
    const nameLower = mat.name.toLowerCase();
    // Words of length >= 4 that are unique identifiers
    const words = nameLower.split(/\s+/).filter(w => w.length >= 5 && !['white', 'black', 'cream', 'solid', 'matte', 'stone', 'clear'].includes(w));
    for (const w of words) {
      if (matchesPhrase(q, w)) {
        return mat;
      }
    }
  }

  return null;
}

export interface NonStockDetection {
  detectedTerm: string;
  category: 'natural-marble' | 'engineered-quartz' | 'granite' | 'ceramic-sintered' | 'unlisted-material';
  reason: string;
  suggestedAlternative: Material;
}

/**
 * Detects whether the user is inquiring about an external / non-stock material
 * (such as Italian marble, quartz, granite, ceramic tiles, or unlisted colors).
 */
export function detectNonStockMaterial(query: string, currentMaterials?: Material[]): NonStockDetection | null {
  const q = query.toLowerCase().trim();
  const liveMats = currentMaterials || getLiveMaterials();

  // Helper to safely get an alternative from live catalog
  const getAlternative = (slug: string, fallbackIdx = 0): Material => {
    return liveMats.find(m => m.slug === slug) || liveMats[fallbackIdx] || defaultMaterials[0];
  };

  // 1. Natural Marble inquiries (Italian Marble, Carrara Marble, Statuario, Calacatta Marble)
  const isMarbleQuery = /\b(marble|italian marble|carrara marble|statuario|calacatta marble|botticino|makrana|natural marble|real marble)\b/i.test(q);
  // Ensure user is not asking for an in-stock solid surface with "carrara" or "calacatta" in its name
  const matchesInStockVeined = /\b(calacatta greige|carrara crema|carrara lino)\b/i.test(q);

  if (isMarbleQuery && !matchesInStockVeined) {
    const matchedTerm = q.match(/\b(italian marble|carrara marble|statuario|calacatta marble|botticino|makrana|natural marble|real marble|marble)\b/i)?.[0] || 'Natural Marble';
    return {
      detectedTerm: matchedTerm.toUpperCase(),
      category: 'natural-marble',
      reason: `Natural marble is porous (0.2%-0.6% water absorption). Acidic liquids (citrus, vinegar, wine) cause irreversible chemical etching, while Indian spices (turmeric, cooking oils) penetrate deeply and permanently stain. Furthermore, natural marble requires visible, dirt-trapping grout joints and cannot be thermoformed into monolithic curves.`,
      suggestedAlternative: getAlternative('calacatta-greige', 0),
    };
  }

  // 2. Engineered Quartz inquiries (Silestone, Caesarstone, Cambria, Kalinga Stone)
  const isQuartzQuery = /\b(quartz|silestone|caesarstone|cambria|kalinga stone|engineered quartz)\b/i.test(q);
  if (isQuartzQuery) {
    const matchedTerm = q.match(/\b(silestone|caesarstone|cambria|kalinga stone|engineered quartz|quartz)\b/i)?.[0] || 'Engineered Quartz';
    return {
      detectedTerm: matchedTerm.toUpperCase(),
      category: 'engineered-quartz',
      reason: `Engineered quartz contains up to 90% crystalline silica. Cutting, polishing, and fabricating quartz generates dangerous respirable crystalline silica (RCS) dust that causes irreversible silicosis. In addition, quartz CANNOT be vacuum thermoformed into fluid curves and leaves visible, dark resin joint lines.`,
      suggestedAlternative: getAlternative('stonique', 2),
    };
  }

  // 3. Natural Granite inquiries
  const isGraniteQuery = /\b(granite|black galaxy|natural granite)\b/i.test(q);
  if (isGraniteQuery) {
    const matchedTerm = q.match(/\b(black galaxy|natural granite|granite)\b/i)?.[0] || 'Natural Granite';
    return {
      detectedTerm: matchedTerm.toUpperCase(),
      category: 'granite',
      reason: `Natural granite is extremely heavy, rigid, cold to the touch, and micro-fissured, requiring frequent chemical sealing. It cannot be joined seamlessly without visible dirt lines, cannot be thermoformed, and is not certified for cleanroom non-porous hygiene.`,
      suggestedAlternative: getAlternative('stonecrest-smoke', 1),
    };
  }

  // 4. Sintered Stone / Ceramic / Porcelain inquiries
  const isCeramicQuery = /\b(dekton|neolith|laminam|porcelain slab|ceramic tiles|vitrified tiles|ceramic countertop)\b/i.test(q);
  if (isCeramicQuery) {
    const matchedTerm = q.match(/\b(dekton|neolith|laminam|porcelain slab|ceramic tiles|vitrified tiles|ceramic countertop)\b/i)?.[0] || 'Sintered Stone / Ceramic';
    return {
      detectedTerm: matchedTerm.toUpperCase(),
      category: 'ceramic-sintered',
      reason: `Sintered stone and porcelain slabs are brittle under tension, prone to edge chipping, cannot be thermoformed into organic radii, and cannot be renewed or repaired on-site if damaged.`,
      suggestedAlternative: getAlternative('calacatta-greige', 0),
    };
  }

  // 5. Explicit "in stock" query for a specific unlisted material not in the catalog
  // Exclude general inventory/count queries like "how many materials are in stock", "what materials do you have"
  const isGeneralInventoryQuestion = /\b(how many|what materials|which materials|list|all materials|show materials|total materials|how many material|count of material)\b/i.test(q);
  const isAskingStockStatus = /\b(in stock|available in stock|do you have|stock of ace spaces)\b/i.test(q);
  if (isAskingStockStatus && !isGeneralInventoryQuestion && !findMatchingMaterial(q, liveMats)) {
    // Extract the noun if possible
    return {
      detectedTerm: 'The requested external surface / color',
      category: 'unlisted-material',
      reason: `This specific material or unlisted color is not part of Ace Spaces' certified 100% zero-silica solid surface inventory. Ace Spaces maintains verified stock exclusively for the materials listed in our live catalog.`,
      suggestedAlternative: liveMats[0] || defaultMaterials[0],
    };
  }

  return null;
}

export interface MaterialPricingInfo {
  rawSqFt: string;
  rawSheet: string;
  installedSqFt: string;
  gauge19mm: string;
  fabricationNotes: string[];
}

export function getMaterialPricing(material: Material): MaterialPricingInfo {
  const col = material.collection.toLowerCase();

  if (col.includes('solid')) {
    return {
      rawSqFt: '₹650 - ₹850 / sq. ft.',
      rawSheet: '₹19,500 - ₹25,500 per full 12mm sheet (~30 sq. ft)',
      installedSqFt: '₹1,100 - ₹1,450 / sq. ft. (including CNC routing, seamless joins & 5-stage hand honing)',
      gauge19mm: '+35% surcharge (~₹880 - ₹1,150 / sq. ft. raw)',
      fabricationNotes: [
        'Mitred waterfall edge apron (40-100mm drop): ₹350 - ₹550 / lin. ft.',
        'Seamless integrated Corian kitchen/vanity sink: ₹12,000 - ₹18,000 / bowl',
        'Standard 3660 × 760 mm slab yield: ~30 sq. ft. (2.78 m²)',
      ],
    };
  }

  if (col.includes('veined') || col.includes('prima')) {
    return {
      rawSqFt: '₹950 - ₹1,400 / sq. ft.',
      rawSheet: '₹28,500 - ₹42,000 per full 12mm sheet (~30 sq. ft)',
      installedSqFt: '₹1,600 - ₹2,200 / sq. ft. (includes continuous vein-matching & molecular weld joints)',
      gauge19mm: '+35% surcharge (~₹1,280 - ₹1,890 / sq. ft. raw)',
      fabricationNotes: [
        'Mitred waterfall apron with continuous vein drop: ₹450 - ₹650 / lin. ft.',
        'Seamless integrated vanity slot-basin: ₹14,000 - ₹22,000 / bowl',
        'Standard 3660 × 760 mm slab yield: ~30 sq. ft. (2.78 m²)',
      ],
    };
  }

  if (col.includes('aggregate') || col.includes('terrazzo') || col.includes('grinds') || col.includes('concrete')) {
    return {
      rawSqFt: '₹1,100 - ₹1,650 / sq. ft.',
      rawSheet: '₹33,000 - ₹49,500 per full 12mm sheet (~30 sq. ft)',
      installedSqFt: '₹1,800 - ₹2,500 / sq. ft. (diamond CNC routing & micro-honed finish)',
      gauge19mm: '+40% surcharge (~₹1,540 - ₹2,310 / sq. ft. raw)',
      fabricationNotes: [
        'Heavy-duty commercial plinth edge: ₹400 - ₹600 / lin. ft.',
        'Seamless integrated dark aggregate basin: ₹16,000 - ₹24,000 / bowl',
        'Standard 3660 × 760 mm slab yield: ~30 sq. ft. (2.78 m²)',
      ],
    };
  }

  if (col.includes('artista') || col.includes('nuwood') || col.includes('botanical')) {
    return {
      rawSqFt: '₹750 - ₹950 / sq. ft.',
      rawSheet: '₹22,500 - ₹28,500 per full 12mm sheet (~30 sq. ft)',
      installedSqFt: '₹1,250 - ₹1,600 / sq. ft. (architectural velvet-matte finish)',
      gauge19mm: '+35% surcharge (~₹1,010 - ₹1,280 / sq. ft. raw)',
      fabricationNotes: [
        'Mitred edge detail (40-80mm): ₹350 - ₹500 / lin. ft.',
        'Custom coved sanitary splashback: ₹300 - ₹450 / lin. ft.',
        'Standard 3660 × 760 mm slab yield: ~30 sq. ft. (2.78 m²)',
      ],
    };
  }

  // Onyx & Translucent / Crystalline
  return {
    rawSqFt: '₹1,250 - ₹1,850 / sq. ft. (12mm) | ₹900 - ₹1,350 / sq. ft. (6mm Backlit)',
    rawSheet: '₹37,500 - ₹55,500 per full 12mm sheet (~30 sq. ft) | ₹27,000 - ₹40,500 (6mm sheet)',
    installedSqFt: '₹2,100 - ₹2,850 / sq. ft. (including rear light-diffuser cavity framing)',
    gauge19mm: 'Special order on request',
    fabricationNotes: [
      'Translucent invisible adhesive weld (zero shadow seams)',
      'Recommended LED cavity depth: 75-120mm with 2700K-3500K LED matrix',
      'Standard 3660 × 760 mm slab yield: ~30 sq. ft. (2.78 m²)',
    ],
  };
}

/**
 * Formats a comprehensive, all-inclusive architectural specification for an in-stock material.
 * Fulfills the requirement to explain EVERYTHING about the material,
 * and explicitly declares that it is present in the stock of Ace Spaces.
 */
export function formatFullMaterialExplanation(mat: Material, pricing: MaterialPricingInfo): string {
  let doc = `### ${mat.name} (${mat.code}) - Architectural Specification\n\n`;
  doc += `**Stock Status**: ✅ **Present in Stock at Ace Spaces**\n`;
  doc += `*Available at Ace Spaces Bengaluru stockyard for immediate full-sheet supply, 5-axis CNC digital routing, vacuum thermoforming, and physical sample tray dispatch.*\n\n`;
  doc += `${mat.description}\n\n`;

  doc += `#### 1. Material Identity & Aesthetic Nuance\n`;
  doc += `• **Official Material Name**: ${mat.name}\n`;
  doc += `• **Specification Code**: \`${mat.code}\`\n`;
  doc += `• **Collection**: ${mat.collection}\n`;
  doc += `• **Color Classification**: ${mat.colorFamily.toUpperCase()} - *${mat.colour}*\n`;
  doc += `• **Hex Color Reference**: \`${mat.hexColor}\`\n`;
  doc += `• **Pattern & Matrix**: ${mat.pattern} (${mat.type})\n`;
  doc += `• **Surface Finish**: ${mat.finish}\n`;
  doc += `• **Light Transmission**: ${mat.lightTransmission}\n\n`;

  doc += `#### 2. Physical Dimensions & Slab Yield\n`;
  doc += `• **Standard Slab Dimensions**: **${mat.dimensions}** (12.0 ft × 2.5 ft)\n`;
  doc += `• **Surface Area Yield**: **~30 sq. ft (2.78 m²)** per full sheet\n`;
  doc += `• **Available Thickness Gauges**: **${mat.thicknessOptions.join(', ')}**\n`;
  doc += `  - **12 mm**: Standard architectural benchmark for kitchen countertops, monolithic waterfall islands, vanity tops, and vertical wall cladding.\n`;
  if (mat.thicknessOptions.includes('19mm')) {
    doc += `  - **19 mm**: Heavy-duty structural gauge for freestanding reception plinths, cantilevered dining tables, and high-traffic thresholds.\n`;
  }
  if (mat.thicknessOptions.includes('6mm') || mat.lightTransmission.toLowerCase().includes('high') || mat.lightTransmission.toLowerCase().includes('medium')) {
    doc += `  - **6 mm**: Backlit gauge engineered for illuminated vertical screens, bar counters, and diffuse lighting columns.\n`;
  }
  doc += `\n`;

  doc += `#### 3. Composition & 100% Zero-Silica Health Safety\n`;
  doc += `• **Chemical Composition**: ~66% Aluminium Trihydrate (ATH) natural mineral matrix refined from bauxite ore, blended with ~33% high-purity acrylic polymer (PMMA) and stable mineral pigments.\n`;
  doc += `• **100% Zero Crystalline Silica**: 0.0% respirable crystalline silica (RCS). Completely silicosis-safe for craftsmen, stone fabricators, and residents.\n`;
  doc += `• **Hygienic Non-Porous Integrity**: Solid through-body composition with zero microscopic fissures or pores. Liquids, oils, mold, and bacteria cannot penetrate.\n`;
  doc += `• **Environmental & Food Contact Certifications**:\n`;
  doc += `  - **Greenguard Gold Certified**: Ultra-low chemical emissions (VOC), safe for schools, pediatric care, and residential bedrooms.\n`;
  doc += `  - **NSF/ANSI 51 Food Zone Certified**: Completely safe for direct commercial food preparation.\n`;
  doc += `  - **Fire Rating**: **${mat.fireRating}** (Class 1 / Class A flame spread).\n\n`;

  doc += `#### 4. Commercial Pricing & Investment Matrix\n`;
  doc += `• **Raw Slab Material Supply**: **${pricing.rawSqFt}** (${pricing.rawSheet})\n`;
  doc += `• **Fabricated & Installed Rate**: **${pricing.installedSqFt}**\n`;
  doc += `• **19mm Heavy Gauge Surcharge**: ${pricing.gauge19mm}\n\n`;

  doc += `#### 5. Workshop Fabrication Craft & Detailing Add-ons\n`;
  doc += `• **5-Axis CNC Milling**: Tolerances under 0.2mm for flush undermount sinks, drainage runnels, and wireless charging recesses.\n`;
  doc += `• **Inconspicuous Molecular Welds**: Two-part color-matched acrylic adhesive creates continuous, jointless planes with zero dirt traps.\n`;
  doc += `• **Vacuum Thermoforming**: Can be heated to 160 deg C and vacuum-formed over custom timber bucks down to a tight 25mm radius without blanching.\n`;
  for (const note of pricing.fabricationNotes) {
    doc += `• ${note}\n`;
  }
  doc += `\n`;

  doc += `#### 6. Recommended Architectural Applications\n`;
  for (const app of mat.applications) {
    doc += `• ${app}\n`;
  }
  doc += `\n`;

  doc += `#### 7. Care, Maintenance & 10-Year DuPont™ Warranty\n`;
  doc += `• **Care Guide**: ${mat.careGuide}\n`;
  doc += `• **Stain Immunity**: Wine, turmeric, coffee, and vinegar wipe clean with water and mild detergent.\n`;
  doc += `• **Renewable Surface**: 100% homogeneous through-body color. Any minor surface scuffs can be renewed on-site with fine micro-abrasive pads without slab replacement.\n`;
  doc += `• **Warranty**: Covered by official 10-Year Manufacturer Installed Product Warranty.\n\n`;

  doc += `Explore this surface in our [Material Library](/materials#library), review engineering specifications on [Technical Specifications](/materials#specs), or share your CAD drawings via our [WhatsApp Studio Desk](https://wa.me/919741044776) for an itemized estimate.`;

  return doc.trim();
}

/**
 * Formats an explanation when user asks about an external material NOT in stock at Ace Spaces,
 * and recommends the closest in-stock alternative.
 */
export function formatNonStockExplanation(detected: NonStockDetection, pricing: MaterialPricingInfo): string {
  let doc = `### Stock Status: ❌ NOT Present in Stock at Ace Spaces\n\n`;
  doc += `**Material Inquired**: **${detected.detectedTerm}**\n`;
  doc += `**Stock Availability**: **Not present in the stock of Ace Spaces.**\n\n`;
  doc += `Ace Spaces operates exclusively as a master solid surface fabricator and authorized DuPont™ Corian® partner. We do not stock or supply ${detected.detectedTerm.toLowerCase()}.\n\n`;

  doc += `**Why This Material Is Not Stocked at Ace Spaces:**\n`;
  doc += `${detected.reason}\n\n`;

  doc += `---\n\n`;
  doc += `### Recommended In-Stock Alternative: ✅ Present in Stock at Ace Spaces\n\n`;
  doc += `To achieve this aesthetic with **100% zero-silica safety**, zero porosity, and seamless joining, Ace Spaces maintains in-stock inventory of:\n\n`;

  const alt = detected.suggestedAlternative;
  doc += formatFullMaterialExplanation(alt, pricing);

  return doc;
}

/**
 * Formats a categorized overview of ALL materials currently in stock at Ace Spaces.
 */
export function formatCatalogStockInventory(liveMats?: Material[]): string {
  const materialsList = liveMats || getLiveMaterials();
  const count = materialsList.length;

  // Group by collection
  const collections: Record<string, Material[]> = {};
  for (const m of materialsList) {
    if (!collections[m.collection]) {
      collections[m.collection] = [];
    }
    collections[m.collection].push(m);
  }

  let doc = `### Ace Spaces Live In-Stock Materials Inventory (${count} Certified Surfaces)\n\n`;
  doc += `**Stock Status**: ✅ **All ${count} materials listed below are present in stock at Ace Spaces Bengaluru stockyard.**\n`;
  doc += `Every specimen is available for immediate full-sheet supply (3660 × 760 mm), 5-axis CNC digital routing, vacuum thermoforming, and physical sample tray dispatch.\n\n`;

  for (const [colName, items] of Object.entries(collections)) {
    doc += `#### ${colName} (${items.length} In-Stock)\n`;
    for (const item of items) {
      doc += `• **[${item.name} (${item.code})](/materials#library)** - *${item.finish} | ${item.colour}*\n`;
    }
    doc += `\n`;
  }

  doc += `All ${count} materials are **100% Zero-Silica** (silicosis-safe), Greenguard Gold certified, and backed by DuPont's 10-year installed warranty.\n\n`;
  doc += `Would you like to curate up to 6 physical specimens via our [Sample Tray](/materials), or discuss CAD drawings directly with our Bengaluru engineers on [WhatsApp](https://wa.me/919741044776)?`;

  return doc.trim();
}

/**
 * Intelligent Offline Natural Language Reasoner & Knowledge Retriever
 * Synthesizes grounded answers strictly respecting live inventory.
 */
export function getPrivateAIResponse(userQuery: string, history: { role: string; content: string }[] = []): {
  answer: string;
  matchedTopic?: string;
  suggestedActions?: { label: string; href?: string; prompt?: string }[];
  isGuardrailTriggered?: boolean;
} {
  const query = userQuery.trim().toLowerCase();
  const liveMaterials = getLiveMaterials();

  // 1. Check for greeting / identity questions
  const isGreeting = /^(hi|hello|hey|good morning|good afternoon|good evening|namaste|who are you|what can you do|help)\b/i.test(query);
  if (isGreeting && query.length < 35) {
    return {
      answer: `Welcome to **Ace Spaces Studio Material Intelligence**. 

I am your private architectural consultant, grounded directly in our Bengaluru central stockyard containing **${liveMaterials.length} certified materials currently in stock**, authorized DuPont™ Corian® solid surface engineering, Coro Crafted Collective spatial lineage, and 5-axis CNC digital fabrication.

How can I assist your practice today? You can ask me about:
1. **In-Stock Materials**: Check which of our ${liveMaterials.length} materials are currently in stock at Ace Spaces ([View Inventory](/materials#library)).
2. **Specific Material Specs**: Sizing, thicknesses, zero-silica composition, and pricing for any in-stock specimen (e.g. *Calacatta Greige*, *Artista Sage*, *Stonique*, or *Venaro White*).
3. **Stone & Quartz Comparisons**: Why natural marble and quartz are NOT stocked at Ace Spaces, and our certified in-stock solid surface alternatives.
4. **The Coro Connection**: How Ace Spaces powers Coro Crafted Collective's spatial installations ([Learn More](/about#coro)).
5. **Workshop Craft**: 5-axis CNC routing (<0.2mm), 160 deg C thermoforming down to 25mm radii, and seamless joins ([Fabrication Hub](/fabrication)).
6. **Studio & Google Maps**: Visiting our unified studio and headquarters in Bengaluru ([Open on Maps](https://maps.app.goo.gl/eNFxtR7WPqRS8gpd7)).`,
      matchedTopic: 'Welcome & Live Capabilities',
      suggestedActions: [
        { label: `View ${liveMaterials.length} In-Stock Materials`, prompt: 'Which materials are in stock at Ace Spaces?' },
        { label: 'Calacatta Greige Specs', prompt: 'Tell me everything about Calacatta Greige (COR-CG01) and if it is in stock' },
        { label: 'Open Studio on Google Maps', href: 'https://maps.app.goo.gl/eNFxtR7WPqRS8gpd7' },
      ],
    };
  }

  // 2. Strict Guardrail Detection: Filter out blatant non-domain topics
  const outOfDomainPatterns = [
    /\b(weather|temperature|forecast|rain|climate outside)\b/i,
    /\b(president|prime minister|election|politics|government|congress|parliament)\b/i,
    /\b(cricket|football|soccer|fifa|world cup|olympics|sports|nba|ipl)\b/i,
    /\b(movie|cinema|actor|actress|hollywood|bollywood|netflix|song|music album)\b/i,
    /\b(stock price|bitcoin|crypto|forex|trading|nasdaq)\b/i,
    /\b(recipe for cake|how to cook|bake chicken|pasta recipe)\b/i,
    /\b(write python code|javascript loop|debug this code|react component)\b/i,
    /\b(tell me a joke|write a poem about love|write an essay)\b/i,
    /\b(who is elon musk|apple iphone|samsung galaxy|tesla)\b/i,
  ];

  for (const pattern of outOfDomainPatterns) {
    if (pattern.test(query)) {
      return {
        answer: GUARDRAIL_DECLINE_MESSAGE,
        isGuardrailTriggered: true,
        suggestedActions: [
          { label: 'Browse Certified Materials', href: '/materials#library' },
          { label: 'Coro Crafted Collective Connection', href: '/about#coro' },
          { label: 'Chat on WhatsApp', href: 'https://wa.me/919741044776' },
        ],
      };
    }
  }

  // 3. INVENTORY / "WHAT MATERIALS ARE IN STOCK" LOOKUP (must run BEFORE non-stock detection)
  // This catches queries like "how many materials do you have", "what's in stock", "show all materials"
  const isInventoryQuery = /\b(what materials|which materials|how many materials|list of materials|all materials|materials in stock|stock list|stock inventory|in stock materials|show materials|how many material|total materials|count of materials|what surfaces|how many surfaces)\b/i.test(query);
  if (isInventoryQuery) {
    const responseText = formatCatalogStockInventory(liveMaterials);
    return {
      answer: responseText,
      matchedTopic: `Ace Spaces Live In-Stock Catalog (${liveMaterials.length} Materials)`,
      suggestedActions: [
        { label: 'Explore Material Library', href: '/materials#library' },
        { label: 'Order Sample Tray', href: '/materials' },
        { label: 'WhatsApp Studio Line', href: 'https://wa.me/919741044776' },
      ],
    };
  }

  // 4. NON-STOCK MATERIAL DETECTION (e.g. Italian marble, Silestone quartz, granite, ceramic)
  // Explains that it is NOT in stock at Ace Spaces and recommends in-stock alternative
  const nonStockDetected = detectNonStockMaterial(query, liveMaterials);
  if (nonStockDetected) {
    const pricing = getMaterialPricing(nonStockDetected.suggestedAlternative);
    const responseText = formatNonStockExplanation(nonStockDetected, pricing);
    return {
      answer: responseText,
      matchedTopic: `Stock Advisory: ${nonStockDetected.detectedTerm} (Not in Stock)`,
      suggestedActions: [
        { label: `View In-Stock ${nonStockDetected.suggestedAlternative.name}`, href: '/materials#library' },
        { label: 'Order Sample Specimen', href: '/materials' },
        { label: 'WhatsApp Specifier Desk', href: 'https://wa.me/919741044776' },
      ],
    };
  }

  // 5. SPECIFIC IN-STOCK MATERIAL LOOKUP
  // Matches any of the live materials from the website catalog
  const matchedMaterial = findMatchingMaterial(query, liveMaterials);
  if (matchedMaterial) {
    const pricing = getMaterialPricing(matchedMaterial);
    const responseText = formatFullMaterialExplanation(matchedMaterial, pricing);

    return {
      answer: responseText,
      matchedTopic: `${matchedMaterial.name} (${matchedMaterial.code}) - In Stock`,
      suggestedActions: [
        { label: `View ${matchedMaterial.name} in Library`, href: `/materials#library` },
        { label: 'Order Sample Specimen', href: '/materials' },
        { label: 'WhatsApp for CAD Quote', href: 'https://wa.me/919741044776' },
      ],
    };
  }

  // 6. COLOR PALETTE & ARCHITECTURAL RECOMMENDATION ENGINE
  const isColorQuery = /\b(blue|red|green|colour|color|colours|colors|palette|shade|shades|terracotta|sienna|sage|umber|amber)\b/i.test(query);
  const isSuggestionQuery = /\b(suggest|recommend|advice|which material|options|best material)\b/i.test(query);

  if (isColorQuery || isSuggestionQuery) {
    const mentionsBlue = /\b(blue|cyan|azure|navy|ocean|sapphire)\b/i.test(query);
    const mentionsRed = /\b(red|terracotta|sienna|crimson|ruby|rust)\b/i.test(query);
    const mentionsGreen = /\b(green|sage|celadon|botanic)\b/i.test(query);

    let advisory = `### Architectural Material & Colour Selection for Residential Spaces\n\n`;

    if (mentionsRed || (mentionsBlue && mentionsRed)) {
      advisory += `#### 1. Red, Warm Earth & Terracotta Surfaces\n`;
      advisory += `• **[Sandstorm (COR-SS47)](/materials#library)** - ✅ **Present in Stock at Ace Spaces**: A dynamic swirl particulate evoking desert earth and warm clay tones. Engineered with **100% zero crystalline silica**, non-porous stain resistance, and a velvety matte surface. It is exceptionally well-suited for kitchen island waterfall aprons, warm powder room vanity counters, and seamless coved backsplashes.\n`;
      advisory += `• **[Lava Rock (COR-LR29)](/materials#library)** - ✅ **Present in Stock at Ace Spaces**: Deep charcoal and warm terracotta-hued volcanic mineral matrix with tactile aggregate depth.\n\n`;
    }

    if (mentionsBlue || (mentionsBlue && mentionsRed)) {
      advisory += `#### 2. Blue & Cool Oceanic Surfaces\n`;
      advisory += `• **[Vasto Laguna (COR-VL13)](/materials#library)** - ✅ **Present in Stock at Ace Spaces**: Deep oceanic minerals with cool teal and blue particulate accents, 5-axis CNC fabricated at our Bangalore workshop with seamless molecular joins.\n`;
      advisory += `• **[Jade Onyx (COR-JO24)](/materials#library)** - ✅ **Present in Stock at Ace Spaces**: Translucent mineral surface that diffuses light with up to 38% transmission. When illuminated from behind with cool-spectrum (4500K-6500K) LED matrices, it glows with radiant crystalline depth.\n\n`;
    }

    if (mentionsGreen && !mentionsBlue && !mentionsRed) {
      advisory += `#### Botanic & Earthy Green Surfaces\n`;
      advisory += `• **[Artista Sage (COR-AS05)](/materials#library)** - ✅ **Present in Stock at Ace Spaces**: A calming celadon sage green with soft mineral powdering, pairing effortlessly with pale oak, linen textiles, and brushed brass fixtures.\n`;
      advisory += `• **[Jade Onyx (COR-JO24)](/materials#library)** - ✅ **Present in Stock at Ace Spaces**: Translucent green-tinted mineral matrix ideal for backlit botanical feature walls.\n\n`;
    }

    if (!mentionsBlue && !mentionsRed && !mentionsGreen) {
      advisory += `#### Recommended Architectural Collections\n`;
      advisory += `• **[Calacatta Greige (COR-CG01)](/materials#library)** - ✅ **Present in Stock at Ace Spaces**: Sculptural warm greige marble movement with continuous bookmatching.\n`;
      advisory += `• **[Stonique (COR-SQ03)](/materials#library)** - ✅ **Present in Stock at Ace Spaces**: Pure monolithic architectural solid surface with zero visible seams.\n`;
      advisory += `• **[Bleached Nuwood (COR-BN06)](/materials#library)** - ✅ **Present in Stock at Ace Spaces**: Warm mineral wood-grain surface with non-porous resilience.\n\n`;
    }

    advisory += `#### Balanced Architectural Pairings\n`;
    advisory += `To ensure bold statement surfaces harmonize with interior volumes, we recommend pairing them with neutral grounds:\n`;
    advisory += `• **[Linen (COR-LN46)](/materials#library)** - ✅ **Present in Stock at Ace Spaces**: Warm cream mineral ground that softens bold chromatic contrasts.\n`;
    advisory += `• **[Venaro White (COR-VW64)](/materials#library)** - ✅ **Present in Stock at Ace Spaces**: Luminous crisp white with gossamer linear veining.\n\n`;

    advisory += `**Stock Confirmation**: All ${liveMaterials.length} materials in our catalog are **currently present in stock at Ace Spaces** Bengaluru stockyard, featuring **100% zero crystalline silica** (silicosis-safe), seamless inconspicuous joins, and vacuum thermoforming capabilities down to 25mm radii.\n\n`;
    advisory += `Would you like to curate physical 100 × 100 mm specimens via our [Sample Tray](/materials), or discuss CAD drawings directly with our Bengaluru engineers on [WhatsApp](https://wa.me/919741044776)?`;

    return {
      answer: advisory.trim(),
      matchedTopic: 'Material Colour & Architectural Advisory',
      suggestedActions: [
        { label: 'Browse In-Stock Materials', href: '/materials#library' },
        { label: 'Order Sample Tray', href: '/materials' },
        { label: 'WhatsApp Specifier Desk', href: 'https://wa.me/919741044776' },
      ],
    };
  }

  // 7. MAPS & NAVIGATION LOOKUP
  if (/\b(map|maps|location|directions|where are you|where is|address|navigate|showroom|studio|headquarters|how to reach|find you)\b/i.test(query)) {
    const mapsSection = STUDIO_KNOWLEDGE_BASE.find((s) => s.id === 'coro-maps-location')!;
    return {
      answer: `### Coro Crafted Collective & Ace Spaces Studio Headquarters\n\n${mapsSection.details}`,
      matchedTopic: 'Studio Location & Navigation',
      suggestedActions: mapsSection.suggestedActions,
    };
  }

  // 8. GENERAL PRICING & SIZING LOOKUP
  if (/\b(price|pricing|cost|quote|rate|rates|how much|sqft|square foot|per sq ft|slab cost|sheet price|sheet size|full sheet|dimensions|slab dimensions|size|sizing|approx price)\b/i.test(query)) {
    const pricingSection = STUDIO_KNOWLEDGE_BASE.find((s) => s.id === 'pricing-sizing')!;
    return {
      answer: `### Full Sheet Sizing, Slab Dimensions & Commercial Pricing Matrix\n\n${pricingSection.details}`,
      matchedTopic: 'Pricing & Sizing',
      suggestedActions: pricingSection.suggestedActions,
    };
  }

  // 9. DOMAIN SCORING ENGINE for other topics (Founders, Coro Synergy, Fabrication, etc.)
  let bestMatch: KnowledgeSection | null = null;
  let highestScore = 0;

  for (const section of STUDIO_KNOWLEDGE_BASE) {
    let score = 0;

    for (const kw of section.keywords) {
      if (query.includes(kw)) {
        score += kw.includes(' ') ? 4 : 2;
      }
    }

    if (query.includes(section.id)) {
      score += 5;
    }

    if (score > highestScore) {
      highestScore = score;
      bestMatch = section;
    }
  }

  if (bestMatch && highestScore >= 2) {
    let responseText = `### ${bestMatch.topic}\n\n${bestMatch.details}\n\n`;

    if (bestMatch.specs && Object.keys(bestMatch.specs).length > 0) {
      responseText += `**Architectural Specifications:**\n`;
      for (const [key, value] of Object.entries(bestMatch.specs)) {
        responseText += `• **${key}**: ${value}\n`;
      }
    }

    return {
      answer: responseText.trim(),
      matchedTopic: bestMatch.topic,
      suggestedActions: bestMatch.suggestedActions,
    };
  }

  // Check if query mentions coro specifically
  if (query.includes('coro')) {
    const coroSection = STUDIO_KNOWLEDGE_BASE.find((s) => s.id === 'coro-connection')!;
    return {
      answer: `### Ace Spaces & Coro Crafted Collective Synergy\n\n${coroSection.details}`,
      matchedTopic: 'Coro Connection',
      suggestedActions: coroSection.suggestedActions,
    };
  }

  // 10. Default domain-bound fallback
  return {
    answer: `Thank you for your inquiry regarding Ace Spaces and our architectural surface ecosystem.

As your private studio intelligence, I specialize in:
• **In-Stock Materials (${liveMaterials.length} Specimens)**: All ${liveMaterials.length} materials currently in stock at our Bengaluru stockyard ([Explore Materials](/materials#library)).
• **DuPont™ Corian® Specifications**: Non-porous zero-silica mineral surfaces, ATH + acrylic composition, and certified warranties.
• **Full Sheet Sizing & Pricing**: Standard 3660 mm × 760 mm slabs across solids, veined, terrazzo, and backlit translucent series ([Technical Specifications](/materials#specs)).
• **Coro Crafted Collective Synergy**: How Ace Spaces acts as the parent company and raw material source for Coro's spatial designs ([The Coro Synergy](/about#coro)).
• **Fabrication Capabilities**: Sub-0.2mm 5-axis CNC machining, 160 deg C vacuum thermoforming, and seamless joining ([Fabrication Hub](/fabrication)).
• **Physical Specimens**: Curating sample trays for delivery across India ([Order Samples](/materials)).

Could you please specify your architectural requirement or material of interest, or connect directly with our Bengaluru studio engineers via the [WhatsApp Studio Desk](https://wa.me/919741044776)?`,
    matchedTopic: 'Studio Advisory',
    suggestedActions: [
      { label: `View ${liveMaterials.length} In-Stock Materials`, href: '/materials#library' },
      { label: 'Coro Crafted Collective Connection', href: '/about#coro' },
      { label: 'WhatsApp Studio Line', href: 'https://wa.me/919741044776' },
    ],
  };
}

