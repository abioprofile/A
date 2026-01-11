"use client";

import { useState, JSX } from "react";
import { useRouter } from "next/navigation";
import { FaInstagram, FaTiktok, FaPinterest, FaTwitter, FaCopy, FaWhatsapp, FaXTwitter, FaFacebook, FaSnapchat, FaYoutube } from "react-icons/fa6";
import { FaMapMarkerAlt } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { motion, AnimatePresence } from "framer-motion";
import { useCurrentUser, useGetAllLinks } from "@/hooks/api/useAuth";
import { useAppSelector } from "@/stores/hooks";
import { User } from "@/types/auth.types";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { toast } from "sonner";

interface UserLink {
  id: string;
  title: string;
  url: string;
  platform: string;
  displayOrder: number;
  isVisible: boolean;
}

export default function ProfileLivePage() {
  const router = useRouter();
  const [showShareBox, setShowShareBox] = useState(false);
  
  // Get user data from Redux store (primary source)
  const reduxUser = useAppSelector((state) => state.auth.user);
  
  // Fetch fresh user data using the hook (this also updates Redux)
  const { data: currentUser, isLoading, isError, error, refetch } = useCurrentUser();
  const { 
    data: linksData, 
    isLoading: linksLoading, 
    isError: linksError, 
    refetch: refetchLinks 
  } = useGetAllLinks();
  
  // Use currentUser from hook if available, otherwise fallback to Redux
  const user: User | null = (currentUser as User) || reduxUser;
  
  // Extract profile data
  const profile = user?.profile;
  
  // Transform links data safely
  const transformLinks = (links: unknown): UserLink[] => {
    if (!links || !Array.isArray(links)) return [];
    return links.map((link: unknown) => {
      if (typeof link === 'object' && link !== null) {
        const l = link as Record<string, unknown>;
        return {
          id: String(l.id || ''),
          title: String(l.title || ''),
          url: String(l.url || ''),
          platform: String(l.platform || ''),
          displayOrder: typeof l.displayOrder === 'number' ? l.displayOrder : 0,
          isVisible: l.isVisible !== false, // Default to true if not specified
        };
      }
      return null;
    }).filter((link): link is UserLink => link !== null);
  };
  
  // Get links from API response (handle different response structures)
  const links = linksData 
    ? (Array.isArray(linksData) 
        ? transformLinks(linksData) 
        : transformLinks((linksData as { data?: unknown })?.data || linksData))
    : [];
  
  // Transform to the format needed by the component
  const userData = profile ? {
    name: user?.name || undefined,
    username: profile.username || undefined,
    displayName: profile.displayName || undefined,
    bio: profile.bio || undefined,
    goals: profile.goals || undefined,
    location: profile.location || undefined,
    avatarUrl: profile.avatarUrl || undefined,
    links,
  } : {};

  const platformIcons: Record<string, JSX.Element> = {
    INSTAGRAM: <FaInstagram className="w-4 h-4" />,
    TIKTOK: <FaTiktok className="w-4 h-4" />,
    PINTEREST: <FaPinterest className="w-4 h-4" />,
    TWITTER: <FaTwitter className="w-4 h-4" />,
    FACEBOOK: <FaFacebook className="w-4 h-4" />,
    SNAPCHAT: <FaSnapchat className="w-4 h-4" />,
    YOUTUBE: <FaYoutube className="w-4 h-4" />,
    WHATSAPP: <FaWhatsapp className="w-4 h-4" />,
    X: <FaXTwitter className="w-4 h-4" />,
    snapchat: <FaSnapchat className="w-4 h-4" />,
    facebook: <FaFacebook className="w-4 h-4" />,
    youtube: <FaYoutube className="w-4 h-4" />,
    instagram: <FaInstagram className="w-4 h-4" />,
    tiktok: <FaTiktok className="w-4 h-4" />,
    twitter: <FaTwitter className="w-4 h-4" />,
  };

  const getPlatformIcon = (platform: string) => {
    const normalizedPlatform = platform.toUpperCase();
    return platformIcons[normalizedPlatform] || platformIcons[platform.toLowerCase()] || <FaCopy className="w-4 h-4" />;
  };

  // Get the current origin (localhost:3000, localhost:3001, etc.) dynamically
  const getProfileLink = () => {
    if (typeof window === 'undefined') return "/profile";
    const origin = window.location.origin; // e.g., "http://localhost:3000"
    return userData.username ? `${origin}/${userData.username}` : `${origin}/profile`;
  };
  
  const profileLink = getProfileLink();

  const handleShare = async (platform: string) => {
    const shareUrl = encodeURIComponent(profileLink);
    const shareText = encodeURIComponent(`Check out my Abio profile!`);

    const shareUrls: Record<string, string> = {
      whatsapp: `https://wa.me/?text=${shareText}%20${shareUrl}`,
      twitter: `https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`,
      copy: profileLink,
    };

    if (platform === 'copy') {
      try {
        await navigator.clipboard.writeText(profileLink);
        toast.success("Profile link copied to clipboard!");
      } catch (err) {
        toast.error("Failed to copy profile link to clipboard!");
      }
    } else if (shareUrls[platform]) {
      window.open(shareUrls[platform], '_blank', 'noopener,noreferrer');
    }
  };

  const handleRetry = () => {
    refetch();
    refetchLinks();
  };

  // Combined loading state - show loading if either user or links are loading
  if (isLoading || linksLoading) {
    return (
      <main className="min-h-screen bg-[#FFF4E8] flex flex-col items-center justify-center px-6 py-10">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#331400] mx-auto mb-4"></div>
          <p className="text-[#331400]">Loading your profile...</p>
        </div>
      </main>
    );
  }

  // Show error only if user data failed to load (links error is non-critical)
  if (isError && !userData.username && !userData.displayName) {
    const errorMessage = error instanceof Error ? error.message : "Failed to load profile";
    return (
      <ProtectedRoute>
        <main className="min-h-screen bg-[#FFF4E8] flex flex-col items-center justify-center px-6 py-10">
          <div className="text-center max-w-md">
            <p className="text-red-600 mb-4">{errorMessage}</p>
            {linksError && (
              <p className="text-yellow-600 text-sm mb-4">
                Note: Links could not be loaded. You can still view your profile.
              </p>
            )}
            <div className="flex gap-3 justify-center">
              <Button
                onClick={handleRetry}
                className="bg-[#331400] hover:bg-[#4B2E1E] text-[#FFE4A5]"
              >
                Retry
              </Button>
              <Button
                onClick={() => router.push("/dashboard")}
                className="bg-[#FED45C] hover:bg-[#f5ca4f] text-[#4B2E1E]"
              >
                Go to Dashboard
              </Button>
            </div>
          </div>
        </main>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-[#FFF4E8] flex flex-col items-center justify-center px-6 py-10 overflow-hidden relative">
      
      <div className="flex flex-col-reverse lg:flex-row items-center justify-center w-full max-w-6xl gap-16 relative z-10">
        {/* Left Side — Profile Preview */}
        <div className="relative w-full max-w-sm flex justify-center items-center lg:mr-10">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 hidden lg:block w-[450px] h-[450px] bg-[#331400] rounded-full" />

          <Card className="relative bg-white border-[6px] border-black md:border-none overflow-hidden shadow-md z-10 w-3/4">
            <div className="p-6 flex flex-col items-start">
              {/* Profile Info */}
              <div className="flex items-center gap-2 mb-3">
                <Avatar className="w-16 h-16 shadow-md">
                  <AvatarImage
                    src={userData.avatarUrl || "/avatar-placeholder.png"}
                    alt={userData.displayName || userData.username || "Profile"}
                    className="object-cover"
                  />
                  <AvatarFallback>
                    {(userData.displayName || userData.username || "U").charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <div>
                  <h2 className="font-bold text-[14px] text-[#2C1C0D]">
                    {userData.name || userData.displayName || userData.username || "User"}
                  </h2>
                  <p className="text-[10px] text-[#5C4C3B] mb-1">
                    @{userData.username || "username"}
                  </p>
                </div>
              </div>

              {/* Bio + Location */}
              <div className="w-full text-left">
                <p className="text-[11px] text-[#3A2B20] mb-3">{userData.bio || "No bio added yet."}</p>
                {userData.location && (
                  <div className="inline-flex items-center gap-1 px-3 py-1 border border-[#C8C0B5] text-xs text-[#5C4C3B] mb-6">
                    <FaMapMarkerAlt className="w-3 h-3" />
                    <span>{userData.location}</span>
                  </div>
                )}
              </div>

              {/* Links */}
              <div className="bg-[#F5F5F5] p-4 w-full space-y-4">
                {linksLoading ? (
                  <div className="flex items-center justify-center py-4">
                    <div className="w-4 h-4 border-2 border-[#331400]/30 border-t-[#331400] rounded-full animate-spin" />
                    <span className="ml-2 text-[11px] text-[#3A2B20]">Loading links...</span>
                  </div>
                ) : linksError ? (
                  <div className="text-center py-4">
                    <p className="text-[11px] text-yellow-600 mb-2">
                      Could not load links
                    </p>
                    <button
                      onClick={() => refetchLinks()}
                      className="text-[10px] text-[#331400] underline hover:no-underline"
                    >
                      Retry
                    </button>
                  </div>
                ) : userData.links && userData.links.length > 0 ? (
                  userData.links
                    .filter((link: UserLink) => link.isVisible !== false)
                    .sort((a: UserLink, b: UserLink) => a.displayOrder - b.displayOrder)
                    .map((link: UserLink) => (
                    <a
                      key={link.id}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 bg-white px-3 py-2 font-medium text-sm shadow-sm hover:shadow-md transition-shadow cursor-pointer rounded"
                    >
                      {getPlatformIcon(link.platform)}
                      <span className="truncate">{link.title}</span>
                    </a>
                  ))
                ) : (
                  <p className="text-[11px] text-[#3A2B20] text-center">No links added yet.</p>
                )}
              </div>
            </div>
          </Card>
        </div>

        {/* Right Side — Share Section */}
        <div className="flex flex-col justify-center items-start text-left max-w-md">
          <h1 className="text-3xl font-bold text-[#331400] mb-3">
            Your profile is now live!
          </h1>
          <p className="text-[#4B2E1E] mb-6">
            Get more visitors by sharing your Abio Profile everywhere.
          </p>

          <div className="hidden md:flex items-center w-full border border-[#C8C0B5] overflow-hidden mb-6 rounded">
            <input
              readOnly
              value={profileLink}
              className="border-0 w-full text-[#4B2E1E] font-medium bg-transparent px-3 py-2 focus-visible:ring-0"
            />
            <button
              className="p-3 bg-transparent hover:bg-[#FFF1D0] transition-colors"
              onClick={() => handleShare('copy')}
            >
              <FaCopy className="w-4 h-4 text-[#4B2E1E]" />
            </button>
          </div>

          <div className="hidden md:flex w-full gap-4">
            <Button
              onClick={() => router.push("/dashboard")}
              className="flex-1 bg-[#FED45C] hover:bg-[#f5ca4f] text-[#4B2E1E] font-semibold py-5 transition-colors"
            >
              Continue Editing
            </Button>
            <Button
              onClick={() => setShowShareBox(true)}
              className="flex-1 bg-[#331400] hover:bg-[#4B2E1E] text-[#FFE4A5] font-semibold py-5 transition-colors"
            >
              Share your Profile
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Buttons */}
      <div className="fixed bottom-0 left-0 w-full flex md:hidden gap-3 bg-white p-4 border-t border-gray-200 shadow-md">
        <Button
          onClick={() => router.push("/dashboard")}
          className="flex-1 bg-[#FED45C] hover:bg-[#f5ca4f] text-[#4B2E1E] font-semibold py-5 transition-colors"
        >
          Continue Editing
        </Button>
        <Button
          onClick={() => setShowShareBox(true)}
          className="flex-1 bg-[#331400] hover:bg-[#4B2E1E] text-[#FFE4A5] font-semibold py-5 transition-colors"
        >
          Share
        </Button>
      </div>

      {/* Slide-Up Share Box */}
      <AnimatePresence>
        {showShareBox && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 200, damping: 25 }}
            className="fixed bottom-0 left-0 w-full bg-white rounded-t-2xl shadow-lg p-6 z-50 md:hidden"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-[#331400]">Share your Abio</h3>
              <button
                onClick={() => setShowShareBox(false)}
                className="text-[#331400] font-bold text-xl"
              >
                ×
              </button>
            </div>

            <div className="grid grid-cols-3 gap-4 text-center">
              <button
                onClick={() => handleShare('copy')}
                className="flex flex-col items-center text-[#4B2E1E] p-3 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <FaCopy className="w-5 h-5 mb-1" />
                <span className="text-xs font-medium">Copy Link</span>
              </button>

              <button 
                onClick={() => handleShare('whatsapp')}
                className="flex flex-col items-center text-green-600 p-3 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <FaWhatsapp className="w-5 h-5 mb-1" />
                <span className="text-xs font-medium">WhatsApp</span>
              </button>

              <button 
                onClick={() => handleShare('twitter')}
                className="flex flex-col items-center text-black p-3 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <FaXTwitter className="w-5 h-5 mb-1" />
                <span className="text-xs font-medium">X</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      </main>
    </ProtectedRoute>
  );
}