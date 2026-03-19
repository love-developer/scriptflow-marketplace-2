import { useState } from "react";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { X, Crown, Shield, Zap, Check } from "lucide-react";
import { SubscriptionPlan } from "@/lib/store";
import { toast } from "sonner";

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPlan: SubscriptionPlan;
}

const plans = [
  {
    name: 'Free',
    price: '$0',
    features: ['Access to 3 scripts', 'Basic support'],
    icon: Zap,
    color: 'text-gray-600 bg-gray-50 border-gray-200',
    value: 'Free' as SubscriptionPlan,
    description: 'Perfect for getting started'
  },
  {
    name: 'Premium',
    price: '$9.99/month',
    features: ['Access to 10 scripts', 'Basic workflows', 'Priority support', 'Ad-free experience'],
    icon: Shield,
    color: 'text-blue-600 bg-blue-50 border-blue-200',
    value: 'Premium' as SubscriptionPlan,
    description: 'Great for regular users'
  },
  {
    name: 'Premium+',
    price: '$19.99/month',
    features: ['Unlimited scripts', 'All workflows', '24/7 support', 'Early access to new features', 'Exclusive content'],
    icon: Crown,
    color: 'text-purple-600 bg-purple-50 border-purple-200',
    value: 'Premium+' as SubscriptionPlan,
    description: 'Ultimate experience for power users'
  }
];

export function SubscriptionModal({ isOpen, onClose, currentPlan }: SubscriptionModalProps) {
  const { upgradeSubscription } = useStore();
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan>(currentPlan);
  const [isUpgrading, setIsUpgrading] = useState(false);

  const handleUpgrade = async () => {
    if (selectedPlan === currentPlan) {
      toast.error("Please select a different plan");
      return;
    }

    setIsUpgrading(true);
    try {
      // Handle all subscription changes directly without payment page
      await new Promise(resolve => setTimeout(resolve, 1000));
      upgradeSubscription(selectedPlan);
      
      if (selectedPlan === 'Free') {
        toast.success(`Successfully downgraded to Free plan!`);
      } else if (selectedPlan === 'Premium') {
        toast.success(`Successfully upgraded to Premium plan!`);
      } else if (selectedPlan === 'Premium+') {
        toast.success(`Successfully upgraded to Premium+ plan!`);
      }
      
      onClose();
    } catch (error) {
      toast.error("Failed to change subscription");
    } finally {
      setIsUpgrading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-border flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Choose Your Plan</h2>
            <p className="text-muted-foreground mt-1">Upgrade to unlock more features and scripts</p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Plans */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan) => {
              const Icon = plan.icon;
              const isCurrentPlan = plan.value === currentPlan;
              const isSelected = plan.value === selectedPlan;

              return (
                <div
                  key={plan.value}
                  className={`relative border-2 rounded-2xl p-6 cursor-pointer transition-all ${
                    isSelected
                      ? 'border-primary bg-primary/5'
                      : isCurrentPlan
                      ? 'border-green-500 bg-green-50/10'
                      : 'border-border hover:border-primary/50'
                  }`}
                  onClick={() => setSelectedPlan(plan.value)}
                >
                  {isCurrentPlan && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-green-500 text-white text-xs px-3 py-1 rounded-full font-medium">
                        Current Plan
                      </span>
                    </div>
                  )}

                  <div className="text-center mb-6">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3 ${plan.color.split(' ')[1]}`}>
                      <Icon className={`w-6 h-6 ${plan.color.split(' ')[0]}`} />
                    </div>
                    <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                    <p className="text-muted-foreground text-sm mb-3">{plan.description}</p>
                    <p className="text-2xl font-bold text-primary">{plan.price}</p>
                  </div>

                  <div className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {isSelected && !isCurrentPlan && (
                    <div className="mt-4 pt-4 border-t border-border">
                      <span className="text-xs text-primary font-medium">Selected for upgrade</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={handleUpgrade}
              disabled={selectedPlan === currentPlan || isUpgrading}
              className="min-w-[120px]"
            >
              {isUpgrading ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Processing...
                </span>
              ) : (
                selectedPlan === 'Free' ? 'Downgrade to Free' : `Upgrade to ${selectedPlan}`
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
