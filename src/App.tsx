
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ErrorProvider } from "@/contexts/ErrorContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { AuthRoute, PublicOnlyRoute } from "@/components/AuthRoute";
import { ErrorDisplay } from "@/components/ErrorDisplay";

import Index from "./pages/Index";
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0
    }
  }
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ErrorProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <ErrorDisplay />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={
                <AuthRoute>
                  <Index />
                </AuthRoute>
              } />
              <Route path="/landing" element={<Landing />} />
              <Route path="/auth" element={
                <PublicOnlyRoute>
                  <Auth />
                </PublicOnlyRoute>
              } />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </ErrorProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
