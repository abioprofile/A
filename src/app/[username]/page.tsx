"use client";

import { JSX } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { FaInstagram, FaTiktok, FaPinterest, FaTwitter, FaCopy, FaWhatsapp, FaXTwitter, FaFacebook, FaSnapchat, FaYoutube } from "react-icons/fa6";
import { FaMapMarkerAlt } from "react-icons/fa";
import { useUserProfileByUsername } from "@/hooks/api/useAuth";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useAppSelector } from "@/stores/hooks";
import { motion, AnimatePresence, type Variants } from "framer-motion";

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

// Animation variants
const pageVariants: Variants = {
  initial: { opacity: 0 },
  animate: { 
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  },
  exit: { 
    opacity: 0,
    transition: {
      duration: 0.3,
      ease: "easeIn"
    }
  }
};

const phoneContainerVariants: Variants = {
  initial: { 
    scale: 0.9,
    opacity: 0,
    y: 20
  },
  animate: { 
    scale: 1,
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
      delay: 0.2
    }
  }
};

const profileCardVariants: Variants = {
  initial: { y: -30, opacity: 0 },
  animate: { 
    y: 0, 
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
      delay: 0.4
    }
  }
};

const linkItemVariants: Variants = {
  initial: { x: -20, opacity: 0 },
  animate: (i: number) => ({ 
    x: 0, 
    opacity: 1,
    transition: {
      delay: 0.5 + (i * 0.1),
      type: "spring",
      stiffness: 100,
      damping: 15
    }
  }),
  hover: {
    y: -2,
    scale: 1.02,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 15
    }
  }
};

const blurSideVariants: Variants = {
  initial: { opacity: 0 },
  animate: { 
    opacity: 1,
    transition: {
      duration: 0.8,
      delay: 0.3
    }
  }
};

