import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Routes, Route } from "react-router-dom";
import AppShell from "./shell/AppShell";
import Home from "./pages/Home";
import Product from "./pages/Product";
import Attestations from "./pages/Attestations";
import Contracts from "./pages/Contracts";
import Docs from "./pages/Docs";
import Doc from "./pages/Doc";
import Dashboard from "./pages/Dashboard";
import Contact from "./pages/Contact";
import Legal from "./pages/Legal";
import NotFound from "./pages/NotFound";

const App = () => (
  <TooltipProvider>
    <Toaster />
    <Sonner />
    <AppShell>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product" element={<Product />} />
        <Route path="/attestations" element={<Attestations />} />
        <Route path="/contracts" element={<Contracts />} />
        <Route path="/docs" element={<Docs />} />
        <Route path="/docs/:slug" element={<Doc />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy" element={<Legal kind="privacy" />} />
        <Route path="/terms" element={<Legal kind="terms" />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AppShell>
  </TooltipProvider>
);

export default App;
