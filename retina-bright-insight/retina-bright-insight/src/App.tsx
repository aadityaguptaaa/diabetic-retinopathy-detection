import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { MainLayout } from "@/components/Layout/MainLayout";
import { ProtectedRoute } from "@/components/ProtectedRoute";

// Pages
import LandingPage from "@/pages/LandingPage";
import LoginPage from "@/pages/LoginPage";
import SignupPage from "@/pages/SignupPage";
import PatientDashboard from "@/pages/PatientDashboard";
import UploadPage from "@/pages/UploadPage";
import ResultsPage from "@/pages/ResultsPage";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            
            {/* Protected Patient Routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute requiredRole="patient">
                <MainLayout>
                  <PatientDashboard />
                </MainLayout>
              </ProtectedRoute>
            } />
            <Route path="/upload" element={
              <ProtectedRoute>
                <MainLayout>
                  <UploadPage />
                </MainLayout>
              </ProtectedRoute>
            } />
            <Route path="/results" element={
              <ProtectedRoute>
                <MainLayout>
                  <ResultsPage />
                </MainLayout>
              </ProtectedRoute>
            } />
            <Route path="/reports" element={
              <ProtectedRoute>
                <MainLayout>
                  <div className="text-center py-20">
                    <h1 className="text-2xl font-bold text-foreground mb-4">My Reports</h1>
                    <p className="text-muted-foreground">Reports page coming soon...</p>
                  </div>
                </MainLayout>
              </ProtectedRoute>
            } />
            <Route path="/settings" element={
              <ProtectedRoute>
                <MainLayout>
                  <div className="text-center py-20">
                    <h1 className="text-2xl font-bold text-foreground mb-4">Settings</h1>
                    <p className="text-muted-foreground">Settings page coming soon...</p>
                  </div>
                </MainLayout>
              </ProtectedRoute>
            } />

            {/* Protected Clinician Routes */}
            <Route path="/clinician-dashboard" element={
              <ProtectedRoute requiredRole="clinician">
                <MainLayout>
                  <div className="text-center py-20">
                    <h1 className="text-2xl font-bold text-foreground mb-4">Clinician Dashboard</h1>
                    <p className="text-muted-foreground">Clinician dashboard coming soon...</p>
                  </div>
                </MainLayout>
              </ProtectedRoute>
            } />

            {/* Protected Admin Routes */}
            <Route path="/admin-dashboard" element={
              <ProtectedRoute requiredRole="admin">
                <MainLayout>
                  <div className="text-center py-20">
                    <h1 className="text-2xl font-bold text-foreground mb-4">Admin Dashboard</h1>
                    <p className="text-muted-foreground">Admin dashboard coming soon...</p>
                  </div>
                </MainLayout>
              </ProtectedRoute>
            } />
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
