import { useState, useEffect } from "react";
import { useRoute, useLocation } from "wouter";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CreditCard, Shield, Crown, ArrowLeft, Check, Lock, AlertCircle, Calendar } from "lucide-react";
import { useStore, PaymentMethod } from "@/lib/store";
import { toast } from "sonner";

const PLANS = [
  {
    name: "Premium",
    price: 9.99,
    yearlyPrice: 7.99,
    icon: Shield,
    description: "For regular users",
    features: [
      "Access to 10 scripts",
      "Basic AI workflows", 
      "Priority support",
      "Ad-free experience",
    ],
    value: 'Premium'
  },
  {
    name: "Premium+",
    price: 19.99,
    yearlyPrice: 15.99,
    icon: Crown,
    description: "Everything, unlimited",
    features: [
      "Unlimited scripts",
      "All AI workflows",
      "24/7 support",
      "Early access to new features",
      "Exclusive content",
    ],
    value: 'PremiumPlus'
  },
];

export default function SubscriptionPayment() {
  const [, params] = useRoute("/subscription-payment");
  const [, setLocation] = useLocation();
  const { currentUser, upgradeSubscription, addPaymentMethod } = useStore();
  
  const [selectedMethod, setSelectedMethod] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [yearly, setYearly] = useState(false);
  const [showNewCardForm, setShowNewCardForm] = useState(false);
  const [newCard, setNewCard] = useState({
    cardNumber: '',
    expiry: '',
    cvv: '',
    holderName: ''
  });
  
  // Get plan from query parameters
  const urlParams = new URLSearchParams(window.location.search);
  const planName = urlParams.get('plan');
  const plan = PLANS.find(p => p.value === planName);
  
  const paymentMethods = currentUser?.paymentMethods || [];

  useEffect(() => {
    // Set default payment method
    const defaultMethod = paymentMethods.find((method: any) => method.isDefault);
    if (defaultMethod) {
      setSelectedMethod(defaultMethod.id);
    }
  }, [paymentMethods]);

  if (!plan) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Plan Not Found</h2>
            <p className="text-muted-foreground mb-6">The subscription plan you're looking for doesn't exist.</p>
            <Button onClick={() => setLocation("/pricing")}>Back to Pricing</Button>
          </div>
        </div>
      </Layout>
    );
  }

  const selectedPaymentMethod = paymentMethods.find((method: any) => method.id === selectedMethod);
  const finalPrice = yearly ? plan.yearlyPrice : plan.price;

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

    if (!selectedMethod) {
      toast.error("Please select a payment method");
      return;
    }

    setIsProcessing(true);
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Complete the subscription upgrade
      const finalPlanName = plan.value === 'PremiumPlus' ? 'Premium+' : plan.value;
      upgradeSubscription(finalPlanName as any);
      
      toast.success(`Successfully upgraded to ${plan.name}!`);
      setLocation('/dashboard/subscriptions');
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
            onClick={() => setLocation("/pricing")}
            className="mb-4 gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Pricing
          </Button>
          
          <h1 className="text-3xl font-bold mb-2">
            Complete Your <span className="gradient-text">Subscription</span>
          </h1>
          <p className="text-muted-foreground">
            Review your subscription plan and select a payment method
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Plan Summary */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Subscription Plan</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <plan.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{plan.name}</h3>
                    <p className="text-sm text-muted-foreground">{plan.description}</p>
                  </div>
                </div>
                
                {/* Billing Toggle */}
                <div className="bg-muted/50 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm font-medium">Billing Cycle</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setYearly(false)}
                      className={`flex-1 py-2 px-3 rounded text-sm font-medium transition-colors ${
                        !yearly ? "bg-primary text-primary-foreground" : "bg-background border border-border"
                      }`}
                    >
                      Monthly
                    </button>
                    <button
                      onClick={() => setYearly(true)}
                      className={`flex-1 py-2 px-3 rounded text-sm font-medium transition-colors ${
                        yearly ? "bg-primary text-primary-foreground" : "bg-background border border-border"
                      }`}
                    >
                      Yearly (Save 20%)
                    </button>
                  </div>
                </div>
                
                <div className="border-t border-border pt-4 space-y-2">
                  <div className="flex justify-between">
                    <span>Base Price</span>
                    <span>${finalPrice.toFixed(2)}/mo</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Platform Fee</span>
                    <span>$0.00</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg border-t border-border pt-2">
                    <span>
                      {yearly ? 'Yearly' : 'Monthly'} Total
                    </span>
                    <span>
                      ${finalPrice.toFixed(2)}
                      {yearly && <span className="text-sm font-normal text-muted-foreground">/mo</span>}
                    </span>
                  </div>
                  {yearly && (
                    <p className="text-sm text-emerald-600 dark:text-emerald-400">
                      Billed ${(finalPrice * 12).toFixed(0)} per year
                    </p>
                  )}
                </div>

                {/* Features */}
                <div className="border-t border-border pt-4">
                  <h4 className="font-semibold mb-3">What's Included:</h4>
                  <ul className="space-y-2">
                    {plan.features.map(feature => (
                      <li key={feature} className="flex items-start gap-2 text-sm">
                        <Check className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
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
                      You need to add a payment method to complete this subscription
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
                        {paymentMethods.map((method: any) => {
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
                            Subscribe to {plan.name} - ${finalPrice.toFixed(2)}/mo
                          </>
                        )}
                      </Button>
                      
                      <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                        <p className="text-sm text-blue-700 dark:text-blue-300">
                          <strong>Subscription Details:</strong> Your subscription will automatically renew each {yearly ? 'year' : 'month'}. You can cancel anytime from your dashboard.
                        </p>
                      </div>
                      
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
