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
    <nav className="fixed bottom-2 left-10 right-10 z-50 md:hidden">
      <div className="flex justify-between bg-white px-8 py-3 ">
        {menuItems.map((item, index) => {
          const IconComponent = item.icon;

          return (
            <button
              key={item.label}
              onClick={() => setActiveTab(index)}
              className="flex flex-col items-center justify-center text-xs transition-all"
            >
              <IconComponent
                className={`w-4 h-4 mb-2 transition-colors ${
                  activeTab === index
                    ? "text-red-500"
                    : "text-black"
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