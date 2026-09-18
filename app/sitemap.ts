import { MetadataRoute } from 'next';
import { materials } from '@/data/materials';
import { productsData } from '@/data/products';
import { applicationSectors } from '@/data/applications';
import { projects } from '@/data/projects';
import { journalArticles } from '@/data/journal';

const BASE_URL = 'https://acespacesindia.vercel.app';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  // Static core routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/materials`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/products`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/applications`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/fabrication`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/projects`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/journal`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/privacy`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/terms`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];

  // Dynamic Material routes
  const materialRoutes: MetadataRoute.Sitemap = materials.map((mat) => ({
    url: `${BASE_URL}/materials/${mat.slug}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.85,
  }));

  // Dynamic Application sector routes
  const applicationRoutes: MetadataRoute.Sitemap = applicationSectors.map((sector) => ({
    url: `${BASE_URL}/applications/${sector.id}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  // Dynamic Project case study routes
  const projectRoutes: MetadataRoute.Sitemap = projects.map((proj) => ({
    url: `${BASE_URL}/projects/${proj.slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.75,
  }));

  // Dynamic Journal routes
  const journalRoutes: MetadataRoute.Sitemap = journalArticles.map((art) => ({
    url: `${BASE_URL}/journal/${art.slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.75,
  }));

  // Dynamic Product routes
  const productRoutes: MetadataRoute.Sitemap = productsData.map((prod) => ({
    url: `${BASE_URL}/products/${prod.slug}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.85,
  }));

  return [
    ...staticRoutes,
    ...materialRoutes,
    ...productRoutes,
    ...applicationRoutes,
    ...projectRoutes,
    ...journalRoutes,
  ];
}
