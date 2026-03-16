import { useState, useEffect } from "react";
import { useRoute } from "wouter";
import { Layout } from "@/components/Layout";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Wand2 } from "lucide-react";
import NotFound from "./not-found";

export default function TestInterface() {
  const [, params] = useRoute("/test/:id");
  const { items } = useStore();
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  
  const item = items.find(i => i.id === params?.id);
  
  if (!item || item.type !== 'ai_workflow') return <NotFound />;

  const handleGenerate = () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setProgress(0);
    setResultImage(null);

    // Simulate generation progress
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          setIsGenerating(false);
          // Fake generation result using random unsplash based on seed
          setResultImage(`https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800&q=80&seed=${Date.now()}`);
          return 100;
        }
        return p + Math.floor(Math.random() * 15) + 5;
      });
    }, 500);
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold mb-2">Test Run: {item.title}</h1>
          <p className="text-muted-foreground">Experiment with this workflow before purchasing. Outputs are watermarked.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-card border border-border p-6 rounded-2xl">
              <h3 className="font-bold mb-4">Input Parameters</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Prompt</label>
                  <textarea 
                    className="w-full p-3 rounded-xl bg-background border border-border focus:ring-2 focus:ring-primary outline-none resize-none h-32 text-sm"
                    placeholder="Describe what you want to generate..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Seed (Optional)</label>
                  <Input placeholder="Random" className="bg-background" />
                </div>

                <Button 
                  className="w-full h-12 text-base mt-6" 
                  onClick={handleGenerate}
                  disabled={isGenerating || !prompt.trim()}
                >
                  {isGenerating ? (
                    <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Generating...</>
                  ) : (
                    <><Wand2 className="w-5 h-5 mr-2" /> Run Workflow</>
                  )}
                </Button>
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-2">
            <div className="bg-card border border-border rounded-2xl p-2 h-[600px] flex items-center justify-center relative overflow-hidden">
              {isGenerating ? (
                <div className="w-full max-w-md mx-auto text-center">
                  <Loader2 className="w-12 h-12 animate-spin mx-auto text-primary mb-6" />
                  <p className="font-medium mb-4">Processing via ComfyUI backend...</p>
                  <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-primary transition-all duration-300 ease-out" style={{ width: `${progress}%` }} />
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">{progress}%</p>
                </div>
              ) : resultImage ? (
                <div className="relative w-full h-full rounded-xl overflow-hidden group">
                  <img src={resultImage} alt="Generated output" className="w-full h-full object-contain" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-white font-bold bg-black/50 px-4 py-2 rounded-lg backdrop-blur">Preview Watermark</span>
                  </div>
                </div>
              ) : (
                <div className="text-center text-muted-foreground">
                  <Wand2 className="w-12 h-12 mx-auto mb-4 opacity-20" />
                  <p>Enter a prompt and run the workflow to see results here.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
