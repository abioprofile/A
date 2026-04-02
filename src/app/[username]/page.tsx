"use client";

import { useRef, useState, JSX, useEffect } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { FaMapMarkerAlt } from "react-icons/fa";
import { useUserProfileByUsername } from "@/hooks/api/useAuth";
import { normalizeWallpaperBackgroundColor } from "@/lib/helpers/appearance";
import { getPlatformIcon } from "@/components/PlatformIcon";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useAppSelector } from "@/stores/hooks";
import { motion, AnimatePresence } from "framer-motion";
import DnaFormV1 from "@/components/dnabygaza/form";
import MenuAccordion from "@/app/menu/page";
import {
  pageVariants,
  phoneContainerVariants,
  profileCardVariants,
  linkItemVariants,
  blurSideVariants,
} from "@/lib/animations";
import { QRCodeSVG } from "qrcode.react";

interface UserLink {
  id: string;
  title: string;
  url: string;
  platform: string;
  displayOrder: number;
  isVisible: boolean;
}

// ─── Helper: convert any hex/rgb color + separate opacity into a single rgba() ─
function applyOpacityToColor(color: string, opacity: number): string {
  const alpha = Math.max(0, Math.min(1, opacity));

  const rgbaMatch = color.match(
    /rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)/,
  );
  if (rgbaMatch) {
    return `rgba(${rgbaMatch[1]}, ${rgbaMatch[2]}, ${rgbaMatch[3]}, ${alpha})`;
  }

  let hex = color.replace("#", "");
  if (hex.length === 3)
    hex = hex
      .split("")
      .map((c) => c + c)
      .join("");
  if (hex.length === 6) {
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  return color;
}

const createTextStyle = (fontConfig: any, strokeWidth = 0) => {
  if (!fontConfig) return undefined;

  const baseStyle: React.CSSProperties = {
    fontFamily: fontConfig.name || "Poppins",
    color: fontConfig.fillColor ?? "#000000",
    opacity: fontConfig.opacity ? fontConfig.opacity / 100 : 1,
    fontStyle: fontConfig.fontStyle || "normal",
    fontWeight: fontConfig.fontWeight || "400",
    fontSize: fontConfig.fontSize ? `${fontConfig.fontSize}px` : undefined,
    textDecoration: fontConfig.textDecoration || "none",
  };

  if (
    strokeWidth > 0 &&
    fontConfig.strokeColor &&
    fontConfig.strokeColor !== "none" &&
    fontConfig.strokeColor !== "transparent"
  ) {
    const shadowSpread = Math.max(1, Math.round(strokeWidth));
    return {
      ...baseStyle,
      textShadow: `
        ${shadowSpread}px ${shadowSpread}px 0 ${fontConfig.strokeColor},
        -${shadowSpread}px ${shadowSpread}px 0 ${fontConfig.strokeColor},
        ${shadowSpread}px -${shadowSpread}px 0 ${fontConfig.strokeColor},
        -${shadowSpread}px -${shadowSpread}px 0 ${fontConfig.strokeColor},
        0 ${shadowSpread}px 0 ${fontConfig.strokeColor},
        0 -${shadowSpread}px 0 ${fontConfig.strokeColor},
        ${shadowSpread}px 0 0 ${fontConfig.strokeColor},
        -${shadowSpread}px 0 0 ${fontConfig.strokeColor}
      `,
    };
  }

  return baseStyle;
};

