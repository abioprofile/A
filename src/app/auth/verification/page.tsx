"use client"
import { Button } from "@/components/ui/button"
import SecondAuthLayout from "@/app/layouts/auth/SecondAuthLayout"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import { REGEXP_ONLY_DIGITS } from "input-otp"
import { toast } from "sonner"
import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"

const OTPVerification = () => {
    const router = useRouter()
    const searchParams = useSearchParams();
    const [otp, setOtp] = useState<string>("")
    const [token, setToken] = useState<string>("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        //TODO: handle form submission logic
        toast("OTP Verified", {
            description: `Your OTP: ${otp}`,
        })
        // Redirect based on previous route
        if (token === "forgot-password") {
            router.push("/auth/reset-password")
        } else {
            router.push("/auth/sign-in")
        }
    }

    useEffect(() => {
        setToken(searchParams.get("prev") as string ?? "");
    }, [searchParams]);
    return (
        <SecondAuthLayout
            heading="OTP Verification"
            paragraph="Enter 6 digit OTP sent to your email"
            imageAlt="Verification image"
            image="/assets/images/auth/otp-verification.png"
        >
            <form onSubmit={handleSubmit} className="flex flex-col items-center w-full">
                <div className="w-full flex flex-col items-center space-y-10">
                    <div className="mx-auto w-fit mt-4">
                        <InputOTP
                            value={otp}
                            onChange={setOtp}
                            maxLength={5}
                            className="mx-ato"
                            pattern={REGEXP_ONLY_DIGITS}
                        >
                            <InputOTPGroup>
                                <InputOTPSlot
                                    index={0}
                                    className="border border-[#334155] rounded-[8px]"
                                />
                            </InputOTPGroup>
                            <InputOTPGroup>
                                <InputOTPSlot
                                    index={1}
                                    className="border border-[#334155] rounded-[8px]"
                                />
                            </InputOTPGroup>
                            <InputOTPGroup>
                                <InputOTPSlot
                                    index={2}
                                    className="border border-[#334155] rounded-[8px]"
                                />
                            </InputOTPGroup>
                            <InputOTPGroup>
                                <InputOTPSlot
                                    index={3}
                                    className="border border-[#334155] rounded-[8px]"
                                />
                            </InputOTPGroup>
                            <InputOTPGroup>
                                <InputOTPSlot
                                    index={4}
                                    className="border border-[#334155] rounded-[8px]"
                                />
                            </InputOTPGroup>
                        </InputOTP>
                    </div>
                    <Button type="submit" className="text-md lg:text-xl font-bold">Confirm</Button>
                </div>
            </form>
        </SecondAuthLayout>

    )
}

export default OTPVerification
