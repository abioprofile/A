"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import Image from "next/image";
import Logo from "@/components/shared/Logo";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { loginUser } from "@/lib/auth";

const SignIn = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // form data
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // handle submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("All fields are required");
      return;
    }

    setLoading(true);
    try {
      const res = await loginUser(email, password);

      if (!res?.token) throw new Error("Login failed");

      toast.success("Login Successful", {
        description: "Welcome back!",
      });

      router.push("/dashboard");
    } catch (error: any) {
      toast.error(error.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="lg:flex lg:justify-between bg-[#FEF4EA] min-h-screen w-full">
      {/* Logo Section */}
      <div className="p-4">
        <Logo className="h-auto" />
      </div>

      {/* Main Content */}
      <div className="p-4 mt-10 max-w-xl mx-auto flex flex-col">
        <div className="flex flex-col items-center lg:mt-2 flex-1">
          {/* Header Text */}
          <div className="mb-4 text-center">
            <h1 className="text-xl lg:text-2xl font-bold mb-1 bg-[#331400] text-transparent bg-clip-text">
              Welcome Back!
            </h1>
            <p className="text-[#666464] text-xs">
              Let&apos;s get you back to building your smart bio.
            </p>
          </div>

          {/* Form */}
          <form
            className="space-y-2.5 w-full lg:max-w-fit"
            onSubmit={handleSubmit}
          >
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="font-semibold text-xs">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Email"
                className="h-8 text-xs placeholder:text-[11px] border border-black"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password" className="font-semibold text-xs">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className="h-8 pr-7 text-xs placeholder:text-[11px] border border-black"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            {/* Forgot Password */}
            <div className="text-right">
              <Link
                href="/auth/forgot-password"
                className="text-[11px] text-[#EA2228] font-semibold hover:underline"
              >
                Forgot Password?
              </Link>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-8 bg-[#FED45C] text-[#331400] text-sm font-semibold"
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>

            {/* OR Divider */}
            <div className="flex items-center gap-2">
              <Separator className="flex-1" />
              <span className="text-gray-500 text-[10px]">or</span>
              <Separator className="flex-1" />
            </div>

            {/* Socials */}
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                className="h-8 text-[10px] font-medium flex items-center gap-1"
              >
                <Image
                  src="/assets/icons/auth/apple.svg"
                  alt="apple icon"
                  width={14}
                  height={14}
                  priority
                />
                Apple
              </Button>
              <Button
                variant="outline"
                className="h-8 text-[10px] font-medium flex items-center gap-1"
              >
                <Image
                  src="/assets/icons/auth/google.svg"
                  alt="google icon"
                  width={14}
                  height={14}
                  priority
                />
                Google
              </Button>
            </div>

            {/* Redirect to Sign Up */}
            <div className="text-center">
              <p className="text-[11px] text-gray-600 font-semibold">
                Don&apos;t have an account?{" "}
                <Link
                  href="/auth/sign-up"
                  className="bg-[#EA2228] text-transparent bg-clip-text hover:underline"
                >
                  Sign Up
                </Link>
              </p>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="mt-auto pt-2 text-right lg:pr-8">
          <Link
            href="/privacy-policy"
            className="text-[11px] text-gray-500 font-semibold hover:underline"
          >
            Privacy Policy
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignIn;




