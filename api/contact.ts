import type { VercelRequest, VercelResponse } from '@vercel/node';
import { cors } from './_lib/cors';

function readBody(req: VercelRequest): Promise<any> {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', (chunk) => (data += chunk));
    req.on('end', () => {
      try {
        resolve(JSON.parse(data || '{}'));
      } catch {
        reject(new Error('Invalid JSON'));
      }
    });
  });
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (cors(req, res)) return;

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'method_not_allowed' });
  }

  try {
    const body = await readBody(req);
    const { name, email, message } = body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'missing_fields' });
    }

    const hook = process.env.SLACK_WEBHOOK_URL;
    if (!hook) {
      return res.status(500).json({ error: 'webhook_not_configured' });
    }

    await fetch(hook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: `New Polyseal contact\nName: ${name}\nEmail: ${email}\nMessage: ${message}`,
      }),
    });

    res.status(200).json({ ok: true });
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(400).json({ error: 'invalid_payload' });
  }
}
