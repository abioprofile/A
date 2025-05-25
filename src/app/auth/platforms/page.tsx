"use client"

import { Button } from "@/components/ui/button"
import { useUserStore } from "@/stores/user.store"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { PLATFORMS } from "@/data"

const Platforms = () => {
    const { selectedPlatforms, togglePlatform } = useUserStore()
    const router = useRouter()

    return (
        <main className="min-h-screen container flex flex-col mx-auto pb-20 pt-10 w-[90%] md:w-full">
            <div className="flex justify-between mb-5">
                <div className="flex items-center cursor-pointer" onClick={() => router.push("/auth/template")}>
                    <Image src={"/assets/icons/back.svg"} alt="back icon" width={20} height={50} />
                    <span className="text-[#7140EB] text-sm font-semibold">Back</span>
                </div>
                <div className="flex items-center cursor-pointer" onClick={() => router.push("/auth/links")}>
                    <span className="text-[#7140EB] text-sm font-semibold">Skip</span>
                    <Image src={"/assets/icons/skip.svg"} alt="skip icon" width={20} height={50} />
                </div>
            </div>
            <div className="mb-16 flex justify-center items-center flex-col">
                <h1 className="text-3xl lg:text-4xl text-center font-bold mb-2 bg-gradient-to-r from-[#7140EB] to-[#FB8E8E] text-transparent bg-clip-text">
                    Which Platforms Are You On?
                </h1>
                <p className="text-[#666464] font-semibold px-10 lg:px-16 text-center">Where can people find you? - Tap to add platforms you use.</p>
            </div>
            <div className="max-w-xl mx-auto flex-grow flex flex-col h-full">
                <div className="flex flex-wrap justify-center gap-4 mb-8">
                    {PLATFORMS.map((platform) => (
                        <button
                            key={platform.id}
                            className={`cursor-pointer bg-[#F7F7F7] hover:bg-gray-100 flex flex-col w-24 items-center justify-center p-4 rounded-lg ${selectedPlatforms.some((p) => p.id === platform.id)
                                && "ring-2 ring-purple-500"} transition-colors`}
                            onClick={() => togglePlatform(platform)}
                        >
                            <Image src={platform.icon} alt={platform.name} width={35} height={35} />
                            <span className="text-sm font-semibold">{platform.name}</span>
                        </button>
                    ))}
                </div>


                <Button
                    onClick={() => router.push("/auth/links")}
                    className="mt-auto w-full py-6 text-lg font-medium"
                >
                    Continue
                </Button>
            </div>
        </main>
    )
}
export default Platforms