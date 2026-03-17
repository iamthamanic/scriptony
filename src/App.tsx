import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ErrorProvider } from "@/contexts/ErrorContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { CreativeGymProvider } from "@/contexts/creative-gym";
import { AuthRoute, PublicOnlyRoute } from "@/components/AuthRoute";
import { ErrorDisplay } from "@/components/ErrorDisplay";
import FeatureDetector from "@/components/admin/FeatureDetector";
import Topbar from "@/components/navigation/Topbar";

// Lazy load pages - Code Splitting by route
const Index = lazy(() => import("./pages/Index"));
const Projects = lazy(() => import("./pages/Projects"));
const Home = lazy(() => import("./pages/Home"));
const Upload = lazy(() => import("./pages/Upload"));
const Account = lazy(() => import("./pages/Account"));
const Landing = lazy(() => import("./pages/Landing"));
const Auth = lazy(() => import("./pages/Auth"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Worldbuilding = lazy(() => import("./pages/Worldbuilding"));
const CreativeGym = lazy(() => import("./pages/CreativeGym"));
const Admin = lazy(() => import("./pages/Admin"));
const AdminTests = lazy(() => import("./pages/AdminTests"));
const AdminUsage = lazy(() => import("./pages/AdminUsage"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0,
    },
  },
});

// DRY: Reusable loading fallback
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
  </div>
);

// DRY: Wrapper for page transitions
const PageWithTransition = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-[calc(100vh-4rem)] pt-0 animate-fade-in">
    {children}
  </div>
);

// DRY: Authenticated layout with Topbar
const AuthenticatedLayout = ({ children }: { children: React.ReactNode }) => (
  <>
    <Topbar />
    <PageWithTransition>{children}</PageWithTransition>
  </>
);

// DRY: Lazy route wrapper with Suspense
const LazyRoute = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<PageLoader />}>{children}</Suspense>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ErrorProvider>
        <BrowserRouter>
          <FeatureDetector />
          <AuthProvider>
            <CreativeGymProvider>
              <Toaster />
              <Sonner />
              <ErrorDisplay />
              <div className="flex flex-col w-full min-h-screen">
                <Routes>
                  {/* Root route */}
                  <Route
                    path="/"
                    element={
                      <AuthRoute>
                        <AuthenticatedLayout>
                          <LazyRoute>
                            <Home />
                          </LazyRoute>
                        </AuthenticatedLayout>
                      </AuthRoute>
                    }
                  />

                  {/* Public routes */}
                  <Route
                    path="/landing"
                    element={
                      <LazyRoute>
                        <Landing />
                      </LazyRoute>
                    }
                  />
                  <Route
                    path="/auth"
                    element={
                      <PublicOnlyRoute>
                        <PageWithTransition>
                          <LazyRoute>
                            <Auth />
                          </LazyRoute>
                        </PageWithTransition>
                      </PublicOnlyRoute>
                    }
                  />

                  {/* Authenticated routes */}
                  <Route
                    path="/home"
                    element={
                      <AuthRoute>
                        <AuthenticatedLayout>
                          <LazyRoute>
                            <Home />
                          </LazyRoute>
                        </AuthenticatedLayout>
                      </AuthRoute>
                    }
                  />
                  <Route
                    path="/projects"
                    element={
                      <AuthRoute>
                        <AuthenticatedLayout>
                          <LazyRoute>
                            <Projects />
                          </LazyRoute>
                        </AuthenticatedLayout>
                      </AuthRoute>
                    }
                  />
                  <Route
                    path="/worldbuilding"
                    element={
                      <AuthRoute>
                        <AuthenticatedLayout>
                          <LazyRoute>
                            <Worldbuilding />
                          </LazyRoute>
                        </AuthenticatedLayout>
                      </AuthRoute>
                    }
                  />
                  <Route
                    path="/creative-gym"
                    element={
                      <AuthRoute>
                        <AuthenticatedLayout>
                          <LazyRoute>
                            <CreativeGym />
                          </LazyRoute>
                        </AuthenticatedLayout>
                      </AuthRoute>
                    }
                  />
                  <Route
                    path="/upload"
                    element={
                      <AuthRoute>
                        <AuthenticatedLayout>
                          <LazyRoute>
                            <Upload />
                          </LazyRoute>
                        </AuthenticatedLayout>
                      </AuthRoute>
                    }
                  />
                  <Route
                    path="/account"
                    element={
                      <AuthRoute>
                        <AuthenticatedLayout>
                          <LazyRoute>
                            <Account />
                          </LazyRoute>
                        </AuthenticatedLayout>
                      </AuthRoute>
                    }
                  />

                  {/* Admin routes */}
                  <Route
                    path="/admin"
                    element={
                      <AuthRoute>
                        <AuthenticatedLayout>
                          <LazyRoute>
                            <Admin />
                          </LazyRoute>
                        </AuthenticatedLayout>
                      </AuthRoute>
                    }
                  />
                  <Route
                    path="/admin/tests"
                    element={
                      <AuthRoute>
                        <AuthenticatedLayout>
                          <LazyRoute>
                            <AdminTests />
                          </LazyRoute>
                        </AuthenticatedLayout>
                      </AuthRoute>
                    }
                  />
                  <Route
                    path="/admin/usage"
                    element={
                      <AuthRoute>
                        <AuthenticatedLayout>
                          <LazyRoute>
                            <AdminUsage />
                          </LazyRoute>
                        </AuthenticatedLayout>
                      </AuthRoute>
                    }
                  />

                  {/* Catch-all */}
                  <Route
                    path="*"
                    element={
                      <LazyRoute>
                        <NotFound />
                      </LazyRoute>
                    }
                  />
                </Routes>
              </div>
            </CreativeGymProvider>
          </AuthProvider>
        </BrowserRouter>
      </ErrorProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
