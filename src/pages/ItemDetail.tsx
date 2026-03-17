import { useRoute, useLocation } from "wouter";
import { Layout } from "@/components/Layout";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Star, ShieldCheck, Download, TestTube, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import NotFound from "./not-found";

export default function ItemDetail() {
  const [, params] = useRoute("/item/:id");
  const [, setLocation] = useLocation();
  const { items, currentUser, buyItem, purchases } = useStore();
  
  const item = items.find(i => i.id === params?.id);
  
  if (!item) return <NotFound />;

  const isWorkflow = item.type === 'ai_workflow';
  const hasPurchased = purchases.some(p => p.itemId === item.id && p.userId === currentUser?.id);

  const handlePurchase = () => {
    if (!currentUser) {
      toast.error("Please login to purchase");
      setLocation('/login');
      return;
    }
    buyItem(item.id);
    toast.success("Purchase successful! Available in your dashboard.");
  };

  const handleTest = () => {
    setLocation(`/test/${item.id}`);
  };

  return (
    <Layout>
      <div className="bg-muted/30 border-b border-border pt-12 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="rounded-3xl overflow-hidden border border-border shadow-2xl bg-card">
              <img src={item.image} alt={item.title} className="w-full h-auto aspect-video object-cover" />
            </div>
            
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 bg-primary text-primary-foreground text-xs font-bold rounded-full uppercase tracking-wider">
                  {item.category}
                </span>
                <div className="flex items-center text-sm font-medium text-yellow-500">
                  <Star className="w-4 h-4 fill-current mr-1" />
                  {item.rating.toFixed(1)} ({item.testCount} reviews)
                </div>
              </div>
              
              <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-6">{item.title}</h1>
              
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                {item.description}
              </p>
              
              <div className="flex items-center gap-4 mb-10 pb-8 border-b border-border">
                <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center font-bold text-lg">
                  {item.sellerName.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold">{item.sellerName}</p>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-primary" /> {item.sellerLevel}
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-8 border-b border-border">
                <div className="font-display text-3xl sm:text-4xl font-bold">
                  ${item.price.toFixed(2)}
                </div>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  {isWorkflow && (
                    <Button variant="outline" size="lg" className="h-14 px-6 text-base rounded-xl w-full sm:w-auto" onClick={handleTest}>
                      <TestTube className="w-5 h-5 mr-2" /> Test Drive
                    </Button>
                  )}
                  {hasPurchased ? (
                    <Button variant="secondary" size="lg" className="h-14 px-8 text-base rounded-xl cursor-default w-full sm:w-auto">
                      <CheckCircle2 className="w-5 h-5 mr-2 text-primary" /> Owned
                    </Button>
                  ) : (
                    <Button size="lg" className="h-14 px-8 text-base rounded-xl w-full sm:w-auto" onClick={handlePurchase}>
                      <Download className="w-5 h-5 mr-2" /> Buy Now
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <h2 className="font-display text-2xl font-bold mb-8">Features & Specs</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-card border border-border p-8 rounded-2xl">
            <h3 className="font-bold text-lg mb-4">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {item.tags.map(tag => (
                <span key={tag} className="bg-secondary px-3 py-1.5 rounded-lg text-sm font-medium">#{tag}</span>
              ))}
            </div>
          </div>
          <div className="bg-card border border-border p-8 rounded-2xl">
            <h3 className="font-bold text-lg mb-4">Verification</h3>
            <ul className="space-y-3">
              <li className="flex items-center text-sm text-muted-foreground"><CheckCircle2 className="w-5 h-5 mr-3 text-green-500" /> Scanned for malware</li>
              <li className="flex items-center text-sm text-muted-foreground"><CheckCircle2 className="w-5 h-5 mr-3 text-green-500" /> Verified by Admin team</li>
              <li className="flex items-center text-sm text-muted-foreground"><CheckCircle2 className="w-5 h-5 mr-3 text-green-500" /> Tested on latest versions</li>
            </ul>
          </div>
        </div>
      </div>
    </Layout>
  );
}
