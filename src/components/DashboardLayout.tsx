import { ReactNode, useState } from "react";
import { Link, useLocation } from "wouter";
import { useStore } from "@/lib/store";
import { useDarkMode } from "@/lib/darkMode";
import {
  LayoutDashboard, Package, ShoppingBag, Settings,
  Users, CreditCard, LifeBuoy, ShieldAlert, FileCode2,
  LogOut, Menu, Upload, Award, FileText, BarChart2,
  Sun, Moon, ChevronRight, Sparkles, X
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface NavItem {
  name: string;
  href: string;
  icon: any;
  section?: string;
}

export function DashboardLayout({ children, role }: { children: ReactNode; role: "buyer" | "seller" | "admin" }) {
  const [location] = useLocation();
  const { logout, currentUser } = useStore();
  const { dark, toggle } = useDarkMode();
  const [mobileOpen, setMobileOpen] = useState(false);

  let navItems: NavItem[] = [];

  if (role === "buyer") {
    navItems = [
      { name: "My Library", href: "/dashboard", icon: ShoppingBag },
      { name: "Subscriptions", href: "/dashboard/subscriptions", icon: CreditCard },
      { name: "Support", href: "/dashboard/support", icon: LifeBuoy },
    ];
  } else if (role === "seller") {
    navItems = [
      { name: "Overview", href: "/seller-dashboard", icon: LayoutDashboard },
      { name: "My Workflows", href: "/seller-dashboard/items", icon: Package },
      { name: "Analytics", href: "/seller-dashboard/analytics", icon: BarChart2 },
      { name: "Upload Workflow", href: "/seller-dashboard/upload", icon: Upload },
    ];
  } else if (role === "admin") {
    navItems = [
      { name: "Dashboard", href: "/admin", icon: LayoutDashboard, section: "Overview" },
      { name: "Users", href: "/admin/users", icon: Users, section: "Management" },
      { name: "Sellers", href: "/admin/sellers", icon: Award, section: "Management" },
      { name: "Workflows", href: "/admin/workflows", icon: FileText, section: "Content" },
      { name: "Roblox Scripts", href: "/admin/roblox-scripts", icon: FileCode2, section: "Content" },
      { name: "Payments", href: "/admin/payments", icon: CreditCard, section: "Finance" },
      { name: "Support", href: "/admin/support", icon: LifeBuoy, section: "Operations" },
      { name: "Moderation", href: "/admin/moderation", icon: ShieldAlert, section: "Operations" },
    ];
  }

  const isActive = (item: NavItem) => {
    if (item.href === "/admin" || item.href === "/seller-dashboard" || item.href === "/dashboard") {
      return location === item.href;
    }
    return location.startsWith(item.href);
  };

  const SidebarContent = () => {
    const sections = role === "admin"
      ? [...new Set(navItems.map(i => i.section))]
      : [null];

    return (
      <>
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-border flex-shrink-0">
          <Link href="/" className="font-display font-bold text-lg flex items-center gap-2">
            <div className="w-7 h-7 gradient-bg rounded-lg flex items-center justify-center shadow shadow-primary/20">
              <span className="text-white text-xs font-bold">SF</span>
            </div>
            ScriptFlow
          </Link>
          <button
            onClick={toggle}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          >
            {dark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* User badge */}
        <div className="px-4 py-4 border-b border-border flex-shrink-0">
          <div className="flex items-center gap-3 bg-secondary/60 rounded-xl px-3 py-2.5">
            <div className="w-9 h-9 rounded-xl gradient-bg flex items-center justify-center text-white font-bold text-sm shadow shadow-primary/20 flex-shrink-0">
              {currentUser?.username.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold truncate leading-tight">{currentUser?.username}</p>
              <p className="text-xs text-muted-foreground truncate leading-tight capitalize">{currentUser?.level || currentUser?.role}</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <div className="flex-1 overflow-y-auto py-3 px-3 space-y-0.5">
          {sections.map(section => {
            const sectionItems = section ? navItems.filter(i => i.section === section) : navItems;
            return (
              <div key={section || "main"} className="mb-3">
                {section && (
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-3 py-1.5">
                    {section}
                  </p>
                )}
                {sectionItems.map(item => {
                  const active = isActive(item);
                  return (
                    <Link key={item.name} href={item.href} onClick={() => setMobileOpen(false)}>
                      <div className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer mb-0.5 ${
                        active
                          ? "gradient-bg text-white shadow shadow-primary/20"
                          : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                      }`}>
                        <item.icon className="w-4 h-4 flex-shrink-0" />
                        <span className="flex-1">{item.name}</span>
                        {active && <ChevronRight className="w-3.5 h-3.5 opacity-70" />}
                      </div>
                    </Link>
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border flex-shrink-0">
          <Link href="/" onClick={() => setMobileOpen(false)}>
            <Button variant="ghost" size="sm" className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground mb-1">
              <Sparkles className="w-4 h-4" />
              Back to Marketplace
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start gap-2 text-muted-foreground hover:text-destructive"
            onClick={() => logout()}
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </Button>
        </div>
      </>
    );
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop Sidebar */}
      <aside className="w-64 border-r border-border bg-card hidden md:flex flex-col fixed inset-y-0 z-30">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-72 bg-card border-r border-border flex flex-col shadow-2xl">
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main */}
      <main className="flex-1 md:pl-64 flex flex-col min-h-screen">
        {/* Mobile header */}
        <header className="h-14 border-b border-border bg-card/90 backdrop-blur flex items-center justify-between px-4 md:hidden sticky top-0 z-20">
          <Link href="/" className="font-display font-bold text-base flex items-center gap-2">
            <div className="w-6 h-6 gradient-bg rounded flex items-center justify-center">
              <span className="text-white text-[10px] font-bold">SF</span>
            </div>
            ScriptFlow
          </Link>
          <Button variant="ghost" size="icon" className="w-9 h-9" onClick={() => setMobileOpen(true)}>
            <Menu className="w-5 h-5" />
          </Button>
        </header>

        <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full">
          {children}
        </div>
      </main>
    </div>
  );
}
