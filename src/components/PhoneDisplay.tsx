"use client";

import React, { useState } from "react";
import { ButtonStyle } from "../app/dashboard/appearance/page";
import { FontStyle } from "./FontCustomizer";
import { ProfileLink } from "@/types/auth.types";
import { useAppSelector } from "@/stores/hooks";
import Image from "next/image";
import { motion } from "framer-motion";

import { FaLink, FaHeadphones } from "react-icons/fa6";
import { getPlatformIcon } from "./PlatformIcon";
import { STREAMING_PLATFORM_IDS_SET, getStreamingLinks, hasStreamingLinks } from "./StreamingEmbed";

interface PhoneDisplayProps {
  buttonStyle: ButtonStyle;
  fontStyle: FontStyle;
  selectedTheme: string;
  profile: {
    profileImage?: string;
    displayName?: string;
    userName?: string;
    bio?: string;
    location?: string;
  };
  phoneDisplayLoading: boolean;
  links?: ProfileLink[];
}

const PhoneDisplay: React.FC<PhoneDisplayProps> = ({
  buttonStyle,
  fontStyle,
  selectedTheme,
  profile,
  phoneDisplayLoading,
  links = [],
}) => {
  const userDataProfile = useAppSelector((state) => state.auth.user);
  const [activeTab, setActiveTab] = useState<"links" | "listen">("links");

  const showListenTab = hasStreamingLinks(links);

  const displayName = profile?.displayName ?? userDataProfile?.name ?? "Your Name";
  const userName = profile?.userName ?? userDataProfile?.profile?.username ?? "username";
  const profileImage = profile?.profileImage ?? userDataProfile?.profile?.avatarUrl ?? "/icons/Profile Picture.png";
  const bio = profile?.bio ?? userDataProfile?.profile?.bio ?? "Add a short bio here...";
  const location = profile?.location ?? userDataProfile?.profile?.location ?? "Add location";

  const createTextStyle = (strokeWidth = 0): React.CSSProperties => {
    const base: React.CSSProperties = {
      fontFamily: fontStyle.fontFamily,
      color: fontStyle.fillColor,
      opacity: fontStyle.opacity / 100,
      fontStyle: fontStyle.fontStyle || "normal",
      fontWeight: fontStyle.fontWeight || "400",
      fontSize: fontStyle.fontSize ? `${fontStyle.fontSize}px` : undefined,
      textDecoration: fontStyle.textDecoration || "none",
    };
    if (strokeWidth > 0 && fontStyle.strokeColor && fontStyle.strokeColor !== "transparent") {
      const s = Math.max(1, Math.round(strokeWidth));
      return {
        ...base,
        textShadow: `${s}px ${s}px 0 ${fontStyle.strokeColor},-${s}px ${s}px 0 ${fontStyle.strokeColor},${s}px -${s}px 0 ${fontStyle.strokeColor},-${s}px -${s}px 0 ${fontStyle.strokeColor},0 ${s}px 0 ${fontStyle.strokeColor},0 -${s}px 0 ${fontStyle.strokeColor},${s}px 0 0 ${fontStyle.strokeColor},-${s}px 0 0 ${fontStyle.strokeColor}`,
      };
    }
    return base;
  };

  // Social links only (no streaming)
  const socialLinks = links
    .filter(
      (l) =>
        l.isVisible !== false &&
        !STREAMING_PLATFORM_IDS_SET.has(l.platform.toLowerCase().replace(/\s+/g, "-")),
    )
    .sort((a, b) => a.displayOrder - b.displayOrder)
    .slice(0, 8);

  // Streaming links
  const streamingLinks = getStreamingLinks(links).slice(0, 8);

  // Background (same for both tabs)
  let bgStyle: React.CSSProperties = {};
  if (selectedTheme.startsWith("fill:")) {
    bgStyle = { backgroundColor: selectedTheme.split(":")[1] || "#000" };
  } else if (selectedTheme.startsWith("gradient:")) {
    const [, start, end] = selectedTheme.split(":");
    bgStyle = { backgroundImage: `linear-gradient(to bottom, ${start ?? "#000"}, ${end ?? "#fff"})` };
  } else if (selectedTheme && (selectedTheme.startsWith("blob:") || selectedTheme.startsWith("http") || selectedTheme.startsWith("/"))) {
    bgStyle = { backgroundImage: `url(${selectedTheme})`, backgroundSize: "100% 100%", backgroundPosition: "center", backgroundRepeat: "no-repeat", backgroundColor: "#000000" };
  }

  const renderButtonStack = (items: ProfileLink[]) =>
    items.map((link, index) => (
      <a
        key={link.id || index}
        href={link.url}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full flex items-center gap-3 font-semibold px-4 py-2 relative overflow-hidden transition-opacity active:scale-[0.98]"
        style={{
          borderRadius: buttonStyle.borderRadius,
          border: `2px solid ${buttonStyle.borderColor}`,
          boxShadow: buttonStyle.boxShadow,
          textDecoration: "none",
          minHeight: "30px",
        }}
      >
        <span className="absolute inset-0" style={{ backgroundColor: buttonStyle.backgroundColor, opacity: buttonStyle.opacity }} />
        <span className="relative flex items-center gap-3 text-sm font-semibold w-full" style={createTextStyle(fontStyle.strokeWidth || 0)}>
          <div style={{ color: fontStyle.fillColor }}>{getPlatformIcon(link.platform)}</div>
          <span className="truncate break-words max-w-[calc(100%-2rem)]">{link.title || link.platform}</span>
        </span>
      </a>
    ));

  return (
    <div className="relative w-full max-w-[285px] md:max-w-[300px] h-[67vh] md:h-[600px] mx-auto border-[2px] border-black overflow-hidden bg-white">
      <div className="relative z-10 h-full flex flex-col">

        {/* Profile Section */}
        <div className="p-4 flex flex-col relative items-start bg-white/90 backdrop-blur-xl">
          <div className="flex gap-3 items-center">
            <div className="w-[50px] h-[50px] rounded-full overflow-hidden shadow-md border border-gray-300">
              <img src={profileImage} alt="Profile" className="object-cover w-full h-full" />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-[14px] font-bold truncate" title={displayName}>{displayName}</h1>
              <p className="text-[10px] font-medium text-gray-600 truncate">
                @{String(userName).toLowerCase().replace(/\s+/g, "")}
              </p>
            </div>
          </div>

          <p className="mt-2 text-[10px] text-left font-semibold line-clamp-2" title={bio}>{bio}</p>

          <div className="mt-2 mb-2 flex items-center p-[2px] border text-[10px] border-[#4e4e4e] bg-white/70">
            <Image src="/icons/location1.png" alt="Location" width={10} height={10} className="w-fit h-2 flex-shrink-0" />
            <span className="text-[7px] text-[#4e4e4e] font-medium truncate max-w-[180px]">{location}</span>
          </div>

          {/* Tabs */}
          <div className="mt-4 flex absolute bottom-0 gap-6">
            <button onClick={() => setActiveTab("links")} className="relative flex flex-col items-center pb-2">
              <span className={`text-[9px] -mb-2 font-medium transition-colors ${activeTab === "links" ? "text-black" : "text-gray-400"}`}>
                Links
              </span>
              {activeTab === "links" && (
                <motion.div layoutId="phoneTab" className="h-[3px] absolute -bottom-[2px] w-6 bg-red-500" />
              )}
            </button>
            {showListenTab && (
              <button onClick={() => setActiveTab("listen")} className="relative flex flex-col items-center pb-2">
                <span className={`text-[9px] -mb-2 font-medium transition-colors ${activeTab === "listen" ? "text-black" : "text-gray-400"}`}>
                  Listen
                </span>
                {activeTab === "listen" && (
                  <motion.div layoutId="phoneTab" className="h-[3px] absolute -bottom-[2px] w-6 bg-red-500" />
                )}
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        {!phoneDisplayLoading ? (
          <div
            className="flex-1 py-4 px-6 overflow-y-auto [&::-webkit-scrollbar]:hidden"
            style={{ ...bgStyle, scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {activeTab === "links" && (
              socialLinks.length > 0 ? (
                <div className="space-y-3">{renderButtonStack(socialLinks)}</div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-4">
                  <FaLink className="w-8 h-8 text-gray-400 mb-2" />
                  <p className="text-[12px] text-gray-500 font-medium" style={createTextStyle()}>No links added yet</p>
                  <p className="text-[10px] text-gray-400 mt-1" style={createTextStyle()}>Add some links to see them here</p>
                </div>
              )
            )}
            {activeTab === "listen" && (
              streamingLinks.length > 0 ? (
                <div className="space-y-3">{renderButtonStack(streamingLinks)}</div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-4">
                  <FaHeadphones className="w-8 h-8 text-gray-400 mb-2" />
                  <p className="text-[12px] text-gray-500 font-medium" style={createTextStyle()}>No streaming links yet</p>
                  <p className="text-[10px] text-gray-400 mt-1" style={createTextStyle()}>Add Spotify, Apple Music &amp; more</p>
                </div>
              )
            )}
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#331400] mx-auto mb-4" />
          </div>
        )}
      </div>
    </div>
  );
};

export default PhoneDisplay;
