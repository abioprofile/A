"use client";

import React, { memo, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MobileEditorTabs from "./MobileEditorTabs";
import { ButtonStyle, AppearanceTheme, FillGradientWallpaperConfig } from "@/types/appearance.types";
import { FontStyle } from "@/components/FontCustomizer";
import { ProfileLink } from "@/types/auth.types";

const SHEET_HEIGHT = "48vh";

const SHEET_VARIANTS = {
  hidden: {
    y: "100%",
    opacity: 0,
  },
  visible: {
    y: "0%",
    opacity: 1,
    transition: {
      type: "spring" as const,
      stiffness: 360,
      damping: 38,
      mass: 1.0,
    },
  },
  exit: {
    y: "100%",
    opacity: 0,
    transition: {
      type: "spring" as const,
      stiffness: 400,
      damping: 42,
      mass: 0.9,
    },
  },
};

interface MobileEditorSheetProps {
  isOpen: boolean;
  activeTab: number;
  menuLabels: string[];
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

const MobileEditorSheet: React.FC<MobileEditorSheetProps> = memo(({
  isOpen,
  activeTab,
  menuLabels,
  profile,
  buttonStyle,
  fontStyle,
  selectedTheme,
  initialWallpaperFromServer,
  onProfileUpdate,
  onButtonStyleChange,
  onFontStyleChange,
  onThemeSelect,
  onSelectedThemeChange,
  onWallpaperChange,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Reset scroll when tab changes
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [activeTab]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="editor-sheet"
          variants={SHEET_VARIANTS}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="fixed bottom-0 left-0 right-0 z-30"
          style={{
            height: SHEET_HEIGHT,
            paddingBottom: "env(safe-area-inset-bottom)",
            willChange: "transform",
          }}
        >
          {/* Sheet surface */}
          <div
            className="w-full h-full flex flex-col"
            style={{
              background: "rgba(255, 255, 255, 0.96)",
              backdropFilter: "blur(24px) saturate(180%)",
              WebkitBackdropFilter: "blur(24px) saturate(180%)",
              borderTopLeftRadius: "24px",
              borderTopRightRadius: "24px",
              boxShadow:
                "0 -8px 40px rgba(0,0,0,0.14), 0 -2px 8px rgba(0,0,0,0.06)",
              overscrollBehavior: "contain",
            }}
          >
            {/* iOS drag handle */}
            <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
              <div
                className="rounded-full"
                style={{
                  width: 36,
                  height: 5,
                  background: "rgba(0,0,0,0.18)",
                }}
              />
            </div>

            {/* Sheet title */}
            <div className="flex-shrink-0 px-5 pb-2">
              <p
                className="text-center text-sm font-semibold tracking-tight"
                style={{ color: "#331400", letterSpacing: "-0.01em" }}
              >
                {menuLabels[activeTab] ?? ""}
              </p>
            </div>

            {/* Divider */}
            <div
              className="flex-shrink-0 mx-4"
              style={{ height: 1, background: "rgba(0,0,0,0.07)" }}
            />

            {/* Scrollable content — ONLY this area scrolls, never the preview */}
            <div
              ref={scrollRef}
              className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden"
              style={{
                overscrollBehavior: "contain",
                WebkitOverflowScrolling: "touch",
                scrollbarWidth: "none",
              }}
            >
              <div className="px-4 py-3">
                <MobileEditorTabs
                  activeTab={activeTab}
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
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

MobileEditorSheet.displayName = "MobileEditorSheet";

export default MobileEditorSheet;