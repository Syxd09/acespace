import crypto from 'crypto';
import { NextRequest } from 'next/server';

const AUTH_SECRET = process.env.ADMIN_SECRET || 'acespaces-studio-secret-salt-2026';
const PASSKEY = process.env.ADMIN_PASSKEY || 'acespaces2026';
const SESSION_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

export function checkPasskey(input: string): boolean {
  if (!input || typeof input !== 'string') return false;
  // Constant time comparison to prevent timing attacks
  const a = Buffer.from(input.trim());
  const b = Buffer.from(PASSKEY);
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

export function createSessionToken(): string {
  const timestamp = Date.now().toString();
  const signature = crypto.createHmac('sha256', AUTH_SECRET).update(timestamp).digest('hex');
  return `${timestamp}.${signature}`;
}

export function verifySessionToken(token?: string | null): boolean {
  if (!token || typeof token !== 'string') return false;
  const parts = token.split('.');
  if (parts.length !== 2) return false;

  const [timestampStr, signature] = parts;
  const timestamp = parseInt(timestampStr, 10);
  if (isNaN(timestamp)) return false;

  // Check expiration
  if (Date.now() - timestamp > SESSION_MAX_AGE_MS) return false;

  // Verify HMAC signature
  const expectedSig = crypto.createHmac('sha256', AUTH_SECRET).update(timestampStr).digest('hex');
  const a = Buffer.from(signature);
  const b = Buffer.from(expectedSig);
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

export function verifyAdminRequest(req: NextRequest): boolean {
  // 1. Check HttpOnly cookie
  const cookieToken = req.cookies.get('acespaces_session')?.value;
  if (cookieToken && verifySessionToken(cookieToken)) {
    return true;
  }

  // 2. Check Authorization Bearer header
  const authHeader = req.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const bearerToken = authHeader.slice(7).trim();
    if (verifySessionToken(bearerToken)) {
      return true;
    }
  }

  return false;
}
