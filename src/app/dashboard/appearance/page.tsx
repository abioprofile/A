'use client';

import React, { useState } from 'react';
import PhoneDisplay from '@/components/PhoneDisplay';
import ProfileContent from '@/components/ProfileContent';
import ButtonCustomizer from '@/components/ButtonCustomizer';
import FontCustomizer, { FontStyle } from '@/components/FontCustomizer';
import ThemeSelector from '@/components/ThemeSelector';
import { toast } from 'sonner';
import ButtonAndFontTabs from '@/components/ButtonAndFontTabs';

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

 const [buttonStyle, setButtonStyle] = useState<ButtonStyle>({
  borderRadius: '12px',
  backgroundColor: 'none',
  borderColor: '#000000',
  opacity: 1,
  boxShadow: 'none',
});


  const [fontStyle, setFontStyle] = useState<FontStyle>({
    fontFamily: 'Poppins',
    fillColor: '#000000',
    strokeColor: '#ff0000',
    opacity: 100,
  });

  const [selectedTheme, setSelectedTheme] = useState<string>('/themes/theme1.png');
  const [profile, setProfile] = useState({
    profileImage: "/icons/profileplaceholder.png",
    displayName: "",
    bio: "",
    location: ""
  });

  const handleSaveAll = () => {
    toast.success("All appearance settings saved successfully!");
  };

  return (
    <section className="min-h-screen bg-[#f8f9fd] px-6 relative flex flex-col">
      {/* ✅ Fixed top bar with Save Changes */}
      <div className="flex justify-end items-end mr-6 mb-6">
        {/* <h1 className="text-xl font-bold text-gray-800">Appearance Settings</h1> */}
        <button
          onClick={handleSaveAll}
          className="bg-[#FED45C] font-bold text-black px-6 py-2 text-[14px]  hover:opacity-90 transition-all "
        >
          Save Changes
        </button>
      </div>

      {/* ✅ Content section: Phone + Customizer on same height */}
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
          <div className="flex gap-8 border-b border-gray-200">
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

          {/* Tab content */}
          <div className="mt-6">
            {activeTab === 0 && <ProfileContent onProfileUpdate={setProfile} />}
            {activeTab === 1 && (
            <ButtonAndFontTabs          buttonStyle={buttonStyle}
              setButtonStyle={setButtonStyle}
              fontStyle={fontStyle}
              setFontStyle={setFontStyle}
            />
          )}

            {activeTab === 2 && <FontCustomizer fontStyle={fontStyle} setFontStyle={setFontStyle} />}
            {activeTab === 3 && <ThemeSelector selectedTheme={selectedTheme} setSelectedTheme={setSelectedTheme} />}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AppearancePage;






 
