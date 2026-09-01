export interface JournalArticle {
  slug: string;
  title: string;
  category: string;
  readTime: string;
  summary: string;
  imageClass: string;
}

export const journalArticles: JournalArticle[] = [
  {
    slug: 'the-edge-is-where-material-becomes-architecture',
    title: 'The edge is where material becomes architecture.',
    category: 'Material knowledge',
    readTime: '06 min read',
    summary: 'The precision of an edge defines how light transitions across planes and how a volume is felt in a room.',
    imageClass: 'journal-one'
  },
  {
    slug: 'on-the-beauty-of-the-seamless-join',
    title: 'On the beauty of the seamless join.',
    category: 'Fabrication',
    readTime: '04 min read',
    summary: 'When two planes meet without interruption, material ceases to feel assembled and begins to feel carved.',
    imageClass: 'journal-two'
  },
  {
    slug: 'why-texture-changes-the-room',
    title: 'Why texture changes the room.',
    category: 'Design',
    readTime: '05 min read',
    summary: 'Tactility alters how sound, shadow, and warmth settle into an interior.',
    imageClass: 'journal-one'
  },
  {
    slug: 'a-primer-on-solid-surfaces',
    title: 'A primer on solid surfaces.',
    category: 'Materials',
    readTime: '08 min read',
    summary: 'An exploration of mineral composition, stain performance, and architectural longevity.',
    imageClass: 'journal-two'
  }
];
