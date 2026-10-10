import { journalArticles as initialJournalArticles, JournalArticle } from './journal';
import { materials as defaultMaterials, Material } from './materials';
import { applicationSectors as defaultSectors, ApplicationSector } from './applications';
import { projects as defaultProjects, Project } from './projects';

export interface HeroSlide {
  id: number;
  image: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  copy: string;
  specimen: string;
  location: string;
  ctaPrimaryText?: string;
  ctaPrimaryHref?: string;
  ctaSecondaryText?: string;
  ctaSecondaryHref?: string;
}

export const defaultHeroSlides: HeroSlide[] = [
  {
    id: 1,
    image: '/images/images/app_residential_calacatta_greige_1.jpg',
    eyebrow: '01 / Foundational Authority · Bangalore Stockyard',
    title: 'The source of material,',
    subtitle: 'where spaces begin.',
    copy: 'Continuous 3660mm calibrated solid surface slabs, through-body mineral pigments, and the raw foundational material powering Coro Crafted Collective.',
    specimen: 'Calacatta Greige',
    location: 'Private Residence / Bengaluru',
    ctaPrimaryText: 'Explore Slab Library',
    ctaPrimaryHref: '/materials',
    ctaSecondaryText: 'Specifier Sample Tray',
    ctaSecondaryHref: '/materials#sample-tray',
  },
  {
    id: 2,
    image: '/images/images/app_commercial_grinds_stonique.jpg',
    eyebrow: '02 / Zero-Joint Fabrication · Master Foundry',
    title: 'Continuous plane,',
    subtitle: 'monolithic peace.',
    copy: 'Through-body mineral compositions chemically welded and hand-honed into unified, monolithic volumes that feel carved from single stone.',
    specimen: 'Stonique',
    location: 'Master Sanctuary / Bangalore',
    ctaPrimaryText: 'Inspect Seamless Craft',
    ctaPrimaryHref: '/fabrication',
    ctaSecondaryText: 'Residential Gallery',
    ctaSecondaryHref: '/projects?filter=residential',
  },
  {
    id: 3,
    image: '/images/images/app_commercial_bleached_nuwood.jpg',
    eyebrow: '03 / Compound Thermoforming · Bespoke Geometry',
    title: 'Bending stone,',
    subtitle: 'releasing form.',
    copy: 'Heated to 160°C and vacuum-formed down to 25mm radii, transforming rigid mineral sheets into fluid, organic hospitality gestures.',
    specimen: 'Bleached Nuwood',
    location: 'Hospitality Pavilion / Mumbai',
    ctaPrimaryText: 'View Commercial Typologies',
    ctaPrimaryHref: '/projects?filter=commercial',
    ctaSecondaryText: 'Technical Radii Guide',
    ctaSecondaryHref: '/materials#specs',
  },
  {
    id: 4,
    image: '/images/images/coriansolidsurface-goldenonyx-application.jpg',
    eyebrow: '04 / Lumen Translucent · Light Transmission',
    title: 'When mineral',
    subtitle: 'conducts light.',
    copy: 'High-dispersion optical formulations that transform internal LED illumination into soft, diffused architectural halos after dusk.',
    specimen: 'Golden Onyx',
    location: 'Nocturnal Lounge / Hyderabad',
    ctaPrimaryText: 'Explore Translucent Palette',
    ctaPrimaryHref: '/materials?pattern=translucent',
    ctaSecondaryText: 'Optical Specifications',
    ctaSecondaryHref: '/materials#specs',
  },
  {
    id: 5,
    image: '/images/images/app_commercial_provence_nuwood.jpg',
    eyebrow: '05 / Central Bangalore Foundry · The Coro Connection',
    title: 'From Bangalore foundry,',
    subtitle: 'to living sanctuaries.',
    copy: 'The exact same 5-axis CNC machining, computerized ovens, and artisanal craft powering Coro Crafted Collective, engineered for your studio\'s drawings.',
    specimen: 'Provence Nuwood',
    location: 'Design Gallery / Bangalore',
    ctaPrimaryText: 'The Coro Synergy',
    ctaPrimaryHref: '/about#coro',
    ctaSecondaryText: 'Workshop Machinery',
    ctaSecondaryHref: '/fabrication#machinery',
  },
  {
    id: 6,
    image: '/images/images/app_commercial_grinds_excavage.jpg',
    eyebrow: '06 / 100% Non-Porous · Zero Silica Purity',
    title: 'Engineered to endure,',
    subtitle: 'renewable for generations.',
    copy: 'Zero crystalline silica, non-porous chemical purity, and an official 10-year DuPont™ warranty. Order 6 curated specimens direct to your studio desk.',
    specimen: 'Excavage',
    location: 'Education Studio / Bengaluru',
    ctaPrimaryText: 'Order Studio Specimen Tray',
    ctaPrimaryHref: '/materials#sample-tray',
    ctaSecondaryText: 'Review Certifications',
    ctaSecondaryHref: '/about#dupont',
  },
];

export interface StudioContactConfig {
  whatsappNumber: string;
  whatsappDisplay: string;
  whatsappDefaultMessage: string;
  availabilityStatus: string;
}

