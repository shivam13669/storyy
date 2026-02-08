import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import Index from "./pages/Index";
import DestinationsPage from "./pages/Destinations";
import DestinationDetailPage from "./pages/DestinationDetail";
import ContactPage from "./pages/Contact";
import ServicesPage from "./pages/Services";
import TestimonialsPage from "./pages/Testimonials";
import AboutPage from "./pages/About";
import CareersPage from "./pages/Careers";
import TermsAndConditionPage from "./pages/TermsAndCondition";
import PrivacyPolicyPage from "./pages/PrivacyPolicy";
import CookiePolicyPage from "./pages/CookiePolicy";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import SupportPage from "./pages/Support";
import NotFound from "./pages/NotFound";
import ScrollToTop from "./components/ScrollToTop";

const queryClient = new QueryClient();

import { CurrencyProvider } from "@/context/CurrencyContext";

const App = () => (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <CurrencyProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
              <ScrollToTop />
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/destinations" element={<DestinationsPage />} />
                <Route path="/destinations/:slug/:packageSlug" element={<DestinationDetailPage />} />
                <Route path="/destinations/:slug" element={<DestinationDetailPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/services" element={<ServicesPage />} />
                <Route path="/support" element={<SupportPage />} />
                <Route path="/testimonials" element={<TestimonialsPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/careers" element={<CareersPage />} />
                <Route path="/terms-and-condition" element={<TermsAndConditionPage />} />
                <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
                <Route path="/cookie-policy" element={<CookiePolicyPage />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </CurrencyProvider>
      </QueryClientProvider>
    </AuthProvider>
);

export default App;
