import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useStore, Role } from "@/lib/store";
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
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-muted/30">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link href="/" className="font-display font-bold text-3xl text-center block mb-8 tracking-tight">Workflux</Link>
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
  const [role, setRole] = useState<Role>('buyer');
  const [, setLocation] = useLocation();
  const { register } = useStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    register(email, password, username, role);
    toast.success("Account created successfully");
    setLocation(role === 'buyer' ? '/dashboard' : '/seller-dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-muted/30">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link href="/" className="font-display font-bold text-3xl text-center block mb-8 tracking-tight">Workflux</Link>
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
            
            <div>
              <label className="block text-sm font-medium text-foreground mb-3">I want to...</label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setRole('buyer')}
                  className={`py-3 px-4 border rounded-xl text-sm font-medium transition-all ${role === 'buyer' ? 'border-primary bg-primary/5 text-primary' : 'border-border text-muted-foreground hover:border-muted-foreground'}`}
                >
                  Buy Assets
                </button>
                <button
                  type="button"
                  onClick={() => setRole('seller')}
                  className={`py-3 px-4 border rounded-xl text-sm font-medium transition-all ${role === 'seller' ? 'border-primary bg-primary/5 text-primary' : 'border-border text-muted-foreground hover:border-muted-foreground'}`}
                >
                  Sell Assets
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full h-12 text-base font-semibold rounded-xl mt-4">Create Account</Button>
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
