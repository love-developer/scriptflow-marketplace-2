import { useState } from "react";
import { Layout } from "@/components/Layout";
import { useStore } from "@/lib/store";
import ItemCard from "@/components/ItemCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";
import {
  Search, Sparkles, Gamepad2, ArrowRight, Zap, ShieldCheck, Users, Star
} from "lucide-react";

export default function Home() {
  const { items } = useStore();
  const [filter, setFilter] = useState<"all" | "ai_workflow">("all");
  const [search, setSearch] = useState("");
  const [, setLocation] = useLocation();

  const approvedItems = items.filter(i => i.status === "Approved" && i.type === "ai_workflow");

  const filteredItems = approvedItems.filter(item => {
    if (search && !item.title.toLowerCase().includes(search.toLowerCase()) && !item.category.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const handleSearch = () => {
    if (search.trim()) {
      setLocation(`/search?q=${encodeURIComponent(search.trim())}`);
    }
  };

  const features = [
    { icon: Zap, label: "Instant Download", desc: "Get your workflow immediately after purchase" },
    { icon: ShieldCheck, label: "Verified Quality", desc: "Every workflow tested and approved by our team" },
    { icon: Users, label: "Creator Community", desc: "Hundreds of professional ComfyUI creators" },
    { icon: Star, label: "Top Rated", desc: "Curated marketplace with honest reviews" },
  ];

  return (
    <Layout>
      {/* Hero */}
      <section className="relative overflow-hidden pt-20 pb-24 md:pt-28 md:pb-32">
        <div className="hero-glow" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary px-3 py-1.5 rounded-full text-xs sm:text-sm font-semibold mb-6">
              <Sparkles className="w-3.5 h-3.5" />
              Premium ComfyUI Workflows & Roblox Scripts
            </div>

            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 leading-[1.1]">
              The marketplace for{" "}
              <span className="gradient-text">pro-grade</span>
              <br className="hidden sm:block" />
              digital assets
            </h1>

            <p className="text-lg sm:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
              Discover, test, and buy top-tier <strong>ComfyUI AI Workflows</strong> or subscribe to exclusive{" "}
              <strong>Roblox scripts</strong> that take your game to the next level.
            </p>

            {/* Search bar */}
            <div className="max-w-2xl mx-auto bg-card border border-border rounded-2xl shadow-xl shadow-black/5 p-1.5 mb-8">
              <div className="flex items-center gap-2">
                <Input
                  className="flex-1 border-0 shadow-none focus-visible:ring-0 text-base bg-transparent h-11 px-2"
                  placeholder="Search workflows by name or model..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  onKeyPress={e => e.key === 'Enter' && handleSearch()}
                />
                <Button size="sm" className="gradient-bg text-white border-0 hover:opacity-90 rounded-xl h-9 px-4 flex-shrink-0" onClick={handleSearch}>
                  Search
                </Button>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="#marketplace">
                <Button size="lg" className="gradient-bg text-white border-0 hover:opacity-90 shadow-lg shadow-primary/20 gap-2">
                  <Sparkles className="w-4 h-4" />
                  Browse AI Workflows
                </Button>
              </Link>
              <Link href="/pricing">
                <Button size="lg" variant="outline" className="gap-2">
                  <Gamepad2 className="w-4 h-4" />
                  Roblox Script Plans
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-y border-border bg-card/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { value: "500+", label: "AI Workflows" },
              { value: "12K+", label: "Happy Buyers" },
              { value: "250+", label: "Creators" },
              { value: "4.9★", label: "Avg Rating" },
            ].map(s => (
              <div key={s.label}>
                <p className="text-2xl sm:text-3xl font-bold gradient-text">{s.value}</p>
                <p className="text-sm text-muted-foreground mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Roblox Script subscription banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="gradient-bg rounded-3xl p-px">
          <div className="bg-card rounded-3xl p-6 sm:p-10 flex flex-col sm:flex-row items-center gap-6">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center flex-shrink-0">
              <Gamepad2 className="w-8 h-8 text-primary" />
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-2xl font-bold mb-1">Roblox Script Subscriptions</h2>
              <p className="text-muted-foreground">
                Get unlimited access to our premium Roblox script library. ESP, speed, auto-farm, and 50+ more. Starting at just <strong>$4.99/month</strong>.
              </p>
            </div>
            <Link href="/pricing">
              <Button size="lg" className="gradient-bg text-white border-0 hover:opacity-90 flex-shrink-0 gap-2">
                See Plans <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Marketplace grid */}
      <section id="marketplace" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-primary" />
              AI Workflows
            </h2>
            <p className="text-muted-foreground text-sm mt-1">{approvedItems.length} workflows available for purchase</p>
          </div>
          {search && (
            <Button variant="ghost" size="sm" onClick={() => setSearch("")} className="text-muted-foreground">
              Clear search
            </Button>
          )}
        </div>

        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredItems.map(item => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="py-24 text-center border-2 border-dashed border-border rounded-2xl">
            <Sparkles className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground font-medium">No workflows found</p>
            {search && (
              <Button variant="link" className="mt-2" onClick={() => setSearch("")}>Clear search</Button>
            )}
          </div>
        )}
      </section>

      {/* Become a Seller CTA */}
      <section className="bg-gradient-to-r from-primary/10 to-primary/5 border-y border-border py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-primary/20 border border-primary/30 text-primary px-3 py-1.5 rounded-full text-xs sm:text-sm font-semibold mb-6">
              <Sparkles className="w-3.5 h-3.5" />
              Join Our Creator Community
            </div>
            
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
              Become a 
              <span className="gradient-text"> Workflow Seller</span>
            </h2>
            
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Share your ComfyUI workflows with thousands of users and earn 70% commission on every sale. 
              Join our community of professional AI workflow creators today!
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-card/60 backdrop-blur border border-border rounded-xl p-6">
                <div className="w-12 h-12 bg-emerald-500/20 rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <Zap className="w-6 h-6 text-emerald-500" />
                </div>
                <h3 className="font-bold text-lg mb-2">70% Commission</h3>
                <p className="text-sm text-muted-foreground">
                  Keep the majority of your earnings with our competitive commission structure
                </p>
              </div>
              
              <div className="bg-card/60 backdrop-blur border border-border rounded-xl p-6">
                <div className="w-12 h-12 bg-blue-500/20 rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-500" />
                </div>
                <h3 className="font-bold text-lg mb-2">12K+ Buyers</h3>
                <p className="text-sm text-muted-foreground">
                  Access our growing community of active workflow purchasers
                </p>
              </div>
              
              <div className="bg-card/60 backdrop-blur border border-border rounded-xl p-6">
                <div className="w-12 h-12 bg-violet-500/20 rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6 text-violet-500" />
                </div>
                <h3 className="font-bold text-lg mb-2">Easy Upload</h3>
                <p className="text-sm text-muted-foreground">
                  Simple upload process with instant approval for quality workflows
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/become-seller">
                <Button size="lg" className="gradient-bg text-white border-0 hover:opacity-90 shadow-lg shadow-primary/20 gap-2">
                  <Sparkles className="w-5 h-5" />
                  Apply to Become a Seller
                </Button>
              </Link>
              
              <Button size="lg" variant="outline" className="gap-2">
                <Gamepad2 className="w-5 h-5" />
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features section */}
      <section className="border-t border-border bg-secondary/30 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-10">Why Workflux?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map(f => (
              <div key={f.label} className="bg-card border border-border rounded-2xl p-5 text-center">
                <div className="w-11 h-11 gradient-bg rounded-xl mx-auto mb-4 flex items-center justify-center shadow shadow-primary/20">
                  <f.icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-bold mb-1">{f.label}</h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
