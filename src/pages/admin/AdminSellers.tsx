import { DashboardLayout } from "@/components/DashboardLayout";
import { useStore, Level } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Award } from "lucide-react";

const LEVELS: Level[] = ["New Creator", "Rising Builder", "Pro Architect", "Elite Innovator", "Legendary Creator"];

export function AdminSellers() {
  const { users, items, updateUserRole } = useStore();
  const sellers = users.filter(u => u.role === "seller");

  const suspendSeller = (id: string, username: string) => {
    if (confirm(`Suspend seller "${username}"?`)) {
      updateUserRole(id, "buyer");
      toast.success(`${username} suspended as seller.`);
    }
  };

  const approveSeller = (id: string) => {
    updateUserRole(id, "seller");
    toast.success("Seller approved.");
  };

  return (
    <DashboardLayout role="admin">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Seller Management</h1>
        <p className="text-muted-foreground mt-2">Manage seller accounts and levels.</p>
      </div>

      {sellers.length === 0 ? (
        <div className="bg-card border border-border rounded-2xl p-16 text-center">
          <Award className="w-10 h-10 mx-auto mb-4 text-muted-foreground" />
          <h3 className="font-semibold mb-2">No sellers found</h3>
          <p className="text-muted-foreground text-sm">Sellers will appear here once registered.</p>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-secondary/50 border-b border-border">
                <tr>
                  <th className="px-4 py-3 font-medium text-muted-foreground whitespace-nowrap">Seller</th>
                  <th className="px-4 py-3 font-medium text-muted-foreground whitespace-nowrap">Level</th>
                  <th className="px-4 py-3 font-medium text-muted-foreground whitespace-nowrap">Sales</th>
                  <th className="px-4 py-3 font-medium text-muted-foreground whitespace-nowrap">Workflows</th>
                  <th className="px-4 py-3 font-medium text-muted-foreground whitespace-nowrap">Est. Revenue</th>
                  <th className="px-4 py-3 font-medium text-muted-foreground text-right whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {sellers.map(seller => {
                  const sellerItems = items.filter(i => i.sellerId === seller.id);
                  const revenue = seller.sales * 24.99;
                  return (
                    <tr key={seller.id} className="hover:bg-secondary/20 transition-colors">
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center font-semibold text-sm flex-shrink-0">
                            {seller.username.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium">{seller.username}</p>
                            <p className="text-xs text-muted-foreground">{seller.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <Badge variant="outline" className="text-xs">{seller.level}</Badge>
                      </td>
                      <td className="px-4 py-3 font-medium whitespace-nowrap">{seller.sales}</td>
                      <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{sellerItems.length}</td>
                      <td className="px-4 py-3 font-medium whitespace-nowrap">${revenue.toFixed(0)}</td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => suspendSeller(seller.id, seller.username)}>
                            Suspend
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
