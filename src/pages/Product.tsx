import { motion } from 'framer-motion';
import { Shield, Lock, Code, Zap, Database, CheckCircle } from 'lucide-react';
import SEO from '@/ui/SEO';

export default function Product() {
  return (
    <>
      <SEO title="Product — Polyseal" path="/product" description="Deep dive into Polyseal features and capabilities" />
      
      <div className="container py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="mb-6">What is Polyseal?</h1>
          <p className="text-xl text-muted-foreground mb-12">
            Polyseal is a lightweight toolkit for reading and verifying EAS attestations with secure serverless APIs and a polished React frontend. Built specifically for Polygon Amoy, it provides everything you need to integrate attestations into your dApp.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {[
            {
              icon: Shield,
              title: 'EAS Native',
              desc: 'Schema decode and attestation reads on Polygon Amoy. Full integration with the Ethereum Attestation Service.',
            },
            {
              icon: Lock,
              title: 'Secure Proxies',
              desc: 'Vercel Functions for price feeds and RPC calls without exposing API keys to the client.',
            },
            {
              icon: Zap,
              title: 'Wallet UX',
              desc: 'RainbowKit + Wagmi for a best-in-class wallet connection experience with support for all major wallets.',
            },
            {
              icon: Code,
              title: 'TypeScript First',
              desc: 'Fully typed APIs and components with excellent IntelliSense support for a superior developer experience.',
            },
            {
              icon: Database,
              title: 'On-chain Data',
              desc: 'Direct reads from Polygon Amoy for real-time attestation data with proper error handling.',
            },
            {
              icon: CheckCircle,
              title: 'Production Ready',
              desc: 'Battle-tested code with comprehensive error handling, rate limiting, and security best practices.',
            },
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="glass-card p-6"
            >
              <feature.icon className="w-10 h-10 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* How it Works */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <h2 className="mb-8 text-center">How it works</h2>
          
          <div className="space-y-8">
            {[
              {
                step: '01',
                title: 'Connect Your Wallet',
                desc: 'Use RainbowKit to connect any Ethereum wallet. Automatically detects network and prompts to switch to Polygon Amoy if needed.',
              },
              {
                step: '02',
                title: 'Query Attestations',
                desc: 'Use our APIs to fetch attestations by UID or address. Schema decoding happens automatically using the SchemaRegistry contract.',
              },
              {
                step: '03',
                title: 'Verify & Display',
                desc: 'All attestation data is verified on-chain. Display attestations in your UI with built-in components and hooks.',
              },
              {
                step: '04',
                title: 'Integrate Seamlessly',
                desc: 'Use our serverless functions to proxy API calls, keeping your keys secure while providing fast responses.',
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="glass-card p-6 flex gap-6"
              >
                <div className="text-4xl font-bold text-primary/30">{item.step}</div>
                <div>
                  <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Tech Stack */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-20 max-w-4xl mx-auto"
        >
          <h2 className="mb-8 text-center">Built with modern tools</h2>
          
          <div className="glass-card p-8">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {[
                'React + TypeScript',
                'Vite',
                'RainbowKit',
                'Wagmi + Viem',
                'TanStack Query',
                'Framer Motion',
                'Vercel Functions',
                'Polygon Amoy',
                'EAS Protocol',
              ].map((tech, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  viewport={{ once: true }}
                  className="flex items-center gap-2"
                >
                  <CheckCircle className="w-5 h-5 text-primary" />
                  <span className="font-medium">{tech}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
}
