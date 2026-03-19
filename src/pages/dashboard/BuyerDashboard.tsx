import { DashboardLayout } from "@/components/DashboardLayout";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import {
  ShoppingBag, Gamepad2, Sparkles, ArrowUpRight, Clock, Copy, History, Crown, Shield, Zap
} from "lucide-react";
import { toast } from "sonner";

export default function BuyerDashboard() {
  const { purchases, currentUser, items, testHistory } = useStore();
  const myPurchases = purchases.filter(p => p.userId === currentUser?.id);
  const wfPurchases = myPurchases.filter(p => p.type === "ai_workflow");
  const myTestHistory = testHistory.filter(t => t.userId === currentUser?.id);
  
  // Get user's subscription plan
  const subscriptionPlan = currentUser?.subscriptionPlan || 'Free';
  
  // Count accessible scripts based on subscription
  const robloxScripts = items.filter(item => item.type === "roblox_script" && item.status === "Approved");
  const accessibleScripts = subscriptionPlan === 'Free' ? 3 : subscriptionPlan === 'Premium' ? 10 : robloxScripts.length;

  const handleCopyLoader = () => {
    // Mock script loader code
    const loaderCode = `-- ScriptFlow Loader\nloadstring(game:HttpGet("https://api.scriptflow.com/loader.lua"))()`;
    navigator.clipboard.writeText(loaderCode);
    toast.success("Script loader copied to clipboard!");
  };

  const getPlanColor = (plan: string) => {
    switch(plan) {
      case 'Premium+': return 'text-purple-600 bg-purple-50 border-purple-200';
      case 'Premium': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-300 bg-slate-800 border-slate-600';
    }
  };

  const getPlanIcon = (plan: string) => {
    switch(plan) {
      case 'Premium+': return <Crown className="w-4 h-4" />;
      case 'Premium': return <Shield className="w-4 h-4" />;
      default: return <Zap className="w-4 h-4" />;
    }
  };

  return (
    <DashboardLayout role="buyer">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold">
          Welcome, <span className="gradient-text">{currentUser?.username}</span> 👋
        </h1>
        <p className="text-muted-foreground mt-1">Manage your Roblox scripts and AI workflows</p>
      </div>

      {/* Subscription Plan Card */}
      <div className={`bg-card border rounded-2xl p-6 mb-8 ${getPlanColor(subscriptionPlan)}`}>
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              {getPlanIcon(subscriptionPlan)}
              <h2 className="text-xl font-bold">{subscriptionPlan} Plan</h2>
            </div>
            <p className="text-sm opacity-80">
              {subscriptionPlan === 'Free' ? 'Access to 3 scripts' : 
               subscriptionPlan === 'Premium' ? 'Access to 10 scripts and basic workflows' : 
               'Unlimited access to all scripts and workflows'}
            </p>
          </div>
          <Link href="/pricing">
            <Button variant="outline" className="gap-2">
              <ArrowUpRight className="w-4 h-4" />
              Change Plan
            </Button>
          </Link>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 bg-emerald-500/10 rounded-xl flex items-center justify-center">
              <Gamepad2 className="w-4.5 h-4.5 text-emerald-500" />
            </div>
            <span className="text-sm text-muted-foreground font-medium">Active Scripts</span>
          </div>
          <p className="text-2xl font-bold">{accessibleScripts}</p>
          <p className="text-xs text-muted-foreground mt-1">Of {robloxScripts.length} available</p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 bg-violet-500/10 rounded-xl flex items-center justify-center">
              <Sparkles className="w-4.5 h-4.5 text-violet-500" />
            </div>
            <span className="text-sm text-muted-foreground font-medium">Purchased Workflows</span>
          </div>
          <p className="text-2xl font-bold">{wfPurchases.length}</p>
          <p className="text-xs text-muted-foreground mt-1">AI workflows owned</p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 bg-blue-500/10 rounded-xl flex items-center justify-center">
              <History className="w-4.5 h-4.5 text-blue-500" />
            </div>
            <span className="text-sm text-muted-foreground font-medium">Test History</span>
          </div>
          <p className="text-2xl font-bold">{myTestHistory.length}</p>
          <p className="text-xs text-muted-foreground mt-1">Workflow tests</p>
        </div>
      </div>

      {/* Script Loader Section */}
      <div className="bg-card border border-border rounded-2xl p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Gamepad2 className="w-5 h-5 text-emerald-500" />
              Script Loader
            </h2>
            <p className="text-sm text-muted-foreground mt-1">Copy the loader to use your Roblox scripts</p>
          </div>
        </div>
        <div className="bg-secondary/50 rounded-lg p-4 font-mono text-sm mb-4">
          loadstring(game:HttpGet("https://api.scriptflow.com/loader.lua"))()
        </div>
        <Button onClick={handleCopyLoader} className="gap-2">
          <Copy className="w-4 h-4" />
          Copy Loader
        </Button>
      </div>

      {/* Your Active Scripts Section */}
      <div className="bg-card border border-border rounded-2xl p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Gamepad2 className="w-5 h-5 text-emerald-500" />
              👉 Your Active Scripts
            </h2>
            <p className="text-sm text-muted-foreground mt-1">Scripts available based on your subscription plan</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {robloxScripts.slice(0, 9).map((script, index) => {
            const isAccessible = index < accessibleScripts;
            return (
              <div key={script.id} className={`group bg-card border rounded-2xl p-4 transition-all card-hover ${
                isAccessible 
                  ? 'border-primary/30 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5' 
                  : 'border-border opacity-75'
              }`}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="font-display font-bold text-sm mb-1 line-clamp-2 group-hover:text-primary transition-colors">{script.title}</h4>
                    <p className="text-xs text-primary/70 font-semibold uppercase tracking-wider">{script.category}</p>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${
                    isAccessible 
                      ? 'bg-yellow-100 text-yellow-700 border border-yellow-200' 
                      : 'bg-secondary text-muted-foreground border border-border'
                  }`}>
                    {isAccessible ? '✅' : '🔒'} {isAccessible ? 'Active' : 'Locked'}
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-medium ${
                    isAccessible ? 'text-primary' : 'text-muted-foreground'
                  }`}>
                    {isAccessible ? 'Available' : subscriptionPlan === 'Free' ? 'Premium+' : 'Premium'}
                  </span>
                  <Button size="sm" variant="outline" className="text-xs h-7 px-2 hover:bg-primary/10 hover:border-primary/30 hover:text-primary">
                    View Details
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        {subscriptionPlan !== 'Premium+' && (
          <div className="mt-6 p-4 bg-primary/5 border border-primary/20 rounded-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-primary">
                  🔒 {robloxScripts.length - accessibleScripts} more scripts available
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Upgrade to {subscriptionPlan === 'Free' ? 'Premium' : 'Premium+'} to unlock all scripts
                </p>
              </div>
              <Link href="/pricing">
                <Button 
                  size="sm" 
                  className="gradient-bg text-white border-0 hover:opacity-90"
                >
                  Upgrade Plan
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Purchased Workflows */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden mb-8">
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <h3 className="font-bold text-lg flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-violet-500" />
            Your Purchased Workflows
          </h3>
          <Link href="/">
            <Button size="sm" variant="outline" className="gap-2">
              <ShoppingBag className="w-4 h-4" />
              Browse More
            </Button>
          </Link>
        </div>

        {wfPurchases.length > 0 ? (
          <div className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {wfPurchases.map(purchase => {
                const workflow = items.find(i => i.id === purchase.itemId);
                if (!workflow) return null;
                return (
                  <div key={purchase.id} className="border border-border rounded-lg p-4 hover:border-primary/50 transition-colors">
                    <div className="flex gap-4">
                      <img src={workflow.image} alt={workflow.title} className="w-16 h-16 rounded-lg object-cover" />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold truncate">{workflow.title}</h4>
                        <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{workflow.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs px-2 py-1 bg-violet-100 text-violet-700 rounded-full font-medium">
                            {workflow.workflowType}
                          </span>
                          <Link href={`/test/${workflow.id}`}>
                            <Button size="sm" variant="outline" className="gap-1">
                              <History className="w-3 h-3" />
                              Test
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="py-16 text-center">
            <Sparkles className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground font-medium">No workflows purchased yet</p>
            <p className="text-sm text-muted-foreground/70 mb-4">Test and buy AI workflows to enhance your creativity</p>
            <Link href="/">
              <Button size="sm" className="gradient-bg text-white border-0">Browse Workflows</Button>
            </Link>
          </div>
        )}
      </div>

      {/* Test History */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <h3 className="font-bold text-lg flex items-center gap-2">
            <History className="w-5 h-5 text-blue-500" />
            Recent Test History
          </h3>
        </div>

        {myTestHistory.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-secondary/30">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Workflow</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden sm:table-cell">Date</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Result</th>
                  <th className="text-right px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {myTestHistory.slice(0, 5).map(test => (
                  <tr key={test.id} className="hover:bg-secondary/20 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-medium whitespace-nowrap">{test.workflowTitle}</p>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground hidden sm:table-cell">
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        {new Date(test.testDate).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground text-xs max-w-xs truncate">
                      {test.result || 'Processing...'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                        test.success 
                          ? 'bg-emerald-100 text-emerald-700' 
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {test.success ? 'Success' : 'Failed'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-16 text-center">
            <History className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground font-medium">No test history yet</p>
            <p className="text-sm text-muted-foreground/70 mb-4">Test workflows to see your activity here</p>
            <Link href="/">
              <Button size="sm" variant="outline">Browse Workflows</Button>
            </Link>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
