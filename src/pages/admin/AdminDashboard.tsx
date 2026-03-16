import { DashboardLayout } from "@/components/DashboardLayout";
import { useStore } from "@/lib/store";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const mockData = [
  { name: 'Mon', revenue: 4000 },
  { name: 'Tue', revenue: 3000 },
  { name: 'Wed', revenue: 2000 },
  { name: 'Thu', revenue: 2780 },
  { name: 'Fri', revenue: 1890 },
  { name: 'Sat', revenue: 2390 },
  { name: 'Sun', revenue: 3490 },
];

export function AdminDashboard() {
  const { users, items } = useStore();

  return (
    <DashboardLayout role="admin">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-foreground">Admin Control</h1>
        <p className="text-muted-foreground mt-2">Platform wide metrics and management.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-card border border-border p-6 rounded-2xl">
          <p className="text-sm font-medium text-muted-foreground mb-2">Total Users</p>
          <h4 className="font-display text-3xl font-bold">{users.length}</h4>
        </div>
        <div className="bg-card border border-border p-6 rounded-2xl">
          <p className="text-sm font-medium text-muted-foreground mb-2">Total Items</p>
          <h4 className="font-display text-3xl font-bold">{items.length}</h4>
        </div>
        <div className="bg-card border border-border p-6 rounded-2xl">
          <p className="text-sm font-medium text-muted-foreground mb-2">7d Revenue</p>
          <h4 className="font-display text-3xl font-bold">$19,550</h4>
        </div>
      </div>

      <div className="bg-card border border-border p-6 rounded-2xl h-[400px]">
        <h3 className="font-bold text-lg mb-6">Revenue Overview</h3>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={mockData}>
            <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
            <Tooltip 
              cursor={{fill: 'transparent'}}
              contentStyle={{ borderRadius: '8px', border: '1px solid hsl(var(--border))', backgroundColor: 'hsl(var(--card))' }}
            />
            <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </DashboardLayout>
  );
}
