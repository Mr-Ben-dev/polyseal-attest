import { Link } from 'react-router-dom';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Shield } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 glass-card border-b border-border">
      <div className="container">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 text-xl font-bold">
            <Shield className="w-6 h-6 text-primary" />
            <span className="text-gradient">Polyseal</span>
          </Link>
          
          <div className="hidden md:flex items-center gap-6">
            <Link to="/product" className="text-foreground/80 hover:text-foreground transition-colors">
              Product
            </Link>
            <Link to="/attestations" className="text-foreground/80 hover:text-foreground transition-colors">
              Attestations
            </Link>
            <Link to="/contracts" className="text-foreground/80 hover:text-foreground transition-colors">
              Contracts
            </Link>
            <Link to="/docs" className="text-foreground/80 hover:text-foreground transition-colors">
              Docs
            </Link>
            <Link to="/dashboard" className="text-foreground/80 hover:text-foreground transition-colors">
              Dashboard
            </Link>
            <Link to="/contact" className="text-foreground/80 hover:text-foreground transition-colors">
              Contact
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <ConnectButton />
          </div>
        </div>
      </div>
    </nav>
  );
}
