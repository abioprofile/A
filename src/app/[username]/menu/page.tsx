"use client";

  // Import useState
import { useRef, useState, JSX } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { FaInstagram, FaTiktok, FaPinterest, FaTwitter, FaCopy, FaWhatsapp, FaXTwitter, FaFacebook, FaSnapchat, FaYoutube } from "react-icons/fa6";
import { FaMapMarkerAlt } from "react-icons/fa";
import { useUserProfileByUsername } from "@/hooks/api/useAuth";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useAppSelector } from "@/stores/hooks";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import DnaFormV1 from "@/components/dnabygaza/form";
import MenuAccordion from "@/app/menu/page";

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
  const [activeTab, setActiveTab] = useState<"links" | "menu">("menu");

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
              className="relative w-full max-w-[285px] md:max-w-[300px] h-[67vh] md:h-[600px] mx-auto border-[2px]  border-black overflow-hidden bg-white shadow-2xl"
            >



              {/* Screen Content */}
              <div className="w-full h-full bg-white overflow-hidden relative flex flex-col">
                {/* Background Image inside phone */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="absolute inset-0"
                >
                  <Image
                    src="/themes/theme5.png"
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
                  className="relative z-20 bg-white/95 p-3 backdrop-blur-sm"
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
                      <p className="font-bold text-[14px]">{userData?.name || userData?.username || "User"}</p>
                      <p className="text-[10px] text-gray-500">@{userData.username || "username"}</p>
                    </motion.div>
                  </motion.div>

                  {/* Bio */}
                  {userData.bio && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      transition={{ delay: 0.8 }}
                      className="mt-2 text-[10px] text-left font-semibold line-clamp-2"
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
                      className="inline-flex items-center gap-1 mb-5 mt-2 border px-2 py-[2px] text-[10px] bg-white/70"
                    >
                      <FaMapMarkerAlt className="w-2 h-2" />
                      <span className="text-[7px] text-[#4e4e4e] font-medium truncate max-w-[180px]">
                        {userData.location}
                      </span>

                    </motion.div>
                  )}

                  {/* Tab Switcher */}
                  <div className="mt-4 flex absolute bottom-0 gap-8">
                    <button 
                      onClick={() => setActiveTab('links')}
                      className="relative flex flex-col items-center pb-2 group"
                    >
                      <span className={`text-[9px] font-medium transition-colors ${activeTab === 'links' ? 'text-black' : 'text-gray-400'}`}>
                        Links
                      </span>
                      {activeTab === 'links' && (
                        <motion.div 
                          layoutId="activeTabDesktop"
                          className="h-[3px] absolute bottom-0 w-6 bg-red-500" 
                        />
                      )}
                    </button>
                   {userData?.username === "dnabygaza" && <button 
                      onClick={() => setActiveTab('menu')}
                      className="relative flex flex-col items-center pb-2 group"
                    >
                      <span className={`text-[9px] font-medium transition-colors ${activeTab === 'menu' ? 'text-black' : 'text-gray-400'}`}>
                        Menu
                      </span>
                      {activeTab === 'menu' && (
                        <motion.div 
                          layoutId="activeTabDesktop"
                          className="h-[3px] absolute bottom-0 w-6 bg-red-500" 
                        />
                      )}
                    </button>}
                  </div>
                </motion.div>

                {/* ===== BUTTONS ===== */}
                <div className="relative z-20 px-6 pt-4 pb-6 space-y-3 overflow-y-auto flex-1 min-h-0 [&::-webkit-scrollbar]:hidden"
                  style={{
                    scrollbarWidth: "none",
                    msOverflowStyle: "none",
                  }}
                >
                  {activeTab === 'links' ? (
                    <>
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
                                className="w-full flex items-center gap-3 px-4 py-2 font-medium text-sm
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
                 {userData?.username === "dnabygaza" &&     <div>
                        <DnaFormV1 />
                      </div>}
                    </>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <MenuAccordion />
                    </motion.div>
                  )}
                </div>


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
              src="/themes/theme5.png"
              alt="background"
              fill
              className="object-cover"
              priority
            />
            {/* Overlay to ensure content is readable */}
            <div className="absolute inset-0" />
          </motion.div>

          {/* Mobile Content */}
          <div className="relative z-10 w-full min-h-screen flex flex-col">
            {/* ===== TOP PROFILE CARD ===== */}
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="bg-white/90 p-3 backdrop-blur-sm"
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
                  <p className="font-bold text-[14px] capitalize mb-1">{userData?.name || userData?.username || "User"}</p>
                  <p className="text-[10px] text-gray-500">@{userData.username || "username"}</p>
                </motion.div>
              </div>

              {/* Bio */}
              {userData.bio && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  transition={{ delay: 0.5 }}
                  className="mt-2 text-[10px] text-left font-semibold line-clamp-2"
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


              {/* Tab Switcher */}
              <div className="mt-4 flex absolute bottom-0 gap-8">
                <button 
                  onClick={() => setActiveTab('links')}
                  className="relative flex flex-col items-center pb-2 group"
                >
                  <span className={`text-[9px] font-medium transition-colors ${activeTab === 'links' ? 'text-black' : 'text-gray-400'}`}>
                    Links
                  </span>
                  {activeTab === 'links' && (
                    <motion.div 
                      layoutId="activeTabMobile"
                      className="h-[3px] absolute bottom-0 w-6 bg-red-500" 
                    />
                  )}
                </button>
                <button 
                  onClick={() => setActiveTab('menu')}
                  className="relative flex flex-col items-center pb-2 group"
                >
                  <span className={`text-[9px] font-medium transition-colors ${activeTab === 'menu' ? 'text-black' : 'text-gray-400'}`}>
                    Menu
                  </span>
                  {activeTab === 'menu' && (
                    <motion.div 
                      layoutId="activeTabMobile"
                      className="h-[3px] absolute bottom-0 w-6 bg-red-500" 
                    />
                  )}
                </button>
              </div>
            </motion.div>

            {/* ===== BUTTONS ===== */}
            <div className="px-6 pt-4 pb-6 space-y-3 overflow-y-auto flex-1 min-h-0 [&::-webkit-scrollbar]:hidden">
              {activeTab === 'links' ? (
                <>
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
                  <div>
                    <DnaFormV1 />
                  </div>
                </>
              ) : (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <MenuAccordion />
                </motion.div>
              )}
            </div>

          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}