'use client';

import { useState } from 'react';
import { Poppins, Roboto, Inter, Montserrat, Lato } from 'next/font/google';

const poppins = Poppins({ subsets: ['latin'], weight: ['400', '600'] });
const roboto = Roboto({ subsets: ['latin'], weight: ['400', '500'] });
const inter = Inter({ subsets: ['latin'], weight: ['400', '500'] });
const montserrat = Montserrat({ subsets: ['latin'], weight: ['400', '500'] });
const lato = Lato({ subsets: ['latin'], weight: ['400', '700'] });

const fonts = [
  { label: 'Poppins', font: poppins },
  { label: 'Roboto', font: roboto },
  { label: 'Inter', font: inter },
  { label: 'Montserrat', font: montserrat },
  { label: 'Lato', font: lato },
];

export interface FontStyle {
  fontFamily: string;
  fillColor: string;
  strokeColor: string;
  opacity: number;
}

interface Props {
  fontStyle: FontStyle;
  setFontStyle: (style: FontStyle) => void;
}

export default function FontCustomizer({ fontStyle, setFontStyle }: Props) {
  const [selectedFont, setSelectedFont] = useState(
    fonts.find((f) => f.font.style.fontFamily === fontStyle.fontFamily) || fonts[0]
  );

  return (
    <div className="bg-white p-6 w-full border rounded-md">
      {/* Font Selector */}
      <div className="mb-4 w-full">
        <label className="block font-medium mb-2">Font</label>
        <select
          value={selectedFont.label}
          onChange={(e) => {
            const font = fonts.find((f) => f.label === e.target.value);
            if (font) {
              setSelectedFont(font);
              setFontStyle({ ...fontStyle, fontFamily: font.font.style.fontFamily });
            }
          }}
          className="border border-purple-500 bg-[#ECECED] w-full py-[6px] px-4"
          style={{ fontFamily: selectedFont.font.style.fontFamily }}
        >
          {fonts.map((font) => (
            <option key={font.label} value={font.label}>
              {font.label}
            </option>
          ))}
        </select>
      </div>

      {/* Fill Color */}
      <div className="mb-4 w-full">
        <label className="block font-medium mb-2">Fill Color</label>
        <div className="flex items-center gap-3 w-full">
          <input
            type="color"
            value={fontStyle.fillColor}
            onChange={(e) => setFontStyle({ ...fontStyle, fillColor: e.target.value })}
            className="w-10 h-10 cursor-pointer"
          />
          <span className="text-[12px] flex-1 bg-[#ECECED] border border-[#7E4FF3] px-2 py-[6px]">
            {fontStyle.fillColor}
          </span>
        </div>
      </div>

      {/* Stroke Color */}
      <div className="mb-4 w-full">
        <label className="block font-medium mb-2">Stroke Color</label>
        <div className="flex items-center gap-3 w-full">
          <input
            type="color"
            value={fontStyle.strokeColor}
            onChange={(e) => setFontStyle({ ...fontStyle, strokeColor: e.target.value })}
            className="w-10 h-10 cursor-pointer"
          />
          <span className="text-[12px] flex-1 bg-[#ECECED] border border-[#7E4FF3] px-2 py-[6px]">
            {fontStyle.strokeColor}
          </span>
        </div>
      </div>

      {/* Opacity */}
      <div className="w-full">
        <label className="block font-medium mb-2">Opacity</label>
        <div className="flex items-center bg-[#ECECED] border border-[#7E4FF3] py-[5px] px-[4px] gap-2 w-full">
          <input
            type="range"
            min="0"
            max="1"
            value={fontStyle.opacity}
            step="0.01"
            onChange={(e) =>
              setFontStyle({
                ...fontStyle,
                opacity: parseFloat(e.target.value),
              })
            }
            style={{
              background: `linear-gradient(to right, black ${fontStyle.opacity * 100}%, #e5e7eb ${fontStyle.opacity * 100}%)`,
            }}
            className="w-full h-[2px] rounded-lg appearance-none cursor-pointer 
              [&::-webkit-slider-thumb]:appearance-none 
              [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 
              [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-black 
              [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 
              [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-black"
          />
          
          <span className="text-sm font-medium w-12 text-center">
            {Math.round(fontStyle.opacity * 50)}%
          </span>
        </div>
      </div>
    </div>
  );
}



