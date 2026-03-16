import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { Plus, Trash2, Edit, Package } from "lucide-react";
import { toast } from "sonner";

export default function SellerItems() {
  const { items, currentUser, deleteItem } = useStore();
  const myItems = items.filter(i => i.sellerId === currentUser?.id);

  const handleDelete = (id: string, title: string) => {
    if (confirm(`Delete "${title}"? This cannot be undone.`)) {
      deleteItem(id);
      toast.success("Item deleted.");
    }
  };

  const statusBadge = (status: string) => {
    if (status === "Approved") return <Badge variant="outline" className="text-green-700 border-green-300 bg-green-50 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800">Approved</Badge>;
    if (status === "Pending") return <Badge variant="outline" className="text-yellow-700 border-yellow-300 bg-yellow-50 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800">Pending</Badge>;
    return <Badge variant="outline" className="text-red-700 border-red-300 bg-red-50 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800">Rejected</Badge>;
  };

  return (
    <DashboardLayout role="seller">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Workflows</h1>
          <p className="text-muted-foreground mt-2">Manage all your submitted items.</p>
        </div>
        <Link href="/seller-dashboard/upload">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Upload New
          </Button>
        </Link>
      </div>

      {myItems.length === 0 ? (
        <div className="bg-card border border-border rounded-2xl p-16 text-center">
          <Package className="w-10 h-10 mx-auto mb-4 text-muted-foreground" />
          <h3 className="font-semibold mb-2">No items yet</h3>
          <p className="text-muted-foreground text-sm mb-6">Upload your first workflow or script to start selling.</p>
          <Link href="/seller-dashboard/upload">
            <Button>Upload Item</Button>
          </Link>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-secondary/50 border-b border-border">
                <tr>
                  <th className="px-4 py-3 font-medium text-muted-foreground">Title</th>
                  <th className="px-4 py-3 font-medium text-muted-foreground">Type</th>
                  <th className="px-4 py-3 font-medium text-muted-foreground">Category</th>
                  <th className="px-4 py-3 font-medium text-muted-foreground">Price</th>
                  <th className="px-4 py-3 font-medium text-muted-foreground">Status</th>
                  <th className="px-4 py-3 font-medium text-muted-foreground">Tests</th>
                  <th className="px-4 py-3 font-medium text-muted-foreground text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {myItems.map(item => (
                  <tr key={item.id} className="hover:bg-secondary/20 transition-colors">
                    <td className="px-4 py-3 font-medium">{item.title}</td>
                    <td className="px-4 py-3 text-muted-foreground capitalize">{item.type.replace("_", " ")}</td>
                    <td className="px-4 py-3 text-muted-foreground">{item.category}</td>
                    <td className="px-4 py-3 font-medium">${item.price.toFixed(2)}</td>
                    <td className="px-4 py-3">{statusBadge(item.status)}</td>
                    <td className="px-4 py-3 text-muted-foreground">{item.testCount.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => toast.info("Edit coming soon!")}>
                          <Edit className="w-3.5 h-3.5" />
                        </Button>
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
