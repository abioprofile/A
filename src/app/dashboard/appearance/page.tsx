"use client";

import React, { useState, useRef, useEffect } from "react";
import { toast } from "sonner";

import PhoneDisplay from "@/components/PhoneDisplay";
import { useGetAllLinks } from "@/hooks/api/useAuth";
import ProfileContent from "@/components/ProfileContent";
import WallpaperSelector from "@/components/Wallpaper";
import ThemeSelector from "@/components/ThemeSelector";
import ButtonAndFontTabs from "@/components/ButtonAndFontTabs";
import AppearanceBottomNav from "@/components/AppearanceBottomNav";
import FontCustomizer, { FontStyle } from "@/components/FontCustomizer";

/* ----------------------------------
   Shared interfaces
-----------------------------------*/
export interface ButtonStyle {
  borderRadius: string;
  backgroundColor: string;
  borderColor: string;
  opacity: number;
  boxShadow: string;
}

/* ----------------------------------
   Appearance Page
-----------------------------------*/
const AppearancePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<number>(0);
  const [isSheetOpen, setIsSheetOpen] = useState<boolean>(false);
  const sheetRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  // Swipe handling
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const minSwipeDistance = 50;

  const [buttonStyle, setButtonStyle] = useState<ButtonStyle>({
    borderRadius: "12px",
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

  const [profile, setProfile] = useState({
    profileImage: "/icons/Profile Picture.png",
    displayName: "",
    bio: "",
    location: "",
  });

  const { data: linksData } = useGetAllLinks();

  const profileLinks = linksData?.data
    ? Array.isArray(linksData.data)
      ? linksData.data
      : []
    : [];

  const handleSaveAll = () => {
    toast.success("All appearance settings saved successfully!");
  };

  const handleTabClick = (index: number) => {
    setActiveTab(index);
    setIsSheetOpen(true);
  };

  const handleCloseSheet = () => {
    setIsSheetOpen(false);
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) handleCloseSheet();
  };

  // Swipe to close
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientY);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientY);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    if (touchStart - touchEnd < -minSwipeDistance) {
      handleCloseSheet();
    }
  };

  // ESC key close
  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isSheetOpen) handleCloseSheet();
    };
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [isSheetOpen]);

  // Prevent body scroll
  useEffect(() => {
    document.body.style.overflow = isSheetOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isSheetOpen]);

  const menuItems = ["Profile", "Style", "Themes", "Wallpaper"];

  return (
    <section className="min-h-screen bg-[#FFF7DE] md:bg-white pt-4 px-4 md:px-6 pb-24 flex flex-col relative">
      {/* Desktop Save */}
      <div className="hidden md:flex justify-end mb-6">
        <button
          onClick={handleSaveAll}
          className="bg-[#FED45C] font-bold px-6 py-2 text-sm"
        >
          Save Changes
        </button>
      </div>

      {/* Mobile Save */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 border-b px-4  mt-4 mb-8 ">
        <div className="">
          <div className="flex items-center justify-between">
            <button
              // onClick={() => setShowMobileLinks(false)}
              className="font-bold text-[#331400]"
            >
              ← Appearance
            </button>
            <button className="text-[#FED45C] text-[11px] font-semibold bg-[#331400] px-6 py-1">
              Save
            </button>
          </div>
        </div>
      </div>

      {/* Main Layout */}
      <div className="flex flex-1 gap-8 mt-16 md:mt-0">
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
            <div className=" overflow-hidden">
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

          <div className="mt-6">
            {activeTab === 0 && (
              <ProfileContent
                onProfileUpdate={setProfile}
                initialData={profile}
              />
            )}
            {activeTab === 1 && (
              <ButtonAndFontTabs
                buttonStyle={buttonStyle}
                setButtonStyle={setButtonStyle}
                fontStyle={fontStyle}
                setFontStyle={setFontStyle}
              />
            )}
            {activeTab === 2 && (
              <ThemeSelector
                selectedTheme={selectedTheme}
                setSelectedTheme={setSelectedTheme}
              />
            )}
            {activeTab === 3 && (
              <WallpaperSelector
                selectedTheme={selectedTheme}
                setSelectedTheme={setSelectedTheme}
              />
            )}
          </div>
        </div>
      </div>

      {/* Mobile Overlay */}
      {isSheetOpen && (
        <div
          ref={overlayRef}
          className="md:hidden fixed inset-0  z-40"
          onClick={handleOverlayClick}
        />
      )}

      {/* Mobile Sheet */}
      <div
        ref={sheetRef}
        className={`md:hidden fixed bottom-0 left-0 right-0 bg-white rounded-t-4xl z-50
          transition-transform duration-300 ease-out
          ${isSheetOpen ? "translate-y-0" : "translate-y-full"}`}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
        </div>

        <div className="h-[calc(80vh-300px)] overflow-y-auto">
          <div className="px-6 py-4">
            {activeTab === 0 && (
              <ProfileContent
                onProfileUpdate={setProfile}
                initialData={profile}
              />
            )}
            {activeTab === 1 && (
              <ButtonAndFontTabs
                buttonStyle={buttonStyle}
                setButtonStyle={setButtonStyle}
                fontStyle={fontStyle}
                setFontStyle={setFontStyle}
              />
            )}
            {activeTab === 2 && (
              <ThemeSelector
                selectedTheme={selectedTheme}
                setSelectedTheme={setSelectedTheme}
              />
            )}
            {activeTab === 3 && (
              <WallpaperSelector
                selectedTheme={selectedTheme}
                setSelectedTheme={setSelectedTheme}
              />
            )}
          </div>
        </div>
      </div>

      {/* Mobile Bottom Nav */}
      <AppearanceBottomNav
        activeTab={activeTab}
        setActiveTab={handleTabClick}
      />
    </section>
  );
};

export default AppearancePage;
