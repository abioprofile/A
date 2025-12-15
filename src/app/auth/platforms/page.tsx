"use client"

import { Button } from "@/components/ui/button"
import { useUserStore } from "@/stores/user.store"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { PLATFORMS } from "@/data"
import { toast } from "sonner"   
import ProtectedRoute from "@/components/auth/ProtectedRoute"
import { PlatformInterface } from "@/interfaces/platform.interfaces"

const MAX_PLATFORMS = 5

const Platforms = () => {
  const { selectedPlatforms, togglePlatform } = useUserStore()
  const router = useRouter()

  const handlePlatformClick = (platform: PlatformInterface) => {
    const alreadySelected = selectedPlatforms.some((p: PlatformInterface) => p.id === platform.id)

    if (!alreadySelected && selectedPlatforms.length >= MAX_PLATFORMS) {
      toast.error(`You can only select up to ${MAX_PLATFORMS} platforms.`)
      return
    }

    togglePlatform(platform)
  }

  return (
    <ProtectedRoute>
    <main className="min-h-screen bg-[#FEF4EA] flex flex-col">
      {/* 🔹 Full-width top bar */}
      <div className="flex justify-end items-center px-16 py-8">
        
        <div
        className=" bg-[#331400] px-3 py-1 hidden md:flex  items-center gap-1 cursor-pointer hover:bg-[#442000] transition-all"
        onClick={() => router.push("/auth/links")}
        >
        <span className="text-[#FFE4A5] text-sm font-semibold">Skip</span>

        {/* Right Arrow Icon */}
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-[#FFE4A5]"
        >
            <path d="M9 18l6-6-6-6" />
        </svg>
        </div>


      </div>

      {/* 🔹 Centered main content */}
      <section className="flex flex-col items-center justify-center flex-grow text-center px-4">
        <h1 className="text-2xl lg:text-4xl font-bold mb-2 text-[#331400]">
          Which Platforms Are You On?
        </h1>
        <p className="text-[#331400] text-[13px] md:text-[16px] font-semibold max-w-xl mb-10">
          Where can people find you? Tap to add platforms you use.
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
             {/* Footer */}
            <footer className="w-full flex items-center md:hidden justify-between gap-2 py-4  text-sm text-[#331400] mt-8">
              <p>© 2025 Abio</p>
              
              <a
                href="/privacy-policy"
                className=" hover:text-[#000000] transition"
              >
                Privacy Policy
              </a>
            </footer>
      </section>
    </main>
    </ProtectedRoute>
  )
}

export default Platforms


