import { DashboardLayout } from "@/components/DashboardLayout";
import { useStore, Role } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { UserX, ShieldCheck, ShieldOff, KeyRound } from "lucide-react";
import { format } from "date-fns";

const ROLE_BADGE: Record<string, string> = {
  admin: "bg-primary text-primary-foreground",
  seller: "bg-secondary text-secondary-foreground border",
  buyer: "bg-secondary text-secondary-foreground border",
  guest: "bg-secondary text-muted-foreground border",
};

export function AdminUsers() {
  const { users, updateUserRole } = useStore();

  const banUser = (id: string, username: string) => {
    if (confirm(`Ban user "${username}"? They won't be able to log in.`)) {
      updateUserRole(id, "guest");
      toast.success(`User ${username} has been banned.`);
    }
  };

  const resetToRole = (id: string, role: Role) => {
    updateUserRole(id, role);
    toast.success(`User role updated to ${role}.`);
  };

  return (
    <DashboardLayout role="admin">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">User Management</h1>
        <p className="text-muted-foreground mt-2">View and manage all platform users.</p>
      </div>

      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <h2 className="font-semibold">All Users ({users.length})</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-secondary/50 border-b border-border">
              <tr>
                <th className="px-4 py-3 font-medium text-muted-foreground whitespace-nowrap">User</th>
                <th className="px-4 py-3 font-medium text-muted-foreground whitespace-nowrap">Email</th>
                <th className="px-4 py-3 font-medium text-muted-foreground whitespace-nowrap">Role</th>
                <th className="px-4 py-3 font-medium text-muted-foreground whitespace-nowrap">Level</th>
                <th className="px-4 py-3 font-medium text-muted-foreground whitespace-nowrap">Joined</th>
                <th className="px-4 py-3 font-medium text-muted-foreground text-right whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {users.map(user => (
                <tr key={user.id} className="hover:bg-secondary/20 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center font-semibold text-sm flex-shrink-0">
                        {user.username.charAt(0)}
                      </div>
                      <span className="font-medium">{user.username}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{user.email}</td>
                  <td className="px-4 py-3">
                    <Badge className={`text-xs ${ROLE_BADGE[user.role]}`}>{user.role}</Badge>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground text-xs whitespace-nowrap">{user.level}</td>
                  <td className="px-4 py-3 text-muted-foreground text-xs whitespace-nowrap">
                    {format(new Date(user.joinDate), "MMM d, yyyy")}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {user.role !== "admin" && (
                      <div className="flex items-center justify-end gap-1">
                        {user.role === "guest" ? (
                          <Button variant="ghost" size="sm" onClick={() => resetToRole(user.id, "buyer")} title="Restore as buyer">
                            <ShieldCheck className="w-3.5 h-3.5" />
                          </Button>
                        ) : (
                          <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => banUser(user.id, user.username)} title="Ban user">
                            <UserX className="w-3.5 h-3.5" />
                          </Button>
                        )}
                        <Button variant="ghost" size="sm" onClick={() => { resetToRole(user.id, user.role === "seller" ? "buyer" : "seller"); toast.success("Role toggled."); }} title="Toggle seller/buyer">
                          <ShieldOff className="w-3.5 h-3.5" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => toast.info("Password reset email sent (mock).")} title="Reset password">
                          <KeyRound className="w-3.5 h-3.5" />
                        </Button>
                      </div>
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
