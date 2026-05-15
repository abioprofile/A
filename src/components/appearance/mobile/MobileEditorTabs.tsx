"use client";

import React, { memo } from "react";
import ProfileContent from "@/components/ProfileContent";
import ButtonAndFontTabs from "@/components/ButtonAndFontTabs";
import ThemeSelector from "@/components/ThemeSelector";
import WallpaperSelector from "@/components/Wallpaper";
import { ButtonStyle, AppearanceTheme } from "@/types/appearance.types";
import { FontStyle } from "@/components/FontCustomizer";
import { FillGradientWallpaperConfig } from "@/types/appearance.types";

interface MobileEditorTabsProps {
  activeTab: number;
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

const MobileEditorTabs: React.FC<MobileEditorTabsProps> = memo(({
  activeTab,
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
  return (
    <div className="w-full h-full">
      {activeTab === 0 && (
        <ProfileContent
          onProfileUpdate={onProfileUpdate}
          initialData={profile}
        />
      )}
      {activeTab === 1 && (
        <ButtonAndFontTabs
          buttonStyle={buttonStyle}
          setButtonStyle={onButtonStyleChange}
          fontStyle={fontStyle}
          setFontStyle={onFontStyleChange}
        />
      )}
      {activeTab === 2 && (
        <ThemeSelector
          selectedTheme={selectedTheme}
          setSelectedTheme={onSelectedThemeChange}
          onThemeSelect={onThemeSelect}
        />
      )}
      {activeTab === 3 && (
        <WallpaperSelector
          selectedTheme={selectedTheme}
          setSelectedTheme={onSelectedThemeChange}
          initialWallpaperConfig={initialWallpaperFromServer}
          onWallpaperChange={onWallpaperChange}
        />
      )}
    </div>
  );
});

MobileEditorTabs.displayName = "MobileEditorTabs";

export default MobileEditorTabs;