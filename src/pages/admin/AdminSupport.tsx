import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { LifeBuoy, MessageCircle } from "lucide-react";
import { format } from "date-fns";

const STATUS_STYLES: Record<string, string> = {
  "Open": "text-blue-700 border-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400",
  "In Progress": "text-yellow-700 border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20 dark:text-yellow-400",
  "Resolved": "text-green-700 border-green-200 bg-green-50 dark:bg-green-900/20 dark:text-green-400",
  "Closed": "bg-secondary text-muted-foreground",
};

type TicketStatus = "Open" | "In Progress" | "Resolved" | "Closed";

export function AdminSupport() {
  const { tickets } = useStore();
  const [replies, setReplies] = useState<Record<string, string>>({});
  const [replyDraft, setReplyDraft] = useState<Record<string, string>>({});
  const [statuses, setStatuses] = useState<Record<string, TicketStatus>>({});
  const [expanded, setExpanded] = useState<string | null>(null);

  const sendReply = (ticketId: string) => {
    const msg = replyDraft[ticketId]?.trim();
    if (!msg) return;
    setReplies(prev => ({ ...prev, [ticketId]: msg }));
    setReplyDraft(prev => ({ ...prev, [ticketId]: "" }));
    setStatuses(prev => ({ ...prev, [ticketId]: "In Progress" }));
    toast.success("Reply sent.");
  };

  const changeStatus = (ticketId: string, status: TicketStatus) => {
    setStatuses(prev => ({ ...prev, [ticketId]: status }));
    toast.success(`Status updated to ${status}.`);
  };

  const getStatus = (ticket: any): TicketStatus => statuses[ticket.id] || ticket.status;

  return (
    <DashboardLayout role="admin">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Support Tickets</h1>
        <p className="text-muted-foreground mt-2">View and respond to all user support tickets.</p>
      </div>

      {tickets.length === 0 ? (
        <div className="bg-card border border-border rounded-2xl p-16 text-center">
          <LifeBuoy className="w-10 h-10 mx-auto mb-4 text-muted-foreground" />
          <h3 className="font-semibold mb-2">No tickets yet</h3>
          <p className="text-muted-foreground text-sm">Support tickets from users will appear here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {tickets.map(ticket => (
            <div key={ticket.id} className="bg-card border border-border rounded-2xl overflow-hidden">
              <div
                className="flex items-center justify-between gap-4 px-6 py-4 cursor-pointer hover:bg-secondary/20 transition-colors"
                onClick={() => setExpanded(expanded === ticket.id ? null : ticket.id)}
              >
                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate">{ticket.subject}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    User #{ticket.userId.slice(0, 6)} · {format(new Date(ticket.date), "MMM d, yyyy")}
                  </p>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <Badge variant="outline" className={`text-xs ${STATUS_STYLES[getStatus(ticket)]}`}>{getStatus(ticket)}</Badge>
                  <MessageCircle className="w-4 h-4 text-muted-foreground" />
                </div>
              </div>

              {expanded === ticket.id && (
                <div className="px-6 pb-6 border-t border-border pt-4 space-y-4">
                  <div className="bg-secondary/50 rounded-lg p-3 text-sm text-muted-foreground">
                    {ticket.message}
                  </div>

                  {replies[ticket.id] && (
                    <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 text-sm">
                      <p className="text-xs font-medium text-muted-foreground mb-1">Support Team Reply</p>
                      <p>{replies[ticket.id]}</p>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Textarea
                      placeholder="Write a reply..."
                      rows={3}
                      value={replyDraft[ticket.id] || ""}
                      onChange={e => setReplyDraft(prev => ({ ...prev, [ticket.id]: e.target.value }))}
                    />
                    <div className="flex items-center gap-3">
                      <Button size="sm" onClick={() => sendReply(ticket.id)}>Send Reply</Button>
                      <Select value={getStatus(ticket)} onValueChange={(v) => changeStatus(ticket.id, v as TicketStatus)}>
                        <SelectTrigger className="w-40 h-8 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {(["Open", "In Progress", "Resolved", "Closed"] as TicketStatus[]).map(s => (
                            <SelectItem key={s} value={s}>{s}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
