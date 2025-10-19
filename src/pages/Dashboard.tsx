import { motion } from 'framer-motion';
import { useAccount } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Wallet, TrendingUp, Shield, Clock } from 'lucide-react';
import SEO from '@/ui/SEO';

export default function Dashboard() {
  const { address, isConnected } = useAccount();

  return (
    <>
      <SEO title="Dashboard — Polyseal" path="/dashboard" />
      
      <div className="container py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="mb-4">Dashboard</h1>
          <p className="text-xl text-muted-foreground mb-12">
            {isConnected
              ? 'View your attestations and on-chain activity.'
              : 'Connect your wallet to view personalized data and attestations.'}
          </p>
        </motion.div>

        {!isConnected ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-12 text-center max-w-2xl mx-auto"
          >
            <Wallet className="w-16 h-16 text-primary mx-auto mb-6" />
            <h2 className="text-2xl font-bold mb-4">Connect Your Wallet</h2>
            <p className="text-muted-foreground mb-8">
              Connect your wallet to view your attestations, transaction history, and personalized data.
            </p>
            <ConnectButton />
          </motion.div>
        ) : (
          <>
            {/* Wallet Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass-card p-6 max-w-4xl mx-auto mb-6"
            >
              <div className="flex items-center gap-3 mb-2">
                <Wallet className="w-6 h-6 text-primary" />
                <h2 className="text-xl font-bold">Connected Wallet</h2>
              </div>
              <code className="text-sm px-3 py-2 bg-muted rounded block break-all">
                {address}
              </code>
            </motion.div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {[
                {
                  icon: Shield,
                  title: 'Attestations',
                  value: '—',
                  subtitle: 'Coming soon',
                },
                {
                  icon: TrendingUp,
                  title: 'Activity',
                  value: '—',
                  subtitle: 'Coming soon',
                },
                {
                  icon: Clock,
                  title: 'Recent',
                  value: '—',
                  subtitle: 'Coming soon',
                },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  className="glass-card p-6"
                >
                  <stat.icon className="w-8 h-8 text-primary mb-3" />
                  <div className="text-3xl font-bold mb-1">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.title}</div>
                  <div className="text-xs text-muted-foreground/60 mt-1">{stat.subtitle}</div>
                </motion.div>
              ))}
            </div>

            {/* Recent Activity Placeholder */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="glass-card p-6 max-w-4xl mx-auto mt-6"
            >
              <h2 className="text-xl font-bold mb-4">Recent Attestations</h2>
              <div className="text-center py-12 text-muted-foreground">
                <p>Recent attestations will appear here.</p>
                <p className="text-sm mt-2">This feature is coming soon.</p>
              </div>
            </motion.div>
          </>
        )}
      </div>
    </>
  );
}
