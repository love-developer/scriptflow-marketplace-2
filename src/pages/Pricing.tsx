import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { CheckCircle2, Zap, Crown, Gamepad2 } from "lucide-react";
import { useStore } from "@/lib/store";
import { toast } from "sonner";

const PLANS = [
  {
    name: "Starter",
    price: 4.99,
    yearlyPrice: 3.99,
    icon: Gamepad2,
    description: "Perfect for casual Roblox players",
    features: [
      "Access to 5 Roblox scripts",
      "Basic auto-farm scripts",
      "Community support",
      "Monthly script updates",
    ],
    highlight: false,
    badge: null,
    iconBg: "bg-secondary",
    iconColor: "text-muted-foreground",
  },
  {
    name: "Pro",
    price: 12.99,
    yearlyPrice: 9.99,
    icon: Zap,
    description: "For serious Roblox players",
    features: [
      "Access to 20+ Roblox scripts",
      "ESP, speed & farm scripts",
      "Priority Discord support",
      "Weekly script updates",
      "Anti-ban protection updates",
      "Script request (1/month)",
    ],
    highlight: true,
    badge: "Most Popular",
    iconBg: "gradient-bg",
    iconColor: "text-white",
  },
  {
    name: "Elite",
    price: 24.99,
    yearlyPrice: 19.99,
    icon: Crown,
    description: "Everything, unlimited",
    features: [
      "Access to ALL scripts (50+)",
      "Premium exclusive scripts",
      "24/7 VIP Discord support",
      "Daily script updates",
      "Early access to new scripts",
      "Unlimited script requests",
      "Custom script modifications",
    ],
    highlight: false,
    badge: "Best Value",
    iconBg: "bg-secondary",
    iconColor: "text-muted-foreground",
  },
];

export default function Pricing() {
  const { currentUser } = useStore();
  const [yearly, setYearly] = useState(false);

  const handleSubscribe = (planName: string) => {
    if (!currentUser) {
      toast.error("Please log in to subscribe.");
      return;
    }
    toast.success(`Subscribed to ${planName}! (Payment simulation)`);
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20 px-4 py-1.5 inline-flex items-center gap-1.5">
            <Gamepad2 className="w-3.5 h-3.5" />
            Roblox Script Subscriptions
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
                  <span className="text-4xl font-bold">${yearly ? plan.yearlyPrice : plan.price}</span>
                  <span className="text-muted-foreground text-sm mb-1">/mo</span>
                </div>
                {yearly && (
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
                onClick={() => handleSubscribe(plan.name)}
                className={`w-full font-semibold ${plan.highlight ? "gradient-bg text-white border-0 hover:opacity-90" : ""}`}
                variant={plan.highlight ? "default" : "outline"}
                size="lg"
              >
                Get {plan.name}
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
