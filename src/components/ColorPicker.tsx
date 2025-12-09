'use client';
import { useState } from 'react';
import { HexColorPicker, HexColorInput, RgbColorPicker } from 'react-colorful';

interface ColorPickerProps {
  color: string;
  onChange: (value: string) => void;
  label?: string;
}

export default function ColorPicker({ color, onChange, label }: ColorPickerProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  return (
    <div className="relative bg-white border border-gray-300 p-3 rounded-xl shadow-lg w-[260px]">
      {label && <p className="text-xs font-semibold mb-2">{label}</p>}

      {/* Main Picker */}
      <HexColorPicker color={color} onChange={onChange} />

      {/* Input Row */}
      <div className="flex items-center justify-between mt-3">
        <HexColorInput
          color={color}
          onChange={onChange}
          prefixed
          className="w-24 border border-gray-300 px-2 py-1 text-sm rounded bg-gray-50 text-center"
        />
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="text-xs text-blue-500 hover:underline"
        >
          {showAdvanced ? 'Hide' : 'More'}
        </button>
      </div>

      {/* Advanced Modes */}
      {showAdvanced && (
        <div className="mt-3 space-y-2">
          <RgbColorPicker
            color={
              /^#/.test(color)
                ? {
                    r: parseInt(color.slice(1, 3), 16),
                    g: parseInt(color.slice(3, 5), 16),
                    b: parseInt(color.slice(5, 7), 16),
                  }
                : { r: 255, g: 0, b: 0 }
            }
            onChange={(rgb) => {
              const hex = `#${((1 << 24) + (rgb.r << 16) + (rgb.g << 8) + rgb.b)
                .toString(16)
                .slice(1)}`;
              onChange(hex);
            }}
          />
        </div>
      )}

      {/* Swatches */}
      <div className="mt-3 flex gap-1 flex-wrap">
        {['#000000', '#007aff', '#34c759', '#ffcc00', '#ff9500', '#ff2d55', '#9e00ff', '#ff3b30'].map(
          (preset) => (
            <button
              key={preset}
              onClick={() => onChange(preset)}
              className="w-5 h-5 rounded cursor-pointer border border-gray-200"
              style={{ backgroundColor: preset }}
            />
          )
        )}
      </div>
    </div>
  );
}
