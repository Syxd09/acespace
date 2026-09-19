import { materials, Material } from '@/data/materials';

/**
 * Ace Spaces & Coro Collective — Private Studio Material Intelligence
 * 
 * Strict Closed-Domain Knowledge Base & Private Grounded Response Engine.
 * Grounded exclusively in Ace Spaces website data, DuPont™ Corian® specifications,
 * Coro Collective spatial applications, workshop machinery, and sample services.
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
• **Noma Solids** (White Chalk, Linen, Parchment, Bone, Concrete Ash):
  - Raw Slab Material: **₹650 – ₹850 / sq. ft.** (~₹19,500 – ₹25,500 per full sheet)
  - Installed & Finished: **₹1,100 – ₹1,450 / sq. ft.**
• **Terra Earth** (Sienna, Sage, Umber):
  - Raw Slab Material: **₹750 – ₹950 / sq. ft.** (~₹22,500 – ₹28,500 per full sheet)
  - Installed & Finished: **₹1,250 – ₹1,600 / sq. ft.**
• **Alto Veined** (Bianco Vein, Calacatta Gold, Fior di Bosco):
  - Raw Slab Material: **₹950 – ₹1,400 / sq. ft.** (~₹28,500 – ₹42,000 per full sheet)
  - Installed & Finished: **₹1,600 – ₹2,200 / sq. ft.** (includes precision vein alignment)
• **Strata Textures & Obsidian Noir** (Sand Fine, Terrazzo Ash, Still, Coal, Basalt):
  - Raw Slab Material: **₹1,100 – ₹1,650 / sq. ft.** (~₹33,000 – ₹49,500 per full sheet)
  - Installed & Finished: **₹1,800 – ₹2,500 / sq. ft.**
• **Lumen Translucent** (Shell, Ice, Opal - Backlit Series):
  - Raw Slab Material: **₹1,250 – ₹1,850 / sq. ft.** (~₹37,500 – ₹55,500 per full sheet)
  - Installed & Finished: **₹2,100 – ₹2,850 / sq. ft.** (includes rear optical cavity framing)

### 3. Fabrication & Bespoke Feature Add-ons
• **Mitred Waterfall Edge Apron (40mm–100mm drop)**: ₹350 – ₹650 / linear ft.
• **Integrated Seamless Corian Sink / Vanity Basin**: ₹12,000 – ₹22,000 / bowl.
• **Thermoformed Curved Radii (down to 25mm R)**: ₹1,800 – ₹3,200 / sq. ft. of curved surface.

You can inspect technical data on our [Technical Specifications](/materials#specs) page, explore swatches in our [Material Library](/materials#library), or submit drawings via the [WhatsApp Studio Desk](https://wa.me/919845012345) for an itemized estimate.`,
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
      { label: 'WhatsApp Studio Line', href: 'https://wa.me/919845012345' }
    ]
  },
  {
    id: 'company-identity',
    topic: 'Ace Spaces Identity & DuPont™ Partnership',
    keywords: [
      'ace spaces', 'who are you', 'company', 'what is ace spaces', 'dupont', 'corian',
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
      { label: 'WhatsApp Studio Line', href: 'https://wa.me/919845012345' }
    ]
  },
  {
    id: 'coro-connection',
    topic: 'The Coro Connection & Ecosystem Synergy',
    keywords: [
      'coro', 'coro collective', 'what is coro', 'connection', 'relationship', 'parent company',
      'sister', 'furniture', 'spatial', 'collective', 'who owns coro'
    ],
    summary: 'Ace Spaces is the parent enterprise and exclusive raw material provider for Coro Collective.',
    details: `Ace Spaces stands as the foundational parent entity and raw material authority powering Coro Collective.

While Coro Collective conceives finished interior architecture, collectible furniture, and complete spatial concepts, every monolithic plane, thermoformed vanity, and sculpted curve is born from the raw DuPont™ Corian® and proprietary mineral substrates engineered and fabricated right here at Ace Spaces.

Key Synergy:
1. Raw Material Source: Ace Spaces maintains the continuous slab stock, tooling, and 5-axis CNC machining.
2. Spatial Design: Coro Collective applies these materials into signature spaces, retail flagships, and residential sanctuaries.
3. Architect Access: Independent architects and designers enjoy the exact same high-grade materials and fabrication precision used in Coro's celebrated spaces.`,
    specs: {
      'Parent Company': 'Ace Spaces',
      'Spatial Brand': 'Coro Collective',
      'Shared Facility': 'Bangalore CNC & Thermoforming Workshop',
      'Material Lineage': 'Authentic DuPont™ Corian® & Proprietary Mineral Blends'
    },
    suggestedActions: [
      { label: 'Learn About The Coro Synergy', href: '/about#coro' },
      { label: 'Explore Selected Projects', href: '/projects' }
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
    summary: 'Sub-0.2mm 5-axis CNC routing, 160°C vacuum membrane thermoforming down to 25mm radii, and imperceptible thermo-welded joints.',
    details: `Our Bengaluru workshop pairs digital robotics with master artisanal joinery across 4 systematic stages:

01 / 5-Axis CNC & Precision Cutting:
- Sub-0.2mm tolerances with automated tool changers.
- Nested CAD/CAM routing for sink cutouts, cooktop drop-ins, and sub-surface wireless charging pockets.

02 / Seamless Inconspicuous Joining:
- Two-part chemically active acrylic adhesive color-matched to the exact sheet batch.
- Molecular chemical weld creates a continuous homogenous surface with zero dirt traps and invisible seams.

03 / Vacuum Membrane Thermoforming:
- Sheets heated uniformly to 160°C in industrial platen ovens.
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
      'Forming Temperature': '160°C industrial platen oven',
      'Finishing Sequence': '120 to 600-grit hand-honed micro-abrasive',
      'Joint Performance': 'Chemically welded, non-porous, inconspicuous'
    },
    suggestedActions: [
      { label: 'Explore Fabrication Page', href: '/fabrication' },
      { label: 'Send Architectural CAD', href: 'https://wa.me/919845012345' }
    ]
  },
  {
    id: 'collections-colours',
    topic: 'Material Collections, Slabs & Color Palettes',
    keywords: [
      'colours', 'colors', 'collections', 'palette', 'swatch', 'noma', 'alto', 'obsidian',
      'lucent', 'white chalk', 'linen', 'parchment', 'ivory vein', 'calacatta', 'translucent',
      'backlit', 'terrazzo', 'slabs', 'thickness', '12mm', '19mm', 'dimensions'
    ],
    summary: 'Curated architectural palettes across Noma Solids, Alto Veined, Obsidian Aggregates, and Lucent Backlit series.',
    details: `Ace Spaces curates mineral surfaces across 4 core architectural series:

1. Noma Solids (Mineral & Monolithic):
- White Chalk (AC-0101): Pure, light-absorbing ultra-matte chalk white. Zero grain.
- Linen (AC-0102): Warm, velvety cream echoing natural unbleached textiles.
- Parchment (AC-0103): Subtle warm ecru grounding natural timber and patinated bronze.
- Bone (AC-0104): Muted architectural alabaster for calm residential sanctuaries.

2. Alto Veined (Directional & Sculptural):
- Ivory Vein (AC-0201): Fine, warm mineral veining simulating gentle geological sedimentation.
- Calacatta Greige (AC-0202): Dramatic yet restrained marble movement with warm grey ribbons.
- Grigio Ripple (AC-0203): Deep smoky undertones with soft horizontal mineral drifts.

3. Obsidian Aggregates (Terrazzo & Deep Mineral):
- Carbon Aggregate (AC-0301): Deep obsidian matrix embedded with micro-quartz and brass flecks.
- Basalt Dune (AC-0302): Tactile volcanic grey with rich aggregate depth.

4. Lucent Translucent (Backlit & Illuminating):
- Opal Lumina (AC-0401): Up to 38% light transmission. Glows warmly under concealed 2700K–3500K LED matrices.

Standard Slab Specs:
- Standard Dimensions: 3660 mm length × 760 mm width
- Standard Thicknesses: 12 mm (standard architectural) & 19 mm (heavy commercial plinths)`,
    specs: {
      'Standard Slab Dimensions': '3660 mm × 760 mm (12.0 ft × 2.5 ft)',
      'Available Gauges': '12 mm (primary), 19 mm (heavy-duty)',
      'Finishes': 'Ultra-Matte, Velvet Matte, Satin Smooth, Polished',
      'Light Transmission': 'From 6% (solids) up to 38% (Lucent series)'
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
- Full-height shower wet walls with seamless corners — no grout to discolour or harbour mildew.
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
    summary: 'Benchmark monolithic installations in Bengaluru and Mumbai designed with Studio Vardhan, Atelier Kora, and Coro Collective.',
    details: `Ace Spaces has fabricated key benchmark projects across residential, hospitality, and commercial categories:

1. Private Residence — "A Quieter Kind of Luxury" (Bengaluru):
- Architect: Studio Vardhan Architects (2024, 420 sq.m).
- Material: Alto / Ivory Vein (12mm).
- Application: 4.2-meter monolithic kitchen island with 45° mitred waterfall edges and continuous vertical backsplash grain.

2. Quiet Arrival — Hospitality Reception (Mumbai):
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
      { label: 'Submit Your Project Drawings', href: 'https://wa.me/919845012345' }
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
      { label: 'Speak with Workshop Specialist', href: 'https://wa.me/919845012345' }
    ]
  },
  {
    id: 'studio-contact-consultation',
    topic: 'Studio Location, Consultations & WhatsApp Line',
    keywords: [
      'contact', 'whatsapp', 'phone', 'call', 'consultation', 'book', 'visit',
      'showroom', 'factory', 'workshop', 'hours', 'timing', 'email', 'specifier'
    ],
    summary: 'Studio workshop in Bangalore, active Mon–Sat 09:30–18:30 IST. Direct WhatsApp available in the top navbar.',
    details: `Connect with our architectural advisory desk:

- Direct WhatsApp Specifier Line: Accessible directly from the top navigation bar or via +91 98450 12345.
- Central Workshop & Stockyard: Bangalore, Karnataka, India.
- Studio Desk Availability: Monday – Saturday, 09:30 – 18:30 IST (UTC+5:30).
- Consultation Booking: Schedule physical or virtual design consultations via our Contact page (/contact).
- CAD & Floor Plan Submission: Share AutoCAD .dwg, Rhino .3dm, or PDF drawings directly via WhatsApp or the contact form for rapid material take-offs and quotation.`,
    specs: {
      'WhatsApp Studio Line': '+91 98450 12345',
      'Studio Location': 'Bangalore (Bengaluru), Karnataka, India',
      'Operating Hours': 'Mon–Sat, 09:30–18:30 IST (UTC+5:30)',
      'Drawings Accepted': 'CAD .dwg, .dxf, .3dm, .skp, and dimensional PDFs'
    },
    suggestedActions: [
      { label: 'WhatsApp Studio Line', href: 'https://wa.me/919845012345' },
      { label: 'Book Showroom Consultation', href: '/contact' }
    ]
  },
  {
    id: 'coro-maps-location',
    topic: 'Ace Spaces & Coro Crafted Collective Studio & Headquarters',
    keywords: [
      'map', 'maps', 'location', 'directions', 'where is coro', 'where is ace spaces',
      'address', 'showroom', 'visit', 'studio address', 'navigation', 'google maps',
      'where are you', 'how to reach', 'headquarters', 'studio', 'bengaluru'
    ],
    summary: 'Ace Spaces & Coro Collective share one single unified studio and headquarters in Bengaluru, Karnataka. Direct Google Maps navigation: https://maps.app.goo.gl/eNFxtR7WPqRS8gpd7',
    details: `Architects, interior designers, and project owners are welcome to experience our monolithic material volumes, full slab catalog, and spatial installations at our studio:

📍 **Ace Spaces & Coro Crafted Collective Studio & Headquarters:**
Bengaluru, Karnataka, India.
*(This is our single, unified studio and headquarters for both Ace Spaces and Coro Collective)*
*Hours: Monday – Saturday, 09:30 – 18:30 IST (Sundays by appointment).*

🗺️ **Direct Google Maps Navigation:**
[Open Studio & Headquarters on Google Maps ↗](https://maps.app.goo.gl/eNFxtR7WPqRS8gpd7)

Here under one roof, you can:
• Examine our complete DuPont™ Corian® slab catalog across Noma, Alto, Strata, Terra, and Lumen series.
• Experience 1:1 scale monolithic kitchen waterfall islands, thermoformed vanities, and seamless basins.
• Curate and collect physical 100mm × 100mm × 12mm specifier sample boxes.
• Consult with our fabrication engineers on CAD drawings, CNC nested cuts, and thermoforming tooling.

You can book an architectural walkthrough on our [Contact Page](/contact), explore our [Fabrication Capabilities](/fabrication), or message our specifier desk directly via the [WhatsApp Studio Desk](https://wa.me/919845012345).`,
    specs: {
      'Studio & Headquarters': 'Coro Crafted Collective & Ace Spaces, Bengaluru',
      'Scope': 'Single unified studio & headquarters for both Ace Spaces and Coro Collective',
      'Google Maps Link': 'https://maps.app.goo.gl/eNFxtR7WPqRS8gpd7',
      'Operating Hours': 'Monday – Saturday, 09:30 – 18:30 IST'
    },
    suggestedActions: [
      { label: 'Open Studio on Google Maps ↗', href: 'https://maps.app.goo.gl/eNFxtR7WPqRS8gpd7' },
      { label: 'Book Studio Visit', href: '/contact' },
      { label: 'WhatsApp Specifier Desk', href: 'https://wa.me/919845012345' }
    ]
  },
  {
    id: 'founders-leadership',
    topic: 'Founders & Leadership: Syed Matheen & Architectural Direction',
    keywords: [
      'founder', 'founders', 'who started', 'who founded', 'owner', 'leadership', 'syed',
      'syed matheen', 'director', 'team', 'management', 'story', 'history'
    ],
    summary: 'Founded in Bengaluru by material technologist Syed Matheen and a multidisciplinary collective of spatial architects.',
    details: `Ace Spaces and Coro Collective were founded in Bengaluru with a unified vision: to disrupt brittle, silica-hazardous stone processing and establish a master foundry for monolithic, non-porous mineral architecture.

**Key Leadership & Founders:**
• **Syed Matheen** — Co-Founder & Director of Material Engineering & Advanced Fabrication:
  - Spearheads Ace Spaces’ digital manufacturing infrastructure, 5-axis CNC routing systems (<0.2mm tolerance), and industrial vacuum thermoforming technology.
  - Architected the authorized distribution alliance with DuPont™ Corian® across India.
  - Directs raw material research into zero-silica mineral matrices and proprietary resin formulations.

• **The Founding Architectural Collective**:
  - Composed of visionary spatial architects, luxury interior designers, and computational fabricators who sought seamless, continuous planes without joint lines or grout.
  - Established **Ace Spaces** to serve as the foundational raw material authority, and founded **Coro Collective** as the spatial design wing to manifest what is possible when these advanced materials are shaped into bespoke private residences, hotel atriums, and collectible furniture.`,
    specs: {
      'Co-Founder & Director': 'Syed Matheen (Material Engineering & Digital Fabrication)',
      'Founding Collective': 'Spatial Architects, Computational Joiners & Material Scientists',
      'Origin City': 'Bengaluru, Karnataka, India',
      'Mission': 'Zero-Silica Monolithic Architecture & Precision Digital Fabrication'
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
   • *The Corian® Advantage*: 100% Zero-Silica safe. Can be thermoformed into compound curves down to 25mm radii at 160°C and joined with invisible color-matched molecular welds.

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
      { label: 'WhatsApp Consultation', href: 'https://wa.me/919845012345' }
    ]
  }
];

// Strict Out-of-Domain Guardrail Fallback
export const GUARDRAIL_DECLINE_MESSAGE = `I am Ace Spaces' private material intelligence assistant, exclusively dedicated to advising on DuPont™ Corian®, Coro architectural surfaces, bespoke fabrication, and studio specifications. 

Because I am a secure, private studio bot, I do not search the public internet or answer unrelated general inquiries (such as world news, politics, entertainment, coding, or unrelated brands).

Please feel free to ask me anything about:
• Ace Spaces & Coro Collective synergy
• DuPont™ Corian® composition & zero-silica safety
• Slab dimensions, colors & translucent backlit series
• 5-Axis CNC tolerances, seamless joining & thermoforming
• Kitchen islands, integrated sinks & vanity applications
• Ordering physical specifier sample boxes across India
• Studio consultations & the WhatsApp line in our navbar`;

/**
 * Helper to look up a specific material from the catalog based on user query
 */
