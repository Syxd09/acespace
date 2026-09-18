import { NextResponse } from 'next/server';
import { journalArticles } from '@/data/journal';

export const dynamic = 'force-static';
export const revalidate = 86400; // 24 hours

export async function GET() {
  const BASE_URL = 'https://acespacesindia.vercel.app';
  const buildDate = new Date().toUTCString();

  const itemsXml = journalArticles
    .map((article) => {
      const link = `${BASE_URL}/journal/${article.slug}`;
      const pubDate = new Date(article.date).toUTCString();
      const escapedTitle = article.title.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      const escapedSummary = article.summary.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      const escapedCategory = article.category.replace(/&/g, '&amp;');

      return `    <item>
      <title>${escapedTitle}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <description>${escapedSummary}</description>
      <category>${escapedCategory}</category>
      <author>studio@acespaces.in (${article.author})</author>
      <pubDate>${pubDate !== 'Invalid Date' ? pubDate : buildDate}</pubDate>
    </item>`;
    })
    .join('\n');

  const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Ace Spaces Architectural Journal</title>
    <link>${BASE_URL}/journal</link>
    <description>Essays on material permanence, zero-silica mineral craft, and digital architectural fabrication from Ace Spaces (Bengaluru, India).</description>
    <language>en-in</language>
    <lastBuildDate>${buildDate}</lastBuildDate>
    <atom:link href="${BASE_URL}/journal/feed.xml" rel="self" type="application/rss+xml"/>
${itemsXml}
  </channel>
</rss>`;

  return new NextResponse(rssXml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800',
    },
  });
}
