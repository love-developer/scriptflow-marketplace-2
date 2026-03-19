import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { CheckCircle2, Crown, Shield } from "lucide-react";
import { useStore } from "@/lib/store";
import { toast } from "sonner";

const PLANS = [
  {
    name: "Free",
    price: 0,
    yearlyPrice: 0,
    icon: Shield,
    description: "Perfect for getting started",
    features: [
      "Access to 3 scripts",
      "Basic support",
    ],
    highlight: false,
    badge: null,
    iconBg: "bg-gray-100",
    iconColor: "text-gray-600",
    value: 'Free'
  },
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
    highlight: true,
    badge: "Most Popular",
    iconBg: "gradient-bg",
    iconColor: "text-white",
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
    highlight: false,
    badge: "Best Value",
    iconBg: "bg-purple-100",
    iconColor: "text-purple-600",
    value: 'Premium+'
  },
];

export default function Pricing() {
  const { currentUser, upgradeSubscription } = useStore();
  const [yearly, setYearly] = useState(false);

  const handleSubscribe = (planName: string) => {
    console.log('Pricing page - handleSubscribe called with:', planName);
    
    if (!currentUser) {
      toast.error("Please log in to subscribe.");
      return;
    }
    
    // Handle subscription change directly without payment page
    upgradeSubscription(planName as any);
    
    if (planName === 'Free') {
      toast.success("Successfully downgraded to Free plan!");
    } else if (planName === 'Premium') {
      toast.success("Successfully upgraded to Premium plan!");
    } else if (planName === 'Premium+') {
      toast.success("Successfully upgraded to Premium+ plan!");
    }
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20 px-4 py-1.5 inline-flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5" />
            ScriptFlow Subscriptions
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Level up your{" "}
            <span className="gradient-text">Roblox game</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-8">
            Subscribe to get instant access to our ever-growing library of premium Roblox scripts. Cancel anytime.
          </p>

          {/* Billing toggle */}
          <div className="inline-flex items-center gap-1 bg-secondary p-1 rounded-full">
            <button
              onClick={() => setYearly(false)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${!yearly ? "bg-card shadow text-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              Monthly
            </button>
            <button
              onClick={() => setYearly(true)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${yearly ? "bg-card shadow text-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              Yearly
              <span className="bg-emerald-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">-20%</span>
            </button>
          </div>
        </div>

        {/* Plans grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {PLANS.map(plan => (
            <div
              key={plan.name}
              className={`relative rounded-2xl p-7 flex flex-col transition-transform hover:-translate-y-1 ${
                plan.highlight
                  ? "bg-card border-2 border-primary/50 shadow-lg shadow-primary/10"
                  : "bg-card border border-border"
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${plan.highlight ? "gradient-bg text-white" : "bg-secondary text-foreground border border-border"}`}>
                    {plan.badge}
                  </span>
                </div>
              )}

              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 ${plan.iconBg}`}>
                <plan.icon className={`w-6 h-6 ${plan.iconColor}`} />
              </div>

              <h3 className="text-2xl font-bold mb-1">{plan.name}</h3>
              <p className="text-muted-foreground text-sm mb-5">{plan.description}</p>

              <div className="mb-6">
                <div className="flex items-end gap-1">
                  <span className="text-4xl font-bold">
                    {plan.price === 0 ? 'Free' : `$${yearly ? plan.yearlyPrice : plan.price}`}
                  </span>
                  {plan.price > 0 && <span className="text-muted-foreground text-sm mb-1">/mo</span>}
                </div>
                {yearly && plan.price > 0 && (
                  <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1 font-medium">
                    Billed ${(plan.yearlyPrice * 12).toFixed(0)}/year — save ${((plan.price - plan.yearlyPrice) * 12).toFixed(0)}
                  </p>
                )}
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map(f => (
                  <li key={f} className="flex items-start gap-2.5 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <Button
                onClick={() => handleSubscribe(plan.value)}
                className={`w-full font-semibold ${plan.highlight ? "gradient-bg text-white border-0 hover:opacity-90" : ""}`}
                variant={plan.highlight ? "default" : "outline"}
                size="lg"
              >
                {currentUser?.subscriptionPlan === plan.value ? 'Current Plan' : `Get ${plan.name}`}
              </Button>
            </div>
          ))}
        </div>

        {/* Money back */}
        <div className="flex items-center justify-center gap-6 mb-16 flex-wrap">
          {["30-day money back guarantee", "Cancel anytime", "Instant script access", "Always-updated library"].map(t => (
            <div key={t} className="flex items-center gap-2 text-sm text-muted-foreground">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              {t}
            </div>
          ))}
        </div>

        {/* Workflow CTA */}
        <div className="rounded-2xl gradient-bg p-px">
          <div className="bg-card rounded-2xl p-8 text-center">
            <h3 className="font-bold text-xl mb-2">Looking to buy AI Workflows instead?</h3>
            <p className="text-muted-foreground text-sm mb-5 max-w-md mx-auto">
              ComfyUI AI Workflows are sold individually. Browse the marketplace and purchase exactly what you need — no subscription required.
            </p>
            <Link href="/">
              <Button variant="outline" size="lg">Browse AI Workflows</Button>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}
