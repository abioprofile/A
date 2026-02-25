"use client";

import React, { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { ChevronLeft, RotateCcw, RotateCw } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import PhoneDisplay from "@/components/PhoneDisplay";
import {
  useGetSettings,
  useUpdateProfile,
  useUpdateAppearanceAll,
} from "@/hooks/api/useAuth";
import { usePhoneDisplayProps } from "@/hooks/usePhoneDisplayProps";
import { useAppSelector } from "@/stores/hooks";
import type {
  AppearancePayload,
  AppearanceResponse,
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
        profile: {
          displayName: profile.displayName || null,
          bio: profile.bio || null,
          location: profile.location || null,
        },
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
    profile.displayName,
    profile.bio,
    profile.location,
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
    <section className="min-h-screen bg-[#FFF7DE] overflow-hidden h-screen md:bg-white md:pt-4 px-4 md:px-6 pb-20 md:pb-24 flex flex-col relative">
      {/* Desktop Save */}
      <div className="hidden md:flex justify-end mb-4 ">
        <button
          type="button"
          onClick={handleSaveAll}
          disabled={isSavingAll}
          className="bg-[#FED45C] cursor-pointer shadow-[2px_2px_0px_0px_#000000] font-bold px-6 py-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSavingAll ? "Saving…" : "Save Changes"}
        </button>
      </div>

      {/* Mobile Save with Undo/Redo */}
      <div className="md:hidden">
        <div className="flex items-center px-2 py-3 justify-between ">
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
      <div className="flex flex-1 gap-8">
        {/* Phone Preview — mobile: smooth scale + translate when sheet is open (Linktree-style) */}
        <aside className="flex w-full md:w-[450px] md:min-w-[450px] justify-center mt-6 items-start">
          <motion.div
            className="relative w-full max-w-[360px] md:max-w-[420px] mx-auto origin-top"
            style={{ transformOrigin: "top center" }}
            animate={
              isMobile
                ? {
                    scale: isSheetOpen ? (activeTab === 2 || activeTab === 3 ? 0.58 : 0.55) : 1,
                    y: isSheetOpen ? (activeTab === 2 || activeTab === 3 ? "-3vh" : "-2vh") : 0,
                  }
                : { scale: 1, y: 0 }
            }
            transition={{
              type: "spring",
              stiffness: 340,
              damping: 30,
              mass: 0.8,
            }}
          >
            <div className="overflow-hidden">
              <PhoneDisplay
                buttonStyle={buttonStyle}
                fontStyle={fontStyle}
                selectedTheme={selectedTheme}
                profile={profile}
                links={profileLinks}
                phoneDisplayLoading={phoneDisplayLoading}
              />
            </div>
          </motion.div>
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
      <Sheet
        open={isMobile ? isSheetOpen : false}
        onOpenChange={(open) => {
          if (!isMobile) return;
          setIsSheetOpen(open);
        }}
      >
        <SheetContent
          side="bottom"
          className={`md:hidden  bg-white/95 backdrop-blur-sm shadow-lg p-0 overflow-hidden transition-all duration-300 ${activeTab === 2 || activeTab === 3 ? "h-[36vh]" : "h-[44vh]"
            }`}
          style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
        >
          <div className="h-full flex flex-col">
            {/* Sheet Header with handle */}
            <div className="flex flex-col">
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

            {/* Sheet Content */}
            <div className="flex-1 overflow-y-auto px-3 pt-2 pb-3">
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

      <MobileBottomNav/>
    </section>
  );
};

export default AppearancePage;
