"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MapPin } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useUpdateProfile, useCurrentUser } from "@/hooks/api/useAuth";
import { COUNTRIES } from "@/lib/data/countries";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { User } from "@/types/auth.types";

export default function ProfileScreen() {
  const router = useRouter();
  const updateProfileMutation = useUpdateProfile();
  const { data: currentUser } = useCurrentUser();
  
  // Form state
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");

  // Load existing values from current user if available
  useEffect(() => {
    if (currentUser) {
      const user = currentUser as User;
      if (user.profile) {
        setBio(user.profile.bio || "");
        setLocation(user.profile.location || "");
      }
    }
  }, [currentUser]);

  const handleContinue = async () => {
    // Validation
    if (!bio.trim()) {
      toast.error("Please enter your bio");
      return;
    }
    
    if (!location.trim()) {
      toast.error("Please select your location");
      return;
    }

    // Submit the form
    updateProfileMutation.mutate(
      { 
        bio: bio.trim(), 
        location: location.trim() 
      },
      {
        onSuccess: () => {
          toast.success("Profile updated successfully");
          router.push("/auth/complete");
        },
      }
    );
  };

  if (updateProfileMutation.isPending) {
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
          Add your bio and location to make <br />
          your Profile more you
        </h1>
        <h1 className="text-center md:hidden text-[#4B2E1E] text-3xl font-bold mt-6 md:mb-10 leading-snug max-w-md">
          Add Profile Details
        </h1>

        {/* Gradient Card */}
        <div className="md:bg-gradient-to-b from-[#FFE9B1] to-[#FDF6E3] px-6 py-10 w-full max-w-xl flex flex-col items-center md:shadow-sm">
          <p className="text-[#4B2E1E] font-semibold mb-8">Add Bio and Location</p>

          <div className="w-full items-center flex flex-col gap-4">
            <Textarea
              placeholder="Tell us about yourself..."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full border border-[#4B2E1E] bg-transparent text-[#4B2E1E] placeholder:text-[#4B2E1E]/60 focus:ring-0 min-h-[100px] resize-none"
            />

            <div className="w-full flex justify-center">
              <div className="relative w-full max-w-md">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4B2E1E]/60 z-10 pointer-events-none" />
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-[#4B2E1E] bg-transparent text-[#4B2E1E] focus:ring-0 focus:outline-none appearance-none cursor-pointer"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%234B2E1E' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 0.75rem center',
                    backgroundSize: '12px',
                  }}
                >
                  <option value="" disabled>
                    Select your country
                  </option>
                  {COUNTRIES.map((country) => (
                    <option key={country} value={country} className="bg-[#FDF6E3] text-[#4B2E1E]">
                      {country}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <Button
            onClick={handleContinue}
            disabled={updateProfileMutation.isPending || !bio.trim() || !location.trim()}
            className="w-full bg-[#FED45C] hover:bg-[#f5ca4f] disabled:opacity-50 disabled:cursor-not-allowed text-[#4B2E1E] text-lg font-semibold py-6 mt-8"
          >
            {updateProfileMutation.isPending ? "Saving..." : "Continue"}
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
