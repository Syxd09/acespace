import { promises as fs } from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

export const dynamic = 'force-static';
export const revalidate = 86400; // 24 hours

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'public', 'llms-full.txt');
    const content = await fs.readFile(filePath, 'utf-8');

    return new NextResponse(content, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    return new NextResponse('# Ace Spaces — Complete Technical & Material Specification Reference\n\nVisit https://acespacesindia.vercel.app for full specifications.', {
      status: 200,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
      },
    });
  }
}
