import { DashboardLayout } from "@/components/DashboardLayout";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import {
  Download, ShoppingBag, Gamepad2, Sparkles, ArrowUpRight, CreditCard, Clock, Star, TrendingUp
} from "lucide-react";
import { toast } from "sonner";

export default function BuyerDashboard() {
  const { purchases, currentUser, items } = useStore();
  const myPurchases = purchases.filter(p => p.userId === currentUser?.id);
  const wfPurchases = myPurchases.filter(p => p.type === "ai_workflow");
  const hasSubscription = true; // mock

  // Filter items for marketplace
  const robloxScripts = items.filter(item => item.type === "roblox_script" && item.status === "Approved");
  const workflows = items.filter(item => item.type === "ai_workflow" && item.status === "Approved");

  // Top scripts (by rating and test count)
  const topRobloxScripts = [...robloxScripts]
    .sort((a, b) => (b.rating * b.testCount) - (a.rating * a.testCount))
    .slice(0, 6);
  
  const topWorkflows = [...workflows]
    .sort((a, b) => (b.rating * b.testCount) - (a.rating * a.testCount))
    .slice(0, 4);

  const handleDownload = () => toast.success("Download started!");

  return (
    <DashboardLayout role="buyer">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold">
          Welcome, <span className="gradient-text">{currentUser?.username}</span> 👋
        </h1>
        <p className="text-muted-foreground mt-1">Discover premium Roblox scripts and AI workflows</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 bg-emerald-500/10 rounded-xl flex items-center justify-center">
              <Gamepad2 className="w-4.5 h-4.5 text-emerald-500" />
            </div>
            <span className="text-sm text-muted-foreground font-medium">Roblox Scripts</span>
          </div>
          <p className="text-2xl font-bold">{robloxScripts.length}</p>
          <p className="text-xs text-muted-foreground mt-1">Available scripts</p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 bg-violet-500/10 rounded-xl flex items-center justify-center">
              <Sparkles className="w-4.5 h-4.5 text-violet-500" />
            </div>
            <span className="text-sm text-muted-foreground font-medium">AI Workflows</span>
          </div>
          <p className="text-2xl font-bold">{workflows.length}</p>
          <p className="text-xs text-muted-foreground mt-1">Available workflows</p>
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

      {/* Roblox Scripts Section - Priority */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Gamepad2 className="w-5 h-5 text-emerald-500" />
              Top Roblox Scripts
            </h2>
            <p className="text-sm text-muted-foreground mt-1">Premium gaming scripts and tools</p>
          </div>
          <TrendingUp className="w-5 h-5 text-emerald-500" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {topRobloxScripts.map(script => (
            <div key={script.id} className="bg-card border border-border rounded-xl p-4 hover:border-primary/50 transition-colors">
              <div className="flex gap-4">
                <img src={script.image} alt={script.title} className="w-16 h-16 rounded-lg object-cover" />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm truncate">{script.title}</h3>
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{script.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-yellow-500 fill-current" />
                      <span className="text-xs font-medium">{script.rating}</span>
                      <span className="text-xs text-muted-foreground">({script.testCount})</span>
                    </div>
                    <span className="text-sm font-bold text-emerald-600">${script.price}</span>
                  </div>
                  <Link href={`/item/${script.id}`}>
                    <Button size="sm" className="w-full mt-2 text-xs">View Script</Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Workflows Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-violet-500" />
              Top AI Workflows
            </h2>
            <p className="text-sm text-muted-foreground mt-1">High-quality AI automation workflows</p>
          </div>
          <TrendingUp className="w-5 h-5 text-violet-500" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {topWorkflows.map(workflow => (
            <div key={workflow.id} className="bg-card border border-border rounded-xl p-4 hover:border-primary/50 transition-colors">
              <div className="flex gap-4">
                <img src={workflow.image} alt={workflow.title} className="w-16 h-16 rounded-lg object-cover" />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm truncate">{workflow.title}</h3>
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{workflow.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-yellow-500 fill-current" />
                      <span className="text-xs font-medium">{workflow.rating}</span>
                      <span className="text-xs text-muted-foreground">({workflow.testCount})</span>
                    </div>
                    <span className="text-sm font-bold text-violet-600">${workflow.price}</span>
                  </div>
                  <Link href={`/item/${workflow.id}`}>
                    <Button size="sm" className="w-full mt-2 text-xs">View Workflow</Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Purchased Items */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <h3 className="font-bold text-lg flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-muted-foreground" />
            Your Purchases
          </h3>
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
                        {purchase.type === "ai_workflow" ? "AI Workflow" : "Roblox Script"}
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
            <p className="text-sm text-muted-foreground/70 mb-4">Browse the marketplace to find Roblox scripts and AI workflows</p>
            <Link href="/">
              <Button size="sm" className="gradient-bg text-white border-0">Browse Marketplace</Button>
            </Link>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
