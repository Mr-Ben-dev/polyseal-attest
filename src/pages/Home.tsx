import { analytics } from '@/lib/analytics';
import SEO from '@/ui/SEO';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle, Code, Lock, Shield, Zap } from 'lucide-react';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  useEffect(() => {
    analytics.viewHome();
  }, []);

  return (
    <>
      <SEO title="Polyseal — On-chain attestations made simple" path="/" />
      
      {/* Hero Section */}
      <section className="container py-20 md:py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-4xl mx-auto"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full glass-card"
          >
            <Shield className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">Built on Polygon Amoy</span>
          </motion.div>

          <h1 className="mb-6 bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
            On-chain attestations
            <br />
            made simple
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Read, verify, and integrate EAS attestations in minutes. Polyseal provides the tools and infrastructure for building trust on Polygon.
          </p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap items-center justify-center gap-4"
          >
            <Link to="/product" className="btn btn-primary">
              Explore Product <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/attestations" className="btn btn-ghost">
              Try EAS Tools
            </Link>
            <ConnectButton />
          </motion.div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: Shield, title: 'Live on Amoy', desc: 'chainId 80002 • official RPC' },
            { icon: Lock, title: 'Secure API', desc: 'Serverless proxies hide secrets' },
            { icon: Code, title: 'Developer-first', desc: 'MDX docs + examples' },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="glass-card p-6 hover:scale-105 transition-transform"
            >
              <item.icon className="w-8 h-8 text-primary mb-3" />
              <h3 className="font-bold mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section className="container py-20">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="mb-4">Powerful features for Web3 builders</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to work with EAS attestations, from schema decoding to wallet integration.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              icon: Shield,
              title: 'EAS Native',
              desc: 'Schema decode and attestation reads on Polygon Amoy with full type safety.',
            },
            {
              icon: Lock,
              title: 'Secure Proxies',
              desc: 'Vercel Functions for price feeds and RPC calls without exposing API keys.',
            },
            {
              icon: Zap,
              title: 'Wallet UX',
              desc: 'RainbowKit + Wagmi for best-in-class wallet connection experience.',
            },
            {
              icon: Code,
              title: 'Developer Tools',
              desc: 'Complete MDX documentation with code examples and integration guides.',
            },
            {
              icon: CheckCircle,
              title: 'Production Ready',
              desc: 'Built with TypeScript, fully typed APIs, and comprehensive error handling.',
            },
            {
              icon: ArrowRight,
              title: 'Easy Integration',
              desc: 'Simple APIs and hooks to integrate attestations into your dApp.',
            },
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              viewport={{ once: true }}
              className="glass-card p-6 hover:scale-105 transition-all"
            >
              <feature.icon className="w-10 h-10 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="glass-card p-12 text-center max-w-3xl mx-auto"
        >
          <h2 className="mb-4">Ready to start building?</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Connect your wallet and explore the power of on-chain attestations.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link to="/docs" className="btn btn-primary">
              Read Documentation
            </Link>
            <Link to="/attestations" className="btn btn-ghost">
              View Live Demo
            </Link>
          </div>
        </motion.div>
      </section>
    </>
  );
}
