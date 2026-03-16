import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { useStore } from "@/lib/store";
import { useDarkMode } from "@/lib/darkMode";
import { LogOut, LayoutDashboard, Sun, Moon, Gamepad2, Sparkles, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Layout({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const { currentUser, logout } = useStore();
  const { dark, toggle } = useDarkMode();

  const getDashboardLink = () => {
    if (!currentUser) return null;
    if (currentUser.role === "admin") return "/admin";
    if (currentUser.role === "seller") return "/seller-dashboard";
    return "/dashboard";
  };

  const dashLink = getDashboardLink();

  const navLinks = [
    { href: "/", label: "Marketplace" },
    { href: "/pricing", label: "Roblox Plans" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Navbar */}
      <header className="sticky top-0 z-50 glass">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-8">
            <Link href="/" className="font-display font-bold text-xl tracking-tight flex items-center gap-2.5 flex-shrink-0">
              <div className="w-8 h-8 gradient-bg rounded-lg flex items-center justify-center shadow-lg shadow-primary/20">
                <span className="text-white text-xs font-bold">WX</span>
              </div>
              <span className="hidden sm:block">Workflux</span>
            </Link>
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map(l => (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    location === l.href
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  }`}
                >
                  {l.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* Dark mode toggle */}
            <button
              onClick={toggle}
              className="w-9 h-9 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
              title={dark ? "Switch to light mode" : "Switch to dark mode"}
            >
              {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {currentUser ? (
              <div className="flex items-center gap-2">
                {dashLink && (
                  <Link href={dashLink}>
                    <Button variant="outline" size="sm" className="hidden sm:flex items-center gap-1.5 h-9">
                      <LayoutDashboard className="w-3.5 h-3.5" />
                      Dashboard
                    </Button>
                  </Link>
                )}
                <div className="flex items-center gap-2 pl-2 border-l border-border ml-1">
                  <div className="w-8 h-8 rounded-full gradient-bg flex items-center justify-center text-white text-sm font-bold shadow">
                    {currentUser.username.charAt(0).toUpperCase()}
                  </div>
                  <div className="hidden sm:flex flex-col">
                    <span className="text-sm font-semibold leading-none">{currentUser.username}</span>
                    <span className="text-xs text-muted-foreground capitalize">{currentUser.role}</span>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => logout()} title="Logout" className="w-8 h-8">
                    <LogOut className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login">
                  <Button variant="ghost" size="sm" className="h-9">Log in</Button>
                </Link>
                <Link href="/register">
                  <Button size="sm" className="h-9 gradient-bg text-white border-0 hover:opacity-90 shadow-md shadow-primary/20">
                    Sign up
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile nav links */}
        <div className="md:hidden border-t border-border/50 px-4 py-2 flex gap-1">
          {navLinks.map(l => (
            <Link
              key={l.href}
              href={l.href}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                location === l.href ? "bg-primary/10 text-primary" : "text-muted-foreground"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>
      </header>

      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="border-t border-border bg-card mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div className="col-span-1 sm:col-span-2">
              <Link href="/" className="font-display font-bold text-xl tracking-tight mb-3 flex items-center gap-2">
                <div className="w-7 h-7 gradient-bg rounded-lg flex items-center justify-center">
                  <span className="text-white text-xs font-bold">WX</span>
                </div>
                Workflux
              </Link>
              <p className="text-muted-foreground text-sm max-w-xs">
                The premium marketplace for ComfyUI AI Workflows and exclusive Roblox scripts for serious players.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-muted-foreground">Platform</h4>
              <ul className="space-y-2.5 text-sm">
                <li><Link href="/" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5" />AI Workflows</Link></li>
                <li><Link href="/pricing" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5"><Gamepad2 className="w-3.5 h-3.5" />Roblox Plans</Link></li>
                <li><Link href="/login" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5"><Tag className="w-3.5 h-3.5" />Sell Workflows</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-muted-foreground">Legal</h4>
              <ul className="space-y-2.5 text-sm">
                <li><Link href="#" className="text-muted-foreground hover:text-primary transition-colors">Terms of Service</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-primary transition-colors">Privacy Policy</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-primary transition-colors">Support</Link></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
            <span>© {new Date().getFullYear()} Workflux. All rights reserved.</span>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              All systems operational
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
