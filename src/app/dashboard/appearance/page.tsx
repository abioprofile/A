"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import { ChevronLeft, RotateCcw, RotateCw } from "lucide-react";
import PhoneDisplay from "@/components/PhoneDisplay";
import { useGetAllLinks } from "@/hooks/api/useAuth";
import ProfileContent from "@/components/ProfileContent";
import WallpaperSelector from "@/components/Wallpaper";
import ThemeSelector from "@/components/ThemeSelector";
import ButtonAndFontTabs from "@/components/ButtonAndFontTabs";
import AppearanceBottomNav from "@/components/AppearanceBottomNav";
import FontCustomizer, { FontStyle } from "@/components/FontCustomizer";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
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

interface AppState {
  buttonStyle: ButtonStyle;
  fontStyle: FontStyle;
  selectedTheme: string;
  profile: {
    profileImage: string;
    displayName: string;
    bio: string;
    location: string;
  };
}

/* Appearance Page*/
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

  // Undo/Redo state
  const [history, setHistory] = useState<AppState[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);

  const getCurrentState = (): AppState => ({
    buttonStyle,
    fontStyle,
    selectedTheme,
    profile,
  });

  const addToHistory = (newState: AppState) => {
    setHistory((prev) => {
      const newHistory = prev.slice(0, historyIndex + 1);
      newHistory.push(newState);
      return newHistory;
    });
    setHistoryIndex((prev) => prev + 1);
  };

  const undo = () => {
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
  };

  const redo = () => {
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
  };

  const handleStateChange = () => {
    addToHistory(getCurrentState());
  };

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
    <section className="min-h-screen bg-[#FFF7DE]  md:bg-white md:pt-4 px-4 md:px-6 md:pb-24 flex flex-col relative">
      {/* Desktop Save */}
      <div className="hidden md:flex justify-end mb-4 ">
        <button
          onClick={handleSaveAll}
          className="bg-[#FED45C] cursor-pointer font-bold px-6 py-2 text-sm"
        >
          Save Changes
        </button>
      </div>

      {/* Mobile Save with Undo/Redo */}
      <div className="md:hidden">
        <div className="flex items-center px-2 py-3 justify-between mb-8">
          <button className="font-extrabold text-[20px] text-[#331400]">
            <ChevronLeft className="inline mr-2" />
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
              onClick={handleSaveAll}
              className="text-[#331400] text-[13px] shadow-[4px_4px_0px_0px_#000000] font-semibold bg-[#fed45c] px-4 py-2"
            >
              Save
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

          <div className="md:mt-6">
            {activeTab === 0 && (
              <ProfileContent
                onProfileUpdate={(updatedProfile) => {
                  setProfile(updatedProfile);
                  handleStateChange();
                }}
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
              />
            )}
          </div>
        </div>
      </div>

      {/* Mobile Sheet */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent
          side="bottom"
          className={`rounded-t-4xl shadow-2xl p-0 overflow-hidden transition-all duration-300 ${
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
                    {menuItems[activeTab]}
                  </SheetTitle>
                </div>
              </SheetHeader>
            </div>

            {/* Sheet Content */}
            <div className="flex-1 overflow-y-auto px-2 md:py-4">
              {activeTab === 0 && (
                <ProfileContent
                  onProfileUpdate={(updatedProfile) => {
                    setProfile(updatedProfile);
                    handleStateChange();
                  }}
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
                />
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Mobile Bottom Nav - This triggers the sheet */}
      <AppearanceBottomNav
        activeTab={activeTab}
        setActiveTab={handleTabClick}
      />
    </section>
  );
};

export default AppearancePage;