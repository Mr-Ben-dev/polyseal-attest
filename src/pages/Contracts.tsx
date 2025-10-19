import { motion } from 'framer-motion';
import { ExternalLink, Copy, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import { ENV } from '@/lib/env';
import SEO from '@/ui/SEO';
import { toast } from '@/hooks/use-toast';

export default function Contracts() {
  const explorerLink = (address: string) => `${ENV.SCANNER}/address/${address}`;
  const [copied, setCopied] = useState<string | null>(null);

  const copyAddress = (address: string, name: string) => {
    navigator.clipboard.writeText(address);
    setCopied(address);
    toast({
      title: 'Copied!',
      description: `${name} address copied to clipboard`,
    });
    setTimeout(() => setCopied(null), 2000);
  };

  const contracts = [
    {
      name: 'EAS',
      address: ENV.EAS,
      description: 'Ethereum Attestation Service main contract for creating and managing attestations.',
    },
    {
      name: 'SchemaRegistry',
      address: ENV.REGISTRY,
      description: 'Registry contract for managing attestation schemas and their definitions.',
    },
    {
      name: 'SessionPay',
      address: ENV.SESSIONPAY,
      description: 'Payment contract for session-based transactions and gasless experiences.',
    },
    {
      name: 'MockUSDC',
      address: ENV.MOCKUSDC,
      description: 'Test USDC token for development and testing on Polygon Amoy.',
    },
  ];

  return (
    <>
      <SEO title="Contracts — Polyseal" path="/contracts" />
      
      <div className="container py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto mb-12"
        >
          <h1 className="mb-4">Smart Contracts</h1>
          <p className="text-xl text-muted-foreground">
            All Polyseal contracts deployed on Polygon Amoy testnet. Verified and publicly accessible.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 max-w-4xl mx-auto">
          {contracts.map((contract, i) => (
            <motion.div
              key={contract.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-6"
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <h2 className="text-2xl font-bold mb-1">{contract.name}</h2>
                  <p className="text-sm text-muted-foreground">{contract.description}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                <code className="flex-1 text-sm break-all">{contract.address}</code>
                <button
                  onClick={() => copyAddress(contract.address, contract.name)}
                  className="p-2 hover:bg-background rounded transition-colors"
                  title="Copy address"
                >
                  {copied === contract.address ? (
                    <CheckCircle className="w-4 h-4 text-primary" />
                  ) : (
                    <Copy className="w-4 h-4 text-muted-foreground" />
                  )}
                </button>
                <a
                  href={explorerLink(contract.address)}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 hover:bg-background rounded transition-colors"
                  title="View on PolygonScan"
                >
                  <ExternalLink className="w-4 h-4 text-muted-foreground" />
                </a>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Network Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-card p-6 max-w-4xl mx-auto mt-8"
        >
          <h3 className="text-xl font-bold mb-4">Network Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Chain ID:</span>
              <span className="ml-2 font-mono font-medium">{ENV.CHAIN_ID}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Network:</span>
              <span className="ml-2 font-medium">Polygon Amoy Testnet</span>
            </div>
            <div className="md:col-span-2">
              <span className="text-muted-foreground">RPC URL:</span>
              <code className="ml-2 px-2 py-1 bg-muted rounded text-xs">{ENV.RPC}</code>
            </div>
            <div className="md:col-span-2">
              <span className="text-muted-foreground">Explorer:</span>
              <a
                href={ENV.SCANNER}
                target="_blank"
                rel="noreferrer"
                className="ml-2 text-primary hover:text-primary/80 inline-flex items-center gap-1"
              >
                {ENV.SCANNER}
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
}
