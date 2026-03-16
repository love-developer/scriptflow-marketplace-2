import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useStore } from "@/lib/store";

// Pages
import Home from "@/pages/Home";
import Pricing from "@/pages/Pricing";
import { Login, Register } from "@/pages/Auth";
import ItemDetail from "@/pages/ItemDetail";
import TestInterface from "@/pages/TestInterface";
import SellerProfile from "@/pages/SellerProfile";
import BuyerDashboard from "@/pages/dashboard/BuyerDashboard";
import BuyerSupport from "@/pages/dashboard/BuyerSupport";
import { SellerDashboard } from "@/pages/dashboard/SellerDashboard";
import SellerItems from "@/pages/dashboard/SellerItems";
import UploadWorkflow from "@/pages/dashboard/UploadWorkflow";
import { AdminDashboard } from "@/pages/admin/AdminDashboard";
import { AdminItems } from "@/pages/admin/AdminItems";
import { AdminUsers } from "@/pages/admin/AdminUsers";
import { AdminSellers } from "@/pages/admin/AdminSellers";
import { AdminWorkflows } from "@/pages/admin/AdminWorkflows";
import { AdminRobloxScripts } from "@/pages/admin/AdminRobloxScripts";
import { AdminPayments } from "@/pages/admin/AdminPayments";
import { AdminSupport } from "@/pages/admin/AdminSupport";
import { AdminModeration } from "@/pages/admin/AdminModeration";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient();

function ProtectedRoute({ children, allowedRoles }: { children: React.ReactNode; allowedRoles: string[] }) {
  const { currentUser } = useStore();
  const [, setLocation] = useLocation();

  if (!currentUser) {
    setTimeout(() => setLocation("/login"), 0);
    return null;
  }

  if (!allowedRoles.includes(currentUser.role)) {
    setTimeout(() => setLocation("/"), 0);
    return null;
  }

  return <>{children}</>;
}

function Router() {
  return (
    <Switch>
      {/* Public Routes */}
      <Route path="/" component={Home} />
      <Route path="/pricing" component={Pricing} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/item/:id" component={ItemDetail} />
      <Route path="/test/:id" component={TestInterface} />
      <Route path="/creator/:username" component={SellerProfile} />

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
      <Route path="/seller-dashboard/upload">
        <ProtectedRoute allowedRoles={["seller", "admin"]}>
          <UploadWorkflow />
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
