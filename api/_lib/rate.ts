import type { VercelRequest, VercelResponse } from '@vercel/node';

const hits = new Map<string, number[]>();

export function rate(req: VercelRequest, res: VercelResponse): boolean {
  const now = Date.now();
  const window = Number(process.env.RATE_LIMIT_WINDOW_MS || 900000);
  const max = Number(process.env.RATE_LIMIT_MAX_REQUESTS || 100);
  
  const forwardedFor = req.headers['x-forwarded-for'];
  const ip = Array.isArray(forwardedFor) 
    ? forwardedFor[0] 
    : forwardedFor?.split(',')[0] || req.socket?.remoteAddress || 'unknown';
  
  const arr = (hits.get(ip) || []).filter(t => now - t < window);
  arr.push(now);
  hits.set(ip, arr);
  
  if (arr.length > max) {
    res.status(429).json({ error: 'rate_limited' });
    return true;
  }
  
  return false;
}
