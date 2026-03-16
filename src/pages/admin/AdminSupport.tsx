import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { LifeBuoy, MessageCircle, Send, User, ArrowUpRight } from "lucide-react";
import { format } from "date-fns";

const STATUS_STYLES: Record<string, string> = {
  "Open": "text-blue-700 border-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400",
  "In Progress": "text-yellow-700 border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20 dark:text-yellow-400",
  "Resolved": "text-green-700 border-green-200 bg-green-50 dark:bg-green-900/20 dark:text-green-400",
  "Closed": "bg-secondary text-muted-foreground",
};

type TicketStatus = "Open" | "In Progress" | "Resolved" | "Closed";

export function AdminSupport() {
  const { tickets, users, addTicketReply, updateTicketStatus } = useStore();
  const [replyMessages, setReplyMessages] = useState<Record<string, string>>({});
  const [expanded, setExpanded] = useState<string | null>(null);

  const sendReply = (ticketId: string) => {
    const msg = replyMessages[ticketId]?.trim();
    if (!msg) {
      toast.error("Please enter a reply message.");
      return;
    }
    
    addTicketReply(ticketId, msg, 'admin');
    setReplyMessages(prev => ({ ...prev, [ticketId]: "" }));
    updateTicketStatus(ticketId, 'In Progress');
    toast.success("Reply sent and status updated to In Progress.");
  };

  const changeStatus = (ticketId: string, status: TicketStatus) => {
    updateTicketStatus(ticketId, status);
    toast.success(`Status updated to ${status}.`);
  };

  const getUserInfo = (userId: string) => {
    return users.find(u => u.id === userId);
  };

  const getTicketStatus = (ticket: any): TicketStatus => {
    return ticket.status;
  };

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
          {tickets.map(ticket => {
            const userInfo = getUserInfo(ticket.userId);
            return (
              <div key={ticket.id} className="bg-card border border-border rounded-2xl overflow-hidden">
                {/* Ticket Header */}
                <div
                  className="flex items-center justify-between gap-4 px-6 py-4 cursor-pointer hover:bg-secondary/20 transition-colors"
                  onClick={() => setExpanded(expanded === ticket.id ? null : ticket.id)}
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold truncate">{ticket.subject}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {userInfo?.username || 'Unknown User'} · {format(new Date(ticket.date), "MMM d, yyyy")}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <Badge variant="outline" className={`text-xs ${STATUS_STYLES[getTicketStatus(ticket)]}`}>
                      {getTicketStatus(ticket)}
                    </Badge>
                    <MessageCircle className="w-4 h-4 text-muted-foreground" />
                    {(ticket.replies || []).length > 0 && (
                      <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                        {(ticket.replies || []).length} {(ticket.replies || []).length === 1 ? 'reply' : 'replies'}
                      </span>
                    )}
                    <ArrowUpRight className={`w-3 h-3 text-muted-foreground transition-transform ${expanded === ticket.id ? 'rotate-180' : ''}`} />
                  </div>
                </div>

                {/* Expanded Ticket Details */}
                {expanded === ticket.id && (
                  <div className="px-6 pb-6 border-t border-border pt-4 space-y-4">
                    {/* User Info */}
                    <div className="bg-muted/30 rounded-lg p-3">
                      <div className="flex items-center gap-3">
                        <User className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium text-sm">{userInfo?.username || 'Unknown User'}</p>
                          <p className="text-xs text-muted-foreground">
                            {userInfo?.email} · {userInfo?.role} · User ID: {ticket.userId.slice(0, 6)}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Original Message */}
                    <div>
                      <h4 className="font-semibold text-sm mb-2">Original Message</h4>
                      <div className="bg-secondary/50 rounded-lg p-3 text-sm text-muted-foreground">
                        <p className="font-medium text-xs mb-2">
                          {userInfo?.username} · {format(new Date(ticket.date), "MMM d, yyyy 'at' h:mm a")}
                        </p>
                        <p className="text-foreground whitespace-pre-wrap">{ticket.message}</p>
                      </div>
                    </div>

                    {/* Conversation History */}
                    {(ticket.replies || []).length > 0 && (
                      <div>
                        <h4 className="font-semibold text-sm mb-3">Conversation History</h4>
                        <div className="space-y-3">
                          {(ticket.replies || []).map(reply => (
                            <div key={reply.id} className={`rounded-lg p-3 text-sm ${
                              reply.from === 'admin' 
                                ? 'bg-primary/5 border border-primary/20' 
                                : 'bg-muted/30'
                            }`}>
                              <p className="font-medium text-xs mb-2">
                                {reply.senderName} · {reply.from === 'admin' ? 'Support Agent' : 'User'} · 
                                {format(new Date(reply.date), "MMM d, yyyy 'at' h:mm a")}
                              </p>
                              <p className="whitespace-pre-wrap">{reply.message}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Admin Reply Form */}
                    <div>
                      <h4 className="font-semibold text-sm mb-2">Send Reply</h4>
                      <div className="space-y-3">
                        <Textarea
                          placeholder="Write a reply to the user..."
                          rows={3}
                          value={replyMessages[ticket.id] || ""}
                          onChange={e => setReplyMessages(prev => ({ ...prev, [ticket.id]: e.target.value }))}
                        />
                        <div className="flex items-center gap-3">
                          <Button 
                            size="sm" 
                            onClick={() => sendReply(ticket.id)}
                            disabled={!replyMessages[ticket.id]?.trim()}
                            className="gap-2"
                          >
                            <Send className="w-3 h-3" />
                            Send Reply
                          </Button>
                          <Select value={getTicketStatus(ticket)} onValueChange={(v) => changeStatus(ticket.id, v as TicketStatus)}>
                            <SelectTrigger className="w-40 h-8 text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {(["Open", "In Progress", "Resolved", "Closed"] as TicketStatus[]).map(s => (
                                <SelectItem key={s} value={s}>{s}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => setReplyMessages(prev => ({ ...prev, [ticket.id]: "" }))}
                          >
                            Clear
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </DashboardLayout>
  );
}
