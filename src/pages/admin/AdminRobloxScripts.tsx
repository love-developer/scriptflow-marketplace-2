import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Plus, Trash2, Edit, ToggleLeft, ToggleRight } from "lucide-react";

interface Script {
  id: string;
  title: string;
  category: string;
  tier: "Free" | "Basic" | "Premium" | "Elite";
  enabled: boolean;
  downloads: number;
}

const INITIAL_SCRIPTS: Script[] = [
  { id: "rs1", title: "Speed Hack v2.1", category: "Movement", tier: "Basic", enabled: true, downloads: 4320 },
  { id: "rs2", title: "Auto Farm Pro Simulator", category: "Farming", tier: "Premium", enabled: true, downloads: 8901 },
  { id: "rs3", title: "ESP Wallhack Toolkit", category: "Visuals", tier: "Premium", enabled: true, downloads: 2100 },
  { id: "rs4", title: "Infinite Jump Script", category: "Movement", tier: "Free", enabled: true, downloads: 15400 },
  { id: "rs5", title: "Auto Collect Coins", category: "Farming", tier: "Basic", enabled: false, downloads: 3200 },
  { id: "rs6", title: "God Mode (PvP)", category: "Combat", tier: "Elite", enabled: true, downloads: 990 },
];

const TIER_BADGE: Record<string, string> = {
  Free: "bg-secondary text-secondary-foreground border",
  Basic: "bg-secondary text-secondary-foreground border",
  Premium: "bg-primary/10 text-primary border-primary/20",
  Elite: "bg-primary text-primary-foreground",
};

export function AdminRobloxScripts() {
  const [scripts, setScripts] = useState<Script[]>(INITIAL_SCRIPTS);
  const [newTitle, setNewTitle] = useState("");
  const [showAdd, setShowAdd] = useState(false);

  const toggleEnabled = (id: string) => {
    setScripts(prev => prev.map(s => s.id === id ? { ...s, enabled: !s.enabled } : s));
    toast.success("Script status updated.");
  };

  const deleteScript = (id: string, title: string) => {
    if (confirm(`Delete "${title}"?`)) {
      setScripts(prev => prev.filter(s => s.id !== id));
      toast.success("Script deleted.");
    }
  };

  const addScript = () => {
    if (!newTitle.trim()) return;
    const newScript: Script = {
      id: `rs${Date.now()}`,
      title: newTitle.trim(),
      category: "General",
      tier: "Free",
      enabled: true,
      downloads: 0,
    };
    setScripts(prev => [newScript, ...prev]);
    setNewTitle("");
    setShowAdd(false);
    toast.success("Script added.");
  };

  return (
    <DashboardLayout role="admin">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Roblox Scripts Manager</h1>
          <p className="text-muted-foreground mt-2">Add, edit and manage all Roblox scripts.</p>
        </div>
        <Button onClick={() => setShowAdd(v => !v)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Script
        </Button>
      </div>

      {showAdd && (
        <div className="bg-card border border-border rounded-2xl p-6 mb-6 flex gap-3">
          <Input placeholder="Script title..." value={newTitle} onChange={e => setNewTitle(e.target.value)} onKeyDown={e => e.key === "Enter" && addScript()} />
          <Button onClick={addScript}>Add</Button>
          <Button variant="outline" onClick={() => setShowAdd(false)}>Cancel</Button>
        </div>
      )}

      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-secondary/50 border-b border-border">
              <tr>
                <th className="px-4 py-3 font-medium text-muted-foreground">Title</th>
                <th className="px-4 py-3 font-medium text-muted-foreground">Category</th>
                <th className="px-4 py-3 font-medium text-muted-foreground">Tier</th>
                <th className="px-4 py-3 font-medium text-muted-foreground">Downloads</th>
                <th className="px-4 py-3 font-medium text-muted-foreground">Status</th>
                <th className="px-4 py-3 font-medium text-muted-foreground text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {scripts.map(script => (
                <tr key={script.id} className="hover:bg-secondary/20 transition-colors">
                  <td className="px-4 py-3 font-medium">{script.title}</td>
                  <td className="px-4 py-3 text-muted-foreground">{script.category}</td>
                  <td className="px-4 py-3">
                    <Badge variant="outline" className={`text-xs ${TIER_BADGE[script.tier]}`}>{script.tier}</Badge>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{script.downloads.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <Badge variant="outline" className={script.enabled ? "text-green-700 border-green-300 bg-green-50 dark:bg-green-900/20 dark:text-green-400" : "bg-secondary text-muted-foreground"}>
                      {script.enabled ? "Enabled" : "Disabled"}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="sm" onClick={() => toggleEnabled(script.id)} title={script.enabled ? "Disable" : "Enable"}>
                        {script.enabled ? <ToggleRight className="w-4 h-4 text-green-600" /> : <ToggleLeft className="w-4 h-4 text-muted-foreground" />}
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => toast.info("Edit form coming soon!")}>
                        <Edit className="w-3.5 h-3.5" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => deleteScript(script.id, script.title)}>
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
    </DashboardLayout>
  );
}
