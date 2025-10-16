"use client"

import { Input } from "@/components/ui/input"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Logo from "@/components/shared/Logo"
import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

const SignIn = () => {
    const [showPassword, setShowPassword] = useState(false)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        //TODO: handle form submission logic
        toast("Login", {
            description: `You have successfully logged into your account`,
        })
    }

    return (
        <div className="lg:flex lg:justify-between bg-[#FEF4EA] min-h-screen w-full relative">
            {/* Fixed logo top-left */}
            <div className="absolute top-5 left-5">
                <Logo className="h-auto" />
            </div>

            {/* Main content */}
            <div className="p-5 max-w-xl mx-auto w-full">
                <div className="flex flex-col items-center lg:mt-20">
                    <div className="mb-8">
                        <h1 className="text-xl lg:text-4xl font-bold mb-2 text-[#331400] bg-clip-text">
                            Welcome Back!
                        </h1>
                        <p className="text-[#666464] text-xs">
                            Let&apos;s get you back to building your smart bio.
                        </p>
                    </div>

                    <form className="space-y-4 w-full lg:max-w-fit">
                        <div className="space-y-2.5">
                            <Label htmlFor="email" className="font-semibold">Email Address</Label>
                            <Input id="email" type="email" placeholder="Enter your email address" className="h-10" />
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <Label htmlFor="password" className="font-semibold">Password</Label>
                            </div>
                            <div className="relative">
                                <Input
                                    id="password"
                                    placeholder="Enter your 8 characters"
                                    type={showPassword ? "text" : "password"}
                                    className="h-10 pr-10"
                                />
                                <button
                                    type="button"
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <Link
                                href="/auth/forgot-password"
                                className="font-semibold text-sm bg-[#EA2228] text-transparent bg-clip-text hover:underline"
                            >
                                Forgot Password?
                            </Link>
                        </div>

                        <Button
                            type="submit"
                            className="w-full bg-[#FED45C] h-10 text-black"
                            onClick={handleSubmit}
                        >
                            Login
                        </Button>

                        <div className="flex items-center gap-4">
                            <Separator className="flex-1" />
                            <span className="text-gray-500 text-sm">or</span>
                            <Separator className="flex-1" />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <Button variant="outline" className="font-medium flex items-center gap-2">
                                <Image
                                    src={"/assets/icons/auth/apple.svg"}
                                    alt="apple icon"
                                    width={20}
                                    height={20}
                                    priority
                                />
                                Apple
                            </Button>
                            <Button variant="outline" className="font-medium flex items-center gap-2">
                                <Image
                                    src={"/assets/icons/auth/google.svg"}
                                    alt="google icon"
                                    width={20}
                                    height={20}
                                    priority
                                />
                                Google
                            </Button>
                        </div>

                        <div className="text-center">
                            <p className="text-sm text-gray-600 font-semibold">
                                Don&apos;t have an account?{" "}
                                <Link
                                    href="/auth/sign-up"
                                    className="text-[#EA2228] bg-clip-text hover:underline"
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
                        className="text-sm text-gray-500 font-semibold hover:underline"
                    >
                        Privacy Policy
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default SignIn

