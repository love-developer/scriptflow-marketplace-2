import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { LifeBuoy, Plus, MessageCircle, Send, ArrowUpRight } from "lucide-react";
import { format } from "date-fns";

const STATUS_STYLES: Record<string, string> = {
  "Open": "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800",
  "In Progress": "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800",
  "Resolved": "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800",
  "Closed": "bg-secondary text-muted-foreground border-border",
};

export default function BuyerSupport() {
  const { tickets, currentUser, createTicket, addTicketReply } = useStore();
  const myTickets = tickets.filter(t => t.userId === currentUser?.id);

  const [showForm, setShowForm] = useState(false);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [expandedTicket, setExpandedTicket] = useState<string | null>(null);
  const [replyMessages, setReplyMessages] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) {
      toast.error("Please fill in all fields.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      createTicket(subject.trim(), message.trim());
      toast.success("Support ticket created! We'll get back to you soon.");
      setSubject("");
      setMessage("");
      setShowForm(false);
      setLoading(false);
    }, 600);
  };

  const handleSendReply = (ticketId: string) => {
    const replyMessage = replyMessages[ticketId]?.trim();
    if (!replyMessage) {
      toast.error("Please enter a reply message.");
      return;
    }
    
    addTicketReply(ticketId, replyMessage, 'user');
    setReplyMessages(prev => ({ ...prev, [ticketId]: "" }));
    toast.success("Reply sent successfully!");
  };

  const getStatusMessage = (ticket: any) => {
    if (ticket.status === "Open") return "Waiting for support team response...";
    if (ticket.status === "In Progress") return "Support team is reviewing your ticket.";
    if (ticket.status === "Resolved") return "Ticket resolved. You can still reply if needed.";
    return "Ticket closed.";
  };

  return (
    <DashboardLayout role="buyer">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold">Support Tickets</h1>
          <p className="text-muted-foreground mt-2">Get help from our support team.</p>
        </div>
        <Button size="sm" onClick={() => setShowForm(v => !v)} className="gap-1 px-2">
          <Plus className="w-4 h-4 mr-1" />
          New Ticket
        </Button>
      </div>

      {showForm && (
        <div className="bg-card border border-border rounded-2xl p-6 mb-8">
          <h2 className="font-semibold text-sm lg:text-base mb-4">Create New Ticket</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input 
                id="subject" 
                placeholder="Brief description of your issue" 
                value={subject} 
                onChange={e => setSubject(e.target.value)} 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea 
                id="message" 
                placeholder="Describe your issue in detail..." 
                rows={4} 
                value={message} 
                onChange={e => setMessage(e.target.value)} 
              />
            </div>
            <div className="flex gap-2">
              <Button type="submit" disabled={loading} size="sm" className="gap-1 px-2">{loading ? "Submitting..." : "Submit Ticket"}</Button>
              <Button type="button" variant="outline" onClick={() => setShowForm(false)} size="sm" className="px-2">Cancel</Button>
            </div>
          </form>
        </div>
      )}

      {myTickets.length === 0 ? (
        <div className="bg-card border border-border rounded-2xl p-16 text-center">
          <LifeBuoy className="w-10 h-10 mx-auto mb-4 text-muted-foreground" />
          <h3 className="font-semibold mb-2">No tickets yet</h3>
          <p className="text-muted-foreground text-sm">Create a ticket if you need assistance.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {myTickets.map(ticket => (
            <div key={ticket.id} className="bg-card border border-border rounded-2xl overflow-hidden">
              {/* Ticket Header */}
              <div 
                className="p-6 cursor-pointer hover:bg-secondary/20 transition-colors"
                onClick={() => setExpandedTicket(expandedTicket === ticket.id ? null : ticket.id)}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{ticket.subject}</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      Ticket #{ticket.id.slice(0, 8)} · {format(new Date(ticket.date), "MMM d, yyyy 'at' h:mm a")}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className={STATUS_STYLES[ticket.status]}>
                      {ticket.status}
                    </Badge>
                    <MessageCircle className="w-4 h-4 text-muted-foreground" />
                    {(ticket.replies || []).length > 0 && (
                      <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                        {(ticket.replies || []).length} {(ticket.replies || []).length === 1 ? 'reply' : 'replies'}
                      </span>
                    )}
                  </div>
                </div>
                
                {/* Original Message Preview */}
                <p className="text-sm text-muted-foreground mt-3 line-clamp-2">{ticket.message}</p>
                
                <div className="flex items-center gap-2 mt-3">
                  <MessageCircle className="w-4 h-4 text-muted-foreground" />
                  <p className="text-xs text-muted-foreground">{getStatusMessage(ticket)}</p>
                  <ArrowUpRight className={`w-3 h-3 text-muted-foreground transition-transform ${expandedTicket === ticket.id ? 'rotate-180' : ''}`} />
                </div>
              </div>

              {/* Expanded Ticket Details */}
              {expandedTicket === ticket.id && (
                <div className="border-t border-border bg-secondary/20">
                  <div className="p-6 space-y-4">
                    {/* Original Message */}
                    <div>
                      <h4 className="font-semibold text-sm mb-2">Original Message</h4>
                      <div className="bg-background rounded-lg p-4 text-sm">
                        <p className="font-medium text-xs text-muted-foreground mb-2">
                          You · {format(new Date(ticket.date), "MMM d, yyyy 'at' h:mm a")}
                        </p>
                        <p>{ticket.message}</p>
                      </div>
                    </div>

                    {/* Replies */}
                    {(ticket.replies || []).length > 0 && (
                      <div>
                        <h4 className="font-semibold text-sm mb-3">Conversation</h4>
                        <div className="space-y-3">
                          {(ticket.replies || []).map(reply => (
                            <div key={reply.id} className={`rounded-lg p-4 text-sm ${
                              reply.from === 'admin' 
                                ? 'bg-primary/5 border border-primary/20' 
                                : 'bg-muted/30'
                            }`}>
                              <p className="font-medium text-xs mb-2">
                                {reply.senderName} · {reply.from === 'admin' ? 'Support Agent' : 'You'} · 
                                {format(new Date(reply.date), "MMM d, yyyy 'at' h:mm a")}
                              </p>
                              <p className="whitespace-pre-wrap">{reply.message}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Reply Form */}
                    {(ticket.status !== 'Closed') && (
                      <div>
                        <h4 className="font-semibold text-sm mb-2">Send Reply</h4>
                        <div className="space-y-3">
                          <Textarea
                            placeholder="Type your reply here..."
                            rows={3}
                            value={replyMessages[ticket.id] || ""}
                            onChange={e => setReplyMessages(prev => ({ ...prev, [ticket.id]: e.target.value }))}
                            className="resize-none"
                          />
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              onClick={() => handleSendReply(ticket.id)}
                              disabled={!replyMessages[ticket.id]?.trim()}
                              className="gap-1 px-2"
                            >
                              <Send className="w-3 h-3" />
                              Send Reply
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => setReplyMessages(prev => ({ ...prev, [ticket.id]: "" }))}
                              className="px-2"
                            >
                              Clear
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}

                    {ticket.status === 'Closed' && (
                      <div className="bg-muted/30 rounded-lg p-4 text-sm text-center">
                        <p className="text-muted-foreground">This ticket is closed. Create a new ticket for additional support.</p>
                      </div>
                    )}
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
