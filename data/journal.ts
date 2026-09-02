export interface JournalArticle {
  slug: string;
  title: string;
  category: string;
  date: string;
  readTime: string;
  author: string;
  summary: string;
  imageClass: string;
  image: string;
  quote?: string;
  content: string[];
  takeaways?: string[];
}

export const journalArticles: JournalArticle[] = [
  {
    slug: 'the-edge-is-where-material-becomes-architecture',
    title: 'The edge is where material becomes architecture.',
    category: 'Material Knowledge',
    date: 'August 2024',
    readTime: '06 min read',
    author: 'Ace Spatial Research',
    summary: 'The precision of an edge defines how light transitions across planes and how a volume is experienced in an interior.',
    imageClass: 'journal-one',
    image: '/assets/material-macro.png',
    quote: 'An edge is not where a material simply stops; it is where the relationship between light, shadow, and touch is declared.',
    content: [
      'In architectural joinery, surfaces are often judged by their faces—their color, vein structure, and specular reflection. But in truth, it is the edge that reveals the true integrity of the craft.',
      'When working with monolithic solid surfaces, the edge transitions from being an afterthought to a primary design tool. Because solid surfaces are through-body materials with uniform mineral density, they can be carved, chamfered, shark-nosed, or thermo-bent without exposing an unsightly substrate.',
      'A sharp 45-degree mitre creates an illusion of monumental stone density, while a subtle 2mm micro-radius softens the light transition, inviting the hand to rest upon it. Understanding how shadow falls across these micro-geometries allows designers to sculpt space with extraordinary nuance.'
    ],
    takeaways: [
      'Through-body composition eliminates visible sub-layers at edges',
      'Micro-radii soften harsh transitions and reduce chipping risk',
      'Chamfers and shark-noses create floating shadows beneath cantilevered worktops'
    ]
  },
  {
    slug: 'on-the-beauty-of-the-seamless-join',
    title: 'On the beauty of the seamless join.',
    category: 'Fabrication Craft',
    date: 'July 2024',
    readTime: '04 min read',
    author: 'Workshop Practice',
    summary: 'When two planes meet without interruption, material ceases to feel assembled and begins to feel carved from continuous geological bedrock.',
    imageClass: 'journal-two',
    image: '/assets/hero-ace.png',
    quote: 'Eliminating the seam is not merely a technical triumph—it is a visual liberation from modular limitations.',
    content: [
      'Traditional natural stone and composite slabs are inherently bound by quarry sizes and transport limitations. Grout lines and silicone expansion joints interrupt the eye, compartmentalizing architecture into discrete tiles and slabs.',
      'Our seamless joining technique utilizes a chemically active, color-matched acrylic adhesive matrix that chemically welds adjacent solid surface panels together. Once cured and hand-honed to a unified grain structure, the joint becomes completely invisible to both the eye and the touch.',
      'This allows for monolithic 10-meter reception bars, continuous kitchen islands wrapping into full-height walls, and integrated undermount basins that flow without a single dirt trap.'
    ],
    takeaways: [
      'Zero grout lines eliminate mold and bacteria breeding zones',
      'Chemical resin welding creates bonds as strong as the parent material',
      'Enables infinite continuous lengths for monumental commercial joinery'
    ]
  },
  {
    slug: 'sculpting-with-light-translucent-surfaces',
    title: 'Sculpting with light: The physics of translucent minerals.',
    category: 'Spatial Design',
    date: 'June 2024',
    readTime: '07 min read',
    author: 'Ace Optical Lab',
    summary: 'How 6mm translucent solid surfaces transform cold LED light cavities into velvety, ambient architectural halos.',
    imageClass: 'journal-one',
    image: '/assets/material-macro.png',
    quote: 'Daylight gives the surface its mineral body; internal illumination reveals its ethereal soul.',
    content: [
      'When light passes through a mineral-filled acrylic matrix, it does not transmit linearly like glass. Instead, the microscopic aluminium trihydrate crystals refract and scatter photons in every direction, creating an entirely diffuse volumetric glow.',
      'By calibrating the distance between internal LED arrays and the rear face of our Lumen Series panels (typically 75mm to 100mm cavity depth), designers can achieve perfectly uniform luminance without hot spots.',
      'This technology opens up extraordinary possibilities for ambient bar fronts, glowing spatial divider screens, illuminated retail plinths, and sculptural pendant boxes.'
    ],
    takeaways: [
      'High internal light diffusion eliminates harsh LED diode pixelation',
      'Optimal backlighting achieved at 6mm nominal material thickness',
      'Color temperature changes (2700K vs 4000K) dynamically shift surface mood'
    ]
  },
  {
    slug: 'why-texture-changes-the-room',
    title: 'Why texture changes the room: Acoustics and low-glare calm.',
    category: 'Spatial Design',
    date: 'May 2024',
    readTime: '05 min read',
    author: 'Ace Studio Notes',
    summary: 'Tactility alters how sound, shadow, and warmth settle into an interior sanctuary.',
    imageClass: 'journal-two',
    image: '/assets/hero-ace.png',
    quote: 'A room is not only seen; it is acoustically and tactilely absorbed by the surfaces that enclose it.',
    content: [
      'In high-end architectural interiors, excessive specular glare from high-gloss surfaces can introduce visual fatigue and acoustic harshness. Our focus is on low-sheen, tactile honed finishes that absorb ambient illumination.',
      'A micro-textured surface catches indirect lighting softly, diffusing shadows and grounding the space with an earthy calm.',
      'From private dining rooms to executive suites, selecting a surface with tactile depth transforms how occupants interact with the space, making every touchpoint intentional.'
    ],
    takeaways: [
      'Velvety honed matte finishes eliminate distracting light reflections',
      'Warm-to-touch mineral feel compared to cold natural granite or quartz',
      'Enhances sensory intimacy in residential living and wellness spaces'
    ]
  },
  {
    slug: 'a-primer-on-solid-surfaces',
    title: 'A primer on solid surfaces: Chemistry, longevity, and sustainability.',
    category: 'Material Science',
    date: 'April 2024',
    readTime: '08 min read',
    author: 'Technical Specifications',
    summary: 'An exploration of mineral composition, stain performance, thermoformability, and architectural longevity.',
    imageClass: 'journal-one',
    image: '/assets/material-macro.png',
    quote: 'Solid surface is where the beauty of natural minerals meets the infinite shaping freedom of advanced polymers.',
    content: [
      'Composed of approximately two-thirds natural bauxite minerals (aluminium trihydrate) and one-third advanced acrylic resin, solid surfaces represent one of the most versatile materials in modern architecture.',
      'Being 100% non-porous, liquids cannot penetrate below the surface, rendering it completely impervious to bacterial growth, mold, and stubborn stains like turmeric, red wine, and coffee.',
      'Unlike coated materials or engineered quartz, solid surface is fully renewable—scratches, stains, or surface wear can be sanded and hand-buffed on site back to original factory condition, ensuring decades of service life.'
    ],
    takeaways: [
      'NSF/ANSI 51 certified non-porous composition for food and medical hygiene',
      'Class 1 / Class A fire rating with low smoke toxicity',
      '100% renewable through-body enables on-site resurfacing indefinitely'
    ]
  },
  {
    slug: 'thermoforming-organic-geometry',
    title: 'Thermoforming organic geometry: From CAD buck to compound curves.',
    category: 'Fabrication Craft',
    date: 'March 2024',
    readTime: '06 min read',
    author: 'Bengaluru Fabrication Hub',
    summary: 'The precision heating and vacuum forming workflows that allow flat mineral sheets to achieve complex fluid curves.',
    imageClass: 'journal-two',
    image: '/assets/hero-ace.png',
    quote: 'Heat unlocks fluidity; precision molds restore structural permanence.',
    content: [
      'Solid surface sheets heated uniformly to between 155°C and 165°C become as flexible as leather. In this malleable state, sheets are rapidly transferred to bespoke CNC-machined wooden or high-density foam bucks inside our industrial membrane vacuum presses.',
      'As air is evacuated, atmospheric pressure forces the heated sheet uniformly against the contours of the buck. The material is held under vacuum until it cools below 80°C, locking the organic 3-dimensional form permanently into place without structural stress.',
      'This process enables seamless spiral stair balustrades, sweeping reception monoliths, and organic ergonomic furniture without a single visible seam.'
    ],
    takeaways: [
      'Platen oven heating ensures uniform thermal penetration across 12mm sheets',
      'Membrane vacuum presses eliminate localized pinch points and stress risers',
      'Retains 100% structural strength and non-porous properties post-forming'
    ]
  }
];
