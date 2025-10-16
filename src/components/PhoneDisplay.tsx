'use client';

import Image from 'next/image';
import React, { useState } from 'react';
import { ButtonStyle } from '../app/dashboard/appearance/page';
import { FontStyle } from './FontCustomizer';

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
}

const PhoneDisplay: React.FC<PhoneDisplayProps> = ({ buttonStyle, fontStyle, selectedTheme, profile }) => {
  const [buttons] = useState([
    { icon: '/icons/Social.png', label: 'Instagram', active: true },
    { icon: '/icons/Social 2.png', label: 'Behance', active: true },
    { icon: '/icons/Social 1.png', label: 'Snapchat', active: true },
    { icon: '/icons/Social 3.png', label: 'X', active: true },
  ]);

  const textStyle = {
    fontFamily: fontStyle.fontFamily,
    color: fontStyle.fillColor,
    opacity: fontStyle.opacity / 100,
    WebkitTextStroke: `1px ${fontStyle.strokeColor}`,
  };

  return (
    <div className="relative w-[334px] h-[642px] mx-auto rounded-[36px] border-[6px] border-black overflow-hidden bg-white shadow-lg">
      {/* Theme background */}
      <Image
        src={selectedTheme}
        alt="Background"
        fill
        className="absolute top-0 left-0 w-full h-full object-cover opacity-80 pointer-events-none"
      />

      <div className="relative z-10">
        {/* Profile Section */}
        <div className="p-6 flex flex-col h-[25%] items-start bg-white backdrop-blur-md relative">
          <div className="flex gap-2 items-center">
            <Image
              src={profile?.profileImage || "/icons/profileplaceholder.png"}
              alt="Profile"
              width={60}
              height={60}
              className="rounded-full shadow-md object-cover"
            />
            <div>
              <h1 className="text-[14px] font-bold">{profile?.displayName || "Your Name"}</h1>
              <p className="text-[10px] font-thin">{profile?.userName || "@username"}</p>
            </div>
          </div>

          <p className="mt-2 text-[10px] text-left font-medium">
            {profile?.bio || "Add a short bio here..."}
          </p>

          <div className="mt-2 flex items-center gap-1 p-1 border text-[10px] text-gray-800 border-gray-300">
            <Image src="/icons/location1.png" alt="Location" width={10} height={10} />
            <span className="text-[9px]">{profile?.location || "Add location"}</span>
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
            {buttons.filter(b => b.active).map((btn, i) => (
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






