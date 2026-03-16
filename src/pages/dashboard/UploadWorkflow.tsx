import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Upload, X, ImagePlus, FileJson, Package, Layers, ChevronRight } from "lucide-react";
import { useLocation } from "wouter";

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

const STEPS = ["Choose Type", "Basic Info", "Files & Media", "Review & Submit"];

interface WorkflowEntry {
  title: string;
  description: string;
  model: string;
  file: string | null;
}

export default function UploadWorkflow() {
  const { uploadItem } = useStore();
  const [, setLocation] = useLocation();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0);
  const [uploadType, setUploadType] = useState<"single" | "bundle" | null>(null);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [workflowFileName, setWorkflowFileName] = useState<string | null>(null);
  const [exampleInputs, setExampleInputs] = useState("");
  const [bundleWorkflows, setBundleWorkflows] = useState<WorkflowEntry[]>([
    { title: "", description: "", model: "", file: null },
    { title: "", description: "", model: "", file: null },
    { title: "", description: "", model: "", file: null },
  ]);

  const [form, setForm] = useState({
    title: "",
    description: "",
    model: "",
    price: "",
    tags: "",
  });

  const handleChange = (key: string, value: string) =>
    setForm(prev => ({ ...prev, [key]: value }));

  const handleBundleChange = (idx: number, key: keyof WorkflowEntry, value: string) => {
    setBundleWorkflows(prev => prev.map((w, i) => i === idx ? { ...w, [key]: value } : w));
  };

  const addBundleWorkflow = () => {
    if (bundleWorkflows.length < 5) {
      setBundleWorkflows(prev => [...prev, { title: "", description: "", model: "", file: null }]);
    }
  };

  const removeBundleWorkflow = (idx: number) => {
    if (bundleWorkflows.length > 3) {
      setBundleWorkflows(prev => prev.filter((_, i) => i !== idx));
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setPreviewImages(prev => [...prev, ev.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });
    e.target.value = "";
  };

  const handleWorkflowFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setWorkflowFileName(file.name);
      toast.success(`"${file.name}" selected (simulated)`);
    }
    e.target.value = "";
  };

  const handleBundleFile = (idx: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleBundleChange(idx, "file", file.name);
      toast.success(`Workflow ${idx + 1}: "${file.name}" selected`);
    }
    e.target.value = "";
  };

  const removeImage = (idx: number) =>
    setPreviewImages(prev => prev.filter((_, i) => i !== idx));

  const canProceed = () => {
    if (step === 0) return uploadType !== null;
    if (step === 1) {
      if (uploadType === "single") return form.title && form.description && form.model && form.price;
      return form.title && form.description && form.price;
    }
    return true;
  };

  const handleSubmit = () => {
    if (!form.title || !form.price) {
      toast.error("Please fill in all required fields.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      uploadItem({
        title: uploadType === "bundle" ? `[BUNDLE] ${form.title}` : form.title,
        description: form.description,
        category: uploadType === "bundle"
          ? bundleWorkflows.map(w => w.model).filter(Boolean).join(", ") || "Bundle"
          : form.model,
        price: parseFloat(form.price),
        tags: form.tags.split(",").map(t => t.trim()).filter(Boolean),
        type: "ai_workflow",
        status: "Pending",
        image: previewImages[0] || `https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&q=80`,
      });
      toast.success("Submitted for review! Our admin team will approve it shortly.");
      setLoading(false);
      setLocation("/seller-dashboard");
    }, 900);
  };

  return (
    <DashboardLayout role="seller">
      <div className="max-w-2xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold">Upload Workflow</h1>
          <p className="text-muted-foreground mt-1">Submit for review — it goes live after admin approval.</p>
        </div>

        {/* Stepper */}
        <div className="flex items-center gap-1 mb-8 overflow-x-auto pb-1">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-1 flex-shrink-0">
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                i === step
                  ? "gradient-bg text-white"
                  : i < step
                  ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                  : "bg-secondary text-muted-foreground"
              }`}>
                <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  i === step ? "bg-white/20" : i < step ? "bg-emerald-500/20" : "bg-muted-foreground/20"
                }`}>
                  {i < step ? "✓" : i + 1}
                </span>
                {s}
              </div>
              {i < STEPS.length - 1 && <ChevronRight className="w-3 h-3 text-muted-foreground flex-shrink-0" />}
            </div>
          ))}
        </div>

        {/* Step 0 — Choose Type */}
        {step === 0 && (
          <div className="space-y-4">
            <h2 className="font-bold text-lg mb-2">What are you uploading?</h2>
            <div
              onClick={() => setUploadType("single")}
              className={`border-2 rounded-2xl p-6 cursor-pointer transition-all ${
                uploadType === "single"
                  ? "border-primary/50 bg-primary/5"
                  : "border-border hover:border-primary/20 bg-card"
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${uploadType === "single" ? "gradient-bg" : "bg-secondary"}`}>
                  <FileJson className={`w-6 h-6 ${uploadType === "single" ? "text-white" : "text-muted-foreground"}`} />
                </div>
                <div>
                  <p className="font-bold text-base mb-1">Single Workflow</p>
                  <p className="text-sm text-muted-foreground">Upload one ComfyUI workflow file. Best for standalone, focused workflows like a portrait enhancer or upscaler.</p>
                </div>
                {uploadType === "single" && (
                  <div className="ml-auto w-5 h-5 rounded-full gradient-bg flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-[10px]">✓</span>
                  </div>
                )}
              </div>
            </div>

            <div
              onClick={() => setUploadType("bundle")}
              className={`border-2 rounded-2xl p-6 cursor-pointer transition-all ${
                uploadType === "bundle"
                  ? "border-primary/50 bg-primary/5"
                  : "border-border hover:border-primary/20 bg-card"
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${uploadType === "bundle" ? "gradient-bg" : "bg-secondary"}`}>
                  <Layers className={`w-6 h-6 ${uploadType === "bundle" ? "text-white" : "text-muted-foreground"}`} />
                </div>
                <div>
                  <p className="font-bold text-base mb-1">Workflow Bundle</p>
                  <p className="text-sm text-muted-foreground">Upload 3–5 related workflows together. Great for model-specific packs (e.g. "FLUX.1 Starter Pack" with txt2img, img2img, and upscale workflows).</p>
                </div>
                {uploadType === "bundle" && (
                  <div className="ml-auto w-5 h-5 rounded-full gradient-bg flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-[10px]">✓</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Step 1 — Basic Info */}
        {step === 1 && (
          <div className="space-y-5">
            <div className="bg-card border border-border rounded-2xl p-6 space-y-5">
              <h2 className="font-bold text-lg">
                {uploadType === "bundle" ? "Bundle Details" : "Workflow Details"}
              </h2>

              <div className="space-y-2">
                <Label htmlFor="wf-title">
                  {uploadType === "bundle" ? "Bundle Name" : "Workflow Title"} <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="wf-title"
                  placeholder={uploadType === "bundle" ? "e.g. FLUX.1 Complete Starter Pack" : "e.g. Portrait Enhancer Pro"}
                  value={form.title}
                  onChange={e => handleChange("title", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="wf-description">
                  Description <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="wf-description"
                  placeholder={
                    uploadType === "bundle"
                      ? "Describe the bundle — what's included, what each workflow does, what use cases they cover..."
                      : "Describe what your workflow does, what models/nodes it uses, expected results..."
                  }
                  rows={4}
                  value={form.description}
                  onChange={e => handleChange("description", e.target.value)}
                />
              </div>

              {uploadType === "single" && (
                <div className="space-y-2">
                  <Label htmlFor="wf-model">AI Model / Category <span className="text-destructive">*</span></Label>
                  <Select value={form.model} onValueChange={v => handleChange("model", v)}>
                    <SelectTrigger id="wf-model">
                      <SelectValue placeholder="Select the model this workflow uses" />
                    </SelectTrigger>
                    <SelectContent>
                      {AI_MODELS.map(m => (
                        <SelectItem key={m} value={m}>{m}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="wf-price">Price (USD) <span className="text-destructive">*</span></Label>
                  <Input
                    id="wf-price"
                    type="number"
                    min="0.99"
                    step="0.01"
                    placeholder={uploadType === "bundle" ? "49.99" : "29.99"}
                    value={form.price}
                    onChange={e => handleChange("price", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="wf-tags">Tags</Label>
                  <Input
                    id="wf-tags"
                    placeholder="portrait, flux, comfyui"
                    value={form.tags}
                    onChange={e => handleChange("tags", e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Bundle individual workflow entries */}
            {uploadType === "bundle" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-bold text-lg">Workflows in this Bundle</h2>
                  <span className="text-xs text-muted-foreground">{bundleWorkflows.length}/5 workflows</span>
                </div>
                {bundleWorkflows.map((wf, idx) => (
                  <div key={idx} className="bg-card border border-border rounded-2xl p-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full gradient-bg flex items-center justify-center text-white text-xs font-bold">
                          {idx + 1}
                        </div>
                        <span className="font-semibold text-sm">Workflow {idx + 1}</span>
                      </div>
                      {bundleWorkflows.length > 3 && (
                        <button
                          type="button"
                          onClick={() => removeBundleWorkflow(idx)}
                          className="text-muted-foreground hover:text-destructive transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Workflow Name <span className="text-destructive">*</span></Label>
                        <Input
                          placeholder="e.g. Text to Image"
                          value={wf.title}
                          onChange={e => handleBundleChange(idx, "title", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>AI Model <span className="text-destructive">*</span></Label>
                        <Select value={wf.model} onValueChange={v => handleBundleChange(idx, "model", v)}>
                          <SelectTrigger><SelectValue placeholder="Select model" /></SelectTrigger>
                          <SelectContent>
                            {AI_MODELS.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Textarea
                        placeholder="What does this specific workflow do?"
                        rows={2}
                        value={wf.description}
                        onChange={e => handleBundleChange(idx, "description", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>JSON File</Label>
                      <label
                        htmlFor={`bundle-file-${idx}`}
                        className="flex items-center gap-3 border border-dashed border-border rounded-xl px-4 py-3 cursor-pointer hover:bg-secondary/30 transition-colors"
                      >
                        <FileJson className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">
                          {wf.file ? wf.file : "Click to select .json file"}
                        </span>
                      </label>
                      <input
                        type="file"
                        id={`bundle-file-${idx}`}
                        accept=".json"
                        className="sr-only"
                        onChange={e => handleBundleFile(idx, e)}
                      />
                    </div>
                  </div>
                ))}
                {bundleWorkflows.length < 5 && (
                  <button
                    type="button"
                    onClick={addBundleWorkflow}
                    className="w-full border-2 border-dashed border-border rounded-2xl py-4 text-sm text-muted-foreground hover:border-primary/30 hover:text-primary transition-colors flex items-center justify-center gap-2"
                  >
                    <span className="text-lg font-light">+</span>
                    Add another workflow ({bundleWorkflows.length}/5)
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* Step 2 — Files & Media */}
        {step === 2 && (
          <div className="space-y-5">
            <div className="bg-card border border-border rounded-2xl p-6 space-y-5">
              <h2 className="font-bold text-lg">Files & Preview Images</h2>

              {uploadType === "single" && (
                <div className="space-y-2">
                  <Label>Workflow File (JSON)</Label>
                  <label
                    htmlFor="workflow-json-file"
                    className="flex flex-col items-center justify-center gap-2 border border-dashed border-border rounded-xl p-8 text-center text-muted-foreground hover:bg-secondary/30 transition-colors cursor-pointer"
                  >
                    <FileJson className="w-8 h-8 opacity-50" />
                    {workflowFileName ? (
                      <span className="text-sm font-medium text-foreground">{workflowFileName}</span>
                    ) : (
                      <span className="text-sm">Click to select JSON workflow file</span>
                    )}
                    <span className="text-xs opacity-60">Simulated — no file is stored server-side</span>
                  </label>
                  <input type="file" id="workflow-json-file" accept=".json" className="sr-only" onChange={handleWorkflowFile} />
                </div>
              )}

              <div className="space-y-2">
                <Label>Preview Images</Label>
                <label
                  htmlFor="workflow-preview-images"
                  className="flex flex-col items-center justify-center gap-2 border border-dashed border-border rounded-xl p-8 text-center text-muted-foreground hover:bg-secondary/30 transition-colors cursor-pointer"
                >
                  <ImagePlus className="w-8 h-8 opacity-50" />
                  <span className="text-sm">Click to select preview images</span>
                  <span className="text-xs opacity-60">PNG, JPG, WEBP · Multiple allowed · Shown on listing</span>
                </label>
                <input type="file" id="workflow-preview-images" accept="image/*" multiple className="sr-only" onChange={handleImageUpload} />

                {previewImages.length > 0 && (
                  <div className="grid grid-cols-3 gap-3 mt-3">
                    {previewImages.map((img, idx) => (
                      <div key={idx} className="relative aspect-video rounded-xl overflow-hidden bg-secondary">
                        <img src={img} alt={`preview-${idx}`} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removeImage(idx)}
                          className="absolute top-1.5 right-1.5 bg-black/60 text-white rounded-full p-0.5 hover:bg-black/80 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="wf-example-inputs">Example Inputs / Prompts</Label>
                <Textarea
                  id="wf-example-inputs"
                  placeholder="Describe example prompts or inputs that work great with this workflow..."
                  rows={3}
                  value={exampleInputs}
                  onChange={e => setExampleInputs(e.target.value)}
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 3 — Review */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
              <h2 className="font-bold text-lg">Review Your Submission</h2>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground mb-0.5">Type</p>
                  <p className="font-semibold capitalize">{uploadType} workflow</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-0.5">Price</p>
                  <p className="font-semibold">${parseFloat(form.price || "0").toFixed(2)}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-muted-foreground mb-0.5">Title</p>
                  <p className="font-semibold">{form.title || "—"}</p>
                </div>
                {uploadType === "single" && (
                  <div className="col-span-2">
                    <p className="text-muted-foreground mb-0.5">Model</p>
                    <p className="font-semibold">{form.model || "—"}</p>
                  </div>
                )}
                {uploadType === "bundle" && (
                  <div className="col-span-2">
                    <p className="text-muted-foreground mb-0.5">Workflows in bundle</p>
                    <p className="font-semibold">{bundleWorkflows.length} workflows</p>
                  </div>
                )}
                <div className="col-span-2">
                  <p className="text-muted-foreground mb-0.5">Preview Images</p>
                  <p className="font-semibold">{previewImages.length} image{previewImages.length !== 1 ? "s" : ""} uploaded</p>
                </div>
              </div>
              <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl p-4 text-sm">
                <p className="font-semibold text-amber-700 dark:text-amber-400 mb-1">⏳ Pending Review</p>
                <p className="text-amber-600 dark:text-amber-500">After submitting, an admin will review your workflow. It typically goes live within 24–48 hours.</p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex gap-3 mt-8">
          {step > 0 && (
            <Button type="button" variant="outline" onClick={() => setStep(s => s - 1)} className="flex-1 sm:flex-none sm:px-8">
              Back
            </Button>
          )}

          {step < STEPS.length - 1 ? (
            <Button
              type="button"
              onClick={() => setStep(s => s + 1)}
              disabled={!canProceed()}
              className="flex-1 gradient-bg text-white border-0 hover:opacity-90"
            >
              Continue
            </Button>
          ) : (
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1 gradient-bg text-white border-0 hover:opacity-90"
            >
              {loading ? "Submitting..." : "Submit for Review"}
            </Button>
          )}

          {step === 0 && (
            <Button type="button" variant="outline" onClick={() => setLocation("/seller-dashboard")}>
              Cancel
            </Button>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
