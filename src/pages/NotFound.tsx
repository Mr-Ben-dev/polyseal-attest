import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Search } from 'lucide-react';
import SEO from '@/ui/SEO';

export default function NotFound() {
  return (
    <>
      <SEO title="404 — Page Not Found" />
      
      <div className="container py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card p-12 text-center max-w-2xl mx-auto"
        >
          <div className="text-8xl font-bold text-gradient mb-6">404</div>
          <h1 className="text-3xl font-bold mb-4">Page Not Found</h1>
          <p className="text-lg text-muted-foreground mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link to="/" className="btn btn-primary">
              <Home className="w-4 h-4" />
              Back to Home
            </Link>
            <Link to="/docs" className="btn btn-ghost">
              <Search className="w-4 h-4" />
              Browse Docs
            </Link>
          </div>
        </motion.div>
      </div>
    </>
  );
}
