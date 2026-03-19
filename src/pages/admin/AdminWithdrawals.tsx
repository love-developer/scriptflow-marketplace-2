import { useState } from "react";
import { useStore } from "@/lib/store";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  DollarSign, TrendingUp, Clock, CheckCircle, XCircle, AlertCircle, 
  CreditCard, Wallet, Building2, Search, Filter, Calendar, User, Mail
} from "lucide-react";
import { toast } from "sonner";

export default function AdminWithdrawals() {
  const { withdrawalRequests, updateWithdrawalStatus } = useStore();
  const [selectedWithdrawal, setSelectedWithdrawal] = useState<any>(null);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [reviewAction, setReviewAction] = useState<'approve' | 'reject'>('approve');
  const [reviewMessage, setReviewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredWithdrawals = withdrawalRequests.filter(withdrawal => {
    const matchesSearch = withdrawal.sellerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         withdrawal.sellerEmail.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || withdrawal.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const handleReview = (withdrawal: any, action: 'approve' | 'reject') => {
    setSelectedWithdrawal(withdrawal);
    setReviewAction(action);
    setReviewMessage('');
    setReviewDialogOpen(true);
  };

  const handleSubmitReview = async () => {
    if (!selectedWithdrawal) return;

    try {
      await updateWithdrawalStatus(selectedWithdrawal.id, 
        reviewAction === 'approve' ? 'Approved' : 'Rejected', 
        reviewMessage
      );
      toast.success(`Withdrawal ${reviewAction}d successfully`);
      setReviewDialogOpen(false);
      setSelectedWithdrawal(null);
      setReviewMessage('');
    } catch (error) {
      toast.error(`Failed to ${reviewAction} withdrawal`);
    }
  };

  const handleMarkAsPaid = async (withdrawal: any) => {
    try {
      await updateWithdrawalStatus(withdrawal.id, 'Paid', 'Payment processed successfully');
      toast.success('Withdrawal marked as paid');
    } catch (error) {
      toast.error('Failed to mark as paid');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Rejected': return 'bg-red-100 text-red-800 border-red-200';
      case 'Paid': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Approved': return <CheckCircle className="w-3 h-3" />;
      case 'Rejected': return <XCircle className="w-3 h-3" />;
      case 'Paid': return <DollarSign className="w-3 h-3" />;
      default: return <Clock className="w-3 h-3" />;
    }
  };

  const totalPending = withdrawalRequests
    .filter(w => w.status === 'Pending')
    .reduce((sum, w) => sum + w.amount, 0);
    
  const totalApproved = withdrawalRequests
    .filter(w => w.status === 'Approved')
    .reduce((sum, w) => sum + w.amount, 0);
    
  const totalPaid = withdrawalRequests
    .filter(w => w.status === 'Paid')
    .reduce((sum, w) => sum + w.amount, 0);

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold">Withdrawal Management</h1>
          <p className="text-muted-foreground">Review and process seller withdrawal requests</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">${totalPending.toFixed(2)}</p>
                  <p className="text-xs text-muted-foreground">Pending Amount</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {withdrawalRequests.filter(w => w.status === 'Pending').length}
                  </p>
                  <p className="text-xs text-muted-foreground">Pending Requests</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">${totalApproved.toFixed(2)}</p>
                  <p className="text-xs text-muted-foreground">Approved Amount</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">${totalPaid.toFixed(2)}</p>
                  <p className="text-xs text-muted-foreground">Total Paid</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search by seller name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="w-full sm:w-48">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Withdrawals List */}
        <div className="space-y-4">
          {filteredWithdrawals.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <DollarSign className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No withdrawal requests found</h3>
                <p className="text-muted-foreground">
                  {searchTerm || statusFilter !== 'all' 
                    ? 'Try adjusting your search or filters' 
                    : 'No withdrawal requests have been submitted yet'}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredWithdrawals.map((withdrawal) => (
              <Card key={withdrawal.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Withdrawal Info */}
                    <div className="flex-1 space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-lg">{withdrawal.sellerName}</h3>
                            <Badge className={getStatusColor(withdrawal.status)}>
                              <div className="flex items-center gap-1">
                                {getStatusIcon(withdrawal.status)}
                                {withdrawal.status}
                              </div>
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Mail className="w-4 h-4" />
                              {withdrawal.sellerEmail}
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {new Date(withdrawal.requestedAt).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-emerald-600">${withdrawal.amount.toFixed(2)}</p>
                        </div>
                      </div>

                      {/* Payment Details */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm font-medium">
                          {withdrawal.paymentMethod === 'PayPal' && <CreditCard className="w-4 h-4" />}
                          {withdrawal.paymentMethod === 'Crypto' && <Wallet className="w-4 h-4" />}
                          {withdrawal.paymentMethod === 'Bank Transfer' && <Building2 className="w-4 h-4" />}
                          Payment Method: {withdrawal.paymentMethod}
                        </div>
                        
                        <div className="bg-muted/50 p-3 rounded-lg text-sm">
                          {withdrawal.paymentMethod === 'PayPal' && (
                            <p><strong>PayPal Email:</strong> {withdrawal.paymentDetails.paypalEmail}</p>
                          )}
                          {withdrawal.paymentMethod === 'Crypto' && (
                            <>
                              <p><strong>Wallet Address:</strong> {withdrawal.paymentDetails.walletAddress}</p>
                              <p><strong>Network:</strong> {withdrawal.paymentDetails.network}</p>
                            </>
                          )}
                          {withdrawal.paymentMethod === 'Bank Transfer' && (
                            <>
                              <p><strong>Account Name:</strong> {withdrawal.paymentDetails.accountName}</p>
                              <p><strong>Account Number:</strong> {withdrawal.paymentDetails.accountNumber}</p>
                              <p><strong>Bank Name:</strong> {withdrawal.paymentDetails.bankName}</p>
                              <p><strong>Country:</strong> {withdrawal.paymentDetails.country}</p>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Admin Review */}
                      {withdrawal.reviewMessage && (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm font-medium">
                            <AlertCircle className="w-4 h-4" />
                            Admin Review
                          </div>
                          <div className="bg-muted/50 p-3 rounded-lg">
                            <p className="text-sm text-muted-foreground mb-1">
                              {withdrawal.reviewMessage}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Reviewed by {withdrawal.reviewedBy} on {new Date(withdrawal.reviewedAt!).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="lg:w-48 flex lg:flex-col gap-2">
                      {withdrawal.status === 'Pending' && (
                        <>
                          <Button 
                            onClick={() => handleReview(withdrawal, 'approve')}
                            className="flex-1 gap-2"
                            size="sm"
                          >
                            <CheckCircle className="w-4 h-4" />
                            Approve
                          </Button>
                          <Button 
                            onClick={() => handleReview(withdrawal, 'reject')}
                            variant="destructive"
                            className="flex-1 gap-2"
                            size="sm"
                          >
                            <XCircle className="w-4 h-4" />
                            Reject
                          </Button>
                        </>
                      )}
                      {withdrawal.status === 'Approved' && (
                        <Button 
                          onClick={() => handleMarkAsPaid(withdrawal)}
                          className="flex-1 gap-2"
                          size="sm"
                        >
                          <DollarSign className="w-4 h-4" />
                          Mark as Paid
                        </Button>
                      )}
                      {withdrawal.status === 'Rejected' && (
                        <div className="text-center text-sm text-red-600 font-medium">
                          <XCircle className="w-5 h-5 mx-auto mb-1" />
                          Rejected
                        </div>
                      )}
                      {withdrawal.status === 'Paid' && (
                        <div className="text-center text-sm text-blue-600 font-medium">
                          <DollarSign className="w-5 h-5 mx-auto mb-1" />
                          Paid
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Review Dialog */}
        <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {reviewAction === 'approve' ? 'Approve Withdrawal' : 'Reject Withdrawal'}
              </DialogTitle>
              <DialogDescription>
                {selectedWithdrawal && (
                  <>
                    Reviewing withdrawal request from <strong>{selectedWithdrawal.sellerName}</strong>
                    <br />
                    Amount: <span className="font-semibold text-emerald-600">${selectedWithdrawal.amount.toFixed(2)}</span>
                  </>
                )}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="reviewMessage">Review Message (Optional)</Label>
                <Textarea
                  id="reviewMessage"
                  placeholder={reviewAction === 'approve' 
                    ? "Add a message for the approved withdrawal..." 
                    : "Explain why this withdrawal is being rejected..."
                  }
                  value={reviewMessage}
                  onChange={(e) => setReviewMessage(e.target.value)}
                  rows={4}
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setReviewDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleSubmitReview}
                variant={reviewAction === 'reject' ? 'destructive' : 'default'}
              >
                {reviewAction === 'approve' ? 'Approve' : 'Reject'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
