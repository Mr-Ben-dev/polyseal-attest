import polyseaLogo from '@/assets/polyseal-logo.png';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 glass-card border-b border-border">
      <div className="container">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-3 text-xl font-bold group">
            <img 
              src={polyseaLogo} 
              alt="Polyseal" 
              className="w-8 h-8 transition-transform duration-300 group-hover:scale-110" 
            />
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
            <Link to="/issue" className="text-foreground/80 hover:text-foreground transition-colors">
              Issue
            </Link>
            <Link to="/contact" className="text-foreground/80 hover:text-foreground transition-colors">
              Contact
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <Link 
              to="/demo" 
              className="px-3 py-2 bg-primary/10 text-primary hover:bg-primary/20 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
            >
              <span className="text-xs">🎯</span>
              Judge Mode
            </Link>
            <ConnectButton />
          </div>
        </div>
      </div>
    </nav>
  );
}
