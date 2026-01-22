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
  { 
    label: "Profile", 
    icon: FaUser 
  },
  { 
    label: "Style", 
    icon: FaPalette 
  },
  { 
    label: "Theme", 
    icon: FaPuzzlePiece 
  },
  { 
    label: "Wallpaper", 
    icon: FaImage 
  },
];

const AppearanceBottomNav: React.FC<AppearanceBottomNavProps> = ({
  activeTab,
  setActiveTab,
}) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 md:hidden">
      <div className="flex justify-around items-center h-20 px-2">
        {menuItems.map((item, index) => {
          const IconComponent = item.icon;
          return (
            <button
              key={item.label}
              onClick={() => setActiveTab(index)}
              className={`flex flex-col items-center justify-center text-xs font-medium transition-colors ${
                activeTab === index
                  ? "text-black"
                  : "text-gray-400"
              }`}
            >
              <IconComponent className={`w-6 h-6 mb-1 ${
                activeTab === index 
                  ? "text-red-500" 
                  : "text-gray-500"
              }`} />
              <span className={activeTab === index ? "text-black font-semibold" : "text-gray-500"}>
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