"use client";

import Image from "next/image";
import React from "react";
import { ButtonStyle } from "../app/dashboard/appearance/page";
import { FontStyle } from "./FontCustomizer";
import { ProfileLink } from "@/types/auth.types";
import { useAppSelector } from "@/stores/hooks";

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
  links?: ProfileLink[];
}

const PhoneDisplay: React.FC<PhoneDisplayProps> = ({
  buttonStyle,
  fontStyle,
  selectedTheme,
  profile,
  links = [],
}) => {
  const userDataProfile = useAppSelector((state) => state.auth.user);

  const textStyle = {
    fontFamily: fontStyle.fontFamily,
    color: fontStyle.fillColor,
    opacity: fontStyle.opacity / 100,
    WebkitTextStroke: `1px ${fontStyle.strokeColor}`,
  };

  // Platform icon mapping
  const getPlatformIcon = (platform: string) => {
    const platformLower = platform.toLowerCase();
    if (platformLower.includes("instagram")) return "/icons/Social.png";
    if (platformLower.includes("behance")) return "/icons/Social 2.png";
    if (platformLower.includes("snapchat")) return "/icons/Social 1.png";
    if (platformLower.includes("x") || platformLower.includes("twitter")) return "/icons/Social 3.png";
    if (platformLower.includes("linkedin")) return "/icons/linkedin.svg";
    if (platformLower.includes("facebook")) return "/icons/facebook.svg";
    if (platformLower.includes("youtube")) return "/icons/youtube.svg";
    if (platformLower.includes("tiktok")) return "/icons/tiktok.svg";
    if (platformLower.includes("github")) return "/icons/github.svg";
    return "/icons/link.png"; // Default icon
  };

  // Filter and sort links for display
  const displayLinks = links
    .filter(link => link.isVisible !== false)
    .sort((a, b) => a.displayOrder - b.displayOrder)
    .slice(0, 8); // Limit to 8 links for phone display

  // --- Background logic ---
  let bgStyle: React.CSSProperties = {};
  if (selectedTheme.startsWith("fill:")) {
    const color = selectedTheme.split(":")[1] || "#000";
    bgStyle = { backgroundColor: color };
  } else if (selectedTheme.startsWith("gradient:")) {
    const [, start, end] = selectedTheme.split(":");
    bgStyle = {
      backgroundImage: `linear-gradient(to bottom, ${start}, ${end})`,
    };
  }

  const isImage =
    selectedTheme.startsWith("blob:") || selectedTheme.startsWith("/themes/");

  return (
    <div className="relative w-[340px] h-[650px] mx-auto border-[6px] border-black overflow-hidden bg-white shadow-lg ">
      {/* Background */}
      {isImage ? (
        <Image
          src={selectedTheme}
          alt="Background"
          fill
          className="absolute top-0 left-0 w-full h-full object-cover pointer-events-none"
          priority
        />
      ) : (
        <div className="absolute inset-0 pointer-events-none" style={bgStyle} />
      )}

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col">
        {/* Profile Section */}
        <div className="p-6 flex flex-col items-start bg-white/90 backdrop-blur-sm">
          <div className="flex gap-3 items-center">
            <div className="w-[60px] h-[60px] rounded-full overflow-hidden shadow-md border border-gray-300">
              <Image
                src={profile?.profileImage || "/icons/Profile Picture.png"}
                alt="Profile"
                width={85}
                height={85}
                className="object-cover w-full h-full"
                priority
              />
            </div>
            <div className="flex-1 min-w-0">
              <h1 
                className="text-[16px] font-bold truncate"
                title={userDataProfile?.name || "Your Name"}
              >
                {userDataProfile?.name || "Your Name"}
              </h1>
              <p 
                className="text-[10px] mt-1 font-medium text-gray-600 truncate"
                title={`@${userDataProfile?.profile?.username?.toLowerCase().replace(/\s+/g, "") || "username"}`}
              >
                @{userDataProfile?.profile?.username?.toLowerCase().replace(/\s+/g, "") || "username"}
              </p>
            </div>
          </div>

          <p 
            className="mt-2 text-[12px] text-left font-semibold line-clamp-2"
            title={userDataProfile?.profile?.bio || "Add a short bio here..."}
          >
            {userDataProfile?.profile?.bio || "Add a short bio here..."}
          </p>

          <div className="mt-2 mb-2 flex items-center gap-1 px-2 py-1 border text-[10px] border-[#000] bg-white/70">
            <Image
              src="/icons/location1.png"
              alt="Location"
              width={10}
              height={10}
              className="flex-shrink-0"
            />
            <span 
              className="text-[10px]  font-medium truncate max-w-[180px]"
              title={userDataProfile?.profile?.location || "Add location"}
            >
              {userDataProfile?.profile?.location || "Add location"}
            </span>
          </div>

          {/* Links indicator */}
          <div className="mt-4 flex absolute bottom-0 flex-col items-center ">
            <Image src="/icons/link.png" alt="Links" width={16} height={16} />
            {/* <span className="text-[9px] font-medium text-gray-700">
               Links
            </span> */}
            <div className="h-[2px] w-6 bg-red-500 rounded " />
          </div>
        </div>

        {/* Links/Buttons Section */}
        <div className="flex-1 p-4 overflow-y-auto">
          {displayLinks.length > 0 ? (
            <div className="space-y-3">
              {displayLinks.map((link, index) => (
                <a
                  key={link.id || index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center gap-3 font-semibold px-4 py-3 relative overflow-hidden rounded-lg hover:opacity-90 transition-opacity active:scale-[0.98]"
                  style={{
                    borderRadius: buttonStyle.borderRadius,
                    border: `2px solid ${buttonStyle.borderColor}`,
                    boxShadow: buttonStyle.boxShadow,
                    textDecoration: 'none',
                  }}
                >
                  <span
                    className="absolute inset-0"
                    style={{
                      backgroundColor: buttonStyle.backgroundColor,
                      opacity: buttonStyle.opacity,
                    }}
                  ></span>

                  <span
                    className="relative flex items-center gap-3 text-sm"
                    style={textStyle}
                  >
                    <Image
                      src={getPlatformIcon(link.platform)}
                      alt=""
                      width={20}
                      height={20}
                      className="flex-shrink-0"
                    />
                    <span className="truncate">
                      {link.title || link.platform}
                    </span>
                  </span>
                </a>
              ))}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-4">
              <Image
                src="/icons/link.png"
                alt="No links"
                width={40}
                height={40}
                className="opacity-50 mb-2"
              />
              <p className="text-[12px] text-gray-500 font-medium">
                No links added yet
              </p>
              <p className="text-[10px] text-gray-400 mt-1">
                Add some links to see them here
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PhoneDisplay;