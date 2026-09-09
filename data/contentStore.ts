import fs from 'fs';
import path from 'path';
import { materials as defaultMaterials } from './materials';
import { applicationSectors as defaultSectors } from './applications';
import { HeroSlide, defaultHeroSlides, SiteContent, defaultJournalArticles, JournalArticle } from './contentTypes';

export * from './contentTypes';

// Primary local path & secondary /tmp path for Vercel Serverless read-only environment
const localDataPath = path.join(process.cwd(), 'data', 'custom-content.json');
const vercelTmpPath = path.join('/tmp', 'acespaces-custom-content.json');

function getDataFilePath(): string {
  // If running in Vercel serverless environment, use /tmp if local is read-only
  if (process.env.VERCEL) {
    if (fs.existsSync(vercelTmpPath)) {
      return vercelTmpPath;
    }
    if (fs.existsSync(localDataPath)) {
      return localDataPath;
    }
    return vercelTmpPath;
  }
  return localDataPath;
}

export function getSiteContent(): SiteContent {
  const primaryPath = getDataFilePath();

  try {
    // Check primary path or fallback
    const targetPath = fs.existsSync(primaryPath) ? primaryPath : (fs.existsSync(localDataPath) ? localDataPath : (fs.existsSync(vercelTmpPath) ? vercelTmpPath : null));
    if (targetPath) {
      const fileData = fs.readFileSync(targetPath, 'utf8');
      const parsed = JSON.parse(fileData);
      return {
        heroSlides: parsed.heroSlides || defaultHeroSlides,
        materials: parsed.materials || defaultMaterials,
        applicationSectors: parsed.applicationSectors || defaultSectors,
        journalArticles: parsed.journalArticles || defaultJournalArticles,
        updatedAt: parsed.updatedAt || new Date().toISOString(),
      };
    }
  } catch (err) {
    console.warn('Error reading content file, falling back to defaults:', err);
  }

  return {
    heroSlides: defaultHeroSlides,
    materials: defaultMaterials,
    applicationSectors: defaultSectors,
    journalArticles: defaultJournalArticles,
    updatedAt: new Date().toISOString(),
  };
}

export function saveSiteContent(content: Partial<SiteContent>): SiteContent {
  const current = getSiteContent();
  const updated: SiteContent = {
    heroSlides: content.heroSlides || current.heroSlides,
    materials: content.materials || current.materials,
    applicationSectors: content.applicationSectors || current.applicationSectors,
    journalArticles: content.journalArticles || current.journalArticles,
    updatedAt: new Date().toISOString(),
  };

  const payload = JSON.stringify(updated, null, 2);

  // 1. Try writing to local project path
  let written = false;
  try {
    fs.writeFileSync(localDataPath, payload, 'utf8');
    written = true;
  } catch (err) {
    // On Vercel, local filesystem is read-only EROFS
    console.warn('Local write skipped (likely read-only environment). Trying /tmp path...');
  }

  // 2. Try writing to /tmp path if running in serverless / Vercel
  try {
    fs.writeFileSync(vercelTmpPath, payload, 'utf8');
    written = true;
  } catch (err) {
    // Log if /tmp write fails
    if (!written) {
      console.warn('Serverless /tmp write skipped:', err);
    }
  }

  return updated;
}

export function resetSiteContent(): SiteContent {
  const defaultContent: SiteContent = {
    heroSlides: defaultHeroSlides,
    materials: defaultMaterials,
    applicationSectors: defaultSectors,
    journalArticles: defaultJournalArticles,
    updatedAt: new Date().toISOString(),
  };

  try {
    if (fs.existsSync(localDataPath)) fs.unlinkSync(localDataPath);
  } catch (e) {}

  try {
    if (fs.existsSync(vercelTmpPath)) fs.unlinkSync(vercelTmpPath);
  } catch (e) {}

  return defaultContent;
}
