"use client";

import Image from "next/image";
import { useState } from "react";

interface ThemeSelectorProps {
  selectedTheme: string;
  setSelectedTheme: (theme: string) => void;
}

const themes = [
  "/themes/theme.png",
  "/themes/theme1.png",
  "/themes/theme2.png",
  "/themes/theme3.png",
  "/themes/theme4.png",
  "/themes/theme5.png",
  "/themes/theme6.png",
];

const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  selectedTheme,
  setSelectedTheme,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + themes.length) % themes.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % themes.length);
  };

  return (
    <div>
      {/* Mobile Carousel View - Horizontal Scroll */}
      <div className="md:hidden">
        <div className="overflow-x-auto pb-2 scrollbar-hide">
          <div className="flex gap-4 min-w-max px-4">
            {themes.map((theme, index) => (
              <button
                key={index}
                onClick={() => {
                  setSelectedTheme(theme);
                  setCurrentIndex(index);
                }}
                className={`border-4 overflow-hidden transition-all flex-shrink-0  ${
                  selectedTheme === theme
                    ? "border-[#E30000] w-40 h-40"
                    : "border-gray-300 w-32 h-32 opacity-60 hover:opacity-80"
                }`}
              >
                <Image
                  src={theme}
                  alt={`Theme ${index + 1}`}
                  width={160}
                  height={160}
                  className="object-cover w-full h-full block"
                />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Desktop Grid View */}
      <div className="hidden md:block mt-6">
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
          {themes.map((theme, index) => (
            <button
              key={index}
              onClick={() => setSelectedTheme(theme)}
              className={`relative inline-block border-2 overflow-hidden transition-all ${
                selectedTheme === theme
                  ? "border-[#E30000]"
                  : "border-transparent hover:border-gray-400"
              }`}
            >
              <Image
                src={theme}
                alt={`Theme ${index + 1}`}
                width={100}
                height={100}
                className="object-cover w-full h-full block"
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ThemeSelector;