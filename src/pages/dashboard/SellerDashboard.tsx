import { Link } from "wouter";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import {
  DollarSign, Package, TrendingUp,
  Upload, Eye, ArrowUpRight, Clock, CheckCircle, XCircle
} from "lucide-react";

export function SellerDashboard() {
  const { items, currentUser, purchases, calculateSellerBalance } = useStore();
  const myItems = items.filter(i => i.sellerId === currentUser?.id);

  const approved = myItems.filter(i => i.status === "Approved");
  const pending = myItems.filter(i => i.status === "Pending");
  const rejected = myItems.filter(i => i.status === "Rejected");

  // Calculate actual sales and revenue from purchases (both AI workflows and Roblox scripts)
  const mySales = purchases.filter(p => {
    const item = myItems.find(i => i.id === p.itemId);
    return item && item.sellerId === currentUser?.id;
  });
  
  const totalRevenue = mySales.reduce((sum, sale) => sum + sale.price, 0);
  const totalSales = mySales.length;
  const uniqueCustomers = new Set(mySales.map(s => s.userId)).size;
  
  // Get balance information
  const balanceInfo = currentUser?.role === 'seller' ? calculateSellerBalance(currentUser.id) : {
    totalRevenue: 0,
    totalWithdrawn: 0,
    availableBalance: 0,
    pendingBalance: 0
  };

  const stats = [
    { 
      label: "Total Revenue", 
      value: `$${balanceInfo.totalRevenue.toFixed(2)}`, 
      sub: `From ${totalSales} sales`, 
      icon: DollarSign, 
      color: "text-emerald-500", 
      bg: "bg-emerald-500/10",
      trend: totalSales > 0 ? "+" + totalSales : "0"
    },
    { 
      label: "Available Balance", 
      value: `$${balanceInfo.availableBalance.toFixed(2)}`, 
      sub: `Ready to withdraw`, 
      icon: DollarSign, 
      color: "text-blue-500", 
      bg: "bg-blue-500/10",
      trend: balanceInfo.pendingBalance > 0 ? "$" + balanceInfo.pendingBalance.toFixed(2) + " pending" : "Available"
    },
    { 
      label: "Active Workflows", 
      value: approved.length.toString(), 
      sub: `${pending.length} pending, ${rejected.length} rejected`, 
      icon: Package, 
      color: "text-violet-500", 
      bg: "bg-violet-500/10",
      trend: myItems.length + " total"
    },
    { 
      label: "Total Downloads", 
      value: myItems.reduce((sum, item) => sum + item.testCount, 0).toString(), 
      sub: "All-time tests", 
      icon: TrendingUp, 
      color: "text-pink-500", 
      bg: "bg-pink-500/10",
      trend: uniqueCustomers + " customers"
    },
  ];

  const statusBadge = (status: string) => {
    const map: Record<string, string> = {
      Approved: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
      Pending: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
      Rejected: "bg-red-500/15 text-red-600 dark:text-red-400",
    };
    return map[status] || "bg-secondary text-foreground";
  };

  return (
    <DashboardLayout role="seller">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">
            Welcome back, <span className="gradient-text">{currentUser?.username}</span> 👋
          </h1>
          <p className="text-muted-foreground mt-1">{currentUser?.level || "Seller"} · Here's how your workflows are performing</p>
        </div>
        <Link href="/seller-dashboard/upload">
          <Button className="gradient-bg text-white border-0 hover:opacity-90 shadow-md shadow-primary/20 gap-2 flex-shrink-0">
            <Upload className="w-4 h-4" />
            Upload Workflow
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        {stats.map(s => (
          <div key={s.label} className="bg-card border border-border rounded-2xl p-5 stat-card-glow hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 group cursor-pointer">
            <div className="flex items-start justify-between mb-4">
              <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                <s.icon className={`w-5 h-5 ${s.color}`} />
              </div>
              <div className="flex items-center gap-1">
                {s.trend && (
                  <span className="text-xs font-medium text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-full">
                    {s.trend}
                  </span>
                )}
                <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-1">{s.label}</p>
            <p className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors">{s.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Link href="/seller-dashboard/upload">
          <div className="gradient-bg rounded-2xl p-5 text-white cursor-pointer hover:opacity-90 transition-all duration-300 hover:scale-105 shadow-lg shadow-primary/20">
            <Upload className="w-6 h-6 mb-3 opacity-80" />
            <p className="font-bold">Upload New</p>
            <p className="text-sm opacity-70 mt-0.5">Add workflow</p>
          </div>
        </Link>
        <Link href="/seller-dashboard/items">
          <div className="bg-card border border-border rounded-2xl p-5 cursor-pointer hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 group">
            <Package className="w-6 h-6 mb-3 text-muted-foreground group-hover:text-primary transition-colors" />
            <p className="font-bold group-hover:text-primary transition-colors">Manage Items</p>
            <p className="text-sm text-muted-foreground mt-0.5">{myItems.length} listings</p>
          </div>
        </Link>
        <Link href="/seller-dashboard/analytics">
          <div className="bg-card border border-border rounded-2xl p-5 cursor-pointer hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 group">
            <TrendingUp className="w-6 h-6 mb-3 text-muted-foreground group-hover:text-primary transition-colors" />
            <p className="font-bold group-hover:text-primary transition-colors">Analytics</p>
            <p className="text-sm text-muted-foreground mt-0.5">View insights</p>
          </div>
        </Link>
        <Link href="/seller-dashboard/withdrawals">
          <div className="bg-card border border-border rounded-2xl p-5 cursor-pointer hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 group">
            <DollarSign className="w-6 h-6 mb-3 text-muted-foreground group-hover:text-primary transition-colors" />
            <p className="font-bold group-hover:text-primary transition-colors">Withdrawals</p>
            <p className="text-sm text-muted-foreground mt-0.5">${balanceInfo.availableBalance.toFixed(2)} available</p>
          </div>
        </Link>
      </div>

      {/* Performance Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Recent Performance */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Performance Overview
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
              <span className="text-sm text-muted-foreground">Conversion Rate</span>
              <span className="font-bold text-emerald-600">
                {myItems.reduce((sum, item) => sum + item.testCount, 0) > 0 
                  ? ((totalSales / myItems.reduce((sum, item) => sum + item.testCount, 0)) * 100).toFixed(1) 
                  : '0.0'}%
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
              <span className="text-sm text-muted-foreground">Average Sale Price</span>
              <span className="font-bold text-blue-600">
                ${totalSales > 0 ? (totalRevenue / totalSales).toFixed(2) : '0.00'}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
              <span className="text-sm text-muted-foreground">Customer Retention</span>
              <span className="font-bold text-violet-600">
                {uniqueCustomers > 0 ? Math.round((totalSales / uniqueCustomers) * 10) / 10 : 0} sales/customer
              </span>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <Package className="w-5 h-5 text-primary" />
            Item Status Breakdown
          </h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
              <span className="text-sm text-muted-foreground flex-1">Approved</span>
              <span className="font-bold">{approved.length}</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-amber-500"></div>
              <span className="text-sm text-muted-foreground flex-1">Pending Review</span>
              <span className="font-bold">{pending.length}</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span className="text-sm text-muted-foreground flex-1">Rejected</span>
              <span className="font-bold">{rejected.length}</span>
            </div>
            <div className="pt-3 mt-3 border-t border-border">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Approval Rate</span>
                <span className="font-bold text-emerald-600">
                  {myItems.length > 0 ? Math.round((approved.length / myItems.length) * 100) : 0}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Workflows table */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-border bg-gradient-to-r from-secondary/30 to-secondary/10 flex items-center justify-between">
          <h3 className="font-bold text-sm lg:text-base flex items-center gap-2">
            <Package className="w-4 h-4 text-primary" />
            My Workflows
          </h3>
          <Link href="/seller-dashboard/items">
            <Button variant="ghost" size="sm" className="text-muted-foreground gap-1 px-2 hover:bg-primary/10 hover:text-primary">
              View all <ArrowUpRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>
        <div className="overflow-x-auto">
          {myItems.length === 0 ? (
            <div className="py-16 text-center">
              <div className="w-20 h-20 bg-secondary/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Package className="w-10 h-10 text-muted-foreground/40" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">No workflows yet</h3>
              <p className="text-muted-foreground mb-6 max-w-sm mx-auto">Upload your first workflow to start selling and earning from your creations</p>
              <Link href="/seller-dashboard/upload">
                <Button className="gradient-bg text-white border-0 hover:opacity-90 gap-2 shadow-md shadow-primary/20">
                  <Upload className="w-4 h-4" />
                  Upload Your First Workflow
                </Button>
              </Link>
            </div>
          ) : (
            <div className="min-w-[600px]">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-secondary/20">
                    <th className="text-left px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Workflow</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Price</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden sm:table-cell">Views</th>
                    <th className="text-right px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Sales</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {myItems.slice(0, 5).map(item => (
                    <tr key={item.id} className="hover:bg-secondary/10 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-secondary overflow-hidden flex-shrink-0 group-hover:scale-105 transition-transform">
                            <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <p className="font-semibold text-foreground leading-tight whitespace-nowrap group-hover:text-primary transition-colors">{item.title}</p>
                            <p className="text-xs text-muted-foreground whitespace-nowrap">{item.category}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${statusBadge(item.status)}`}>
                          {item.status === "Approved" && <CheckCircle className="w-3.5 h-3.5" />}
                          {item.status === "Pending" && <Clock className="w-3.5 h-3.5" />}
                          {item.status === "Rejected" && <XCircle className="w-3.5 h-3.5" />}
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-bold text-foreground">${item.price.toFixed(2)}</span>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground hidden sm:table-cell">
                        <div className="flex items-center gap-1.5 bg-secondary/30 px-2 py-1 rounded-lg">
                          <Eye className="w-3.5 h-3.5" />
                          <span className="font-medium">{item.testCount}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5 bg-emerald-500/10 px-2 py-1.5 rounded-lg">
                          <span className="font-bold text-emerald-600 dark:text-emerald-400">
                            {mySales.filter(sale => sale.itemId === item.id).length}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {myItems.length > 5 && (
                <div className="px-6 py-4 border-t border-border bg-secondary/10">
                  <Link href="/seller-dashboard/items">
                    <Button variant="outline" className="w-full gap-2">
                      View All {myItems.length} Workflows
                      <ArrowUpRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
