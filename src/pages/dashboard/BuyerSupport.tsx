import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { LifeBuoy, Plus, MessageCircle } from "lucide-react";
import { format } from "date-fns";

const STATUS_STYLES: Record<string, string> = {
  "Open": "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800",
  "In Progress": "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800",
  "Resolved": "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800",
  "Closed": "bg-secondary text-muted-foreground border-border",
};

const MOCK_REPLIES: Record<string, { from: string; message: string; date: string }[]> = {};

export default function BuyerSupport() {
  const { tickets, currentUser, createTicket } = useStore();
  const myTickets = tickets.filter(t => t.userId === currentUser?.id);

  const [showForm, setShowForm] = useState(false);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

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

  return (
    <DashboardLayout role="buyer">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Support Tickets</h1>
          <p className="text-muted-foreground mt-2">Get help from our support team.</p>
        </div>
        <Button onClick={() => setShowForm(v => !v)}>
          <Plus className="w-4 h-4 mr-2" />
          New Ticket
        </Button>
      </div>

      {showForm && (
        <div className="bg-card border border-border rounded-2xl p-6 mb-8">
          <h2 className="font-semibold text-lg mb-4">Create New Ticket</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input id="subject" placeholder="Brief description of your issue" value={subject} onChange={e => setSubject(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea id="message" placeholder="Describe your issue in detail..." rows={4} value={message} onChange={e => setMessage(e.target.value)} />
            </div>
            <div className="flex gap-3">
              <Button type="submit" disabled={loading}>{loading ? "Submitting..." : "Submit Ticket"}</Button>
              <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
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
            <div key={ticket.id} className="bg-card border border-border rounded-2xl p-6">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <h3 className="font-semibold">{ticket.subject}</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    Ticket #{ticket.id.slice(0, 8)} · {format(new Date(ticket.date), "MMM d, yyyy 'at' h:mm a")}
                  </p>
                </div>
                <Badge variant="outline" className={STATUS_STYLES[ticket.status]}>{ticket.status}</Badge>
              </div>
              <p className="text-sm text-muted-foreground bg-secondary/50 rounded-lg p-3">{ticket.message}</p>

              {MOCK_REPLIES[ticket.id] ? (
                <div className="mt-4 space-y-2">
                  {MOCK_REPLIES[ticket.id].map((reply, i) => (
                    <div key={i} className="bg-secondary/40 rounded-lg p-3 text-sm">
                      <p className="font-medium text-xs mb-1">{reply.from} · Support Agent</p>
                      <p className="text-muted-foreground">{reply.message}</p>
                    </div>
                  ))}
                </div>
              ) : ticket.status === "Resolved" ? (
                <div className="mt-4 bg-secondary/40 rounded-lg p-3 text-sm">
                  <p className="font-medium text-xs mb-1">Support Team · Agent Reply</p>
                  <p className="text-muted-foreground">Thank you for contacting us! Your issue has been resolved. Please let us know if you need further assistance.</p>
                </div>
              ) : null}

              <div className="flex items-center gap-2 mt-4 pt-3 border-t border-border">
                <MessageCircle className="w-4 h-4 text-muted-foreground" />
                <p className="text-xs text-muted-foreground">
                  {ticket.status === "Open" ? "Waiting for support team response..." : ticket.status === "Resolved" ? "Ticket resolved." : "In progress — agent is reviewing your ticket."}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
