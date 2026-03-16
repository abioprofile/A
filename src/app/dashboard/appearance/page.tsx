"use client";

import React, { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { ChevronLeft, RotateCcw, RotateCw, Upload } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import PhoneDisplay from "@/components/PhoneDisplay";
import {
  useGetSettings,
  useUpdateProfile,
  useUpdateAppearanceAll,
  useCreateTheme,
} from "@/hooks/api/useAuth";
import { usePhoneDisplayProps } from "@/hooks/usePhoneDisplayProps";
import { useAppSelector } from "@/stores/hooks";
import type {
  AppearancePayload,
  AppearanceResponse,
  AppearanceTheme,
  CornerConfig,
  FillGradientWallpaperConfig,
  FontConfig,
  WallpaperConfig as BackendWallpaperConfig,
} from "@/types/appearance.types";
import {
  buttonStyleToCornerConfig,
  cornerConfigToButtonStyle,
  fontConfigToFontStyle,
  fontStyleToFontConfig,
  selectedThemeFromWallpaper,
  wallpaperConfigFromBackend,
} from "@/lib/helpers/appearance";
import type { ButtonStyle } from "@/types/appearance.types";
import ProfileContent from "@/components/ProfileContent";
import WallpaperSelector from "@/components/Wallpaper";
import ThemeSelector from "@/components/ThemeSelector";
import ButtonAndFontTabs from "@/components/ButtonAndFontTabs";
import AppearanceBottomNav from "@/components/AppearanceBottomNav";
import { FontStyle } from "@/components/FontCustomizer";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import MobileBottomNav from "@/components/MobileBottomNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

/** Re-export for components that import ButtonStyle from the page */
export type { ButtonStyle } from "@/types/appearance.types";

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
  const isMobile = useIsMobile();
  const userData = useAppSelector((state) => state.auth.user);
  const { data: settingsData } = useGetSettings();
  const {
    buttonStyle: initialButtonStyle,
    fontStyle: initialFontStyle,
    selectedTheme: initialTheme,
    profile: initialProfile,
    links: profileLinks,
    isLoading: phoneDisplayLoading,
  } = usePhoneDisplayProps();
  const { mutate: updateProfile, isPending: isUpdatingProfile } =
    useUpdateProfile();
  const { mutateAsync: updateAppearanceAllAsync, isPending: isSavingAll } =
    useUpdateAppearanceAll();
  const {
    mutateAsync: createThemeAsync,
    isPending: isCreating,
    isError: themeError,
  } = useCreateTheme();

  const [activeTab, setActiveTab] = useState<number | null>(0);
  const [isSheetOpen, setIsSheetOpen] = useState<boolean>(false);

  const [buttonStyle, setButtonStyle] = useState<ButtonStyle>({
    borderRadius: "0px",
    backgroundColor: "transparent",
    borderColor: "transparent",
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

  const [themeName, setThemeName] = useState<string | undefined>(undefined);

  const [wallpaperConfig, setWallpaperConfig] =
    useState<FillGradientWallpaperConfig | null>(null);
  const [wallpaperImageFile, setWallpaperImageFile] = useState<File | null>(
    null,
  );
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
    const themeFromWallpaper = selectedThemeFromWallpaper(
      payload.wallpaper_config,
    );
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

  // ✅ Lock page scroll on mobile — ADDED ONLY THIS
  useEffect(() => {
    if (!isMobile) return;

    const originalOverflow = document.body.style.overflow;
    const originalHeight = document.body.style.height;

    document.body.style.overflow = "hidden";
    document.body.style.height = "100vh";

    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.height = originalHeight;
    };
  }, [isMobile]);

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

  const hasEdits = history.length > 0;

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
    [handleStateChange],
  );

  /** Apply a selected theme globally (wallpaper + style + font); updates all relevant UI. */
  const handleThemeSelect = useCallback(
    (theme: AppearanceTheme) => {
      const themeString = selectedThemeFromWallpaper(
        theme.wallpaper_config as BackendWallpaperConfig,
      );
      const newButtonStyle = cornerConfigToButtonStyle(theme.corner_config);
      const newFontStyle = fontConfigToFontStyle(theme.font_config);
      const wp = wallpaperConfigFromBackend(
        theme.wallpaper_config as BackendWallpaperConfig,
      );
      setSelectedTheme(themeString ?? selectedTheme);
      setButtonStyle(newButtonStyle);
      setFontStyle(newFontStyle);
      setWallpaperConfig(wp ?? null);
      setWallpaperImageFile(null);
      if (wp) setInitialWallpaperFromServer(wp);
      addToHistory({
        buttonStyle: newButtonStyle,
        fontStyle: newFontStyle,
        selectedTheme: themeString ?? selectedTheme,
        profile,
      });
    },
    [addToHistory, profile, selectedTheme],
  );

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
    const themeFromWallpaper = selectedThemeFromWallpaper(
      payload.wallpaper_config,
    );
    if (themeFromWallpaper != null) setSelectedTheme(themeFromWallpaper);
  }, []);

  const handleSaveAll = useCallback(async () => {
    try {
      await updateAppearanceAllAsync({
        cornerConfig: buttonStyleToCornerConfig(buttonStyle),
        fontConfig: fontStyleToFontConfig(fontStyle),
        wallpaperConfig: wallpaperImageFile
          ? null
          : (wallpaperConfig ?? undefined),
        wallpaperImageFile: wallpaperImageFile ?? undefined,
        profile: {
          displayName: profile.displayName || null,
          bio: profile.bio || null,
          location: profile.location || null,
        },
      });
      setHistory([]);
      setHistoryIndex(-1);
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
    profile.displayName,
    profile.bio,
    profile.location,
    updateAppearanceAllAsync,
    queryClient,
    restoreFromPayload,
    userData?.username,
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

  /** Only show theme upload button when logged-in user is "abio" */
  const canUploadThemes =
    userData?.username === "abio" ||
    (userData?.profile as { username?: string } | undefined)?.username ===
      "abio";

  const themeUploadInputRef = React.useRef<HTMLInputElement>(null);

  const handleThemeUploadClick = () => {
    if (!themeName) {
      alert("Add a theme name");
      return;
    }

    createThemeAsync({
      name: themeName!,
      corner_config: buttonStyleToCornerConfig(buttonStyle),
      font_config: fontStyleToFontConfig(fontStyle),
      wallpaper_config: {
        type: wallpaperConfig!.type,
        backgroundColor:
          wallpaperConfig!.type != "image"
            ? wallpaperConfig?.backgroundColor
            : undefined,
        image:
          wallpaperConfig!.type == "image" ? wallpaperImageFile : undefined,
      },
    }).then((response) => {
      console.log(response);
    });
  };

  const handleThemeFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file?.type.startsWith("image/")) return;
      // TODO: wire to API to add theme to list (e.g. upload to storage and add to themes)
      toast.success(
        "Theme image selected. Upload integration can be wired here.",
      );
      e.target.value = "";
    },
    [],
  );

  return (
    <section className="min-h-screen bg-[#FFF7DE] overflow-hidden h-screen md:bg-white md:pt-4 px-4 md:px-6 pb-20 md:pb-24 flex flex-col relative">
      {/* Hidden file input for theme upload (used when canUploadThemes) */}
      {/* <input
        ref={themeUploadInputRef}
        type="file"
        accept="image/jpeg,image/png,image/gif,image/webp"
        className="hidden"
        onChange={handleThemeFileChange}
      /> */}

      {/* Desktop: Save Changes + Upload theme (when abio) */}
      <div className="hidden md:flex justify-end items-center gap-3 mb-4">
        {canUploadThemes && (
          <>
            <Input
              type="text"
              value={themeName}
              onChange={(e) => setThemeName(e.target.value)}
            />
            <Button
              type="button"
              variant="outline"
              onClick={handleThemeUploadClick}
              className="flex items-center gap-2 w-40 h-8 px-6 text-sm font-bold text-[#331400] border-[#331400] shadow-[2px_2px_0px_0px_#000] cursor-pointer hover:bg-[#331400]/10 transition-colors"
            >
              <Upload className="w-3 h-3" />
              Upload Theme
            </Button>
          </>
        )}

        <button
          type="button"
          onClick={handleSaveAll}
          disabled={isSavingAll}
          className="h-10 px-6 text-sm font-bold text-[#331400] bg-[#FED45C] shadow-[2px_2px_0px_0px_#000] cursor-pointer transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSavingAll ? "Saving…" : "Save Changes"}
        </button>
      </div>

      {/* Mobile: Header fixed at top (TikTok-style) — Save + Undo/Redo only when an edit has been made */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-20 bg-[#FFF7DE] px-2 py-3 flex items-center justify-between">
        <button
          onClick={handleBackClick}
          className="font-extrabold text-[20px] text-[#331400] flex items-center gap-1 hover:opacity-75 transition-opacity"
        >
          <ChevronLeft className="inline" />
          Appearance
        </button>
        <div className="flex items-center gap-2">
          {canUploadThemes && (
            <>
              <Input
                type="text"
                value={themeName}
                onChange={(e) => setThemeName(e.target.value)}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleThemeUploadClick}
                className="gap-1.5 border-[#331400] text-[#331400] hover:bg-[#331400]/10 text-[12px] px-3 py-1.5"
              >
                <Upload className="w-3.5 h-3.5" />
                Upload theme
              </Button>
            </>
          )}
          {hasEdits && (
            <>
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
            </>
          )}
        </div>
      </div>
      {/* Spacer so content below doesn't sit under fixed header on mobile */}
      <div className="md:hidden h-14 flex-shrink-0" aria-hidden />

      {/* Main Layout — mobile: min-height so section fills viewport (fixed PhoneDisplay overlays); desktop: normal flex */}
      <div className="flex flex-1 gap-8 min-h-[calc(100vh-3.5rem)] md:min-h-0">
        {/* PhoneDisplay: desktop = in-flow; mobile = TikTok-style fixed fullscreen → floating card when sheet open */}
        <aside
          className={`
            flex w-full md:w-[450px] md:min-w-[450px] justify-center items-center md:items-start md:mt-6
            md:relative
            transition-[height,transform,border-radius] duration-[280ms] ease-out
            ${isMobile ? "fixed inset-0 top-0 left-0 right-0 bottom-0 z-0" : ""}
            ${isMobile && isSheetOpen ? "h-[60vh] -translate-y-[5%] rounded-2xl overflow-hidden" : ""}
            ${isMobile && !isSheetOpen ? "h-full w-full rounded-none" : ""}
          `}
        >
          <div
            className={`relative w-full max-w-[360px] md:max-w-[420px] mx-auto h-full max-h-full md:max-h-none origin-top transition-transform duration-[280ms] ease-out ${isMobile && isSheetOpen ? "scale-[0.895]" : ""}`}
            style={{ transformOrigin: "top center" }}
          >
            <div className="overflow-hidden w-full h-full flex items-center justify-center md:block md:h-auto">
              <PhoneDisplay
                buttonStyle={buttonStyle}
                fontStyle={fontStyle}
                selectedTheme={selectedTheme}
                profile={profile}
                links={profileLinks}
                phoneDisplayLoading={phoneDisplayLoading}
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
                className="py-3 cursor-pointer font-bold relative"
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
                onThemeSelect={handleThemeSelect}
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

      {/* Mobile Sheet (WallpaperSheets): TikTok-style bottom sheet — mobile only */}
      <Sheet
        open={isMobile ? isSheetOpen : false}
        onOpenChange={(open) => {
          if (!isMobile) return;
          setIsSheetOpen(open);
        }}
      >
        <SheetContent
          side="bottom"
          className="md:hidden bg-white shadow-lg p-0 overflow-hidden rounded-t-2xl border-t border-gray-200/80 h-[40vh] max-h-[40vh] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom data-[state=open]:duration-300 data-[state=closed]:duration-250"
          style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
        >
          <div className="h-full flex flex-col min-h-0">
            {/* Sheet Header with handle */}
            <div className="flex flex-col flex-shrink-0">
              <div className="flex justify-center pt-2">
                <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
              </div>
              <SheetHeader>
                <div className="flex items-center justify-center">
                  <SheetTitle className="text-[15px] font-semibold">
                    {activeTab !== null ? menuItems[activeTab] : ""}
                  </SheetTitle>
                </div>
              </SheetHeader>
            </div>

            {/* Sheet Content: scrollable area (keyboard opens = only this scrolls; PhoneDisplay does not move) */}
            <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden px-3 pt-2 pb-3">
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
                  onThemeSelect={handleThemeSelect}
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

      <MobileBottomNav />
    </section>
  );
};

export default AppearancePage;
