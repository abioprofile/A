"use client";

import React from "react";
import { ButtonStyle } from "../app/dashboard/appearance/page";
import { FontStyle } from "./FontCustomizer";
import { ProfileLink } from "@/types/auth.types";
import { useAppSelector } from "@/stores/hooks";
import Image from "next/image";

import { FaLink } from "react-icons/fa6";
import { getPlatformIcon } from "./PlatformIcon";

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

  // Create text style based on fontStyle properties
  const createTextStyle = (strokeWidth = 0) => {
    // Base text style
    const baseStyle: React.CSSProperties = {
      fontFamily: fontStyle.fontFamily,
      color: fontStyle.fillColor,
      opacity: fontStyle.opacity / 100,
      fontStyle: fontStyle.fontStyle || "normal",
      fontWeight: fontStyle.fontWeight || "400",
      textDecoration: fontStyle.textDecoration || "none",
    };

    // Only apply stroke if strokeWidth > 0 and strokeColor is set
    if (
      strokeWidth > 0 &&
      fontStyle.strokeColor &&
      fontStyle.strokeColor !== "transparent"
    ) {
      // Use text-shadow for smoother stroke rendering
      const shadowSpread = Math.max(1, Math.round(strokeWidth));
      return {
        ...baseStyle,
        textShadow: `
          ${shadowSpread}px ${shadowSpread}px 0 ${fontStyle.strokeColor},
          -${shadowSpread}px ${shadowSpread}px 0 ${fontStyle.strokeColor},
          ${shadowSpread}px -${shadowSpread}px 0 ${fontStyle.strokeColor},
          -${shadowSpread}px -${shadowSpread}px 0 ${fontStyle.strokeColor},
          0 ${shadowSpread}px 0 ${fontStyle.strokeColor},
          0 -${shadowSpread}px 0 ${fontStyle.strokeColor},
          ${shadowSpread}px 0 0 ${fontStyle.strokeColor},
          -${shadowSpread}px 0 0 ${fontStyle.strokeColor}
        `,
      };
    }

    return baseStyle;
  };

  // Filter and sort links for display
  const displayLinks = links
    .filter((link) => link.isVisible !== false)
    .sort((a, b) => a.displayOrder - b.displayOrder)
    .slice(0, 8); // Limit to 8 links for phone display

  // --- Background logic ---
  let bgStyle: React.CSSProperties = {
    background: selectedTheme,
  };
  // if (selectedTheme.type == "fill") {
  //   bgStyle.background = selectedTheme.value;
  // }
  // if (selectedTheme.type == "gradient")

  return (
    <div className="relative w-full max-w-[285px] md:max-w-[300px] h-[67vh] md:h-[600px] mx-auto  border-[2px]  border-black overflow-hidden bg-white ">
      <div className="absolute inset-0 pointer-events-none" style={bgStyle} />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col">
        {/* Profile Section */}
        <div className="p-4  flex flex-col relative items-start bg-white/90 backdrop-blur-xl">
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
        {!phoneDisplayLoading ? (
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
                    className="w-full flex items-center gap-3 font-semibold px-4 py-2  relative overflow-hidden rounded-lg  transition-opacity active:scale-[0.98] break-words"
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
                      className="relative flex items-center gap-3 text-sm font-semibold w-full"
                      style={createTextStyle(fontStyle.strokeWidth || 0)}
                    >
                      <div style={{ color: fontStyle.fillColor }}>
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
                <p
                  className="text-[12px] text-gray-500 font-medium"
                  style={createTextStyle()}
                >
                  No links added yet
                </p>
                <p
                  className="text-[10px] text-gray-400 mt-1"
                  style={createTextStyle()}
                >
                  Add some links to see them here
                </p>
              </div>
            )}
          </div> //
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#331400] mx-auto mb-4"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PhoneDisplay;
