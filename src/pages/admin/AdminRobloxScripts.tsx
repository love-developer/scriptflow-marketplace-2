import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Plus, Trash2, Edit, ToggleLeft, ToggleRight, Upload, FileText, Gamepad2 } from "lucide-react";

interface Script {
  id: string;
  title: string;
  category: string;
  tier: "Free" | "Premium" | "Premium+";
  supportedGame: string;
  description: string;
  previewImage?: string;
  scriptFile?: File;
  enabled: boolean;
  downloads: number;
  createdAt: string;
}

const INITIAL_SCRIPTS: Script[] = [
  { 
    id: "rs1", 
    title: "Speed Hack v2.1", 
    category: "Movement", 
    tier: "Premium", 
    supportedGame: "Adopt Me!",
    description: "Increase movement speed and jump height for faster gameplay",
    enabled: true, 
    downloads: 4320,
    createdAt: "2024-01-15"
  },
  { 
    id: "rs2", 
    title: "Auto Farm Pro Simulator", 
    category: "Farming", 
    tier: "Premium+", 
    supportedGame: "Blox Fruits",
    description: "Automated farming and resource collection simulator",
    enabled: true, 
    downloads: 8901,
    createdAt: "2024-01-20"
  },
  { 
    id: "rs3", 
    title: "ESP Wallhack Toolkit", 
    category: "Visuals", 
    tier: "Premium+", 
    supportedGame: "Arsenal",
    description: "See players through walls and objects with ESP features",
    enabled: true, 
    downloads: 2100,
    createdAt: "2024-02-01"
  },
  { 
    id: "rs4", 
    title: "Infinite Jump Script", 
    category: "Movement", 
    tier: "Free", 
    supportedGame: "Brookhaven",
    description: "Jump infinitely without cooldown restrictions",
    enabled: true, 
    downloads: 15400,
    createdAt: "2024-02-10"
  },
  { 
    id: "rs5", 
    title: "Auto Collect Coins", 
    category: "Farming", 
    tier: "Premium", 
    supportedGame: "Pet Simulator X",
    description: "Automatically collect coins and rewards in the game area",
    enabled: false, 
    downloads: 3200,
    createdAt: "2024-02-15"
  },
  { 
    id: "rs6", 
    title: "God Mode (PvP)", 
    category: "Combat", 
    tier: "Premium+", 
    supportedGame: "BedWars",
    description: "Become invincible in PvP combat situations",
    enabled: true, 
    downloads: 990,
    createdAt: "2024-03-01"
  },
];

const TIER_BADGE: Record<string, string> = {
  Free: "bg-secondary text-secondary-foreground border",
  Premium: "bg-primary/10 text-primary border-primary/20",
  "Premium+": "bg-gradient-to-r from-purple-500/10 to-pink-500/10 text-purple-600 border-purple-200 dark:border-purple-800",
};

