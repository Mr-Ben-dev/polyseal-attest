import type { VercelRequest, VercelResponse } from '@vercel/node';

const routes = [
  '/',
  '/product',
  '/attestations',
  '/contracts',
  '/docs',
  '/docs/getting-started',
  '/docs/environment',
  '/docs/api',
  '/docs/security',
  '/dashboard',
  '/contact',
  '/privacy',
  '/terms',
];

export default function handler(_req: VercelRequest, res: VercelResponse) {
  const base = 'https://polyseal.vercel.app';
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes.map(path => `  <url>
    <loc>${base}${path}</loc>
    <changefreq>weekly</changefreq>
    <priority>${path === '/' ? '1.0' : '0.8'}</priority>
  </url>`).join('\n')}
</urlset>`;
  
  res.setHeader('Content-Type', 'application/xml');
  res.status(200).send(xml);
}
