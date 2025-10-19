# Reference Links for Polyseal Development

This document contains important reference links for the Polyseal project development and troubleshooting.

## Blockchain & Network

### Polygon

- **Polygon Docs**: https://docs.polygon.technology/
- **Polygon Amoy RPC**: https://rpc-amoy.polygon.technology
- **Amoy Block Explorer**: https://amoy.polygonscan.com
- **Amoy Faucet**: https://faucet.polygon.technology/

### EAS (Ethereum Attestation Service)

- **EAS Protocol Documentation**: https://docs.attest.sh/
- **EAS JavaScript SDK**: https://docs.attest.sh/docs/developer-tools/sdks/javascript
- **EAS GraphQL API**: https://docs.attest.sh/docs/developer-tools/api

## Frontend Stack

### React & Build Tools

- **React 18 Documentation**: https://react.dev/
- **Vite Documentation**: https://vitejs.dev/guide/
- **TypeScript Handbook**: https://www.typescriptlang.org/docs/

### Styling & Animation

- **Tailwind CSS**: https://tailwindcss.com/docs
- **Framer Motion**: https://www.framer.com/motion/introduction/
- **Lucide Icons**: https://lucide.dev/icons/

### Web3 Integration

- **RainbowKit**: https://www.rainbowkit.com/docs/installation
- **Wagmi v1 Documentation**: https://wagmi.sh/react/getting-started
- **Viem Documentation**: https://viem.sh/docs/getting-started
- **WalletConnect Cloud**: https://cloud.walletconnect.com/

### Data Fetching

- **TanStack Query**: https://tanstack.com/query/latest/docs/framework/react/overview
- **React Router**: https://reactrouter.com/en/main

## Backend & API

### Deployment Platform

- **Vercel Functions**: https://vercel.com/docs/functions
- **Vercel CLI**: https://vercel.com/docs/cli
- **Vercel Environment Variables**: https://vercel.com/docs/projects/environment-variables

### API & Database

- **The Graph Protocol**: https://thegraph.com/docs/en/
- **Node.js Runtime**: https://nodejs.org/en/docs/

## Development Tools

### Code Quality

- **ESLint**: https://eslint.org/docs/latest/
- **Prettier**: https://prettier.io/docs/en/
- **TypeScript ESLint**: https://typescript-eslint.io/

### Testing

- **Vitest**: https://vitest.dev/guide/
- **Testing Library**: https://testing-library.com/docs/react-testing-library/intro/

## API & CORS Configuration

### Recent Changes (Wave 1)

- **Relative API Paths**: All client calls now use `/api/endpoint` format
- **Multi-Origin CORS**: Supports both production and localhost via `ALLOWED_ORIGINS`
- **Normalized RPC URLs**: Removed trailing slashes for consistency

### Environment Variables

```bash
# Server-side (.env)
ALLOWED_ORIGINS=https://polyseal-jade.vercel.app,http://localhost:5173
POLYGON_RPC_URL=https://rpc-amoy.polygon.technology

# Client-side (VITE_ prefix)
VITE_RPC_URL=https://rpc-amoy.polygon.technology
```

### API Usage Patterns

```typescript
// ✅ Correct - relative path
const response = await fetch("/api/eas/0x123...");

// ❌ Incorrect - absolute URL (removed)
const response = await fetch("${ENV.SERVER}/eas/0x123...");
```

## Analytics & Monitoring

### Analytics

- **PostHog Documentation**: https://posthog.com/docs
- **PostHog React Integration**: https://posthog.com/docs/libraries/react

### Error Monitoring

- **Sentry Documentation**: https://docs.sentry.io/
- **Sentry React Integration**: https://docs.sentry.io/platforms/javascript/guides/react/

## Performance & SEO

### Performance

- **Lighthouse**: https://developers.google.com/web/tools/lighthouse
- **Core Web Vitals**: https://web.dev/vitals/
- **React Performance**: https://react.dev/learn/render-and-commit

### SEO

- **React Helmet Async**: https://github.com/staylor/react-helmet-async
- **Open Graph Protocol**: https://ogp.me/

## Smart Contract Addresses (Polygon Amoy)

```
EAS Contract: 0xb101275a60d8bfb14529C421899aD7CA1Ae5B5Fc
Schema Registry: 0x23c5701A1BDa89C61d181BD79E5203c730708AE7
Polyseal Schema UID: 0x27d06e3659317e9a4f8154d1e849eb53d43d91fb4f219884d1684f86d797804a
SessionPay: 0xE23EF3e9A5903cB8F68334FCAfDb89d50541d235
MockUSDC: 0xcF28F960aA85b051D030374B1ACd14668abaAf3e
```

## Polygon Buildathon Resources

### Official Links

- **Polygon Buildathon**: https://polygon.technology/buildathon
- **Polygon Developer Hub**: https://polygon.technology/developers
- **Polygon Discord**: https://discord.gg/polygon

### Sample Projects

- **EAS Examples**: https://github.com/ethereum-attestation-service/eas-contracts
- **Polygon dApp Examples**: https://github.com/0xPolygon/dapp-examples

## Troubleshooting

### Common Issues

- **RPC Rate Limiting**: Use Alchemy or Infura for production
- **CORS Errors**: Check ALLOWED_ORIGINS environment variable
- **Wallet Connection**: Verify WalletConnect project ID
- **Gas Estimation**: Use polygon.technology for current gas prices

### Debug Tools

- **Polygon Amoy Explorer**: https://amoy.polygonscan.com
- **EAS Explorer**: https://polygon-amoy.easscan.org
- **WalletConnect Bridge**: https://bridge.walletconnect.org/

## Security Best Practices

### Web3 Security

- **ConsenSys Security Best Practices**: https://consensys.github.io/smart-contract-best-practices/
- **OpenZeppelin Security**: https://docs.openzeppelin.com/learn/

### Frontend Security

- **OWASP Frontend Security**: https://owasp.org/www-project-top-ten/
- **Content Security Policy**: https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP

---

_Last Updated: October 19, 2025_
