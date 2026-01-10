"use client";

import Image from "next/image";
import React, { useState } from "react";
import { ButtonStyle } from "../app/dashboard/appearance/page";
import { FontStyle } from "./FontCustomizer";
import { ProfileLink, UserProfile } from "@/types/auth.types";
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
  links: ProfileLink[];
}

const PhoneDisplay: React.FC<PhoneDisplayProps> = ({
  buttonStyle,
  fontStyle,
  selectedTheme,
  profile,
  links,
}) => {
  const [buttons] = useState([
    { icon: "/icons/Social.png", label: "Instagram", active: true },
    { icon: "/icons/Social 2.png", label: "Behance", active: true },
    { icon: "/icons/Social 1.png", label: "Snapchat", active: true },
    { icon: "/icons/Social 3.png", label: "X", active: true },
  ]);

 const userDataProfile = useAppSelector((state) => state.auth.user);


  const textStyle = {
    fontFamily: fontStyle.fontFamily,
    color: fontStyle.fillColor,
    opacity: fontStyle.opacity / 100,
    WebkitTextStroke: `1px ${fontStyle.strokeColor}`,
  };

  // --- Background logic ---
  let bgStyle: React.CSSProperties = {};
  if (selectedTheme.startsWith("fill:")) {
    const color = selectedTheme.split(":")[1] || "#000";
    bgStyle = { backgroundColor: color };
  } else if (selectedTheme.startsWith("gradient:")) {
    const [, start, end] = selectedTheme.split(":");
    bgStyle = { backgroundImage: `linear-gradient(to bottom, ${start}, ${end})` };
  }

  const isImage = selectedTheme.startsWith("blob:") || selectedTheme.startsWith("/themes/");

  return (
    <div className="relative w-[310px] h-[550px]  mx-auto border-[6px] border-black overflow-hidden bg-white shadow-lg">
      {/* Background */}
      {isImage ? (
        <Image
          src={selectedTheme}
          alt="Background"
          fill
          className="absolute top-0 left-0 w-full h-full object-cover  pointer-events-none"
        />
      ) : (
        <div className="absolute inset-0 pointer-events-none" style={bgStyle} />
      )}

      {/* Content */}
      <div className="relative z-10">
        {/* Profile Section */}
       
<div className="p-6 flex flex-col h-[25%] items-start bg-white relative">
  <div className="flex gap-2 items-center">
    <div className="w-[60px] h-[60px] rounded-full overflow-hidden shadow-md border border-gray-300">
      <Image
        src={profile?.profileImage || "/icons/Profile Picture.png"}
        alt="Profile"
        width={60}
        height={60}
        className="object-cover"
      />
    </div>
    <div>
      <h1 className="text-[14px] font-bold" >
        {userDataProfile?.name || "Your Name"}
      </h1>
      <p className="text-[10px] font-thin" >
        @{userDataProfile?.profile?.username?.toLowerCase().replace(/\s+/g, '') || "username"}
      </p>
    </div>
  </div>

  <p className="mt-2 text-[10px] text-left font-medium" >
    {userDataProfile?.profile?.bio || "Add a short bio here..."}
  </p>

  <div className="mt-2 flex items-center gap-1 p-1 border text-[10px] border-gray-300">
    <Image src="/icons/location1.png" alt="Location" width={10} height={10} />
    <span className="text-[9px]" >
      {userDataProfile?.profile?.location || "Add location"}
    </span>
  </div>

  {/* Link + underline */}
  <div className="absolute bottom-0 left-6 flex items-center gap-1 pb-1">
    <Image src="/icons/link.png" alt="Links" width={20} height={20} />
    <div className="h-[2px] absolute -bottom-0 w-6 bg-red-500 rounded" />
  </div>
</div>

        {/* Buttons */}
        <div className="relative py-6 px-4 space-y-4 text-white">
          <div className="relative space-y-4 mb-10 z-10">
            {buttons
              .filter((b) => b.active)
              .map((btn, i) => (
                <button
                  key={i}
                  className="w-full flex items-center gap-3 font-semibold px-4 py-2 relative overflow-hidden"
                  style={{
                    borderRadius: buttonStyle.borderRadius,
                    border: `2px solid ${buttonStyle.borderColor}`,
                    boxShadow: buttonStyle.boxShadow,
                  }}
                >
                  <span
                    className="absolute inset-0"
                    style={{
                      backgroundColor: buttonStyle.backgroundColor,
                      opacity: buttonStyle.opacity,
                    }}
                  ></span>

                  <span className="relative flex items-center gap-3" style={textStyle}>
                    <Image src={btn.icon} alt={btn.label} width={20} height={20} />
                    {btn.label}
                  </span>
                </button>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhoneDisplay;







