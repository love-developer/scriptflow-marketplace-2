import React, { useState } from "react";
import { useRoute } from "wouter";
import { Layout } from "@/components/Layout";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Loader2, Wand2, Upload, Image, Video, FileText, Download,
  Play, Pause, Settings, Sparkles, Image as ImageIcon
} from "lucide-react";
import NotFound from "./not-found";

export default function TestInterface() {
  const [, params] = useRoute("/test/:id");
  const { items, addTestHistory, currentUser } = useStore();
  const [prompt, setPrompt] = useState("");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [resultType, setResultType] = useState<'image' | 'video'>('image');
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  
  const item = items.find(i => i.id === params?.id);
  
  if (!item || item.type !== 'ai_workflow') return <NotFound />;

  const workflowType = item.workflowType || 'T2I';

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = () => {
    if (!prompt.trim() && workflowType !== 'I2I' && workflowType !== 'I2V') return;
    if ((workflowType === 'I2I' || workflowType === 'I2V') && !uploadedImage) {
      alert('Please upload an image for this workflow type');
      return;
    }

    setIsGenerating(true);
    setProgress(0);
    setResult(null);
    setIsPaused(false);

    // Simulate generation progress
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          setIsGenerating(false);
          
          // Generate result based on workflow type
          const isVideo = workflowType === 'T2V' || workflowType === 'I2V';
          setResultType(isVideo ? 'video' : 'image');
          
          // Fake generation result
          if (isVideo) {
            setResult('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4');
          } else {
            setResult(`https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800&q=80&seed=${Date.now()}`);
          }

          // Add to test history
          if (currentUser) {
            addTestHistory({
              userId: currentUser.id,
              workflowId: item.id,
              workflowTitle: item.title,
              testDate: new Date().toISOString(),
              result: `${isVideo ? 'Video' : 'Image'} generated successfully`,
              success: true
            });
          }
          
          return 100;
        }
        return p + Math.floor(Math.random() * 15) +5;
      });
    }, 500);
  };

  const handlePause = () => {
    setIsPaused(!isPaused);
  };

  const handleReset = () => {
    setPrompt("");
    setUploadedImage(null);
    setResult(null);
    setProgress(0);
    setIsGenerating(false);
    setIsPaused(false);
  };

  const handleDownload = () => {
    if (result) {
      const link = document.createElement('a');
      link.href = result;
      link.download = `${item.title}_result.${resultType === 'video' ? 'mp4' : 'jpg'}`;
      link.click();
    }
  };

  const renderWorkflowInterface = () => {
    switch (workflowType) {
      case 'T2I':
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Text Input
                </CardTitle>
                <CardDescription>
                  Enter a detailed prompt to generate an image
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="A photorealistic portrait of a woman in a garden with golden hour lighting..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  rows={4}
                  className="resize-none"
                />
              </CardContent>
            </Card>
          </div>
        );

      case 'I2I':
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="w-5 h-5" />
                  Image Upload
                </CardTitle>
                <CardDescription>
                  Upload an image to transform
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <label htmlFor="image-upload" className="cursor-pointer">
                      {uploadedImage ? (
                        <div className="space-y-2">
                          <img 
                            src={uploadedImage} 
                            alt="Uploaded" 
                            className="max-h-40 mx-auto rounded-lg"
                          />
                          <p className="text-sm text-muted-foreground">
                            Click to change image
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <ImageIcon className="w-12 h-12 text-muted-foreground mx-auto" />
                          <p className="font-medium">Click to upload image</p>
                          <p className="text-sm text-muted-foreground">
                            PNG, JPG, GIF up to 10MB
                          </p>
                        </div>
                      )}
                    </label>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Prompt
                </CardTitle>
                <CardDescription>
                  Describe how to transform the uploaded image
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Convert to anime style, add blue hair, make background sunset..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  rows={3}
                  className="resize-none"
                />
              </CardContent>
            </Card>
          </div>
        );

      case 'T2V':
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Text Input
                </CardTitle>
                <CardDescription>
                  Enter a detailed prompt to generate a video
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="A drone shot flying over a futuristic city at sunset, neon lights reflecting on wet streets..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  rows={4}
                  className="resize-none"
                />
              </CardContent>
            </Card>
          </div>
        );

      case 'I2V':
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="w-5 h-5" />
                  Image Upload
                </CardTitle>
                <CardDescription>
                  Upload an image to convert to video
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload-video"
                    />
                    <label htmlFor="image-upload-video" className="cursor-pointer">
                      {uploadedImage ? (
                        <div className="space-y-2">
                          <img 
                            src={uploadedImage} 
                            alt="Uploaded" 
                            className="max-h-40 mx-auto rounded-lg"
                          />
                          <p className="text-sm text-muted-foreground">
                            Click to change image
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <ImageIcon className="w-12 h-12 text-muted-foreground mx-auto" />
                          <p className="font-medium">Click to upload image</p>
                          <p className="text-sm text-muted-foreground">
                            PNG, JPG, GIF up to 10MB
                          </p>
                        </div>
                      )}
                    </label>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

 return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="font-display text-3xl font-bold">Test Run: {item.title}</h1>
            <Badge variant="outline" className="text-violet-600 border-violet-200">
              {workflowType}
            </Badge>
          </div>
          <p className="text-muted-foreground">
            Experiment with this workflow before purchasing. Outputs are watermarked.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            {renderWorkflowInterface()}

            {/* Generate Controls */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Controls
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-3">
                  <Button 
                    onClick={handleGenerate} 
                    disabled={isGenerating || !prompt.trim()}
                    className="flex-1 gap-2"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Wand2 className="w-4 h-4" />
                        Generate
                      </>
                    )}
                  </Button>
                  
                  {isGenerating && (
                    <Button 
                      variant="outline" 
                      onClick={handlePause}
                      className="gap-2"
                    >
                      {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                      {isPaused ? 'Resume' : 'Pause'}
                    </Button>
                  )}
                  
                  <Button 
                    variant="outline" 
                    onClick={handleReset}
                    disabled={isGenerating}
                  >
                    Reset
                  </Button>
                </div>

                {isGenerating && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Generation Progress</span>
                      <span>{progress}%</span>
                    </div>
                    <Progress value={progress} className="w-full" />
                    {isPaused && (
                      <p className="text-sm text-amber-600 text-center">
                        Generation is paused
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Result Section */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {resultType === 'video' ? <Video className="w-5 h-5" /> : <Image className="w-5 h-5" />}
                  Result
                </CardTitle>
                <CardDescription>
                  Generated {resultType === 'video' ? 'video' : 'image'} will appear here
                </CardDescription>
              </CardHeader>
              <CardContent>
                {result ? (
                  <div className="space-y-4">
                    {resultType === 'video' ? (
                      <video 
                        src={result} 
                        controls 
                        className="w-full rounded-lg"
                        poster="https://images.unsplash.com/photo-1579532543299-1a1e5e75b6c4?w=800&q=80"
                      />
                    ) : (
                      <img 
                        src={result} 
                        alt="Generated result" 
                        className="w-full rounded-lg"
                      />
                    )}
                    
                    <div className="flex gap-3">
                      <Button onClick={handleDownload} className="gap-2">
                        <Download className="w-4 h-4" />
                        Download {resultType === 'video' ? 'Video' : 'Image'}
                      </Button>
                      
                      <Button variant="outline" onClick={handleReset}>
                        Test Again
                      </Button>
                    </div>
                    
                    <div className="text-xs text-muted-foreground text-center">
                      ⚠️ This is a watermarked preview. Purchase the full workflow for high-quality outputs.
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Sparkles className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Result Yet</h3>
                    <p className="text-muted-foreground">
                      Enter your prompt and click generate to see the result
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Workflow Info */}
            <Card>
              <CardHeader>
                <CardTitle>Workflow Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Type:</span>
                  <Badge variant="outline">{workflowType}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Category:</span>
                  <span className="text-sm font-medium">{item.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Seller:</span>
                  <span className="text-sm font-medium">{item.sellerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Rating:</span>
                  <span className="text-sm font-medium">⭐ {item.rating} ({item.testCount} tests)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Price:</span>
                  <span className="text-sm font-semibold text-emerald-600">${item.price}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
