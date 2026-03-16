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
  onThemeSelect?: (theme: AppearanceTheme) => void;
}

type Tab = "customizable" | "curated";

// ─── Lightning bolt SVG badge ──────
const LightningBadge = () => (
  <span
    className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center shadow-md z-10"
    style={{ backgroundColor: "rgba(255,255,255,0.25)", backdropFilter: "blur(4px)" }}
    aria-hidden
  >
    <svg width="11" height="14" viewBox="0 0 11 14" fill="none">
      <path
        d="M6.5 1L1 7.8H5.5L4.5 13L10 6.2H5.5L6.5 1Z"
        fill="white"
        stroke="white"
        strokeWidth="0.5"
        strokeLinejoin="round"
      />
    </svg>
  </span>
);

// ─── Skeleton loader card ─────────────────────────────────────────────────────
const SkeletonCard = () => (
  <div className="flex flex-col gap-2">
    <div
      className=" overflow-hidden animate-pulse"
      style={{ aspectRatio: "3/4", background: "#e5e5e5" }}
    />
    <div className="h-3 w-12 mx-auto rounded bg-gray-200 animate-pulse" />
  </div>
);

const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  selectedTheme,
  setSelectedTheme,
  onThemeSelect,
}) => {
  const [activeTab, setActiveTab] = useState<Tab>("customizable");

  const { data, isLoading, isError } = useGetThemes();
  const themes: AppearanceTheme[] = Array.isArray(data?.data) ? data.data : [];

  const getThemeString = (theme: AppearanceTheme) =>
    selectedThemeFromWallpaper(
      theme.wallpaper_config as Parameters<typeof selectedThemeFromWallpaper>[0],
    );

  const handleSelect = (theme: AppearanceTheme) => {
    const themeString = getThemeString(theme);
    if (themeString) setSelectedTheme(themeString);
    onThemeSelect?.(theme);
  };

  const wallpaperStyle = (theme: AppearanceTheme): CSSProperties => {
    const s = themePreviewStyle(
      theme.wallpaper_config as Parameters<typeof themePreviewStyle>[0],
    );
    return Object.keys(s).length > 0 ? s : { backgroundColor: "#c4b5d0" };
  };

  const buttonBarStyle = (theme: AppearanceTheme): CSSProperties => {
    const cc = theme.corner_config;
    if (!cc) return { borderRadius: 8, backgroundColor: "rgba(255,255,255,0.9)" };

    const borderRadius =
      cc.type === "sharp" ? 4 : cc.type === "round" ? 9999 : 10;

    const boxShadow =
      cc.shadowSize === "hard" && cc.shadowColor
        ? `2px 2px 0px 0px ${cc.shadowColor}`
        : cc.shadowColor
          ? `0 2px 6px ${cc.shadowColor}60`
          : "none";

    return {
      borderRadius,
      boxShadow,
      border: `1.5px solid ${cc.strokeColor ?? "rgba(255,255,255,0.5)"}`,
      backgroundColor: cc.fillColor ?? "rgba(255,255,255,0.9)",
      opacity: cc.opacity ?? 1,
    };
  };

  const fontName = (theme: AppearanceTheme) =>
    theme.font_config?.name || "inherit";

  // ── Shared card renderer ────────────────────────────────────────────────────
  const renderCard = (theme: AppearanceTheme, index: number) => {
    const themeString = getThemeString(theme);
    const isSelected = themeString != null && selectedTheme === themeString;

    return (
      <button
        key={theme.name + index}
        onClick={() => handleSelect(theme)}
        className="flex flex-col items-center gap-1.5 focus:outline-none group"
        aria-label={`Select theme: ${theme.name}`}
        aria-pressed={isSelected}
      >
        {/* Card */}
        <div
          className="relative w-full overflow-hidden transition-all duration-200"
          style={{
            aspectRatio: "4/4",
            ...wallpaperStyle(theme),
            // Selection ring
            outline: isSelected
              ? "3px solid #000000"
              : "3px solid transparent",
            outlineOffset: "2px",
            boxShadow: isSelected
              ? "0 0 0 1px #00000020"
              : "0 2px 8px rgba(0,0,0,0.12)",
          }}
        >
          {/* Lightning badge */}
          <LightningBadge />

          {/* Aa font preview */}
          <div className="absolute top-3 left-3 z-10">
            <span
              className="text-xl font-bold leading-none drop-shadow-sm"
              style={{
                fontFamily: fontName(theme),
                color: "#ffffff",
                textShadow: "0 1px 3px rgba(0,0,0,0.3)",
              }}
            >
              Aa
            </span>
          </div>

          {/* Button bar preview — pinned to bottom */}
          <div className="absolute bottom-3 shadow-xl left-3 right-3 z-10">
            <div
              className="w-full h-8"
              style={buttonBarStyle(theme)}
            />
          </div>
        </div>

        {/* Theme name */}
        <p
          className="text-[15px] font-bold text-center truncate w-full px-1"
          style={{ color: "#6b7280" }}
        >
          {theme.name}
        </p>
      </button>
    );
  };

  return (
    <div className="flex flex-col">
    
    

      {/* ── Content ─────────────────────────────   */}
      {isLoading ? (
        <div className="grid grid-cols-3 gap-3 px-1">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : isError ? (
        <p className="py-10 text-center text-sm text-gray-400">
          Could not load themes.
        </p>
      ) : themes.length === 0 ? (
        <p className="py-10 text-center text-sm text-gray-400">
          No themes yet. Upload one to get started.
        </p>
      ) : (
        <div className="grid grid-cols-3 gap-3 px-1 md:overflow-y-auto max-h-[480px] pb-2">
          {themes.map((theme, index) => renderCard(theme, index))}
        </div>
      )}
    </div>
  );
};

export default ThemeSelector;