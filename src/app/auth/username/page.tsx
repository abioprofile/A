"use client"

import AuthLayout from "../../layouts/auth/AuthLayout"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { useState } from "react"
import { useRouter } from "next/navigation"

const SignIn = () => {
    const router = useRouter()
    const [username, setUsername] = useState("")
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        //TODO: handle form submission logic
        toast("Username set", {
            description: `You have successfully set your username`,
        })
        // Redirect
        router.push("/auth/sign-in");
    }
    return (
        <AuthLayout
            heading="Input your Username"
            paragraph="Claim your link in bio"
            imageAlt="Username image"
            image="/assets/images/auth/username-page.png"
        >
            <form onSubmit={handleSubmit} className="flex flex-col items-center space-y-5 w-full">
                <div className="flex items-center border border-[#7140EB] shadow-md bg-[#D9D9D9] rounded-full px-6 w-full max-w-[454px]">
                    <span className="text-[#767676] text-sm lg:text-[20px] select-none">
                        A.bio/
                    </span>
                    <input
                        type="text"
                        name="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder=""
                        className="border-none h-10 lg:h-[59px] shadow-none focus:ring-0 focus:outline-none px-1 bg-transparent flex-1 text-sm lg:text-[20px]"
                    />
                </div>

                <Button
                    variant="default"
                    className='text-md lg:text-xl font-bold'
                >
                    Continue
                </Button>
            </form>
        </AuthLayout>

    )
}

export default SignIn
