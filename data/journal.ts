export interface JournalArticle {
  slug: string;
  title: string;
  category: string;
  date: string;
  readTime: string;
  author: string;
  summary: string;
  imageClass: string;
  quote?: string;
  content: string[];
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
    quote: 'An edge is not where a material simply stops; it is where the relationship between light, shadow, and touch is declared.',
    content: [
      'In architectural joinery, surfaces are often judged by their faces—their color, vein structure, and specular reflection. But in truth, it is the edge that reveals the true integrity of the craft.',
      'When working with monolithic solid surfaces, the edge transitions from being an afterthought to a primary design tool. Because solid surfaces are through-body materials with uniform mineral density, they can be carved, chamfered, shark-nosed, or thermo-bent without exposing an unsightly substrate.',
      'A sharp 45-degree mitre creates an illusion of monumental stone density, while a subtle 2mm micro-radius softens the light transition, inviting the hand to rest upon it. Understanding how shadow falls across these micro-geometries allows designers to sculpt space with extraordinary nuance.'
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
    quote: 'Eliminating the seam is not merely a technical triumph—it is a visual liberation from modular limitations.',
    content: [
      'Traditional natural stone and composite slabs are inherently bound by quarry sizes and transport limitations. Grout lines and silicone expansion joints interrupt the eye, compartmentalizing architecture into discrete tiles and slabs.',
      'Our seamless joining technique utilizes a chemically active, color-matched acrylic adhesive matrix that chemically welds adjacent solid surface panels together. Once cured and hand-honed to a unified grain structure, the joint becomes completely invisible to both the eye and the touch.',
      'This allows for monolithic 10-meter reception bars, continuous kitchen islands wrapping into full-height walls, and integrated undermount basins that flow without a single dirt trap.'
    ]
  },
  {
    slug: 'why-texture-changes-the-room',
    title: 'Why texture changes the room.',
    category: 'Spatial Design',
    date: 'June 2024',
    readTime: '05 min read',
    author: 'Ace Studio Notes',
    summary: 'Tactility alters how sound, shadow, and warmth settle into an interior.',
    imageClass: 'journal-one',
    quote: 'A room is not only seen; it is acoustically and tactilely absorbed by the surfaces that enclose it.',
    content: [
      'In high-end architectural interiors, excessive specular glare from high-gloss surfaces can introduce visual fatigue and acoustic harshness. Our focus is on low-sheen, tactile honed finishes that absorb ambient illumination.',
      'A micro-textured surface catches indirect lighting softly, diffusing shadows and grounding the space with an earthy calm.',
      'From private dining rooms to executive suites, selecting a surface with tactile depth transforms how occupants interact with the space, making every touchpoint intentional.'
    ]
  },
  {
    slug: 'a-primer-on-solid-surfaces',
    title: 'A primer on solid surfaces.',
    category: 'Material Science',
    date: 'May 2024',
    readTime: '08 min read',
    author: 'Technical Specifications',
    summary: 'An exploration of mineral composition, stain performance, thermoformability, and architectural longevity.',
    imageClass: 'journal-two',
    quote: 'Solid surface is where the beauty of natural minerals meets the infinite shaping freedom of advanced polymers.',
    content: [
      'Composed of approximately two-thirds natural bauxite minerals (aluminium trihydrate) and one-third advanced acrylic resin, solid surfaces represent one of the most versatile materials in modern architecture.',
      'Being 100% non-porous, liquids cannot penetrate below the surface, rendering it completely impervious to bacterial growth, mold, and stubborn stains like turmeric, red wine, and coffee.',
      'Unlike coated materials or engineered quartz, solid surface is fully renewable—scratches, stains, or surface wear can be sanded and hand-buffed on site back to original factory condition, ensuring decades of service life.'
    ]
  }
];
