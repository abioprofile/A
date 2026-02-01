"use client";

import React, { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ChevronLeft, RotateCcw, RotateCw } from "lucide-react";
import PhoneDisplay from "@/components/PhoneDisplay";
import {
  useGetAllLinks,
  useGetSettings,
  useUpdateProfile,
  useUpdateAppearanceAll,
} from "@/hooks/api/useAuth";
import { useAppSelector } from "@/stores/hooks";
import type {
  AppearancePayload,
  AppearanceResponse,
  CornerConfig,
  FillGradientWallpaperConfig,
  FontConfig,
  WallpaperConfig as BackendWallpaperConfig,
} from "@/types/appearance.types";
import ProfileContent from "@/components/ProfileContent";
import WallpaperSelector from "@/components/Wallpaper";
import ThemeSelector from "@/components/ThemeSelector";
import ButtonAndFontTabs from "@/components/ButtonAndFontTabs";
import AppearanceBottomNav from "@/components/AppearanceBottomNav";
import  { FontStyle } from "@/components/FontCustomizer";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

/* Shared interfaces*/
export interface ButtonStyle {
  borderRadius: string;
  backgroundColor: string;
  borderColor: string;
  opacity: number;
  boxShadow: string;
  shadowColor?: string;
}

/** Map UI button style to API CornerConfig for save */
function buttonStyleToCornerConfig(style: ButtonStyle): CornerConfig {
  const type: CornerConfig["type"] =
    style.borderRadius === "0px"
      ? "sharp"
      : style.borderRadius === "9999px" || style.borderRadius === "50%"
        ? "round"
        : "curved";
  const shadowSize =
    style.boxShadow === "none" || !style.boxShadow
      ? "soft"
      : style.boxShadow.includes("4px 4px 0px")
        ? "hard"
        : "soft";
  return {
    type,
    opacity: style.opacity,
    fillColor: style.backgroundColor,
    shadowSize,
    shadowColor: style.shadowColor ?? "#000000",
    strokeColor: style.borderColor,
  };
}

/** Map API CornerConfig to UI ButtonStyle (for initial load from settings) */
function cornerConfigToButtonStyle(c: CornerConfig): ButtonStyle {
  const borderRadius =
    c.type === "sharp" ? "0px" : c.type === "round" ? "9999px" : "12px";
  const boxShadow =
    c.shadowSize === "hard"
      ? `4px 4px 0px 0px ${c.shadowColor}`
      : `2px 2px 6px ${c.shadowColor}80`;
  return {
    borderRadius,
    backgroundColor: c.fillColor,
    borderColor: c.strokeColor,
    opacity: c.opacity,
    boxShadow: c.shadowSize === "soft" && !c.shadowColor ? "none" : boxShadow,
    shadowColor: c.shadowColor,
  };
}

/** Map API FontConfig to UI FontStyle (for initial load from settings) */
function fontConfigToFontStyle(f: FontConfig): FontStyle {
  return {
    fontFamily: f.name || "Poppins",
    fillColor: f.fillColor ?? "#000000",
    strokeColor: (f as { strokeColor?: string }).strokeColor ?? "none",
    opacity: 100,
  };
}

/**
 * Backend expects a single font name (letters, numbers, hyphens only).
 * UI fontFamily can be a CSS stack like "'Merriweather', 'Merriweather Fallback'".
 * Extract the primary name and sanitize for the API.
 */
