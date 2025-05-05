
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ErrorProvider } from "@/contexts/ErrorContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { AuthRoute, PublicOnlyRoute } from "@/components/AuthRoute";
import { ErrorDisplay } from "@/components/ErrorDisplay";
import { useState } from "react";

// Import pages
import Index from "./pages/Index";
import Home from "./pages/Home";
import Upload from "./pages/Upload";
import Account from "./pages/Account";
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import Worldbuilding from "./pages/Worldbuilding";

// Import components
import Topbar from "./components/navigation/Topbar";

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

const PageWithTransition = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-[calc(100vh-4rem)] pt-0 animate-fade-in">
      {children}
    </div>
  );
};

const App = () => {
  // Always use development mode for testing
  const forceDevMode = true;
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ErrorProvider>
          <AuthProvider>
            <Toaster />
            <Sonner />
            <ErrorDisplay />
            <BrowserRouter>
              <div className="flex flex-col w-full min-h-screen">
                {/* Always show Topbar on all pages */}
                <Topbar />
                
                <Routes>
                  {/* Public routes */}
                  <Route path="/landing" element={<Landing />} />
                  <Route path="/auth" element={
                    <PublicOnlyRoute>
                      <PageWithTransition>
                        <Auth />
                      </PageWithTransition>
                    </PublicOnlyRoute>
                  } />
                  
                  {/* All authenticated routes with the topbar */}
                  <Route path="/" element={
                    <AuthRoute>
                      <PageWithTransition>
                        <Navigate to="/home" replace />
                      </PageWithTransition>
                    </AuthRoute>
                  } />
                  
                  <Route path="/home" element={
                    <AuthRoute>
                      <PageWithTransition>
                        <Home />
                      </PageWithTransition>
                    </AuthRoute>
                  } />
                  
                  <Route path="/projects" element={
                    <AuthRoute>
                      <PageWithTransition>
                        <Index />
                      </PageWithTransition>
                    </AuthRoute>
                  } />
                  
                  <Route path="/worldbuilding" element={
                    <AuthRoute>
                      <PageWithTransition>
                        <Worldbuilding />
                      </PageWithTransition>
                    </AuthRoute>
                  } />
                  
                  <Route path="/upload" element={
                    <AuthRoute>
                      <PageWithTransition>
                        <Upload />
                      </PageWithTransition>
                    </AuthRoute>
                  } />
                  
                  <Route path="/account" element={
                    <AuthRoute>
                      <PageWithTransition>
                        <Account />
                      </PageWithTransition>
                    </AuthRoute>
                  } />
                  
                  {/* Catch-all route */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </div>
            </BrowserRouter>
          </AuthProvider>
        </ErrorProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
