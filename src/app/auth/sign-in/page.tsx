"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";
import { useState, useContext } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/context/AuthContext";
import { login, resendOtp } from "@/lib/auth";

const SignIn = () => {
  const router = useRouter();
  const { loginUser } = useContext(AuthContext);

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      toast.error("All fields are required");
      return;
    }

    setLoading(true);

    try {
      const res = await login(email, password);
      const payload = res?.data?.data ?? null;
      if (!payload) throw new Error("Invalid server response");

      const { user, token } = payload;

      if (!user || !token) {
        throw new Error("Login failed");
      }

      // Save to AuthContext
      loginUser({ user, token });

      toast.success("Login Successful", {
        description: "Welcome back!",
      });

      router.push("/dashboard");

    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Login failed. Please try again.";

      console.error("LOGIN ERROR:", message);

      // If email isn't verified → resend OTP automatically
      if (message.includes("verify your email")) {
        await resendOtp(email);
        toast.error("Please verify your email. We've sent a new OTP.");
        router.push(`/auth/verification?email=${email}`);
      } else {
        toast.error(message);
      }

    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="lg:flex lg:justify-between bg-[#FEF4EA] min-h-screen w-full">
      <div className="p-4">
        <Link href="/" className="flex items-center gap-1 group">
          <Image
            src="/icons/A.Bio.png"
            alt="A.Bio Logo"
            width={28}
            height={28}
            priority
            className="cursor-pointer select-none transition-transform group-hover:scale-105"
          />
          <span className="font-bold text-xl md:text-2xl text-black tracking-wide">
            bio
          </span>
        </Link>
      </div>

      <div className="p-4 mt-10 max-w-xl mx-auto flex flex-col">
        <div className="flex flex-col items-center lg:mt-2 flex-1">
          <div className="mb-4 text-center">
            <h1 className="text-xl lg:text-2xl font-bold mb-1 bg-[#331400] text-transparent bg-clip-text">
              Welcome Back!
            </h1>
            <p className="text-[#666464] text-xs">
              Let&apos;s get you back to building your smart bio.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-2.5 w-full lg:max-w-fit">
            <div className="space-y-2">
              <Label htmlFor="email" className="font-semibold text-[14px]">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Email"
                className="md:h-8 text-xs placeholder:text-[11px] border border-black"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="font-semibold text-[14px]">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className="md:h-8 pr-7 text-xs placeholder:text-[11px] border border-black"
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

            <div className="text-right">
              <Link
                href="/auth/forgot-password"
                className="text-[12px] text-[#EA2228] font-semibold hover:underline"
              >
                Forgot Password?
              </Link>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full md:h-8 bg-[#FED45C] text-[#331400] text-sm font-semibold"
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>

            <div className="flex items-center gap-2">
              <Separator className="flex-1" />
              <span className="text-gray-500 text-[10px]">or</span>
              <Separator className="flex-1" />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" className="md:h-8 text-[10px] font-medium flex items-center gap-1">
                <Image
                  src="/assets/icons/auth/apple.svg"
                  alt="apple icon"
                  width={14}
                  height={14}
                />
                Apple
              </Button>
              <Button variant="outline" className="md:h-8 text-[10px] font-medium flex items-center gap-1">
                <Image
                  src="/assets/icons/auth/google.svg"
                  alt="google icon"
                  width={14}
                  height={14}
                />
                Google
              </Button>
            </div>

            <div className="text-center">
              <p className="text-[12px] text-gray-600 font-semibold">
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

        <div className="mt-auto pt-2 text-right lg:pr-8">
          <Link
            href="/privacy-policy"
            className="text-[12px] text-gray-500 font-semibold hover:underline"
          >
            Privacy Policy
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
  