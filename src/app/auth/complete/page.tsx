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
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { useCurrentUser, useGetAllLinks } from "@/hooks/api/useAuth";
import { useAppSelector } from "@/stores/hooks";
import { User } from "@/types/auth.types";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { toast } from "sonner";
import Confetti from "react-confetti";
import { ArrowRight, Settings } from "lucide-react";
import PhoneDisplay from "@/components/PhoneDisplay";
import type { AppearanceTheme } from "@/types/appearance.types";
import type { ButtonStyle } from "@/types/appearance.types";
import type { FontStyle } from "@/components/FontCustomizer";
import {
  cornerConfigToButtonStyle,
  fontConfigToFontStyle,
  selectedThemeFromWallpaper,
  wallpaperConfigFromBackend,
} from "@/lib/helpers/appearance";
import type { WallpaperConfig as BackendWallpaperConfig } from "@/types/appearance.types";
import Link from "next/link";
import Image from "next/image";

// ── Default styles (same defaults as AppearancePage) ──────────────────────
const DEFAULT_BUTTON_STYLE: ButtonStyle = {
  borderRadius: "0px",
  backgroundColor: "transparent",
  borderColor: "transparent",
  opacity: 1,
  boxShadow: "2px 2px 6px rgba(0,0,0,0.2)",
};

const DEFAULT_FONT_STYLE: FontStyle = {
  fontFamily: "Poppins",
  fillColor: "#000000",
  strokeColor: "none",
  opacity: 100,
  fontWeight: "400",
  fontSize: 14,
  fontStyle: "normal",
  textDecoration: "none",
};

const DEFAULT_THEME = "/themes/theme1.png";

// ── Helper: convert raw AppearanceTheme → PhoneDisplay props ──────────────
function themeToDisplayProps(theme: AppearanceTheme): {
  buttonStyle: ButtonStyle;
  fontStyle: FontStyle;
  selectedTheme: string;
} {
  const buttonStyle = theme.corner_config
    ? cornerConfigToButtonStyle(theme.corner_config)
    : DEFAULT_BUTTON_STYLE;

  const fontStyle = theme.font_config
    ? fontConfigToFontStyle(theme.font_config)
    : DEFAULT_FONT_STYLE;

  const wp = wallpaperConfigFromBackend(
    theme.wallpaper_config as BackendWallpaperConfig,
  );
  const selectedTheme =
    selectedThemeFromWallpaper(
      theme.wallpaper_config as BackendWallpaperConfig,
    ) ?? DEFAULT_THEME;

  return { buttonStyle, fontStyle, selectedTheme };
}

