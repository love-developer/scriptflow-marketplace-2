import { useState } from "react";
import { useStore } from "@/lib/store";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  Upload, FileText, Gamepad2, Sparkles, AlertCircle, CheckCircle, 
  Package, DollarSign, Hash, Link2
} from "lucide-react";
import { toast } from "sonner";

export default function AdminUpload() {
  const { uploadItem } = useStore();
  const [uploadType, setUploadType] = useState<'workflow' | 'script'>('workflow');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    tags: '',
    workflowType: '',
    fileUrl: ''
  });

  const [file, setFile] = useState<File | null>(null);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      // In a real app, you would upload the file to a storage service
      // For now, we'll simulate the file URL
      const fileUrl = `/uploads/${uploadType === 'script' ? 'scripts' : 'workflows'}/${selectedFile.name}`;
      setFormData(prev => ({ ...prev, fileUrl }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.price || !formData.category) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (uploadType === 'workflow' && !formData.workflowType) {
      toast.error("Please select a workflow type");
      return;
    }

    if (!file) {
      toast.error("Please select a file to upload");
      return;
    }

    setIsSubmitting(true);
    
    try {
      const itemData = {
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price),
        category: formData.category,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        type: uploadType === 'script' ? 'roblox_script' : 'ai_workflow',
        ...(uploadType === 'workflow' && { workflowType: formData.workflowType as any }),
        image: `https://images.unsplash.com/photo-${Date.now()}?w=800&q=80`, // Placeholder image
        fileUrl: formData.fileUrl
      };

      await uploadItem(itemData);
      toast.success(`${uploadType === 'script' ? 'Script' : 'Workflow'} uploaded successfully!`);
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        price: '',
        category: '',
        tags: '',
        workflowType: '',
        fileUrl: ''
      });
      setFile(null);
      
    } catch (error) {
      toast.error(`Failed to upload ${uploadType}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const workflowCategories = [
    'Photography', 'Stylization', 'E-commerce', 'Art', 'Upscaling', 
    'Design', 'Video', '3D', 'Marketing', 'Writing'
  ];

  const scriptCategories = [
    'Farming', 'Visuals', 'Movement', 'Combat', 'Building', 
    'Simulation', 'Racing', 'Adventure', 'Puzzle', 'Strategy'
  ];

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold">Upload Content</h1>
          <p className="text-muted-foreground">Upload Roblox scripts and AI workflows to the marketplace</p>
        </div>

        {/* Upload Type Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5" />
              Content Type
            </CardTitle>
            <CardDescription>
              Choose whether you're uploading a Roblox script or an AI workflow
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button
                variant={uploadType === 'script' ? 'default' : 'outline'}
                onClick={() => setUploadType('script')}
                className="h-20 flex-col gap-2"
              >
                <Gamepad2 className="w-8 h-8" />
                <div className="text-left">
                  <div className="font-semibold">Roblox Script</div>
                  <div className="text-xs opacity-70">Gaming scripts and tools</div>
                </div>
              </Button>
              
              <Button
                variant={uploadType === 'workflow' ? 'default' : 'outline'}
                onClick={() => setUploadType('workflow')}
                className="h-20 flex-col gap-2"
              >
                <Sparkles className="w-8 h-8" />
                <div className="text-left">
                  <div className="font-semibold">AI Workflow</div>
                  <div className="text-xs opacity-70">AI automation workflows</div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Upload Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {uploadType === 'script' ? <Gamepad2 className="w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
              Upload {uploadType === 'script' ? 'Roblox Script' : 'AI Workflow'}
            </CardTitle>
            <CardDescription>
              Fill in the details and upload the {uploadType === 'script' ? 'script file' : 'workflow files'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    placeholder={uploadType === 'script' ? 'Auto Farm Pro' : 'Portrait Enhancer v2.0'}
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price">Price (USD) *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="29.99"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {(uploadType === 'script' ? scriptCategories : workflowCategories).map(category => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {uploadType === 'workflow' && (
                  <div className="space-y-2">
                    <Label htmlFor="workflowType">Workflow Type *</Label>
                    <Select value={formData.workflowType} onValueChange={(value) => handleInputChange('workflowType', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select workflow type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="T2I">Text-to-Image (T2I)</SelectItem>
                        <SelectItem value="I2I">Image-to-Image (I2I)</SelectItem>
                        <SelectItem value="T2V">Text-to-Video (T2V)</SelectItem>
                        <SelectItem value="I2V">Image-to-Video (I2V)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder={uploadType === 'script' 
                    ? 'Describe what this script does and how to use it...'
                    : 'Describe the workflow, its capabilities, and use cases...'
                  }
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={4}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">Tags</Label>
                <Input
                  id="tags"
                  placeholder={uploadType === 'script' 
                    ? 'autofarm, simulator, undetected'
                    : 'portrait, photorealism, comfyui'
                  }
                  value={formData.tags}
                  onChange={(e) => handleInputChange('tags', e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Separate tags with commas (e.g., tag1, tag2, tag3)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="file">
                  {uploadType === 'script' ? 'Script File' : 'Workflow Files'} *
                </Label>
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                  <input
                    id="file"
                    type="file"
                    onChange={handleFileChange}
                    accept={uploadType === 'script' ? '.lua,.txt' : '.json,.zip,.txt'}
                    className="hidden"
                  />
                  <label htmlFor="file" className="cursor-pointer">
                    {file ? (
                      <div className="space-y-2">
                        <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto" />
                        <div>
                          <p className="font-medium">{file.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {(file.size / 1024).toFixed(2)} KB
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Upload className="w-12 h-12 text-muted-foreground mx-auto" />
                        <div>
                          <p className="font-medium">
                            Click to upload {uploadType === 'script' ? 'script file' : 'workflow files'}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {uploadType === 'script' ? 'Lua, TXT files' : 'JSON, ZIP, TXT files'}
                          </p>
                        </div>
                      </div>
                    )}
                  </label>
                </div>
                {formData.fileUrl && (
                  <div className="flex items-center gap-2 text-sm text-emerald-600">
                    <CheckCircle className="w-4 h-4" />
                    File ready for upload
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => {
                  setFormData({
                    title: '',
                    description: '',
                    price: '',
                    category: '',
                    tags: '',
                    workflowType: '',
                    fileUrl: ''
                  });
                  setFile(null);
                }}>
                  Clear Form
                </Button>
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="flex-1 gap-2"
                >
                  <Package className="w-4 h-4" />
                  {isSubmitting ? 'Uploading...' : `Upload ${uploadType === 'script' ? 'Script' : 'Workflow'}`}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Info Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              Upload Guidelines
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {uploadType === 'script' ? (
              <>
                <div className="flex items-start gap-3">
                  <Gamepad2 className="w-5 h-5 text-blue-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Script Requirements</h4>
                    <ul className="text-sm text-muted-foreground mt-1 space-y-1">
                      <li>• Scripts must be in .lua or .txt format</li>
                      <li>• Include clear usage instructions in description</li>
                      <li>• Test scripts thoroughly before uploading</li>
                      <li>• Ensure compatibility with target Roblox games</li>
                    </ul>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-purple-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Workflow Requirements</h4>
                    <ul className="text-sm text-muted-foreground mt-1 space-y-1">
                      <li>• Workflows must be functional and tested</li>
                      <li>• Include proper documentation</li>
                      <li>• Select appropriate workflow type (T2I, I2I, T2V, I2V)</li>
                      <li>• Provide example inputs/outputs in description</li>
                    </ul>
                  </div>
                </div>
              </>
            )}
            
            <div className="flex items-start gap-3">
              <DollarSign className="w-5 h-5 text-emerald-500 mt-0.5" />
              <div>
                <h4 className="font-medium">Pricing Guidelines</h4>
                <ul className="text-sm text-muted-foreground mt-1 space-y-1">
                  <li>• Price based on complexity and value</li>
                  <li>• Consider market rates for similar items</li>
                  <li>• Minimum price: $1.00</li>
                  <li>• Maximum price: $999.99</li>
                </ul>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Hash className="w-5 h-5 text-orange-500 mt-0.5" />
              <div>
                <h4 className="font-medium">Tagging Best Practices</h4>
                <ul className="text-sm text-muted-foreground mt-1 space-y-1">
                  <li>• Use relevant, searchable tags</li>
                  <li>• Include primary functionality</li>
                  <li>• Add compatibility information</li>
                  <li>• Limit to 5-10 relevant tags</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
