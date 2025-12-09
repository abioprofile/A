"use client";

import { useRef, useState, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { MapPin, ImageIcon } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useUserStore } from "@/stores/user.store";
import { useAuth } from "@/context/AuthContext";
import { updateUser as updateUserApi } from "@/lib/auth";
import { toast } from "sonner";

export default function ProfileScreen() {
  const { bio, location, profileImage, setBio, setLocation, setProfileImage } = useUserStore();
  const { token, updateUserData } = useAuth();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);

  const handleProfileImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      if (typeof e.target?.result === "string") setProfileImage(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleContinue = async () => {
    if (!token) {
      toast.error("Session expired. Please login again.");
      return;
    }

    setLoading(true);

    try {
      const payload: Record<string, any> = { bio, location };
      if (profileImage) payload.profileImage = profileImage;

      const updatedUser = await updateUserApi(payload, { Authorization: `Bearer ${token}` });

      // Update cache in AuthContext
      updateUserData(updatedUser);

      toast.success("Profile updated successfully!");
      router.push("/auth/complete");
    } catch (err) {
      console.error("Failed to update profile:", err);
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center bg-[#FEF4EA]">
        <div className="flex items-center gap-3 text-[#331400]">
          <div className="w-5 h-5 border-2 border-[#331400]/30 border-t-[#331400] rounded-full animate-spin" />
          <span className="font-bold text-xl">Saving your profile...</span>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FEF4EA] flex flex-col items-center px-4 pt-20 md:pt-6 pb-10">
      {/* Back Button */}
      <div
        onClick={() => router.back()}
        className="hidden md:flex items-center gap-1 bg-[#331400] text-[#FFE4A5] px-3 py-1 text-sm font-medium cursor-pointer self-start ml-4"
      >
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
          <path d="M15 18l-6-6 6-6" />
        </svg>
        Back
      </div>

      {/* Header */}
      <h1 className="text-center hidden md:block text-[#4B2E1E] text-[22px] font-semibold mt-6 mb-10 leading-snug max-w-md">
        Add your name and image to make <br />
        your Profile more you
      </h1>
      <h1 className="text-center md:hidden text-[#4B2E1E] text-3xl font-bold mt-6 md:mb-10 leading-snug max-w-md">
        Add Profile Details
      </h1>

      {/* Gradient Card */}
      <div className="md:bg-gradient-to-b from-[#FFE9B1] to-[#FDF6E3] px-6 py-10 w-full max-w-xl flex flex-col items-center md:shadow-sm">
        {/* Image Upload */}
        <button
          onClick={handleProfileImageClick}
          className="w-24 h-24 rounded-full bg-[#4B2E1E] flex items-center justify-center text-white text-sm mb-4 relative overflow-hidden group"
        >
          {profileImage ? (
            <>
              <Image src={profileImage} alt="Profile" fill className="object-cover" />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <ImageIcon className="w-5 h-5 text-white" />
              </div>
            </>
          ) : (
            <ImageIcon className="w-7 h-7" />
          )}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
        </button>

        <p className="text-[#4B2E1E] font-semibold mb-8">Add Bio and Location</p>

        <div className="w-full items-center flex flex-col gap-4">
          <Textarea
            placeholder="Bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full border border-[#4B2E1E] bg-transparent text-[#4B2E1E] placeholder:text-[#4B2E1E]/60 focus:ring-0 min-h-[100px] resize-none"
          />

          <div className="w-full flex justify-center">
            <div className="relative w-full max-w-md">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4B2E1E]/60" />
              <Input
                placeholder="Location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full pl-10 border border-[#4B2E1E] bg-transparent text-[#4B2E1E] placeholder:text-[#4B2E1E]/60 focus:ring-0"
              />
            </div>
          </div>
        </div>

        <Button
          onClick={handleContinue}
          disabled={loading}
          className="w-full bg-[#FED45C] hover:bg-[#f5ca4f] text-[#4B2E1E] text-lg font-semibold py-6 mt-8"
        >
          Continue
        </Button>
      </div>

      <footer className="w-full flex items-center md:hidden justify-between gap-2 py-4 text-sm text-[#331400] mt-8">
        <p>© 2025 Abio</p>
        <a href="/privacy-policy" className="hover:text-[#000000] transition">
          Privacy Policy
        </a>
      </footer>
    </main>
  );
}
