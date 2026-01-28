"use client";

import React from "react";
import { ButtonStyle } from "../app/dashboard/appearance/page";
import { FontStyle } from "./FontCustomizer";
import { ProfileLink } from "@/types/auth.types";
import { useAppSelector } from "@/stores/hooks";
import Image from "next/image";

// Import Font Awesome icons
import {
  FaMapPin,
  FaInstagram,
  FaTiktok,
  FaPinterest,
  FaTwitter,
  FaLinkedinIn,
  FaBehance,
  FaLink,
  FaWhatsapp,
  FaXTwitter,
  FaFacebook,
  FaSnapchat,
  FaYoutube,
  FaGithub,
  FaSpotify,
  FaApple,
  FaGoogle,
  FaAmazon,
  FaFigma,
  FaDribbble,
  FaTelegram,
} from "react-icons/fa6";

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

  // Platform icon mapping with Font Awesome 6 - ALL IN BLACK AND WHITE
  const getPlatformIcon = (platform: string) => {
    const platformLower = platform.toLowerCase();

    if (platformLower.includes("instagram"))
      return <FaInstagram className="w-5 h-5 text-black" />;
    if (platformLower.includes("behance"))
      return <FaBehance className="w-5 h-5 text-black" />;
    if (platformLower.includes("snapchat"))
      return <FaSnapchat className="w-5 h-5 text-black" />;
    if (platformLower.includes("x") || platformLower.includes("twitter")) {
      if (platformLower.includes("x")) {
        return <FaXTwitter className="w-5 h-5 text-black" />;
      }
      return <FaTwitter className="w-5 h-5 text-black" />;
    }
    if (platformLower.includes("linkedin"))
      return <FaLinkedinIn className="w-5 h-5 text-black" />;
    if (platformLower.includes("facebook"))
      return <FaFacebook className="w-5 h-5 text-black" />;
    if (platformLower.includes("youtube"))
      return <FaYoutube className="w-5 h-5 text-black" />;
    if (platformLower.includes("tiktok"))
      return <FaTiktok className="w-5 h-5 text-black" />;
    if (platformLower.includes("github"))
      return <FaGithub className="w-5 h-5 text-black" />;
    if (platformLower.includes("whatsapp"))
      return <FaWhatsapp className="w-5 h-5 text-black" />;
    if (platformLower.includes("pinterest"))
      return <FaPinterest className="w-5 h-5 text-black" />;
    if (platformLower.includes("spotify"))
      return <FaSpotify className="w-5 h-5 text-black" />;
    if (platformLower.includes("apple"))
      return <FaApple className="w-5 h-5 text-black" />;
    if (platformLower.includes("google"))
      return <FaGoogle className="w-5 h-5 text-black" />;
    if (platformLower.includes("amazon"))
      return <FaAmazon className="w-5 h-5 text-black" />;
    if (platformLower.includes("figma"))
      return <FaFigma className="w-5 h-5 text-black" />;
    if (platformLower.includes("dribbble"))
      return <FaDribbble className="w-5 h-5 text-black" />;
    if (platformLower.includes("telegram"))
      return <FaTelegram className="w-5 h-5 text-black" />;

    // Default icon - Link icon in gray
    return <FaLink className="w-5 h-5 text-gray-500" />;
  };

  // Filter and sort links for display
  const displayLinks = links
    .filter((link) => link.isVisible !== false)
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
    <div className="relative w-full max-w-[285px] md:max-w-[300px] h-[67vh] md:h-[600px] mx-auto  border-[2px]  border-black overflow-hidden bg-white shadow-2xl">
      {/* Background */}
      {isImage ? (
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <img
            src={selectedTheme}
            alt="Background"
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <div className="absolute inset-0 pointer-events-none" style={bgStyle} />
      )}

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col">
        {/* Profile Section */}
        <div className="p-4  flex flex-col relative items-start bg-white">
          <div className="flex gap-3 items-center">
            <div className="w-[50px] h-[50px] rounded-full overflow-hidden shadow-md border border-gray-300">
              <img
                src={
                  userDataProfile?.profile?.avatarUrl ||
                  "/icons/Profile Picture.png"
                }
                alt="Profile"
                className="object-cover w-full h-full"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h1
                className="text-[14px] font-bold truncate"
                title={userDataProfile?.name || "Your Name"}
              >
                {userDataProfile?.name || "Your Name"}
              </h1>
              <p
                className="text-[10px] mt- font-medium text-gray-600 truncate"
                title={`@${
                  userDataProfile?.profile?.username
                    ?.toLowerCase()
                    .replace(/\s+/g, "") || "username"
                }`}
              >
                @
                {userDataProfile?.profile?.username
                  ?.toLowerCase()
                  .replace(/\s+/g, "") || "username"}
              </p>
            </div>
          </div>

          <p
            className="mt-2 text-[10px] text-left font-semibold line-clamp-2"
            title={userDataProfile?.profile?.bio || "Add a short bio here..."}
          >
            {userDataProfile?.profile?.bio || "Add a short bio here..."}
          </p>

          <div className="mt-2 mb-2 flex items-center  p-[2px] border text-[10px] border-[#4e4e4e] bg-white/70">
            <div className="flex-shrink-0">
              {/* Location icon from Font Awesome */}
              <Image
                src="/icons/location1.png"
                alt="Location"
                width={10}
                height={10}
                className="w-fit h-2"
              />
            </div>
            <span
              className="text-[7px] text-[#4e4e4e] font-medium truncate max-w-[180px]"
              title={userDataProfile?.profile?.location || "Add location"}
            >
              {userDataProfile?.profile?.location || "Add location"}
            </span>
          </div>

          {/* Links indicator */}
          <div className="mt-4 flex absolute bottom-0 flex-col items-center ">
            <span className="text-[9px] font-medium">Links</span>
            <div className="h-[3px] absolute -bottom-[2px] w-6 bg-red-500  " />
          </div>
        </div>

        {/* Links/Buttons Section - Fixed with proper scrolling */}
        <div
          className="flex-1 py-4 px-6 overflow-y-auto [&::-webkit-scrollbar]:hidden"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {displayLinks.length > 0 ? (
            <div
              className="space-y-3 max-h-full  pb-2 [&::-webkit-scrollbar]:hidden"
              style={{
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
            >
              {displayLinks.map((link, index) => (
                <a
                  key={link.id || index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center gap-3 font-semibold px-4 py-2  relative overflow-hidden rounded-lg hover:opacity-90 transition-opacity active:scale-[0.98] break-words"
                  style={{
                    borderRadius: buttonStyle.borderRadius,
                    border: `2px solid ${buttonStyle.borderColor}`,
                    boxShadow: buttonStyle.boxShadow,
                    textDecoration: "none",
                    minHeight: "30px",
                  }}
                >
                  <span
                    className="absolute  inset-0 "
                    style={{
                      backgroundColor: buttonStyle.backgroundColor,
                      opacity: buttonStyle.opacity,
                    }}
                  ></span>

                  <span
                    className="relative flex items-center gap-3 text-sm w-full"
                    style={textStyle}
                  >
                    <div className="flex-shrink-0 flex items-center justify-center w-4 h-4">
                      {getPlatformIcon(link.platform)}
                    </div>
                    <span className="truncate overflow-ellipsis break-words max-w-[calc(100%-2rem)]">
                      {link.title || link.platform}
                    </span>
                  </span>
                </a>
              ))}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-4">
              <FaLink className="w-8 h-8 text-gray-400 mb-2" />
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
