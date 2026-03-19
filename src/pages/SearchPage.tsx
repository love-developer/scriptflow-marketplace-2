import { useState, useMemo, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { useStore } from "@/lib/store";
import ItemCard from "@/components/ItemCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import { useLocation } from "wouter";
import { 
  Search, Filter, X, SlidersHorizontal
} from "lucide-react";

const AI_MODELS = [
  "SDXL (Stable Diffusion XL)",
  "SD 1.5 (Stable Diffusion 1.5)",
  "FLUX.1 Dev",
  "FLUX.1 Schnell",
  "Pony Diffusion V6",
  "Illustrious XL",
  "SD 3.5 Large",
  "SD 3.5 Medium",
  "Wan 2.1 (Video)",
  "Hunyuan Video",
  "AnimateDiff",
  "CogVideoX",
  "ControlNet Workflows",
  "IP-Adapter",
  "Upscaling / Enhancement",
  "Face Restoration",
  "Inpainting",
  "Other / Multi-model",
];

const FIVE_R_SELLER_TAGS = [
  "Reliable", "Responsive", "Resourceful", "Respectful", "Resilient",
  "Professional", "Quality", "Fast Delivery", "Expert", "Creative",
  "Detailed", "Supportive", "Innovative", "Experienced", "Trusted",
  "Premium", "Custom", "Optimized", "Advanced", "Beginner Friendly",
  "Commercial Use", "Personal Use", "Educational", "Tutorial", "Template"
];

const WORKFLOW_TYPES = [
  { value: "T2I", label: "Text to Image" },
  { value: "I2I", label: "Image to Image" },
  { value: "T2V", label: "Text to Video" },
  { value: "I2V", label: "Image to Video" },
];

export default function SearchPage() {
  const { items } = useStore();
  const [location] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedModels, setSelectedModels] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState([0, 200]);
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState("relevance");
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Handle URL query parameters
  useEffect(() => {
    const params = new URLSearchParams(location.split('?')[1] || '');
    const q = params.get('q');
    if (q) {
      setSearchQuery(q);
    }
  }, [location]);

  const approvedItems = items.filter(i => i.status === "Approved" && i.type === "ai_workflow");

  const filteredItems = useMemo(() => {
    let filtered = approvedItems.filter(item => {
      // Search query filter
      if (searchQuery && !item.title.toLowerCase().includes(searchQuery.toLowerCase()) && 
          !item.description.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !item.category.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }

      // Model filter
      if (selectedModels.length > 0 && !selectedModels.includes(item.category)) {
        return false;
      }

      // Tags filter
      if (selectedTags.length > 0) {
        const hasMatchingTag = selectedTags.some(tag => 
          item.tags.some(itemTag => itemTag.toLowerCase().includes(tag.toLowerCase()))
        );
        if (!hasMatchingTag) return false;
      }

      // Workflow type filter
      if (selectedTypes.length > 0 && item.workflowType && !selectedTypes.includes(item.workflowType)) {
        return false;
      }

      // Price filter
      if (item.price < priceRange[0] || item.price > priceRange[1]) {
        return false;
      }

      // Rating filter
      if (item.rating < minRating) {
        return false;
      }

      return true;
    });

    // Sorting
    switch (sortBy) {
      case "price_low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price_high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case "newest":
        filtered.sort((a, b) => (new Date(b.date || "2024-01-01").getTime() - new Date(a.date || "2024-01-01").getTime()));
        break;
      default:
        // Relevance - keep original order
        break;
    }

    return filtered;
  }, [approvedItems, searchQuery, selectedModels, selectedTags, selectedTypes, priceRange, minRating, sortBy]);

  const clearFilters = () => {
    setSelectedModels([]);
    setSelectedTags([]);
    setSelectedTypes([]);
    setPriceRange([0, 200]);
    setMinRating(0);
    setSortBy("relevance");
  };

  const activeFiltersCount = selectedModels.length + selectedTags.length + selectedTypes.length + 
    (priceRange[0] > 0 || priceRange[1] < 200 ? 1 : 0) + (minRating > 0 ? 1 : 0);

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Search Workflows</h1>
          <p className="text-muted-foreground">
            Find the perfect AI workflow for your needs
          </p>
        </div>

        {/* Search Bar */}
        <div className="bg-card border border-border rounded-2xl shadow-lg p-4 mb-6">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                className="pl-10 h-12 text-base"
                placeholder="Search workflows by name, description, or model..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setFiltersOpen(!filtersOpen)}
              className="gap-2 h-12 px-4"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
              {activeFiltersCount > 0 && (
                <Badge variant="secondary" className="ml-1 px-2 py-0 text-xs">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          </div>

          {/* Active Filters */}
          {activeFiltersCount > 0 && (
            <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-border">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Filter className="w-4 h-4" />
                Active filters:
              </div>
              {selectedModels.map(model => (
                <Badge key={model} variant="secondary" className="gap-1">
                  {model}
                  <button onClick={() => setSelectedModels(prev => prev.filter(m => m !== model))}>
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
              {selectedTags.map(tag => (
                <Badge key={tag} variant="secondary" className="gap-1">
                  {tag}
                  <button onClick={() => setSelectedTags(prev => prev.filter(t => t !== tag))}>
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
              {selectedTypes.map(type => (
                <Badge key={type} variant="secondary" className="gap-1">
                  {type}
                  <button onClick={() => setSelectedTypes(prev => prev.filter(t => t !== type))}>
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
              {(priceRange[0] > 0 || priceRange[1] < 200) && (
                <Badge variant="secondary" className="gap-1">
                  ${priceRange[0]} - ${priceRange[1]}
                  <button onClick={() => setPriceRange([0, 200])}>
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              )}
              {minRating > 0 && (
                <Badge variant="secondary" className="gap-1">
                  {minRating}+ Stars
                  <button onClick={() => setMinRating(0)}>
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              )}
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                Clear all
              </Button>
            </div>
          )}
        </div>

        {/* Filters Panel */}
        <Collapsible open={filtersOpen} onOpenChange={setFiltersOpen}>
          <CollapsibleContent>
            <div className="bg-card border border-border rounded-2xl p-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* AI Models */}
                <div>
                  <h3 className="font-semibold mb-3">AI Models</h3>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {AI_MODELS.map(model => (
                      <div key={model} className="flex items-center space-x-2">
                        <Checkbox
                          id={`model-${model}`}
                          checked={selectedModels.includes(model)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedModels(prev => [...prev, model]);
                            } else {
                              setSelectedModels(prev => prev.filter(m => m !== model));
                            }
                          }}
                        />
                        <Label htmlFor={`model-${model}`} className="text-sm">
                          {model}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Seller Tags */}
                <div>
                  <h3 className="font-semibold mb-3">Seller Tags</h3>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {FIVE_R_SELLER_TAGS.map(tag => (
                      <div key={tag} className="flex items-center space-x-2">
                        <Checkbox
                          id={`tag-${tag}`}
                          checked={selectedTags.includes(tag)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedTags(prev => [...prev, tag]);
                            } else {
                              setSelectedTags(prev => prev.filter(t => t !== tag));
                            }
                          }}
                        />
                        <Label htmlFor={`tag-${tag}`} className="text-sm">
                          {tag}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Workflow Types */}
                <div>
                  <h3 className="font-semibold mb-3">Workflow Types</h3>
                  <div className="space-y-2">
                    {WORKFLOW_TYPES.map(type => (
                      <div key={type.value} className="flex items-center space-x-2">
                        <Checkbox
                          id={`type-${type.value}`}
                          checked={selectedTypes.includes(type.value)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedTypes(prev => [...prev, type.value]);
                            } else {
                              setSelectedTypes(prev => prev.filter(t => t !== type.value));
                            }
                          }}
                        />
                        <Label htmlFor={`type-${type.value}`} className="text-sm">
                          {type.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Price and Rating */}
                <div>
                  <h3 className="font-semibold mb-3">Price Range</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>${priceRange[0]}</span>
                        <span>${priceRange[1]}</span>
                      </div>
                      <Slider
                        value={priceRange}
                        onValueChange={setPriceRange}
                        max={200}
                        step={1}
                        className="w-full"
                      />
                    </div>
                    
                    <div>
                      <Label className="text-sm">Minimum Rating</Label>
                      <Select value={minRating.toString()} onValueChange={(value) => setMinRating(parseFloat(value))}>
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">All Ratings</SelectItem>
                          <SelectItem value="3">3+ Stars</SelectItem>
                          <SelectItem value="4">4+ Stars</SelectItem>
                          <SelectItem value="4.5">4.5+ Stars</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Results Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-semibold">
              {filteredItems.length} workflow{filteredItems.length !== 1 ? 's' : ''} found
            </h2>
            {searchQuery && (
              <p className="text-sm text-muted-foreground">
                for "{searchQuery}"
              </p>
            )}
          </div>
          
          <div className="flex items-center gap-3">
            <Label className="text-sm">Sort by:</Label>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="relevance">Relevance</SelectItem>
                <SelectItem value="price_low">Price: Low to High</SelectItem>
                <SelectItem value="price_high">Price: High to Low</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="newest">Newest First</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results Grid */}
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredItems.map(item => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="py-24 text-center border-2 border-dashed border-border rounded-2xl">
            <Search className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No workflows found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search terms or filters
            </p>
            <div className="flex gap-3 justify-center">
              <Button variant="outline" onClick={() => setSearchQuery("")}>
                Clear search
              </Button>
              <Button variant="outline" onClick={clearFilters}>
                Clear filters
              </Button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
