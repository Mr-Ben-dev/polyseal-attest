import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
}

export default function SEO({
  title,
  description,
  path = '',
  image,
}: SEOProps) {
  const base = 'https://polyseal.vercel.app';
  const t = title ?? 'Polyseal — Attestations, identity, and on-chain trust';
  const d = description ?? 'Build trust on Polygon with EAS attestations. Developer infrastructure for on-chain identity, credentials, and verifiable data.';
  const url = `${base}${path}`;
  const img = image ?? `${base}/og.png`;

  return (
    <Helmet>
      <title>{t}</title>
      <meta name="description" content={d} />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={t} />
      <meta property="og:description" content={d} />
      <meta property="og:image" content={img} />
      <meta property="og:url" content={url} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={t} />
      <meta name="twitter:description" content={d} />
      <meta name="twitter:image" content={img} />
      <link rel="canonical" href={url} />
    </Helmet>
  );
}
