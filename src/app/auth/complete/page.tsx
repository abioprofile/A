"use client";

import { useRouter } from "next/navigation";
import {
  FaMapMarkerAlt,
  FaInstagram,
  FaTiktok,
  FaPinterest,
  FaTwitter,
  FaCopy,
} from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export default function ProfileLivePage() {
  const router = useRouter();

  return (
       <main className="min-h-screen bg-[#FFF4E8] flex flex-col items-center justify-center px-6 py-10 overflow-hidden relative">
      <div className="flex flex-col lg:flex-row items-center justify-center w-full max-w-6xl gap-16 relative z-10">
        {/*Left Side — Profile Preview  */}
        <div className="relative w-full max-w-sm flex justify-center items-center lg:mr-10">
          {/* Decorative Circle */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 hidden lg:block w-[450px] h-[450px] bg-[#331400] rounded-full" />

          {/* Centered Card */}
          <Card className="relative bg-white overflow-hidden shadow-md z-10 w-3/4">
            <div className="p-6 flex flex-col items-start">
              {/* Profile Info */}
              <div className="flex items-center gap-2 mb-3">
                <Avatar className="w-16 h-16 shadow-md">
                  <AvatarImage
                    src="/avatar-placeholder.png"
                    alt="Profile"
                    className="object-cover"
                  />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>

                <div>
                  <h2 className="font-bold text-[14px] text-[#2C1C0D]">David Oshinowo</h2>
                  <p className="text-[10px] text-[#5C4C3B] mb-1">@davidosh</p>
                </div>
              </div>

              {/* Bio + Location (Aligned to left) */}
              <div className="w-full text-left">
                {/* Bio */}
                <p className="text-[11px] text-[#3A2B20] mb-3">
                  I am a Product Designer & Co-Founder
                </p>

                {/* Location */}
                <div className="inline-flex items-center gap-1 px-3 py-1 border border-[#C8C0B5] text-xs text-[#5C4C3B] mb-6 ">
                  <FaMapMarkerAlt className="w-3 h-3" />
                  <span>Lagos, Nigeria</span>
                </div>
              </div>

              {/* Links Section */}
              <div className="bg-[#F5F5F5] p-4 w-full space-y-4 ">
                {[
                  { icon: <FaInstagram className="w-4 h-4" />, name: "Instagram" },
                  { icon: <FaTiktok className="w-4 h-4" />, name: "TikTok" },
                  { icon: <FaPinterest className="w-4 h-4" />, name: "Pinterest" },
                  { icon: <FaTwitter className="w-4 h-4" />, name: "Twitter" },
                ].map((link, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 bg-white px-3 py-2 font-medium text-sm shadow-sm "
                  >
                    {link.icon}
                    <span>{link.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/*  Right Side — Share Section  */}
        <div className="flex flex-col justify-center items-start text-left max-w-md">
          <h1 className="text-3xl font-bold text-[#331400] mb-3">
            Your profile is now live!
          </h1>
          <p className="text-[#4B2E1E] mb-6">
            Get more visitors by sharing your Abio Profile everywhere.
          </p>

          {/* Link Box */}
          <div className="flex items-center w-full border border-[#C8C0B5] overflow-hidden mb-6 ">
            <Input
              readOnly
              value="abio.site/davidosh"
              className="border-0 text-[#4B2E1E] font-medium focus-visible:ring-0"
            />
            <button
              className="p-3 bg-transparent hover:bg-[#FFF1D0] transition-colors"
              onClick={() => navigator.clipboard.writeText("abio.site/davidosh")}
            >
              <FaCopy className="w-4 h-4 text-[#4B2E1E]" />
            </button>
          </div>

          {/* Buttons side by side */}
          <div className="flex w-full gap-4">
            <Button
              onClick={() => router.push("/dashboard")}
              className="flex-1 bg-[#FED45C] hover:bg-[#f5ca4f] text-[#4B2E1E] font-semibold py-5"
            >
              Continue Editing
            </Button>
            <Button
              className="flex-1 bg-[#331400] hover:bg-[#4B2E1E] text-[#FFE4A5] font-semibold py-5"
            >
              Share your Profile
            </Button>
          </div>
        </div>
      </div>
    </main>

  );
}

