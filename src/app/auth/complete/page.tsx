"use client";

import { useState, JSX, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  FaInstagram,
  FaTiktok,
  FaPinterest,
  FaTwitter,
  FaCopy,
  FaWhatsapp,
  FaXTwitter,
  FaFacebook,
  FaSnapchat,
  FaYoutube,
} from "react-icons/fa6";
import { FaMapMarkerAlt } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { useCurrentUser, useGetAllLinks } from "@/hooks/api/useAuth";
import { useAppSelector } from "@/stores/hooks";
import { User } from "@/types/auth.types";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { toast } from "sonner";
import Confetti from "react-confetti";

export default function ProfileLivePage() {
  const router = useRouter();
  const [showShareBox, setShowShareBox] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  // Get user data from Redux store (primary source)
  const reduxUser = useAppSelector((state) => state.auth.user);

  // Fetch fresh user data using the hook (this also updates Redux)
  const {
    data: currentUser,
    isLoading,
    isError,
    error,
    refetch,
  } = useCurrentUser();
  const {
    data: linksData,
    isLoading: linksLoading,
    isError: linksError,
    refetch: refetchLinks,
  } = useGetAllLinks();

  // Use currentUser from hook if available, otherwise fallback to Redux
  const user: User | null = (currentUser as User) || reduxUser;

  // Extract profile data
  const profile = user?.profile;

  // Transform links data safely
  const transformLinks = (links: unknown): UserLink[] => {
    if (!links || !Array.isArray(links)) return [];
    return links
      .map((link: unknown) => {
        if (typeof link === "object" && link !== null) {
          const l = link as Record<string, unknown>;
          return {
            id: String(l.id || ""),
            title: String(l.title || ""),
            url: String(l.url || ""),
            platform: String(l.platform || ""),
            displayOrder:
              typeof l.displayOrder === "number" ? l.displayOrder : 0,
            isVisible: l.isVisible !== false, // Default to true if not specified
          };
        }
        return null;
      })
      .filter((link): link is UserLink => link !== null);
  };

  // Get links from API response (handle different response structures)
  const links = linksData
    ? Array.isArray(linksData)
      ? transformLinks(linksData)
      : transformLinks((linksData as { data?: unknown })?.data || linksData)
    : [];

  // Transform to the format needed by the component
  const userData = profile
    ? {
        name: user?.name || undefined,
        username: profile.username || undefined,
        displayName: profile.displayName || undefined,
        bio: profile.bio || undefined,
        goals: profile.goals || undefined,
        location: profile.location || undefined,
        avatarUrl: profile.avatarUrl || undefined,
        links,
      }
    : {};

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
    return (
      platformIcons[normalizedPlatform] ||
      platformIcons[platform.toLowerCase()] || <FaCopy className="w-4 h-4" />
    );
  };

  // Get the current origin (localhost:3000, localhost:3001, etc.) dynamically
  const getProfileLink = () => {
    if (typeof window === "undefined") return "/profile";
    const origin = window.location.origin; // e.g., "http://localhost:3000"
    return userData.username
      ? `${origin}/${userData.username}`
      : `${origin}/profile`;
  };

  const profileLink = getProfileLink();

  // Trigger confetti when component mounts
  useEffect(() => {
    setShowConfetti(true);

    // Set window size for confetti
    const updateWindowSize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    updateWindowSize();
    window.addEventListener("resize", updateWindowSize);

    // Stop confetti after 5 seconds
    const confettiTimer = setTimeout(() => {
      setShowConfetti(false);
    }, 20000);

    return () => {
      window.removeEventListener("resize", updateWindowSize);
      clearTimeout(confettiTimer);
    };
  }, []);

  const handleShare = async (platform: string) => {
    const shareUrl = encodeURIComponent(profileLink);
    const shareText = encodeURIComponent(`Check out my Abio profile!`);

    const shareUrls: Record<string, string> = {
      whatsapp: `https://wa.me/?text=${shareText}%20${shareUrl}`,
      twitter: `https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`,
      copy: profileLink,
    };

    if (platform === "copy") {
      try {
        await navigator.clipboard.writeText(profileLink);
        toast.success("Profile link copied to clipboard!");
      } catch (err) {
        toast.error("Failed to copy profile link to clipboard!");
      }
    } else if (shareUrls[platform]) {
      window.open(shareUrls[platform], "_blank", "noopener,noreferrer");
    }
  };

  const handleRetry = () => {
    refetch();
    refetchLinks();
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.7,
        ease: "easeOut",
      },
    },
    hover: {
      scale: 1.02,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
  };

  const circleVariants: Variants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 1,
        ease: "easeOut",
        delay: 0.3,
      },
    },
  };

  // Combined loading state - show loading if either user or links are loading
  if (isLoading || linksLoading) {
    return (
      <main className="min-h-screen bg-[#FFF4E8] flex flex-col items-center justify-center px-6 py-10">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="rounded-full h-12 w-12 border-b-2 border-[#331400] mx-auto mb-4"
          />
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-[#331400]"
          >
            Loading your profile...
          </motion.p>
        </div>
      </main>
    );
  }

  // Show error only if user data failed to load (links error is non-critical)
  if (isError && !userData.username && !userData.displayName) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to load profile";
    return (
      <ProtectedRoute>
        <main className="min-h-screen bg-[#FFF4E8] flex flex-col items-center justify-center px-6 py-10">
          <div className="text-center max-w-md">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-600 mb-4"
            >
              {errorMessage}
            </motion.p>
            {linksError && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-yellow-600 text-sm mb-4"
              >
                Note: Links could not be loaded. You can still view your
                profile.
              </motion.p>
            )}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex gap-3 justify-center"
            >
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
            </motion.div>
          </div>
        </main>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-[#FFF4E8] flex flex-col items-center justify-center px-4 md:px-6 md:py-10 md:overflow-hidden md:relative w-full">
        {/* Confetti Effect */}
        {showConfetti && (
          <Confetti
            width={windowSize.width}
            height={windowSize.height}
            recycle={false}
            numberOfPieces={2000}
            gravity={0.15}
            colors={["#331400", "#FED45C", "#FFE4A5", "#4B2E1E", "#FFF4E8"]}
            style={{ position: "fixed", zIndex: 999 }}
            onConfettiComplete={() => setShowConfetti(false)}
          />
        )}

        {/* Main Content Container */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="flex flex-col-reverse lg:flex-row items-center justify-center w-full max-w-6xl gap-10 lg:gap-16 relative z-10"
        >
          {/* Left Side — Profile Preview */}
          <motion.div
            variants={itemVariants}
            className="relative w-full max-w-sm flex justify-center items-center lg:mr-10"
          >
            {/* Background Circle (Desktop Only) */}
            <motion.div
              variants={circleVariants}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 hidden lg:block w-[400px] h-[400px] bg-[#331400] rounded-full"
            />

            {/* Profile Card */}
            <motion.div
              variants={cardVariants}
              whileHover="hover"
              className="relative bg-white border-8 md:border-[8px] border-black overflow-hidden shadow-lg z-10 w-full md:w-4/5 lg:w-3/4"
              style={{ borderRadius: "0px" }}
            >
              <div className="p-4 md:p-6 flex flex-col items-start">
                {/* Profile Info */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  className="flex items-center gap-3 mb-4"
                >
                  <Avatar className="w-14 h-14 md:w-16 md:h-16 shadow-md">
                    <AvatarImage
                      src={userData.avatarUrl || "/avatar-placeholder.png"}
                      alt={
                        userData.displayName || userData.username || "Profile"
                      }
                      className="object-cover"
                    />
                    <AvatarFallback>
                      {(userData.displayName || userData.username || "U")
                        .charAt(0)
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  <div>
                    <h2 className="font-bold text-sm md:text-[14px] text-[#2C1C0D]">
                      {userData.name ||
                        userData.displayName ||
                        userData.username ||
                        "User"}
                    </h2>
                    <p className="text-xs md:text-[10px] text-[#5C4C3B] mb-1">
                      @{userData.username || "username"}
                    </p>
                  </div>
                </motion.div>

                {/* Bio + Location */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="w-full text-left"
                >
                  <p className="text-xs md:text-[11px] text-[#3A2B20] mb-3">
                    {userData.bio || "No bio added yet."}
                  </p>
                  {userData.location && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.7 }}
                      className="inline-flex items-center gap-1 px-3 py-1 border border-[#C8C0B5] text-xs text-[#5C4C3B] mb-6 "
                    >
                      <FaMapMarkerAlt className="w-3 h-3" />
                      <span>{userData.location}</span>
                    </motion.div>
                  )}
                </motion.div>

                {/* Links */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="bg-[#F5F5F5] p-3 md:p-4 w-full space-y-3 md:space-y-4 "
                >
                  {linksLoading ? (
                    <div className="flex items-center justify-center py-4">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                        className="w-4 h-4 border-2 border-[#331400]/30 border-t-[#331400] rounded-full"
                      />
                      <span className="ml-2 text-xs md:text-[11px] text-[#3A2B20]">
                        Loading links...
                      </span>
                    </div>
                  ) : linksError ? (
                    <div className="text-center py-4">
                      <p className="text-xs md:text-[11px] text-yellow-600 mb-2">
                        Could not load links
                      </p>
                      <button
                        onClick={() => refetchLinks()}
                        className="text-xs md:text-[10px] text-[#331400] underline hover:no-underline"
                      >
                        Retry
                      </button>
                    </div>
                  ) : userData.links && userData.links.length > 0 ? (
                    userData.links
                      .filter((link: UserLink) => link.isVisible !== false)
                      .sort(
                        (a: UserLink, b: UserLink) =>
                          a.displayOrder - b.displayOrder
                      )
                      .map((link: UserLink, index: number) => (
                        <motion.a
                          key={link.id}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.9 + index * 0.1 }}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="flex items-center gap-2 bg-white px-3 py-2 font-medium text-xs md:text-sm shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer "
                        >
                          {getPlatformIcon(link.platform)}
                          <span className="truncate">{link.title}</span>
                        </motion.a>
                      ))
                  ) : (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.9 }}
                      className="text-xs md:text-[11px] text-[#3A2B20] text-center"
                    >
                      No links added yet.
                    </motion.p>
                  )}
                </motion.div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Side — Share Section */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col justify-center items-center md:items-start text-center md:text-left max-w-md"
          >
            <motion.h1
              variants={itemVariants}
              className="text-2xl md:text-3xl font-bold text-[#331400] mb-3"
            >
              Your profile is now live!
            </motion.h1>
            <motion.p
              variants={itemVariants}
              className="text-[#4B2E1E] mb-6 text-sm md:text-base"
            >
              Get more visitors by sharing your Abio Profile everywhere.
            </motion.p>

            {/* Link Input (Desktop) */}
            <motion.div
              variants={itemVariants}
              className="hidden md:flex items-center w-full border border-[#C8C0B5] overflow-hidden mb-6 "
            >
              <input
                readOnly
                value={profileLink}
                className="border-0 w-full text-[#4B2E1E] text-sm font-medium bg-transparent px-3 py-2 focus-visible:ring-0"
              />
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-3 bg-transparent hover:bg-[#FFF1D0] transition-colors"
                onClick={() => handleShare("copy")}
              >
                <FaCopy className="w-4 h-4 text-[#4B2E1E]" />
              </motion.button>
            </motion.div>

            {/* Desktop Buttons */}
            <motion.div
              variants={itemVariants}
              className="hidden md:flex w-full gap-4"
            >
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  onClick={() => router.push("/dashboard")}
                  className="flex-1 bg-[#FED45C] hover:bg-[#f5ca4f] text-[#4B2E1E] font-semibold py-5 transition-colors"
                >
                  Continue Editing
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  onClick={() => setShowShareBox(true)}
                  className="flex-1 bg-[#331400] hover:bg-[#4B2E1E] text-[#FFE4A5] font-semibold py-5 transition-colors"
                >
                  Share your Profile
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Mobile Bottom Buttons */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="fixed bottom-0 left-0 w-full flex md:hidden gap-3 bg-white p-4 border-t border-gray-200 shadow-lg z-20"
        >
          <Button
            onClick={() => router.push("/dashboard")}
            className="flex-1 bg-[#FED45C] hover:bg-[#f5ca4f] text-[#4B2E1E] font-semibold py-4 transition-colors"
          >
            Continue Editing
          </Button>
          <Button
            onClick={() => setShowShareBox(true)}
            className="flex-1 bg-[#331400] hover:bg-[#4B2E1E] text-[#FFE4A5] font-semibold py-4 transition-colors"
          >
            Share
          </Button>
        </motion.div>

        {/* Slide-Up Share Box */}
        <AnimatePresence>
          {showShareBox && (
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 260, damping: 30 }}
              className="fixed bottom-0 left-0 w-full shadow-md bg-white rounded-t-[32px] shadow-2xl px-6 pt-14 pb-8 z-50 md:hidden"
            >
              {/* Floating Logo */}
              <div className="absolute -top-8 left-1/2 -translate-x-1/2">
                <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-md">
                  <div className="w-10 h-10 rounded-full bg-[#331400] flex items-center justify-center">
                    <span className="text-white font-bold text-lg">⬡</span>
                  </div>
                </div>
              </div>

              {/* Header */}
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-black mb-1">
                  Share with Friends
                </h3>
                <p className="text-sm text-gray-500">
                  Abio is more effective when you connect with friends!
                </p>
              </div>

              {/* Share Link */}
              <div className="mb-6">
                <p className="text-sm font-semibold text-black mb-2">
                  Share your link
                </p>
                <div className="flex items-center bg-[#F6F7FB] rounded-lg px-3 py-3">
                  <input
                    readOnly
                    value={profileLink}
                    className="bg-transparent w-full text-sm text-gray-700 outline-none"
                  />
                  <button
                    onClick={() => handleShare("copy")}
                    className="ml-2 text-red-500"
                  >
                    <FaCopy className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Share To */}
              <div>
                <p className="text-sm font-semibold text-black mb-4">
                  Share to
                </p>

                <div className="flex justify-between px-2">
                  {[
                    { p: "facebook", icon: FaFacebook, color: "text-blue-600" },
                    { p: "twitter", icon: FaXTwitter, color: "text-black" },
                    {
                      p: "whatsapp",
                      icon: FaWhatsapp,
                      color: "text-green-500",
                    },
                    {
                      p: "instagram",
                      icon: FaInstagram,
                      color: "text-pink-500",
                    },
                    // { p: "telegram", icon: FaTelegramPlane, color: "text-blue-400" },
                    {
                      p: "pinterest",
                      icon: FaPinterest,
                      color: "text-red-600",
                    },
                  ].map(({ p, icon: Icon, color }) => (
                    <motion.button
                      key={p}
                      whileTap={{ scale: 0.9 }}
                      whileHover={{ scale: 1.05 }}
                      onClick={() => handleShare(p)}
                      className="flex flex-col items-center gap-2"
                    >
                      <div className="w-12 h-12 rounded-full bg-white shadow flex items-center justify-center">
                        <Icon className={`w-6 h-6 ${color}`} />
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={() => setShowShareBox(false)}
                className="absolute top-4 right-4 text-gray-400 text-xl"
              >
                ×
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </ProtectedRoute>
  );
}

interface UserLink {
  id: string;
  title: string;
  url: string;
  platform: string;
  displayOrder: number;
  isVisible: boolean;
}
