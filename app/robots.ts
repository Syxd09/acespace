import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/admin/*', '/api/', '/api/*'],
      },
      {
        userAgent: 'GPTBot',
        allow: '/',
        disallow: ['/admin', '/admin/*', '/api/admin', '/api/admin/*'],
      },
      {
        userAgent: 'PerplexityBot',
        allow: '/',
        disallow: ['/admin', '/admin/*', '/api/admin', '/api/admin/*'],
      },
      {
        userAgent: 'ClaudeBot',
        allow: '/',
        disallow: ['/admin', '/admin/*', '/api/admin', '/api/admin/*'],
      },
    ],
    sitemap: 'https://acespacesindia.vercel.app/sitemap.xml',
  };
}