export default function PublicProfilePage() {
  const params = useParams();
  const username = params?.username as string;
  const usernameData = useAppSelector((state) => state.auth.user)

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
      <motion.div
        key="loading"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="min-h-screen flex items-center justify-center bg-neutral-100"
      >
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="rounded-full h-12 w-12 border-b-2 border-[#331400] mx-auto mb-4"
          />
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-[#331400]"
          >
            Loading profile...
          </motion.p>
        </div>
      </motion.div>
    );
  }

  // Error state
  if (profileError || !profileData?.data) {
    const errorMessage = profileErrorData instanceof Error 
      ? profileErrorData.message 
      : "Profile not found";
    
    return (
      <motion.div
        key="error"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="min-h-screen flex items-center justify-center bg-neutral-100"
      >
        <div className="text-center max-w-md px-4">
          <motion.p
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-red-600 mb-4"
          >
            {errorMessage}
          </motion.p>
          <p className="text-gray-600 text-sm">
            The profile you&apos;re looking for doesn&apos;t exist or is not available.
          </p>
        </div>
      </motion.div>
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
    <AnimatePresence mode="wait">
      <motion.div
        key="profile"
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="min-h-screen bg-[#FEF4EA] overflow-hidden"
      >
        {/* Desktop Layout with Blurred Sides */}
        <div className="hidden lg:flex items-center justify-center min-h-screen">
          {/* Left Blurred Side */}
          <motion.div
            variants={blurSideVariants}
            initial="initial"
            animate="animate"
            className="fixed left-0 top-0 bottom-0 w-1/4 bg-gradient-to-r from-[#FEF4EA]/70 to-transparent backdrop-blur-[2px] z-10"
          />
          
          {/* Center Phone Container */}
          <motion.div
            variants={phoneContainerVariants}
            initial="initial"
            animate="animate"
            className="relative z-20 mx-auto"
          >
            {/* Phone Frame */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="relative w-[375px] h-[667px] mx-auto bg-black rounded-[45px] p-3 shadow-[0_0_40px_rgba(0,0,0,0.3)] overflow-hidden"
            >
              {/* Camera Cutout */}
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "100px" }}
                transition={{ delay: 0.8, duration: 0.3 }}
                className="absolute top-5 left-1/2 -translate-x-1/2 h-4 bg-black rounded-full z-10"
              />
              
              {/* Screen Content */}
              <div className="w-full h-full bg-white rounded-[38px] overflow-hidden relative">
                {/* Background Image inside phone */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="absolute inset-0"
                >
                  <Image
                    src="/themes/theme6.png"
                    alt="background"
                    fill
                    className="object-cover"
                    priority
                  />
                  {/* Overlay to ensure content is readable */}
                  <div className="absolute inset-0" />
                </motion.div>

                {/* ===== TOP PROFILE CARD ===== */}
                <motion.div
                  variants={profileCardVariants}
                  initial="initial"
                  animate="animate"
                  className="relative z-20 bg-white/95 p-5 backdrop-blur-sm"
                >
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 }}
                    className="flex items-center gap-3"
                  >
                    {/* Avatar */}
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      transition={{ type: "spring", stiffness: 400, damping: 15 }}
                    >
                      <Avatar className="w-[56px] h-[56px] border">
                        <AvatarImage
                          src={userData.avatarUrl || "/icons/Profile Picture.png"}
                          alt={userData.name || userData.username || "Profile"}
                          className="object-cover"
                        />
                        <AvatarFallback>
                          {(userData.name || userData.username || "U").charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </motion.div>

                    {/* Name */}
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7 }}
                    >
                      <p className="font-bold text-sm">{usernameData?.name || "User"}</p>
                      <p className="text-xs text-gray-500">@{userData.username || "username"}</p>
                    </motion.div>
                  </motion.div>

                  {/* Bio */}
                  {userData.bio && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      transition={{ delay: 0.8 }}
                      className="text-xs mt-3 overflow-hidden"
                    >
                      {userData.bio}
                    </motion.p>
                  )}

                  {/* Location */}
                  {userData.location && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.9, type: "spring" }}
                      className="inline-flex items-center gap-1 mb-5 mt-2 border px-2 py-[2px] text-[10px] bg-white/80"
                    >
                      <FaMapMarkerAlt className="w-3 h-3" />
                      {userData.location}
                    </motion.div>
                  )}

                  {/* Link indicator */}
                  {links.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1 }}
                      className="mt-3 flex items-center gap-2 absolute bottom-0"
                    >
                      <Image src="/icons/link.png" alt="link" width={18} height={18} />
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "24px" }}
                        transition={{ delay: 1.1, duration: 0.3 }}
                        className="absolute -bottom-1 left-0 h-[2px] bg-red-500"
                      />
                    </motion.div>
                  )}
                </motion.div>

                {/* ===== BUTTONS ===== */}
                <div className="relative z-20 px-4 pt-6 space-y-4">
                  <AnimatePresence>
                    {links.length > 0 ? (
                      links
                        .filter((link: UserLink) => link.isVisible !== false)
                        .sort((a: UserLink, b: UserLink) => a.displayOrder - b.displayOrder)
                        .map((link: UserLink, index: number) => (
                          <motion.a
                            key={link.id}
                            variants={linkItemVariants}
                            initial="initial"
                            animate="animate"
                            whileHover="hover"
                            custom={index}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full flex items-center gap-3 px-4 py-3 font-medium text-sm
                                       bg-white/70 border-2 border-black rounded-xl
                                       shadow-[0_5px_0_#fff/70] hover:shadow-[0_3px_0_#fff]
                                       transition-shadow cursor-pointer relative z-20"
                          >
                            <motion.span
                              whileHover={{ rotate: 10 }}
                              transition={{ type: "spring", stiffness: 300 }}
                            >
                              {getPlatformIcon(link.platform)}
                            </motion.span>
                            <span className="truncate">{link.title}</span>
                          </motion.a>
                        ))
                    ) : (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="text-xs text-gray-500 text-center py-4 relative z-20"
                      >
                        No links added yet.
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                {/* iPhone Home Indicator */}
                <motion.div
                  initial={{ opacity: 0, scaleX: 0 }}
                  animate={{ opacity: 1, scaleX: 1 }}
                  transition={{ delay: 1.2 }}
                  className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[134px] h-1 bg-gray-800 rounded-full z-20 transform origin-center"
                />
              </div>
            </motion.div>
          </motion.div>

          {/* Right Blurred Side */}
          <motion.div
            variants={blurSideVariants}
            initial="initial"
            animate="animate"
            className="fixed right-0 top-0 bottom-0 w-1/4 bg-gradient-to-l from-[#FEF4EA]/70 to-transparent backdrop-blur-[2px] z-10"
          />
        </div>

        {/* Mobile Layout - Full Screen View */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="lg:hidden w-full min-h-screen bg-[#FEF4EA]"
        >
          {/* Background Image for Mobile */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0"
          >
            <Image
              src="/themes/theme6.png"
              alt="background"
              fill
              className="object-cover"
              priority
            />
            {/* Overlay to ensure content is readable */}
            <div className="absolute inset-0" />
          </motion.div>

          {/* Mobile Content */}
          <div className="relative z-10 w-full min-h-screen">
            {/* ===== TOP PROFILE CARD ===== */}
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="bg-white/90 p-5 backdrop-blur-sm"
            >
              <div className="flex items-center gap-3">
                {/* Avatar */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.3 }}
                >
                  <Avatar className="w-[66px] h-[66px] border">
                    <AvatarImage
                      src={userData.avatarUrl || "/icons/Profile Picture.png"}
                      alt={userData.name || userData.username || "Profile"}
                      className="object-cover"
                    />
                    <AvatarFallback>
                      {(userData.name || userData.username || "U").charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </motion.div>

                {/* Name */}
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <p className="font-bold text-[16px] capitalize mb-1">{usernameData?.name || "User"}</p>
                  <p className="text-[14px]">@{userData.username || "username"}</p>
                </motion.div>
              </div>

              {/* Bio */}
              {userData.bio && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  transition={{ delay: 0.5 }}
                  className="text-[14px] capitalize font-medium mt-3 overflow-hidden"
                >
                  {userData.bio}
                </motion.p>
              )}

              {/* Location */}
              {userData.location && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6, type: "spring" }}
                  className="inline-flex items-center gap-1 mt-2 border px-2 py-[2px] text-[10px] mb-4 bg-white/80"
                >
                  <FaMapMarkerAlt className="w-3 h-3" />
                  {userData.location}
                </motion.div>
              )}

              {/* Link indicator */}
              {links.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  className="mt-3 flex items-center gap-2 absolute bottom-0"
                >
                  <Image src="/icons/link.png" alt="link" width={18} height={18} />
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "24px" }}
                    transition={{ delay: 0.8 }}
                    className="absolute -bottom-1 left-0 h-[4px] bg-red-500"
                  />
                </motion.div>
              )}
            </motion.div>

            {/* ===== BUTTONS ===== */}
            <div className="px-6 pt-6 pb-18 space-y-4">
              <AnimatePresence>
                {links.length > 0 ? (
                  links
                    .filter((link: UserLink) => link.isVisible !== false)
                    .sort((a: UserLink, b: UserLink) => a.displayOrder - b.displayOrder)
                    .map((link: UserLink, index: number) => (
                      <motion.a
                        key={link.id}
                        initial={{ x: -30, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.3 + (index * 0.1), type: "spring" }}
                        whileHover={{ scale: 1.03, y: -2 }}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full flex items-center gap-3 px-4 py-3 font-medium text-sm
                                   bg-white/70 border-2 border-black rounded-xl
                                   hover:translate-y-[2px]
                                   transition-all cursor-pointer"
                      >
                        <motion.span
                          whileHover={{ rotate: 10 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          {getPlatformIcon(link.platform)}
                        </motion.span>
                        <span className="truncate font-bold">{link.title}</span>
                      </motion.a>
                    ))
                ) : (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-xs text-gray-500 text-center py-4"
                  >
                    No links added yet.
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}