import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useStore } from "@/lib/store";
import { 
  BarChart2, TrendingUp, Users, Download, Eye, DollarSign,
  Calendar, ArrowUpRight, ArrowDownRight, Package
} from "lucide-react";

export default function SellerAnalytics() {
  const { items, purchases, currentUser, calculateSellerBalance } = useStore();
  
  // Get seller's items
  const myItems = items.filter(i => i.sellerId === currentUser?.id);
  const approvedItems = myItems.filter(i => i.status === 'Approved');
  
  // Calculate real analytics data
  const mySales = purchases.filter(p => {
    const item = myItems.find(i => i.id === p.itemId);
    return item && item.sellerId === currentUser?.id;
  });
  
  const totalViews = myItems.reduce((sum, item) => sum + item.testCount, 0);
  const totalDownloads = mySales.length;
  const totalRevenue = mySales.reduce((sum, sale) => sum + sale.price, 0);
  const uniqueCustomers = new Set(mySales.map(s => s.userId)).size;
  const conversionRate = totalViews > 0 ? ((totalDownloads / totalViews) * 100) : 0;

  // Generate monthly data from real purchases (group by month)
  const monthlyData = mySales.reduce((acc, sale) => {
    const month = new Date(sale.date).toLocaleDateString('en-US', { month: 'short' });
    const existingMonth = acc.find(m => m.month === month);
    if (existingMonth) {
      existingMonth.views += 1; // Each purchase counts as a view
      existingMonth.downloads += 1;
      existingMonth.revenue += sale.price;
    } else {
      acc.push({ 
        month,
        views: 1,
        downloads: 1,
        revenue: sale.price
      });
    }
    return acc;
  }, [] as { month: string; views: number; downloads: number; revenue: number }[]);

  // Get top performing workflows
  const topWorkflows = approvedItems
    .map(item => {
      const itemSales = mySales.filter(sale => sale.itemId === item.id);
      return {
        name: item.title,
        views: item.testCount,
        downloads: itemSales.length,
        revenue: itemSales.reduce((sum, sale) => sum + sale.price, 0)
      };
    })
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  // Calculate trend percentages (mock for now, would compare with previous period)
  const trends = {
    views: +12.5,
    downloads: +8.3,
    revenue: +15.7,
    users: +5.2,
    conversion: -2.1
  };

  return (
    <DashboardLayout role="seller">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold">
          Sales <span className="gradient-text">Analytics</span>
        </h1>
        <p className="text-muted-foreground mt-1">Track your workflow performance and revenue</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 bg-blue-500/10 rounded-xl flex items-center justify-center">
              <Eye className="w-4.5 h-4.5 text-blue-500" />
            </div>
            <span className="text-sm text-muted-foreground font-medium">Total Views</span>
          </div>
          <p className="text-2xl font-bold">{totalViews.toLocaleString()}</p>
          <p className="text-xs text-emerald-600 flex items-center gap-1 mt-1">
            {trends.views > 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
            {trends.views > 0 ? '+' : ''}{trends.views}%
          </p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 bg-emerald-500/10 rounded-xl flex items-center justify-center">
              <Download className="w-4.5 h-4.5 text-emerald-500" />
            </div>
            <span className="text-sm text-muted-foreground font-medium">Downloads</span>
          </div>
          <p className="text-2xl font-bold">{totalDownloads.toLocaleString()}</p>
          <p className="text-xs text-emerald-600 flex items-center gap-1 mt-1">
            {trends.downloads > 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
            {trends.downloads > 0 ? '+' : ''}{trends.downloads}%
          </p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 bg-yellow-500/10 rounded-xl flex items-center justify-center">
              <DollarSign className="w-4.5 h-4.5 text-yellow-500" />
            </div>
            <span className="text-sm text-muted-foreground font-medium">Revenue</span>
          </div>
          <p className="text-2xl font-bold">${totalRevenue.toFixed(2)}</p>
          <p className="text-xs text-emerald-600 flex items-center gap-1 mt-1">
            {trends.revenue > 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
            {trends.revenue > 0 ? '+' : ''}{trends.revenue}%
          </p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 bg-purple-500/10 rounded-xl flex items-center justify-center">
              <Users className="w-4.5 h-4.5 text-purple-500" />
            </div>
            <span className="text-sm text-muted-foreground font-medium">Active Users</span>
          </div>
          <p className="text-2xl font-bold">{uniqueCustomers}</p>
          <p className="text-xs text-emerald-600 flex items-center gap-1 mt-1">
            {trends.users > 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
            {trends.users > 0 ? '+' : ''}{trends.users}%
          </p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 bg-orange-500/10 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-4.5 h-4.5 text-orange-500" />
            </div>
            <span className="text-sm text-muted-foreground font-medium">Conversion</span>
          </div>
          <p className="text-2xl font-bold">{conversionRate.toFixed(1)}%</p>
          <p className="text-xs text-red-600 flex items-center gap-1 mt-1">
            {trends.conversion > 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
            {trends.conversion > 0 ? '+' : ''}{trends.conversion}%
          </p>
        </div>
      </div>

      {/* Charts and Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Monthly Performance Chart */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-muted-foreground" />
            Monthly Performance
          </h3>
          <div className="space-y-3">
            {monthlyData.map((month) => (
              <div key={month.month} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium w-8">{month.month}</span>
                  <div className="flex-1 bg-secondary rounded-full h-2 overflow-hidden">
                    <div 
                      className="h-full gradient-bg transition-all duration-500"
                      style={{ width: `${(month.views / Math.max(...monthlyData.map(m => m.views))) * 100}%` }}
                    />
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold">{month.views.toLocaleString()} views</p>
                  <p className="text-xs text-muted-foreground">${month.revenue}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Workflows */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <Package className="w-5 h-5 text-muted-foreground" />
            Top Performing Workflows
          </h3>
          <div className="space-y-3">
            {topWorkflows.map((workflow, index) => (
              <div key={index} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <div className="flex-1">
                  <p className="font-medium text-sm truncate">{workflow.name}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Eye className="w-3 h-3" /> {workflow.views.toLocaleString()}
                    </span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Download className="w-3 h-3" /> {workflow.downloads}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-sm">${workflow.revenue.toFixed(2)}</p>
                  <p className="text-xs text-muted-foreground">{((workflow.downloads / workflow.views) * 100).toFixed(1)}% conv.</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-card border border-border rounded-2xl p-6">
        <h3 className="font-bold text-lg mb-4">Quick Actions</h3>
        <div className="flex flex-wrap gap-3">
          <Link href="/seller-dashboard/upload">
            <Button variant="outline" size="sm" className="gap-2">
              <Package className="w-4 h-4" />
              Upload New Workflow
            </Button>
          </Link>
          <Link href="/seller-dashboard/items">
            <Button variant="outline" size="sm" className="gap-2">
              <BarChart2 className="w-4 h-4" />
              Manage Workflows
            </Button>
          </Link>
          <Button variant="outline" size="sm" className="gap-2">
            <Calendar className="w-4 h-4" />
            Export Report
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
