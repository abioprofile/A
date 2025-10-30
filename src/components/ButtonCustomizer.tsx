'use client';
import Image from "next/image";
import React from 'react';
import { ButtonStyle } from '../app/dashboard/appearance/page';

interface ButtonCustomizerProps {
  buttonStyle: ButtonStyle;
  setButtonStyle: React.Dispatch<React.SetStateAction<ButtonStyle>>;
}

const ButtonCustomizer: React.FC<ButtonCustomizerProps> = ({ buttonStyle, setButtonStyle }) => {
  return (
    <div className="space-y-4  overflow-y-auto max-h-[400px] pr-2">
    {/* Corner */}
<div>
  {/* <h3 className="font-semibold text-[18px] mb-4 relative inline-block">
    Corner
    <span className="absolute left-0 bottom-0 w-full h-[2px] bg-gradient-to-r from-[#7140EB] to-[#FF6EC7]"></span>
  </h3> */}

  <div className="flex w-3/4 gap-12 mt-2">
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
      className="flex-1 flex flex-col items-center rounded-full gap-1 text-[10px] py-3  bg-[#D9D9D9]"
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
        {/* <span className="absolute left-0 bottom-0 w-full h-[2px] bg-gradient-to-r from-[#7140EB] to-[#FF6EC7]"></span> */}
    </h3>

  {/* Fill Color */}
  <label className="block text-[14px] font-medium mt-2">Fill</label>
  <div className="flex items-center gap-2">
    <input
      type="color"
      className="w-10 h-10  "
      value={buttonStyle.backgroundColor}
      onChange={e =>
        setButtonStyle(s => ({ ...s, backgroundColor: e.target.value }))
      }
    />
    <span className="text-[12px] bg-[#ECECED] border border-[#7E4FF3] w-full pl-2 py-[5px]">{buttonStyle.backgroundColor}</span>
  </div>

  {/* Stroke Color */}
  <label className="block text-[14px] font-medium mt-2">Stroke</label>
  <div className="flex items-center gap-2">
    <input
      type="color"
      className="w-10 h-10"
      value={buttonStyle.borderColor}
      onChange={e =>
        setButtonStyle(s => ({ ...s, borderColor: e.target.value }))
      }
    />
    <span className="text-[12px] bg-[#ECECED] border border-[#7E4FF3] w-full pl-2 py-[5px]">{buttonStyle.borderColor}</span>
  </div>

  {/* Opacity (background only) */}

<div className="mt-4">
  <label className="block text-[14px] font-medium mb-2">Opacity</label>
  <div className="flex items-center bg-[#ECECED] border border-[#7E4FF3] py-[5px] px-[4px] gap-2">
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
        background: `linear-gradient(to right, black ${buttonStyle.opacity * 100}%, #e5e7eb ${buttonStyle.opacity * 100}%)`,
      }}
      className="w-full h-[2px] rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-black [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-black"
    />
    <span className="text-sm font-medium w-12 text-center">
      {Math.round(buttonStyle.opacity * 50)}%
    </span>
  </div>
</div>


</div>


      {/* Effect */}
      <div>
  <h3 className="font-semibold text-[18px] mb-2 relative inline-block">
    Effect
    <span className="absolute left-0 bottom-0 w-full h-[2px] bg-gradient-to-r from-[#7140EB] to-[#FF6EC7]"></span>
  </h3>
  <p className="text-[14px] font-medium">Drop Shadow</p>
  <div className="flex w-full gap-4 mt-2">
    <button
      onClick={() => setButtonStyle(s => ({ ...s, boxShadow: 'none' }))}
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

    <button
      onClick={() =>
        setButtonStyle(s => ({
          ...s,
          boxShadow: '2px 2px 6px rgba(0,0,0,0.2)',
        }))
      }
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

    <button
      onClick={() =>
        setButtonStyle(s => ({
          ...s,
          boxShadow: '4px 4px 10px rgba(0,0,0,0.4)',
        }))
      }
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
</div>

    </div>
  );
};

export default ButtonCustomizer;
