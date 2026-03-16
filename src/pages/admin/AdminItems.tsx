import { DashboardLayout } from "@/components/DashboardLayout";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Check, X, Trash2 } from "lucide-react";

export function AdminItems() {
  const { items, updateItemStatus, deleteItem } = useStore();

  const handleStatus = (id: string, status: 'Approved' | 'Rejected') => {
    updateItemStatus(id, status);
    toast.success(`Item marked as ${status}`);
  };

  const handleDelete = (id: string) => {
    deleteItem(id);
    toast.success("Item deleted permanently");
  };

  return (
    <DashboardLayout role="admin">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-foreground">Content Moderation</h1>
      </div>

      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-secondary/50 text-muted-foreground border-b border-border">
              <tr>
                <th className="px-6 py-4 font-medium">Item Name</th>
                <th className="px-6 py-4 font-medium">Seller</th>
                <th className="px-6 py-4 font-medium">Type</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {items.map(item => (
                <tr key={item.id} className="hover:bg-secondary/20">
                  <td className="px-6 py-4 font-medium">{item.title}</td>
                  <td className="px-6 py-4">{item.sellerName}</td>
                  <td className="px-6 py-4 capitalize">{item.type.replace('_', ' ')}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      item.status === 'Approved' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                      item.status === 'Pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                      'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right flex justify-end gap-2">
                    {item.status !== 'Approved' && (
                      <Button size="icon" variant="outline" className="text-green-500 hover:text-green-600 border-green-200" onClick={() => handleStatus(item.id, 'Approved')}>
                        <Check className="w-4 h-4" />
                      </Button>
                    )}
                    {item.status !== 'Rejected' && (
                      <Button size="icon" variant="outline" className="text-red-500 hover:text-red-600 border-red-200" onClick={() => handleStatus(item.id, 'Rejected')}>
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                    <Button size="icon" variant="outline" className="text-muted-foreground hover:text-destructive" onClick={() => handleDelete(item.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