export default function OnboardingCompletionPage() {
  const router = useRouter();
  const [showShareBox, setShowShareBox] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  // ── Pending template from localStorage ────────────────────────────────
  const [pendingTheme, setPendingTheme] = useState<AppearanceTheme | null>(null);
  const [templateDisplayProps, setTemplateDisplayProps] = useState<{
    buttonStyle: ButtonStyle;
    fontStyle: FontStyle;
    selectedTheme: string;
  }>({
    buttonStyle: DEFAULT_BUTTON_STYLE,
    fontStyle: DEFAULT_FONT_STYLE,
    selectedTheme: DEFAULT_THEME,
  });

  useEffect(() => {
    try {
      const raw = localStorage.getItem("pending_template");
      if (raw) {
        const theme: AppearanceTheme = JSON.parse(raw);
        setPendingTheme(theme);
        setTemplateDisplayProps(themeToDisplayProps(theme));
      }
    } catch {
      localStorage.removeItem("pending_template");
    }
  }, []);

  // ── User data ──────────────────────────────────────────────────────────
  const reduxUser = useAppSelector((state) => state.auth.user);
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

  const user: User | null = (currentUser as User) || reduxUser;
  const profile = user?.profile;

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

  const links = linksData
    ? Array.isArray(linksData)
      ? transformLinks(linksData)
      : transformLinks((linksData as { data?: unknown })?.data || linksData)
    : [];

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

  const getProfileLink = () => {
    if (typeof window === "undefined") return "/profile";
    const origin = window.location.origin;
    return userData.username
      ? `${origin}/${userData.username}`
      : `${origin}/profile`;
  };

  const profileLink = getProfileLink();

  // ── Confetti ───────────────────────────────────────────────────────────
  useEffect(() => {
    setShowConfetti(true);
    const updateWindowSize = () =>
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    updateWindowSize();
    window.addEventListener("resize", updateWindowSize);
    const t = setTimeout(() => setShowConfetti(false), 5000);
    return () => {
      window.removeEventListener("resize", updateWindowSize);
      clearTimeout(t);
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
      } catch {
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

  // ── Go to dashboard — clear pending template so appearance page picks it up ──
  const handleGoToDashboard = () => {
    // Keep pending_template in localStorage so AppearancePage can apply it on first load
    router.push("/dashboard");
  };

  // ── Animation variants 
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
      transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] },
    },
  };

  const successIconVariants = {
    hidden: { scale: 0, opacity: 0, rotate: -180 },
    visible: {
      scale: 1,
      opacity: 1,
      rotate: 0,
      transition: { type: "spring", stiffness: 300, damping: 20, duration: 0.6 },
    },
  };

  const checkmarkDrawVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] },
    },
  };

  const circleVariants: Variants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 1, ease: "easeOut", delay: 0.3 },
    },
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.7, ease: "easeOut" },
    },
    hover: {
      scale: 1.02,
      transition: { duration: 0.3, ease: "easeInOut" },
    },
  };

  const buttonVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] },
    },
    hover: { scale: 1.02, transition: { duration: 0.2, ease: "easeInOut" } },
    tap: { scale: 0.98, transition: { duration: 0.1 } },
  };

  //  Profile data for PhoneDisplay 
  const phoneProfile = {
    profileImage: userData.avatarUrl || "/icons/Profile Picture.png",
    displayName: userData.displayName || userData.name || "User",
    userName: userData.username || "username",
    bio: userData.bio || "",
    location: userData.location || "",
  };

  //  ProfileLink shape expected by PhoneDisplay 
  const phoneLinks = links.map((l) => ({
    id: l.id,
    title: l.title,
    url: l.url,
    platform: l.platform,
    displayOrder: l.displayOrder,
    isVisible: l.isVisible,
  }));

  // ── Loading 
  if (isLoading || linksLoading) {
    return (
      <>
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
      </>
    );
  }

  // ── Error 
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
    <main className=" bg-[#fef4ea]  pt-6 min-h-screen">
      {showConfetti && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={4000}
        />
      )}
       {/* Logo */}
                  <Link href="/" className="flex px-10 items-center gap-[1.5px] group">
                    <Image
                      src="/icons/A.bio.svg"
                      alt="A.Bio Logo"
                      width={24}
                      height={24}
                      priority
                      className="transition-transform group-hover:scale-105"
                    />
                    <span className="font-medium tracking-[0em] text-3xl text-end text-black tracking-wide">
                      bio
                    </span>
                  </Link>
      <div className="max-w-7xl  mx-auto px-6 pt-6">
        {/* HERO */}
        {/* <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center mb-2"
        >
          <motion.div variants={itemVariants}>
            <span className="inline-flex items-center  border border-green-200 bg-green-50 px-4 py-2 text-sm font-medium text-green-700">
               Profile Live
            </span>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="mt-6 text-5xl font-bold tracking-tight text-neutral-950"
          >
            Your profile is ready.
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="mt-3 text-lg text-neutral-500"
          >
            Share your page and start growing your audience.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="mt-8 flex justify-center"
          >
            <div className="flex items-center gap-2  border bg-white px-5 py-4 shadow-sm">
              <span className="text-sm text-neutral-500">
                {profileLink}
              </span>

              <button
                onClick={() => handleShare("copy")}
                className=" bg-black px-4 py-2 text-sm text-white"
              >
                Copy Link
              </button>
            </div>
          </motion.div>
        </motion.div> */}

        {/* MAIN GRID */}
        <div className="grid lg:grid-cols-[480px_1fr] gap-12 items-center">
          {/* PHONE */}
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
          >
            <div className=" p-8">
              <PhoneDisplay
                buttonStyle={templateDisplayProps.buttonStyle}
                fontStyle={templateDisplayProps.fontStyle}
                selectedTheme={templateDisplayProps.selectedTheme}
                profile={phoneProfile}
                links={phoneLinks as any}
                phoneDisplayLoading={false}
              />
            </div>
          </motion.div>

          {/* RIGHT SIDE */}
          <div className="space-y-8">
            {/* STATS */}
            {/* <div className="grid md:grid-cols-3 gap-4">
              <div className="border bg-white p-6">
                <p className="text-sm text-neutral-500">
                  Username
                </p>
                <p className="mt-2 font-semibold">
                  @{userData.username}
                </p>
              </div>

              <div className=" border bg-white p-6">
                <p className="text-sm text-neutral-500">
                  Template
                </p>
                <p className="mt-2 font-semibold">
                  {pendingTheme?.name || "Default"}
                </p>
              </div>

              <div className=" border bg-white p-6">
                <p className="text-sm text-neutral-500">
                  Links Added
                </p>
                <p className="mt-2 font-semibold">
                  {links.length}
                </p>
              </div>
            </div> */}

            {/* SHARE */}
            <div className=" border bg-white p-8">
              <h2 className="text-xl font-semibold">
                Share your profile
              </h2>

              <p className="mt-2 text-neutral-500">
                Let people discover your content.
              </p>

              <div className="grid grid-cols-4 gap-4 mt-8">
                {[
                  {
                    icon: FaWhatsapp,
                    platform: "whatsapp",
                  },
                  {
                    icon: FaXTwitter,
                    platform: "twitter",
                  },
                  {
                    icon: FaFacebook,
                    platform: "facebook",
                  },
                  {
                    icon: FaInstagram,
                    platform: "instagram",
                  },
                ].map(({ icon: Icon, platform }) => (
                  <button
                    key={platform}
                    onClick={() => handleShare(platform)}
                    className="
                      h-16
                      
                      border
                      flex
                      items-center
                      justify-center
                      hover:bg-neutral-50
                      transition
                    "
                  >
                    <Icon className="h-6 w-6" />
                  </button>
                ))}
              </div>
            </div>

            {/* ACTIONS */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={() =>
                  window.open(profileLink, "_blank")
                }
                className="
                  flex-1
                  h-14
              
                  bg-black
                  text-white
                "
              >
                Visit Profile
              </Button>

              <Button
                onClick={handleGoToDashboard}
                className="
                  flex-1
                  h-14
                  
                  bg-[#FED45C]
                  text-black
                "
              >
                Open Dashboard
              </Button>
            </div>

            {/* TIP */}
            {/* <div className=" border bg-gradient-to-r from-[#FED45C]/20 to-yellow-50 p-6">
              <h3 className="font-semibold">
                Next step
              </h3>

              <p className="mt-2 text-sm text-neutral-600">
                Add more links, customize your appearance,
                and start sharing your page everywhere.
              </p>
            </div> */}
          </div>
        </div>
      </div>
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