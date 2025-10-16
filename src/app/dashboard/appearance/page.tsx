'use client';

import React, { useState } from 'react';
import PhoneDisplay from '@/components/PhoneDisplay';
import ProfileContent, {profile} from '@/components/ProfileContent';
import ButtonCustomizer from '@/components/ButtonCustomizer';
import FontCustomizer, { FontStyle } from '@/components/FontCustomizer';
import ThemeSelector from '@/components/ThemeSelector';
// import ProfileContent, {profile} from "@/components/ProfileContent";

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
  const menuItems = ['Profile', 'Buttons', 'Fonts', 'Themes'];

  // Button state
  const [buttonStyle, setButtonStyle] = useState<ButtonStyle>({
    borderRadius: '12px',
    backgroundColor: '#EAEAEA',
    borderColor: '#000000',
    opacity: 1,
    boxShadow: 'none',
  });

  // Font state
  const [fontStyle, setFontStyle] = useState<FontStyle>({
    fontFamily: 'Poppins',
    fillColor: '#000000',
    strokeColor: '#ff0000',
    opacity: 100,
  });

  // Theme state
  const [selectedTheme, setSelectedTheme] = useState<string>('/themes/theme1.png');

  // Profile state
  const [profile, setProfile] = useState({
    profileImage: "/icons/profileplaceholder.png",
    displayName: "",
    bio: "",
    location: ""
  });

  return (
    <section className="flex min-h-screen bg-[#f8f9fd] p-6">
      {/* Left: Phone preview */}
      <aside className="hidden md:flex justify-center w-[400px] mr-6">
        <div className="sticky top-20">
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
              className={`px-2 py-3 text-sm font-bold relative focus:outline-none transition-colors duration-200 ${
                activeTab === index ? 'text-[#7140EB]' : 'hover:text-[#7140EB]'
              }`}
            >
              {item}
              <span
                className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#7140EB] to-[#FB8E8E] transition-opacity duration-300 ${
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

        {/* Content */}
        <div className="mt-6">
          {activeTab === 0 && <ProfileContent onProfileUpdate={setProfile} />}
          {activeTab === 1 && (
            <ButtonCustomizer buttonStyle={buttonStyle} setButtonStyle={setButtonStyle} />
          )}
          {activeTab === 2 && <FontCustomizer fontStyle={fontStyle} setFontStyle={setFontStyle} />}
          {activeTab === 3 && <ThemeSelector selectedTheme={selectedTheme} setSelectedTheme={setSelectedTheme} />}
        </div>
      </div>
    </section>
  );
};

export default AppearancePage;




 
