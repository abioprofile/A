"use client";

import { JSX } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { FaInstagram, FaTiktok, FaPinterest, FaTwitter, FaCopy, FaWhatsapp, FaXTwitter, FaFacebook, FaSnapchat, FaYoutube } from "react-icons/fa6";
import { FaMapMarkerAlt } from "react-icons/fa";
import { useUserProfileByUsername } from "@/hooks/api/useAuth";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useAppSelector } from "@/stores/hooks";

interface UserLink {
  id: string;
  title: string;
  url: string;
  platform: string;
  displayOrder: number;
  isVisible: boolean;
}

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
  "Custom Platform": <FaCopy className="w-4 h-4" />,
};

const getPlatformIcon = (platform: string) => {
  const normalizedPlatform = platform.toUpperCase();
  return platformIcons[normalizedPlatform] || platformIcons[platform.toLowerCase()] || platformIcons[platform] || <FaCopy className="w-4 h-4" />;
};

export default function PublicProfilePage() {
  const params = useParams();
  const username = params?.username as string;
  const usernameData = useAppSelector((state) => state.auth.user);
  console.log(usernameData, "usernameData");

  // Fetch user profile by username
  const { 
    data: profileData, 
    isLoading: profileLoading, 
    isError: profileError, 
    error: profileErrorData 
  } = useUserProfileByUsername(username);

  // Get links from profile data (profileData already includes links)
  const profileLinks = profileData?.data?.links || [];
  
  // Transform profile links to UserLink format
  const links: UserLink[] = profileLinks.map((link) => ({
    id: link.id,
    title: link.title,
    url: link.url,
    platform: link.platform,
    displayOrder: link.displayOrder,
    isVisible: link.isVisible,
  }));

  // Loading state
  if (profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#331400] mx-auto mb-4"></div>
          <p className="text-[#331400]">Loading profile...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (profileError || !profileData?.data) {
    const errorMessage = profileErrorData instanceof Error 
      ? profileErrorData.message 
      : "Profile not found";
    
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-100">
        <div className="text-center max-w-md px-4">
          <p className="text-red-600 mb-4">{errorMessage}</p>
          <p className="text-gray-600 text-sm">
            The profile you&apos;re looking for doesn&apos;t exist or is not available.
          </p>
        </div>
      </div>
    );
  }

  const profile = profileData.data;
  const userData = {
    name: profile.displayName || undefined,
    username: profile.username || undefined,
    bio: profile.bio || undefined,
    location: profile.location || undefined,
    avatarUrl: profile.avatarUrl || undefined,
    links,
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-100">
      {/* Phone container */}
      <div className="relative w-[320px] h-[580px] border-[6px] border-black bg-white overflow-hidden shadow-xl">
        {/* ===== TOP PROFILE CARD ===== */}
        <div className="bg-white p-5">
          <div className="flex items-center gap-3">
            {/* Avatar */}
            <Avatar className="w-[56px] h-[56px] border">
              {/* <AvatarImage
                src={userData.avatarUrl || "/icons/Profile Picture.png"}
                alt={userData.name || userData.username || "Profile"}
                className="object-cover"
              /> */}
              <AvatarFallback>
                {(userData.name || userData.username || "U").charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            {/* Name */}
            <div>
              <p className="font-bold text-sm">{usernameData?.name || "User"}</p>
              <p className="text-xs text-gray-500">@{userData.username || "username"}</p>
            </div>
          </div>

          {/* Bio */}
          {userData.bio && (
            <p className="text-xs mt-3">
              {userData.bio}
            </p>
          )}

          {/* Location */}
          {userData.location && (
            <div className="inline-flex items-center gap-1 mt-2 border px-2 py-[2px] text-[10px]">
              <FaMapMarkerAlt className="w-3 h-3" />
              {userData.location}
            </div>
          )}

          {/* Link indicator */}
          {links.length > 0 && (
            <div className="mt-3 flex items-center gap-2 relative">
              <Image src="/icons/link.png" alt="link" width={18} height={18} />
              <div className="absolute -bottom-1 left-0 w-6 h-[2px] bg-red-500" />
            </div>
          )}
        </div>

        {/* ===== BACKGROUND IMAGE ===== */}
        <div className="absolute inset-0 top-[190px] -z-10">
          <Image
            src="/themes/rick-morty.png"
            alt="background"
            fill
            className="object-cover"
          />
        </div>

        {/* ===== BUTTONS ===== */}
        <div className="relative z-10 px-4 pt-6 space-y-4">
          {links.length > 0 ? (
            links
              .filter((link: UserLink) => link.isVisible !== false)
              .sort((a: UserLink, b: UserLink) => a.displayOrder - b.displayOrder)
              .map((link: UserLink) => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center gap-3 px-4 py-3 font-medium text-sm
                             bg-[#C8F46A] border-2 border-black rounded-xl
                             shadow-[0_5px_0_#000] hover:shadow-[0_3px_0_#000] hover:translate-y-[2px]
                             transition-all cursor-pointer"
                >
                  {getPlatformIcon(link.platform)}
                  <span className="truncate">{link.title}</span>
                </a>
              ))
          ) : (
            <p className="text-xs text-gray-500 text-center py-4">No links added yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}

