import type { VercelRequest, VercelResponse } from '@vercel/node';

export function cors(req: VercelRequest, res: VercelResponse): boolean {
  const requestOrigin = req.headers.origin;
  const allowedOrigins = (process.env.ALLOWED_ORIGINS ?? '')
    .split(',')
    .map(s => s.trim())
    .filter(Boolean);
  
  // Determine which origin to allow
  let allowOrigin = '*';
  if (requestOrigin && allowedOrigins.length > 0) {
    if (allowedOrigins.includes(requestOrigin)) {
      allowOrigin = requestOrigin;
    } else {
      // If no match and we have a specific allowed list, use the first one
      allowOrigin = allowedOrigins[0];
    }
  } else if (allowedOrigins.length > 0) {
    // No request origin but we have allowed origins, use the first one
    allowOrigin = allowedOrigins[0];
  }
  
  res.setHeader('Access-Control-Allow-Origin', allowOrigin);
  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return true;
  }
  
  return false;
}
