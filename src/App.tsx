
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { 
  QueryClient, 
  QueryClientProvider 
} from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { DashboardFilterProvider } from '@/contexts/DashboardFilterContext';
import Index from "./pages/Index";
import Datasets from "./pages/Datasets";
import DatasetDetail from "./pages/dataset-detail";
import DatasetEditPage from "./pages/dataset-edit";
import UploadPage from "./pages/Upload";
import Api from "./pages/Api";
import About from "./pages/About";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import DatasetVerificationPage from "./pages/admin/DatasetVerification";

// Create a client with proper configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1
    }
  }
});

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <DashboardFilterProvider>
        <TooltipProvider>
          <AuthProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/datasets" element={<Datasets />} />
                <Route path="/datasets/:id" element={<DatasetDetail />} />
                <Route path="/datasets/edit/:id" element={<DatasetEditPage />} />
                <Route path="/upload" element={<UploadPage />} />
                <Route path="/api" element={<Api />} />
                <Route path="/about" element={<About />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/admin/verification" element={<DatasetVerificationPage />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </AuthProvider>
        </TooltipProvider>
      </DashboardFilterProvider>
    </QueryClientProvider>
  );
};

export default App;
