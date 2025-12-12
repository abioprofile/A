"use client"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useForgotPassword } from "@/hooks/api/useAuth"
import { ForgotPasswordFormData, forgotPasswordSchema } from "@/lib/validations/auth.schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Loader2 } from "lucide-react"

const ForgotPassword = () => {
    const forgotPasswordMutation = useForgotPassword()
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ForgotPasswordFormData>({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: {
            email: ""
        }
    })
    const onSubmit = async (data: ForgotPasswordFormData) => {
        forgotPasswordMutation.mutate(data)
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
                <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                    <div className="space-y-2.5">
                        <Label htmlFor="email" className="font-semibold">Email Address</Label>
                        <Input id="email" type="email" {...register("email")} placeholder="Enter your email address" className="h-12 w-full!" />
                        {errors.email && (
                            <p className="text-[11px] text-red-500">{errors.email.message}</p>
                        )}
                    </div>

                    <Button
                        type="submit"
                        className="w-full bg-[#FED45C] text-black font-semibold h-12"
                        disabled={isSubmitting}>
                        {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Confirm email"}
                    </Button>
                </form>
            </div>
        </div>
    )
}

export default ForgotPassword
