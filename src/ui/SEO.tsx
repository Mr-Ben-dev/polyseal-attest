import { useEffect } from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
}

export default function SEO({
  title = 'Polyseal — On-chain attestations made simple',
  description = 'Read and verify EAS attestations, connect wallets, and integrate Polyseal on Polygon. Attestations, identity, and on-chain trust.',
  path = '',
  image = 'https://polyseal.vercel.app/og.png',
}: SEOProps) {
  const base = 'https://polyseal.vercel.app';
  const url = `${base}${path}`;

  useEffect(() => {
    document.title = title;
    
    const updateMeta = (selector: string, content: string) => {
      let meta = document.querySelector(selector);
      if (!meta) {
        meta = document.createElement('meta');
        const attr = selector.includes('property') ? 'property' : 'name';
        meta.setAttribute(attr, selector.split(/[[\]]/)[1]);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    updateMeta('meta[name="description"]', description);
    updateMeta('meta[property="og:title"]', title);
    updateMeta('meta[property="og:description"]', description);
    updateMeta('meta[property="og:image"]', image);
    updateMeta('meta[property="og:url"]', url);
    updateMeta('meta[name="twitter:title"]', title);
    updateMeta('meta[name="twitter:description"]', description);
  }, [title, description, url, image]);

  return null;
}
