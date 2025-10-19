import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(_req: VercelRequest, res: VercelResponse) {
  res.setHeader('Content-Type', 'text/plain');
  res.status(200).send(`User-agent: *
Allow: /

Sitemap: https://polyseal.vercel.app/api/sitemap.xml`);
}
