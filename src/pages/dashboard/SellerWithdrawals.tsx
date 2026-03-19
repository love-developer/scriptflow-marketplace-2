import { useState } from "react";
import { useStore } from "@/lib/store";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  DollarSign, TrendingUp, Clock, CheckCircle, XCircle, AlertCircle, 
  CreditCard, Wallet, Building2, ArrowRight, History
} from "lucide-react";
import { toast } from "sonner";

export default function SellerWithdrawals() {
  const { currentUser, withdrawalRequests, requestWithdrawal } = useStore();
  const [showRequestDialog, setShowRequestDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    amount: '',
    paymentMethod: '',
    paypalEmail: '',
    walletAddress: '',
    network: '',
    accountName: '',
    accountNumber: '',
    bankName: '',
    country: ''
  });

  const myWithdrawalRequests = withdrawalRequests.filter(w => w.sellerId === currentUser?.id);
  
  // Calculate balances
  const availableBalance = currentUser?.availableBalance || 0;
  const pendingBalance = currentUser?.pendingBalance || 0;
  const totalWithdrawn = currentUser?.totalWithdrawn || 0;

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmitWithdrawal = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const amount = parseFloat(formData.amount);
    
    if (!amount || amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    
    if (amount > availableBalance) {
      toast.error("Amount exceeds available balance");
      return;
    }
    
    if (amount < 50) {
      toast.error("Minimum withdrawal amount is $50");
      return;
    }

    if (!formData.paymentMethod) {
      toast.error("Please select a payment method");
      return;
    }

    // Validate payment method specific fields
    if (formData.paymentMethod === 'PayPal' && !formData.paypalEmail) {
      toast.error("Please enter your PayPal email");
      return;
    }
    
    if (formData.paymentMethod === 'Crypto' && (!formData.walletAddress || !formData.network)) {
      toast.error("Please enter wallet address and network");
      return;
    }
    
    if (formData.paymentMethod === 'Bank Transfer' && 
        (!formData.accountName || !formData.accountNumber || !formData.bankName || !formData.country)) {
      toast.error("Please fill in all bank details");
      return;
    }

    setIsSubmitting(true);
    
    try {
      const paymentDetails = {
        ...(formData.paymentMethod === 'PayPal' && { paypalEmail: formData.paypalEmail }),
        ...(formData.paymentMethod === 'Crypto' && { 
          walletAddress: formData.walletAddress, 
          network: formData.network 
        }),
        ...(formData.paymentMethod === 'Bank Transfer' && {
          accountName: formData.accountName,
          accountNumber: formData.accountNumber,
          bankName: formData.bankName,
          country: formData.country
        })
      };

      await requestWithdrawal({
        amount,
        paymentMethod: formData.paymentMethod as any,
        paymentDetails,
        sellerId: currentUser!.id,
        sellerName: currentUser!.username,
        sellerEmail: currentUser!.email
      });

      toast.success("Withdrawal request submitted successfully!");
      
      // Reset form
      setFormData({
        amount: '',
        paymentMethod: '',
        paypalEmail: '',
        walletAddress: '',
        network: '',
        accountName: '',
        accountNumber: '',
        bankName: '',
        country: ''
      });
      setShowRequestDialog(false);
      
    } catch (error) {
      toast.error("Failed to submit withdrawal request");
    } finally {
      setIsSubmitting(false);
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

  return (
    <DashboardLayout role="seller">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold">Withdrawals</h1>
          <p className="text-muted-foreground">Manage your earnings and withdrawal requests</p>
        </div>

        {/* Balance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-emerald-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">Available Balance</p>
                  <p className="text-2xl font-bold text-emerald-600">${availableBalance.toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">Pending Balance</p>
                  <p className="text-2xl font-bold text-yellow-600">${pendingBalance.toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">Total Withdrawn</p>
                  <p className="text-2xl font-bold text-blue-600">${totalWithdrawn.toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Request Withdrawal */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              Request Withdrawal
            </CardTitle>
            <CardDescription>
              Minimum withdrawal amount is $50. All withdrawals are manually reviewed and approved by admin.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Available: <span className="font-semibold text-emerald-600">${availableBalance.toFixed(2)}</span>
              </div>
              <Button 
                onClick={() => setShowRequestDialog(true)}
                disabled={availableBalance < 50}
                className="gap-2"
              >
                <ArrowRight className="w-4 h-4" />
                Request Withdrawal
              </Button>
            </div>
            {availableBalance < 50 && (
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center gap-2 text-yellow-800">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-sm">
                    You need at least $50 in available balance to request a withdrawal
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Withdrawal History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="w-5 h-5" />
              Withdrawal History
            </CardTitle>
            <CardDescription>
              Track your withdrawal requests and their admin review status
            </CardDescription>
          </CardHeader>
          <CardContent>
            {myWithdrawalRequests.length === 0 ? (
              <div className="text-center py-8">
                <History className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No withdrawal history</h3>
                <p className="text-muted-foreground">
                  Your withdrawal requests will appear here once you submit them
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {myWithdrawalRequests.map((withdrawal) => (
                  <div key={withdrawal.id} className="border border-border rounded-lg p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <span className="font-semibold text-lg">${withdrawal.amount.toFixed(2)}</span>
                          <Badge className={getStatusColor(withdrawal.status)}>
                            <div className="flex items-center gap-1">
                              {getStatusIcon(withdrawal.status)}
                              {withdrawal.status}
                            </div>
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            {withdrawal.paymentMethod === 'PayPal' && <CreditCard className="w-4 h-4" />}
                            {withdrawal.paymentMethod === 'Crypto' && <Wallet className="w-4 h-4" />}
                            {withdrawal.paymentMethod === 'Bank Transfer' && <Building2 className="w-4 h-4" />}
                            {withdrawal.paymentMethod}
                          </span>
                          <span>{new Date(withdrawal.requestedAt).toLocaleDateString()}</span>
                        </div>
                        {withdrawal.reviewMessage && (
                          <div className="text-sm bg-muted/50 p-2 rounded">
                            <span className="font-medium">Admin Note:</span> {withdrawal.reviewMessage}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Withdrawal Request Dialog */}
        <Dialog open={showRequestDialog} onOpenChange={setShowRequestDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Request Withdrawal</DialogTitle>
              <DialogDescription>
                Available balance: <span className="font-semibold text-emerald-600">${availableBalance.toFixed(2)}</span>
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmitWithdrawal} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount (USD) *</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    min="50"
                    max={availableBalance}
                    placeholder="50.00"
                    value={formData.amount}
                    onChange={(e) => handleInputChange('amount', e.target.value)}
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Minimum: $50 | Maximum: ${availableBalance.toFixed(2)}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="paymentMethod">Payment Method *</Label>
                  <Select value={formData.paymentMethod} onValueChange={(value) => handleInputChange('paymentMethod', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select payment method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PayPal">PayPal</SelectItem>
                      <SelectItem value="Crypto">Cryptocurrency</SelectItem>
                      <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Payment Method Specific Fields */}
              {formData.paymentMethod === 'PayPal' && (
                <div className="space-y-2">
                  <Label htmlFor="paypalEmail">PayPal Email *</Label>
                  <Input
                    id="paypalEmail"
                    type="email"
                    placeholder="your@email.com"
                    value={formData.paypalEmail}
                    onChange={(e) => handleInputChange('paypalEmail', e.target.value)}
                    required
                  />
                </div>
              )}

              {formData.paymentMethod === 'Crypto' && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="walletAddress">Wallet Address *</Label>
                    <Input
                      id="walletAddress"
                      placeholder="0x1234...abcd"
                      value={formData.walletAddress}
                      onChange={(e) => handleInputChange('walletAddress', e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="network">Network *</Label>
                    <Select value={formData.network} onValueChange={(value) => handleInputChange('network', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select network" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="TRC20">TRC20 (USDT)</SelectItem>
                        <SelectItem value="ERC20">ERC20 (USDT)</SelectItem>
                        <SelectItem value="BEP20">BEP20 (USDT)</SelectItem>
                        <SelectItem value="BTC">Bitcoin</SelectItem>
                        <SelectItem value="ETH">Ethereum</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {formData.paymentMethod === 'Bank Transfer' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="accountName">Account Name *</Label>
                      <Input
                        id="accountName"
                        placeholder="John Doe"
                        value={formData.accountName}
                        onChange={(e) => handleInputChange('accountName', e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="accountNumber">Account Number *</Label>
                      <Input
                        id="accountNumber"
                        placeholder="1234567890"
                        value={formData.accountNumber}
                        onChange={(e) => handleInputChange('accountNumber', e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="bankName">Bank Name *</Label>
                      <Input
                        id="bankName"
                        placeholder="Bank of America"
                        value={formData.bankName}
                        onChange={(e) => handleInputChange('bankName', e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="country">Country *</Label>
                      <Input
                        id="country"
                        placeholder="United States"
                        value={formData.country}
                        onChange={(e) => handleInputChange('country', e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setShowRequestDialog(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Submitting..." : "Submit Request"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
