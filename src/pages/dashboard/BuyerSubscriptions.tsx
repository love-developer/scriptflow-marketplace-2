import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { CreditCard, Shield, Crown, Zap, Check, ArrowUpRight, Calendar } from "lucide-react";
import { toast } from "sonner";
import { useStore } from "@/lib/store";

export default function BuyerSubscriptions() {
  const { currentUser } = useStore();
  const subscriptionPlan = currentUser?.subscriptionPlan || 'Free';
  
  const planDetails = {
    'Free': {
      name: 'Free Plan',
      price: 0,
      icon: Zap,
      features: ['Access to 3 scripts', 'Basic support'],
      color: 'text-gray-600 bg-gray-50 border-gray-200',
      description: 'Perfect for getting started'
    },
    'Premium': {
      name: 'Premium Plan',
      price: 9.99,
      icon: Shield,
      features: ['Access to 10 scripts', 'Basic AI workflows', 'Priority support', 'Ad-free experience'],
      color: 'text-blue-600 bg-blue-50 border-blue-200',
      description: 'Great for regular users'
    },
    'Premium+': {
      name: 'Premium+ Plan',
      price: 19.99,
      icon: Crown,
      features: ['Unlimited scripts', 'All AI workflows', '24/7 support', 'Early access to new features', 'Exclusive content'],
      color: 'text-purple-600 bg-purple-50 border-purple-200',
      description: 'Ultimate experience for power users'
    }
  };

  const currentPlan = planDetails[subscriptionPlan];
  const renewalDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  const { upgradeSubscription } = useStore();

  const handleCancelSubscription = () => {
    upgradeSubscription('Free');
    toast.success("Subscription cancelled. You've been downgraded to the Free plan.");
  };

  
  return (
    <DashboardLayout role="buyer">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold">
          My <span className="gradient-text">Subscriptions</span>
        </h1>
        <p className="text-muted-foreground mt-1">Manage your subscription and billing</p>
      </div>

      {/* Current Plan Card */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden mb-6">
        <div className={`p-6 text-white ${subscriptionPlan === 'Premium+' ? 'gradient-bg' : subscriptionPlan === 'Premium' ? 'bg-blue-600' : 'bg-gradient-to-r from-gray-600 to-gray-700'}`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <currentPlan.icon className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold">{currentPlan.name}</h2>
                <p className="text-sm opacity-90">{currentPlan.description}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold">${currentPlan.price}</p>
              <p className="text-sm opacity-90">{currentPlan.price > 0 ? '/month' : 'Free'}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-sm opacity-80 mb-1">Next billing date</p>
              <p className="font-semibold">{currentPlan.price > 0 ? renewalDate : 'No billing required'}</p>
            </div>
            <div>
              <p className="text-sm opacity-80 mb-1">Status</p>
              <p className="font-semibold flex items-center gap-1">
                <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                Active
              </p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <h3 className="font-bold text-lg mb-4">What's included</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
            {currentPlan.features.map((feature, index) => (
              <div key={index} className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <span className="text-sm">{feature}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            {subscriptionPlan !== 'Free' && (
              <Button variant="outline" onClick={handleCancelSubscription} className="text-destructive hover:text-destructive">
                Cancel Plan
              </Button>
            )}
            <Link href="/pricing">
              <Button variant="secondary">
                Change Plan
              </Button>
            </Link>
          </div>
        </div>
      </div>

      
      {/* Billing History */}
      <div className="bg-card border border-border rounded-2xl p-6">
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-muted-foreground" />
          Billing History
        </h3>
        
        <div className="space-y-3">
          {subscriptionPlan !== 'Free' && (
            <div className="flex items-center justify-between py-3 border-b border-border">
              <div>
                <p className="font-medium">{currentPlan.name} - {currentPlan.price > 0 ? 'Monthly' : 'Free'}</p>
                <p className="text-sm text-muted-foreground">{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold">${currentPlan.price}</p>
                <p className="text-sm text-emerald-600">Paid</p>
              </div>
            </div>
          )}
          
          {/* Show mock historical data for paid plans */}
          {subscriptionPlan !== 'Free' && (
            <>
              <div className="flex items-center justify-between py-3 border-b border-border">
                <div>
                  <p className="font-medium">{currentPlan.name} - Monthly</p>
                  <p className="text-sm text-muted-foreground">February 16, 2026</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">${currentPlan.price}</p>
                  <p className="text-sm text-emerald-600">Paid</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium">{currentPlan.name} - Monthly</p>
                  <p className="text-sm text-muted-foreground">January 16, 2026</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">${currentPlan.price}</p>
                  <p className="text-sm text-emerald-600">Paid</p>
                </div>
              </div>
            </>
          )}
          
          {subscriptionPlan === 'Free' && (
            <div className="text-center py-8 text-muted-foreground">
              <p>No billing history available for Free plan</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
