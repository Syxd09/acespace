export interface Project {
  slug: string;
  title: string;
  subtitle: string;
  category: 'residential' | 'hospitality' | 'commercial' | 'retail';
  location: string;
  description: string;
  materialUsed: string;
  materialSlug: string;
  application: string;
  fabrication: string;
  image: string;
}

export const projects: Project[] = [
  {
    slug: 'private-residence',
    title: 'A quieter kind of luxury',
    subtitle: 'Private residence',
    category: 'residential',
    location: 'Bengaluru',
    description: 'A continuous mineral surface moves from island to wall, letting the architecture speak in one measured gesture.',
    materialUsed: 'Alto / Ivory Vein',
    materialSlug: 'alto-ivory-vein',
    application: 'Kitchen island / backsplash',
    fabrication: 'Seamless joining / custom edge',
    image: '/assets/hero-ace.png'
  },
  {
    slug: 'quiet-arrival',
    title: 'Quiet arrival',
    subtitle: 'Hospitality reception',
    category: 'hospitality',
    location: 'Mumbai',
    description: 'Monolithic reception desk and feature screen crafted with low-reflectivity honed surfaces for ambient warm lighting.',
    materialUsed: 'Obsidian / Still',
    materialSlug: 'obsidian-still',
    application: 'Reception counter / wall feature',
    fabrication: 'Thermoformed curve / concealed seams',
    image: '/assets/material-macro.png'
  },
  {
    slug: 'open-practice',
    title: 'Open practice',
    subtitle: 'Architectural studio',
    category: 'commercial',
    location: 'Bengaluru',
    description: 'Workplace experience centerpiece with custom sample presentation tables and tactile interaction islands.',
    materialUsed: 'Noma / Chalk',
    materialSlug: 'noma-chalk',
    application: 'Meeting island / work surfaces',
    fabrication: 'Mitred edge joinery / integrated power routing',
    image: '/assets/hero-ace.png'
  },
  {
    slug: 'material-display',
    title: 'Material display',
    subtitle: 'Bespoke retail installation',
    category: 'retail',
    location: 'New Delhi',
    description: 'Multi-layered material displays exploring backlighting and translucent mineral fields.',
    materialUsed: 'Lumen / Shell',
    materialSlug: 'lumen-shell',
    application: 'Display pedestals / illuminated screen',
    fabrication: 'Precision CNC routing / backlit edge diffusers',
    image: '/assets/material-macro.png'
  }
];
