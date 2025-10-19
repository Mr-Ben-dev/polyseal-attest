import { useParams, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import SEO from '@/ui/SEO';

const docContent: Record<string, { title: string; content: JSX.Element }> = {
  'getting-started': {
    title: 'Getting Started',
    content: (
      <div className="prose prose-invert max-w-none">
        <h1>Getting Started with Polyseal</h1>
        
        <p className="lead">
          Polyseal makes it easy to work with EAS attestations on Polygon. This guide will help you get up and running in minutes.
        </p>

        <h2>Prerequisites</h2>
        <ul>
          <li>Node.js 18 or higher</li>
          <li>A wallet with Polygon Amoy testnet configured</li>
          <li>Basic knowledge of React and TypeScript</li>
        </ul>

        <h2>Installation</h2>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
          <code>{`npm create vite@latest my-polyseal-app -- --template react-ts
cd my-polyseal-app
npm install @rainbow-me/rainbowkit wagmi viem @tanstack/react-query
npm run dev`}</code>
        </pre>

        <h2>Quick Start</h2>
        <p>
          Connect your wallet using RainbowKit and start querying attestations:
        </p>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
          <code>{`import { useAccount } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';

function App() {
  const { address, isConnected } = useAccount();
  
  return (
    <div>
      <ConnectButton />
      {isConnected && <p>Connected: {address}</p>}
    </div>
  );
}`}</code>
        </pre>

        <h2>Next Steps</h2>
        <ul>
          <li>Configure your environment variables</li>
          <li>Explore the API reference</li>
          <li>Read about security best practices</li>
        </ul>
      </div>
    ),
  },
  'environment': {
    title: 'Environment Setup',
    content: (
      <div className="prose prose-invert max-w-none">
        <h1>Environment Setup</h1>
        
        <p className="lead">
          Proper environment configuration is crucial for secure and reliable operation.
        </p>

        <h2>Environment Variables</h2>
        <p>
          Create a <code>.env</code> file in your project root with the following variables:
        </p>

        <h3>Client Variables (VITE_ prefix)</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
          <code>{`VITE_CHAIN_ID=80002
VITE_RPC_URL=https://rpc-amoy.polygon.technology
VITE_EAS_ADDRESS=0xb101275a60d8bfb14529C421899aD7CA1Ae5B5Fc
VITE_SCHEMA_REGISTRY=0x23c5701A1BDa89C61d181BD79E5203c730708AE7
VITE_POLYSEAL_SCHEMA_UID=0x27d06e3659317e9a4f8154d1e849eb53d43d91fb4f219884d1684f86d797804a
VITE_WALLETCONNECT_PROJECT_ID=your_project_id`}</code>
        </pre>

        <h3>Server Variables (no VITE_ prefix)</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
          <code>{`POLYGON_RPC_URL=https://rpc-amoy.polygon.technology/
EAS_CONTRACT_ADDRESS=0xb101275a60d8bfb14529C421899aD7CA1Ae5B5Fc
COINGECKO_API_KEY=your_api_key
SLACK_WEBHOOK_URL=your_webhook_url`}</code>
        </pre>

        <h2>Network Configuration</h2>
        <p>Polyseal is configured for Polygon Amoy testnet:</p>
        <ul>
          <li><strong>Chain ID:</strong> 80002</li>
          <li><strong>RPC:</strong> https://rpc-amoy.polygon.technology</li>
          <li><strong>Explorer:</strong> https://amoy.polygonscan.com</li>
        </ul>

        <h2>WalletConnect Setup</h2>
        <p>
          Get your WalletConnect Project ID from{' '}
          <a href="https://cloud.walletconnect.com" target="_blank" rel="noreferrer">
            cloud.walletconnect.com
          </a>
          . Add your domain to the allowlist.
        </p>
      </div>
    ),
  },
  'api': {
    title: 'API Reference',
    content: (
      <div className="prose prose-invert max-w-none">
        <h1>API Reference</h1>
        
        <p className="lead">
          Complete reference for Polyseal serverless functions and client-side utilities.
        </p>

        <h2>Serverless Functions</h2>

        <h3>GET /api/eas/[uid]</h3>
        <p>Fetch an attestation by UID.</p>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
          <code>{`// Request
GET /api/eas/0x123...

// Response
{
  "uid": "0x123...",
  "schema": "0xabc...",
  "attester": "0xdef...",
  "recipient": "0x456...",
  "time": 1234567890,
  "data": "0x..."
}`}</code>
        </pre>

        <h3>GET /api/price</h3>
        <p>Get current Polygon token price from CoinGecko.</p>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
          <code>{`// Request
GET /api/price

// Response
{
  "polygon-ecosystem-token": {
    "usd": 0.85
  }
}`}</code>
        </pre>

        <h3>POST /api/contact</h3>
        <p>Submit contact form to Slack webhook.</p>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
          <code>{`// Request
POST /api/contact
{
  "name": "John Doe",
  "email": "john@example.com",
  "message": "Hello!"
}

// Response
{
  "ok": true
}`}</code>
        </pre>

        <h2>Client Utilities</h2>

        <h3>getSchemaByUid()</h3>
        <p>Fetch schema definition from SchemaRegistry contract.</p>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
          <code>{`import { getSchemaByUid } from '@/lib/eas';
import { ENV } from '@/lib/env';

const schema = await getSchemaByUid(
  ENV.REGISTRY,
  ENV.SCHEMA_UID
);`}</code>
        </pre>

        <h2>Rate Limiting</h2>
        <p>All API endpoints are rate limited to 100 requests per 15 minutes per IP address.</p>
      </div>
    ),
  },
  'security': {
    title: 'Security',
    content: (
      <div className="prose prose-invert max-w-none">
        <h1>Security Best Practices</h1>
        
        <p className="lead">
          Security is paramount when working with blockchain applications. Follow these guidelines to keep your application secure.
        </p>

        <h2>Environment Variables</h2>
        <ul>
          <li><strong>Never commit secrets:</strong> Use <code>.env.example</code> for templates</li>
          <li><strong>Use VITE_ prefix:</strong> Only for public client-side variables</li>
          <li><strong>Server secrets:</strong> Keep API keys server-side without VITE_ prefix</li>
          <li><strong>Rotate regularly:</strong> Change secrets periodically</li>
        </ul>

        <h2>API Security</h2>
        <ul>
          <li><strong>Rate limiting:</strong> All endpoints are protected against abuse</li>
          <li><strong>CORS:</strong> Configured for specific origins in production</li>
          <li><strong>Input validation:</strong> All inputs are validated and sanitized</li>
          <li><strong>Error handling:</strong> Graceful failures without exposing internals</li>
        </ul>

        <h2>Smart Contract Security</h2>
        <ul>
          <li><strong>Verify contracts:</strong> Always verify on PolygonScan</li>
          <li><strong>Check addresses:</strong> Confirm contract addresses match documentation</li>
          <li><strong>Test transactions:</strong> Use testnet before mainnet</li>
          <li><strong>Monitor events:</strong> Watch for suspicious activity</li>
        </ul>

        <h2>Wallet Security</h2>
        <ul>
          <li><strong>Never share keys:</strong> Keep private keys and seed phrases secure</li>
          <li><strong>Use hardware wallets:</strong> For production and high-value operations</li>
          <li><strong>Verify signatures:</strong> Always check what you're signing</li>
          <li><strong>Limit permissions:</strong> Only grant necessary permissions</li>
        </ul>

        <h2>Deployment Security</h2>
        <ul>
          <li><strong>Environment separation:</strong> Different keys for dev/staging/prod</li>
          <li><strong>Access control:</strong> Limit who can deploy and manage secrets</li>
          <li><strong>Monitoring:</strong> Set up alerts for unusual activity</li>
          <li><strong>Backup:</strong> Regular backups of critical data</li>
        </ul>

        <h2>Incident Response</h2>
        <p>
          If you suspect a security breach:
        </p>
        <ol>
          <li>Immediately rotate all secrets and API keys</li>
          <li>Review recent transactions and attestations</li>
          <li>Check server logs for suspicious activity</li>
          <li>Contact relevant parties if user data is affected</li>
        </ol>
      </div>
    ),
  },
};

export default function Doc() {
  const { slug } = useParams<{ slug: string }>();
  
  if (!slug || !docContent[slug]) {
    return <Navigate to="/docs" replace />;
  }

  const doc = docContent[slug];

  return (
    <>
      <SEO title={`${doc.title} — Polyseal Docs`} path={`/docs/${slug}`} />
      
      <div className="container py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-8 md:p-12 max-w-4xl mx-auto"
        >
          {doc.content}
        </motion.div>
      </div>
    </>
  );
}