export const defaultStudioContact: StudioContactConfig = {
  whatsappNumber: '+91 97410 44776',
  whatsappDisplay: '+91 97410 44776',
  whatsappDefaultMessage: 'Hello Ace Spaces Studio, I would like to consult on material specifications for an upcoming architectural project.',
  availabilityStatus: 'Studio Online · Material Advisory',
};

export interface AboutPhilosophyPillar {
  number: string;
  title: string;
  quote: string;
  description: string;
  detail: string;
}

export interface AboutContentConfig {
  familyPhotoUrl: string;
  familyPhotoCaption: string;
  familyPhotoSubtitle: string;
  manifestoHeadline?: string;
  manifestoLead?: string;
  manifestoSub?: string;
  chapter1Title: string;
  chapter1Narrative: string;
  chapter2Title: string;
  chapter3Title: string;
  workshopPhotoUrl: string;
  workshopPhotoCaption: string;
  pillars?: AboutPhilosophyPillar[];
}

export const defaultAboutContent: AboutContentConfig = {
  familyPhotoUrl: '/images/about/company-family.jpg',
  familyPhotoCaption: 'Ace Spaces Foundry & Craft Team',
  familyPhotoSubtitle: 'The artisanal hands behind continuous monolithic mineral architecture in Bengaluru',
  manifestoHeadline: 'From material to masterpiece — we engineer possibilities into form.',
  manifestoLead: 'At Ace Spaces, we bring together premium solid-surface materials, precision engineering, and bespoke fabrication to transform ambitious ideas into exceptional spaces.',
  manifestoSub: 'Every detail is considered. Every dimension matters. Every creation is built around your vision.',
  chapter1Title: 'Built on obsession.',
  chapter1Narrative: 'From material to masterpiece — we engineer possibilities into form. At Ace Spaces, we bring together premium solid-surface materials, precision engineering, and bespoke fabrication to transform ambitious ideas into exceptional spaces. Every detail is considered. Every dimension matters. Every creation is built around your vision.',
  chapter2Title: 'What we stand for.',
  chapter3Title: 'How we work: Bangalore Foundry.',
  workshopPhotoUrl: '/images/images/app_residential_calacatta_greige_1.jpg',
  workshopPhotoCaption: '5-Axis CNC Thermoforming and Continuous 12mm Seamless Inconspicuous Joinery',
  pillars: [
    {
      number: '01',
      title: 'Monolithic Continuity',
      quote: 'Architecture without seams',
      description: 'We believe surfaces should not be sliced to satisfy standard tile grids. When a space demands continuity, we engineer invisible chemical joins that allow mineral surfaces to flow seamlessly. From sculptural kitchen monoliths to continuous coved wall planes, surfaces transition without interruption — eliminating visual friction and grime-harboring grout for absolute spatial tranquility.',
      detail: 'Chemically welded PMMA matrix with zero visible joint lines under 600-grit honing.',
    },
    {
      number: '02',
      title: 'Zero-Silica Purity',
      quote: 'Health for the makers and the inhabitants',
      description: 'Traditional engineered quartz contains up to 90% crystalline silica. Ace Spaces materials are 100% zero crystalline silica, combining aluminium trihydrate and pure acrylic polymers.',
      detail: 'Certified non-toxic, food-safe hygiene (NSF-51), and zero crystalline silica particulate risk.',
    },
    {
      number: '03',
      title: 'Thermoformed Curvature',
      quote: 'Form without fractures',
      description: 'Through calibrated heating ovens and custom vacuum tooling, our mineral slabs bend down to 25mm radii, releasing architects from rigid 90-degree box constraints.',
      detail: 'Compound 3D radii, curved acoustic plinths, and organic rounded reception gestures.',
    },
    {
      number: '04',
      title: 'Renewable Longevity',
      quote: 'Damage is not permanent',
      description: 'Unlike natural marble that etches from citrus or porcelain that chips on the edge, through-body solid surface is renewable throughout its entire thickness.',
      detail: 'Scratches, accidental stains, and everyday wear buff out in minutes using Scotch-Brite.',
    },
    {
      number: '05',
      title: 'Light Transmission & Optical Depth',
      quote: 'When mineral surfaces conduct light',
      description: 'Certain formulations possess controlled translucency, turning backlit reception counters, luminous wall plinths, and architectural accents into soft glowing ambient luminaires.',
      detail: 'Optical dispersion formulations engineered for LED backlighting without hotspot artifacts.',
    },
    {
      number: '06',
      title: 'Design Certainty & Precision Joinery',
      quote: 'No surprises on the installation deck',
      description: 'From digital laser templating to trial factory assembly in our Bangalore foundry, every mitre, basin cutout, and thermoformed bend is verified before arriving on site.',
      detail: 'Sub-millimetre tolerances, pre-matched adhesive batches, and dedicated studio installation.',
    },
  ],
};

export interface SiteContent {
  heroSlides: HeroSlide[];
  materials: Material[];
  applicationSectors: ApplicationSector[];
  journalArticles: JournalArticle[];
  projects?: Project[];
  studioContact?: StudioContactConfig;
  about?: AboutContentConfig;
  updatedAt: string;
}

export { type JournalArticle, type Project };
export const defaultJournalArticles: JournalArticle[] = initialJournalArticles;
export const defaultProjectsList: Project[] = defaultProjects;


