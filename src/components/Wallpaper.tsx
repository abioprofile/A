import { useRef, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { Upload, X } from "lucide-react";
import type { FillGradientWallpaperConfig } from "@/types/appearance.types";
import { useIsMobile } from "@/hooks/use-mobile";
import ReactCrop, { type Crop, type PixelCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

const WALLPAPER_AMOUNT_FILL = 0.5;
const WALLPAPER_AMOUNT_GRADIENT_START = 0.5;
const WALLPAPER_AMOUNT_GRADIENT_END = 0.8;

/** Match phone display links/bottom section: 285×400 so cropped image fills preview exactly */
const PHONE_WALLPAPER_WIDTH = 285;
const PHONE_WALLPAPER_HEIGHT = 400;
const PHONE_ASPECT = PHONE_WALLPAPER_WIDTH / PHONE_WALLPAPER_HEIGHT;

const MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB
const ACCEPTED_IMAGE_TYPES = "image/jpeg,image/png,image/gif,image/webp";

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
  const isMobile = useIsMobile();
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

  const [showCropModal, setShowCropModal] = useState(false);
  const [cropImageSrc, setCropImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState<Crop>({
    unit: "%",
    width: 90,
    height: 90,
    x: 5,
    y: 5,
  });
  const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null);
  const cropImgRef = useRef<HTMLImageElement>(null);
  const cropBlobUrlRef = useRef<string | null>(null);

  const [themeType, setThemeType] = useState<"fill" | "gradient" | "image">(
    selectedTheme.startsWith("gradient")
      ? "gradient"
      : selectedTheme.startsWith("fill")
        ? "fill"
        : "image",
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
          backgroundColor: [{ color: toValidHex(fillColor, "#000000"), amount: WALLPAPER_AMOUNT_FILL }],
        },
        imageFile: null,
      });
    } else if (themeType === "gradient") {
      cb({
        wallpaperConfig: {
          type: "gradient",
          backgroundColor: [
            { color: toValidHex(gradientStart, "#0f0f0f"), amount: WALLPAPER_AMOUNT_GRADIENT_START },
            { color: toValidHex(gradientEnd, "#dddddd"), amount: WALLPAPER_AMOUNT_GRADIENT_END },
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
    {
      type: "fill",
      label: "Fill",
      backgroundStyle: { backgroundColor: fillColor },
    },
    {
      type: "gradient",
      label: "Gradient",
      backgroundStyle: {
        backgroundImage: `linear-gradient(to bottom, ${gradientStart}, ${gradientEnd})`,
      },
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
          backgroundColor: [{ color: toValidHex(color, "#000000"), amount: WALLPAPER_AMOUNT_FILL }],
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
            { color: toValidHex(color, "#0f0f0f"), amount: WALLPAPER_AMOUNT_GRADIENT_START },
            { color: toValidHex(gradientEnd, "#dddddd"), amount: WALLPAPER_AMOUNT_GRADIENT_END },
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
            { color: toValidHex(gradientStart, "#0f0f0f"), amount: WALLPAPER_AMOUNT_GRADIENT_START },
            { color: toValidHex(color, "#dddddd"), amount: WALLPAPER_AMOUNT_GRADIENT_END },
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
          backgroundColor: [{ color: toValidHex(fillColor, "#000000"), amount: WALLPAPER_AMOUNT_FILL }],
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
            { color: toValidHex(gradientStart, "#0f0f0f"), amount: WALLPAPER_AMOUNT_GRADIENT_START },
            { color: toValidHex(gradientEnd, "#dddddd"), amount: WALLPAPER_AMOUNT_GRADIENT_END },
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
    const url = URL.createObjectURL(file);
    cropBlobUrlRef.current = url;
    setCropImageSrc(url);
    setCompletedCrop(null);
    setCrop({ unit: "%", width: 90, height: 90, x: 5, y: 5 });
    setShowModal(false);
    requestAnimationFrame(() => {
      setShowCropModal(true);
    });
    e.target.value = "";
  };

  const handleCropImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    if (!img?.naturalWidth || !img?.naturalHeight) return;
    const w = img.width;
    const h = img.height;
    const pct = crop.unit === "%" ? crop : { width: 90, height: 90, x: 5, y: 5 };
    const width = ((pct as Crop).width / 100) * w;
    const height = ((pct as Crop).height / 100) * h;
    const x = (((pct as Crop).x ?? 5) / 100) * w;
    const y = (((pct as Crop).y ?? 5) / 100) * h;
    setCompletedCrop({ unit: "px", width, height, x, y });
  };

  const getCroppedImageBlob = (): Promise<Blob | null> => {
    const img = cropImgRef.current;
    if (!img || !completedCrop?.width || !completedCrop?.height) return Promise.resolve(null);
    const scaleX = img.naturalWidth / img.width;
    const scaleY = img.naturalHeight / img.height;
    const srcX = completedCrop.x * scaleX;
    const srcY = completedCrop.y * scaleY;
    const srcW = completedCrop.width * scaleX;
    const srcH = completedCrop.height * scaleY;
    const canvas = document.createElement("canvas");
    canvas.width = PHONE_WALLPAPER_WIDTH;
    canvas.height = PHONE_WALLPAPER_HEIGHT;
    const ctx = canvas.getContext("2d");
    if (!ctx) return Promise.resolve(null);
    ctx.drawImage(img, srcX, srcY, srcW, srcH, 0, 0, PHONE_WALLPAPER_WIDTH, PHONE_WALLPAPER_HEIGHT);
    return new Promise((resolve) => {
      canvas.toBlob((blob) => resolve(blob), "image/jpeg", 0.92);
    });
  };

  const handleCropSave = async () => {
    const blob = await getCroppedImageBlob();
    if (!blob) return;
    const file = new File([blob], "wallpaper.jpg", { type: "image/jpeg" });
    setImageFile(file);
    setThemeType("image");
    if (blobUrlRef.current) URL.revokeObjectURL(blobUrlRef.current);
    const url = URL.createObjectURL(blob);
    blobUrlRef.current = url;
    setSelectedTheme(url);
    setShowModal(false);
    onWallpaperChange?.({ wallpaperConfig: null, imageFile: file });
    if (cropBlobUrlRef.current) {
      URL.revokeObjectURL(cropBlobUrlRef.current);
      cropBlobUrlRef.current = null;
    }
    setCropImageSrc(null);
    setShowCropModal(false);
  };

  const handleCropCancel = () => {
    if (cropBlobUrlRef.current) {
      URL.revokeObjectURL(cropBlobUrlRef.current);
      cropBlobUrlRef.current = null;
    }
    setCropImageSrc(null);
    setShowCropModal(false);
  };

  useEffect(() => {
    return () => {
      if (blobUrlRef.current) URL.revokeObjectURL(blobUrlRef.current);
      if (cropBlobUrlRef.current) URL.revokeObjectURL(cropBlobUrlRef.current);
    };
  }, []);

  useEffect(() => {
    if (!showCropModal) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [showCropModal]);

  return (
    <>
      <div className="flex flex-col mt-6 gap-6 w-full max-w-xl">
        <div className="grid grid-cols-3 gap-6 w-full">
          {wallpapers.map((wallpaper, index) => (
            <div key={index} className="flex flex-col items-center gap-2">
              <button
                onClick={() => {
                  if (wallpaper.type === "image") {
                    if (isMobile) {
                      setShowModal(true);
                      setTranslate(0);
                    } else {
                      fileInputRef.current?.click();
                    }
                  } else {
                    handleSelectType(wallpaper.type as "fill" | "gradient");
                  }
                }}
                className={`relative w-[100px] h-[100px] overflow-hidden border-2 flex items-center justify-center transition-all ${
                  isSelected(wallpaper.type)
                    ? "border-[#E30000]"
                    : "border-transparent hover:border-gray-400"
                }`}
              >
                {wallpaper.type === "image" ? (
                  selectedTheme.startsWith("blob:") ? (
                    <Image
                      src={selectedTheme}
                      alt="Uploaded wallpaper"
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-gray-500">
                      <Upload className="w-6 h-6 mb-1" />
                      <span className="text-xs">Upload</span>
                    </div>
                  )
                ) : (
                  <div
                    className="absolute inset-0"
                    style={wallpaper.backgroundStyle}
                  />
                )}
              </button>
              <span className="text-sm font-medium">{wallpaper.label}</span>
            </div>
          ))}
        </div>

        {themeType === "fill" && (
          <div className="flex items-center justify-center gap-3 mt-2">
            <label className="text-sm font-medium text-gray-700">
              Fill Color:
            </label>
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
              <label className="text-sm font-medium text-gray-700">
                Start:
              </label>
              <input
                type="color"
                value={gradientStart}
                colorspace="display-p3"
                onChange={(e) => handleGradientStartChange(e.target.value)}
                className="w-10 h-10 cursor-pointer border rounded-lg"
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">End:</label>
              <input
                type="color"
                colorspace="display-p3"
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
            transform: showModal
              ? `translateY(${translate}px)`
              : `translateY(${window.innerHeight}px)`,
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
            <h2 className="text-2xl font-bold text-gray-900">
              Select wallpaper
            </h2>
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
                <p className="text-xs text-gray-500">
                  JPG, PNG, GIF up to 10MB
                </p>
              </div>
              <span className="ml-auto text-gray-400">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Crop modal (portal) */}
      {showCropModal &&
        cropImageSrc &&
        createPortal(
          <div className="fixed inset-0 z-[200] flex flex-col bg-black/95 isolate">
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/20 bg-black/60 shrink-0 pointer-events-auto">
              <h2 className="text-base md:text-lg font-semibold text-white">Crop wallpaper</h2>
              <button
                type="button"
                onClick={handleCropCancel}
                className="p-2.5 -mr-2 rounded-full active:bg-white/20 text-white touch-manipulation"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div
              className="flex-1 min-h-0 flex items-center justify-center p-3 md:p-4 overflow-hidden"
              style={{ touchAction: "none" }}
            >
              <div className="w-full h-full flex items-center justify-center max-w-full">
                <ReactCrop
                  crop={crop}
                  onChange={(_, percentCrop) => setCrop(percentCrop)}
                  onComplete={(pixelCrop) => setCompletedCrop(pixelCrop)}
                  aspect={PHONE_ASPECT}
                  className="max-w-full"
                  style={{ maxHeight: "100%" }}
                >
                  <img
                    ref={cropImgRef}
                    src={cropImageSrc}
                    alt="Crop"
                    className="max-w-full max-h-[72vh] md:max-h-[70vh] w-auto h-auto block select-none"
                    style={{ maxHeight: "72vh", touchAction: "none" }}
                    onLoad={handleCropImageLoad}
                    draggable={false}
                  />
                </ReactCrop>
              </div>
            </div>
            <div className="flex gap-3 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] border-t border-white/20 bg-black/60 shrink-0 pointer-events-auto select-none">
              <button
                type="button"
                onClick={handleCropCancel}
                className="flex-1 min-h-[48px] py-3 rounded-xl border border-white/30 text-white font-medium active:bg-white/10 touch-manipulation"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCropSave}
                disabled={!completedCrop?.width || !completedCrop?.height}
                className="flex-1 min-h-[48px] py-3 rounded-xl bg-[#E30000] text-white font-medium disabled:opacity-50 active:opacity-90 touch-manipulation"
              >
                Save
              </button>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