function fontFamilyToApiName(fontFamily: string): string {
  const first = fontFamily.split(",")[0].trim().replace(/^['"]|['"]$/g, "");
  return first.replace(/[^a-zA-Z0-9-]/g, "") || "Poppins";
}

/** Backend expects valid color values; UI may use "none" for no stroke. Map to valid hex. */
function toValidColor(value: string | undefined | null, fallback: string): string {
  const v = (value ?? "").trim().toLowerCase();
  if (!v || v === "none" || v === "transparent") return fallback;
  return value!.trim();
}

/** Map UI FontStyle to API FontConfig for save */
function fontStyleToFontConfig(s: FontStyle): FontConfig {
  return {
    name: fontFamilyToApiName(s.fontFamily),
    fillColor: toValidColor(s.fillColor, "#000000"),
    strokeColor: toValidColor(s.strokeColor, "#00000000"),
  };
}

/** Default amount for wallpaper backgroundColor when not from backend (design didn't account for it). */
const WALLPAPER_DEFAULT_AMOUNT = 100;

/** Build FillGradientWallpaperConfig from backend wallpaper_config (for restore/sync). */
function wallpaperConfigFromBackend(
  w: BackendWallpaperConfig | undefined | null
): FillGradientWallpaperConfig | null {
  if (!w || (w.type !== "fill" && w.type !== "gradient")) return null;
  const bg = (w as { backgroundColor?: Array<{ color: string; amount: number }> }).backgroundColor;
  if (!Array.isArray(bg) || bg.length === 0) return null;
  const withAmount = bg.map((item) => ({
    color: typeof item?.color === "string" ? item.color : "#000000",
    amount:
      typeof item?.amount === "number" && item.amount >= 0
        ? item.amount
        : WALLPAPER_DEFAULT_AMOUNT,
  }));
  return { type: w.type, backgroundColor: withAmount };
}

/** Build selectedTheme string from backend wallpaper_config for preview. */
function selectedThemeFromWallpaper(
  w: BackendWallpaperConfig | undefined | null
): string | null {
  if (!w) return null;
  const bg = (w as { backgroundColor?: Array<{ color: string }> }).backgroundColor;
  if (w.type === "fill" && Array.isArray(bg) && bg[0]) {
    return `fill:${bg[0].color}`;
  }
  if (w.type === "gradient" && Array.isArray(bg) && bg.length >= 2) {
    return `gradient:${bg[0].color}:${bg[1].color}`;
  }
  const img = (w as { image?: { url: string } }).image;
  if (w.type === "image" && img?.url) return img.url;
  return null;
}

interface AppState {
  buttonStyle: ButtonStyle;
  fontStyle: FontStyle;
  selectedTheme: string;
  profile: {
    profileImage: string;
    displayName: string;
    bio: string;
    location: string;
    profileIcon?: string | null;
  };
}

/* Appearance Page*/
const AppearancePage: React.FC = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const userData = useAppSelector((state) => state.auth.user);
  const { data: settingsData } = useGetSettings();
  const { mutate: updateProfile, isPending: isUpdatingProfile } = useUpdateProfile();
  const { mutateAsync: updateAppearanceAllAsync, isPending: isSavingAll } =
    useUpdateAppearanceAll();

  const [activeTab, setActiveTab] = useState<number | null>(0);
  const [isSheetOpen, setIsSheetOpen] = useState<boolean>(false);

  const [buttonStyle, setButtonStyle] = useState<ButtonStyle>({
    borderRadius: "0px",
    backgroundColor: "#ffffff",
    borderColor: "#000000",
    opacity: 1,
    boxShadow: "2px 2px 6px rgba(0,0,0,0.2)",
  });

  const [fontStyle, setFontStyle] = useState<FontStyle>({
    fontFamily: "Poppins",
    fillColor: "#000000",
    strokeColor: "none",
    opacity: 100,
  });

  const [selectedTheme, setSelectedTheme] =
    useState<string>("/themes/theme1.png");

  const [wallpaperConfig, setWallpaperConfig] =
    useState<FillGradientWallpaperConfig | null>(null);
  const [wallpaperImageFile, setWallpaperImageFile] = useState<File | null>(null);
  /** Only set from settings load / restore — never from WallpaperSelector, to avoid effect loop */
  const [initialWallpaperFromServer, setInitialWallpaperFromServer] =
    useState<FillGradientWallpaperConfig | null>(null);

  const [profile, setProfile] = useState({
    profileImage: userData?.profile?.avatarUrl || "/icons/Profile Picture.png",
    displayName: userData?.name || "User",
    bio: userData?.profile?.bio || "",
    location: userData?.profile?.location || "",
    profileIcon: null as string | null,
  });

  const [settingsSynced, setSettingsSynced] = useState(false);

  // Sync local state from fetched settings (once when settings load)
  useEffect(() => {
    const payload = settingsData?.data;
    if (!payload || settingsSynced) return;
    if (payload.corner_config) {
      setButtonStyle(cornerConfigToButtonStyle(payload.corner_config));
    }
    if (payload.font_config) {
      setFontStyle(fontConfigToFontStyle(payload.font_config));
    }
    if (payload.selected_theme != null) {
      setSelectedTheme(payload.selected_theme);
    }
    const wp = wallpaperConfigFromBackend(payload.wallpaper_config);
    if (wp) {
      setWallpaperConfig(wp);
      setWallpaperImageFile(null);
      setInitialWallpaperFromServer(wp);
    }
    const themeFromWallpaper = selectedThemeFromWallpaper(payload.wallpaper_config);
    if (themeFromWallpaper != null) setSelectedTheme(themeFromWallpaper);
    setSettingsSynced(true);
  }, [settingsData?.data, settingsSynced]);

  // Sync profile with Redux user data on load
  useEffect(() => {
    if (userData?.profile) {
      setProfile((prev) => ({
        ...prev,
        profileImage: userData.profile.avatarUrl || prev.profileImage,
        displayName: prev.displayName || userData.name || "User",
        bio: prev.bio || userData.profile.bio || "",
        location: prev.location || userData.profile.location || "",
      }));
    }
  }, [userData]);

  // Undo/Redo state
  const [history, setHistory] = useState<AppState[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);

  const getCurrentState = useCallback(
    (): AppState => ({
      buttonStyle,
      fontStyle,
      selectedTheme,
      profile,
    }),
    [buttonStyle, fontStyle, selectedTheme, profile],
  );

  const addToHistory = useCallback(
    (newState: AppState) => {
      setHistory((prev) => {
        const newHistory = prev.slice(0, historyIndex + 1);
        newHistory.push(newState);
        return newHistory;
      });
      setHistoryIndex((prev) => prev + 1);
    },
    [historyIndex],
  );

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      const previousState = history[newIndex];
      setButtonStyle(previousState.buttonStyle);
      setFontStyle(previousState.fontStyle);
      setSelectedTheme(previousState.selectedTheme);
      setProfile(previousState.profile);
      setHistoryIndex(newIndex);
      toast.info("Undo applied");
    } else {
      toast.error("Nothing to undo");
    }
  }, [history, historyIndex]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      const nextState = history[newIndex];
      setButtonStyle(nextState.buttonStyle);
      setFontStyle(nextState.fontStyle);
      setSelectedTheme(nextState.selectedTheme);
      setProfile(nextState.profile);
      setHistoryIndex(newIndex);
      toast.info("Redo applied");
    } else {
      toast.error("Nothing to redo");
    }
  }, [history, historyIndex]);

  const handleStateChange = useCallback(() => {
    addToHistory(getCurrentState());
  }, [addToHistory, getCurrentState]);

  // Memoize the profile update handler to prevent infinite loops
  const handleProfileUpdate = useCallback(
    (updatedProfile: {
      profileImage: string;
      displayName: string;
      bio: string;
      location: string;
      profileIcon?: string | null;
    }) => {
      setProfile(updatedProfile);
      handleStateChange();
    },
    [handleStateChange],
  );

  const handleWallpaperChange = useCallback(
    (payload: {
      wallpaperConfig: FillGradientWallpaperConfig | null;
      imageFile: File | null;
    }) => {
      setWallpaperConfig(payload.wallpaperConfig ?? null);
      setWallpaperImageFile(payload.imageFile ?? null);
      handleStateChange();
    },
    [handleStateChange]
  );

  const { data: linksData } = useGetAllLinks();

  const profileLinks = linksData?.data
    ? Array.isArray(linksData.data)
      ? linksData.data
      : []
    : [];

  /** Restore local state from server payload (e.g. after a failed save) */
  const restoreFromPayload = useCallback((payload: AppearancePayload) => {
    if (payload.corner_config) {
      setButtonStyle(cornerConfigToButtonStyle(payload.corner_config));
    }
    if (payload.font_config) {
      setFontStyle(fontConfigToFontStyle(payload.font_config));
    }
    if (payload.selected_theme != null) {
      setSelectedTheme(payload.selected_theme);
    }
    const wp = wallpaperConfigFromBackend(payload.wallpaper_config);
    setWallpaperConfig(wp ?? null);
    setWallpaperImageFile(null);
    if (wp) setInitialWallpaperFromServer(wp);
    const themeFromWallpaper = selectedThemeFromWallpaper(payload.wallpaper_config);
    if (themeFromWallpaper != null) setSelectedTheme(themeFromWallpaper);
  }, []);

  const handleSaveAll = useCallback(async () => {
    try {
      await updateAppearanceAllAsync({
        cornerConfig: buttonStyleToCornerConfig(buttonStyle),
        fontConfig: fontStyleToFontConfig(fontStyle),
        wallpaperConfig: wallpaperImageFile ? null : wallpaperConfig ?? undefined,
        wallpaperImageFile: wallpaperImageFile ?? undefined,
      });
    } catch {
      try {
        await queryClient.refetchQueries({ queryKey: ["settings"] });
      } catch {
        // Refetch failed (e.g. offline); restore from cache if available
      }
      const res = queryClient.getQueryData<AppearanceResponse>(["settings"]);
      if (res?.data) {
        restoreFromPayload(res.data);
      }
    }
  }, [
    buttonStyle,
    fontStyle,
    wallpaperConfig,
    wallpaperImageFile,
    updateAppearanceAllAsync,
    queryClient,
    restoreFromPayload,
  ]);

  const handleBackClick = () => {
    router.back();
  };

  const handleTabClick = (index: number) => {
    setActiveTab(index);
    setIsSheetOpen(true);
  };

  const handleCloseSheet = () => {
    setIsSheetOpen(false);
  };

  const menuItems = ["Profile", "Style", "Themes", "Wallpaper"];

  return (
    <section className="min-h-screen bg-[#FFF7DE] overflow-hidden h-screen  md:bg-white md:pt-4 px-4 md:px-6 md:pb-24 flex flex-col relative">
      {/* Desktop Save */}
      <div className="hidden md:flex justify-end mb-4 ">
        <button
          type="button"
          onClick={handleSaveAll}
          disabled={isSavingAll}
          className="bg-[#FED45C] shadow-[2px_2px_0px_0px_#000000] font-bold px-6 py-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSavingAll ? "Saving…" : "Save Changes"}
        </button>
      </div>

      {/* Mobile Save with Undo/Redo */}
      <div className="md:hidden">
        <div className="flex items-center px-2 py-3 justify-between mb-3">
          <button
            onClick={handleBackClick}
            className="font-extrabold text-[20px] text-[#331400] flex items-center gap-1 hover:opacity-75 transition-opacity"
          >
            <ChevronLeft className="inline" />
            Appearance
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={undo}
              disabled={historyIndex <= 0}
              className="disabled:opacity-50 disabled:cursor-not-allowed text-[#331400] text-[13px] font-semibold bg-[#fed45c] p-2 hover:bg-[#fdd935] active:shadow-[2px_2px_0px_0px_#000000]"
              title="Undo"
            >
              <RotateCcw size={18} />
            </button>
            <button
              onClick={redo}
              disabled={historyIndex >= history.length - 1}
              className="disabled:opacity-50 disabled:cursor-not-allowed text-[#331400] text-[13px] font-semibold bg-[#fed45c] p-2 hover:bg-[#fdd935] active:shadow-[2px_2px_0px_0px_#000000]"
              title="Redo"
            >
              <RotateCw size={18} />
            </button>
            <button
              type="button"
              onClick={handleSaveAll}
              disabled={isSavingAll}
              className="text-[#331400] text-[13px] shadow-[2px_2px_0px_0px_#000000] font-semibold bg-[#fed45c] px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSavingAll ? "Saving…" : "Save"}
            </button>
          </div>
        </div>
      </div>

      {/* Main Layout */}
      <div className="flex flex-1 gap-8  md:">
        {/* Phone Preview */}
        <aside className="flex w-full md:w-[450px] md:min-w-[450px] justify-center items-start">
          <div
            className="relative w-full max-w-[360px] md:max-w-[420px]
                       transition-transform duration-300
                       ease-[cubic-bezier(.2,.8,.2,1)]
                       origin-top"
            style={{
              transform: isSheetOpen
                ? "scale(0.82) translateY(-24px)"
                : "scale(1.05) translateY(0)",
            }}
          >
            <div className="overflow-hidden">
              <PhoneDisplay
                buttonStyle={buttonStyle}
                fontStyle={fontStyle}
                selectedTheme={selectedTheme}
                profile={profile}
                links={profileLinks}
              />
            </div>
          </div>
        </aside>

        {/* Desktop Editor */}
        <div className="hidden md:flex flex-1 flex-col">
          <div className="flex gap-20 border-b">
            {menuItems.map((item, i) => (
              <button
                key={item}
                onClick={() => setActiveTab(i)}
                className="py-3 font-bold relative"
              >
                {item}
                {activeTab === i && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-500" />
                )}
              </button>
            ))}
          </div>

          <div className="md:mt-6 md:max-w-3xl">
            {activeTab === 0 && (
              <ProfileContent
                onProfileUpdate={handleProfileUpdate}
                initialData={profile}
              />
            )}
            {activeTab === 1 && (
              <ButtonAndFontTabs
                buttonStyle={buttonStyle}
                setButtonStyle={(newStyle) => {
                  setButtonStyle(newStyle);
                  handleStateChange();
                }}
                fontStyle={fontStyle}
                setFontStyle={(newStyle) => {
                  setFontStyle(newStyle);
                  handleStateChange();
                }}
              />
            )}
            {activeTab === 2 && (
              <ThemeSelector
                selectedTheme={selectedTheme}
                setSelectedTheme={(newTheme) => {
                  setSelectedTheme(newTheme);
                  handleStateChange();
                }}
              />
            )}
            {activeTab === 3 && (
              <WallpaperSelector
                selectedTheme={selectedTheme}
                setSelectedTheme={(newTheme) => {
                  setSelectedTheme(newTheme);
                  handleStateChange();
                }}
                initialWallpaperConfig={initialWallpaperFromServer}
                onWallpaperChange={handleWallpaperChange}
              />
            )}
          </div>
        </div>
      </div>

      {/* Mobile Sheet */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent
          side="bottom"
          className={`shadow-2xl p-0 overflow-hidden transition-all duration-300 ${
            activeTab === 2 || activeTab === 3 ? "h-[35vh]" : "h-[50vh]"
          }`}
        >
          <div className="h-full flex flex-col">
            {/* Sheet Header with handle */}
            <div className="flex flex-col">
              <div className="flex justify-center pt-3 ">
                <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
              </div>
              <SheetHeader className="">
                <div className="flex items-center justify-between">
                  <SheetTitle className="text-lg font-semibold">
                    {activeTab !== null ? menuItems[activeTab] : ""}
                  </SheetTitle>
                </div>
              </SheetHeader>
            </div>

            {/* Sheet Content */}
            <div className="flex-1 overflow-y-auto px-2 md:py-4">
              {activeTab === 0 && (
                <ProfileContent
                  onProfileUpdate={handleProfileUpdate}
                  initialData={profile}
                />
              )}
              {activeTab === 1 && (
                <ButtonAndFontTabs
                  buttonStyle={buttonStyle}
                  setButtonStyle={(newStyle) => {
                    setButtonStyle(newStyle);
                    handleStateChange();
                  }}
                  fontStyle={fontStyle}
                  setFontStyle={(newStyle) => {
                    setFontStyle(newStyle);
                    handleStateChange();
                  }}
                />
              )}
              {activeTab === 2 && (
                <ThemeSelector
                  selectedTheme={selectedTheme}
                  setSelectedTheme={(newTheme) => {
                    setSelectedTheme(newTheme);
                    handleStateChange();
                  }}
                />
              )}
              {activeTab === 3 && (
                <WallpaperSelector
                  selectedTheme={selectedTheme}
                  setSelectedTheme={(newTheme) => {
                    setSelectedTheme(newTheme);
                    handleStateChange();
                  }}
                  initialWallpaperConfig={initialWallpaperFromServer}
                  onWallpaperChange={handleWallpaperChange}
                />
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Mobile Bottom Nav */}
      <AppearanceBottomNav
        activeTab={activeTab || 0} // default to profile tab if no tab is selected
        setActiveTab={handleTabClick}
      />
    </section>
  );
};

export default AppearancePage;
