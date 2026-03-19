import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { PageTransition } from "@/components/ui/PageTransition";
import { PageLoading } from "@/components/ui/LoadingSpinner";
import { useStore } from "@/lib/store";
import { useState, useEffect } from "react";

// Pages
import Home from "@/pages/Home";
import Pricing from "@/pages/Pricing";
import { Login, Register } from "@/pages/Auth";
import ItemDetail from "@/pages/ItemDetail";
import TestInterface from "@/pages/TestInterface";
import SellerProfile from "@/pages/SellerProfile";
import SellerApplication from "@/pages/SellerApplication";
import BuyerDashboard from "@/pages/dashboard/BuyerDashboard";
import BuyerSupport from "@/pages/dashboard/BuyerSupport";
import BuyerSubscriptions from "@/pages/dashboard/BuyerSubscriptions";
import { SellerDashboard } from "@/pages/dashboard/SellerDashboard";
import SellerItems from "@/pages/dashboard/SellerItems";
import SellerAnalytics from "@/pages/dashboard/SellerAnalytics";
import UploadWorkflow from "@/pages/dashboard/UploadWorkflow";
import SellerWithdrawals from "@/pages/dashboard/SellerWithdrawals";
import { AdminDashboard } from "@/pages/admin/AdminDashboard";
import { AdminItems } from "@/pages/admin/AdminItems";
import { AdminUsers } from "@/pages/admin/AdminUsers";
import { AdminSellers } from "@/pages/admin/AdminSellers";
import AdminSellerApplications from "@/pages/admin/AdminSellerApplications";
import AdminUpload from "@/pages/admin/AdminUpload";
import { AdminWorkflows } from "@/pages/admin/AdminWorkflows";
import { AdminRobloxScripts } from "@/pages/admin/AdminRobloxScripts";
import { AdminPayments } from "@/pages/admin/AdminPayments";
import AdminWithdrawals from "@/pages/admin/AdminWithdrawals";
import { AdminSupport } from "@/pages/admin/AdminSupport";
import { AdminModeration } from "@/pages/admin/AdminModeration";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient();

function ProtectedRoute({ children, allowedRoles }: { children: React.ReactNode; allowedRoles: string[] }) {
  const { currentUser } = useStore();
  const [, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      if (!currentUser) {
        setLocation("/login");
      } else if (!allowedRoles.includes(currentUser.role)) {
        setLocation("/");
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [currentUser, allowedRoles, setLocation]);

  if (isLoading) {
    return <PageLoading message="Verifying access..." />;
  }

  if (!currentUser || !allowedRoles.includes(currentUser.role)) {
    return null;
  }

  return <PageTransition>{children}</PageTransition>;
}

function RouteWithTransition({ component: Component, ...props }: any) {
  return (
    <PageTransition>
      <Component {...props} />
    </PageTransition>
  );
}

function Router() {
  return (
    <Switch>
      {/* Public Routes */}
      <Route path="/" component={(props) => <RouteWithTransition component={Home} {...props} />} />
      <Route path="/pricing" component={(props) => <RouteWithTransition component={Pricing} {...props} />} />
      <Route path="/login" component={(props) => <RouteWithTransition component={Login} {...props} />} />
      <Route path="/register" component={(props) => <RouteWithTransition component={Register} {...props} />} />
      <Route path="/item/:id" component={(props) => <RouteWithTransition component={ItemDetail} {...props} />} />
      <Route path="/test/:id" component={(props) => <RouteWithTransition component={TestInterface} {...props} />} />
      <Route path="/creator/:username" component={(props) => <RouteWithTransition component={SellerProfile} {...props} />} />
      <Route path="/become-seller" component={(props) => <RouteWithTransition component={SellerApplication} {...props} />} />

      {/* Buyer Routes */}
      <Route path="/dashboard">
        <ProtectedRoute allowedRoles={["buyer", "seller", "admin"]}>
          <BuyerDashboard />
        </ProtectedRoute>
      </Route>
      <Route path="/dashboard/support">
        <ProtectedRoute allowedRoles={["buyer", "seller", "admin"]}>
          <BuyerSupport />
        </ProtectedRoute>
      </Route>
      <Route path="/dashboard/subscriptions">
        <ProtectedRoute allowedRoles={["buyer", "seller", "admin"]}>
          <BuyerSubscriptions />
        </ProtectedRoute>
      </Route>
      

      {/* Seller Routes */}
      <Route path="/seller-dashboard">
        <ProtectedRoute allowedRoles={["seller", "admin"]}>
          <SellerDashboard />
        </ProtectedRoute>
      </Route>
      <Route path="/seller-dashboard/items">
        <ProtectedRoute allowedRoles={["seller", "admin"]}>
          <SellerItems />
        </ProtectedRoute>
      </Route>
      <Route path="/seller-dashboard/analytics">
        <ProtectedRoute allowedRoles={["seller", "admin"]}>
          <SellerAnalytics />
        </ProtectedRoute>
      </Route>
      <Route path="/seller-dashboard/upload">
        <ProtectedRoute allowedRoles={["seller", "admin"]}>
          <UploadWorkflow />
        </ProtectedRoute>
      </Route>
      <Route path="/seller-dashboard/withdrawals">
        <ProtectedRoute allowedRoles={["seller", "admin"]}>
          <SellerWithdrawals />
        </ProtectedRoute>
      </Route>

      {/* Admin Routes */}
      <Route path="/admin">
        <ProtectedRoute allowedRoles={["admin"]}>
          <AdminDashboard />
        </ProtectedRoute>
      </Route>
      <Route path="/admin/users">
        <ProtectedRoute allowedRoles={["admin"]}>
          <AdminUsers />
        </ProtectedRoute>
      </Route>
      <Route path="/admin/sellers">
        <ProtectedRoute allowedRoles={["admin"]}>
          <AdminSellers />
        </ProtectedRoute>
      </Route>
      <Route path="/admin/seller-applications">
        <ProtectedRoute allowedRoles={["admin"]}>
          <AdminSellerApplications />
        </ProtectedRoute>
      </Route>
      <Route path="/admin/upload">
        <ProtectedRoute allowedRoles={["admin"]}>
          <AdminUpload />
        </ProtectedRoute>
      </Route>
      <Route path="/admin/workflows">
        <ProtectedRoute allowedRoles={["admin"]}>
          <AdminWorkflows />
        </ProtectedRoute>
      </Route>
      <Route path="/admin/items">
        <ProtectedRoute allowedRoles={["admin"]}>
          <AdminItems />
        </ProtectedRoute>
      </Route>
      <Route path="/admin/roblox-scripts">
        <ProtectedRoute allowedRoles={["admin"]}>
          <AdminRobloxScripts />
        </ProtectedRoute>
      </Route>
      <Route path="/admin/payments">
        <ProtectedRoute allowedRoles={["admin"]}>
          <AdminPayments />
        </ProtectedRoute>
      </Route>
      <Route path="/admin/withdrawals">
        <ProtectedRoute allowedRoles={["admin"]}>
          <AdminWithdrawals />
        </ProtectedRoute>
      </Route>
      <Route path="/admin/support">
        <ProtectedRoute allowedRoles={["admin"]}>
          <AdminSupport />
        </ProtectedRoute>
      </Route>
      <Route path="/admin/moderation">
        <ProtectedRoute allowedRoles={["admin"]}>
          <AdminModeration />
        </ProtectedRoute>
      </Route>

      {/* 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster position="top-center" richColors theme="system" />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
