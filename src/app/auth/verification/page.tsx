"use client"
import { Button } from "@/components/ui/button"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import { REGEXP_ONLY_DIGITS } from "input-otp"
import { toast } from "sonner"
import { Suspense, useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { maskEmail } from "@/lib/helpers/mask-email"


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
    const [prev, setPrev] = useState("");
    const [email, setEmail] = useState("")
    // const email = searchParams.get("email") || "";
    // const prev = searchParams.get("prev") || "";

    useEffect(() => {
        const email = searchParams.get("email") || "";
        const prev = searchParams.get("prev") || "";
        setEmail(email)
        setPrev(prev)
    }, [searchParams]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        //TODO: handle form submission logic
        toast("OTP Verified", {
            description: `Your OTP: ${otp}`,
        })
        // Redirect based on previous route
        router.push(prev === "forgot-password" ? "/auth/reset-password" : "/auth/username");
    }


    return (
        <div className="h-screen w-full flex justify-center items-center p-5">
            <div className="max-w-lg mx-auto">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl lg:text-4xl font-bold mb-2 bg-gradient-to-r from-[#7140EB] to-[#FB8E8E] text-transparent bg-clip-text">
                        Input OTP Code
                    </h1>

                    <p className="text-[#666464] px-10">
                        {`We have sent an OTP code to your email
                        ${maskEmail(email)}. Enter the OTP code below to
                        verify.`}
                    </p>
                </div>
                <form onSubmit={handleSubmit} className="flex flex-col items-center w-full mt-4">
                    <div className="w-full flex flex-col items-center space-y-10">
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
            </div>
        </div>
    )
}

export default OTPVerification
