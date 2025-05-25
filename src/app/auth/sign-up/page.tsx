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
        //TODO: handle form submission logic
        toast("Account created", {
            description: `You have successfully created your account, please input OTP sent to your email`,
        })
        router.push("/auth/verification?prev=register")
    }
    return (

        <div className="lg:flex lg:justify-between h-screen w-full">
            <div className="lg:w-1/2 p-5 max-w-xl mx-auto">
                <div className="flex flex-col items-center lg:mt-10">
                    <div className="mb-8">
                        <h1 className="text-3xl lg:text-4xl font-bold mb-2 bg-gradient-to-r from-[#7140EB] to-[#FB8E8E] text-transparent bg-clip-text">
                            Signup to A.Bio
                        </h1>

                        <p className="text-[#666464]">Create your smart digital identity in minutes.</p>
                    </div>
                    <form className="space-y-4 w-full lg:max-w-fit">
                        <div className="space-y-2">
                            <Label htmlFor="name" className="font-semibold">Name</Label>
                            <Input id="name" type="name" placeholder="Enter your name" className="h-12" />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email" className="font-semibold">Email Address</Label>
                            <Input id="email" type="email" placeholder="Enter your email address" className="h-12" />
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <Label htmlFor="password" className="font-semibold">Password</Label>
                            </div>
                            <div className="relative">
                                <Input id="password" type={showPassword ? "text" : "password"} className="h-12 pr-10" placeholder="Enter your password" />
                                <button
                                    type="button"
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <Label htmlFor="confirm_password" className="font-semibold">Confirm Password</Label>
                            </div>
                            <div className="relative">
                                <Input id="confirm_password" type={showPassword ? "text" : "password"} className="h-12 pr-10" placeholder="Re-enter your password" />
                                <button
                                    type="button"
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-12"
                            onClick={handleSubmit}>
                            Create Account
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
                                Already a user?{" "}
                                <Link href="/auth/sign-in" className="bg-gradient-to-r from-[#7140EB] to-[#FB8E8E] text-transparent bg-clip-text hover:underline">
                                    Sign In
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
                    src={"/assets/images/auth/sign-up.svg"}
                    alt={"Sign up Image"}
                    fill
                    priority
                    className="object-cover rounded-[2rem] p-2"
                />

                <div className="absolute inset-0 flex flex-col justify-center space-y-2 p-20 text-white mb-20">
                    <Logo className='block mb-8' />
                    <h1 className="font-bold text-3xl">Hi, Welcome!</h1>
                    <p className="max-w-md">
                        A.bio is a smart link-in-bio platform that helps creators, entrepreneurs, and businesses showcase all their important links, content, and brand identity in one customizable page.
                    </p>
                </div>
            </div>
        </div>
    )
}

export default SignUp