export function AdminRobloxScripts() {
  const [scripts, setScripts] = useState<Script[]>(INITIAL_SCRIPTS);
  const [showAdd, setShowAdd] = useState(false);
  const [editingScript, setEditingScript] = useState<string | null>(null);
  
  // Form states
  const [formData, setFormData] = useState({
    title: "",
    category: "General",
    tier: "Free" as "Free" | "Premium" | "Premium+",
    supportedGame: "",
    description: "",
    previewImage: ""
  });
  const [scriptFile, setScriptFile] = useState<File | null>(null);
  const [previewFile, setPreviewFile] = useState<File | null>(null);

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

  const resetForm = () => {
    setFormData({
      title: "",
      category: "General",
      tier: "Free",
      supportedGame: "",
      description: "",
      previewImage: ""
    });
    setScriptFile(null);
    setPreviewFile(null);
    setEditingScript(null);
  };

  const addScript = () => {
    if (!formData.title.trim() || !formData.supportedGame.trim() || !formData.description.trim()) {
      toast.error("Please fill in all required fields.");
      return;
    }
    
    if (!scriptFile) {
      toast.error("Please upload a script file.");
      return;
    }

    const newScript: Script = {
      id: `rs${Date.now()}`,
      title: formData.title.trim(),
      category: formData.category,
      tier: formData.tier,
      supportedGame: formData.supportedGame.trim(),
      description: formData.description.trim(),
      previewImage: formData.previewImage || `https://via.placeholder.com/300x200?text=${encodeURIComponent(formData.title)}`,
      scriptFile: scriptFile,
      enabled: true,
      downloads: 0,
      createdAt: new Date().toISOString().split('T')[0],
    };
    
    setScripts(prev => [newScript, ...prev]);
    resetForm();
    setShowAdd(false);
    toast.success("Script added successfully!");
  };

  const updateScript = (id: string) => {
    if (!formData.title.trim() || !formData.supportedGame.trim() || !formData.description.trim()) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setScripts(prev => prev.map(s => 
      s.id === id 
        ? {
            ...s,
            title: formData.title.trim(),
            category: formData.category,
            tier: formData.tier,
            supportedGame: formData.supportedGame.trim(),
            description: formData.description.trim(),
            previewImage: formData.previewImage || s.previewImage,
            scriptFile: scriptFile || s.scriptFile,
          }
        : s
    ));
    
    resetForm();
    setEditingScript(null);
    toast.success("Script updated successfully!");
  };

  const startEdit = (script: Script) => {
    setFormData({
      title: script.title,
      category: script.category,
      tier: script.tier,
      supportedGame: script.supportedGame,
      description: script.description,
      previewImage: script.previewImage || ""
    });
    setEditingScript(script.id);
    setShowAdd(true);
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
        <div className="bg-card border border-border rounded-2xl p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Gamepad2 className="w-5 h-5" />
            {editingScript ? "Edit Script" : "Add New Script"}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="space-y-2">
              <Label htmlFor="title">Script Title *</Label>
              <Input
                id="title"
                placeholder="Enter script title..."
                value={formData.title}
                onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="game">Supported Game *</Label>
              <Input
                id="game"
                placeholder="e.g., Adopt Me!, Blox Fruits"
                value={formData.supportedGame}
                onChange={e => setFormData(prev => ({ ...prev, supportedGame: e.target.value }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={formData.category} onValueChange={(v) => setFormData(prev => ({ ...prev, category: v }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="General">General</SelectItem>
                  <SelectItem value="Movement">Movement</SelectItem>
                  <SelectItem value="Farming">Farming</SelectItem>
                  <SelectItem value="Combat">Combat</SelectItem>
                  <SelectItem value="Visuals">Visuals</SelectItem>
                  <SelectItem value="Utility">Utility</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="tier">Subscription Tier *</Label>
              <Select value={formData.tier} onValueChange={(v) => setFormData(prev => ({ ...prev, tier: v as "Free" | "Premium" | "Premium+" }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Free">Free</SelectItem>
                  <SelectItem value="Premium">Premium</SelectItem>
                  <SelectItem value="Premium+">Premium+</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2 mb-4">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              placeholder="Describe what this script does..."
              rows={3}
              value={formData.description}
              onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="space-y-2">
              <Label htmlFor="scriptFile">Script File *</Label>
              <div className="border-2 border-dashed border-border rounded-lg p-4 text-center">
                <input
                  type="file"
                  accept=".lua,.txt,.js"
                  onChange={(e) => setScriptFile(e.target.files?.[0] || null)}
                  className="hidden"
                  id="script-upload"
                />
                <label htmlFor="script-upload" className="cursor-pointer">
                  <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    {scriptFile ? scriptFile.name : "Click to upload script file (.lua, .txt, .js)"}
                  </p>
                </label>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="previewFile">Preview Image (Optional)</Label>
              <div className="border-2 border-dashed border-border rounded-lg p-4 text-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setPreviewFile(e.target.files?.[0] || null)}
                  className="hidden"
                  id="preview-upload"
                />
                <label htmlFor="preview-upload" className="cursor-pointer">
                  <FileText className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    {previewFile ? previewFile.name : "Click to upload preview image"}
                  </p>
                </label>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Button onClick={editingScript ? () => updateScript(editingScript) : addScript}>
              {editingScript ? "Update Script" : "Add Script"}
            </Button>
            <Button variant="outline" onClick={() => {
              resetForm();
              setShowAdd(false);
            }}>
              Cancel
            </Button>
          </div>
        </div>
      )}

      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-secondary/50 border-b border-border">
              <tr>
                <th className="px-4 py-3 font-medium text-muted-foreground">Title</th>
                <th className="px-4 py-3 font-medium text-muted-foreground">Game</th>
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
                  <td className="px-4 py-3">
                    <div>
                      <div className="font-medium">{script.title}</div>
                      <div className="text-xs text-muted-foreground mt-1 max-w-xs truncate">{script.description}</div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{script.supportedGame}</td>
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
                      <Button variant="ghost" size="sm" onClick={() => startEdit(script)} title="Edit">
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
