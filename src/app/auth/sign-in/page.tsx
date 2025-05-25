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
        <div className="lg:flex lg:justify-between h-screen w-full">
            <div className="lg:w-1/2 p-5 max-w-xl mx-auto">
                <Logo className='block mb-8 lg:pl-8' />
                <div className="flex flex-col items-center lg:mt-20">
                    <div className="mb-8">
                        <h1 className="text-3xl lg:text-4xl font-bold mb-2 bg-gradient-to-r from-[#7140EB] to-[#FB8E8E] text-transparent bg-clip-text">
                            Welcome Back!
                        </h1>

                        <p className="text-[#666464]">Let&apos;s get you back to building your smart bio.</p>
                    </div>
                    <form className="space-y-6 w-full lg:max-w-fit">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="font-semibold">Email Address</Label>
                            <Input id="email" type="email" placeholder="Enter your email address" className="h-12" />
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <Label htmlFor="password" className="font-semibold">Password</Label>
                            </div>
                            <div className="relative ">
                                <Input id="password" type={showPassword ? "text" : "password"} className="h-12 pr-10" />
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
                            <Link href="/auth/forgot-password" className="font-semibold text-sm bg-gradient-to-r from-[#7140EB] to-[#FB8E8E] text-transparent bg-clip-text hover:underline">
                                Forgot Password?
                            </Link>
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-12"
                            onClick={handleSubmit}>
                            Login
                        </Button>

                        <div className="flex items-center gap-4">
                            <Separator className="flex-1" />
                            <span className="text-gray-500 text-sm">or</span>
                            <Separator className="flex-1" />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <Button variant="outline" className='font-medium flex items-center gap-2'>
                                <Image
                                    src={'/assets/icons/auth/apple.svg'}
                                    alt='apple icon'
                                    width={20}
                                    height={20}
                                    priority
                                />
                                Apple
                            </Button>
                            <Button variant="outline" className='font-medium flex items-center gap-2'>
                                <Image
                                    src={'/assets/icons/auth/google.svg'}
                                    alt='google icon'
                                    width={20}
                                    height={20}
                                    priority
                                />
                                Google
                            </Button>
                        </div>

                        <div className="text-center">
                            <p className="text-sm text-gray-600 font-semibold">
                                Dont have and account?{" "}
                                <Link href="/auth/sign-up" className="bg-gradient-to-r from-[#7140EB] to-[#FB8E8E] text-transparent bg-clip-text hover:underline">
                                    Sign Up
                                </Link>
                            </p>
                        </div>
                    </form>
                </div>
                <div className="mt-auto pt-4 text-right lg:pr-8">
                    <Link href="/privacy-policy" className="text-sm text-gray-500 font-semibold hover:underline">
                        Privacy Policy
                    </Link>
                </div>
            </div>

            <div className="relative hidden lg:w-1/2 lg:flex">
                <Image
                    src={"/assets/images/auth/sign-in.svg"}
                    alt={"Login Image"}
                    fill
                    priority
                    className="object-cover rounded-[2rem] p-2"
                />
            </div>
        </div>
    )
}

export default SignIn
