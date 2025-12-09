'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Poppins,
  Roboto,
  Inter,
  Montserrat,
  Lato,
  Open_Sans,
  Raleway,
  Nunito,
  Ubuntu,
  Oswald,
  Merriweather,
  Playfair_Display,
  Rubik,
  Noto_Sans,
  Josefin_Sans,
  Quicksand,
  Work_Sans,
  Source_Sans_3,
  DM_Sans,
  Cabin,
  Fira_Sans,
  Karla,
  Manrope,
  Mukta,
  Heebo,
  Exo_2,
  Urbanist,
  IBM_Plex_Sans,
} from 'next/font/google';

// Load fonts
const poppins = Poppins({ subsets: ['latin'], weight: ['400', '600'] });
const roboto = Roboto({ subsets: ['latin'], weight: ['400', '500'] });
const inter = Inter({ subsets: ['latin'], weight: ['400', '500'] });
const montserrat = Montserrat({ subsets: ['latin'], weight: ['400', '500'] });
const lato = Lato({ subsets: ['latin'], weight: ['400', '700'] });
const openSans = Open_Sans({ subsets: ['latin'], weight: ['400', '600'] });
const raleway = Raleway({ subsets: ['latin'], weight: ['400', '600'] });
const nunito = Nunito({ subsets: ['latin'], weight: ['400', '600'] });
const ubuntu = Ubuntu({ subsets: ['latin'], weight: ['400', '500'] });
const oswald = Oswald({ subsets: ['latin'], weight: ['400', '500'] });
const merriweather = Merriweather({ subsets: ['latin'], weight: ['400', '700'] });
const playfair = Playfair_Display({ subsets: ['latin'], weight: ['400', '600'] });
const rubik = Rubik({ subsets: ['latin'], weight: ['400', '600'] });
const notoSans = Noto_Sans({ subsets: ['latin'], weight: ['400', '600'] });
const josefin = Josefin_Sans({ subsets: ['latin'], weight: ['400', '600'] });
const quicksand = Quicksand({ subsets: ['latin'], weight: ['400', '600'] });
const workSans = Work_Sans({ subsets: ['latin'], weight: ['400', '600'] });
const sourceSans = Source_Sans_3({ subsets: ['latin'], weight: ['400', '600'] });
const dmSans = DM_Sans({ subsets: ['latin'], weight: ['400', '600'] });
const cabin = Cabin({ subsets: ['latin'], weight: ['400', '600'] });
const firaSans = Fira_Sans({ subsets: ['latin'], weight: ['400', '600'] });
const karla = Karla({ subsets: ['latin'], weight: ['400', '600'] });
const manrope = Manrope({ subsets: ['latin'], weight: ['400', '600'] });
const mukta = Mukta({ subsets: ['latin'], weight: ['400', '600'] });
const heebo = Heebo({ subsets: ['latin'], weight: ['400', '600'] });
const exo2 = Exo_2({ subsets: ['latin'], weight: ['400', '600'] });
const urbanist = Urbanist({ subsets: ['latin'], weight: ['400', '600'] });
const ibmPlexSans = IBM_Plex_Sans({ subsets: ['latin'], weight: ['400', '600'] });

const fonts = [
  { label: 'Poppins', font: poppins },
  { label: 'Roboto', font: roboto },
  { label: 'Inter', font: inter },
  { label: 'Montserrat', font: montserrat },
  { label: 'Lato', font: lato },
  { label: 'Open Sans', font: openSans },
  { label: 'Raleway', font: raleway },
  { label: 'Nunito', font: nunito },
  { label: 'Ubuntu', font: ubuntu },
  { label: 'Oswald', font: oswald },
  { label: 'Merriweather', font: merriweather },
  { label: 'Playfair Display', font: playfair },
  { label: 'Rubik', font: rubik },
  { label: 'Noto Sans', font: notoSans },
  { label: 'Josefin Sans', font: josefin },
  { label: 'Quicksand', font: quicksand },
  { label: 'Work Sans', font: workSans },
  { label: 'Source Sans 3', font: sourceSans },
  { label: 'DM Sans', font: dmSans },
  { label: 'Cabin', font: cabin },
  { label: 'Fira Sans', font: firaSans },
  { label: 'Karla', font: karla },
  { label: 'Manrope', font: manrope },
  { label: 'Mukta', font: mukta },
  { label: 'Heebo', font: heebo },
  { label: 'Exo 2', font: exo2 },
  { label: 'Urbanist', font: urbanist },
  { label: 'IBM Plex Sans', font: ibmPlexSans },
];

