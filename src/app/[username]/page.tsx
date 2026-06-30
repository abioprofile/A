"use client";

import { useState, useEffect } from "react";
import { SkeletonPublicProfile } from "@/components/AppSkeletons";
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
import ClubSixSevenMenu from "@/components/clubsix7even/ClubSixSevenMenu";
import {
  hasStreamingLinks,
  getStreamingLinks,
  STREAMING_PLATFORM_IDS_SET,
} from "@/components/StreamingEmbed";
import {
  pageVariants,
  phoneContainerVariants,
  profileCardVariants,
  linkItemVariants,
  blurSideVariants,
} from "@/lib/animations";
import { QRCodeSVG } from "qrcode.react";
import ShareModal, { LinkShareButton } from "@/components/ShareModal";

//  Types

interface UserLink {
  id: string;
  title: string;
  url: string;
  platform: string;
  displayOrder: number;
  isVisible: boolean;
}

//  Helpers

function applyOpacityToColor(color: string, opacity: number): string {
  const alpha = Math.max(0, Math.min(1, opacity));
  const m = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)/);
  if (m) return `rgba(${m[1]}, ${m[2]}, ${m[3]}, ${alpha})`;
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

const createTextStyle = (
  fontConfig: any,
  strokeWidth = 0,
): React.CSSProperties | undefined => {
  if (!fontConfig) return undefined;
  const base: React.CSSProperties = {
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
    const s = Math.max(1, Math.round(strokeWidth));
    return {
      ...base,
      textShadow: `${s}px ${s}px 0 ${fontConfig.strokeColor},
        -${s}px ${s}px 0 ${fontConfig.strokeColor},
        ${s}px -${s}px 0 ${fontConfig.strokeColor},
        -${s}px -${s}px 0 ${fontConfig.strokeColor},
        0 ${s}px 0 ${fontConfig.strokeColor},
        0 -${s}px 0 ${fontConfig.strokeColor},
        ${s}px 0 0 ${fontConfig.strokeColor},
        -${s}px 0 0 ${fontConfig.strokeColor}`,
    };
  }
  return base;
};

//  Global share button (top-right)

function GlobalShareButton({ profileLink }: { profileLink: string }) {
  return (
    <ShareModal
      url={profileLink}
      title="My Abio profile"
      mode="profile"
      trigger={
        <motion.div
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          className="w-8 h-8 bg-black/30 backdrop-blur-sm flex items-center justify-center hover:bg-black/50 transition-colors cursor-pointer"
        >
          {/* Upload/share icon — matches Linktree's top-right icon exactly */}
          <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 text-white">
            <path
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.div>
      }
    />
  );
}

//  Main component

