"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCheckUsername, useUpdateProfile } from "@/hooks/api/useAuth";
import { UpdateProfileResponse } from "@/types/auth.types";
import { useDebounce } from "@/hooks/useDebounce";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";



const UsernamePage = () => {
  const updateProfileMutation = useUpdateProfile();
  const [username, setUsername] = useState("");
  const debouncedUsername = useDebounce(username, 500); // Wait 500ms after user stops typing
  const { data: usernameData, isLoading: isCheckingUsername, isError } = useCheckUsername(debouncedUsername);
  const router = useRouter();
 
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!username.trim()) {
      return toast.error("Please enter a username");
    }

    // Check if username is available and valid
    if (usernameData?.data?.isAvailable && usernameData?.data?.isValid) {
      updateProfileMutation.mutate(
        { username: username.trim() },
        {
          onSuccess: (response: UpdateProfileResponse) => {
            if (response.success) {
              router.push("/auth/goal");
            } else {
              toast.error(response.message || "Failed to update profile");
            }
          },
        }
      );
    } else {
      toast.error("Username is not available", {
        description: usernameData?.message || "Please choose a different username",
      });
    }
  }

  // Determine status icon to show
  const getStatusIcon = () => {
    if (!debouncedUsername || username !== debouncedUsername) {
      // User is still typing, show nothing
      return null;
    }

    if (isCheckingUsername) {
      // Loading state
      return <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />;
    }

    if (isError) {
      // Error state
      return <XCircle className="w-5 h-5 text-red-500" />;
    }

    if (usernameData?.data) {
      if (usernameData.data.isAvailable && usernameData.data.isValid) {
        // Available and valid
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      } else {
        // Not available or invalid
        return <XCircle className="w-5 h-5 text-red-500" />;
      }
    }

    return null;
  };

  return (
    <ProtectedRoute>
      <div className="flex flex-col min-h-screen bg-[#FEF4EA]">
      {/* Main content */}
      <div className="flex flex-1 flex-col lg:flex-row items-center justify-center">
        <div className="flex flex-col items-center justify-center w-full lg:w-1/2 p-5 max-w-xl">
          {/* Header */}
          <div className="mb-6 text-center">
            <h1 className="text-3xl font-bold text-[#331400] mb-1 md:hidden">
              Create Username
            </h1>
            <h1 className="hidden md:block text-3xl lg:text-4xl font-bold text-[#331400] mb-1">
              Claim your free Username
            </h1>
            <p className="text-[#666464] text-sm md:text-base">
              Choose a unique username that represents you.
            </p>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="w-full space-y-4 lg:max-w-fit relative"
          >
            <div className="relative w-full">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 font-semibold text-lg text-[#4B2E1E] select-none">
                abio.site/
              </span>

              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter unique username"
                className="pl-[100px] pr-12 h-10 text-sm font-medium placeholder:font-medium placeholder:text-gray-500"
                aria-label="Username"
                autoComplete="off"
              />

              {/* Status icon (loading/checkmark/X) */}
              <div className="absolute right-12 top-1/2 -translate-y-1/2">
                {getStatusIcon()}
              </div>

              {/* Desktop submit icon */}
              <button
                type="submit"
                aria-label="Submit username"
                disabled={updateProfileMutation.isPending || isCheckingUsername || !(usernameData?.data?.isAvailable && usernameData?.data?.isValid)}
                className="hidden lg:flex absolute right-2 top-1/2 -translate-y-1/2 bg-[#FED45C] hover:bg-[#f5ca4f] disabled:opacity-50 disabled:cursor-not-allowed text-[#331400] p-2 rounded-md transition-all duration-200"
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
                >
                  <path d="M5 12h14" />
                  <path d="M12 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Status message */}
            {debouncedUsername && username === debouncedUsername && !isCheckingUsername && usernameData?.data && (
              <p className={`text-sm ${usernameData.data.isAvailable && usernameData.data.isValid ? 'text-green-600' : 'text-red-600'}`}>
                {usernameData.data.isAvailable && usernameData.data.isValid
                  ? "✓ Username is available"
                  : usernameData.message || "Username is not available"}
              </p>
            )}

            {/* Mobile button */}
            <Button
              type="submit"
              disabled={updateProfileMutation.isPending || isCheckingUsername || !(usernameData?.data?.isAvailable && usernameData?.data?.isValid)}
              className="w-full lg:hidden bg-[#FED45C] hover:bg-[#f5ca4f] disabled:opacity-50 disabled:cursor-not-allowed text-[#331400] py-2 font-semibold transition-all"
            >
              {updateProfileMutation.isPending ? "Updating..." : "Continue"}
            </Button>
          </form>
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full flex items-center justify-between px-4 md:hidden gap-3 py-4  text-sm text-[#331400] mt-auto">
        <p>© 2025 Abio</p>
        <a href="/privacy-policy" className="hover:text-[#000000] transition">
          Privacy Policy
        </a>
      </footer>
    </div>
    </ProtectedRoute>
  );
};

export default UsernamePage;
