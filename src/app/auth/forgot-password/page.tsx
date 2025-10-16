"use client"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Label } from "@/components/ui/label"
import { useState } from "react"

const ForgotPassword = () => {
    const router = useRouter()
    const [email, setEmail] = useState("")
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        //TODO: handle form submission logic
        toast("OTP sent to you email", {
            description: `Check your email`,
        })
        router.push(`/auth/verification?prev=forgot-password&email=${email}`)
    }
    return (
        <div className="h-screen w-full flex bg-[#FEF4EA] justify-center items-center p-5">
            <div className="max-w-lg mx-auto">
                <div className="mb-8 text-left">
                    <h1 className="text-xl lg:text-3xl font-bold mb-2 whitespace-nowrap text-[#331400] bg-clip-text">
                        Forgot Password?
                    </h1>

                    <p className="text-[#666464] text-[15px]">
                        Looks like your  password  slipped your mind. Let’s 
                        get you sorted. Enter your Registered email below.
                    </p>
                </div>
                <form className="space-y-4">
                    <div className="space-y-2.5">
                        <Label htmlFor="email" className="font-semibold">Email Address</Label>
                        <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email address" className="h-12 w-full!" />
                    </div>

                    <Button
                        type="submit"
                        className="w-full bg-[#FED45C] text-black font-semibold h-12"
                        onClick={handleSubmit}>
                        Confirm email
                    </Button>
                </form>
            </div>
        </div>
    )
}

export default ForgotPassword
