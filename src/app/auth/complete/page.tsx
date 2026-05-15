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
import { CheckCircle2, ArrowRight, Settings, Sparkles } from "lucide-react";

export default function OnboardingCompletionPage() {
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
            isVisible: l.isVisible !== false,
          };
        }
        return null;
      })
      .filter((link): link is UserLink => link !== null);
  };

  // Get links from API response
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

  // Get the current origin dynamically
  const getProfileLink = () => {
    if (typeof window === "undefined") return "/profile";
    const origin = window.location.origin;
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
    }, 5000);

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

  // Animation variants for completion section
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.12,
        ease: [0.25, 0.1, 0.25, 1],
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15, filter: "blur(8px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration: 0.5,
        ease: [0.25, 0.1, 0.25, 1],
      },
    },
  };

  const successIconVariants = {
    hidden: { scale: 0, opacity: 0, rotate: -180 },
    visible: {
      scale: 1,
      opacity: 1,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20,
        duration: 0.6,
      },
    },
  };

  const checkmarkDrawVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.1, 0.25, 1],
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

  const buttonVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: [0.25, 0.1, 0.25, 1],
      },
    },
    hover: {
      scale: 1.02,
      transition: {
        duration: 0.2,
        ease: "easeInOut",
      },
    },
    tap: {
      scale: 0.98,
      transition: {
        duration: 0.1,
      },
    },
  };

  const completionSteps = [
    { id: "profile", title: "Profile set up", completed: true },
    { id: "preferences", title: "Preferences saved", completed: true },
    { id: "ready", title: "Ready to go", completed: true },
  ];

  // Loading state
  if (isLoading || linksLoading) {
    return (
      <ProtectedRoute>
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
      </ProtectedRoute>
    );
  }

  // Error state
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
    <>
      <main className="min-h-screen bg-[#FFF4E8] flex flex-col items-center justify-center px-4 md:px-6 md:py-10 w-full overflow-x-hidden">
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
          />
        )}

        {/* Main Content Container */}
        <div className="flex flex-col-reverse lg:flex-row items-center justify-center w-full max-w-6xl gap-8 lg:gap-16 relative z-10">
          {/* Left Side — Profile Preview (PhoneDisplay) */}
          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            className="relative w-full max-w-sm flex justify-center items-center lg:mr-10"
          >
            {/* Background Circle (Desktop Only) */}
            <motion.div
              variants={circleVariants}
              initial="hidden"
              animate="visible"
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 hidden lg:block w-[600px] h-[600px] bg-[#331400] rounded-full"
            />

            {/* Profile Card - Same as PhoneDisplay */}
            <motion.div
              variants={cardVariants}
              whileHover="hover"
              className="relative w-full max-w-[300px] mb-8 md:max-w-[350px] h-[60vh] md:h-[650px] mx-auto border-[3px] md:border-[6px] border-black overflow-hidden bg-white shadow-lg md:shadow-xl z-10"
            >
              {/* Background with Image */}
              <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                <img
                  src="/themes/theme1.png"
                  alt="Background"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Content */}
              <div className="relative z-10 h-full flex flex-col">
                <div className="p-6 flex flex-col relative items-start bg-white/90 backdrop-blur-sm">
                  {/* Profile Info */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    className="flex items-center gap-3 mb-4"
                  >
                    <Avatar className="w-14 h-14 md:w-16 md:h-16 shadow-md">
                      <AvatarImage
                        src={userData.avatarUrl || "/icons/Profile Picture.png"}
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
                      <div className="flex items-center gap-1">
                        <h2 className="font-bold text-sm text-[#2C1C0D]">
                          {userData.name ||
                            userData.displayName ||
                            userData.username ||
                            "User"}
                        </h2>
                        <img
                          src="/icons/verification.svg"
                          alt="Verified"
                          width={14}
                          height={14}
                          className="inline-block"
                        />
                      </div>
                      <p className="text-xs md:text-[10px] text-[#5C4C3B]">
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
                    <p className="text-xs md:text-[11px] text-[#3A2B20] mb-2">
                      {userData.bio || "No bio added yet."}
                    </p>
                    {userData.location && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.7 }}
                        className="inline-flex items-center gap-1 px-3 py-1 border border-[#C8C0B5] text-[8px] text-[#5C4C3B] mb-2"
                      >
                        <FaMapMarkerAlt className="w-3 h-3" />
                        <span>{userData.location}</span>
                      </motion.div>
                    )}
                  </motion.div>

                  {/* Links indicator */}
                  <div className="mt-4 flex absolute bottom-0 flex-col items-center">
                    <span className="text-[11px]">Links</span>
                    <div className="h-[2px] w-6 bg-red-500 rounded" />
                  </div>
                </div>

                {/* Links/Buttons Section */}
                <div
                  className="flex-1 p-6 overflow-y-auto [&::-webkit-scrollbar]:hidden space-y-3 md:space-y-4"
                  style={{
                    scrollbarWidth: "none",
                    msOverflowStyle: "none",
                  }}
                >
                  {linksError ? (
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
                          a.displayOrder - b.displayOrder,
                      )
                      .map((link: UserLink, index: number) => (
                        <a
                          key={link.id}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full flex items-center gap-2 font-semibold px-4 py-2 relative hover:opacity-90 transition-opacity active:scale-[0.98] bg-white border border-black"
                        >
                          {getPlatformIcon(link.platform)}
                          <span className="truncate">{link.title}</span>
                        </a>
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
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Side — Completion Section */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col md:pl-20 justify-center items-center md:items-start text-center md:text-left max-w-md"
          >
            {/* Success Icon */}
            <motion.div
              variants={itemVariants}
              className="flex justify-center md:justify-start mb-6"
            >
              <motion.div
                variants={successIconVariants}
                className="relative"
              >
                <motion.div
                  animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.3, 0.1, 0.3],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute inset-0 rounded-full bg-[#FED45C]/20"
                  style={{ width: "100%", height: "100%" }}
                />
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-[#FED45C] to-[#FECB33] flex items-center justify-center shadow-lg">
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="md:w-10 md:h-10"
                  >
                    <motion.path
                      d="M20 6L9 17L4 12"
                      stroke="#331400"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      variants={checkmarkDrawVariants}
                      initial="hidden"
                      animate="visible"
                    />
                  </svg>
                </div>
              </motion.div>
            </motion.div>

            {/* Headline */}
            <motion.div variants={itemVariants} className="mb-3">
              <motion.h1 className="text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-[#331400] to-[#662800] bg-clip-text text-transparent">
                You're All Set!
              </motion.h1>
            </motion.div>

            {/* Support Message */}
            <motion.div variants={itemVariants} className="mb-4">
              <motion.p className="text-sm md:text-base text-[#666464] font-medium">
                Your profile is now live and ready to share with the world.
              </motion.p>
            </motion.div>

            {/* Completion Cards */}
            {/* <motion.div variants={itemVariants} className="space-y-3 mb-8 w-full">
              {completionSteps.map((step, index) => (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.08, duration: 0.4 }}
                >
                  <Card className="bg-white/80 backdrop-blur-sm border border-[#E0D5C8] shadow-sm hover:shadow-md transition-shadow duration-300 rounded-none">
                    <div className="flex items-center justify-between p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                          <CheckCircle2 className="w-4 h-4 text-green-600" />
                        </div>
                        <span className="text-sm font-medium text-[#331400]">
                          {step.title}
                        </span>
                      </div>
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.4 + index * 0.05, type: "spring" }}
                      >
                        <Sparkles className="w-3.5 h-3.5 text-[#FED45C]" />
                      </motion.div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </motion.div> */}

            {/* Link Input (Desktop) */}
            <motion.div variants={itemVariants} className="hidden md:flex items-center w-full border border-[#C8C0B5] overflow-hidden mb-6">
              <input
                readOnly
                value={profileLink}
                className="border-0 w-full text-[#4B2E1E] text-xs md:text-sm font-medium bg-transparent px-3 py-2 focus-visible:ring-0"
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

            {/* Buttons */}
            <motion.div variants={itemVariants} className="hidden md:flex w-full gap-4">
              <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                <Button
                  onClick={() => router.push("/dashboard")}
                  className="flex-1 bg-[#FED45C] hover:bg-[#f5ca4f] text-[#4B2E1E] font-semibold py-5 transition-colors rounded-none"
                >
                  Go to Dashboard
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </motion.div>
              <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                <Button
                  onClick={() => router.push("/settings/profile")}
                  className="flex-1 bg-[#331400] hover:bg-[#4B2E1E] text-[#FFE4A5] font-semibold py-5 transition-colors rounded-none"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              </motion.div>
            </motion.div>

            {/* Share Button Desktop */}
            <motion.div variants={itemVariants} className="hidden md:block w-full mt-3">
              <Button
                onClick={() => setShowShareBox(true)}
                variant="outline"
                className="w-full border-[#C8C0B5] text-[#4B2E1E] hover:bg-[#FFF1D0] rounded-none"
              >
                Share your Profile
              </Button>
            </motion.div>
          </motion.div>
        </div>

        {/* Mobile Bottom Buttons */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="fixed bottom-0 left-0 w-full flex md:hidden gap-3 p-4 z-20 bg-[#FFF4E8] border-t border-[#E0D5C8]"
        >
          <Button
            onClick={() => router.push("/dashboard")}
            className="flex-1 bg-[#FED45C] hover:bg-[#f5ca4f] text-[#4B2E1E] text-sm py-4 transition-colors rounded-none"
          >
            Dashboard
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
          <Button
            onClick={() => setShowShareBox(true)}
            className="flex-1 bg-[#331400] hover:bg-[#4B2E1E] text-[#FFE4A5] text-sm py-4 transition-colors rounded-none"
          >
            Share Profile
          </Button>
        </motion.div>

        {/* Share Modal */}
        <AnimatePresence>
          {showShareBox && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
              onClick={() => setShowShareBox(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="bg-white p-8 max-w-md w-full mx-4 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-black">
                      Share your Profile
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Abio is more effective when you connect with friends!
                    </p>
                  </div>
                  <button
                    onClick={() => setShowShareBox(false)}
                    className="text-gray-400 hover:text-gray-600 text-2xl"
                  >
                    ×
                  </button>
                </div>

                <div className="mb-8">
                  <p className="text-sm font-semibold text-black mb-3">
                    Your profile link
                  </p>
                  <div className="flex items-center bg-[#F6F7FB] rounded-lg px-4 py-3 border border-gray-200">
                    <input
                      readOnly
                      value={profileLink}
                      className="bg-transparent w-full text-sm text-gray-700 outline-none truncate"
                    />
                    <button
                      onClick={() => handleShare("copy")}
                      className="ml-3 text-[#331400] hover:text-[#4B2E1E] transition-colors"
                    >
                      <FaCopy className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-semibold text-black mb-4">
                    Share to platforms
                  </p>
                  <div className="grid grid-cols-4 gap-4">
                    {[
                      { platform: "whatsapp", icon: FaWhatsapp, color: "text-green-600", label: "WhatsApp" },
                      { platform: "twitter", icon: FaXTwitter, color: "text-black", label: "X" },
                      { platform: "facebook", icon: FaFacebook, color: "text-blue-600", label: "Facebook" },
                      { platform: "instagram", icon: FaInstagram, color: "text-pink-600", label: "Instagram" },
                      { platform: "pinterest", icon: FaPinterest, color: "text-red-600", label: "Pinterest" },
                      { platform: "tiktok", icon: FaTiktok, color: "text-black", label: "TikTok" },
                      { platform: "youtube", icon: FaYoutube, color: "text-red-600", label: "YouTube" },
                      { platform: "snapchat", icon: FaSnapchat, color: "text-yellow-500", label: "Snapchat" },
                    ].map(({ platform, icon: Icon, color, label }) => (
                      <motion.button
                        key={platform}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleShare(platform)}
                        className="flex flex-col items-center gap-3 p-4 rounded-xl hover:bg-gray-50 transition-colors"
                      >
                        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                          <Icon className={`w-6 h-6 ${color}`} />
                        </div>
                        <span className="text-xs font-medium text-gray-700">
                          {label}
                        </span>
                      </motion.button>
                    ))}
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-200">
                  <div className="flex gap-3">
                    <Button
                      onClick={() => {
                        handleShare("copy");
                        setShowShareBox(false);
                      }}
                      className="flex-1 bg-[#FED45C] hover:bg-[#f5ca4f] text-[#4B2E1E] font-semibold py-3 rounded-none"
                    >
                      Copy Link
                    </Button>
                    <Button
                      onClick={() => setShowShareBox(false)}
                      className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-3 rounded-none"
                    >
                      Close
                    </Button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </>
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