export function findMatchingMaterial(query: string): Material | null {
  const q = query.toLowerCase();

  // 1. Check exact or stripped material code (e.g. AC-0101, ac0101, ac-0202)
  for (const mat of materials) {
    const codeClean = mat.code.toLowerCase().replace(/[^a-z0-9]/g, '');
    const qClean = q.replace(/[^a-z0-9]/g, '');
    if (qClean.includes(codeClean)) {
      return mat;
    }
  }

  // 2. Check full material name & parts (e.g. "noma / white chalk", "white chalk", "calacatta gold")
  for (const mat of materials) {
    const nameLower = mat.name.toLowerCase();
    const parts = nameLower.split('/').map((p) => p.trim());
    for (const part of parts) {
      if (part.length >= 4 && q.includes(part)) {
        return mat;
      }
    }
    if (q.includes(mat.slug)) {
      return mat;
    }
  }

  // 3. Check specific iconic color / finish names
  const specificTerms: [string, string][] = [
    ['white chalk', 'noma-white-chalk'],
    ['chalk', 'noma-white-chalk'],
    ['linen', 'noma-linen'],
    ['parchment', 'noma-parchment'],
    ['bone', 'noma-bone'],
    ['concrete ash', 'noma-concrete-ash'],
    ['bianco vein', 'alto-bianco-vein'],
    ['calacatta gold', 'alto-calacatta-gold'],
    ['calacatta', 'alto-calacatta-gold'],
    ['fior di bosco', 'alto-fior-di-bosco'],
    ['sand fine', 'strata-sand-fine'],
    ['terrazzo ash', 'strata-terrazzo-ash'],
    ['terrazzo', 'strata-terrazzo-ash'],
    ['sienna', 'terra-sienna'],
    ['sage', 'terra-sage'],
    ['umber', 'terra-umber'],
    ['still', 'obsidian-still'],
    ['coal', 'obsidian-coal'],
    ['basalt', 'obsidian-basalt'],
    ['lumen shell', 'lumen-shell'],
    ['lumen ice', 'lumen-ice'],
    ['lumen opal', 'lumen-opal'],
    ['opal lumina', 'lumen-opal'],
    ['opal', 'lumen-opal'],
  ];

  for (const [term, slug] of specificTerms) {
    if (q.includes(term)) {
      const found = materials.find((m) => m.slug === slug);
      if (found) return found;
    }
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

  if (col.includes('noma')) {
    return {
      rawSqFt: '₹650 – ₹850 / sq. ft.',
      rawSheet: '₹19,500 – ₹25,500 per full 12mm sheet (~30 sq. ft)',
      installedSqFt: '₹1,100 – ₹1,450 / sq. ft. (including CNC routing, seamless joins & 5-stage hand honing)',
      gauge19mm: '+35% surcharge (~₹880 – ₹1,150 / sq. ft. raw)',
      fabricationNotes: [
        'Mitred waterfall edge apron (40–100mm drop): ₹350 – ₹550 / lin. ft.',
        'Seamless integrated Corian kitchen/vanity sink: ₹12,000 – ₹18,000 / bowl',
        'Standard 3660 × 760 mm slab yield: ~30 sq. ft. (2.78 m²)',
      ],
    };
  }

  if (col.includes('alto')) {
    return {
      rawSqFt: '₹950 – ₹1,400 / sq. ft.',
      rawSheet: '₹28,500 – ₹42,000 per full 12mm sheet (~30 sq. ft)',
      installedSqFt: '₹1,600 – ₹2,200 / sq. ft. (includes continuous vein-matching & molecular weld joints)',
      gauge19mm: '+35% surcharge (~₹1,280 – ₹1,890 / sq. ft. raw)',
      fabricationNotes: [
        'Mitred waterfall apron with continuous vein drop: ₹450 – ₹650 / lin. ft.',
        'Seamless integrated vanity slot-basin: ₹14,000 – ₹22,000 / bowl',
        'Standard 3660 × 760 mm slab yield: ~30 sq. ft. (2.78 m²)',
      ],
    };
  }

  if (col.includes('strata') || col.includes('obsidian')) {
    return {
      rawSqFt: '₹1,100 – ₹1,650 / sq. ft.',
      rawSheet: '₹33,000 – ₹49,500 per full 12mm sheet (~30 sq. ft)',
      installedSqFt: '₹1,800 – ₹2,500 / sq. ft. (diamond CNC routing & micro-honed finish)',
      gauge19mm: '+40% surcharge (~₹1,540 – ₹2,310 / sq. ft. raw)',
      fabricationNotes: [
        'Heavy-duty commercial plinth edge: ₹400 – ₹600 / lin. ft.',
        'Seamless integrated dark aggregate basin: ₹16,000 – ₹24,000 / bowl',
        'Standard 3660 × 760 mm slab yield: ~30 sq. ft. (2.78 m²)',
      ],
    };
  }

  if (col.includes('terra')) {
    return {
      rawSqFt: '₹750 – ₹950 / sq. ft.',
      rawSheet: '₹22,500 – ₹28,500 per full 12mm sheet (~30 sq. ft)',
      installedSqFt: '₹1,250 – ₹1,600 / sq. ft. (architectural velvet-matte finish)',
      gauge19mm: '+35% surcharge (~₹1,010 – ₹1,280 / sq. ft. raw)',
      fabricationNotes: [
        'Mitred edge detail (40–80mm): ₹350 – ₹500 / lin. ft.',
        'Custom coved sanitary splashback: ₹300 – ₹450 / lin. ft.',
        'Standard 3660 × 760 mm slab yield: ~30 sq. ft. (2.78 m²)',
      ],
    };
  }

  // Lumen Translucent
  return {
    rawSqFt: '₹1,250 – ₹1,850 / sq. ft. (12mm) | ₹900 – ₹1,350 / sq. ft. (6mm Backlit)',
    rawSheet: '₹37,500 – ₹55,500 per full 12mm sheet (~30 sq. ft) | ₹27,000 – ₹40,500 (6mm sheet)',
    installedSqFt: '₹2,100 – ₹2,850 / sq. ft. (including rear light-diffuser cavity framing)',
    gauge19mm: 'Special order on request',
    fabricationNotes: [
      'Translucent invisible adhesive weld (zero shadow seams)',
      'Recommended LED cavity depth: 75–120mm with 2700K–3500K LED matrix',
      'Standard 3660 × 760 mm slab yield: ~30 sq. ft. (2.78 m²)',
    ],
  };
}

/**
 * Intelligent Offline Natural Language Reasoner & Knowledge Retriever
 * Synthesizes grounded answers when no external API key is active.
 */
export function getPrivateAIResponse(userQuery: string, history: { role: string; content: string }[] = []): {
  answer: string;
  matchedTopic?: string;
  suggestedActions?: { label: string; href?: string; prompt?: string }[];
  isGuardrailTriggered?: boolean;
} {
  const query = userQuery.trim().toLowerCase();

  // 1. Check for greeting / identity questions
  const isGreeting = /^(hi|hello|hey|good morning|good afternoon|good evening|namaste|who are you|what can you do|help)\b/i.test(query);
  if (isGreeting && query.length < 35) {
    return {
      answer: `Welcome to **Ace Spaces Studio Material Intelligence**. 

I am your private architectural consultant, grounded directly in our Bengaluru central workshop data, certified DuPont™ Corian® slab catalog, Coro Collective spatial lineage, and digital fabrication capabilities.

How can I assist your practice today? You can ask me about:
1. **Full Sheet Sizing & Pricing**: Exact dimensions (3660 × 760 mm), thickness options, and collection price rates.
2. **Specific Materials**: Sizing and pricing for [White Chalk](/materials#library), [Calacatta Gold](/materials#library), [Opal Lumina](/materials#library), and 15+ others.
3. **The Coro Connection**: How Ace Spaces powers Coro Collective's spatial installations ([Learn More](/about#coro)).
4. **Workshop Craft**: 5-axis CNC routing (<0.2mm), 160°C thermoforming down to 25mm radii, and seamless joints ([Fabrication Hub](/fabrication)).
5. **Studio & Google Maps**: Visiting our unified studio and headquarters in Bengaluru ([Open on Maps](https://maps.app.goo.gl/eNFxtR7WPqRS8gpd7)).
6. **Physical Specimens**: Curating sample trays for delivery across India.`,
      matchedTopic: 'Welcome & Capabilities',
      suggestedActions: [
        { label: 'Full Sheet Size & Price', prompt: 'What is the size of a full sheet and approx price?' },
        { label: 'Pricing for White Chalk', prompt: 'What is the size and price of White Chalk?' },
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
          { label: 'Coro Collective Connection', href: '/about#coro' },
          { label: 'Chat on WhatsApp', href: 'https://wa.me/919845012345' },
        ],
      };
    }
  }

  // 3. SPECIFIC MATERIAL LOOKUP
  // Check if current query or recent conversation history specifies a particular material
  let matchedMaterial = findMatchingMaterial(query);
  if (!matchedMaterial && history && history.length > 0) {
    for (let i = history.length - 1; i >= 0; i--) {
      const hMatch = findMatchingMaterial(history[i].content);
      if (hMatch) {
        matchedMaterial = hMatch;
        break;
      }
    }
  }

  if (matchedMaterial) {
    const pricing = getMaterialPricing(matchedMaterial);

    let responseText = `### ${matchedMaterial.name} (${matchedMaterial.code}) — Architectural Specification\n\n`;
    responseText += `${matchedMaterial.description}\n\n`;

    responseText += `**Full Sheet Sizing & Dimensions:**\n`;
    responseText += `• **Full Slab Dimensions**: **${matchedMaterial.dimensions}** (12.0 ft × 2.5 ft)\n`;
    responseText += `• **Surface Area Yield**: ~30 sq. ft (2.78 m²) per slab\n`;
    responseText += `• **Available Thicknesses**: ${matchedMaterial.thicknessOptions.join(', ')}\n`;
    responseText += `• **Finish & Color**: ${matchedMaterial.finish} — ${matchedMaterial.colour}\n`;
    responseText += `• **Light Transmission**: ${matchedMaterial.lightTransmission}\n`;
    responseText += `• **Fire Rating**: ${matchedMaterial.fireRating}\n\n`;

    responseText += `**Commercial Pricing:**\n`;
    responseText += `• **Raw Slab Material Supply**: **${pricing.rawSqFt}** (${pricing.rawSheet})\n`;
    responseText += `• **Fabricated & Installed Rate**: **${pricing.installedSqFt}**\n`;
    responseText += `• **19mm Heavy-Duty Surcharge**: ${pricing.gauge19mm}\n\n`;

    responseText += `**Fabrication & Detailing Add-ons:**\n`;
    for (const note of pricing.fabricationNotes) {
      responseText += `• ${note}\n`;
    }
    responseText += `\n`;

    responseText += `**Recommended Applications:**\n`;
    responseText += `• ${matchedMaterial.applications.join(', ')}\n\n`;

    responseText += `Explore this surface in our [Material Library](/materials#library), review engineering tolerances on [Technical Specifications](/materials#specs), or share your drawings directly via our [WhatsApp Studio Desk](https://wa.me/919845012345) for an itemized CAD take-off.`;

    return {
      answer: responseText.trim(),
      matchedTopic: `${matchedMaterial.name} (${matchedMaterial.code})`,
      suggestedActions: [
        { label: `View ${matchedMaterial.name}`, href: `/materials#library` },
        { label: 'Order Material Sample', href: '/materials' },
        { label: 'WhatsApp for Quote', href: 'https://wa.me/919845012345' },
      ],
    };
  }

  // 4. MAPS & NAVIGATION LOOKUP
  if (/\b(map|maps|location|directions|where are you|where is|address|navigate|showroom|studio|headquarters|how to reach|find you)\b/i.test(query)) {
    const mapsSection = STUDIO_KNOWLEDGE_BASE.find((s) => s.id === 'coro-maps-location')!;
    return {
      answer: `### Ace Spaces & Coro Crafted Collective Studio & Headquarters\n\n${mapsSection.details}`,
      matchedTopic: 'Studio Location & Navigation',
      suggestedActions: mapsSection.suggestedActions,
    };
  }

  // 5. GENERAL PRICING & SIZING LOOKUP
  if (/\b(price|pricing|cost|quote|rate|rates|how much|sqft|square foot|per sq ft|slab cost|sheet price|sheet size|full sheet|dimensions|slab dimensions|size|sizing|approx price)\b/i.test(query)) {
    const pricingSection = STUDIO_KNOWLEDGE_BASE.find((s) => s.id === 'pricing-sizing')!;
    return {
      answer: `### Full Sheet Sizing, Slab Dimensions & Commercial Pricing Matrix\n\n${pricingSection.details}`,
      matchedTopic: 'Pricing & Sizing',
      suggestedActions: pricingSection.suggestedActions,
    };
  }

  // 6. DOMAIN SCORING ENGINE for other topics
  let bestMatch: KnowledgeSection | null = null;
  let highestScore = 0;

  for (const section of STUDIO_KNOWLEDGE_BASE) {
    let score = 0;

    // Check keywords
    for (const kw of section.keywords) {
      if (query.includes(kw)) {
        score += kw.includes(' ') ? 4 : 2; // multi-word matches weighted higher
      }
    }

    // Direct section topic match
    if (query.includes(section.id)) {
      score += 5;
    }

    if (score > highestScore) {
      highestScore = score;
      bestMatch = section;
    }
  }

  // If score is high enough, construct a tailored architectural response
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
      answer: `### Ace Spaces & Coro Collective Synergy\n\n${coroSection.details}`,
      matchedTopic: 'Coro Connection',
      suggestedActions: coroSection.suggestedActions,
    };
  }

  // 7. Default polite domain-bound response with active links
  return {
    answer: `Thank you for your inquiry regarding Ace Spaces and our architectural surface ecosystem.

As your private studio intelligence, I specialize in:
• **DuPont™ Corian® Specifications**: Non-porous zero-silica mineral surfaces, ATH + acrylic composition, and certified warranties ([Explore Materials](/materials#library)).
• **Full Sheet Sizing & Pricing**: Standard 3660 mm × 760 mm slabs across Noma, Alto, Strata, and Lumen series ([Technical Specifications](/materials#specs)).
• **Coro Collective Synergy**: How Ace Spaces acts as the parent company and raw material source for Coro's spatial designs ([The Coro Synergy](/about#coro)).
• **Fabrication Capabilities**: Sub-0.2mm 5-axis CNC machining, 160°C vacuum thermoforming, and seamless joining ([Fabrication Hub](/fabrication)).
• **Applications**: Monolithic kitchen waterfall islands, integrated basins, clinical healthcare surfaces, and backlit facades ([Kitchen Applications](/applications/kitchen)).
• **Physical Specimens**: Curating sample trays for delivery across India ([Order Samples](/materials)).

Could you please specify your architectural requirement or material of interest, or connect directly with our Bengaluru studio engineers via the [WhatsApp Studio Desk](https://wa.me/919845012345)?`,
    matchedTopic: 'Studio Advisory',
    suggestedActions: [
      { label: 'Explore Materials', href: '/materials#library' },
      { label: 'Coro Collective Connection', href: '/about#coro' },
      { label: 'WhatsApp Studio Line', href: 'https://wa.me/919845012345' },
    ],
  };
}

