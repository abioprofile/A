'use client';
import React, { useState } from 'react';
import ButtonCustomizer from './ButtonCustomizer';
import FontCustomizer, { FontStyle } from './FontCustomizer';
import { ButtonStyle } from '@/app/dashboard/appearance/page';

interface Props {
  buttonStyle: ButtonStyle;
  setButtonStyle: React.Dispatch<React.SetStateAction<ButtonStyle>>;
  fontStyle: FontStyle;
  setFontStyle: React.Dispatch<React.SetStateAction<FontStyle>>;
}

const ButtonAndFontTabs: React.FC<Props> = ({
  buttonStyle,
  setButtonStyle,
  fontStyle,
  setFontStyle,
}) => {
  const [subTab, setSubTab] = useState<'corner' | 'font'>('corner');

  return (
    <div className="bg-white shadow-sm  p-6">
      {/* Sub-tabs under Buttons */}
      <div className="flex justify-center items-center -mt-6 md:mt-0 md:justify-start mb-4">
        <button
          onClick={() => setSubTab('corner')}
          className={`px-4 py-2 font-semibold text-[15px] relative ${
            subTab === 'corner'
              ? 'text-black'
              : 'text-gray-400 hover:text-gray-700'
          }`}
        >
          Corner
          {subTab === 'corner' && (
            <span className="absolute bottom-1 left-0 right-0 h-0.5 bg-[#ff0000]" />
          )}
        </button>

        <button
          onClick={() => setSubTab('font')}
          className={`px-4 py-2 font-semibold text-[15px] relative ${
            subTab === 'font'
              ? 'text-black'
              : 'text-gray-400 hover:text-gray-700'
          }`}
        >
          Font
          {subTab === 'font' && (
            <span className="absolute bottom-1 left-0 right-0 h-0.5 bg-[#ff0000]" />
          )}
        </button>
      </div>

      {/* Sub-tab content */}
      <div>
         {subTab === 'font' && (
          <FontCustomizer
            fontStyle={fontStyle}
            setFontStyle={setFontStyle}
          />
        )}
        {subTab === 'corner' && (
          <ButtonCustomizer
            buttonStyle={buttonStyle}
            setButtonStyle={setButtonStyle}
          />
        )}
       
      </div>
    </div>
  );
};

export default ButtonAndFontTabs;
