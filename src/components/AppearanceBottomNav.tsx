"use client";

import React from "react";
import { 
  FaUser, 
  FaPalette, 
  FaPuzzlePiece, 
  FaImage 
} from "react-icons/fa6";

interface AppearanceBottomNavProps {
  activeTab: number;
  setActiveTab: (index: number) => void;
}

const menuItems = [
  { label: "Profile", icon: FaUser },
  { label: "Style", icon: FaPalette },
  { label: "Theme", icon: FaPuzzlePiece },
  { label: "Wallpaper", icon: FaImage },
];

const AppearanceBottomNav: React.FC<AppearanceBottomNavProps> = ({
  activeTab,
  setActiveTab,
}) => {
  return (
    <nav className="fixed bottom-4 left-1/2 z-50 md:hidden -translate-x-1/2">
      <div className="flex items-center justify-between gap-10 px-10 h-16 bg-white  shadow-lg border border-gray-200">
        {menuItems.map((item, index) => {
          const IconComponent = item.icon;

          return (
            <button
              key={item.label}
              onClick={() => setActiveTab(index)}
              className={`flex flex-col items-center justify-center text-xs transition-all ${
                activeTab === index
                  ? "text-black"
                  : "text-gray-400"
              }`}
            >
              <IconComponent
                className={`w-5 h-5 mb-2 transition-colors ${
                  activeTab === index
                    ? "text-red-500"
                    : "text-gray-400"
                }`}
              />
              <span
                className={`${
                  activeTab === index
                    ? "font-semibold text-black"
                    : "text-gray-500"
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default AppearanceBottomNav;
