import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { BookOpen, Code, Shield, Settings } from 'lucide-react';
import SEO from '@/ui/SEO';

const docs = [
  {
    slug: 'getting-started',
    title: 'Getting Started',
    icon: BookOpen,
    description: 'Learn the basics and get your first attestation',
  },
  {
    slug: 'environment',
    title: 'Environment Setup',
    icon: Settings,
    description: 'Configure your development environment',
  },
  {
    slug: 'api',
    title: 'API Reference',
    icon: Code,
    description: 'Complete API documentation and examples',
  },
  {
    slug: 'security',
    title: 'Security',
    icon: Shield,
    description: 'Best practices and security guidelines',
  },
];

export default function Docs() {
  return (
    <>
      <SEO title="Documentation — Polyseal" path="/docs" />
      
      <div className="container py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto mb-12"
        >
          <h1 className="mb-4">Documentation</h1>
          <p className="text-xl text-muted-foreground">
            Everything you need to integrate Polyseal into your application. From setup to advanced features.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {docs.map((doc, i) => (
            <motion.div
              key={doc.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Link
                to={`/docs/${doc.slug}`}
                className="glass-card p-6 block hover:scale-105 transition-transform"
              >
                <doc.icon className="w-10 h-10 text-primary mb-4" />
                <h2 className="text-xl font-bold mb-2">{doc.title}</h2>
                <p className="text-muted-foreground">{doc.description}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </>
  );
}
