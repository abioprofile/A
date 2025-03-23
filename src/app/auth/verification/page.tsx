"use client"
import { Button } from "@/components/ui/button"
import SecondAuthLayout from "@/app/layouts/auth/SecondAuthLayout"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import { REGEXP_ONLY_DIGITS } from "input-otp"
import { toast } from "sonner"
import { Suspense, useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"


const OTPVerification = () => {
    return (
        <Suspense>
            <OTPVerificationContent />
        </Suspense>
    )
}

const OTPVerificationContent = () => {
    const router = useRouter()
    const searchParams = useSearchParams();
    const [otp, setOtp] = useState<string>("")
    const [token, setToken] = useState("");

    useEffect(() => {
        const prev = searchParams.get("prev") || ""
        setToken(prev);
    }, [searchParams]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        //TODO: handle form submission logic
        toast("OTP Verified", {
            description: `Your OTP: ${otp}`,
        })
        // Redirect based on previous route
        router.push(token === "forgot-password" ? "/auth/reset-password" : "/auth/username");
    }

    return (
        <SecondAuthLayout
            heading="OTP Verification"
            paragraph="Enter 6 digit OTP sent to your email"
            imageAlt="Verification image"
            image="/assets/images/auth/otp-verification.png"
        >
            <form onSubmit={handleSubmit} className="flex flex-col items-center w-full mt-4">
                <div className="w-full flex flex-col space-y-10">
                    <InputOTP
                        value={otp}
                        onChange={setOtp}
                        maxLength={5}
                        pattern={REGEXP_ONLY_DIGITS}
                    >
                        {Array.from({ length: 5 }).map((_, index) => (
                            <InputOTPGroup key={index}>
                                <InputOTPSlot
                                    index={index}
                                    className="border border-[#334155] rounded-[8px] !size-12"
                                />
                            </InputOTPGroup>
                        ))}
                    </InputOTP>
                    <Button type="submit" className="text-md lg:text-xl font-bold">Confirm</Button>
                </div>
            </form>
        </SecondAuthLayout>
    )
}

export default OTPVerification
