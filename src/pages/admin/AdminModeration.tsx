import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { ShieldAlert, Flag } from "lucide-react";

interface ReportedItem {
  id: string;
  type: "workflow" | "user" | "content";
  title: string;
  reportedBy: string;
  reason: string;
  date: string;
  status: "Pending" | "Removed" | "Dismissed";
}

const INITIAL_REPORTS: ReportedItem[] = [
  { id: "r1", type: "workflow", title: "Fake AI Upscaler", reportedBy: "CreativeMind", reason: "Misleading description — does not work as advertised.", date: "2024-03-14", status: "Pending" },
  { id: "r2", type: "user", title: "spammy_user99", reportedBy: "PixelArchitect", reason: "Sending spam messages and promoting external links.", date: "2024-03-13", status: "Pending" },
  { id: "r3", type: "workflow", title: "Free Hack Bundle", reportedBy: "GamerXX", reason: "Contains malicious JSON payload.", date: "2024-03-12", status: "Removed" },
  { id: "r4", type: "content", title: "Inappropriate preview image", reportedBy: "ArtBot", reason: "Explicit content in preview images.", date: "2024-03-11", status: "Dismissed" },
  { id: "r5", type: "workflow", title: "Stolen ComfyUI Workflow", reportedBy: "StudioAI", reason: "This workflow is copied without attribution.", date: "2024-03-10", status: "Pending" },
];

const STATUS_STYLES: Record<string, string> = {
  Pending: "text-yellow-700 border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20 dark:text-yellow-400",
  Removed: "text-red-700 border-red-200 bg-red-50 dark:bg-red-900/20 dark:text-red-400",
  Dismissed: "bg-secondary text-muted-foreground",
};

const TYPE_LABEL: Record<string, string> = {
  workflow: "Workflow",
  user: "User",
  content: "Content",
};

export function AdminModeration() {
  const [reports, setReports] = useState<ReportedItem[]>(INITIAL_REPORTS);

  const updateStatus = (id: string, status: "Removed" | "Dismissed") => {
    setReports(prev => prev.map(r => r.id === id ? { ...r, status } : r));
    toast.success(`Item ${status.toLowerCase()}.`);
  };

  const pending = reports.filter(r => r.status === "Pending").length;

  return (
    <DashboardLayout role="admin">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Content Moderation</h1>
        <p className="text-muted-foreground mt-2">Review and action flagged content reports.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <div className="bg-card border border-border rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-yellow-600">{pending}</p>
          <p className="text-xs text-muted-foreground mt-1">Pending Review</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-red-600">{reports.filter(r => r.status === "Removed").length}</p>
          <p className="text-xs text-muted-foreground mt-1">Removed</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-muted-foreground">{reports.filter(r => r.status === "Dismissed").length}</p>
          <p className="text-xs text-muted-foreground mt-1">Dismissed</p>
        </div>
      </div>

      {reports.length === 0 ? (
        <div className="bg-card border border-border rounded-2xl p-16 text-center">
          <ShieldAlert className="w-10 h-10 mx-auto mb-4 text-muted-foreground" />
          <h3 className="font-semibold mb-2">No reports</h3>
          <p className="text-muted-foreground text-sm">All clear — no flagged content to review.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reports.map(report => (
            <div key={report.id} className="bg-card border border-border rounded-2xl p-4">
              <div className="space-y-3">
                {/* Header with title and type badge */}
                <div className="flex items-start gap-2">
                  <Flag className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold truncate pr-2">{report.title}</h3>
                  </div>
                  <Badge variant="outline" className="text-xs flex-shrink-0">
                    {TYPE_LABEL[report.type]}
                  </Badge>
                </div>

                {/* Reason text */}
                <p className="text-sm text-muted-foreground pl-6 line-clamp-3">
                  {report.reason}
                </p>

                {/* Footer with reporter info, status, and actions */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pl-6">
                  <div className="text-xs text-muted-foreground">
                    Reported by <span className="font-medium">{report.reportedBy}</span> · {report.date}
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={`text-xs ${STATUS_STYLES[report.status]}`}>
                      {report.status}
                    </Badge>
                    {report.status === "Pending" && (
                      <div className="flex gap-1">
                        <Button size="sm" variant="destructive" onClick={() => updateStatus(report.id, "Removed")}>
                          Remove
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => updateStatus(report.id, "Dismissed")}>
                          Dismiss
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