export default function PublicProfilePage() {
  const params = useParams();
  const username = params?.username as string;
  const usernameData = useAppSelector((state) => state.auth.user);
  const [activeTab, setActiveTab] = useState<"links" | "menu">("links");
  const [profileShareUrl, setProfileShareUrl] = useState("");

  useEffect(() => {
    if (typeof window === "undefined" || !username) return;
    setProfileShareUrl(`${window.location.origin}/${username}`);
  }, [username]);

  const {
    data: profileData,
    isLoading: profileLoading,
    isError: profileError,
    error: profileErrorData,
  } = useUserProfileByUsername(username);

  // ─── Derive display config early (before any early returns) ───────────────
  const profileDisplay = profileData?.data?.display;
  const fc = profileDisplay?.font_config;
  const fontName = (fc as { name?: string })?.name ?? null;

  // ✅ useEffect is now above all early returns — no hooks-order violation
  useEffect(() => {
    if (!fontName || typeof document === "undefined") return;
    const href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(fontName)}:wght@400;500;600;700&display=swap`;
    const id = "profile-font-link";
    let link = document.getElementById(id) as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement("link");
      link.id = id;
      link.rel = "stylesheet";
      document.head.appendChild(link);
    }
    if (link.getAttribute("href") !== href) link.href = href;
    return () => {
      const el = document.getElementById(id);
      if (el?.parentNode) el.parentNode.removeChild(el);
    };
  }, [fontName]);

  // ─── Early returns ─────────────────────────────────────────────────────────
  const profileLinks = profileData?.data?.links || [];

  const links: UserLink[] = profileLinks.map((link) => ({
    id: link.id,
    title: link.title,
    url: link.url,
    platform: link.platform,
    displayOrder: link.displayOrder,
    isVisible: link.isVisible,
  }));

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

  if (profileError || !profileData?.data) {
    const errorMessage =
      profileErrorData instanceof Error
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
            The profile you&apos;re looking for doesn&apos;t exist or is not
            available.
          </p>
        </div>
      </motion.div>
    );
  }

  // ─── Safe to access profileData.data past this point ──────────────────────
  const profile = profileData.data;
  const userData = {
    name: profile.user.name || undefined,
    username: profile.username || undefined,
    bio: profile.bio || undefined,
    location: profile.location || undefined,
    avatarUrl: profile.avatarUrl || undefined,
    links,
  };

  const cc = profileDisplay?.corner_config;
  const wc =
    profileDisplay?.wallpaper_config ??
    (
      profileDisplay as {
        wallpaperConfig?: typeof profileDisplay.wallpaper_config;
      }
    )?.wallpaperConfig;
  const selectedTheme =
    profileDisplay?.selected_theme ??
    (profileDisplay as { selectedTheme?: string | null })?.selectedTheme ??
    null;

  const fontStyle = fc
    ? createTextStyle(fc, (fc as { strokeWidth?: number }).strokeWidth || 0)
    : undefined;

  // ─── Build buttonStyle with opacity baked into backgroundColor ────────────
  const buttonStyle = cc
    ? (() => {
        const rawBg = cc.fillColor ?? "#ffffff";
        const opacity = cc.opacity ?? 1;
        const backgroundColorWithOpacity = applyOpacityToColor(rawBg, opacity);

        return {
          borderRadius:
            cc.type === "sharp"
              ? 0
              : cc.type === "round"
                ? "9999px"
                : cc.type === "pill"
                  ? "100px"
                  : "12px",
          backgroundColor: backgroundColorWithOpacity,
          boxShadow:
            cc.shadowSize === "hard"
              ? `4px 4px 0px 0px ${cc.shadowColor || "#000000"}`
              : cc.shadowColor
                ? `2px 2px 6px ${cc.shadowColor}80`
                : "none",
          border: `2px solid ${cc.strokeColor ?? "#000000"}`,
          borderColor: cc.strokeColor ?? "#000000",
        };
      })()
    : undefined;

  let backgroundStyle: React.CSSProperties = {};
  let backgroundImageSrc = "/themes/theme7.jpg";
  const isOotnUser = userData?.username === "ootn";
  const isDnaByGazaUser = userData?.username === "dnabygaza";

  const bgColors =
    normalizeWallpaperBackgroundColor(
      (wc as { backgroundColor?: unknown })?.backgroundColor,
    ) ?? [];

  if (!isOotnUser && !isDnaByGazaUser) {
    if (selectedTheme && typeof selectedTheme === "string") {
      if (selectedTheme.startsWith("fill:")) {
        const color = selectedTheme.split(":")[1] || "#000";
        backgroundStyle = { backgroundColor: color };
      } else if (selectedTheme.startsWith("gradient:")) {
        const [, start, end] = selectedTheme.split(":");
        backgroundStyle = {
          backgroundImage: `linear-gradient(to bottom, ${start ?? "#000"}, ${end ?? "#fff"})`,
        };
      } else {
        backgroundImageSrc = selectedTheme;
      }
    } else if (wc?.type == "fill" || wc?.type == "gradient") {
      const items = bgColors.map(
        (c: unknown) => c as { color: string; amount?: number },
      );
      if (items.length === 1) {
        backgroundStyle = { backgroundColor: items[0].color };
      } else {
        const direction =
          (wc as { direction?: string }).direction ?? "to bottom";
        const hasAmounts = items.some((c) => c.amount != null);
        if (hasAmounts) {
          const [start, end] = items;
          backgroundStyle = {
            background: `linear-gradient(${direction}, ${start.color} 0%, ${end.color} ${
              typeof end.amount === "number"
                ? end.amount <= 1
                  ? end.amount * 100
                  : end.amount
                : 100
            }%)`,
          };
        } else {
          backgroundStyle = {
            background: `linear-gradient(${direction}, ${items.map((c) => c.color).join(", ")})`,
          };
        }
      }
    } else if (wc?.type === "image") {
      const wcImage = wc as { imageUrl?: string; image?: { url?: string } };
      const imageUrl = wcImage.imageUrl ?? wcImage.image?.url;
      if (imageUrl) backgroundImageSrc = imageUrl;
    }
  }

  // ─── Shared link button style ──────────────────────────────────────────────
  const linkButtonStyle: React.CSSProperties = {
    borderRadius: buttonStyle?.borderRadius || "0px",
    border: `2px solid ${buttonStyle?.borderColor || cc?.strokeColor || "#000000"}`,
    boxShadow: buttonStyle?.boxShadow || "none",
    textDecoration: "none",
    color: fontStyle?.color || "#fff",
    fontFamily: fontStyle?.fontFamily,
    fontWeight: fontStyle?.fontWeight,
    fontStyle: fontStyle?.fontStyle,
    textShadow: fontStyle?.textShadow,
    backgroundColor: buttonStyle?.backgroundColor || "rgba(255,255,255,0.3)",
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
          <motion.div
            variants={blurSideVariants}
            initial="initial"
            animate="animate"
            className="fixed left-0 top-0 bottom-0 w-1/4 bg-gradient-to-r from-[#FEF4EA]/70 to-transparent backdrop-blur-[2px] z-10"
          />

          <motion.div
            variants={phoneContainerVariants}
            initial="initial"
            animate="animate"
            className="relative z-20 mx-auto w-[300px]"
          >
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="relative w-full h-[600px] border-[2px] border-black overflow-hidden bg-white shadow-2xl"
            >
              <div className="w-full h-full bg-white overflow-hidden relative flex flex-col">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="absolute inset-0"
                >
                  {isOotnUser ? null : Object.keys(backgroundStyle).length > 0 ? (
                    <div className="absolute inset-0" style={backgroundStyle} />
                  ) : (
                    <Image
                      src={backgroundImageSrc}
                      alt="background"
                      fill
                      className="object-cover"
                      priority
                    />
                  )}
                </motion.div>

                <motion.div
                  variants={profileCardVariants}
                  initial="initial"
                  animate="animate"
                  className="relative z-20 bg-white/90 p-4 backdrop-blur-xl"
                  style={{
                    backgroundColor: fc?.cardBgColor ? fc.cardBgColor : undefined,
                    opacity: fc?.cardOpacity ? fc.cardOpacity / 100 : undefined,
                  }}
                >
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 }}
                    className="flex items-center gap-3"
                  >
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
                          {(userData.name || userData.username || "U")
                            .charAt(0)
                            .toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7 }}
                    >
                      <div className="flex items-center ">
                          <p className="font-bold text-[14px]">
                        {isOotnUser
                          ? "one of those nights"
                          : userData?.name || userData?.username || "User"}
                        </p>
                          <Image
                            src="/icons/verification.svg"
                            alt="Verified"
                            width={18}
                            height={18}
                            className="inline-block ml-1"
                          />
                      </div>
                      
                      
                      <p className="text-[10px] text-gray-500">
                        /{userData.username || "username"}
                      </p>
                    </motion.div>
                  </motion.div>

                  {userData.bio && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      transition={{ delay: 0.8 }}
                      className="mt-2 text-[10px] text-left font-medium line-clamp-2"
                    >
                      {userData.bio}
                    </motion.p>
                  )}

                  {userData.location && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.9, type: "spring" }}
                      className="inline-flex items-center gap-1 mb-5 mt-2 border px-2 py-[2px] text-[10px] bg-white/70"
                    >
                      <FaMapMarkerAlt className="w-2 h-2" />
                      <span className="text-[7px] font-medium truncate max-w-[180px]">
                        {userData.location}
                      </span>
                    </motion.div>
                  )}

                  <div className="mt-4 flex absolute bottom-0 gap-8">
                    <button
                      onClick={() => setActiveTab("links")}
                      className="relative flex flex-col items-center pb-2 group"
                    >
                      <span
                        className={`text-[9px] -mb-2 font-medium transition-colors ${
                          activeTab === "links" ? "text-black" : "text-gray-400"
                        }`}
                      >
                        Links
                      </span>
                      {activeTab === "links" && (
                        <motion.div
                          layoutId="activeTabDesktop"
                          className="h-[3px] absolute -bottom-0.5 w-6 bg-red-500"
                        />
                      )}
                    </button>
                    {isDnaByGazaUser && (
                      <button
                        onClick={() => setActiveTab("menu")}
                        className="relative flex flex-col items-center pb-2 group"
                      >
                        <span
                          className={`text-[9px] font-medium transition-colors ${
                            activeTab === "menu" ? "text-black" : "text-gray-400"
                          }`}
                          style={activeTab === "menu" ? fontStyle : undefined}
                        >
                          Menu
                        </span>
                        {activeTab === "menu" && (
                          <motion.div
                            layoutId="activeTabDesktop"
                            className="h-[3px] absolute bottom-0 w-6 bg-red-500"
                          />
                        )}
                      </button>
                    )}
                  </div>
                </motion.div>

                <div
                  className="relative z-20 px-6 pt-4 pb-6 space-y-3 overflow-y-auto flex-1 min-h-0 [&::-webkit-scrollbar]:hidden"
                  style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                >
                  {activeTab === "links" ? (
                    <>
                      <AnimatePresence>
                        {links.length > 0 ? (
                          links
                            .filter((link: UserLink) => link.isVisible !== false)
                            .sort(
                              (a: UserLink, b: UserLink) =>
                                a.displayOrder - b.displayOrder,
                            )
                            .map((link: UserLink, index: number) => (
                              <motion.a
                                key={link.id}
                                variants={linkItemVariants}
                                whileHover="hover"
                                custom={index}
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full flex items-center gap-3 px-4 py-2 font-semibold text-sm backdrop-blur-md hover:translate-y-[2px] transition-all cursor-pointer"
                                style={linkButtonStyle}
                              >
                                <motion.span
                                  whileHover={{ rotate: 10 }}
                                  transition={{ type: "spring", stiffness: 300 }}
                                  style={{ color: fontStyle?.color }}
                                >
                                  {getPlatformIcon(link.platform, "w-4 h-4")}
                                </motion.span>
                                <span className="truncate" style={fontStyle}>
                                  {link.title}
                                </span>
                              </motion.a>
                            ))
                        ) : (
                          <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="text-xs text-gray-500 text-center py-4"
                            style={fontStyle}
                          >
                            No links added yet.
                          </motion.p>
                        )}
                      </AnimatePresence>
                      {isDnaByGazaUser && <DnaFormV1 />}
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

          <motion.div
            variants={blurSideVariants}
            initial="initial"
            animate="animate"
            className="fixed right-0 top-0 bottom-0 w-1/4 bg-gradient-to-l from-[#FEF4EA]/70 to-transparent backdrop-blur-[2px] z-10"
          />
        </div>

        {/* Mobile Layout */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="lg:hidden w-full min-h-screen bg-[#FEF4EA]"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0"
          >
            {isOotnUser ? (
              <>
                <Image
                  src="/themes/ootn.jpeg"
                  alt="background"
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-black/65" />
              </>
            ) : Object.keys(backgroundStyle).length > 0 ? (
              <div className="absolute inset-0" style={backgroundStyle} />
            ) : (
              <Image
                src={backgroundImageSrc}
                alt="background"
                fill
                className="object-cover"
                priority
              />
            )}
          </motion.div>

          <div className="relative z-10 w-full min-h-screen flex flex-col">
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="bg-white/90 p-4 backdrop-blur-xl"
              style={{
                backgroundColor: fc?.cardBgColor ? fc.cardBgColor : undefined,
                opacity: fc?.cardOpacity ? fc.cardOpacity / 100 : undefined,
              }}
            >
              <div className="flex items-center gap-3">
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
                      {(userData.name || userData.username || "U")
                        .charAt(0)
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="flex items-center">
                    
                  <p className="font-bold text-[14px]">
                    {isOotnUser
                      ? "one of those nights"
                      : userData?.name || userData?.username || "User"}
                    </p>
                    <Image
                      src="/icons/verification.svg"
                      alt="Verified"
                      width={18}
                      height={18}
                      className="inline-block ml-1"
                    />
                  </div>
                  <p className="text-[13px] text-gray-500">
                    /{userData.username || "username"}
                  </p>
                </motion.div>
              </div>

              {userData.bio && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  transition={{ delay: 0.5 }}
                  className="mt-2 text-[13px] text-left font-medium line-clamp-2"
                >
                  {userData.bio}
                </motion.p>
              )}

              {userData.location && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6, type: "spring" }}
                  className="inline-flex items-center gap-1 mt-3 border px-2 py-[2px] text-[10px] mb-6 bg-white/80"
                >
                  <FaMapMarkerAlt className="w-3 h-3" />
                  <span>{userData.location}</span>
                </motion.div>
              )}

              <div className="mt-4 flex absolute bottom-0 gap-8">
                <button
                  onClick={() => setActiveTab("links")}
                  className="relative flex flex-col items-center pb-2 group"
                >
                  <span
                    className={`text-[11px] -mb-2 font-medium transition-colors ${
                      activeTab === "links" ? "text-black" : "text-gray-400"
                    }`}
                  >
                    Links
                  </span>
                  {activeTab === "links" && (
                    <motion.div
                      layoutId="activeTabMobile"
                      className="h-[3px] absolute -bottom-0.5 w-6 bg-red-500"
                    />
                  )}
                </button>
                {isDnaByGazaUser && (
                  <button
                    onClick={() => setActiveTab("menu")}
                    className="relative flex flex-col items-center pb-2 group"
                  >
                    <span
                      className={`text-[11px] font-medium transition-colors ${
                        activeTab === "menu" ? "text-black" : "text-gray-400"
                      }`}
                      style={activeTab === "menu" ? fontStyle : undefined}
                    >
                      Menu
                    </span>
                    {activeTab === "menu" && (
                      <motion.div
                        layoutId="activeTabDesktop"
                        className="h-[3px] absolute bottom-0 w-6 bg-red-500"
                      />
                    )}
                  </button>
                )}
              </div>
            </motion.div>

            <div className="px-10 pt-6 pb-6 space-y-4 overflow-y-auto flex-1 min-h-0 [&::-webkit-scrollbar]:hidden">
              {activeTab === "links" ? (
                <>
                  <AnimatePresence>
                    {links.length > 0 ? (
                      links
                        .filter((link: UserLink) => link.isVisible !== false)
                        .sort(
                          (a: UserLink, b: UserLink) =>
                            a.displayOrder - b.displayOrder,
                        )
                        .map((link: UserLink, index: number) => (
                          <motion.a
                            key={link.id}
                            whileHover={{ scale: 1.03, y: -2 }}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full flex items-center gap-3 px-4 py-3 font-semibold text-sm backdrop-blur-md transition-all cursor-pointer"
                            style={linkButtonStyle}
                          >
                            <motion.span
                              whileHover={{ rotate: 10 }}
                              transition={{ type: "spring", stiffness: 300 }}
                              style={{ color: fontStyle?.color }}
                            >
                              {getPlatformIcon(link.platform, "w-4 h-4")}
                            </motion.span>
                            <span
                              className="truncate font-bold"
                              style={fontStyle}
                            >
                              {link.title}
                            </span>
                          </motion.a>
                        ))
                    ) : (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="text-xs text-gray-500 text-center py-4"
                        style={fontStyle}
                      >
                        No links added yet.
                      </motion.p>
                    )}
                  </AnimatePresence>
                  {isDnaByGazaUser && <DnaFormV1 />}
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

        <a
          href="/auth/sign-up"
          className="fixed bottom-4 left-1/2 z-[110] -translate-x-1/2  bg-white shadow-blur-md px-5 py-3 text-[12px] font-semibold text-black shadow-lg transition hover:bg-[#4a2207] md:text-sm"
          aria-label={`Join ${userData?.username || username} on Abio`}
        >
          Join {userData?.username || username} on Abio
        </a>

        {profileShareUrl ? (
          <a
            href={profileShareUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-4 right-4 z-[100] flex flex-col items-center gap-1 hidden md:block  border border-gray-200 bg-white p-2 shadow-lg transition-opacity hover:opacity-95"
            title={`Open profile: ${profileShareUrl}`}
            aria-label={`QR code linking to ${profileShareUrl}`}
          >
            <QRCodeSVG
              value={profileShareUrl}
              size={88}
              level="M"
              includeMargin={false}
              bgColor="#ffffff"
              fgColor="#000000"
            />
            <span className="max-w-[96px] truncate text-[9px] font-medium text-gray-600">
              Scan to open
            </span>
          </a>
        ) : null}
      </motion.div>
    </AnimatePresence>
  );
}