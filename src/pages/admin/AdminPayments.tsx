import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { CreditCard, Download } from "lucide-react";

interface Transaction {
  id: string;
  user: string;
  type: string;
  item: string;
  amount: number;
  status: "Completed" | "Pending" | "Failed";
  date: string;
}

const MOCK_TRANSACTIONS: Transaction[] = [
  { id: "tx001", user: "CreativeMind", type: "Purchase", item: "Portrait Enhancer Pro v2.0", amount: 29.99, status: "Completed", date: "2024-03-15" },
  { id: "tx002", user: "GamerXX", type: "Subscription", item: "Roblox Scripts — Premium", amount: 14.99, status: "Completed", date: "2024-03-14" },
  { id: "tx003", user: "ArtBot", type: "Purchase", item: "Anime Style Transfer", amount: 15.00, status: "Completed", date: "2024-03-13" },
  { id: "tx004", user: "DevPro", type: "Purchase", item: "Product Photography Studio", amount: 49.00, status: "Completed", date: "2024-03-12" },
  { id: "tx005", user: "PixelArchitect", type: "Payout Request", item: "Seller Withdrawal", amount: 320.00, status: "Pending", date: "2024-03-11" },
  { id: "tx006", user: "NightOwl", type: "Purchase", item: "ESP Wallhack Toolkit", amount: 14.99, status: "Failed", date: "2024-03-10" },
  { id: "tx007", user: "StudioAI", type: "Payout Request", item: "Seller Withdrawal", amount: 890.00, status: "Pending", date: "2024-03-09" },
  { id: "tx008", user: "MaxUser", type: "Subscription", item: "Roblox Scripts — Basic", amount: 7.99, status: "Completed", date: "2024-03-08" },
];

const STATUS_STYLES: Record<string, string> = {
  Completed: "text-green-700 border-green-300 bg-green-50 dark:bg-green-900/20 dark:text-green-400",
  Pending: "text-yellow-700 border-yellow-300 bg-yellow-50 dark:bg-yellow-900/20 dark:text-yellow-400",
  Failed: "text-red-700 border-red-300 bg-red-50 dark:bg-red-900/20 dark:text-red-400",
};

export function AdminPayments() {
  const totalRevenue = MOCK_TRANSACTIONS.filter(t => t.status === "Completed" && t.type !== "Payout Request").reduce((acc, t) => acc + t.amount, 0);
  const pendingPayouts = MOCK_TRANSACTIONS.filter(t => t.status === "Pending").reduce((acc, t) => acc + t.amount, 0);

  const approveWithdrawal = (id: string) => {
    toast.success(`Withdrawal ${id} approved.`);
  };

  return (
    <DashboardLayout role="admin">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Payment Management</h1>
        <p className="text-muted-foreground mt-2">View all transactions and manage seller payouts.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-card border border-border rounded-xl p-5">
          <p className="text-sm text-muted-foreground mb-1">Total Revenue</p>
          <p className="text-2xl font-bold">${totalRevenue.toFixed(2)}</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-5">
          <p className="text-sm text-muted-foreground mb-1">Pending Payouts</p>
          <p className="text-2xl font-bold">${pendingPayouts.toFixed(2)}</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-5">
          <p className="text-sm text-muted-foreground mb-1">Total Transactions</p>
          <p className="text-2xl font-bold">{MOCK_TRANSACTIONS.length}</p>
        </div>
      </div>

      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <h2 className="font-semibold">All Transactions</h2>
          <Button variant="outline" size="sm" onClick={() => toast.info("Report exported (mock).")}>
            <Download className="w-3.5 h-3.5 mr-2" />
            Export CSV
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-secondary/50 border-b border-border">
              <tr>
                <th className="px-4 py-3 font-medium text-muted-foreground">ID</th>
                <th className="px-4 py-3 font-medium text-muted-foreground">User</th>
                <th className="px-4 py-3 font-medium text-muted-foreground">Type</th>
                <th className="px-4 py-3 font-medium text-muted-foreground">Item</th>
                <th className="px-4 py-3 font-medium text-muted-foreground">Amount</th>
                <th className="px-4 py-3 font-medium text-muted-foreground">Status</th>
                <th className="px-4 py-3 font-medium text-muted-foreground">Date</th>
                <th className="px-4 py-3 font-medium text-muted-foreground text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {MOCK_TRANSACTIONS.map(tx => (
                <tr key={tx.id} className="hover:bg-secondary/20 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">#{tx.id}</td>
                  <td className="px-4 py-3 font-medium">{tx.user}</td>
                  <td className="px-4 py-3 text-muted-foreground">{tx.type}</td>
                  <td className="px-4 py-3 text-muted-foreground max-w-[140px] truncate">{tx.item}</td>
                  <td className="px-4 py-3 font-medium">${tx.amount.toFixed(2)}</td>
                  <td className="px-4 py-3">
                    <Badge variant="outline" className={`text-xs ${STATUS_STYLES[tx.status]}`}>{tx.status}</Badge>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground text-xs">{tx.date}</td>
                  <td className="px-4 py-3 text-right">
                    {tx.type === "Payout Request" && tx.status === "Pending" && (
                      <Button variant="ghost" size="sm" onClick={() => approveWithdrawal(tx.id)}>
                        Approve
                      </Button>
                    )}
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
