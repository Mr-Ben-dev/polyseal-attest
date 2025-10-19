# 🏆 Polyseal - Ethereum Attestation Service Infrastructure

<div align="center">

[![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-polyseal.vercel.app-00D8FF?style=for-the-badge&logoColor=white)](https://polyseal.vercel.app)
[![Built with Love](https://img.shields.io/badge/💖_Built_with-Love_&_Coffee-FF69B4?style=for-the-badge)](https://github.com/polyseal)
[![License MIT](https://img.shields.io/badge/📜_License-MIT-green?style=for-the-badge)](LICENSE)

**🎯 Professional Web3 Infrastructure for Ethereum Attestation Service Integration**

_Seamlessly integrate on-chain attestations, identity verification, and trust systems with our production-ready platform built on Polygon_

[📱 Try Demo](https://polyseal.vercel.app) • [📖 Documentation](https://polyseal.vercel.app/docs) • [🚀 API Reference](https://polyseal.vercel.app/api) • [💬 Discord](https://discord.gg/polyseal)

</div>

---

## 🌟 What is Polyseal?

**Polyseal** is a comprehensive developer infrastructure platform that makes Ethereum Attestation Service (EAS) integration effortless. Built specifically for Polygon networks, it provides everything developers need to create verifiable credentials, on-chain identity systems, and decentralized trust infrastructure.

### 🎪 **Live Deployments**

- 🌐 **Production**: [polyseal.vercel.app](https://polyseal.vercel.app)
- 📚 **Documentation**: [polyseal.vercel.app/docs](https://polyseal.vercel.app/docs)
- 🔧 **API Playground**: [polyseal.vercel.app/api/health](https://polyseal.vercel.app/api/health)
- 💖 **Lovable Project**: [lovable.dev/projects/7ca778b7-07ea-4844-9839-6ed67c8643b6](https://lovable.dev/projects/7ca778b7-07ea-4844-9839-6ed67c8643b6)

---

## ✨ Key Features & Capabilities

### 🔐 **Web3 Wallet Integration**

- **Multi-Wallet Support**: MetaMask, Rainbow Wallet, Coinbase Wallet, WalletConnect
- **Seamless Connection**: One-click wallet connection with RainbowKit
- **Chain Management**: Automatic Polygon Amoy testnet switching

### 📜 **EAS Attestation Management**

- **Attestation Lookup**: Real-time verification of on-chain attestations
- **Schema Registry**: Browse and query attestation schemas
- **Data Decoding**: Automatic parsing of attestation data
- **Verification Status**: Check revocation and expiration states

### 🏗️ **Developer Infrastructure**

- **RESTful API**: Serverless functions for attestation queries
- **Rate Limiting**: Built-in API protection
- **CORS Support**: Secure cross-origin resource sharing
- **Error Monitoring**: Comprehensive error tracking with Sentry

### 🎨 **Modern User Experience**

- **Glassmorphism UI**: Beautiful, modern interface with Tailwind CSS
- **Smooth Animations**: Framer Motion powered transitions
- **Responsive Design**: Mobile-first, works on all devices
- **Dark/Light Modes**: Theme switching support
- **Accessibility**: WCAG compliant, screen reader friendly

### 📊 **Analytics & Monitoring**

- **User Analytics**: PostHog integration for usage insights
- **Performance Monitoring**: Real-time error tracking
- **API Metrics**: Request monitoring and rate limiting analytics

## 🏗️ Tech Stack

### Frontend

- **React 18** + **TypeScript** + **Vite**
- **Tailwind CSS** for styling with custom design system
- **Framer Motion** for animations
- **shadcn/ui** component library
- **RainbowKit** + **Wagmi** + **Viem** for Web3 integration

### Backend

- **Vercel Serverless Functions**
- **Polygon Amoy** testnet (EAS v1.3.0)
- **PostHog** for analytics
- **Sentry** for error tracking

### Infrastructure

- **Ethereum Attestation Service (EAS)**: On-chain attestation protocol
- **Polygon Amoy**: Testnet for development
- **Vercel**: Hosting and deployment
- **WalletConnect**: Multi-wallet support

## 📦 Quick Start

### Prerequisites

- Node.js 18+ and npm
- A WalletConnect Project ID ([get one here](https://cloud.walletconnect.com))

### Installation

```bash
# Clone the repository
git clone <YOUR_GIT_URL>
cd polyseal

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Start development server
npm run dev
```

The app will be running at `http://localhost:5173`

## 🔧 Environment Variables

### Required (Client-side)

| Variable                        | Description                    | Example                               |
| ------------------------------- | ------------------------------ | ------------------------------------- |
| `VITE_WALLETCONNECT_PROJECT_ID` | WalletConnect Cloud project ID | `abc123...`                           |
| `VITE_RPC_URL`                  | Polygon Amoy RPC endpoint      | `https://rpc-amoy.polygon.technology` |
| `VITE_EAS_ADDRESS`              | EAS contract address           | `0xb101...`                           |
| `VITE_SCHEMA_REGISTRY`          | Schema Registry address        | `0x23c5...`                           |

### Optional (Analytics & Monitoring)

| Variable           | Description             |
| ------------------ | ----------------------- |
| `VITE_POSTHOG_KEY` | PostHog project API key |
| `VITE_SENTRY_DSN`  | Sentry project DSN      |

### Server-only

| Variable            | Description                |
| ------------------- | -------------------------- |
| `POLYGON_RPC_URL`   | Backend RPC URL            |
| `SLACK_WEBHOOK_URL` | Contact form notifications |
| `COINGECKO_API_KEY` | Price API access           |
| `CORS_ORIGIN`       | Allowed origin for API     |

See `.env.example` for complete list.

## 📖 Documentation

Visit our [documentation site](https://polyseal.vercel.app/docs) for:

- **Getting Started**: Set up your first attestation
- **Environment Setup**: Configure your development environment
- **API Reference**: Complete API documentation
- **Security**: Best practices and security guidelines

## 🎥 Demo Video

Watch our 2-minute demo: [Coming soon]

## 🏛️ Contract Addresses (Polygon Amoy)

- **EAS**: `0xb101275a60d8bfb14529C421899aD7CA1Ae5B5Fc`
- **Schema Registry**: `0x23c5701A1BDa89C61d181BD79E5203c730708AE7`
- **Polyseal Schema**: `0x27d06e3659317e9a4f8154d1e849eb53d43d91fb4f219884d1684f86d797804a`
- **SessionPay**: `0xE23EF3e9A5903cB8F68334FCAfDb89d50541d235`
- **Mock USDC**: `0xcF28F960aA85b051D030374B1ACd14668abaAf3e`

## 📊 Success Metrics

Track key metrics in PostHog:

- Unique visitors
- Wallets connected
- Schema reads / attestation lookups
- Contact form submissions
- Error rates

## 🛠️ Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details.

### Development Workflow

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Commit: `git commit -m 'Add amazing feature'`
5. Push: `git push origin feature/amazing-feature`
6. Open a Pull Request

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- [Website](https://polyseal.vercel.app)
- [Documentation](https://polyseal.vercel.app/docs)
- [GitHub](https://github.com/yourusername/polyseal)
- [Twitter](https://twitter.com/polyseal)

## 📧 Contact

For questions or partnerships, visit our [contact page](https://polyseal.vercel.app/contact).

## 🙏 Acknowledgments

- [Ethereum Attestation Service](https://attest.sh) for the attestation protocol
- [Polygon](https://polygon.technology) for the blockchain infrastructure
- [shadcn/ui](https://ui.shadcn.com) for the beautiful component library
- [RainbowKit](https://rainbowkit.com) for wallet connectivity

---

Built with ❤️ by the Polyseal team
