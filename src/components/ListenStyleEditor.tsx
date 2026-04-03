"use client";

import React, { useState } from "react";
import ButtonAndFontTabs from "./ButtonAndFontTabs";
import type { ButtonStyle } from "@/types/appearance.types";
import type { FontStyle } from "./FontCustomizer";

const PRESET_BACKGROUNDS = [
  { label: "Pitch Black", value: "fill:#0d0d0d" },
  { label: "Dark", value: "fill:#121212" },
  { label: "Midnight Blue", value: "fill:#0a0a1a" },
  { label: "Deep Purple", value: "fill:#1a0a2e" },
  { label: "Forest", value: "fill:#0a1a0a" },
  { label: "Dark Red", value: "fill:#1a0a0a" },
  { label: "Fade Black", value: "gradient:#000000:#1a1a2e" },
  { label: "Night Sky", value: "gradient:#0d0d0d:#0a0a2a" },
  { label: "Dark Green", value: "gradient:#0a1a0a:#0d1a0d" },
  { label: "Crimson", value: "gradient:#1a0000:#2a0010" },
];

interface ListenStyleEditorProps {
  buttonStyle: ButtonStyle;
  setButtonStyle: (s: ButtonStyle) => void;
  fontStyle: FontStyle;
  setFontStyle: (s: FontStyle) => void;
  background: string;
  setBackground: (bg: string) => void;
}

const ListenStyleEditor: React.FC<ListenStyleEditorProps> = ({
  buttonStyle,
  setButtonStyle,
  fontStyle,
  setFontStyle,
  background,
  setBackground,
}) => {
  const [tab, setTab] = useState<"bg" | "style">("bg");

  // Derive current hex for the color input
  const currentFillColor = background.startsWith("fill:")
    ? background.slice(5)
    : "#0d0d0d";

  const isGradient = background.startsWith("gradient:");
  const gradientParts = isGradient ? background.split(":") : [];
  const gradStart = gradientParts[1] ?? "#0d0d0d";
  const gradEnd = gradientParts[2] ?? "#1a1a2e";

  return (
    <div className="space-y-4">
      {/* Sub-tab switcher */}
      <div className="flex items-center gap-0 border-b">
        <button
          onClick={() => setTab("bg")}
          className={`px-4 py-2 text-[14px] font-semibold relative ${
            tab === "bg" ? "text-black" : "text-gray-400"
          }`}
        >
          Background
          {tab === "bg" && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-500" />
          )}
        </button>
        <button
          onClick={() => setTab("style")}
          className={`px-4 py-2 text-[14px] font-semibold relative ${
            tab === "style" ? "text-black" : "text-gray-400"
          }`}
        >
          Style
          {tab === "style" && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-500" />
          )}
        </button>
      </div>

      {/* Background picker */}
      {tab === "bg" && (
        <div className="space-y-5 px-1">
          {/* Preset swatches */}
          <div>
            <p className="text-[12px] font-semibold text-gray-500 mb-3 uppercase tracking-wide">
              Presets
            </p>
            <div className="flex flex-wrap gap-2">
              {PRESET_BACKGROUNDS.map((preset) => {
                const isActive = background === preset.value;
                const swatchStyle: React.CSSProperties = preset.value.startsWith(
                  "gradient:",
                )
                  ? {
                      background: `linear-gradient(to bottom, ${preset.value.split(":")[1]}, ${preset.value.split(":")[2]})`,
                    }
                  : { backgroundColor: preset.value.slice(5) };

                return (
                  <button
                    key={preset.value}
                    onClick={() => setBackground(preset.value)}
                    title={preset.label}
                    className={`w-8 h-8 rounded-sm border-2 transition-transform ${
                      isActive
                        ? "border-[#FED45C] scale-110"
                        : "border-transparent hover:scale-105"
                    }`}
                    style={swatchStyle}
                  />
                );
              })}
            </div>
          </div>

          {/* Solid color custom picker */}
          <div>
            <p className="text-[12px] font-semibold text-gray-500 mb-2 uppercase tracking-wide">
              Custom Color
            </p>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={currentFillColor}
                onChange={(e) => setBackground(`fill:${e.target.value}`)}
                className="w-10 h-10 rounded cursor-pointer border border-gray-200"
              />
              <span className="text-xs text-gray-500 font-mono">
                {currentFillColor}
              </span>
            </div>
          </div>

          {/* Gradient picker */}
          <div>
            <p className="text-[12px] font-semibold text-gray-500 mb-2 uppercase tracking-wide">
              Custom Gradient
            </p>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <label className="text-xs text-gray-500">From</label>
                <input
                  type="color"
                  value={gradStart}
                  onChange={(e) =>
                    setBackground(`gradient:${e.target.value}:${gradEnd}`)
                  }
                  className="w-8 h-8 rounded cursor-pointer border border-gray-200"
                />
              </div>
              <div className="flex items-center gap-2">
                <label className="text-xs text-gray-500">To</label>
                <input
                  type="color"
                  value={gradEnd}
                  onChange={(e) =>
                    setBackground(`gradient:${gradStart}:${e.target.value}`)
                  }
                  className="w-8 h-8 rounded cursor-pointer border border-gray-200"
                />
              </div>
              <div
                className="w-16 h-8 rounded border border-gray-200"
                style={{
                  background: `linear-gradient(to right, ${gradStart}, ${gradEnd})`,
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Button + Font reuse */}
      {tab === "style" && (
        <ButtonAndFontTabs
          buttonStyle={buttonStyle}
          setButtonStyle={setButtonStyle as React.Dispatch<React.SetStateAction<ButtonStyle>>}
          fontStyle={fontStyle}
          setFontStyle={setFontStyle as React.Dispatch<React.SetStateAction<FontStyle>>}
        />
      )}
    </div>
  );
};

export default ListenStyleEditor;
