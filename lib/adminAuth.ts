import crypto from 'crypto';
import { NextRequest } from 'next/server';

const AUTH_SECRET = process.env.ADMIN_SECRET || 'acespaces-studio-secret-salt-2026';
const PASSKEY = process.env.ADMIN_PASSKEY || 'acespaces2026';
const SESSION_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

if (process.env.NODE_ENV === 'production' && (!process.env.ADMIN_PASSKEY || !process.env.ADMIN_SECRET)) {
  console.warn(
    '[SECURITY NOTICE] Production deployment is using fallback credentials. Configure ADMIN_PASSKEY and ADMIN_SECRET in Vercel settings.'
  );
}

export function checkPasskey(input: string): boolean {
  if (!input || typeof input !== 'string') return false;
  // In production, strictly reject default fallback passkey
  if (process.env.NODE_ENV === 'production' && !process.env.ADMIN_PASSKEY) {
    console.error('[SECURITY ALERT] ADMIN_PASSKEY is not configured in production environment variables. Login blocked.');
    return false;
  }
  // Constant time comparison to prevent timing attacks
  const a = Buffer.from(input.trim());
  const b = Buffer.from(PASSKEY);
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

export function createSessionToken(): string {
  const timestamp = Date.now().toString();
  const nonce = crypto.randomBytes(16).toString('hex');
  const payload = `${timestamp}:${nonce}`;
  const signature = crypto.createHmac('sha256', AUTH_SECRET).update(payload).digest('hex');
  return `${timestamp}.${nonce}.${signature}`;
}

export function verifySessionToken(token?: string | null): boolean {
  if (!token || typeof token !== 'string') return false;
  if (process.env.NODE_ENV === 'production' && !process.env.ADMIN_SECRET) {
    return false;
  }
  const parts = token.split('.');

  // Enhanced 3-part nonce token
  if (parts.length === 3) {
    const [timestampStr, nonce, signature] = parts;
    const timestamp = parseInt(timestampStr, 10);
    if (isNaN(timestamp)) return false;

    // Check expiration
    if (Date.now() - timestamp > SESSION_MAX_AGE_MS) return false;

    const payload = `${timestampStr}:${nonce}`;
    const expectedSig = crypto.createHmac('sha256', AUTH_SECRET).update(payload).digest('hex');
    const a = Buffer.from(signature);
    const b = Buffer.from(expectedSig);
    if (a.length !== b.length) return false;
    return crypto.timingSafeEqual(a, b);
  }

  // Backward-compatible 2-part legacy token
  if (parts.length === 2) {
    const [timestampStr, signature] = parts;
    const timestamp = parseInt(timestampStr, 10);
    if (isNaN(timestamp)) return false;

    // Check expiration
    if (Date.now() - timestamp > SESSION_MAX_AGE_MS) return false;

    const expectedSig = crypto.createHmac('sha256', AUTH_SECRET).update(timestampStr).digest('hex');
    const a = Buffer.from(signature);
    const b = Buffer.from(expectedSig);
    if (a.length !== b.length) return false;
    return crypto.timingSafeEqual(a, b);
  }

  return false;
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