export interface FontStyle {
  fontFamily: string;
  fillColor: string;
  strokeColor: string;
  strokeWidth?: number;
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
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-white p-6 w-full relative">
      {/* Font Selector */}
      <div className="mb-4 w-full">
        <label className="block text-[13px] font-semibold mb-2">Font</label>
        <button
          onClick={() => setOpen((prev) => !prev)}
          className="w-full flex justify-between items-center border text-[12px] border-[#000] bg-[#ECECED] px-4 py-[6px]"
          style={{ fontFamily: selectedFont.font.style.fontFamily }}
        >
          <span className="truncate">{selectedFont.label}</span>
          <span className="text-xs">{open ? '▲' : '▼'}</span>
        </button>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="absolute z-50 w-[90%] bg-white border border-black mt-2 max-h-[240px] overflow-y-auto shadow-md"
            >
              {fonts.map((font) => (
                <button
                  key={font.label}
                  onClick={() => {
                    setSelectedFont(font);
                    setFontStyle({
                      ...fontStyle,
                      fontFamily: font.font.style.fontFamily,
                      strokeWidth: 0, // fixed tiny stroke
                    });
                    setOpen(false);
                  }}
                  style={{ fontFamily: font.font.style.fontFamily }}
                  className={`block w-full text-left px-4 py-2 text-sm hover:bg-[#ECECED] ${
                    selectedFont.label === font.label ? 'bg-[#DCDCDC]' : ''
                  }`}
                >
                  {font.label}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Fill Color */}
      <div className="mb-4 w-full">
        <label className="block text-[13px] font-semibold mb-2">Fill Color</label>
        <div className="flex items-center gap-3 w-full">
          <input
            type="color"
            value={fontStyle.fillColor}
            onChange={(e) => setFontStyle({ ...fontStyle, fillColor: e.target.value })}
            className="w-10 h-10 cursor-pointer"
          />
          <span className="text-[10px] flex-1 bg-[#ECECED] border border-[#000] px-2 py-[6px]">
            {fontStyle.fillColor}
          </span>
        </div>
      </div>

      {/* Stroke Color */}
<div className="mb-4 w-full">
  <label className="block text-[13px] font-semibold mb-2">Stroke Color</label>
  <div className="flex items-center gap-3 w-full">
    <div className="relative">
      <input
        type="color"
        value={fontStyle.strokeColor || '#000000'}
        onChange={(e) =>
          setFontStyle({ ...fontStyle, strokeColor: e.target.value })
        }
        className="w-9 h-9 cursor-pointer opacity-0 absolute z-10"
      />
      <div 
        className={`w-10 h-10 border-2  flex items-center justify-center cursor-pointer ${
          !fontStyle.strokeColor 
            ? 'border-dashed border-gray-400 bg-white' 
            : 'border-solid border-gray-300'
        }`}
        style={{
          backgroundColor: fontStyle.strokeColor || 'transparent'
        }}
      >
        {!fontStyle.strokeColor && (
          <span className="text-[10px] text-gray-500 font-medium">None</span>
        )}
      </div>
    </div>
    <span className="text-[13px] flex-1 bg-[#ECECED] border border-[#000] px-2 py-[6px]">
      {fontStyle.strokeColor || 'none'}
    </span>
  </div>
</div>
    </div>
  );
}





