"use client";

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
     
      <div className="grid mt-6 grid-cols-3 sm:grid-cols-4 gap-4">
        {themes.map((theme, index) => (
         <button
  key={index}
  onClick={() => setSelectedTheme(theme)}
  className={`relative inline-block border-2  overflow-hidden transition-all ${
    selectedTheme === theme
      ? "border-[#E30000]"
      : "border-transparent hover:border-gray-400"
  }`}
>
  <Image
    src={theme}
    alt={`Theme ${index + 1}`}
    width={100}          // Adjust width to your desired thumbnail size
    height={100}
    className="object-cover w-full h-full block"
  />
</button>

        ))}
      </div>
    </div>
  );
};

export default ThemeSelector;

