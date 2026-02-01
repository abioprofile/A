'use client';
import Image from "next/image";
import React, { useState } from 'react';
import { ButtonStyle } from '../app/dashboard/appearance/page';

interface ButtonCustomizerProps {
  buttonStyle: ButtonStyle;
  setButtonStyle: React.Dispatch<React.SetStateAction<ButtonStyle>>;
}

const COLORS = [
  "#000000", // black
  "#6B7280", // gray
  "#EF4444", // red
  "#F97316", // orange
  "#22C55E", // green
  "#3B82F6", // blue
  "#8B5CF6", // violet
  "#EC4899", // pink
  "#FFFFFF", // white
  "#FBBF24", // yellow
];

const ButtonCustomizer: React.FC<ButtonCustomizerProps> = ({ buttonStyle, setButtonStyle }) => {
  const [showMobileFillPicker, setShowMobileFillPicker] = useState(false);
  const [showMobileStrokePicker, setShowMobileStrokePicker] = useState(false);

  return (
    <>
      {/* MOBILE VIEW */}
      <div className="md:hidden space-y-4 overflow-y-auto scrollbar-hide max-h-[400px] pr-2">
        {/* Corner */}
        <div>
          <div className="flex gap-12 mt-2">
            <button
              onClick={() => setButtonStyle(s => ({ ...s, borderRadius: '0px' }))}
              className="flex-1 flex flex-col items-center gap-1 text-[10px] py-3 bg-[#D9D9D9]"
            >
              <Image 
                src="/icons/sharpedge.svg" 
                alt="Sharp"
                width={16}
                height={16}
              />
              Sharp
            </button>

            <button
              onClick={() => setButtonStyle(s => ({ ...s, borderRadius: '12px' }))}
              className="flex-1 flex flex-col items-center gap-1 text-[10px] rounded-md py-3 bg-[#D9D9D9]"
            >
              <Image 
                src="/icons/curvededge.svg" 
                alt="Curved"
                width={16}
                height={16}
              />
              Curved
            </button>

            <button
              onClick={() => setButtonStyle(s => ({ ...s, borderRadius: '9999px' }))}
              className="flex-1 flex flex-col items-center rounded-full gap-1 text-[10px] py-3 bg-[#D9D9D9]"
            >
              <Image 
                src="/icons/roundedge.svg" 
                alt="Round"
                width={16}
                height={16}
              />
              Round
            </button>
          </div>
        </div>

        {/* Color */}
        <div>
          <h3 className="font-semibold text-[15px] mb-3 relative inline-block">
            Color
          </h3>

          {/* Fill Color */}
          <div className="flex items-center justify-between mb-2">
            <label className="block text-[12px] font-semibold">Fill</label>
            <label className="relative cursor-pointer">
             
              <input
                type="color"
                value={buttonStyle.backgroundColor}
                onChange={e => setButtonStyle(s => ({ ...s, backgroundColor: e.target.value }))}
                className="hidden"
                aria-label="Custom fill color picker"
              />
            </label>
          </div>
          <div className="overflow-x-auto pb-2 scrollbar-hide mb-4">
            <div className="flex gap-2 min-w-max">
              {/* Color picker button - First box */}
              <label className="relative cursor-pointer w-10 h-10 flex-shrink-0">
                <div 
                  className="w-full h-full border-2 border-gray-300 flex items-center justify-center transition-transform hover:scale-110"
                  style={{
                    background: 'linear-gradient(45deg, #FF0000, #FF9900, #FFFF00, #00FF00, #00FFFF, #0000FF, #9900FF, #FF00FF)',
                    borderColor: showMobileFillPicker ? '#000' : '#ccc',
                    boxShadow: showMobileFillPicker ? '0 0 0 2px #fff, 0 0 0 4px #000' : 'none'
                  }}
                >
                  <span className="text-[12px] font-bold text-white">+</span>
                </div>
                <input
                  type="color"
                  value={buttonStyle.backgroundColor}
                  onChange={e => setButtonStyle(s => ({ ...s, backgroundColor: e.target.value }))}
                  className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                  onClick={() => setShowMobileFillPicker(true)}
                  onBlur={() => setShowMobileFillPicker(false)}
                  aria-label="Custom fill color picker"
                />
              </label>
              
              {/* Rest of the color swatches */}
              {COLORS.map((c) => (
                <button
                  key={`fill-${c}`}
                  onClick={() => setButtonStyle(s => ({ ...s, backgroundColor: c }))}
                  className="w-10 h-10 border-2 transition-transform hover:scale-110 flex-shrink-0"
                  style={{
                    backgroundColor: c,
                    borderColor: buttonStyle.backgroundColor === c ? '#000' : '#ccc',
                    boxShadow: buttonStyle.backgroundColor === c ? '0 0 0 2px #fff, 0 0 0 4px #000' : 'none'
                  }}
                  aria-label={`Select fill color ${c}`}
                />
              ))}
            </div>
          </div>
          
          {/* Opacity (background only) */}
          <div className="mt-4">
            <label className="block text-[12px] font-semibold mb-2">Opacity</label>
            <div className="flex items-center md:bg-[#ECECED] rounded-full md:border-4 md:border-[#000] py-[5px] px-[4px] gap-2">
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={buttonStyle.opacity}
                onChange={e =>
                  setButtonStyle(s => ({ ...s, opacity: parseFloat(e.target.value) }))
                }
                style={{
                  background: `linear-gradient(to right, black ${buttonStyle.opacity * 100}%, #ff0000 ${buttonStyle.opacity * 100}%)`,
                }}
                className="w-full h-[2px] rounded-lg pl-2 appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-black [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-black"
              />
              <span className="text-sm font-medium w-12 text-center">
                {Math.round(buttonStyle.opacity * 50)}%
              </span>
            </div>
          </div>
          
          {/* Stroke Color */}
          <div className="flex items-center justify-between mb-2">
            <label className="block text-[12px] font-semibold">Stroke</label>
            <label className="relative cursor-pointer">
              
              <input
                type="color"
                value={buttonStyle.borderColor}
                onChange={e => setButtonStyle(s => ({ ...s, borderColor: e.target.value }))}
                className="hidden"
                aria-label="Custom stroke color picker"
              />
            </label>
          </div>
          <div className="overflow-x-auto pb-2 scrollbar-hide mb-4">
            <div className="flex gap-2 min-w-max">
              {/* Color picker button - First box */}
              <label className="relative cursor-pointer w-10 h-10 flex-shrink-0">
                <div 
                  className="w-full h-full border-2 border-gray-300 flex items-center justify-center transition-transform hover:scale-110"
                  style={{
                    background: 'linear-gradient(45deg, #FF0000, #FF9900, #FFFF00, #00FF00, #00FFFF, #0000FF, #9900FF, #FF00FF)',
                    borderColor: showMobileStrokePicker ? '#000' : '#ccc',
                    boxShadow: showMobileStrokePicker ? '0 0 0 2px #fff, 0 0 0 4px #000' : 'none'
                  }}
                >
                  <span className="text-[12px] font-bold text-white">+</span>
                </div>
                <input
                  type="color"
                  value={buttonStyle.borderColor}
                  onChange={e => setButtonStyle(s => ({ ...s, borderColor: e.target.value }))}
                  className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                  onClick={() => setShowMobileStrokePicker(true)}
                  onBlur={() => setShowMobileStrokePicker(false)}
                  aria-label="Custom stroke color picker"
                />
              </label>
              
              {/* Rest of the color swatches */}
              {COLORS.map((c) => (
                <button
                  key={`stroke-${c}`}
                  onClick={() => setButtonStyle(s => ({ ...s, borderColor: c }))}
                  className="w-10 h-10 border-2 transition-transform hover:scale-110 flex-shrink-0"
                  style={{
                    backgroundColor: c,
                    borderColor: buttonStyle.borderColor === c ? '#000' : '#ccc',
                    boxShadow: buttonStyle.borderColor === c ? '0 0 0 2px #fff, 0 0 0 4px #000' : 'none'
                  }}
                  aria-label={`Select stroke color ${c}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Effect */}
        <div>
          <h3 className="font-semibold text-[15px] mb-2 relative inline-block">
            Effect
          </h3>
          <p className="text-[12px] font-medium">Drop Shadow</p>
          <div className="flex w-full gap-4 my-2">
            {/* No Shadow */}
            <button
              onClick={() => setButtonStyle(s => ({ ...s, boxShadow: 'none', shadowColor: '#000000' }))}
              className="flex-1 flex flex-col items-center gap-1 text-[10px] py-4 bg-[#D9D9D9]"
            >
              <Image
                src="/icons/tabler_shadowoff.svg"
                alt="None"
                width={24}
                height={24}
              />
              None
            </button>

            {/* Soft Shadow - 50% opacity (80 in hex) */}
            <button
              onClick={() =>
                setButtonStyle(s => ({
                  ...s,
                  boxShadow: `2px 2px 6px ${s.shadowColor || '#000000'}80`,
                }))
              }
              className="flex-1 flex flex-col items-center gap-1 text-[10px] py-4 bg-[#D9D9D9]"
              style={{
                boxShadow: `2px 2px 6px ${buttonStyle.shadowColor || '#000000'}80`
              }}
            >
              <Image
                src="/icons/tabler_shadow.svg"
                alt="Soft Shadow"
                width={24}
                height={24}
              />
              Soft Shadow
            </button>

            {/* Hard Shadow - 100% opacity (no alpha channel) */}
            <button
              onClick={() =>
                setButtonStyle(s => ({
                  ...s,
                  boxShadow: `4px 4px 0px 0px ${s.shadowColor || '#000000'}`,
                }))
              }
              className="flex-1 flex flex-col items-center gap-1 text-[10px] py-4 bg-[#D9D9D9]"
              style={{
                boxShadow: `4px 4px 0px 0px ${buttonStyle.shadowColor || '#000000'}`
              }}
            >
              <Image
                src="/icons/tablerhard.svg"
                alt="Hard Shadow"
                width={20}
                height={20}
              />
              Hard Shadow
            </button>
          </div>

          {/* Shadow Color */}
          <label className="block text-[12px] font-semibold mt-3 mb-2">Shadow Color</label>
          <div className="overflow-x-auto pb-2 scrollbar-hide">
            <div className="flex gap-2 min-w-max">
              {COLORS.map((c) => (
                <button
                  key={`shadow-${c}`}
                  onClick={() => {
                    const currentShadow = buttonStyle.boxShadow;
                    if (currentShadow && currentShadow !== 'none') {
                      if (currentShadow.includes('2px 2px 6px')) {
                        setButtonStyle(s => ({ ...s, shadowColor: c, boxShadow: `2px 2px 6px ${c}80` }));
                      } else if (currentShadow.includes('4px 4px 0px')) {
                        setButtonStyle(s => ({ ...s, shadowColor: c, boxShadow: `4px 4px 0px 0px ${c}` }));
                      }
                    } else {
                      setButtonStyle(s => ({ ...s, shadowColor: c }));
                    }
                  }}
                  className="w-10 h-10 border-2 transition-transform hover:scale-110 flex-shrink-0"
                  style={{
                    backgroundColor: c,
                    borderColor: buttonStyle.shadowColor === c ? '#000' : '#ccc',
                    boxShadow: buttonStyle.shadowColor === c ? '0 0 0 2px #fff, 0 0 0 4px #000' : 'none'
                  }}
                  aria-label={`Select shadow color ${c}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* DESKTOP VIEW */}
      <div className="hidden md:block space-y-4 overflow-y-auto max-h-[400px] pr-2">
        {/* Corner */}
        <div>
          <div className="flex md:w-3/4 gap-12 mt-2">
            <button
              onClick={() => setButtonStyle(s => ({ ...s, borderRadius: '0px' }))}
              className="flex-1 flex flex-col items-center gap-1 text-[10px] py-3 bg-[#D9D9D9]"
            >
              <Image 
                src="/icons/sharpedge.svg" 
                alt="Sharp"
                width={16}
                height={16}
              />
              Sharp
            </button>

            <button
              onClick={() => setButtonStyle(s => ({ ...s, borderRadius: '12px' }))}
              className="flex-1 flex flex-col items-center gap-1 text-[10px] rounded-md py-3 bg-[#D9D9D9]"
            >
              <Image 
                src="/icons/curvededge.svg" 
                alt="Curved"
                width={16}
                height={16}
              />
              Curved
            </button>

            <button
              onClick={() => setButtonStyle(s => ({ ...s, borderRadius: '9999px' }))}
              className="flex-1 flex flex-col items-center rounded-full gap-1 text-[10px] py-3 bg-[#D9D9D9]"
            >
              <Image 
                src="/icons/roundedge.svg" 
                alt="Round"
                width={16}
                height={16}
              />
              Round
            </button>
          </div>
        </div>

        {/* Color */}
        <div>
          <h3 className="font-semibold text-[15px] mb-1 relative inline-block">
            Color
          </h3>

          {/* Fill Color */}
          <label className="block text-[12px] font-semibold mt-2">Fill</label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              className="w-10 h-10"
              value={buttonStyle.backgroundColor}
              onChange={e =>
                setButtonStyle(s => ({ ...s, backgroundColor: e.target.value }))
              }
            />
          </div>

          {/* Stroke Color */}
          <label className="block text-[12px] font-semibold mt-2">Stroke</label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              className="w-10 h-10"
              value={buttonStyle.borderColor}
              onChange={e =>
                setButtonStyle(s => ({ ...s, borderColor: e.target.value }))
              }
            />
          </div>

          {/* Opacity (background only) */}
          <div className="mt-4">
            <label className="block text-[12px] font-semibold mb-2">Opacity</label>
            <div className="flex items-center bg-[#ECECED] rounded-full border-4 border-[#000] py-[5px] px-[4px] gap-2">
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={buttonStyle.opacity}
                onChange={e =>
                  setButtonStyle(s => ({ ...s, opacity: parseFloat(e.target.value) }))
                }
                style={{
                  background: `linear-gradient(to right, black ${buttonStyle.opacity * 100}%, #ff0000 ${buttonStyle.opacity * 100}%)`,
                }}
                className="w-full h-[2px] rounded-lg pl-2 appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-black [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-black"
              />
              <span className="text-sm font-medium w-12 text-center">
                {Math.round(buttonStyle.opacity * 50)}%
              </span>
            </div>
          </div>
        </div>

        {/* Effect */}
        <div>
          <h3 className="font-semibold text-[15px] mb-2 relative inline-block">
            Effect
          </h3>
          <p className="text-[12px] font-medium">Drop Shadow</p>
          <div className="flex w-full gap-4 my-2">
            {/* No Shadow */}
            <button
              onClick={() => setButtonStyle(s => ({ ...s, boxShadow: 'none', shadowColor: '#000000' }))}
              className="flex-1 flex flex-col items-center gap-1 text-[10px] py-4 bg-[#D9D9D9]"
            >
              <Image
                src="/icons/tabler_shadowoff.svg"
                alt="None"
                width={24}
                height={24}
              />
              None
            </button>

            {/* Soft Shadow - 50% opacity (80 in hex) */}
            <button
              onClick={() =>
                setButtonStyle(s => ({
                  ...s,
                  boxShadow: `2px 2px 6px ${s.shadowColor || '#000000'}80`,
                }))
              }
              style={{
                boxShadow: `2px 2px 6px ${buttonStyle.shadowColor || '#000000'}80`
              }}
              className="flex-1 flex flex-col items-center gap-1 text-[10px] py-4 bg-[#D9D9D9]"
            >
              <Image
                src="/icons/tabler_shadow.svg"
                alt="Soft Shadow"
                width={24}
                height={24}
              />
              Soft Shadow
            </button>

            {/* Hard Shadow - 100% opacity (no alpha channel) */}
            <button
              onClick={() =>
                setButtonStyle(s => ({
                  ...s,
                  boxShadow: `0px 0px 0px 0px ${s.shadowColor || '#000000'}`,
                }))
              }
              style={{
                boxShadow: `0px 0px 0px 0px ${buttonStyle.shadowColor || '#000000'}`
              }}
              className="flex-1 flex flex-col items-center gap-1 text-[10px] py-4 bg-[#D9D9D9]"
            >
              <Image
                src="/icons/tablerhard.svg"
                alt="Hard Shadow"
                width={20}
                height={20}
              />
              Hard Shadow
            </button>
          </div>

          {/* Shadow Color */}
          <label className="block text-[12px] font-semibold mt-3 mb-2">Shadow Color</label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              className="w-10 h-10"
              value={buttonStyle.shadowColor || '#000000'}
              onChange={e => {
                const newColor = e.target.value;
                setButtonStyle(s => {
                  const currentShadow = s.boxShadow;
                  let newShadow = currentShadow;
                  if (currentShadow && currentShadow !== 'none') {
                    if (currentShadow.includes('2px 2px 6px')) {
                      newShadow = `2px 2px 6px ${newColor}80`; // Changed 33 to 80
                    } else if (currentShadow.includes('4px 4px 0px')) {
                      newShadow = `4px 4px 0px 0px ${newColor}`;
                    }
                  }
                  return { ...s, shadowColor: newColor, boxShadow: newShadow };
                });
              }}
            />
            <span className="text-[12px] bg-[#ECECED] border border-[#000] w-full pl-2 py-[5px]">{buttonStyle.shadowColor || '#000000'}</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default ButtonCustomizer;