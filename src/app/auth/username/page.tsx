"use client"

import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const SignIn = () => {
    const router = useRouter()
    const [username, setUsername] = useState("")
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        //TODO: handle form submission logic
        toast("Username set", {
            description: `You have successfully set your username`,
        })
        router.push("/auth/goal");
    }
    return (
        <div className="my-auto mx-auto flex-col bg-[#FEF4EA] items-center flex justify-center min-h-screen w-full">
            <div className="lg:w-1/2 p-5 max-w-xl mx-auto flex items-center justify-center">
                <div className="flex flex-col items-center">
                    <div className="mb-4 text-center">
                        <h1 className="text-3xl lg:text-3xl text-[#331400] font-bold mb-1  bg-clip-text">
                            Claim your free Username
                        </h1>

                        <p className="text-[#666464]">Choose a unique username that represents you.</p>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-4 w-full lg:max-w-fit">
                        <div className="space-y-2">
                            <div className="relative">
                                <Input
                                    id="username"
                                    type="text"
                                    value={username}
                                    placeholder="Enter unique username"
                                    className="pl-[77px] pr-[8.5rem] lg:pr-[9rem] font-medium text-sm! h-10 placeholder:font-medium placeholder:text-sm placeholder:text-gray-500"
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 font-semibold text-sm">abio.site/</span>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full bg-[#FED45C] font-semibold text-black h-10"
                        >
                            Create Username
                        </Button>
                    </form>
                </div>
            </div>

            <div className="relative hidden lg:w-1/2 lg:flex">
                <Image
                    src={"/assets/images/auth/username.svg"}
                    alt={"Username Splash Image"}
                    fill
                    priority
                    className="object-cover rounded-[2rem] p-2"
                />
            </div>
        </div>
    )
}

export default SignIn
