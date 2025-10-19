import { NetworkGuard } from '@/components/NetworkGuard';
import Footer from '@/ui/Footer';
import Navbar from '@/ui/Navbar';
import { ReactNode } from 'react';
import { HelmetProvider } from 'react-helmet-async';

interface AppShellProps {
  children: ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  return (
    <HelmetProvider>
      <div className="flex flex-col min-h-screen">
        <a 
          href="#main-content" 
          className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:bg-blue-600 focus:text-white focus:px-3 focus:py-2 focus:rounded focus:text-sm"
        >
          Skip to main content
        </a>
        <Navbar />
        <NetworkGuard />
        <main id="main-content" className="flex-1" tabIndex={-1}>{children}</main>
        <Footer />
      </div>
    </HelmetProvider>
  );
}