export default function PublicProfilePage() {
  const params = useParams();
  const username = params?.username as string;
  const [activeTab, setActiveTab] = useState<"links" | "listen" | "menu">(
    "links",
  );
  const [profileShareUrl, setProfileShareUrl] = useState("");
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [profileLink, setProfileLink] = useState("");

  useEffect(() => {
    if (typeof window === "undefined" || !username) return;
    setProfileShareUrl(`${window.location.origin}/${username}`);
    setProfileLink(`${window.location.origin}/${username}`);
  }, [username]);

  const {
    data: profileData,
    isLoading: profileLoading,
    isError: profileError,
    error: profileErrorData,
    refetch,
  } = useUserProfileByUsername(username);

  useEffect(() => {
    if (username) refetch();
  }, [username, refetch]);

  // Font loading — must be above early returns
  const profileDisplay = profileData?.data?.display;
  const fc = profileDisplay?.font_config;
  const fontName = (fc as { name?: string })?.name ?? null;

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

  //  Early returns

  if (profileLoading)
    return (
      <motion.div
        key="loading"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <SkeletonPublicProfile />
      </motion.div>
    );

  if (profileError || !profileData?.data) {
    const msg =
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
            {msg}
          </motion.p>
          <p className="text-gray-600 text-sm">
            The profile you&apos;re looking for doesn&apos;t exist or is not
            available.
          </p>
        </div>
      </motion.div>
    );
  }

  //  Data
  const profile = profileData.data;
  const links: UserLink[] = (profileData?.data?.links || []).map((l) => ({
    id: l.id,
    title: l.title,
    url: l.url,
    platform: l.platform,
    displayOrder: l.displayOrder,
    isVisible: l.isVisible,
  }));

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
  const buttonStyle = cc
    ? (() => {
        const backgroundColorWithOpacity = applyOpacityToColor(
          cc.fillColor ?? "#ffffff",
          cc.opacity ?? 1,
        );
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

  //  Background

  let backgroundStyle: React.CSSProperties = {};
  let contentBgStyle: React.CSSProperties = {};

  const isOotnUser = userData?.username === "ootn";
  const isDnaByGazaUser = userData?.username === "dnabygaza";
  const isClubSixSevenUser = userData?.username === "clubsix7even";
  const hasMenuTab = isDnaByGazaUser || isClubSixSevenUser;
  let backgroundImageSrc = isDnaByGazaUser ? "/themes/theme7.jpg" : "";

  const bgColors =
    normalizeWallpaperBackgroundColor(
      (wc as { backgroundColor?: unknown })?.backgroundColor,
    ) ?? [];

  if (!isOotnUser && !isDnaByGazaUser) {
    if (selectedTheme && typeof selectedTheme === "string") {
      if (selectedTheme.startsWith("fill:")) {
        backgroundStyle = {
          backgroundColor: selectedTheme.split(":")[1] || "#000",
        };
      } else if (selectedTheme.startsWith("gradient:")) {
        const [, start, end] = selectedTheme.split(":");
        backgroundStyle = {
          backgroundImage: `linear-gradient(to bottom, ${start ?? "#000"}, ${end ?? "#fff"})`,
        };
      } else {
        backgroundImageSrc = selectedTheme;
      }
    } else if (wc?.type === "fill" || wc?.type === "gradient") {
      const items = bgColors.map(
        (c: unknown) => c as { color: string; amount?: number },
      );
      if (items.length === 1) {
        backgroundStyle = { backgroundColor: items[0].color };
      } else {
        const dir = (wc as { direction?: string }).direction ?? "to bottom";
        const hasAmts = items.some((c) => c.amount != null);
        if (hasAmts) {
          const [start, end] = items;
          backgroundStyle = {
            background: `linear-gradient(${dir}, ${start.color} 0%, ${end.color} ${
              typeof end.amount === "number"
                ? end.amount <= 1
                  ? end.amount * 100
                  : end.amount
                : 100
            }%)`,
          };
        } else {
          backgroundStyle = {
            background: `linear-gradient(${dir}, ${items.map((c) => c.color).join(", ")})`,
          };
        }
      }
    } else if (wc?.type === "image") {
      const wcImg = wc as { imageUrl?: string; image?: { url?: string } };
      const imgUrl = wcImg.imageUrl ?? wcImg.image?.url;
      if (imgUrl) backgroundImageSrc = imgUrl;
    }
  }

  if (!isOotnUser) {
    contentBgStyle =
      Object.keys(backgroundStyle).length > 0
        ? backgroundStyle
        : backgroundImageSrc
          ? {
              backgroundImage: `url(${backgroundImageSrc})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              backgroundColor: "#000000",
            }
          : { backgroundColor: "#F2F2F2" };
  }

  //  Link button styles

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

  // Font color to pass down to the ⋮ so it always matches
  const dotColor = (fontStyle?.color as string) || "#ffffff";

  // ─── Renderers

  /**
   * ONE link row.
   * The ⋮ button is rendered INSIDE the flex row as the rightmost child —
   * visually inside the button's border, separated by a subtle divider.
   */
  const renderLinkRow = (link: UserLink, index: number, isMobile: boolean) => (
    <div key={link.id} className="group relative mb-3">
      <div
        className="w-full relative flex items-center justify-between overflow-hidden transition-all duration-150"
        style={linkButtonStyle}
      >
        {/* Left section with icon and text */}
        <a
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3  px-4 py-3 font-semibold text-sm cursor-pointer flex-1"
          style={{
            textDecoration: "none",
            color: linkButtonStyle.color,
            fontFamily: linkButtonStyle.fontFamily,
            fontWeight: linkButtonStyle.fontWeight,
            fontStyle: linkButtonStyle.fontStyle,
            textShadow: linkButtonStyle.textShadow,
          }}
          aria-label={link.title}
        >
          <span
            className="flex items-center justify-center flex-shrink-0"
            style={{ color: dotColor }}
          >
            {getPlatformIcon(link.platform, "w-4 h-4")}
          </span>
          <span className="truncate">{link.title}</span>
        </a>

        {/* More menu - extreme right */}
        <div className="flex-shrink-0 pr-3">
          <LinkShareButton
            url={link.url}
            title={link.title}
            fontColor={dotColor}
            isMobile={isMobile}
          />
        </div>
      </div>
    </div>
  );

  const renderStreamingRow = (
    link: UserLink,
    index: number,
    isMobile: boolean,
  ) => (
    <div key={link.id} className="group relative mb-3">
      <div
        className="w-full flex items-stretch overflow-hidden transition-all duration-150"
        style={linkButtonStyle}
      >
        <a
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center gap-3 px-4 py-2 font-semibold text-sm cursor-pointer"
          style={{
            textDecoration: "none",
            color: linkButtonStyle.color,
            fontFamily: linkButtonStyle.fontFamily,
            fontWeight: linkButtonStyle.fontWeight,
            fontStyle: linkButtonStyle.fontStyle,
            textShadow: linkButtonStyle.textShadow,
          }}
          aria-label={link.title}
        >
          <motion.span
            whileHover={{ rotate: 10 }}
            transition={{ type: "spring", stiffness: 300 }}
            style={{ color: dotColor }}
            aria-hidden="true"
          >
            {getPlatformIcon(link.platform, "w-4 h-4")}
          </motion.span>
          <span className="truncate">{link.title}</span>
        </a>
        <div
          className={[
            "w-px self-stretch my-2 flex-shrink-0 transition-opacity duration-150",
            isMobile ? "opacity-30" : "opacity-0 group-hover:opacity-30",
          ].join(" ")}
          style={{ backgroundColor: dotColor }}
          aria-hidden="true"
        />
        <LinkShareButton
          url={link.url}
          title={link.title}
          fontColor={dotColor}
          isMobile={isMobile}
        />
      </div>
    </div>
  );

  const renderLinks = (isMobile: boolean) => {
    const visible = links
      .filter(
        (l) =>
          l.isVisible !== false &&
          !STREAMING_PLATFORM_IDS_SET.has(
            l.platform.toLowerCase().replace(/\s+/g, "-"),
          ),
      )
      .sort((a, b) => a.displayOrder - b.displayOrder);
    if (visible.length === 0)
      return (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-xs text-gray-500 text-center py-4"
          style={fontStyle}
        >
          No links added yet.
        </motion.p>
      );
    return visible.map((l, i) => renderLinkRow(l, i, isMobile));
  };

  const renderStreamingLinks = (isMobile: boolean) => {
    const streaming = getStreamingLinks(links);
    if (streaming.length === 0)
      return (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-xs text-gray-500 text-center py-4"
          style={fontStyle}
        >
          No streaming links added yet.
        </motion.p>
      );
    return streaming.map((l, i) => renderStreamingRow(l, i, isMobile));
  };

  const renderTabContent = (isMobile: boolean) => (
    <>
      {activeTab === "links" && (
        <AnimatePresence>
          <div>
            {renderLinks(isMobile)}
            {isDnaByGazaUser && <DnaFormV1 />}
          </div>
        </AnimatePresence>
      )}
      {activeTab === "listen" && (
        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          transition={{ duration: 0.25 }}
          className="space-y-3"
        >
          {renderStreamingLinks(isMobile)}
        </motion.div>
      )}
      {activeTab === "menu" && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {isClubSixSevenUser ? <ClubSixSevenMenu /> : <MenuAccordion />}
        </motion.div>
      )}
    </>
  );

  const renderTabs = (layoutId: string) => (
    <div className="mt-4 flex absolute bottom-0 gap-8">
      {(
        [
          "links",
          ...(hasStreamingLinks(links) ? ["listen"] : []),
          ...(hasMenuTab ? ["menu"] : []),
        ] as const
      ).map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab as any)}
          className="relative flex flex-col items-center pb-2"
        >
          <span
            className={`text-[9px] -mb-1 font-medium transition-colors ${activeTab === tab ? "text-black" : "text-gray-400"}`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </span>
          {activeTab === tab && (
            <motion.div
              layoutId={layoutId}
              className="h-[3px] absolute -bottom-[1px] w-6 bg-red-500"
            />
          )}
        </button>
      ))}
    </div>
  );

  const renderProfileCard = (isMobile: boolean, layoutId: string) => (
    <div>
      {/* Global share — absolute top-right */}
      <div className="absolute top-6 right-4 z-30">
        {profileLink && <GlobalShareButton profileLink={profileLink} />}
      </div>

      <div className="flex items-center gap-3">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", delay: 0.3 }}
          className="cursor-pointer"
          onClick={() => setIsAvatarModalOpen(true)}
        >
          <Avatar
            className={
              isMobile ? "w-[70px] h-[70px] border" : "w-[60px] h-[60px] border"
            }
          >
            <AvatarImage
              src={userData.avatarUrl || "/icons/Profile Picture.png"}
              alt={userData.name || userData.username || "Profile"}
              className="object-cover cursor-pointer"
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
            <p className="font-bold text-sm">
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
          <p className="text-xs text-gray-500">
            /{userData.username || "username"}
          </p>
        </motion.div>
      </div>

      {userData.bio && (
        <motion.p
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          transition={{ delay: 0.5 }}
          className="mt-2 text-[10px] md:text-xs  text-left font-medium line-clamp-2"
        >
          {userData.bio}
        </motion.p>
      )}

      {userData.location && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, type: "spring" }}
          className="inline-flex items-center text-[9px] text-[#4e4e4e]  gap-1 mt-2 mb-4 border px-[2px] py-[2px] bg-white/80"
        >
          <Image
            src="/icons/location1.png"
            alt="Location"
            width={10}
            height={10}
            className="w-fit h-2 flex-shrink-0"
          />
          <span className="truncate max-w-[180px]">{userData.location}</span>
        </motion.div>
      )}

      {renderTabs(layoutId)}
    </div>
  );

  // ─── Render

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="profile"
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="h-screen bg-[#FEF4EA] overflow-hidden"
      >
        {/* ── Desktop */}
        <div className="hidden lg:flex items-center justify-center h-screen">
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
                  variants={profileCardVariants}
                  initial="initial"
                  animate="animate"
                  className="relative z-20 bg-white/90 h-[140px] p-4 backdrop-blur-xl flex-shrink-0"
                  style={{
                    backgroundColor: fc?.cardBgColor ?? undefined,
                    opacity: fc?.cardOpacity ? fc.cardOpacity / 100 : undefined,
                  }}
                >
                  {renderProfileCard(false, "activeTabDesktop")}
                </motion.div>

                <div
                  className="relative z-20 px-6 pt-4 pb-6 overflow-y-auto flex-1 min-h-0 [&::-webkit-scrollbar]:hidden"
                  style={{
                    ...contentBgStyle,
                    scrollbarWidth: "none",
                    msOverflowStyle: "none",
                  }}
                >
                  {renderTabContent(false)}
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

        {/* ── Mobile */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="lg:hidden w-full h-screen bg-[#FEF4EA]"
        >
          {isOotnUser && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="fixed inset-0"
            >
              <Image
                src="/themes/ootn.jpeg"
                alt="background"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-black/65" />
            </motion.div>
          )}

          <div className="relative z-10 w-full h-full flex flex-col overflow-hidden">
            {/* Sticky header */}
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="bg-white/90 h-[140px] p-4 backdrop-blur-xl relative sticky top-0 z-20"
              style={{
                backgroundColor: fc?.cardBgColor ?? undefined,
                opacity: fc?.cardOpacity ? fc.cardOpacity / 100 : undefined,
              }}
            >
              {renderProfileCard(true, "activeTabMobile")}
            </motion.div>

            <div
              className="overflow-y-auto flex-1 min-h-0 [&::-webkit-scrollbar]:hidden px-6 pt-4 pb-6"
              style={{
                ...contentBgStyle,
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
            >
              {renderTabContent(true)}
            </div>
          </div>
        </motion.div>

        {/* ── Avatar modal  */}
        <AnimatePresence>
          {isAvatarModalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[200] bg-black/90 flex items-center justify-center cursor-pointer"
              onClick={() => setIsAvatarModalOpen(false)}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ type: "spring", damping: 20, stiffness: 300 }}
                className="relative max-w-[90vw] max-h-[90vh]"
                onClick={(e) => e.stopPropagation()}
              >
                <img
                  src={userData.avatarUrl || "/icons/Profile Picture.png"}
                  alt={userData.name || userData.username || "Profile"}
                  className="w-auto h-auto max-w-[90vw] max-h-[90vh] object-contain"
                />
                <button
                  onClick={() => setIsAvatarModalOpen(false)}
                  className="absolute top-4 right-4 text-white bg-black/50 rounded-full p-2 hover:bg-black/70 transition-colors"
                  aria-label="Close preview"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 rounded-b-2xl">
                  <p className="text-white font-semibold text-center">
                    {isOotnUser
                      ? "one of those nights"
                      : userData?.name || userData?.username || "User"}
                  </p>
                  <p className="text-white/70 text-sm text-center">
                    {userData.username || "username"}
                  </p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Join CTA  */}
        <a
          href="/auth/sign-up"
          className="fixed bottom-4 left-1/2 z-[110] -translate-x-1/2 bg-white shadow-lg px-5 py-3 text-xs md:text-sm font-semibold text-black transition hover:bg-[#4a2207] hover:text-white"
          aria-label={`Join ${userData?.username || username} on Abio`}
        >
          Join {userData?.username || username} on Abio
        </a>

        {/* ── QR code */}
        {profileShareUrl && (
          <a
            href={profileShareUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-4 right-4 z-[100] flex-col items-center gap-1 hidden md:flex border border-gray-200 bg-white p-2 shadow-lg transition-opacity hover:opacity-95"
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
        )}
      </motion.div>
    </AnimatePresence>
  );
}
