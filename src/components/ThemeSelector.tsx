'use client';

import Image from "next/image";

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
  return (
    <div>
      <h3 className="font-semibold text-lg mb-4">Choose a Theme</h3>
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
        {themes.map((theme, index) => (
          <button
            key={index}
            onClick={() => setSelectedTheme(theme)}
            className={`relative border-2 rounded-lg overflow-hidden ${
              selectedTheme === theme
                ? "border-[#7140EB]"
                : "border-transparent"
            }`}
          >
            <Image
              src={theme}
              alt={`Theme ${index + 1}`}
              width={120}
              height={200}
              className="object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default ThemeSelector;
