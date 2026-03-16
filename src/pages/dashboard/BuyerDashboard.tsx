import { DashboardLayout } from "@/components/DashboardLayout";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import {
  Download, ShoppingBag, Gamepad2, Sparkles, ArrowUpRight, CreditCard, Clock
} from "lucide-react";
import { toast } from "sonner";

export default function BuyerDashboard() {
  const { purchases, currentUser } = useStore();
  const myPurchases = purchases.filter(p => p.userId === currentUser?.id);
  const wfPurchases = myPurchases.filter(p => p.type === "ai_workflow");
  const hasSubscription = true; // mock

  const handleDownload = () => toast.success("Download started!");

  return (
    <DashboardLayout role="buyer">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold">
          Welcome, <span className="gradient-text">{currentUser?.username}</span> 👋
        </h1>
        <p className="text-muted-foreground mt-1">Manage your purchases and subscriptions</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 bg-violet-500/10 rounded-xl flex items-center justify-center">
              <Sparkles className="w-4.5 h-4.5 text-violet-500" />
            </div>
            <span className="text-sm text-muted-foreground font-medium">AI Workflows</span>
          </div>
          <p className="text-2xl font-bold">{wfPurchases.length}</p>
          <p className="text-xs text-muted-foreground mt-1">Purchased workflows</p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 bg-emerald-500/10 rounded-xl flex items-center justify-center">
              <Gamepad2 className="w-4.5 h-4.5 text-emerald-500" />
            </div>
            <span className="text-sm text-muted-foreground font-medium">Roblox Plan</span>
          </div>
          {hasSubscription ? (
            <>
              <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">Pro</p>
              <p className="text-xs text-muted-foreground mt-1">Active · Renews Apr 16</p>
            </>
          ) : (
            <>
              <p className="text-lg font-bold text-muted-foreground">No plan</p>
              <Link href="/pricing">
                <Button variant="link" size="sm" className="text-xs p-0 h-auto text-primary mt-1">Subscribe →</Button>
              </Link>
            </>
          )}
        </div>

        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 bg-blue-500/10 rounded-xl flex items-center justify-center">
              <CreditCard className="w-4.5 h-4.5 text-blue-500" />
            </div>
            <span className="text-sm text-muted-foreground font-medium">Total Spent</span>
          </div>
          <p className="text-2xl font-bold">${myPurchases.reduce((a, p) => a + p.price, 0).toFixed(2)}</p>
          <p className="text-xs text-muted-foreground mt-1">Lifetime</p>
        </div>
      </div>

      {/* Roblox subscription banner */}
      {hasSubscription && (
        <div className="gradient-bg rounded-2xl p-5 mb-8 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Gamepad2 className="w-7 h-7 opacity-80 flex-shrink-0" />
            <div>
              <p className="font-bold text-lg">Roblox Pro Subscription Active</p>
              <p className="text-sm opacity-80">You have access to 20+ premium scripts · Renews April 16, 2026</p>
            </div>
          </div>
          <Link href="/pricing">
            <Button variant="secondary" size="sm" className="text-foreground flex-shrink-0">
              Manage Plan
            </Button>
          </Link>
        </div>
      )}

      {/* Purchased workflows */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden mb-6">
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <h3 className="font-bold text-lg flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-muted-foreground" />
            Purchased Workflows
          </h3>
          <Link href="/">
            <Button variant="ghost" size="sm" className="text-muted-foreground gap-1">
              Browse more <ArrowUpRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>

        {myPurchases.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-secondary/30">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Item</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden sm:table-cell">Date</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Price</th>
                  <th className="text-right px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {myPurchases.map(purchase => (
                  <tr key={purchase.id} className="hover:bg-secondary/20 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-medium">{purchase.itemTitle}</p>
                      <span className="inline-block mt-0.5 px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-semibold rounded-full uppercase tracking-wider">
                        {purchase.type === "ai_workflow" ? "AI Workflow" : "Script"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground hidden sm:table-cell">
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        {new Date(purchase.date).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-semibold">${purchase.price.toFixed(2)}</td>
                    <td className="px-6 py-4 text-right">
                      <Button size="sm" variant="outline" onClick={handleDownload} className="gap-1.5">
                        <Download className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Download</span>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-16 text-center">
            <ShoppingBag className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground font-medium">No purchases yet</p>
            <p className="text-sm text-muted-foreground/70 mb-4">Browse the marketplace to find AI workflows</p>
            <Link href="/">
              <Button size="sm" className="gradient-bg text-white border-0">Browse Marketplace</Button>
            </Link>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
