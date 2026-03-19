import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Plus, Trash2, Shield, Crown, Zap, Check, Lock } from "lucide-react";
import { useStore, PaymentMethod } from "@/lib/store";
import { toast } from "sonner";

export default function PaymentMethods() {
  const { currentUser } = useStore();
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newMethod, setNewMethod] = useState({
    type: 'card' as 'card' | 'bank' | 'paypal',
    cardNumber: '',
    expiry: '',
    cvv: '',
    holderName: '',
    bankName: '',
    accountNumber: '',
    routingNumber: ''
  });

  useEffect(() => {
    // Load saved payment methods (mock data for now)
    const mockMethods: PaymentMethod[] = [
      {
        id: '1',
        type: 'card',
        last4: '4242',
        brand: 'Visa',
        expiry: '12/25',
        isDefault: true
      }
    ];
    setPaymentMethods(mockMethods);
  }, []);

  const handleAddPaymentMethod = () => {
    if (newMethod.type === 'card') {
      if (!newMethod.cardNumber || !newMethod.expiry || !newMethod.cvv || !newMethod.holderName) {
        toast.error("Please fill all card details");
        return;
      }
      
      const cardMethod: PaymentMethod = {
        id: Date.now().toString(),
        type: 'card',
        last4: newMethod.cardNumber.slice(-4),
        brand: newMethod.cardNumber.startsWith('4') ? 'Visa' : 'Mastercard',
        expiry: newMethod.expiry,
        isDefault: paymentMethods.length === 0
      };
      
      setPaymentMethods([...paymentMethods, cardMethod]);
      toast.success("Card added successfully!");
    } else if (newMethod.type === 'bank') {
      if (!newMethod.bankName || !newMethod.accountNumber || !newMethod.routingNumber) {
        toast.error("Please fill all bank details");
        return;
      }
      
      const bankMethod: PaymentMethod = {
        id: Date.now().toString(),
        type: 'bank',
        bankName: newMethod.bankName,
        accountNumber: `****${newMethod.accountNumber.slice(-4)}`,
        isDefault: paymentMethods.length === 0
      };
      
      setPaymentMethods([...paymentMethods, bankMethod]);
      toast.success("Bank account added successfully!");
    }

    // Reset form
    setNewMethod({
      type: 'card',
      cardNumber: '',
      expiry: '',
      cvv: '',
      holderName: '',
      bankName: '',
      accountNumber: '',
      routingNumber: ''
    });
    setShowAddForm(false);
  };

  const handleRemoveMethod = (id: string) => {
    setPaymentMethods(paymentMethods.filter(method => method.id !== id));
    toast.success("Payment method removed");
  };

  const handleSetDefault = (id: string) => {
    setPaymentMethods(paymentMethods.map(method => ({
      ...method,
      isDefault: method.id === id
    })));
    toast.success("Default payment method updated");
  };

  const getPaymentIcon = (type: string) => {
    switch (type) {
      case 'card': return CreditCard;
      case 'bank': return Shield;
      case 'paypal': return Crown;
      default: return CreditCard;
    }
  };

  return (
    <DashboardLayout role={currentUser?.role || 'buyer'}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold">
            Payment <span className="gradient-text">Methods</span>
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your payment methods for purchases and withdrawals
          </p>
        </div>

        {/* Current Role Info */}
        <div className="bg-card border border-border rounded-2xl p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
              {currentUser?.role === 'seller' ? (
                <Crown className="w-6 h-6 text-primary" />
              ) : (
                <Zap className="w-6 h-6 text-primary" />
              )}
            </div>
            <div>
              <h2 className="text-xl font-bold">
                {currentUser?.role === 'seller' ? 'Seller Account' : 'Buyer Account'}
              </h2>
              <p className="text-sm text-muted-foreground">
                {currentUser?.role === 'seller' 
                  ? 'Add payment methods for withdrawals and earnings'
                  : 'Add payment methods for workflow purchases and subscriptions'
                }
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-muted/50 rounded-lg">
              <h3 className="font-semibold mb-2">For Purchases</h3>
              <p className="text-sm text-muted-foreground">
                Credit cards and PayPal for buying workflows and subscriptions
              </p>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg">
              <h3 className="font-semibold mb-2">For Withdrawals</h3>
              <p className="text-sm text-muted-foreground">
                Bank accounts for sellers to receive earnings
              </p>
            </div>
          </div>
        </div>

        {/* Payment Methods List */}
        <div className="bg-card border border-border rounded-2xl p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Saved Payment Methods</h2>
            <Button 
              onClick={() => setShowAddForm(true)}
              className="gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Payment Method
            </Button>
          </div>

          {paymentMethods.length === 0 ? (
            <div className="text-center py-8">
              <CreditCard className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-semibold mb-2">No Payment Methods</h3>
              <p className="text-muted-foreground mb-4">
                Add a payment method to start purchasing or receiving withdrawals
              </p>
              <Button onClick={() => setShowAddForm(true)}>
                Add Payment Method
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {paymentMethods.map((method) => {
                const Icon = getPaymentIcon(method.type);
                return (
                  <div key={method.id} className="border border-border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">
                              {method.type === 'card' 
                                ? `${method.brand} •••• ${method.last4}`
                                : method.type === 'bank'
                                ? `${method.bankName} •••• ${method.accountNumber}`
                                : 'PayPal'
                              }
                            </span>
                            {method.isDefault && (
                              <Badge className="bg-primary/10 text-primary border-primary/20">
                                Default
                              </Badge>
                            )}
                          </div>
                          {method.type === 'card' && method.expiry && (
                            <p className="text-sm text-muted-foreground">
                              Expires {method.expiry}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {!method.isDefault && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleSetDefault(method.id)}
                          >
                            Set Default
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRemoveMethod(method.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Add Payment Method Form */}
        {showAddForm && (
          <div className="bg-card border border-border rounded-2xl p-6">
            <h2 className="text-xl font-bold mb-6">Add Payment Method</h2>
            
            {/* Payment Type Selection */}
            <div className="mb-6">
              <h3 className="font-semibold mb-3">Payment Type</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { id: 'card', name: 'Credit Card', icon: CreditCard },
                  { id: 'bank', name: 'Bank Account', icon: Shield },
                  { id: 'paypal', name: 'PayPal', icon: Crown }
                ].map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setNewMethod({ ...newMethod, type: type.id as any })}
                    className={`p-3 border rounded-lg flex items-center gap-2 transition-colors ${
                      newMethod.type === type.id
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <type.icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{type.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Credit Card Form */}
            {newMethod.type === 'card' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Card Number</label>
                  <input
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    value={newMethod.cardNumber}
                    onChange={(e) => setNewMethod({ ...newMethod, cardNumber: e.target.value })}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-transparent"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Expiry Date</label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      value={newMethod.expiry}
                      onChange={(e) => setNewMethod({ ...newMethod, expiry: e.target.value })}
                      className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">CVV</label>
                    <input
                      type="text"
                      placeholder="123"
                      value={newMethod.cvv}
                      onChange={(e) => setNewMethod({ ...newMethod, cvv: e.target.value })}
                      className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Cardholder Name</label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    value={newMethod.holderName}
                    onChange={(e) => setNewMethod({ ...newMethod, holderName: e.target.value })}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-transparent"
                  />
                </div>
              </div>
            )}

            {/* Bank Account Form */}
            {newMethod.type === 'bank' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Bank Name</label>
                  <input
                    type="text"
                    placeholder="Bank of America"
                    value={newMethod.bankName}
                    onChange={(e) => setNewMethod({ ...newMethod, bankName: e.target.value })}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Account Number</label>
                  <input
                    type="text"
                    placeholder="123456789"
                    value={newMethod.accountNumber}
                    onChange={(e) => setNewMethod({ ...newMethod, accountNumber: e.target.value })}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Routing Number</label>
                  <input
                    type="text"
                    placeholder="123456789"
                    value={newMethod.routingNumber}
                    onChange={(e) => setNewMethod({ ...newMethod, routingNumber: e.target.value })}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-transparent"
                  />
                </div>
              </div>
            )}

            {/* PayPal */}
            {newMethod.type === 'paypal' && (
              <div className="text-center py-8">
                <Crown className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">PayPal Setup</h3>
                <p className="text-muted-foreground mb-4">
                  You will be redirected to PayPal to connect your account
                </p>
                <Button>Connect PayPal Account</Button>
              </div>
            )}

            {/* Form Actions */}
            <div className="flex gap-3 mt-6">
              <Button
                variant="outline"
                onClick={() => setShowAddForm(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddPaymentMethod}
                disabled={newMethod.type === 'paypal'}
              >
                Add Payment Method
              </Button>
            </div>
          </div>
        )}

        {/* Security Info */}
        <div className="mt-6 p-4 bg-muted/50 rounded-lg flex items-center gap-3">
          <Lock className="w-5 h-5 text-muted-foreground" />
          <div>
            <p className="text-sm font-medium">Secure Payment Processing</p>
            <p className="text-xs text-muted-foreground">
              Your payment information is encrypted and stored securely. We never share your financial details.
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
