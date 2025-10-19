import { Link } from 'react-router-dom';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import polyseaLogo from '@/assets/polyseal-logo.png';

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
