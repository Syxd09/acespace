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

export interface SiteContent {
  heroSlides: HeroSlide[];
  materials: Material[];
  applicationSectors: ApplicationSector[];
  journalArticles: JournalArticle[];
  projects?: Project[];
  studioContact?: StudioContactConfig;
  updatedAt: string;
}

export { type JournalArticle, type Project };
export const defaultJournalArticles: JournalArticle[] = initialJournalArticles;
export const defaultProjectsList: Project[] = defaultProjects;

