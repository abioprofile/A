"use client"
import { Button } from "@/components/ui/button"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import { REGEXP_ONLY_DIGITS } from "input-otp"
import { toast } from "sonner"
import { Suspense, useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { maskEmail } from "@/lib/helpers/mask-email"
import Link from "next/link"

const OTPVerification = () => {
    return (
        <Suspense>
            <OTPVerificationContent />
        </Suspense>
    )
}

const OTPVerificationContent = () => {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [otp, setOtp] = useState<string>("")
    const [prev, setPrev] = useState("")
    const [email, setEmail] = useState("")

    useEffect(() => {
        const email = searchParams.get("email") || ""
        const prev = searchParams.get("prev") || ""
        setEmail(email)
        setPrev(prev)
    }, [searchParams])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        toast("OTP Verified", {
            description: `Your OTP: ${otp}`,
        })
        router.push(prev === "forgot-password" ? "/auth/reset-password" : "/auth/username")
    }

    const handleResend = () => {
        toast("OTP Resent", {
            description: `A new OTP has been sent to ${maskEmail(email)}`,
        })
    }

    return (
        <div className="h-screen w-full bg-[#FEF4EA] flex justify-center items-center p-5">
            <div className="max-w-lg mx-auto w-full">
                <div className="mb-8 text-left">
                    <h1 className="text-xl capitalize lg:text-3xl font-bold mb-2 whitespace-nowrap text-[#331400] bg-clip-text">
                        Input OTP Code
                    </h1>

                    <p className="text-[#666464] text-[15px]">
                        {`We have sent an OTP code to your email
                        ${maskEmail(email)}. Enter the OTP code below to
                        verify.`}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col items-center w-full mt-4">
                    <div className="w-full flex flex-col items-center space-y-8">
                        {/* Spread OTP boxes */}
                        <InputOTP
                            value={otp}
                            onChange={setOtp}
                            maxLength={6}
                            pattern={REGEXP_ONLY_DIGITS}
                            className="flex justify-between gap-3"
                        >
                            {Array.from({ length: 6 }).map((_, index) => (
                                <InputOTPGroup key={index}>
                                    <InputOTPSlot
                                        index={index}
                                        className="border border-[#334155] rounded-md size-12 text-center text-lg"
                                    />
                                </InputOTPGroup>
                            ))}
                        </InputOTP>


                        {/* Align change email to right */}
                        <div className="flex justify-end w-full">
                            <p className="text-sm text-gray-600 mr-1">
                                Using different email address?
                            </p>
                            <Link
                                href=""
                                className="font-semibold text-sm bg-[#EA2228] text-transparent bg-clip-text hover:underline"
                            >
                                Change
                            </Link>
                        </div>

                        <Button
                            type="submit"
                            className="w-full text-md bg-[#FED45C] text-black lg:text-[16px] font-semibold"
                        >
                            Confirm Code
                        </Button>
                        {/* Resend OTP button */}
                        <Button
                            type="button"
                            variant="outline"
                            className="text-sm font-medium"
                            onClick={handleResend}
                        >
                            Resend OTP
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default OTPVerification

