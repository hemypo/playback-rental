
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense, useEffect } from "react";
import { seedDatabase } from "./utils/seedDatabase";
import { CartProvider } from "./hooks/useCart";

// Pages
import Index from "./pages/Index";
const Catalog = lazy(() => import("./pages/Catalog"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const Checkout = lazy(() => import("./pages/Checkout"));
const Admin = lazy(() => import("./pages/Admin"));
const Login = lazy(() => import("./pages/Login"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const AdminProducts = lazy(() => import("./pages/admin/AdminProducts"));
const AdminBookings = lazy(() => import("./pages/admin/AdminBookings"));
const AdminCalendar = lazy(() => import("./pages/admin/AdminCalendar"));
const HowItWorks = lazy(() => import("./pages/HowItWorks"));
const Contact = lazy(() => import("./pages/Contact"));
import NotFound from "./pages/NotFound";

// Components
import Navbar from "./components/Navbar";
import RequireAuth from "./components/RequireAuth";

const Loading = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
  </div>
);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const App = () => {
  // Seed the database with initial data if empty
  useEffect(() => {
    seedDatabase().catch(console.error);
  }, []);

  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <CartProvider>
            <Navbar />
            <main className="pt-16">
              <Suspense fallback={<Loading />}>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/catalog" element={<Catalog />} />
                  <Route path="/product/:id" element={<ProductDetail />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/how-it-works" element={<HowItWorks />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/login" element={<Login />} />
                  
                  {/* Admin routes with authentication */}
                  <Route path="/admin" element={
                    <RequireAuth>
                      <Admin />
                    </RequireAuth>
                  } />
                  <Route path="/admin/dashboard" element={
                    <RequireAuth>
                      <AdminDashboard />
                    </RequireAuth>
                  } />
                  <Route path="/admin/products" element={
                    <RequireAuth>
                      <AdminProducts />
                    </RequireAuth>
                  } />
                  <Route path="/admin/bookings" element={
                    <RequireAuth>
                      <AdminBookings />
                    </RequireAuth>
                  } />
                  <Route path="/admin/calendar" element={
                    <RequireAuth>
                      <AdminCalendar />
                    </RequireAuth>
                  } />
                  
                  {/* Create a catch-all route that redirects to NotFound component */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </main>
            <Toaster />
            <Sonner />
          </CartProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
};

export default App;
