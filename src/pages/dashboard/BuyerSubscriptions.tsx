import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { CreditCard, Gamepad2, Check, ArrowUpRight } from "lucide-react";
import { toast } from "sonner";

export default function BuyerSubscriptions() {
  const hasSubscription = true; // mock data
  const renewalDate = "April 16, 2026";
  const monthlyPrice = 9.99;

  const handleCancelSubscription = () => {
    toast.success("Subscription cancellation requested. You'll continue to have access until the end of your billing period.");
  };

  return (
    <DashboardLayout role="buyer">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold">
          My <span className="gradient-text">Subscriptions</span>
        </h1>
        <p className="text-muted-foreground mt-1">Manage your active subscriptions and billing</p>
      </div>

      {hasSubscription ? (
        <>
          {/* Active Subscription Card */}
          <div className="bg-card border border-border rounded-2xl overflow-hidden mb-6">
            <div className="gradient-bg p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <Gamepad2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Roblox Pro Plan</h2>
                    <p className="text-sm opacity-90">Active Subscription</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold">${monthlyPrice}</p>
                  <p className="text-sm opacity-90">/month</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-sm opacity-80 mb-1">Next billing date</p>
                  <p className="font-semibold">{renewalDate}</p>
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
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span className="text-sm">20+ Premium Roblox Scripts</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span className="text-sm">Priority Support</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span className="text-sm">Early Access to New Scripts</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span className="text-sm">Monthly Script Updates</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span className="text-sm">Exclusive Community Access</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span className="text-sm">Download All Scripts</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button variant="outline" onClick={handleCancelSubscription} className="text-destructive hover:text-destructive">
                  Cancel Subscription
                </Button>
                <Link href="/pricing">
                  <Button variant="secondary" className="flex-1">
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
              <div className="flex items-center justify-between py-3 border-b border-border">
                <div>
                  <p className="font-medium">Roblox Pro Plan - Monthly</p>
                  <p className="text-sm text-muted-foreground">March 16, 2026</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">${monthlyPrice}</p>
                  <p className="text-sm text-emerald-600">Paid</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between py-3 border-b border-border">
                <div>
                  <p className="font-medium">Roblox Pro Plan - Monthly</p>
                  <p className="text-sm text-muted-foreground">February 16, 2026</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">${monthlyPrice}</p>
                  <p className="text-sm text-emerald-600">Paid</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium">Roblox Pro Plan - Monthly</p>
                  <p className="text-sm text-muted-foreground">January 16, 2026</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">${monthlyPrice}</p>
                  <p className="text-sm text-emerald-600">Paid</p>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        /* No Active Subscription */
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center mx-auto mb-4">
            <CreditCard className="w-8 h-8 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-bold mb-2">No Active Subscription</h2>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            You don't have any active subscriptions. Subscribe to get access to premium Roblox scripts and exclusive features.
          </p>
          <Link href="/pricing">
            <Button size="lg" className="gradient-bg text-white border-0 gap-2">
              View Plans <ArrowUpRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      )}
    </DashboardLayout>
  );
}
