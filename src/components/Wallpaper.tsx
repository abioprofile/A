"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { Upload } from "lucide-react";

interface WallpaperSelectorProps {
  selectedTheme: string;
  setSelectedTheme: (theme: string) => void;
}

export default function WallpaperSelector({
  selectedTheme,
  setSelectedTheme,
}: WallpaperSelectorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [themeType, setThemeType] = useState<"fill" | "gradient" | "image">(
    selectedTheme.startsWith("gradient")
      ? "gradient"
      : selectedTheme.startsWith("fill")
      ? "fill"
      : "image"
  );
  const [fillColor, setFillColor] = useState("#000000");
  const [gradientStart, setGradientStart] = useState("#0f0f0f");
  const [gradientEnd, setGradientEnd] = useState("#dddddd");

  // Sync colors with selectedTheme immediately
  useEffect(() => {
    if (themeType === "fill") {
      setSelectedTheme(`fill:${fillColor}`);
    } else if (themeType === "gradient") {
      setSelectedTheme(`gradient:${gradientStart}:${gradientEnd}`);
    }
  }, [fillColor, gradientStart, gradientEnd, themeType]);

  const wallpapers = [
    { type: "fill", label: "Fill", backgroundStyle: { backgroundColor: fillColor } },
    {
      type: "gradient",
      label: "Gradient",
      backgroundStyle: { backgroundImage: `linear-gradient(to bottom, ${gradientStart}, ${gradientEnd})` },
    },
    { type: "image", label: "Image", backgroundStyle: {} },
  ];

  const handleSelectType = (type: "fill" | "gradient" | "image") => {
    setThemeType(type);
    if (type === "fill") setSelectedTheme(`fill:${fillColor}`);
    else if (type === "gradient") setSelectedTheme(`gradient:${gradientStart}:${gradientEnd}`);
  };

  const isSelected = (type: string) => {
    if (type === "image" && selectedTheme.startsWith("blob:")) return true;
    return selectedTheme.startsWith(type);
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setThemeType("image");
      setSelectedTheme(imageUrl);
    }
  };

  return (
    <div className="flex flex-col mt-6 gap-6 w-full max-w-xl">
      <div className="grid grid-cols-3 gap-6 w-full">
        {wallpapers.map((wallpaper, index) => (
          <div key={index} className="flex flex-col items-center gap-2">
            <button
              onClick={() => {
                if (wallpaper.type === "image") fileInputRef.current?.click();
                else handleSelectType(wallpaper.type as "fill" | "gradient");
              }}
              className={`relative w-[100px] h-[120px] overflow-hidden border-2 flex items-center justify-center transition-all ${
                isSelected(wallpaper.type) ? "border-[#E30000]" : "border-transparent hover:border-gray-400"
              }`}
            >
              {wallpaper.type === "image" ? (
                selectedTheme.startsWith("blob:") ? (
                  <Image src={selectedTheme} alt="Uploaded wallpaper" fill className="object-cover" />
                ) : (
                  <div className="flex flex-col items-center justify-center text-gray-500">
                    <Upload className="w-6 h-6 mb-1" />
                    <span className="text-xs">Upload</span>
                  </div>
                )
              ) : (
                <div className="absolute inset-0" style={wallpaper.backgroundStyle} />
              )}
            </button>
            <span className="text-sm font-medium">{wallpaper.label}</span>
          </div>
        ))}
      </div>

      {/* Color Pickers */}
      {themeType === "fill" && (
        <div className="flex items-center justify-center gap-3 mt-2">
          <label className="text-sm font-medium text-gray-700">Fill Color:</label>
          <input
            type="color"
            value={fillColor}
            onChange={(e) => setFillColor(e.target.value)}
            className="w-10 h-10 cursor-pointer border rounded-lg"
          />
        </div>
      )}

      {themeType === "gradient" && (
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-2">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Start:</label>
            <input
              type="color"
              value={gradientStart}
              onChange={(e) => setGradientStart(e.target.value)}
              className="w-10 h-10 cursor-pointer border rounded-lg"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">End:</label>
            <input
              type="color"
              value={gradientEnd}
              onChange={(e) => setGradientEnd(e.target.value)}
              className="w-10 h-10 cursor-pointer border rounded-lg"
            />
          </div>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleUpload}
      />
    </div>
  );
}

