"use client";

import { useState } from "react";
import type { CSSProperties } from "react";
import { useGetThemes } from "@/hooks/api/useAuth";
import type { AppearanceTheme } from "@/types/appearance.types";
import {
  selectedThemeFromWallpaper,
  themePreviewStyle,
} from "@/lib/helpers/appearance";

interface ThemeSelectorProps {
  selectedTheme: string;
  setSelectedTheme: (theme: string) => void;
  /** When a theme is clicked, apply it globally (wallpaper + style + font). */
  onThemeSelect?: (theme: AppearanceTheme) => void;
}

const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  selectedTheme,
  setSelectedTheme,
  onThemeSelect,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const { data, isLoading, isError } = useGetThemes();
  const themes: AppearanceTheme[] = Array.isArray(data?.data) ? data.data : [];

  const getThemeString = (theme: AppearanceTheme) =>
    selectedThemeFromWallpaper(
      theme.wallpaper_config as Parameters<typeof selectedThemeFromWallpaper>[0],
    );

  const handleSelect = (theme: AppearanceTheme, index: number) => {
    const themeString = getThemeString(theme);
    if (themeString) setSelectedTheme(themeString);
    onThemeSelect?.(theme);
    setCurrentIndex(index);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + themes.length) % Math.max(themes.length, 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % Math.max(themes.length, 1));
  };

  if (isLoading) {
    return (
      <div className="py-8 text-center text-gray-500 text-sm">Loading themes…</div>
    );
  }

  if (isError || themes.length === 0) {
    return (
      <div className="py-8 text-center text-gray-500 text-sm">
        {isError ? "Could not load themes." : "No themes yet. Upload one to get started."}
      </div>
    );
  }

  const cardFill = (theme: AppearanceTheme) =>
    theme.corner_config?.fillColor ?? "#e5e5e5";

  const wallpaperBarStyle = (theme: AppearanceTheme) => {
    const s = themePreviewStyle(
      theme.wallpaper_config as Parameters<typeof themePreviewStyle>[0],
    );
    return Object.keys(s).length > 0 ? s : { backgroundColor: "#c4b5d0" };
  };

  const barButtonStyle = (theme: AppearanceTheme): CSSProperties => {
    const cc = theme.corner_config;
    if (!cc) return {};
    const borderRadius =
      cc.type === "sharp" ? 0 : cc.type === "round" ? 9999 : 12;
    const boxShadow =
      cc.shadowSize === "hard" && cc.shadowColor
        ? `2px 2px 0px 0px ${cc.shadowColor}`
        : cc.shadowColor
          ? `1px 1px 3px ${cc.shadowColor}80`
          : "none";
    return {
      border: `2px solid ${cc.strokeColor ?? "#000000"}`,
      borderRadius: typeof borderRadius === "number" ? `${borderRadius}px` : borderRadius,
      boxShadow,
      opacity: cc.opacity ?? 1,
    };
  };

  return (
    <div>
      {/* Mobile Carousel */}
      <div className="md:hidden">
        <div className="overflow-x-auto pb-2 scrollbar-hide">
          <div className="flex gap-4 min-w-max px-4">
            {themes.map((theme, index) => {
              const themeString = getThemeString(theme);
              const isSelected = themeString != null && selectedTheme === themeString;

              return (
                <button
                  key={theme.name + index}
                  onClick={() => handleSelect(theme, index)}
                  className={`border-4 overflow-hidden transition-all flex-shrink-0  flex flex-col p-0 ${
                    isSelected
                      ? "border-[#E30000] w-28 h-28"
                      : "border-gray-300 w-28 h-28  hover:opacity-80"
                  }`}
                  style={{ ...wallpaperBarStyle(theme), }}
                >
                  <div className="w-full flex-1 min-h-0 rounded-2xl flex flex-col overflow-hidden flex-grow">
                    <div className="flex-1 min-h-0 flex items-start pt-2 pl-2">
                      <span
                        className="text-lg font-semibold"
                        style={{
                          fontFamily: theme.font_config?.name || "inherit",
                          color: "#ffffff",
                        }}
                      >
                        Aa
                      </span>
                    </div>
                    <div className="h-px w-full shrink-0 bg-white/50" aria-hidden />
                    <div
                      className="h-7 w-full  shrink-0 min-h-[28px]"
                      style={{
                        ...wallpaperBarStyle(theme),
                        ...barButtonStyle(theme),
                      }}
                    />
                  </div>
                  <p className="text-[10px] font-medium text-center text-gray-600 mt-1.5 truncate px-1 flex-shrink-0">
                    {theme.name}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Desktop Grid */}
      <div className="hidden md:block mt-6">
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
          {themes.map((theme, index) => {
            const themeString = getThemeString(theme);
            const isSelected = themeString != null && selectedTheme === themeString;

            return (
              <button
                key={theme.name + index}
                onClick={() => handleSelect(theme, index)}
                className={`relative inline-block border-2 overflow-hidden transition-all flex flex-col p-0 ${
                  isSelected
                    ? "border-[#E30000] ring-2 ring-[#E30000]/50"
                    : "border-transparent hover:border-gray-400"
                }`}
                style={{ ...wallpaperBarStyle(theme), }}
              >
                <div className="w-full aspect-square min-h-[100px] flex flex-col overflow-hidden flex-grow">
                  <div className="flex-1 min-h-0 flex items-start pt-2 pl-2">
                    <span
                      className="text-lg font-semibold"
                      style={{
                        fontFamily: theme.font_config?.name || "inherit",
                        color:  "#ffffff",
                      }}
                    >
                      Aa
                    </span>
                  </div>
                  <div className="h-px w-full shrink-0 bg-white/50" aria-hidden />
                  <div
                    className="h-7 w-full shrink-0 min-h-[28px]"
                    style={{
                      
                      ...barButtonStyle(theme),
                    }}
                  />
                </div>
                <p className="text-xs font-medium text-center text-gray-600 mt-1.5 truncate px-1 flex-shrink-0">
                  {theme.name}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ThemeSelector;
