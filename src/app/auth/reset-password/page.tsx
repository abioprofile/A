"use client"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import SecondAuthLayout from "@/app/layouts/auth/SecondAuthLayout"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

const ResetPassword = () => {
    const router = useRouter()

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        //TODO: handle form submission logic
        toast("Password reset", {
            description: `You have successfully reset you password`
        })
        router.push("/auth/sign-in")
    }
    return (
        <SecondAuthLayout
            heading="Reset Password"
            paragraph="Input a new password to have access"
            imageAlt="Reset password image"
            image="/assets/images/auth/password-reset.png"
        >
            <form onSubmit={handleSubmit} className="flex flex-col items-center space-y-3 md:space-y-10 w-full mt-5">
                <Input
                    type='email'
                    name='email'
                    placeholder='New Password'
                />
                <Input
                    type='password'
                    name='password'
                    placeholder='Confirm Password'
                />
                <Button
                    type="submit"
                    variant="default"
                    className='text-md lg:text-xl font-bold'>
                    Reset
                </Button>
            </form>
        </SecondAuthLayout>

    )
}

export default ResetPassword
