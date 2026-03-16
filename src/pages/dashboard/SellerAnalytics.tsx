import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { 
  BarChart2, TrendingUp, Users, Download, Eye, DollarSign,
  Calendar, ArrowUpRight, ArrowDownRight, Package
} from "lucide-react";

export default function SellerAnalytics() {
  // Mock analytics data
  const stats = {
    totalViews: 12453,
    totalDownloads: 892,
    totalRevenue: 2456.78,
    activeUsers: 342,
    conversionRate: 7.2
  };

  const monthlyData = [
    { month: 'Jan', views: 1200, downloads: 85, revenue: 245.50 },
    { month: 'Feb', views: 1450, downloads: 92, revenue: 267.80 },
    { month: 'Mar', views: 1680, downloads: 108, revenue: 312.40 },
    { month: 'Apr', views: 1890, downloads: 124, revenue: 358.90 },
    { month: 'May', views: 2100, downloads: 145, revenue: 420.30 },
    { month: 'Jun', views: 2333, downloads: 158, revenue: 456.78 }
  ];

  const topWorkflows = [
    { name: "AI Content Generator", views: 3421, downloads: 287, revenue: 823.50 },
    { name: "Social Media Automation", views: 2890, downloads: 198, revenue: 567.20 },
    { name: "Email Marketing Bot", views: 2156, downloads: 156, revenue: 447.80 },
    { name: "Data Analysis Helper", views: 1892, downloads: 134, revenue: 384.60 },
    { name: "SEO Optimizer", views: 1094, downloads: 87, revenue: 233.68 }
  ];

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
          <p className="text-2xl font-bold">{stats.totalViews.toLocaleString()}</p>
          <p className="text-xs text-emerald-600 flex items-center gap-1 mt-1">
            <ArrowUpRight className="w-3 h-3" /> +12.5%
          </p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 bg-emerald-500/10 rounded-xl flex items-center justify-center">
              <Download className="w-4.5 h-4.5 text-emerald-500" />
            </div>
            <span className="text-sm text-muted-foreground font-medium">Downloads</span>
          </div>
          <p className="text-2xl font-bold">{stats.totalDownloads.toLocaleString()}</p>
          <p className="text-xs text-emerald-600 flex items-center gap-1 mt-1">
            <ArrowUpRight className="w-3 h-3" /> +8.3%
          </p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 bg-yellow-500/10 rounded-xl flex items-center justify-center">
              <DollarSign className="w-4.5 h-4.5 text-yellow-500" />
            </div>
            <span className="text-sm text-muted-foreground font-medium">Revenue</span>
          </div>
          <p className="text-2xl font-bold">${stats.totalRevenue.toFixed(2)}</p>
          <p className="text-xs text-emerald-600 flex items-center gap-1 mt-1">
            <ArrowUpRight className="w-3 h-3" /> +15.7%
          </p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 bg-purple-500/10 rounded-xl flex items-center justify-center">
              <Users className="w-4.5 h-4.5 text-purple-500" />
            </div>
            <span className="text-sm text-muted-foreground font-medium">Active Users</span>
          </div>
          <p className="text-2xl font-bold">{stats.activeUsers}</p>
          <p className="text-xs text-emerald-600 flex items-center gap-1 mt-1">
            <ArrowUpRight className="w-3 h-3" /> +5.2%
          </p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 bg-orange-500/10 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-4.5 h-4.5 text-orange-500" />
            </div>
            <span className="text-sm text-muted-foreground font-medium">Conversion</span>
          </div>
          <p className="text-2xl font-bold">{stats.conversionRate}%</p>
          <p className="text-xs text-red-600 flex items-center gap-1 mt-1">
            <ArrowDownRight className="w-3 h-3" /> -2.1%
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
                      style={{ width: `${(month.views / 2333) * 100}%` }}
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
