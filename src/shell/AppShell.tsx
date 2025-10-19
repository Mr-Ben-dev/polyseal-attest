import { ReactNode } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import Navbar from '@/ui/Navbar';
import Footer from '@/ui/Footer';
import { NetworkGuard } from '@/components/NetworkGuard';

interface AppShellProps {
  children: ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  return (
    <HelmetProvider>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <NetworkGuard />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </HelmetProvider>
  );
}
