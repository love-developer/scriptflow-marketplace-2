import { Link } from "wouter";
import { Workflow } from "@/lib/store";
import { Star, Zap, Code, Image as ImageIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function ItemCard({ item }: { item: Workflow }) {
  const isWorkflow = item.type === 'ai_workflow';

  return (
    <Link href={`/item/${item.id}`}>
      <div className="group bg-card rounded-2xl border border-border overflow-hidden card-hover h-full flex flex-col cursor-pointer">
        <div className="aspect-[4/3] w-full overflow-hidden relative bg-muted">
          {/* using unspash directly as requested if image is placeholder */}
          <img 
            src={item.image} 
            alt={item.title} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute top-3 right-3 flex gap-2">
            <Badge variant="secondary" className="bg-background/90 backdrop-blur text-xs border-none font-medium">
              {isWorkflow ? <ImageIcon className="w-3 h-3 mr-1" /> : <Code className="w-3 h-3 mr-1" />}
              {isWorkflow ? 'Workflow' : 'Script'}
            </Badge>
          </div>
        </div>
        
        <div className="p-5 flex-1 flex flex-col">
          <div className="flex justify-between items-start mb-2">
            <p className="text-xs font-semibold text-primary/70 uppercase tracking-wider">{item.category}</p>
            <div className="flex items-center text-sm font-medium">
              <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400 mr-1" />
              {item.rating.toFixed(1)}
            </div>
          </div>
          
          <h3 className="font-display font-bold text-lg leading-tight mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {item.title}
          </h3>
          
          <div className="mt-auto pt-4 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">By {item.sellerName}</span>
              <span className="text-[10px] text-muted-foreground font-medium flex items-center gap-1">
                <Zap className="w-3 h-3 text-primary" /> {item.sellerLevel}
              </span>
            </div>
            <div className="font-display font-bold text-xl">
              ${item.price.toFixed(2)}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
