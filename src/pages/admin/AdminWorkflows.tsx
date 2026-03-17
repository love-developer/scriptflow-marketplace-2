import { DashboardLayout } from "@/components/DashboardLayout";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { CheckCircle, XCircle, Trash2, Package } from "lucide-react";

export function AdminWorkflows() {
  const { items, updateItemStatus, deleteItem } = useStore();

  const handleApprove = (id: string, title: string) => {
    updateItemStatus(id, "Approved");
    toast.success(`"${title}" approved and published.`);
  };

  const handleReject = (id: string, title: string) => {
    updateItemStatus(id, "Rejected");
    toast.error(`"${title}" rejected.`);
  };

  const handleDelete = (id: string, title: string) => {
    if (confirm(`Delete "${title}"?`)) {
      deleteItem(id);
      toast.success("Item deleted.");
    }
  };

  const statusBadge = (status: string) => {
    if (status === "Approved") return <Badge variant="outline" className="text-green-700 border-green-300 bg-green-50 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800">Approved</Badge>;
    if (status === "Pending") return <Badge variant="outline" className="text-yellow-700 border-yellow-300 bg-yellow-50 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800">Pending</Badge>;
    return <Badge variant="outline" className="text-red-700 border-red-300 bg-red-50 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800">Rejected</Badge>;
  };

  const pending = items.filter(i => i.status === "Pending");
  const approved = items.filter(i => i.status === "Approved");
  const rejected = items.filter(i => i.status === "Rejected");

  return (
    <DashboardLayout role="admin">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Workflow Approval</h1>
        <p className="text-muted-foreground mt-2">Review and approve seller-submitted workflows.</p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-card border border-border rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-yellow-600">{pending.length}</p>
          <p className="text-xs text-muted-foreground mt-1">Pending Review</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-green-600">{approved.length}</p>
          <p className="text-xs text-muted-foreground mt-1">Approved</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-red-600">{rejected.length}</p>
          <p className="text-xs text-muted-foreground mt-1">Rejected</p>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="bg-card border border-border rounded-2xl p-16 text-center">
          <Package className="w-10 h-10 mx-auto mb-4 text-muted-foreground" />
          <h3 className="font-semibold mb-2">No items submitted yet</h3>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-secondary/50 border-b border-border">
                <tr>
                  <th className="px-4 py-3 font-medium text-muted-foreground whitespace-nowrap">Title</th>
                  <th className="px-4 py-3 font-medium text-muted-foreground whitespace-nowrap">Seller</th>
                  <th className="px-4 py-3 font-medium text-muted-foreground whitespace-nowrap">Type</th>
                  <th className="px-4 py-3 font-medium text-muted-foreground whitespace-nowrap">Price</th>
                  <th className="px-4 py-3 font-medium text-muted-foreground whitespace-nowrap">Status</th>
                  <th className="px-4 py-3 font-medium text-muted-foreground text-right whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {items.map(item => (
                  <tr key={item.id} className="hover:bg-secondary/20 transition-colors">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <p className="font-medium">{item.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5 max-w-[200px] truncate">{item.category}</p>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{item.sellerName}</td>
                    <td className="px-4 py-3 text-muted-foreground capitalize text-xs whitespace-nowrap">{item.type.replace("_", " ")}</td>
                    <td className="px-4 py-3 font-medium whitespace-nowrap">${item.price.toFixed(2)}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{statusBadge(item.status)}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {item.status !== "Approved" && (
                          <Button variant="ghost" size="sm" className="text-green-600 hover:text-green-700" onClick={() => handleApprove(item.id, item.title)}>
                            <CheckCircle className="w-3.5 h-3.5" />
                          </Button>
                        )}
                        {item.status !== "Rejected" && (
                          <Button variant="ghost" size="sm" className="text-yellow-600 hover:text-yellow-700" onClick={() => handleReject(item.id, item.title)}>
                            <XCircle className="w-3.5 h-3.5" />
                          </Button>
                        )}
                        <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => handleDelete(item.id, item.title)}>
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
