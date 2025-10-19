import type { VercelRequest, VercelResponse } from '@vercel/node';
import { cors } from './_lib/cors';
import { rate } from './_lib/rate';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (cors(req, res) || rate(req, res)) return;

  try {
    const key = process.env.COINGECKO_API_KEY;
    if (!key) {
      return res.status(500).json({ error: 'api_key_not_configured' });
    }

    const url = 'https://pro-api.coingecko.com/api/v3/simple/price?ids=polygon-ecosystem-token&vs_currencies=usd';
    const response = await fetch(url, {
      headers: { 'x-cg-pro-api-key': key },
    });

    if (!response.ok) {
      throw new Error('CoinGecko API error');
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error('Price fetch error:', error);
    res.status(500).json({ error: 'failed_to_fetch_price' });
  }
}
