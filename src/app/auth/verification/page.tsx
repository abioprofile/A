"use client"
import { Button } from "@/components/ui/button"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import { REGEXP_ONLY_DIGITS } from "input-otp"
import { toast } from "sonner"
import { Suspense } from "react"
import { maskEmail } from "@/lib/helpers/mask-email"
import Link from "next/link"
import { useResendOtp, useVerifyOtp } from "@/hooks/api/useAuth"
import { useForm, Controller } from "react-hook-form"
import { VerifyOtpFormData, verifyOtpSchema } from "@/lib/validations/auth.schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useSearchParams } from "next/navigation"

const OTPVerification = () => {
    return (
        <Suspense>
            <OTPVerificationContent />
        </Suspense>
    )
}

const OTPVerificationContent = () => {
    const searchParams = useSearchParams()
    // Properly decode email from URL
    const emailParam = searchParams.get("email")
    // Fix: If + was incorrectly decoded as space in URL, replace spaces with + in local part
    // (emails can have + but not spaces in the local part before @)
    const email = emailParam 
      ? (() => {
          const decoded = decodeURIComponent(emailParam)
          const atIndex = decoded.indexOf('@')
          if (atIndex > 0) {
            // Replace spaces in local part (before @) with + since + is valid but space is not
            return decoded.substring(0, atIndex).replace(/\s/g, '+') + decoded.substring(atIndex)
          }
          return decoded.replace(/\s/g, '+') // Fallback: replace all spaces if no @ found
        })()
      : null
    const verifyOtpMutation = useVerifyOtp()
    const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm<VerifyOtpFormData>({
        resolver: zodResolver(verifyOtpSchema),
        defaultValues: {
            token: ""
        }
    })
    const onSubmit = async (data: VerifyOtpFormData) => {
        verifyOtpMutation.mutate(data)
    }
    const resendOtpMutation = useResendOtp()

    const onResendOtp = () => {
        if (!email) {
            toast.error("Email not found", {
                description: "Please sign up again"
            });
            return;
        }
        resendOtpMutation.mutate({ email: email });
    }
    return (
        <div className="h-screen w-full bg-[#FEF4EA] flex justify-center items-center p-5">
            <div className="max-w-lg mx-auto w-full">
                <div className="mb-8 text-left">
                    <h1 className="text-2xl capitalize lg:text-3xl font-bold mb-2 whitespace-nowrap text-[#331400] bg-clip-text">
                        Input OTP Code
                    </h1>

                    <p className="text-[#666464] text-[13px]">
                        {`We have sent an OTP code to your email
                        ${maskEmail(email || "")}. Enter the OTP code below to
                        verify.`}
                    </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col items-center w-full mt-4">
                    <div className="w-full flex flex-col items-center space-y-8">
                        {/* Spread OTP boxes */}
                        <Controller
                            name="token"
                            control={control}
                            render={({ field }) => (
                                <InputOTP
                                    {...field}
                                    maxLength={6}
                                    pattern={REGEXP_ONLY_DIGITS}
                                    className="flex justify-between gap-3"
                                >
                                    {Array.from({ length: 6 }).map((_, index) => (
                                        <InputOTPGroup key={index}>
                                            <InputOTPSlot
                                                index={index}
                                                className="border border-[#334155] size-8 md:size-15 text-center text-lg"
                                            />
                                        </InputOTPGroup>
                                    ))}
                                </InputOTP>
                            )}
                        />
                        {errors.token && (
                            <p className="text-sm text-red-500">{errors.token.message}</p>
                        )}

                        <div className="flex text-[12px] justify-end w-full">
                            <p className="text-gray-600 mr-1">
                                Using different email address?
                            </p>
                            <Link
                                href=""
                                className="font-semibold bg-[#EA2228] text-transparent bg-clip-text hover:underline"
                            >
                                Change
                            </Link>
                        </div>

                        <Button
                            type="submit"
                            className="w-full text-md bg-[#FED45C] text-black lg:text-[16px] font-semibold"
                            disabled={isSubmitting || verifyOtpMutation.isPending}
                        >
                            {isSubmitting || verifyOtpMutation.isPending ? "Verifying..." : "Confirm Code"}
                        </Button>
                        {/* Resend OTP button */}
                        <Button
                            type="button"
                            variant="outline"
                            className="text-sm font-medium"
                            onClick={onResendOtp}
                            disabled={resendOtpMutation.isPending}
                        >
                            {resendOtpMutation.isPending ? "Resending OTP..." : "Resend OTP"}
                        </Button>
                    </div>
                </form>
                {/* Footer  */}
                <footer className="w-full flex items-center justify-between px-4 md:hidden gap-3 py-4  text-sm text-[#331400] mt-auto">
                    <p>© 2025 Abio</p>

                    <a
                        href="/privacy-policy"
                        className="hover:text-[#000000] transition"
                    >
                        Privacy Policy
                    </a>
                </footer>
            </div>
        </div>
    )
}

export default OTPVerification

