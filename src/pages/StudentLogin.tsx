import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { GraduationCap, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const StudentLogin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [studentId, setStudentId] = useState("");
  const [password, setPassword] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Demo login - in real app, this would authenticate against a backend
    if (studentId && password) {
      toast({
        title: "Login Successful",
        description: "Welcome back to the student portal!",
      });
      navigate("/student-dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-hero-gradient flex items-center justify-center p-4">
      {/* Back button */}
      <Link
        to="/"
        className="absolute top-4 left-4 flex items-center gap-2 text-primary-foreground/70 hover:text-primary-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Home
      </Link>

      <Card className="w-full max-w-md border-border/50 shadow-lg animate-fade-in">
        <CardHeader className="text-center pb-2">
          <div className="flex justify-center mb-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary">
              <GraduationCap className="h-9 w-9 text-primary-foreground" />
            </div>
          </div>
          <CardTitle className="font-heading text-2xl">Student Portal</CardTitle>
          <p className="text-muted-foreground text-sm mt-2">
            Sign in to access your academic information
          </p>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Student ID
              </label>
              <Input
                placeholder="Enter your student ID"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Password
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded border-border" />
                <span className="text-muted-foreground">Remember me</span>
              </label>
              <a href="#" className="text-primary hover:underline">
                Forgot password?
              </a>
            </div>
            <Button type="submit" variant="gold" className="w-full" size="lg">
              Sign In
            </Button>
          </form>
          <p className="text-center text-sm text-muted-foreground mt-6">
            Having trouble logging in?{" "}
            <Link to="/contact" className="text-primary hover:underline">
              Contact support
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentLogin;
