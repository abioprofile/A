"use client";

import React, { useState } from "react";
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

  const menuItems = ["Profile", "Style", "Themes", "Wallpaper"];

  return (
    <section className="min-h-screen bg-[#Fff7de] md:bg-white pt-4 px-4 md:px-6 pb-24 flex flex-col relative">
      {/* Desktop Save Button*/}
      <div className="hidden md:flex justify-end mb-6">
        <button
          onClick={handleSaveAll}
          className="bg-[#FED45C] font-bold text-black px-6 py-2 text-sm"
        >
          Save Changes
        </button>
      </div>

      {/*Mobile Save Button*/}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-[#Fff7de] border-b px-4 py-3 flex justify-end">
        <button
          onClick={handleSaveAll}
          className="bg-[#FED45C] font-bold text-black px-4 py-2 text-sm"
        >
          Save
        </button>
      </div>

      {/* Main Layout*/}
      <div className="flex flex-1 gap-8 mt-16 md:mt-0">
        {/* ---------- Phone Display (ALL SCREENS) ---------- */}
        <aside className="flex w-full md:w-[450px] md:min-w-[450px] justify-center">
          <div className="w-full max-w-[360px] md:max-w-[400px]">
            <PhoneDisplay
              buttonStyle={buttonStyle}
              fontStyle={fontStyle}
              selectedTheme={selectedTheme}
              profile={profile}
              links={profileLinks}
            />
          </div>
        </aside>

        {/* ---------- Editor (DESKTOP ONLY) ---------- */}
        <div className="hidden md:flex flex-1 flex-col min-w-0">
          {/* Desktop Tabs */}
          <div className="flex gap-20 border-b border-gray-200">
            {menuItems.map((item, index) => (
              <button
                key={item}
                onClick={() => setActiveTab(index)}
                className="px-2 py-3 text-sm font-bold relative"
              >
                {item}
                {activeTab === index && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-500" />
                )}
              </button>
            ))}
          </div>

          {/* Tab Content */}
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

      {/*  Mobile Slide-up Sheet*/}
      {/* Overlay - Only show when sheet is open */}
      {isSheetOpen && (
        <div 
          className="md:hidden fixed inset-0 rounded-t-4xl shadow-2xl bg-opacity-50 z-40 transition-opacity duration-300"
          onClick={handleCloseSheet}
        />
      )}
      
      {/* Sheet Content */}
      <div 
        className={`md:hidden fixed bottom-0 left-0 right-0 bg-white rounded-t-4xl shadow-2xl shadow-[#000] z-50 transition-transform duration-300 ease-out ${
          isSheetOpen ? "translate-y-0" : "translate-y-full"
        }`}
      >
        {/* Sheet Header - Fixed */}
        <div className="px-6 pt-4 pb-2 border-b border-gray-200 sticky top-0 bg-white z-10">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold">
              {menuItems[activeTab]}
            </h3>
            <button 
              onClick={handleCloseSheet}
              className="p-2 text-gray-500 hover:text-gray-700"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Sheet Body with smooth scrolling */}
        <div className="h-[calc(80vh-60px)] overflow-y-auto overscroll-contain">
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

      {/*  Mobile Bottom Navigation */}
      <AppearanceBottomNav
        activeTab={activeTab}
        setActiveTab={handleTabClick}
      />
    </section>
  );
};

export default AppearancePage;