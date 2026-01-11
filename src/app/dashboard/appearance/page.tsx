'use client';

import React, { useState } from 'react';
import { toast } from 'sonner';
import PhoneDisplay from '@/components/PhoneDisplay';
import ProfileContent from '@/components/ProfileContent';
import WallpaperSelector from '@/components/Wallpaper';
import FontCustomizer, { FontStyle } from '@/components/FontCustomizer';
import ThemeSelector from '@/components/ThemeSelector';
import ButtonAndFontTabs from '@/components/ButtonAndFontTabs';

//Shared style interface
export interface ButtonStyle {
  borderRadius: string;
  backgroundColor: string;
  borderColor: string;
  opacity: number;
  boxShadow: string;
}

const AppearancePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<number>(0);
  const [hoverTab, setHoverTab] = useState<number | null>(null);
  const menuItems = ['Profile', 'Style', 'Themes', 'Wallpaper'];

  //Button style handled by ButtonCustomizer
  const [buttonStyle, setButtonStyle] = useState<ButtonStyle>({
    borderRadius: '12px',
    backgroundColor: '#ffffff',
    borderColor: '#000000',
    opacity: 1,
    boxShadow: '2px 2px 6px rgba(0,0,0,0.2)',
  });

  const [fontStyle, setFontStyle] = useState<FontStyle>({
    fontFamily: 'Poppins',
    fillColor: '#000000',
    strokeColor: 'none',
    opacity: 100,
  });

  const [selectedTheme, setSelectedTheme] = useState<string>('/themes/theme1.png');
  const [profile, setProfile] = useState({
    profileImage: "/icons/Profile Picture.png",
    displayName: "",
    bio: "",
    location: "",
  });

  const handleSaveAll = () => {
    toast.success("All appearance settings saved successfully!");
  };

  return (
    <section className="min-h-screen bg-[#ffffff] pt-4 px-6 relative flex flex-col">
      {/* Fixed top bar */}
      <div className="flex justify-end items-end mr-6 mb-6">
        <button
          onClick={handleSaveAll}
          className="bg-[#FED45C] font-bold text-black px-6 py-2 text-[14px] hover:opacity-90 transition-all"
        >
          Save Changes
        </button>
      </div>

      {/*Content section: Phone + Customizer */}
      <div className="flex flex-1 gap-6">
        {/* Left: Phone preview */}
        <aside className="hidden md:flex justify-center w-[400px]">
          <div className="self-start">
            <PhoneDisplay
              buttonStyle={buttonStyle}
              fontStyle={fontStyle}
              selectedTheme={selectedTheme}
              profile={profile}
            />
          </div>
        </aside>

        {/* Right: Customizer */}
        <div className="flex-1 flex flex-col">
          {/* Tabs */}
          <div className="flex gap-20 border-b border-gray-200">
            {menuItems.map((item, index) => (
              <button
                key={item}
                onClick={() => setActiveTab(index)}
                onMouseEnter={() => setHoverTab(index)}
                onMouseLeave={() => setHoverTab(null)}
                className="px-2 py-3 text-sm font-bold relative focus:outline-none transition-colors duration-200"
              >
                {item}
                <span
                  className={`absolute bottom-0 left-0 right-0 h-0.5 bg-[#ff0000] transition-opacity duration-300 ${
                    activeTab === index
                      ? 'opacity-100'
                      : hoverTab === index
                      ? 'opacity-50'
                      : 'opacity-0'
                  }`}
                />
              </button>
            ))}
          </div>

          {/*Tab content */}
          <div className="mt-6">
  {activeTab === 0 && <ProfileContent onProfileUpdate={setProfile}    initialData={profile}
 />}

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
    </section>
  );
};

export default AppearancePage;







 
