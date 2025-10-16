"use client"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Label } from "@/components/ui/label"
import { useState } from "react"

const ResetPassword = () => {
    const router = useRouter()
    const [newPassword, setNewPassword] = useState("")
    const [confirmNewPassword, setConfirmNewPassword] = useState("")

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        //TODO: handle form submission logic
        toast("Password reset", {
            description: `You have successfully reset you password`
        })
        router.push("/auth/sign-in")
    }
    return (
        <div className="h-screen w-full bg-[#FEF4EA] flex justify-center items-center p-5">
            <div className="max-w-lg mx-auto">
                <div className="mb-8 text-left">
                    <h1 className="text-xl lg:text-2xl font-bold mb-2 whitespace-nowrap text-[#331400] bg-clip-text">
                        Reset Password
                    </h1>

                    <p className="text-[#666464] text-[15px]">
                        Please enter a new password to complete the reset
                        process and secure your account.
                    </p>
                </div>
                <form className="space-y-4">
                    <div className="space-y-2.5">
                        <Label htmlFor="new_password" className="font-semibold">New Password</Label>
                        <Input id="new_password" type="text" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Enter new password" className="h-12 w-full!" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="confirm_new_password" className="font-semibold">Confirm New Password</Label>
                        <Input id="confirm_new_password" type="text" value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} placeholder="Re-enter your password" className="h-12 w-full!" />
                    </div>

                    <Button
                        type="submit"
                        className="w-full bg-[#FED45C] text-black font-semibold h-10"
                        onClick={handleSubmit}>
                        Confirm email
                    </Button>
                </form>
            </div>
        </div>
    )
}

export default ResetPassword
