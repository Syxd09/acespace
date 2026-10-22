import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

/**
 * GET /api/health
 * Lightweight edge-compatible health check and database keep-alive endpoint.
 * Suitable for free uptime monitoring services (e.g. UptimeRobot, cron-job.org)
 * to prevent Supabase Free projects from pausing after 7 days of inactivity.
 */
export async function GET() {
  const timestamp = new Date().toISOString();
  
  return NextResponse.json(
    {
      status: 'healthy',
      service: 'Ace Spaces Architectural 3D Configurator',
      timestamp,
      uptime: process.uptime(),
    },
    {
      status: 200,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      },
    }
  );
}
