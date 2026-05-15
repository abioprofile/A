"use client";

import React, { useState, useCallback, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MobilePreviewStage from "./Mobliepreviewstage";
import MobileEditorSheet from "./MobileEditorSheet";
import { ButtonStyle, AppearanceTheme, FillGradientWallpaperConfig } from "@/types/appearance.types";
import { FontStyle } from "@/components/FontCustomizer";
import { ProfileLink } from "@/types/auth.types";

// Icons for the bottom nav
const NAV_ICONS = {
  Profile: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
    </svg>
  ),
  Style: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.93 4.93l2.12 2.12M16.95 16.95l2.12 2.12M4.93 19.07l2.12-2.12M16.95 7.05l2.12-2.12" />
    </svg>
  ),
  Themes: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c1.1 0 2-.9 2-2v-1.5c0-.55-.45-1-1-1H12c-2.76 0-5-2.24-5-5s2.24-5 5-5h3" />
      <circle cx="16.5" cy="6.5" r="2.5" />
      <circle cx="19.5" cy="10.5" r="1.5" />
    </svg>
  ),
  Wallpaper: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <path d="M21 15l-5-5L5 21" />
    </svg>
  ),
};

const MENU_ITEMS = ["Profile", "Style", "Themes", "Wallpaper"] as const;
type MenuItem = typeof MENU_ITEMS[number];

interface MobileAppearanceLayoutProps {
  // State
  profile: {
    profileImage: string;
    displayName: string;
    bio: string;
    location: string;
    profileIcon?: string | null;
  };
  buttonStyle: ButtonStyle;
  fontStyle: FontStyle;
  selectedTheme: string;
  initialWallpaperFromServer: FillGradientWallpaperConfig | null;
  links: ProfileLink[];
  phoneDisplayLoading: boolean;
  // Handlers
  onProfileUpdate: (updatedProfile: {
    profileImage: string;
    displayName: string;
    bio: string;
    location: string;
    profileIcon?: string | null;
  }) => void;
  onButtonStyleChange: (style: ButtonStyle) => void;
  onFontStyleChange: (style: FontStyle) => void;
  onThemeSelect: (theme: AppearanceTheme) => void;
  onSelectedThemeChange: (theme: string) => void;
  onWallpaperChange: (payload: {
    wallpaperConfig: FillGradientWallpaperConfig | null;
    imageFile: File | null;
  }) => void;
}

/**
 * MobileAppearanceLayout
 *
 * Full-screen mobile editor experience:
 *   - Immersive preview fills the screen when idle
 *   - Tapping a nav item:
 *       1. Animates preview into a floating card (scaled, rounded, shadowed)
 *       2. Slides editor sheet up from bottom
 *   - Tapping the SAME nav item again closes the sheet and restores preview
 *   - Changing tabs keeps the sheet open, only swaps content
 *   - PhoneDisplay is NEVER unmounted
 */
const MobileAppearanceLayout: React.FC<MobileAppearanceLayoutProps> = memo(({
  profile,
  buttonStyle,
  fontStyle,
  selectedTheme,
  initialWallpaperFromServer,
  links,
  phoneDisplayLoading,
  onProfileUpdate,
  onButtonStyleChange,
  onFontStyleChange,
  onThemeSelect,
  onSelectedThemeChange,
  onWallpaperChange,
}) => {
  const [activeTab, setActiveTab] = useState<number | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const handleNavPress = useCallback((index: number) => {
    setActiveTab((prev) => {
      if (prev === index && isSheetOpen) {
        // Same tab → close
        setIsSheetOpen(false);
        return prev;
      }
      setIsSheetOpen(true);
      return index;
    });
  }, [isSheetOpen]);

  return (
    <>
      {/* Fallback background — only visible in gaps during animation */}
      <div
        className="fixed inset-0 z-[-1]"
        style={{ background: "#FFF7DE" }}
        aria-hidden
      />

      {/* Animated phone preview — always mounted */}
      <MobilePreviewStage
        isEditing={isSheetOpen}
        buttonStyle={buttonStyle}
        fontStyle={fontStyle}
        selectedTheme={selectedTheme}
        profile={profile}
        links={links}
        phoneDisplayLoading={phoneDisplayLoading}
      />

      {/* Editor sheet — slides up from bottom */}
      <MobileEditorSheet
        isOpen={isSheetOpen}
        activeTab={activeTab ?? 0}
        menuLabels={[...MENU_ITEMS]}
        profile={profile}
        buttonStyle={buttonStyle}
        fontStyle={fontStyle}
        selectedTheme={selectedTheme}
        initialWallpaperFromServer={initialWallpaperFromServer}
        onProfileUpdate={onProfileUpdate}
        onButtonStyleChange={onButtonStyleChange}
        onFontStyleChange={onFontStyleChange}
        onThemeSelect={onThemeSelect}
        onSelectedThemeChange={onSelectedThemeChange}
        onWallpaperChange={onWallpaperChange}
      />

      {/* Floating bottom nav */}
      <div
        className="fixed z-40"
        style={{
          bottom: `calc(env(safe-area-inset-bottom) + 16px)`,
          left: "50%",
          transform: "translateX(-50%)",
          width: "auto",
        }}
      >
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 380, damping: 38, delay: 0.1 }}
          className="flex items-center gap-1 px-2 py-2 rounded-2xl"
          style={{
            background: "rgba(255, 255, 255, 0.88)",
            backdropFilter: "blur(20px) saturate(180%)",
            WebkitBackdropFilter: "blur(20px) saturate(180%)",
            boxShadow:
              "0 8px 32px rgba(0,0,0,0.18), 0 2px 8px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.6)",
            border: "1px solid rgba(0,0,0,0.08)",
          }}
        >
          {MENU_ITEMS.map((label, i) => {
            const isActive = activeTab === i && isSheetOpen;
            return (
              <button
                key={label}
                onClick={() => handleNavPress(i)}
                className="relative flex flex-col items-center gap-0.5 rounded-xl transition-all duration-200 active:scale-95"
                style={{
                  padding: "8px 14px",
                  minWidth: 62,
                }}
                aria-label={label}
                aria-pressed={isActive}
              >
                {/* Active pill background */}
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      key="pill"
                      layoutId="nav-active-pill"
                      className="absolute inset-0 rounded-xl"
                      style={{ background: "#331400" }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ type: "spring", stiffness: 400, damping: 38 }}
                    />
                  )}
                </AnimatePresence>

                {/* Icon */}
                <span
                  className="relative z-10 transition-colors duration-200"
                  style={{ color: isActive ? "#FED45C" : "#331400" }}
                >
                  {NAV_ICONS[label as MenuItem]}
                </span>

                {/* Label */}
                <span
                  className="relative z-10 text-[10px] font-semibold tracking-tight transition-colors duration-200"
                  style={{
                    color: isActive ? "#FED45C" : "#331400",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {label}
                </span>
              </button>
            );
          })}
        </motion.div>
      </div>
    </>
  );
});

MobileAppearanceLayout.displayName = "MobileAppearanceLayout";

export default MobileAppearanceLayout;