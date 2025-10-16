"use client"

import { Button } from "@/components/ui/button"
import { useUserStore } from "@/stores/user.store"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { PLATFORMS } from "@/data"
import { toast } from "sonner"   

const MAX_PLATFORMS = 4

const Platforms = () => {
  const { selectedPlatforms, togglePlatform } = useUserStore()
  const router = useRouter()

  const handlePlatformClick = (platform: any) => {
    const alreadySelected = selectedPlatforms.some((p) => p.id === platform.id)

    if (!alreadySelected && selectedPlatforms.length >= MAX_PLATFORMS) {
      toast.error(`You can only select up to ${MAX_PLATFORMS} platforms.`)
      return
    }

    togglePlatform(platform)
  }

  return (
    <main className="min-h-screen bg-[#FEF4EA] flex flex-col">
      {/* 🔹 Full-width top bar */}
      <div className="flex justify-end items-center px-16 py-8">
        {/* <div
          className="flex items-center gap-1 cursor-pointer"
          onClick={() => router.push("/auth/template")}
        >
          <Image src="/assets/icons/back.svg" alt="back icon" width={20} height={20} />
          <span className="text-[#7140EB] text-sm font-semibold">Back</span>
        </div> */}
        <div
          className="flex items-center gap-1 cursor-pointer"
          onClick={() => router.push("/auth/links")}
        >
          <span className="text-[#7140EB] text-sm font-semibold">Skip</span>
          <Image src="/assets/icons/skip.svg" alt="skip icon" width={20} height={20} />
        </div>
      </div>

      {/* 🔹 Centered main content */}
      <section className="flex flex-col items-center justify-center flex-grow text-center px-4">
        <h1 className="text-3xl lg:text-4xl font-bold mb-2 text-[#331400]">
          Which Platforms Are You On?
        </h1>
        <p className="text-[#331400] font-semibold max-w-xl mb-10">
          Where can people find you? - Tap to add platforms you use.
        </p>

        <div className="flex flex-wrap max-w-xl justify-center gap-4 mb-8">
          {PLATFORMS.map((platform) => (
            <button
              key={platform.id}
              className={`cursor-pointer bg-[#F7F7F7] hover:bg-gray-100 flex flex-col w-24 items-center justify-center p-4  ${
                selectedPlatforms.some((p) => p.id === platform.id) && "ring-2 ring-[#331400]"
              } transition-colors`}
              onClick={() => handlePlatformClick(platform)}
            >
              <Image src={platform.icon} alt={platform.name} width={35} height={35} />
              <span className="text-sm font-semibold">{platform.name}</span>
            </button>
          ))}
        </div>

        <Button
          onClick={() => router.push("/auth/links")}
          className="w-full bg-[#FED45C] text-[#331400] max-w-xs py-6 text-[16px] font-medium"
        >
          Continue
        </Button>
      </section>
    </main>
  )
}

export default Platforms


