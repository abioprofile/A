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
    <nav
      className="fixed inset-x-0 bottom-0 z-50 md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="mx-4 mb-3  bg-white shadow-[0_6px_18px_rgba(0,0,0,0.08)]">
        <div className="grid grid-cols-4 px-6 py-2">
          {menuItems.map((item, index) => {
            const IconComponent = item.icon;
            const isActive = activeTab === index;
            return (
              <button
                key={item.label}
                onClick={() => setActiveTab(index)}
                aria-label={item.label}
                aria-selected={isActive}
                className="flex flex-col items-center justify-center gap-1 py-1.5"
              >
                <IconComponent
                  className={`w-5 h-5 ${
                    isActive ? "text-[#EA2228]" : "text-black"
                  }`}
                />
                <span
                  className={`text-[11px] ${
                    isActive ? "font-semibold text-black" : "text-gray-500"
                  }`}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default AppearanceBottomNav;
