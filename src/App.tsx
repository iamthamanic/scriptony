
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ErrorProvider } from "@/contexts/ErrorContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { AuthRoute, PublicOnlyRoute } from "@/components/AuthRoute";
import { ErrorDisplay } from "@/components/ErrorDisplay";
import FeatureDetector from "@/components/admin/FeatureDetector";

// Import pages
import Index from "./pages/Index";
import Home from "./pages/Home";
import Upload from "./pages/Upload";
import Account from "./pages/Account";
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import Worldbuilding from "./pages/Worldbuilding";
import AdminTests from "./pages/AdminTests";

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

// Authenticated layout that includes the Topbar
const AuthenticatedLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Topbar />
      <PageWithTransition>
        {children}
      </PageWithTransition>
    </>
  );
};

const App = () => {
  console.log("App rendering");
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ErrorProvider>
          <BrowserRouter>
            {/* The FeatureDetector registers routes automatically */}
            <FeatureDetector />
            
            <AuthProvider>
              <Toaster />
              <Sonner />
              <ErrorDisplay />
              
              <div className="flex flex-col w-full min-h-screen">
                <Routes>
                  {/* Root route added to prevent 404 */}
                  <Route path="/" element={
                    <AuthRoute>
                      <AuthenticatedLayout>
                        <Home />
                      </AuthenticatedLayout>
                    </AuthRoute>
                  } />
                  
                  {/* Public routes without topbar */}
                  <Route path="/landing" element={<Landing />} />
                  <Route path="/auth" element={
                    <PublicOnlyRoute>
                      <PageWithTransition>
                        <Auth />
                      </PageWithTransition>
                    </PublicOnlyRoute>
                  } />
                  
                  {/* All authenticated routes with the topbar */}
                  
                  <Route path="/home" element={
                    <AuthRoute>
                      <AuthenticatedLayout>
                        <Home />
                      </AuthenticatedLayout>
                    </AuthRoute>
                  } />
                  
                  <Route path="/projects" element={
                    <AuthRoute>
                      <AuthenticatedLayout>
                        <Index />
                      </AuthenticatedLayout>
                    </AuthRoute>
                  } />
                  
                  <Route path="/worldbuilding" element={
                    <AuthRoute>
                      <AuthenticatedLayout>
                        <Worldbuilding />
                      </AuthenticatedLayout>
                    </AuthRoute>
                  } />
                  
                  <Route path="/upload" element={
                    <AuthRoute>
                      <AuthenticatedLayout>
                        <Upload />
                      </AuthenticatedLayout>
                    </AuthRoute>
                  } />
                  
                  <Route path="/account" element={
                    <AuthRoute>
                      <AuthenticatedLayout>
                        <Account />
                      </AuthenticatedLayout>
                    </AuthRoute>
                  } />
                  
                  <Route path="/admin/tests" element={
                    <AuthRoute>
                      <AuthenticatedLayout>
                        <AdminTests />
                      </AuthenticatedLayout>
                    </AuthRoute>
                  } />
                  
                  {/* Catch-all route */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </div>
            </AuthProvider>
          </BrowserRouter>
        </ErrorProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
