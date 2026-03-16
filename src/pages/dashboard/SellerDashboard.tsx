import { Link } from "wouter";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import {
  DollarSign, Package, TrendingUp, Users,
  Upload, Eye, ArrowUpRight, Clock, CheckCircle, XCircle
} from "lucide-react";

export function SellerDashboard() {
  const { items, currentUser } = useStore();
  const myItems = items.filter(i => i.sellerId === currentUser?.id);

  const approved = myItems.filter(i => i.status === "Approved");
  const pending = myItems.filter(i => i.status === "Pending");

  const stats = [
    { label: "Total Revenue", value: "$12,450", sub: "+18% this month", icon: DollarSign, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { label: "Active Workflows", value: approved.length.toString(), sub: `${pending.length} pending review`, icon: Package, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Total Downloads", value: "1,842", sub: "+241 this week", icon: TrendingUp, color: "text-violet-500", bg: "bg-violet-500/10" },
    { label: "Customers", value: "892", sub: "Lifetime unique buyers", icon: Users, color: "text-pink-500", bg: "bg-pink-500/10" },
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
          <div key={s.label} className="bg-card border border-border rounded-2xl p-5 stat-card-glow">
            <div className="flex items-start justify-between mb-4">
              <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center`}>
                <s.icon className={`w-5 h-5 ${s.color}`} />
              </div>
              <ArrowUpRight className="w-4 h-4 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground mb-1">{s.label}</p>
            <p className="text-2xl font-bold">{s.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <Link href="/seller-dashboard/upload">
          <div className="gradient-bg rounded-2xl p-5 text-white cursor-pointer hover:opacity-90 transition-opacity">
            <Upload className="w-6 h-6 mb-3 opacity-80" />
            <p className="font-bold">Upload New Workflow</p>
            <p className="text-sm opacity-70 mt-0.5">Single or bundle</p>
          </div>
        </Link>
        <Link href="/seller-dashboard/items">
          <div className="bg-card border border-border rounded-2xl p-5 cursor-pointer hover:border-primary/30 transition-colors">
            <Package className="w-6 h-6 mb-3 text-muted-foreground" />
            <p className="font-bold">Manage Workflows</p>
            <p className="text-sm text-muted-foreground mt-0.5">{myItems.length} total listings</p>
          </div>
        </Link>
        <Link href="/seller-dashboard/analytics">
          <div className="bg-card border border-border rounded-2xl p-5 cursor-pointer hover:border-primary/30 transition-colors">
            <TrendingUp className="w-6 h-6 mb-3 text-muted-foreground" />
            <p className="font-bold">View Analytics</p>
            <p className="text-sm text-muted-foreground mt-0.5">Sales & performance</p>
          </div>
        </Link>
      </div>

      {/* Workflows table */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <h3 className="font-bold text-lg">My Workflows</h3>
          <Link href="/seller-dashboard/items">
            <Button variant="ghost" size="sm" className="text-muted-foreground gap-1">
              View all <ArrowUpRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>
        <div className="overflow-x-auto">
          {myItems.length === 0 ? (
            <div className="py-16 text-center">
              <Package className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-muted-foreground font-medium">No workflows yet</p>
              <p className="text-sm text-muted-foreground/70 mb-4">Upload your first workflow to start selling</p>
              <Link href="/seller-dashboard/upload">
                <Button size="sm" className="gradient-bg text-white border-0">Upload Now</Button>
              </Link>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-secondary/30">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Workflow</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Price</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden sm:table-cell">Views</th>
                  <th className="text-right px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Sales</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {myItems.map(item => (
                  <tr key={item.id} className="hover:bg-secondary/20 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-secondary overflow-hidden flex-shrink-0">
                          <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="font-medium leading-tight">{item.title}</p>
                          <p className="text-xs text-muted-foreground">{item.category}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusBadge(item.status)}`}>
                        {item.status === "Approved" && <CheckCircle className="w-3 h-3" />}
                        {item.status === "Pending" && <Clock className="w-3 h-3" />}
                        {item.status === "Rejected" && <XCircle className="w-3 h-3" />}
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-semibold">${item.price.toFixed(2)}</td>
                    <td className="px-6 py-4 text-muted-foreground hidden sm:table-cell">
                      <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" />{item.testCount}</span>
                    </td>
                    <td className="px-6 py-4 text-right font-semibold text-emerald-600 dark:text-emerald-400">124</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
