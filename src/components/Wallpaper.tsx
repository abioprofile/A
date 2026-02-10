import { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Upload, X } from "lucide-react";
import type { FillGradientWallpaperConfig } from "@/types/appearance.types";

const WALLPAPER_AMOUNT_FILL = 0.5;
const WALLPAPER_AMOUNT_GRADIENT_START = 0.5;
const WALLPAPER_AMOUNT_GRADIENT_END = 0.5;

function isValidHexColor(s: string): boolean {
  return /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(s);
}

function toValidHex(s: string, fallback: string): string {
  return isValidHexColor(s) ? s : fallback;
}

interface WallpaperSelectorProps {
  selectedTheme: string;
  setSelectedTheme: (theme: string) => void;
  initialWallpaperConfig?: FillGradientWallpaperConfig | null;
  onWallpaperChange?: (payload: {
    wallpaperConfig: FillGradientWallpaperConfig | null;
    imageFile: File | null;
  }) => void;
}

export default function WallpaperSelector({
  selectedTheme,
  setSelectedTheme,
  initialWallpaperConfig,
  onWallpaperChange,
}: WallpaperSelectorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showModal, setShowModal] = useState(false);
  const sheetRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [dragStart, setDragStart] = useState(0);
  const [translate, setTranslate] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const blobUrlRef = useRef<string | null>(null);

  const [themeType, setThemeType] = useState<"fill" | "gradient" | "image">(
    selectedTheme.startsWith("gradient")
      ? "gradient"
      : selectedTheme.startsWith("fill")
        ? "fill"
        : "image"
  );
  const [fillColor, setFillColor] = useState("#000000");
  const [gradientStart, setGradientStart] = useState("#0f0f0f");
  const [gradientEnd, setGradientEnd] = useState("#dddddd");

  const onWallpaperChangeRef = useRef(onWallpaperChange);
  onWallpaperChangeRef.current = onWallpaperChange;
  const lastSyncedInitialRef = useRef<string | null>(null);

  // Sync from server config only once per distinct config (avoids loop when parent re-renders)
  useEffect(() => {
    if (!initialWallpaperConfig) return;
    const key = JSON.stringify(initialWallpaperConfig);
    if (lastSyncedInitialRef.current === key) return;
    lastSyncedInitialRef.current = key;
    const bg = initialWallpaperConfig.backgroundColor;
    if (!Array.isArray(bg) || bg.length === 0) return;
    if (initialWallpaperConfig.type === "fill" && bg[0]) {
      setFillColor(toValidHex(bg[0].color, "#000000"));
      setThemeType("fill");
    }
    if (initialWallpaperConfig.type === "gradient" && bg.length >= 2) {
      setGradientStart(toValidHex(bg[0].color, "#0f0f0f"));
      setGradientEnd(toValidHex(bg[1].color, "#dddddd"));
      setThemeType("gradient");
    }
  }, [initialWallpaperConfig]);

  // Notify parent of current wallpaper payload — only when values change, use ref for callback
  useEffect(() => {
    const cb = onWallpaperChangeRef.current;
    if (!cb) return;
    if (themeType === "fill") {
      cb({
        wallpaperConfig: {
          type: "fill",
          backgroundColor: [
            { color: toValidHex(fillColor, "#000000"), amount: WALLPAPER_AMOUNT_FILL },
          ],
        },
        imageFile: null,
      });
    } else if (themeType === "gradient") {
      cb({
        wallpaperConfig: {
          type: "gradient",
          backgroundColor: [
            {
              color: toValidHex(gradientStart, "#0f0f0f"),
              amount: WALLPAPER_AMOUNT_GRADIENT_START,
            },
            {
              color: toValidHex(gradientEnd, "#dddddd"),
              amount: WALLPAPER_AMOUNT_GRADIENT_END,
            },
          ],
        },
        imageFile: null,
      });
    } else {
      cb({ wallpaperConfig: null, imageFile });
    }
  }, [themeType, fillColor, gradientStart, gradientEnd, imageFile]);

  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    if (!showModal) return;
    setIsDragging(true);
    setIsAnimating(false);
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    setDragStart(clientY);
  };

  const handleDragMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging || !showModal) return;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    const delta = clientY - dragStart;
    
    if (delta > 0) {
      setTranslate(delta);
    }
  };

  const handleDragEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    setIsAnimating(true);

    const threshold = 100;
    const shouldClose = translate > threshold;

    if (shouldClose) {
      setTranslate(window.innerHeight);
      setTimeout(() => {
        setShowModal(false);
        setTranslate(0);
        setIsAnimating(false);
      }, 300);
    } else {
      setTranslate(0);
      setIsAnimating(false);
    }
  };

  useEffect(() => {
    if (!showModal) {
      setTranslate(0);
    }
  }, [showModal]);

  const wallpapers = [
    { type: "fill", label: "Fill", backgroundStyle: { backgroundColor: fillColor } },
    {
      type: "gradient",
      label: "Gradient",
      backgroundStyle: { backgroundImage: `linear-gradient(to bottom, ${gradientStart}, ${gradientEnd})` },
    },
    { type: "image", label: "Image", backgroundStyle: {} },
  ];

  const handleFillColorChange = (color: string) => {
    setFillColor(color);
    if (themeType === "fill") {
      const themeString = `fill:${color}`;
      setSelectedTheme(themeString);
      onWallpaperChange?.({
        wallpaperConfig: {
          type: "fill",
          backgroundColor: [
            { color: toValidHex(color, "#000000"), amount: WALLPAPER_AMOUNT_FILL },
          ],
        },
        imageFile: null,
      });
    }
  };

  const handleGradientStartChange = (color: string) => {
    setGradientStart(color);
    if (themeType === "gradient") {
      const themeString = `gradient:${color}:${gradientEnd}`;
      setSelectedTheme(themeString);
      onWallpaperChange?.({
        wallpaperConfig: {
          type: "gradient",
          backgroundColor: [
            {
              color: toValidHex(color, "#0f0f0f"),
              amount: WALLPAPER_AMOUNT_GRADIENT_START,
            },
            {
              color: toValidHex(gradientEnd, "#dddddd"),
              amount: WALLPAPER_AMOUNT_GRADIENT_END,
            },
          ],
        },
        imageFile: null,
      });
    }
  };

  const handleGradientEndChange = (color: string) => {
    setGradientEnd(color);
    if (themeType === "gradient") {
      const themeString = `gradient:${gradientStart}:${color}`;
      setSelectedTheme(themeString);
      onWallpaperChange?.({
        wallpaperConfig: {
          type: "gradient",
          backgroundColor: [
            {
              color: toValidHex(gradientStart, "#0f0f0f"),
              amount: WALLPAPER_AMOUNT_GRADIENT_START,
            },
            {
              color: toValidHex(color, "#dddddd"),
              amount: WALLPAPER_AMOUNT_GRADIENT_END,
            },
          ],
        },
        imageFile: null,
      });
    }
  };

  const handleSelectType = (type: "fill" | "gradient" | "image") => {
    setThemeType(type);
    
    if (type === "fill") {
      const themeString = `fill:${fillColor}`;
      setSelectedTheme(themeString);
      setImageFile(null);
      onWallpaperChange?.({
        wallpaperConfig: {
          type: "fill",
          backgroundColor: [
            { color: toValidHex(fillColor, "#000000"), amount: WALLPAPER_AMOUNT_FILL },
          ],
        },
        imageFile: null,
      });
    } else if (type === "gradient") {
      const themeString = `gradient:${gradientStart}:${gradientEnd}`;
      setSelectedTheme(themeString);
      setImageFile(null);
      onWallpaperChange?.({
        wallpaperConfig: {
          type: "gradient",
          backgroundColor: [
            {
              color: toValidHex(gradientStart, "#0f0f0f"),
              amount: WALLPAPER_AMOUNT_GRADIENT_START,
            },
            {
              color: toValidHex(gradientEnd, "#dddddd"),
              amount: WALLPAPER_AMOUNT_GRADIENT_END,
            },
          ],
        },
        imageFile: null,
      });
    }
  };

  const isSelected = (type: string) => {
    if (type === "image" && selectedTheme.startsWith("blob:")) return true;
    return selectedTheme.startsWith(type);
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return;
    if (blobUrlRef.current) URL.revokeObjectURL(blobUrlRef.current);
    const imageUrl = URL.createObjectURL(file);
    blobUrlRef.current = imageUrl;
    setImageFile(file);
    setThemeType("image");
    setSelectedTheme(imageUrl);
    setShowModal(false);
    onWallpaperChange?.({ wallpaperConfig: null, imageFile: file });
    e.target.value = "";
  };

  useEffect(() => {
    return () => {
      if (blobUrlRef.current) URL.revokeObjectURL(blobUrlRef.current);
    };
  }, []);

  return (
    <>
      <div className="flex flex-col mt-6 gap-6 w-full max-w-xl">
        <div className="grid grid-cols-3 gap-6 w-full">
          {wallpapers.map((wallpaper, index) => (
            <div key={index} className="flex flex-col items-center gap-2">
              <button
                onClick={() => {
                  if (wallpaper.type === "image") {
                    setShowModal(true);
                    setTranslate(0);
                  } else {
                    handleSelectType(wallpaper.type as "fill" | "gradient");
                  }
                }}
                className={`relative w-[100px] h-[100px] overflow-hidden border-2 flex items-center justify-center transition-all ${
                  isSelected(wallpaper.type) ? "border-[#E30000]" : "border-transparent hover:border-gray-400"
                }`}
              >
                {wallpaper.type === "image" ? (
                  selectedTheme.startsWith("blob:") ? (
                    <Image src={selectedTheme} alt="Uploaded wallpaper" fill className="object-cover" />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-gray-500">
                      <Upload className="w-6 h-6 mb-1" />
                      <span className="text-xs">Upload</span>
                    </div>
                  )
                ) : (
                  <div className="absolute inset-0" style={wallpaper.backgroundStyle} />
                )}
              </button>
              <span className="text-sm font-medium">{wallpaper.label}</span>
            </div>
          ))}
        </div>

        {themeType === "fill" && (
          <div className="flex items-center justify-center gap-3 mt-2">
            <label className="text-sm font-medium text-gray-700">Fill Color:</label>
            <input
              type="color"
              value={fillColor}
              onChange={(e) => handleFillColorChange(e.target.value)}
              className="w-10 h-10 cursor-pointer border rounded-lg"
            />
          </div>
        )}

        {themeType === "gradient" && (
          <div className="flex flex-row items-center justify-center gap-4 mt-2">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">Start:</label>
              <input
                type="color"
                value={gradientStart}
                onChange={(e) => handleGradientStartChange(e.target.value)}
                className="w-10 h-10 cursor-pointer border rounded-lg"
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">End:</label>
              <input
                type="color"
                value={gradientEnd}
                onChange={(e) => handleGradientEndChange(e.target.value)}
                className="w-10 h-10 cursor-pointer border rounded-lg"
              />
            </div>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleUpload}
        />
      </div>

      {/* Blurred Backdrop */}
      {showModal && (
        <div
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm md:hidden transition-opacity"
          onClick={() => setShowModal(false)}
        />
      )}

      {/* Fluid Sheet Modal */}
      <div
        ref={sheetRef}
        className={`fixed inset-0 z-50 pointer-events-none md:hidden flex items-end ${
          showModal ? "" : "pointer-events-none"
        }`}
      >
        <div
          onMouseDown={handleDragStart}
          onMouseMove={handleDragMove}
          onMouseUp={handleDragEnd}
          onMouseLeave={handleDragEnd}
          onTouchStart={handleDragStart}
          onTouchMove={handleDragMove}
          onTouchEnd={handleDragEnd}
          className={`pointer-events-auto w-full bg-white rounded-t-3xl shadow-2xl select-none ${
            isAnimating ? "transition-transform duration-300 ease-out" : ""
          }`}
          style={{
            transform: showModal ? `translateY(${translate}px)` : `translateY(${window.innerHeight}px)`,
            transitionProperty: isAnimating ? "transform" : "none",
          }}
        >
          {/* Drag Handle Area */}
          <div className="flex flex-col items-center pt-3 pb-4 cursor-grab active:cursor-grabbing">
            <div className="w-12 h-1 bg-gray-300 rounded-full" />
            <div className="flex items-center justify-center mt-1">
              {/* <ChevronDown className="w-5 h-5 text-gray-400" /> */}
            </div>
          </div>

          {/* Header */}
          <div className="flex items-center justify-between px-6 pb-4 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">Select wallpaper</h2>
            <button
              onClick={() => setShowModal(false)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-gray-600" />
            </button>
          </div>

          {/* Content */}
          <div
            ref={contentRef}
            className="px-6 py-4 space-y-3 max-h-[60vh] overflow-y-auto"
            onMouseDown={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
          >
            {/* Upload Option */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full flex items-center gap-3 p-4 border-2 border-gray-300 active:bg-gray-50 hover:border-gray-400 transition-all cursor-pointer"
            >
              <div className="w-12 h-12   flex items-center justify-center flex-shrink-0">
                <Upload className="w-6 h-6 " />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-gray-900">Upload your own</h3>
                <p className="text-xs text-gray-500">JPG, PNG, GIF up to 10MB</p>
              </div>
              <span className="ml-auto text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </button>

        
          </div>
        </div>
      </div>
    </>
  );
}