"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useState } from "react"
import Logo from "@/components/shared/Logo"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff } from "lucide-react"
import { Separator } from "@/components/ui/separator"

const SignUp = () => {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    toast("Account created", {
      description: `You have successfully created your account, please input OTP sent to your email`,
    })
    router.push("/auth/verification?prev=register")
  }

  return (
    <div className="lg:flex lg:justify-between bg-[#FEF4EA]  min-h-screen w-full">
          {/* Top logo */}
      <div className="p-4">
        <Logo className="h-auto" />
        
      </div>
      {/* Left Section */}
      <div className=" p-4 mt-10 max-w-xl mx-auto flex flex-col">
       
        {/* Form Section */}
        <div className="flex flex-col items-center lg:mt-2 flex-1">
          <div className="mb-4 text-center">
            <h1 className="text-xl lg:text-2xl font-bold mb-1 bg-[#331400] text-transparent bg-clip-text">
              Signup to A.Bio
            </h1>
            <p className="text-[#666464] text-xs">
              Create your smart digital identity in minutes.
            </p>
          </div>

          <form className="space-y-2.5 w-full lg:max-w-fit">
            <div className="space-y-2">
              <Label htmlFor="name" className="font-semibold mb-2 text-xs">
                Name
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="Name"
                className="h-8 text-xs placeholder:text-[1px] border border-black"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="email" className="font-semibold mb-2 text-xs">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Email"
                className="h-8 text-xs placeholder:text-[11px] border border-black"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="password" className="font-semibold text-xs">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  className="h-8 pr-7 text-xs placeholder:text-[11px] border border-black"
                  placeholder="Password"
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

            <div className="space-y-1">
              <Label htmlFor="confirm_password" className="font-semibold text-xs">
                Confirm Password
              </Label>
              <div className="relative">
                <Input
                  id="confirm_password"
                  type={showPassword ? "text" : "password"}
                  className="h-8 pr-7 text-[11px] placeholder:text-[11px] border border-black"
                  placeholder="Confirm"
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

            <Button
              type="submit"
              className="w-full h-8 bg-[#FED45C] text-[#331400] text-sm font-semibold"
              onClick={handleSubmit}
            >
              Create Account
            </Button>

            <div className="flex items-center gap-2">
              <Separator className="flex-1" />
              <span className="text-gray-500 text-[10px]">or</span>
              <Separator className="flex-1" />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                className="h-8 text-[10px] font-medium flex items-center gap-1"
              >
                <Image
                  src={"/assets/icons/auth/apple.svg"}
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
                  src={"/assets/icons/auth/google.svg"}
                  alt="google icon"
                  width={14}
                  height={14}
                  priority
                />
                Google
              </Button>
            </div>

            <div className="text-center">
              <p className="text-[11px] text-gray-600 font-semibold">
                Already a user?{" "}
                <Link
                  href="/auth/sign-in"
                  className="bg-[#EA2228] text-transparent bg-clip-text hover:underline"
                >
                  Sign In
                </Link>
              </p>
            </div>
          </form>
        </div>

        {/* Privacy Policy */}
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
  )
}

export default SignUp


