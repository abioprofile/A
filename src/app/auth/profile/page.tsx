"use client"

import type React from "react"

import { useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MapPin, ImageIcon } from "lucide-react"
import { useUserStore } from "@/stores/user.store"
import Image from "next/image"
import { Textarea } from "@/components/ui/textarea"
import { useRouter } from "next/navigation"

export default function ProfileScreen() {
    const { bio, location, profileImage, setBio, setLocation, resetStore, setProfileImage } = useUserStore()
    const fileInputRef = useRef<HTMLInputElement>(null)
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    const handleContinue = () => {
        setLoading(true)
        resetStore()
        setTimeout(() => {
            router.push("/auth/complete")
        }, 3000)
    }

    const handleProfileImageClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click()
        }
    }

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (!file) return

        const reader = new FileReader()
        reader.onload = (e) => {
            const imageUrl = e.target?.result as string
            setProfileImage(imageUrl)
        }
        reader.readAsDataURL(file)
    }

    return (
        <main className="min-h-screen container flex flex-col mx-auto pb-20 pt-10">
            {loading && (
                <div className="absolute inset-0 z-50 flex flex-col space-y-5 items-center justify-center bg-white/70 backdrop-blur-sm">
                    <div className="flex items-center gap-3">
                        <Image src="/assets/icons/loading.svg" alt="Loading icon" width={50} height={50} className="size-10 animate-spin" />
                        <h1 className="text-xl font-bold mb-2 bg-gradient-to-r from-[#7140EB] to-[#FB8E8E] text-transparent bg-clip-text">
                            Uploading your Abio
                        </h1>
                    </div>
                    <Image src="/assets/icons/loading-image.svg" alt="Loading icon" priority width={500} height={500} />
                </div>
            )}

            <div className="flex justify-between mb-5 w-[90%] md:w-full mx-auto">
                <div className="flex items-center cursor-pointer" onClick={() => router.push("/auth/links")}>
                    <Image src={"/assets/icons/back.svg"} alt="back icon" width={20} height={50} />
                    <span className="text-[#7140EB] text-sm font-semibold">Back</span>
                </div>
                <div className="flex items-center cursor-pointer" onClick={() => router.push("/auth/complete")}>
                    <span className="text-[#7140EB] text-sm font-semibold">Skip</span>
                    <Image src={"/assets/icons/skip.svg"} alt="skip icon" width={20} height={50} />
                </div>
            </div>

            <div className="mb-14 flex justify-center items-center flex-col">
                <h1 className="text-3xl lg:text-4xl font-bold mb-2 bg-gradient-to-r from-[#7140EB] to-[#FB8E8E] text-transparent bg-clip-text">
                    Add Profile Details
                </h1>
            </div>

            <div className="flex flex-col items-center mb-8">
                <h2 className="font-semibold text-lg mb-4">Select Profile Image</h2>
                <button
                    onClick={handleProfileImageClick}
                    className="size-24 rounded-full bg-[#7E4FF3] flex items-center justify-center mb-4 cursor-pointer hover:bg-[#7d4ff3ed] transition overflow-hidden relative group"
                >
                    {profileImage ? (
                        <>
                            <Image fill src={profileImage || "/placeholder.svg"} alt="Profile" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <ImageIcon className="size-6 text-white" />
                            </div>
                        </>
                    ) : (
                        <ImageIcon className="size-6 text-white" />
                    )}
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/*"
                        className="sr-only"
                        aria-hidden="true"
                    />
                </button>
            </div>

            <div className="flex flex-col justify-between flex-grow mx-auto w-[90%] md:max-w-md">
                <div className="space-y-6 ">
                    <h2 className="font-semibold text-center text-lg">Add Bio and Location</h2>

                    <div>
                        <Textarea
                            placeholder="Bio"
                            className="min-h-[120px ] border-[#7140EB80] focus-visible:ring-[1px] focus-visible:ring-purple-500"
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                        />
                    </div>

                    <div className="flex items-center gap-2 relative">
                        <MapPin className="w-5 h-5 text-gray-400 absolute left-3" />
                        <Input
                            placeholder="Location"
                            className="pl-9"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                        />
                    </div>
                </div>

                <Button
                    onClick={handleContinue}
                    className="w-full text-lg font-medium "
                >
                    Continue
                </Button>
            </div>
        </main>
    )
}
