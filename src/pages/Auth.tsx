import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useStore } from "@/lib/store";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [, setLocation] = useLocation();
  const { login } = useStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      login(email, password); // Mock password check, anything works for known emails
      toast.success("Logged in successfully");
      setLocation("/");
    } catch (err) {
      toast.error("Invalid credentials. Try admin@marketplace.com, buyer@..., seller@...");
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-muted/30 roblox-pattern">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link href="/" className="font-display font-bold text-3xl text-center block mb-8 tracking-tight">ScriptFlow</Link>
        <h2 className="mt-6 text-center text-2xl font-bold tracking-tight text-foreground">Sign in to your account</h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-[400px]">
        <div className="bg-card py-10 px-4 shadow-xl border border-border sm:rounded-2xl sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Email address</label>
              <Input 
                required type="email" value={email} onChange={e => setEmail(e.target.value)} 
                className="h-12 bg-background"
                placeholder="admin@marketplace.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Password</label>
              <Input 
                required type="password" value={password} onChange={e => setPassword(e.target.value)} 
                className="h-12 bg-background"
                placeholder="••••••••"
              />
            </div>
            <Button type="submit" className="w-full h-12 text-base font-semibold rounded-xl">Sign in</Button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Don't have an account? <Link href="/register" className="font-medium text-primary hover:underline">Sign up</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Register() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [wantsToSell, setWantsToSell] = useState(false);
  const [, setLocation] = useLocation();
  const { register, requestSellerStatus } = useStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Always register as buyer first, seller status will be requested separately
    register(email, password, username, 'buyer');
    
    if (wantsToSell) {
      // Submit seller request
      requestSellerStatus("I would like to become a seller to share my assets with the community.");
      toast.success("Account created! Your seller request has been submitted for admin approval.");
    } else {
      toast.success("Account created successfully");
    }
    
    setLocation('/dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-muted/30 roblox-pattern">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link href="/" className="font-display font-bold text-3xl text-center block mb-8 tracking-tight">ScriptFlow</Link>
        <h2 className="mt-6 text-center text-2xl font-bold tracking-tight text-foreground">Create an account</h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-[400px]">
        <div className="bg-card py-10 px-4 shadow-xl border border-border sm:rounded-2xl sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Username</label>
              <Input required value={username} onChange={e => setUsername(e.target.value)} className="h-12 bg-background" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Email address</label>
              <Input required type="email" value={email} onChange={e => setEmail(e.target.value)} className="h-12 bg-background" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Password</label>
              <Input required type="password" value={password} onChange={e => setPassword(e.target.value)} className="h-12 bg-background" />
            </div>
            
            <div className="bg-muted/30 rounded-lg p-4">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={wantsToSell}
                  onChange={(e) => setWantsToSell(e.target.checked)}
                  className="w-4 h-4 text-primary border-border rounded focus:ring-primary focus:ring-2"
                />
                <div className="flex-1">
                  <span className="text-sm font-medium text-foreground">I also want to sell assets</span>
                  <p className="text-xs text-muted-foreground mt-1">Request seller status (requires admin approval)</p>
                </div>
              </label>
            </div>

            <Button type="submit" className="w-full h-12 text-base font-semibold rounded-xl">Create Account</Button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account? <Link href="/login" className="font-medium text-primary hover:underline">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
