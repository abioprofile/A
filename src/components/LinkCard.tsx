"use client";

import { FC, useState, MouseEvent, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import "./LinkCard.css";
import { useUpdateLinkWithIcon } from "@/hooks/api/useAuth";
import {
  TrashIcon,
  PencilIcon,
  ChartBarIcon,
  ChevronDownIcon,
  CameraIcon,
} from "@heroicons/react/24/outline";
import ReactCrop, { Crop, PixelCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

import { FaLink } from "react-icons/fa6";
import { PlatformSvgIcon } from "./PlatformIcon";
import {
  PLATFORM_ICON_FILES,
  PLATFORM_DISPLAY_NAMES,
  getPlatformIconUrl,
  normalizePlatformId,
} from "@/data/platformIconMap";

type LinkItem = {
  id: string;
  title: string;
  platform: string;
  url: string;
  customIcon?: string;
  clickCount: number;
};

type Props = {
  item: LinkItem;
  onDelete: (id?: string) => void;
  onEdit: (e?: MouseEvent, item?: LinkItem) => void;
  onToggleVisibility?: (e?: MouseEvent) => void;
  isVisible?: boolean;
  onIconChange: (
    id: string,
    iconType: "platform" | "custom",
    value: string,
  ) => void;
  dragHandleProps?: any;
  dragHandleId?: string;
};

// All platforms that have icons in our public icon pack
const ICON_PICKER_PLATFORMS = Object.keys(PLATFORM_ICON_FILES);

const LinkCard: FC<Props> = ({
  item,
  onDelete,
  onEdit,
  onIconChange,
  onToggleVisibility,
  isVisible = true,
  dragHandleProps,
  dragHandleId,
}) => {
  const [isActive, setIsActive] = useState(isVisible);
  const updateLinkIconMutation = useUpdateLinkWithIcon();

  // Sync with prop changes
  useEffect(() => {
    setIsActive(isVisible);
  }, [isVisible]);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showIconDropdown, setShowIconDropdown] = useState(false);
  const [showCropModal, setShowCropModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [crop, setCrop] = useState<Crop>({
    unit: "%",
    width: 100,
    height: 100,
    x: 0,
    y: 0,
  });
  const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const iconButtonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [dropdownPosition, setDropdownPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);

  // Calculate dropdown position when opening
  const handleToggleDropdown = (e: MouseEvent) => {
    e.stopPropagation();
    if (!showIconDropdown && iconButtonRef.current) {
      const rect = iconButtonRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY + 8, // 8px margin (mt-2)
        left: rect.left + window.scrollX,
      });
    }
    setShowIconDropdown(!showIconDropdown);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    if (showIconDropdown) {
      const handleClickOutside = (e: globalThis.MouseEvent) => {
        const target = e.target as Node;
        // Check if click is outside both the button and the dropdown
        const isOutsideButton =
          iconButtonRef.current && !iconButtonRef.current.contains(target);
        const isOutsideDropdown =
          dropdownRef.current && !dropdownRef.current.contains(target);

        if (isOutsideButton && isOutsideDropdown) {
          setShowIconDropdown(false);
        }
      };
      // Use a small delay to allow button clicks to register first
      const timeoutId = setTimeout(() => {
        document.addEventListener("mousedown", handleClickOutside);
      }, 0);

      return () => {
        clearTimeout(timeoutId);
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [showIconDropdown]);

  // Get the appropriate icon source
  const getIconElement = () => {
    if (item.customIcon) {
      return (
        <Image
          src={item.customIcon}
          alt={item.platform}
          width={28}
          height={28}
          className="w-6 h-6 md:w-8 md:h-8 object-contain rounded-full"
          draggable={false}
        />
      );
    }

    const key = normalizePlatformId(item.platform ?? "");
    if (PLATFORM_ICON_FILES[key]) {
      return (
        <PlatformSvgIcon
          platform={key}
          className="w-6 h-6 md:w-8 md:h-8"
          variant="black"
        />
      );
    }

    // Default icon
    return <FaLink className="w-6 h-6 md:w-8 md:h-8 text-gray-500" />;
  };

  /** Fetches the colored SVG from the public icon pack and returns it as a File for upload */
  const fetchColoredIconFile = async (platformKey: string): Promise<File> => {
    const url = getPlatformIconUrl(platformKey, "colored");
    if (!url) throw new Error(`No colored icon for platform: ${platformKey}`);
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to fetch icon: ${url}`);
    const blob = await response.blob();
    return new File([blob], `${platformKey}-icon.svg`, { type: "image/svg+xml" });
  };

  const handleIconSelect = async (e: MouseEvent, platform: string) => {
    e.stopPropagation();
    e.preventDefault();
    if (platform === "custom") {
      setShowIconDropdown(false);
      setTimeout(() => {
        fileInputRef.current?.click();
      }, 100);
    } else {
      try {
        const iconFile = await fetchColoredIconFile(platform);
        updateLinkIconMutation.mutate(
          { linkId: item.id, iconFile },
          {
            onSuccess: () => {
              setShowIconDropdown(false);
              if (onIconChange) {
                onIconChange(item.id, "platform", platform);
              }
            },
            onError: (error) => {
              console.error("Failed to update icon:", error);
            },
          },
        );
      } catch (error) {
        console.error("Failed to fetch colored icon file:", error);
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageUrl = event.target?.result as string;
        setSelectedImage(imageUrl);
        setShowCropModal(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCropComplete = (crop: PixelCrop) => {
    setCompletedCrop(crop);
  };

  const handleSaveCroppedImage = () => {
    if (!imgRef.current || !completedCrop) return;

    const canvas = document.createElement("canvas");
    const scaleX = imgRef.current.naturalWidth / imgRef.current.width;
    const scaleY = imgRef.current.naturalHeight / imgRef.current.height;

    canvas.width = completedCrop.width;
    canvas.height = completedCrop.height;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(
      imgRef.current,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      completedCrop.width,
      completedCrop.height,
    );

    canvas.toBlob((blob) => {
      if (blob) {
        const croppedImageUrl = URL.createObjectURL(blob);
        onIconChange(item.id, "custom", croppedImageUrl);
        setShowCropModal(false);
        setSelectedImage("");
        setCrop({ unit: "%", width: 100, height: 100, x: 0, y: 0 });
        setCompletedCrop(null);
      }
    }, "image/png");
  };

  // Handler for platform name click
  const handlePlatformNameClick = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onEdit) {
      onEdit(e, item);
    }
  };

  // Handler for URL click
  const handleUrlClick = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onEdit) {
      onEdit(e, item);
    }
  };

  // Handler for toggle button
  const handleToggleClick = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onToggleVisibility) {
      onToggleVisibility(e);
    } else {
      setIsActive(!isActive);
    }
  };

  // Handler for edit button
  const handleEditClick = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onEdit) {
      onEdit(e, item);
    }
  };

  // Handler for delete button
  const handleDeleteClick = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onDelete) {
      onDelete(item.id);
    }
  };

  // Handler for analytics button
  const handleAnalyticsClick = (e: MouseEvent) => {
    e.stopPropagation();
    setShowAnalytics(!showAnalytics);
  };

  const truncateUrl = (url: string, startChars = 20, endChars = 15) => {
    if (url.length <= startChars + endChars) return url;
    return `${url.slice(0, startChars)}...${url.slice(-endChars)}`;
  };

  return (
    <div className="w-full">
      <div className="py-2 md:py-3">
        <div
          className={`p-px md:p-[2px] ${isActive ? "" : "border border-black"}`}
        >
          <div
            className="bg-[#FAFAFC] shadow-lg p-4 md:p-4 relative"
            style={{ zIndex: showIconDropdown ? 1 : "auto" }}
          >
            {/* ================= TOP ROW ================= */}
            <div className="flex items-center gap-2 md:gap-3">
              {/* Drag dots (desktop only) - Only this area is draggable */}
              <div
                id={dragHandleId}
                className="flex flex-col gap-1 cursor-grab"
                {...(dragHandleProps || {})}
              >
                {[0, 1, 2].map((i) => (
                  <div key={i} className="flex gap-1">
                    <span className="w-1 h-1 bg-red-500 rounded-full" />
                    <span className="w-1 h-1 bg-red-500 rounded-full" />
                  </div>
                ))}
              </div>

              {/* Icon with Dropdown */}
              <div className="relative">
                <button
                  ref={iconButtonRef}
                  type="button"
                  onClick={handleToggleDropdown}
                  className="flex items-center gap-1 cursor-pointer hover:opacity-80 transition-opacity"
                >
                  <div className="w-6 h-6 md:w-8 md:h-8 flex items-center justify-center">
                    {getIconElement()}
                  </div>
                  <ChevronDownIcon className="h-3 w-3 text-gray-500" />
                </button>
              </div>

              {/* Icon Dropdown - Rendered via Portal outside DndContext */}
              {showIconDropdown &&
                typeof window !== "undefined" &&
                dropdownPosition &&
                createPortal(
                  <>
                    <div
                      className="fixed inset-0 icon-dropdown-overlay"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowIconDropdown(false);
                      }}
                    />
                    <div
                      ref={dropdownRef}
                      className="fixed bg-white shadow-lg border min-w-[200px] max-h-[300px] flex flex-col icon-dropdown-container"
                      style={{
                        top: `${dropdownPosition.top}px`,
                        left: `${dropdownPosition.left}px`,
                      }}
                      onClick={(e) => e.stopPropagation()}
                      onMouseDown={(e) => e.stopPropagation()}
                    >
                      <div className="p-2 shrink-0">
                        <h3 className="text-xs font-semibold text-gray-500 mb-2 px-2">
                          Platform Icons
                        </h3>
                      </div>
                      <div
                        className="overflow-y-auto overflow-x-hidden flex-1 px-2 pb-2"
                        style={{ maxHeight: "200px" }}
                      >
                        <div className="grid grid-cols-3 gap-2 mb-3">
                          {ICON_PICKER_PLATFORMS.map((key) => {
                            const coloredUrl = getPlatformIconUrl(key, "colored");
                            const name = PLATFORM_DISPLAY_NAMES[key] ?? key;
                            return (
                              <button
                                key={key}
                                type="button"
                                onMouseDown={(e) => {
                                  e.stopPropagation();
                                  e.preventDefault();
                                }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  e.preventDefault();
                                  handleIconSelect(e, key);
                                }}
                                className="flex flex-col items-center p-2 hover:bg-gray-50 rounded-md transition cursor-pointer"
                              >
                                <div className="w-8 h-8 flex items-center justify-center mb-1">
                                  {coloredUrl ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img
                                      src={coloredUrl}
                                      alt={name}
                                      width={32}
                                      height={32}
                                      className="w-7 h-7 object-contain"
                                      loading="lazy"
                                    />
                                  ) : (
                                    <FaLink className="w-6 h-6 text-gray-400" />
                                  )}
                                </div>
                                <span className="text-[10px] text-gray-600 truncate w-full text-center">
                                  {name}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                      <div className="border-t pt-2 px-2 pb-2 shrink-0">
                        <button
                          type="button"
                          onMouseDown={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            console.log("custom - button clicked");
                            handleIconSelect(e, "custom");
                          }}
                          className="w-full flex items-center gap-2 p-2 hover:bg-gray-50 rounded-md transition cursor-pointer"
                        >
                          <CameraIcon className="h-5 w-5 text-gray-600" />
                          <span className="text-sm">Upload Image</span>
                        </button>
                      </div>
                    </div>
                  </>,
                  document.body,
                )}

              {/* Hidden file input */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept="image/*"
                className="hidden"
              />

              {/* Text - REMOVED onClick from container, added to individual elements */}
              <div className="flex-1 min-w-0">
                <button
                  type="button"
                  onClick={handlePlatformNameClick}
                  className="block w-full text-left font-semibold text-[13px] md:text-[16px] truncate hover:text-gray-700 transition-colors"
                >
                  {item.title}
                </button>

                <button
                  type="button"
                  onClick={handleUrlClick}
                  className="block w-full text-left text-[11px] md:text-[13px] text-gray-600 hover:text-gray-800 transition-colors"
                >
                  {truncateUrl(item.url)}
                </button>
              </div>
            </div>

            {/* ================= CROP MODAL ================= */}
            {showCropModal &&
              selectedImage &&
              typeof window !== "undefined" &&
              createPortal(
                <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/50">
                  <div className="bg-white p-6 w-full max-w-[90vw] md:max-w-md mx-4 max-h-[80vh] flex flex-col overflow-hidden">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold">Crop Image</h3>
                      <button
                        type="button"
                        onClick={() => {
                          setShowCropModal(false);
                          setSelectedImage("");
                        }}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        ✕
                      </button>
                    </div>

                    <div className="mb-4 flex-1 overflow-auto">
                      <div className="relative mx-auto w-full md:w-[400px] h-[320px] max-w-full">
                        <ReactCrop
                          className="w-full h-full"
                          crop={crop}
                          onChange={(_, percentCrop) => setCrop(percentCrop)}
                          onComplete={handleCropComplete}
                          aspect={1}
                        >
                          <img
                            ref={imgRef}
                            src={selectedImage}
                            alt="Crop preview"
                            className="w-full h-full object-contain"
                          />
                        </ReactCrop>
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 border-t pt-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => {
                          setShowCropModal(false);
                          setSelectedImage("");
                        }}
                        className="px-4 py-2 text-sm border rounded-md hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleSaveCroppedImage}
                        className="px-4 py-2 text-sm bg-black text-white  hover:bg-gray-800"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </div>,
                document.body,
              )}

            {/* ================= ACTION ROW ================= */}
            <div className="flex items-center justify-between mt-2 md:mt-4">
              {/* Analytics */}
              <button
                type="button"
                onClick={handleAnalyticsClick}
                className="flex items-center gap-1 text-[10px] md:text-[12px] text-gray-500 hover:text-gray-700 transition-colors"
              >
                <ChartBarIcon className="h-3 w-3 md:h-4 md:w-4" />
                {item.clickCount} clicks
              </button>

              {/* Controls */}
              <div className="flex items-center gap-2 md:gap-4">
                {/* Toggle - Off (left) / On (right) */}
                <button
                  type="button"
                  onClick={handleToggleClick}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onTouchStart={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  className={`relative h-5 w-9 md:h-6 md:w-11 rounded-full transition cursor-pointer ${
                    isActive ? "bg-[#331400]" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 h-4 w-4 md:h-5 md:w-5 bg-white rounded-full transition-transform duration-200 ${
                      isActive
                        ? "translate-x-4 md:translate-x-5 left-0.5" // On: move to right
                        : "translate-x-0 left-0.5" // Off: stay on left
                    }`}
                  />
                </button>

                {/* Edit */}
                <button
                  type="button"
                  onClick={handleEditClick}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onTouchStart={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  className="hover:opacity-70 transition-opacity cursor-pointer"
                >
                  <PencilIcon className="h-4 w-4 md:h-5 md:w-5 text-gray-600" />
                </button>

                {/* Delete */}
                <button
                  type="button"
                  onClick={handleDeleteClick}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onTouchStart={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  className="hover:opacity-70 transition-opacity cursor-pointer"
                >
                  <TrashIcon className="h-4 w-4 md:h-5 md:w-5 text-red-500" />
                </button>
              </div>
            </div>

            {/* ================= ANALYTICS ================= */}
            {showAnalytics && (
              <div className="mt-3 md:mt-4 p-2 md:p-3 bg-gray-50 border rounded-md text-[11px] md:text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Last clicked: 2 days ago</span>
                  <span>Top location: US</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LinkCard;
