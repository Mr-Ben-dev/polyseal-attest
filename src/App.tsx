import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import {
  Attestations,
  Home,
  NotFound,
  Product,
  LazyContact,
  LazyContracts,
  LazyDashboard,
  LazyDoc,
  LazyDocs,
  LazyIssue,
  LazyJudgeMode,
  LazyLegal
} from "./components/LazyComponents";
import AppShell from "./shell/AppShell";

// Loading fallback component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
  </div>
);

const App = () => (
  <TooltipProvider>
    <Toaster />
    <Sonner />
    <AppShell>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product" element={<Product />} />
          <Route path="/attestations" element={<Attestations />} />
          <Route path="/contracts" element={<LazyContracts />} />
          <Route path="/docs" element={<LazyDocs />} />
          <Route path="/docs/:slug" element={<LazyDoc />} />
          <Route path="/dashboard" element={<LazyDashboard />} />
          <Route path="/issue" element={<LazyIssue />} />
          <Route path="/demo" element={<LazyJudgeMode />} />
          <Route path="/contact" element={<LazyContact />} />
          <Route path="/privacy" element={<LazyLegal kind="privacy" />} />
          <Route path="/terms" element={<LazyLegal kind="terms" />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </AppShell>
  </TooltipProvider>
);

export default App;
