import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { Upload, X, ChevronDown } from "lucide-react";

interface WallpaperSelectorProps {
  selectedTheme: string;
  setSelectedTheme: (theme: string) => void;
}

export default function WallpaperSelector({
  selectedTheme,
  setSelectedTheme,
}: WallpaperSelectorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showModal, setShowModal] = useState(false);
  const sheetRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [dragStart, setDragStart] = useState(0);
  const [translate, setTranslate] = useState(0);
  const [velocity, setVelocity] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

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

  useEffect(() => {
    if (themeType === "fill") {
      setSelectedTheme(`fill:${fillColor}`);
    } else if (themeType === "gradient") {
      setSelectedTheme(`gradient:${gradientStart}:${gradientEnd}`);
    }
  }, [fillColor, gradientStart, gradientEnd, themeType]);

  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    if (!showModal) return;
    setIsDragging(true);
    setIsAnimating(false);
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    setDragStart(clientY);
    setVelocity(0);
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

  const handleSelectType = (type: "fill" | "gradient" | "image") => {
    setThemeType(type);
    if (type === "fill") setSelectedTheme(`fill:${fillColor}`);
    else if (type === "gradient") setSelectedTheme(`gradient:${gradientStart}:${gradientEnd}`);
  };

  const isSelected = (type: string) => {
    if (type === "image" && selectedTheme.startsWith("blob:")) return true;
    return selectedTheme.startsWith(type);
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setThemeType("image");
      setSelectedTheme(imageUrl);
      setShowModal(false);
    }
  };

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
              onChange={(e) => setFillColor(e.target.value)}
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
                onChange={(e) => setGradientStart(e.target.value)}
                className="w-10 h-10 cursor-pointer border rounded-lg"
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">End:</label>
              <input
                type="color"
                value={gradientEnd}
                onChange={(e) => setGradientEnd(e.target.value)}
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
              onClick={() => fileInputRef.current?.click()}
              className="w-full flex items-center gap-3 p-4 border-2 border-gray-300  active:bg-gray-50 hover:border-gray-400 transition-all"
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