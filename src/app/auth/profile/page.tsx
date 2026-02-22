"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Upload, X, User as UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  useUpdateProfile,
  useCurrentUser,
  useUpdateProfileAvatar,
} from "@/hooks/api/useAuth";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { User } from "@/types/auth.types";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { LocationInput } from "@/components/LocationInput";
import { OnboardingProgressWithSteps } from "@/components/ProgressBar";

export default function ProfileScreen() {
  const router = useRouter();
  const updateProfileMutation = useUpdateProfile();
  const updateAvatarMutation = useUpdateProfileAvatar();
  const { data: currentUser } = useCurrentUser();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (currentUser) {
      const user = currentUser as User;
      if (user.profile) {
        setBio(user.profile.bio || "");
        setLocation(user.profile.location || "");
        setAvatarPreview(user.profile.avatarUrl || null);
      }
    }
  }, [currentUser]);

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => setAvatarPreview(e.target?.result as string);
    reader.readAsDataURL(file);
    updateAvatarMutation.mutate(file);
  };

  const handleLocationChange = (newVal: string) => setLocation(newVal);
  const handleRemoveAvatar = () => {
    setAvatarPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };
  const handleAvatarClick = () => fileInputRef.current?.click();

  const handleContinue = async () => {
    if (isSubmitting || updateProfileMutation.isPending) return;
    if (!bio.trim()) {
      toast.error("Please enter your bio");
      return;
    }
    if (!location.trim()) {
      toast.error("Please select your location");
      return;
    }
    setIsSubmitting(true);
    updateProfileMutation.mutate(
      { bio: bio.trim(), location: location.trim() },
      {
        onSuccess: () => {
          toast.success("Profile updated successfully");
          router.push("/auth/complete");
        },
        onError: () => toast.error("Failed to update profile"),
        onSettled: () => setIsSubmitting(false),
      },
    );
  };

  if (updateProfileMutation.isPending && !isSubmitting) {
    return (
      <ProtectedRoute>
        <main className="min-h-screen flex flex-col items-center justify-center bg-[#FEF4EA]">
          <div className="flex items-center gap-3 text-[#331400]">
            <div className="w-5 h-5 border-2 border-[#331400]/30 border-t-[#331400] rounded-full animate-spin" />
            <span className="font-bold text-xl">Saving your profile...</span>
          </div>
        </main>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-[#FEF4EA] flex flex-col items-center px-4 pt-6 pb-10">
        {/* Back Button */}
        <div className="relative w-full flex flex-col items-center">
          <div
            onClick={() => router.back()}
            className="hidden md:flex items-center gap-1 bg-[#331400] text-[#FFE4A5] px-3 py-1 text-sm font-medium cursor-pointer absolute left-4 top-0"
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
          <div className="w-full">
            <OnboardingProgressWithSteps currentStep={5} totalSteps={5} />
          </div>
        </div>
        {/* Header */}
        <h1 className="text-center hidden md:block text-[#4B2E1E] text-[24px] font-semibold mt-6 mb-10 leading-snug max-w-md">
          Add your bio and location to make <br /> your Profile more you
        </h1>
        <h1 className="text-center md:hidden text-[#4B2E1E] text-[20px] mb-2 font-bold mt-2 md:mb-10 leading-snug max-w-md">
          Add Profile Details
        </h1>

        {/* Gradient Card */}
        <div className="md:bg-gradient-to-b from-[#FFE9B1] to-[#FDF6E3] px-6 md:py-10 w-full max-w-xl flex flex-col items-center md:shadow-sm relative overflow-visible">
          <p className="text-[#4B2E1E] text-[14px] md:text-[16px] font-semibold mb-8">
            Add Bio and Location
          </p>

          {/* Avatar Upload Section — unchanged */}
          <div className="mb-8 flex flex-col items-center gap-4">
            <div className="relative">
              <Avatar
                className="w-24 h-24 md:w-24 md:h-24 border-4 border-[#331400] cursor-pointer hover:opacity-90 transition-opacity"
                onClick={handleAvatarClick}
              >
                {avatarPreview ? (
                  <AvatarImage
                    src={avatarPreview}
                    alt="Profile"
                    className="object-cover"
                  />
                ) : (
                  <AvatarFallback className="bg-[#FED45C] text-[#331400] text-2xl md:text-3xl font-bold">
                    <UserIcon className="w-12 h-12 md:w-16 md:h-16" />
                  </AvatarFallback>
                )}
              </Avatar>
              <button
                type="button"
                onClick={handleAvatarClick}
                className="absolute -bottom-2 -right-2 bg-[#331400] text-[#FED45C] p-2 rounded-full hover:bg-[#4a2c1a] transition-colors shadow-lg"
                title="Upload avatar"
              >
                <Upload className="w-4 h-4" />
              </button>
              {avatarPreview && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveAvatar();
                  }}
                  className="absolute -top-2 -right-2 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 transition-colors shadow-lg"
                  title="Remove avatar"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarUpload}
              className="hidden"
            />
            <p className="text-xs text-[#4B2E1E]/70 text-center max-w-xs">
              {updateAvatarMutation.isPending
                ? "Uploading avatar..."
                : "Click to upload or change your profile picture"}
            </p>
          </div>

          {/* ── Form fields ── */}
          <div className="w-full space-y-5">
            {/* Bio */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="bio"
                className="text-[14px] font-semibold uppercase tracking-widest text-[#6B3F18]"
              >
                Bio
              </label>
              <div className="relative">
                <textarea
                  id="bio"
                  placeholder="Tell us about yourself..."
                  value={bio}
                  maxLength={200}
                  onChange={(e) => setBio(e.target.value)}
                  className="
                    w-full min-h-[110px] resize-none
                    border border-[#4B2E1E] bg-transparent
                     px-4 py-3
                    text-[16px] text-[#2A1500] leading-relaxed
                    placeholder:text-[#4B2E1E]
                    outline-none transition-all duration-200
                    focus:border-[#331400] 
                    focus:shadow-[0_0_0_3px_rgba(254,212,92,0.35)]
                  "
                />
                {/* character count */}
                <span
                  className={`
                    absolute bottom-2.5 right-3 text-[10px] font-medium pointer-events-none
                    ${bio.length > 180 ? "text-red-500" : "text-[#4B2E1E]/30"}
                  `}
                >
                  {bio.length}/200
                </span>
              </div>
            </div>

            {/* Location */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="location"
                className="text-[14px] font-semibold uppercase  text-[#6B3F18]"
              >
                Location
              </label>
              <div className="relative z-10">
                <LocationInput
                  id="location"
                  label=""
                  value={location}
                  onChange={handleLocationChange}
                  placeholder="Search for a location"
                  className="w-full"
                  inputClassName="text-[16px]"
                />
              </div>
            </div>
          </div>

          {/* Button — completely unchanged */}
          <Button
            onClick={handleContinue}
            disabled={
              isSubmitting ||
              updateProfileMutation.isPending ||
              !bio.trim() ||
              !location.trim()
            }
            className="w-full bg-[#FED45C] hover:bg-[#f5ca4f] disabled:opacity-50 disabled:cursor-not-allowed text-[#4B2E1E] text-sm  py-6 mt-8 relative z-0"
          >
            {isSubmitting || updateProfileMutation.isPending
              ? "Saving..."
              : "Continue"}
          </Button>
        </div>

        <footer className="w-full flex items-center md:hidden justify-between gap-2 py-4 text-sm text-[#331400] mt-8">
          <p>© 2025 Abio</p>
          <a href="/privacy-policy" className="hover:text-[#000000] transition">
            Privacy Policy
          </a>
        </footer>
      </main>
    </ProtectedRoute>
  );
}
