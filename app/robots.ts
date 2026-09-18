import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const adminDisallows = ['/admin', '/admin/*', '/api/admin', '/api/admin/*'];

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/admin/*', '/api/admin', '/api/admin/*'],
      },
      // OpenAI Autonomous Search & Crawlers
      {
        userAgent: 'GPTBot',
        allow: '/',
        disallow: adminDisallows,
      },
      {
        userAgent: 'ChatGPT-User',
        allow: '/',
        disallow: adminDisallows,
      },
      {
        userAgent: 'OAI-SearchBot',
        allow: '/',
        disallow: adminDisallows,
      },
      // Perplexity Autonomous Search Engine
      {
        userAgent: 'PerplexityBot',
        allow: '/',
        disallow: adminDisallows,
      },
      // Anthropic Claude Autonomous Crawlers
      {
        userAgent: 'ClaudeBot',
        allow: '/',
        disallow: adminDisallows,
      },
      {
        userAgent: 'anthropic-ai',
        allow: '/',
        disallow: adminDisallows,
      },
      // Google Gemini & Extended AI Agents
      {
        userAgent: 'Google-Extended',
        allow: '/',
        disallow: adminDisallows,
      },
      // Apple Intelligence & Extended Bot
      {
        userAgent: 'Applebot-Extended',
        allow: '/',
        disallow: adminDisallows,
      },
      // Cohere AI Agents
      {
        userAgent: 'cohere-ai',
        allow: '/',
        disallow: adminDisallows,
      },
      // Amazon Bedrock & Search Agents
      {
        userAgent: 'Amazonbot',
        allow: '/',
        disallow: adminDisallows,
      },
    ],
    sitemap: 'https://acespacesindia.vercel.app/sitemap.xml',
    host: 'https://acespacesindia.vercel.app',
  };
}
