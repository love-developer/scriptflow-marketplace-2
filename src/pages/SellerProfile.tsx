import { useParams, Link } from "wouter";
import { useStore } from "@/lib/store";
import { Layout } from "@/components/Layout";
import ItemCard from "@/components/ItemCard";
import { Star, Package, ShoppingBag, Award } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const LEVEL_BADGE_STYLE: Record<string, string> = {
  "New Creator": "bg-secondary text-secondary-foreground border",
  "Rising Builder": "bg-secondary text-secondary-foreground border",
  "Pro Architect": "bg-secondary text-secondary-foreground border",
  "Elite Innovator": "bg-primary text-primary-foreground",
  "Legendary Creator": "bg-primary text-primary-foreground",
};

export default function SellerProfile() {
  const { username } = useParams<{ username: string }>();
  const { users, items } = useStore();

  const seller = users.find(u => u.username.toLowerCase() === username?.toLowerCase());
  const sellerItems = items.filter(i => i.sellerName.toLowerCase() === username?.toLowerCase() && i.status === "Approved");

  if (!seller) {
    return (
      <Layout>
        <div className="max-w-2xl mx-auto px-4 py-24 text-center">
          <h1 className="text-2xl font-bold mb-4">Creator Not Found</h1>
          <p className="text-muted-foreground mb-8">This creator profile does not exist.</p>
          <Link href="/" className="text-sm underline">Back to Marketplace</Link>
        </div>
      </Layout>
    );
  }

  const totalTests = sellerItems.reduce((acc, i) => acc + i.testCount, 0);
  const avgRating = sellerItems.length > 0
    ? (sellerItems.reduce((acc, i) => acc + i.rating, 0) / sellerItems.length).toFixed(1)
    : "N/A";

  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-4 py-12">
        {/* Profile Header */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-12 p-8 bg-card border border-border rounded-2xl">
          <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center text-3xl font-bold flex-shrink-0">
            {seller.username.charAt(0)}
          </div>
          <div className="flex-1 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
              <h1 className="text-2xl font-bold">{seller.username}</h1>
              <Badge className={LEVEL_BADGE_STYLE[seller.level] || "bg-secondary text-secondary-foreground"}>
                <Award className="w-3 h-3 mr-1" />
                {seller.level}
              </Badge>
            </div>
            <p className="text-muted-foreground text-sm mb-4">
              {seller.bio || "Passionate creator sharing premium digital assets on the marketplace."}
            </p>
            <p className="text-xs text-muted-foreground">Member since {new Date(seller.joinDate).toLocaleDateString("en-US", { year: "numeric", month: "long" })}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
          <div className="bg-card border border-border rounded-xl p-4 text-center">
            <ShoppingBag className="w-5 h-5 mx-auto mb-2 text-muted-foreground" />
            <p className="text-2xl font-bold">{seller.sales}</p>
            <p className="text-xs text-muted-foreground mt-1">Total Sales</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-4 text-center">
            <Package className="w-5 h-5 mx-auto mb-2 text-muted-foreground" />
            <p className="text-2xl font-bold">{sellerItems.length}</p>
            <p className="text-xs text-muted-foreground mt-1">Workflows</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-4 text-center">
            <Star className="w-5 h-5 mx-auto mb-2 text-muted-foreground" />
            <p className="text-2xl font-bold">{avgRating}</p>
            <p className="text-xs text-muted-foreground mt-1">Avg Rating</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-4 text-center">
            <svg className="w-5 h-5 mx-auto mb-2 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <p className="text-2xl font-bold">{totalTests.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground mt-1">Total Tests</p>
          </div>
        </div>

        {/* Items Grid */}
        <div>
          <h2 className="text-xl font-bold mb-6">Published Items ({sellerItems.length})</h2>
          {sellerItems.length === 0 ? (
            <div className="text-center py-16 bg-card border border-border rounded-2xl">
              <Package className="w-10 h-10 mx-auto mb-3 text-muted-foreground" />
              <p className="text-muted-foreground">No approved items yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {sellerItems.map(item => (
                <ItemCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
