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
}

export const defaultHeroSlides: HeroSlide[] = [
  {
    id: 1,
    image: '/assets/applications/calacatta-greige-kitchen.jpg',
    eyebrow: 'Ace Spaces / Parent Company & Raw Material Source',
    title: 'The source of material,',
    subtitle: 'where spaces begin.',
    copy: 'The primary raw material hub for architects, interior designers, and bespoke builders — supplying solid surfaces, mineral slabs, and the foundational material powering Coro Collective.',
    specimen: 'Alto / Ivory Vein',
    location: 'Private Residence / Bengaluru',
  },
  {
    id: 2,
    image: '/assets/materials/css-calacatta-greige-sheet.jpg',
    eyebrow: 'Workshop Craft / Seamless Form',
    title: 'Quiet depth,',
    subtitle: 'monolithic form.',
    copy: 'Through-body mineral compositions engineered with zero visible seams, non-porous longevity, and velvety tactile texture.',
    specimen: 'Noma / Chalk',
    location: 'Material Specimen / Honed Matte',
  },
  {
    id: 3,
    image: '/assets/applications/stonecrest-smoke-hotel-lobby.jpg',
    eyebrow: 'Spatial Typologies / Hospitality',
    title: 'Light, shadow',
    subtitle: '& refined volume.',
    copy: 'From curved reception monoliths to custom illuminated retail plinths, shaping material around pure architectural intent.',
    specimen: 'Obsidian / Still',
    location: 'Hospitality Pavilion / Mumbai',
  },
  {
    id: 4,
    image: '/assets/applications/excavage-education.jpg',
    eyebrow: 'Material Longevity / Mineral Purity',
    title: 'Engineered for',
    subtitle: 'tactile resilience.',
    copy: 'Completely non-porous, renewably honed, and thermoformable into continuous compound planes without silicone joint lines.',
    specimen: 'Strata / Sand Fine',
    location: 'Education Studio / Bengaluru',
  },
];

export interface StudioContactConfig {
  whatsappNumber: string;
  whatsappDisplay: string;
  whatsappDefaultMessage: string;
  availabilityStatus: string;
}

export const defaultStudioContact: StudioContactConfig = {
  whatsappNumber: '+91 98450 12345',
  whatsappDisplay: '+91 98450 12345',
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

