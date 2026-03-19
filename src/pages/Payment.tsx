import { useState, useEffect } from "react";
import { useRoute, useLocation } from "wouter";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CreditCard, Shield, Crown, ArrowLeft, Check, Lock, AlertCircle } from "lucide-react";
import { useStore, PaymentMethod } from "@/lib/store";
import { toast } from "sonner";

export default function Payment() {
  const [, params] = useRoute("/payment");
  const [, setLocation] = useLocation();
  const { items, currentUser, buyItem, addPaymentMethod } = useStore();
  
  const [selectedMethod, setSelectedMethod] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showNewCardForm, setShowNewCardForm] = useState(false);
  const [newCard, setNewCard] = useState({
    cardNumber: '',
    expiry: '',
    cvv: '',
    holderName: ''
  });
  
  const itemId = params?.item;
  const item = items.find(i => i.id === itemId);
  const paymentMethods = currentUser?.paymentMethods || [];

  useEffect(() => {
    // Set default payment method
    const defaultMethod = paymentMethods.find(method => method.isDefault);
    if (defaultMethod) {
      setSelectedMethod(defaultMethod.id);
    }
  }, [paymentMethods]);

  if (!item) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Item Not Found</h2>
            <p className="text-muted-foreground mb-6">The item you're trying to purchase doesn't exist.</p>
            <Button onClick={() => setLocation("/")}>Back to Home</Button>
          </div>
        </div>
      </Layout>
    );
  }

  const selectedPaymentMethod = paymentMethods.find(method => method.id === selectedMethod);

  const handleAddNewCard = () => {
    if (!newCard.cardNumber || !newCard.expiry || !newCard.cvv || !newCard.holderName) {
      toast.error("Please fill all card details");
      return;
    }

    // Add the new card to payment methods
    const cardMethod: Omit<PaymentMethod, 'id'> = {
      type: 'card',
      last4: newCard.cardNumber.slice(-4),
      brand: newCard.cardNumber.startsWith('4') ? 'Visa' : newCard.cardNumber.startsWith('5') ? 'Mastercard' : 'Amex',
      expiry: newCard.expiry,
      isDefault: paymentMethods.length === 0
    };

    addPaymentMethod(cardMethod);
    
    // Reset form and select the newly added card
    setNewCard({
      cardNumber: '',
      expiry: '',
      cvv: '',
      holderName: ''
    });
    setShowNewCardForm(false);
    
    toast.success("Card added successfully!");
  };

  const handlePayment = async () => {
    if (!currentUser) {
      toast.error("Please login to continue");
      setLocation('/login');
      return;
    }

    if (!selectedMethod) {
      toast.error("Please select a payment method");
      return;
    }

    setIsProcessing(true);
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Complete the purchase
      buyItem(item.id);
      
      toast.success("Payment successful! You can now access your workflow.");
      setLocation(`/item/${item.id}`);
    } catch (error) {
      toast.error("Payment failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
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
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => setLocation(`/item/${item.id}`)}
            className="mb-4 gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Item
          </Button>
          
          <h1 className="text-3xl font-bold mb-2">
            Complete Your <span className="gradient-text">Purchase</span>
          </h1>
          <p className="text-muted-foreground">
            Review your order and select a payment method
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-4">
                  <img 
                    src={item.image} 
                    alt={item.title}
                    className="w-16 h-16 rounded-lg object-cover border border-border"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.category}</p>
                    <p className="text-sm text-muted-foreground">by {item.seller}</p>
                  </div>
                </div>
                
                <div className="border-t border-border pt-4 space-y-2">
                  <div className="flex justify-between">
                    <span>Item Price</span>
                    <span>${item.price.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Processing Fee</span>
                    <span>$0.00</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg border-t border-border pt-2">
                    <span>Total</span>
                    <span>${item.price.toFixed(2)}</span>
                  </div>
                </div>

                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-green-700 dark:text-green-300">
                    <Check className="w-4 h-4" />
                    <span className="text-sm font-medium">Instant Access</span>
                  </div>
                  <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                    Get immediate access after payment
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Payment Methods */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Select Payment Method</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {paymentMethods.length === 0 ? (
                  <div className="text-center py-8">
                    <CreditCard className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">No Payment Methods</h3>
                    <p className="text-muted-foreground mb-4">
                      You need to add a payment method to complete this purchase
                    </p>
                    <Button onClick={() => setShowNewCardForm(true)}>
                      <CreditCard className="w-4 h-4 mr-2" />
                      Add New Card
                    </Button>
                    
                    {/* New Card Form */}
                    {showNewCardForm && (
                      <div className="mt-6 border border-border rounded-lg p-4 bg-muted/30">
                        <h3 className="font-semibold mb-4">Add New Card</h3>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium mb-2">Card Number</label>
                            <input
                              type="text"
                              placeholder="1234 5678 9012 3456"
                              value={newCard.cardNumber}
                              onChange={(e) => setNewCard({ ...newCard, cardNumber: e.target.value })}
                              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-transparent"
                              maxLength={16}
                            />
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium mb-2">Expiry Date</label>
                              <input
                                type="text"
                                placeholder="MM/YY"
                                value={newCard.expiry}
                                onChange={(e) => setNewCard({ ...newCard, expiry: e.target.value })}
                                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-transparent"
                                maxLength={5}
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-2">CVV</label>
                              <input
                                type="text"
                                placeholder="123"
                                value={newCard.cvv}
                                onChange={(e) => setNewCard({ ...newCard, cvv: e.target.value })}
                                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-transparent"
                                maxLength={4}
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium mb-2">Cardholder Name</label>
                            <input
                              type="text"
                              placeholder="John Doe"
                              value={newCard.holderName}
                              onChange={(e) => setNewCard({ ...newCard, holderName: e.target.value })}
                              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-transparent"
                            />
                          </div>

                          <div className="flex gap-3">
                            <Button
                              variant="outline"
                              onClick={() => {
                                setShowNewCardForm(false);
                                setNewCard({
                                  cardNumber: '',
                                  expiry: '',
                                  cvv: '',
                                  holderName: ''
                                });
                              }}
                              className="flex-1"
                            >
                              Cancel
                            </Button>
                            <Button
                              onClick={handleAddNewCard}
                              className="flex-1"
                            >
                              Add Card
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <>
                    <RadioGroup value={selectedMethod} onValueChange={setSelectedMethod}>
                      <div className="space-y-3">
                        {paymentMethods.map((method) => {
                          const Icon = getPaymentIcon(method.type);
                          return (
                            <div key={method.id} className="flex items-center space-x-3">
                              <RadioGroupItem value={method.id} id={method.id} />
                              <Label 
                                htmlFor={method.id}
                                className="flex items-center gap-3 cursor-pointer flex-1 p-3 border border-border rounded-lg hover:bg-muted/50"
                              >
                                <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                                  <Icon className="w-5 h-5" />
                                </div>
                                <div className="flex-1">
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
                              </Label>
                            </div>
                          );
                        })}
                      </div>
                    </RadioGroup>

                    <div className="flex gap-3">
                      <Button 
                        variant="outline" 
                        onClick={() => setShowNewCardForm(true)}
                        className="flex-1"
                      >
                        <CreditCard className="w-4 h-4 mr-2" />
                        Add New Card
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => setLocation('/dashboard/payment-methods')}
                        className="flex-1"
                      >
                        Manage Payment Methods
                      </Button>
                    </div>

                    {/* New Card Form */}
                    {showNewCardForm && (
                      <div className="border border-border rounded-lg p-4 bg-muted/30">
                        <h3 className="font-semibold mb-4">Add New Card</h3>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium mb-2">Card Number</label>
                            <input
                              type="text"
                              placeholder="1234 5678 9012 3456"
                              value={newCard.cardNumber}
                              onChange={(e) => setNewCard({ ...newCard, cardNumber: e.target.value })}
                              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-transparent"
                              maxLength={16}
                            />
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium mb-2">Expiry Date</label>
                              <input
                                type="text"
                                placeholder="MM/YY"
                                value={newCard.expiry}
                                onChange={(e) => setNewCard({ ...newCard, expiry: e.target.value })}
                                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-transparent"
                                maxLength={5}
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-2">CVV</label>
                              <input
                                type="text"
                                placeholder="123"
                                value={newCard.cvv}
                                onChange={(e) => setNewCard({ ...newCard, cvv: e.target.value })}
                                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-transparent"
                                maxLength={4}
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium mb-2">Cardholder Name</label>
                            <input
                              type="text"
                              placeholder="John Doe"
                              value={newCard.holderName}
                              onChange={(e) => setNewCard({ ...newCard, holderName: e.target.value })}
                              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-transparent"
                            />
                          </div>

                          <div className="flex gap-3">
                            <Button
                              variant="outline"
                              onClick={() => {
                                setShowNewCardForm(false);
                                setNewCard({
                                  cardNumber: '',
                                  expiry: '',
                                  cvv: '',
                                  holderName: ''
                                });
                              }}
                              className="flex-1"
                            >
                              Cancel
                            </Button>
                            <Button
                              onClick={handleAddNewCard}
                              className="flex-1"
                            >
                              Add Card
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Payment Button */}
                    <div className="border-t border-border pt-6">
                      <Button 
                        onClick={handlePayment}
                        disabled={!selectedMethod || isProcessing}
                        className="w-full gap-2"
                        size="lg"
                      >
                        {isProcessing ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Processing Payment...
                          </>
                        ) : (
                          <>
                            <Lock className="w-4 h-4" />
                            Pay ${item.price.toFixed(2)}
                          </>
                        )}
                      </Button>
                      
                      <p className="text-xs text-muted-foreground text-center mt-3">
                        Your payment information is encrypted and secure. 
                        We never store your card details on our servers.
                      </p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
