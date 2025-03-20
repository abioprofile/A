"use client"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import SecondAuthLayout from "@/app/layouts/auth/SecondAuthLayout"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

const ForgotPassword = () => {
    const router = useRouter()
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        //TODO: handle form submission logic
        toast("OTP sent to you email", {
            description: `Check your email`,
        })
        router.push("/auth/verification?prev=forgot-password")
    }
    return (
        <SecondAuthLayout
            heading="Input Email"
            paragraph="Input your email for password reset"
            imageAlt="Forgot password image"
            image="/assets/images/auth/email-verification.png"
        >
            <form onSubmit={handleSubmit} className="flex flex-col items-center space-y-5 md:space-y-10 w-full mt-5">
                <Input
                    type='email'
                    name='email'
                    placeholder='davidosh2003@gmail.com'
                />
                <Button
                    type="submit"
                    variant="default"
                    className='text-md lg:text-xl font-bold'>
                    Verify
                </Button>
            </form>
        </SecondAuthLayout>

    )
}

export default ForgotPassword
