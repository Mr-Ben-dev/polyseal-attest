import { Link } from 'react-router-dom';
import { Shield, Github, Twitter, ExternalLink } from 'lucide-react';
import { ENV } from '@/lib/env';

export default function Footer() {
  const explorerLink = (address: string) => `${ENV.SCANNER}/address/${address}`;

  return (
    <footer className="border-t border-border mt-24">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-5 h-5 text-primary" />
              <span className="font-bold text-gradient">Polyseal</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Attestations, identity, and trust on Polygon.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Product</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/product" className="text-muted-foreground hover:text-foreground transition-colors">Features</Link></li>
              <li><Link to="/attestations" className="text-muted-foreground hover:text-foreground transition-colors">Attestations</Link></li>
              <li><Link to="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">Dashboard</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Contracts</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href={explorerLink(ENV.EAS)} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
                  EAS <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a href={explorerLink(ENV.REGISTRY)} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
                  Schema Registry <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a href={explorerLink(ENV.SESSIONPAY)} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
                  SessionPay <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/docs" className="text-muted-foreground hover:text-foreground transition-colors">Docs</Link></li>
              <li><Link to="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">Privacy</Link></li>
              <li><Link to="/terms" className="text-muted-foreground hover:text-foreground transition-colors">Terms</Link></li>
            </ul>
            <div className="flex items-center gap-3 mt-4">
              <a href="https://github.com" target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Polyseal. Built on Polygon Amoy testnet.</p>
        </div>
      </div>
    </footer>
  );
}
