
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ErrorProvider } from "@/contexts/ErrorContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { AuthRoute, PublicOnlyRoute } from "@/components/AuthRoute";
import { ErrorDisplay } from "@/components/ErrorDisplay";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { useState } from "react";

import Index from "./pages/Index";
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import Worldbuilding from "./pages/Worldbuilding";
import AppSidebar from "./components/AppSidebar";
import AccountSettings from "./components/AccountSettings";

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

const App = () => {
  const [isAccountSettingsOpen, setIsAccountSettingsOpen] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ErrorProvider>
          <AuthProvider>
            <Toaster />
            <Sonner />
            <ErrorDisplay />
            <BrowserRouter>
              <SidebarProvider>
                <div className="flex w-full min-h-screen">
                  <AppSidebar onOpenAccountSettings={() => setIsAccountSettingsOpen(true)} />
                  <SidebarInset>
                    <Routes>
                      <Route path="/" element={
                        <AuthRoute>
                          <Index />
                        </AuthRoute>
                      } />
                      <Route path="/worldbuilding" element={
                        <AuthRoute>
                          <Worldbuilding />
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
                  </SidebarInset>
                </div>
              </SidebarProvider>
            </BrowserRouter>
            
            <AccountSettings
              isOpen={isAccountSettingsOpen}
              onClose={() => setIsAccountSettingsOpen(false)}
              accountName="Demo User" // This will get overridden if user is available
            />
          </AuthProvider>
        </ErrorProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
