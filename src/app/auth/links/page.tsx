"use client"

import type React from "react"

import { useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { LinkIcon, Upload } from "lucide-react"
import { useUserStore } from "@/stores/user.store"
import Image from "next/image"
import { useRouter } from "next/navigation"

const LinksScreen = () => {
    const { selectedPlatforms, customLinks, updateCustomLink } = useUserStore()
    const fileInputRefs = useRef<(HTMLInputElement | null)[]>([null, null, null])
    const router = useRouter()

    // Use the actual selected platforms from the first screen
    const platforms =
        selectedPlatforms.length > 0
            ? selectedPlatforms
            : [
                { id: "instagram", name: "Instagram", icon: "/icons/instagram.svg" },
                { id: "behance", name: "Behance", icon: "/icons/behance.svg" },
                { id: "x", name: "X", icon: "/icons/x.svg" },
                { id: "snapchat", name: "Snapchat", icon: "/icons/snapchat.svg" },
            ]

    const handleIconClick = (index: number) => {
        if (fileInputRefs.current[index]) {
            fileInputRefs.current[index]?.click()
        }
    }

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const file = event.target.files?.[0]
        if (!file) return

        const reader = new FileReader()
        reader.onload = (e) => {
            const iconUrl = e.target?.result as string
            updateCustomLink(index + 1, customLinks[index].url, iconUrl)
        }
        reader.readAsDataURL(file)
    }

    const handleLinkChange = (value: string, index: number) => {
        updateCustomLink(index + 1, value, customLinks[index].iconUrl)
    }

    return (
        <main className="min-h-screen container flex flex-col mx-auto pb-20 pt-10">
            <div className="flex justify-between mb-5 w-[90%] md:w-full mx-auto">
                <div className="flex items-center cursor-pointer" onClick={() => router.push("/auth/platforms")}>
                    <Image src={"/assets/icons/back.svg"} alt="back icon" width={20} height={50} />
                    <span className="text-[#7140EB] text-sm font-semibold">Back</span>
                </div>
                <div className="flex items-center cursor-pointer" onClick={() => router.push("/auth/profile")}>
                    <span className="text-[#7140EB] text-sm font-semibold">Skip</span>
                    <Image src={"/assets/icons/skip.svg"} alt="skip icon" width={20} height={50} />
                </div>
            </div>
            <div className="mb-16 flex justify-center items-center flex-col">
                <h1 className="text-3xl lg:text-4xl font-bold mb-2 bg-gradient-to-r from-[#7140EB] to-[#FB8E8E] text-transparent bg-clip-text">
                    Add your Links
                </h1>
                <p className="text-[#666464] font-semibold px-16 text-center">Complete  the field below to add your content on you new ABio.</p>
            </div>
            <div className="w-[90%] md:max-w-md mx-auto flex flex-col justify-between flex-grow">
                <div className="space-y-3">
                    <h2 className="text-center font-semibold text-lg">Your Selected Platforms</h2>

                    {platforms.map((platform) => (
                        <div key={platform.id} className="flex items-center gap-2">
                            <Image src={platform.icon} alt={platform.name} width={20} height={20} className="size-8" />
                            <Input
                                placeholder={`Input your ${platform.name} Link`}
                                className="h-10!"
                            />
                        </div>
                    ))}

                    <h2 className="font-semibold text-lg pt-4 text-center">Add your own Links</h2>

                    {customLinks.map((link, index) => (
                        <div key={link.id} className="flex items-center gap-3">
                            <button
                                type="button"
                                onClick={() => handleIconClick(index)}
                                className="w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors relative overflow-hidden group"
                                aria-label="Upload custom icon"
                            >
                                {link.iconUrl ? (
                                    <div className="w-full h-full relative">
                                        <Image
                                            fill
                                            src={link.iconUrl || "/placeholder.svg"}
                                            alt="Custom icon"
                                            className="cursor-pointer w-full h-full object-cover rounded-full"
                                        />
                                        <div className="cursor-pointer absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Upload className="w-4 h-4 text-white" />
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <LinkIcon className="w-5 h-5 text-purple-500 group-hover:opacity-0 transition-opacity absolute" />
                                        <Upload className="cursor-pointer w-5 h-5 text-purple-600 opacity-0 group-hover:opacity-100 transition-opacity absolute" />
                                    </>
                                )}
                                <Input
                                    type="file"
                                    ref={(el) => { fileInputRefs.current[index] = el }}
                                    onChange={(e) => handleFileChange(e, index)}
                                    accept="image/*"
                                    className="sr-only"
                                    aria-hidden="true"
                                />
                            </button>
                            <Input
                                placeholder="Add Links"
                                className="h-10!"
                                value={link.url}
                                onChange={(e) => handleLinkChange(e.target.value, index)}
                            />
                        </div>
                    ))}
                </div>


                <Button
                    onClick={() => router.push("/auth/profile")}
                    className="w-full text-lg font-medium h-10!"
                >
                    Continue
                </Button>
            </div>

        </main>
    )
}
export default LinksScreen
