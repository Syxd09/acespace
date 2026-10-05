import { NextRequest } from 'next/server';

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

// In-memory rate limiting store
const rateLimitStore = new Map<string, RateLimitRecord>();

// Cleanup stale entries every 5 minutes to prevent memory leaks
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [key, record] of rateLimitStore.entries()) {
      if (now > record.resetTime) {
        rateLimitStore.delete(key);
      }
    }
  }, 5 * 60 * 1000).unref?.();
}

export function getClientIp(req: NextRequest): string {
  // 1. Next.js platform-provided IP (e.g. Vercel edge/node)
  if (req.ip) return req.ip.trim();

  // 2. Trusted proxy / platform headers
  const vercelIp = req.headers.get('x-vercel-ip');
  if (vercelIp) return vercelIp.trim();

  const cfConnectingIp = req.headers.get('cf-connecting-ip');
  if (cfConnectingIp) return cfConnectingIp.trim();

  const realIp = req.headers.get('x-real-ip');
  if (realIp) return realIp.trim();

  // 3. Fallback to forwarded header
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) {
    const parts = forwarded.split(',').map((p) => p.trim()).filter(Boolean);
    if (parts.length > 0) return parts[parts.length - 1]; // Last hop is closest to server
  }

  return '127.0.0.1';
}

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  resetTime: number;
  retryAfterSeconds: number;
}

/**
 * Checks if a request exceeds the specified rate limit
 * @param req NextRequest
 * @param prefix Unique key prefix for the endpoint (e.g. 'auth', 'orders')
 * @param maxRequests Maximum allowed requests in window
 * @param windowMs Window duration in milliseconds
 */
export function checkRateLimit(
  req: NextRequest,
  prefix: string,
  maxRequests: number,
  windowMs: number
): RateLimitResult {
  const ip = getClientIp(req);
  const key = `${prefix}:${ip}`;
  const now = Date.now();

  const record = rateLimitStore.get(key);

  if (!record || now > record.resetTime) {
    // New or expired window
    const newRecord: RateLimitRecord = {
      count: 1,
      resetTime: now + windowMs,
    };
    rateLimitStore.set(key, newRecord);
    return {
      success: true,
      limit: maxRequests,
      remaining: maxRequests - 1,
      resetTime: newRecord.resetTime,
      retryAfterSeconds: Math.ceil(windowMs / 1000),
    };
  }

  if (record.count >= maxRequests) {
    const retryAfterSeconds = Math.max(1, Math.ceil((record.resetTime - now) / 1000));
    return {
      success: false,
      limit: maxRequests,
      remaining: 0,
      resetTime: record.resetTime,
      retryAfterSeconds,
    };
  }

  record.count += 1;
  return {
    success: true,
    limit: maxRequests,
    remaining: maxRequests - record.count,
    resetTime: record.resetTime,
    retryAfterSeconds: Math.ceil((record.resetTime - now) / 1000),
  };
}
