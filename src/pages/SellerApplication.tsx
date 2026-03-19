import { useState } from "react";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link, useLocation } from "wouter";
import { ArrowLeft, User, Globe, Link2, MessageSquare, CheckCircle } from "lucide-react";
import { toast } from "sonner";

export default function SellerApplication() {
  const { currentUser, requestSellerStatus } = useStore();
  const [agreed, setAgreed] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [, setLocation] = useLocation();
  
  const [formData, setFormData] = useState({
    name: '',
    platform: '',
    profileLink: '',
    message: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!agreed) {
      toast.error("Please agree to the Terms & Conditions");
      return;
    }

    if (!formData.name || !formData.platform || !formData.profileLink || !formData.message) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsSubmitting(true);
    
    try {
      await requestSellerStatus(formData);
      toast.success("Application submitted successfully! We'll review it within 24-48 hours.");
      // Redirect to dashboard after successful submission
      setLocation('/dashboard');
    } catch (error) {
      toast.error("Failed to submit application. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Sign In Required</CardTitle>
            <CardDescription>
              Please sign in to apply for seller status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/login">
              <Button className="w-full">Sign In</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <h1 className="text-3xl font-bold mb-2">Become a Workflow Seller</h1>
          <p className="text-muted-foreground text-lg">
            Share your AI workflows with thousands of users and earn commission
          </p>
        </div>

        {!showForm ? (
          /* Terms & Conditions */
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-500" />
                Seller Terms & Conditions
              </CardTitle>
              <CardDescription>
                Please read and agree to the following terms to proceed with your application
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="prose prose-sm max-w-none dark:prose-invert">
                <h3 className="text-lg font-semibold mb-3">1. Quality Standards</h3>
                <ul className="list-disc pl-6 space-y-2 text-sm">
                  <li>All workflows must be tested and functional before submission</li>
                  <li>Provide clear documentation and usage instructions</li>
                  <li>Workflows should be optimized for performance and reliability</li>
                  <li>Include example inputs and expected outputs</li>
                </ul>

                <h3 className="text-lg font-semibold mb-3 mt-6">2. Content Guidelines</h3>
                <ul className="list-disc pl-6 space-y-2 text-sm">
                  <li>No illegal, harmful, or unethical content</li>
                  <li>Respect copyright and intellectual property rights</li>
                  <li>No misleading claims or false advertising</li>
                  <li>Appropriate pricing based on complexity and value</li>
                </ul>

                <h3 className="text-lg font-semibold mb-3 mt-6">3. Commission & Payments</h3>
                <ul className="list-disc pl-6 space-y-2 text-sm">
                  <li>Sellers receive 70% commission on all sales</li>
                  <li>Payments are processed monthly via available withdrawal methods</li>
                  <li>Minimum withdrawal amount is $50</li>
                  <li>Platform reserves the right to adjust commission rates</li>
                </ul>

                <h3 className="text-lg font-semibold mb-3 mt-6">4. Account Responsibilities</h3>
                <ul className="list-disc pl-6 space-y-2 text-sm">
                  <li>Maintain professional communication with buyers</li>
                  <li>Provide customer support for your workflows</li>
                  <li>Update workflows regularly as needed</li>
                  <li>Respond to reviews and feedback appropriately</li>
                </ul>

                <h3 className="text-lg font-semibold mb-3 mt-6">5. Platform Policies</h3>
                <ul className="list-disc pl-6 space-y-2 text-sm">
                  <li>We reserve the right to remove any workflow without notice</li>
                  <li>Violations may result in account suspension</li>
                  <li>All applications are subject to approval</li>
                  <li>Terms may be updated at any time</li>
                </ul>
              </div>

              <div className="flex items-start space-x-3 pt-4 border-t">
                <Checkbox 
                  id="terms" 
                  checked={agreed}
                  onCheckedChange={(checked) => setAgreed(checked as boolean)}
                />
                <div className="space-y-1">
                  <Label htmlFor="terms" className="text-sm font-medium">
                    I agree to the Seller Terms & Conditions
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    By checking this box, you confirm that you have read, understood, and agree to abide by all the terms and conditions outlined above.
                  </p>
                </div>
              </div>

              <Button 
                onClick={() => setShowForm(true)} 
                disabled={!agreed}
                className="w-full"
                size="lg"
              >
                Continue to Application Form
              </Button>
            </CardContent>
          </Card>
        ) : (
          /* Application Form */
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5 text-blue-500" />
                Seller Application Form
              </CardTitle>
              <CardDescription>
                Tell us about yourself and your experience
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="platform">Primary Platform *</Label>
                  <Select value={formData.platform} onValueChange={(value) => handleInputChange('platform', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your main platform" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Upwork">Upwork</SelectItem>
                      <SelectItem value="Fiverr">Fiverr</SelectItem>
                      <SelectItem value="Freelancer">Freelancer</SelectItem>
                      <SelectItem value="PeoplePerHour">PeoplePerHour</SelectItem>
                      <SelectItem value="Guru">Guru</SelectItem>
                      <SelectItem value="Toptal">Toptal</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="profileLink">Profile Link *</Label>
                  <Input
                    id="profileLink"
                    type="url"
                    placeholder="https://upwork.com/freelancer/profile"
                    value={formData.profileLink}
                    onChange={(e) => handleInputChange('profileLink', e.target.value)}
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Link to your portfolio or freelance profile
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Why do you want to become a seller? *</Label>
                  <Textarea
                    id="message"
                    placeholder="Tell us about your experience with AI workflows, your expertise, and what you hope to achieve..."
                    value={formData.message}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                    rows={5}
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Minimum 50 characters. Help us understand your background and motivation.
                  </p>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setShowForm(false)}
                    disabled={isSubmitting}
                  >
                    Back
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="flex-1"
                  >
                    {isSubmitting ? "Submitting..." : "Submit Application"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
