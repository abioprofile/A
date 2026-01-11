'use client';

import { FC, useState, MouseEvent, useRef } from 'react';
import Image from 'next/image';
import { 
  TrashIcon, 
  PencilIcon, 
  ChartBarIcon, 
  ChevronDownIcon,
  CameraIcon,
  PhotoIcon 
} from '@heroicons/react/24/outline';
import ReactCrop, { Crop, PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

type LinkItem = {
  id: string;
  platform: string;
  url: string;
  clicks: number;
  customIcon?: string;
};

type Props = {
  item: LinkItem;
  onDelete: (id: string) => void;
  onEdit: (item: LinkItem) => void;
  onIconChange: (id: string, iconType: 'platform' | 'custom', value: string) => void;
};

const platformIcons: Record<string, { name: string; icon: string }> = {
  snapchat: { name: 'Snapchat', icon: '/icons/Social 1.png' },
  instagram: { name: 'Instagram', icon: '/icons/Social.png' },
  behance: { name: 'Behance', icon: '/icons/Social 2.png' },
  linkedin: { name: 'LinkedIn', icon: '/icons/linkedin.png' },
  tiktok: { name: 'TikTok', icon: '/icons/tiktok.png' },
  x: { name: 'X (Twitter)', icon: '/icons/Social 3.png' },
  custom: { name: 'Custom Image', icon: '/icons/default.png' },
};

const LinkCard: FC<Props> = ({ item, onDelete, onEdit, onIconChange }) => {
  const [isActive, setIsActive] = useState(true);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showIconDropdown, setShowIconDropdown] = useState(false);
  const [showCropModal, setShowCropModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [crop, setCrop] = useState<Crop>({
    unit: '%',
    width: 100,
    height: 100,
    x: 0,
    y: 0,
  });
  const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const iconSrc = item.customIcon 
    ? item.customIcon 
    : platformIcons[item.platform?.toLowerCase?.()]?.icon || '/icons/default.png';

  const handleIconSelect = (e: MouseEvent, platform: string) => {
    e.stopPropagation();
    if (platform === 'custom') {
      fileInputRef.current?.click();
      setShowIconDropdown(false);
    } else {
      onIconChange(item.id, 'platform', platform);
      setShowIconDropdown(false);
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

    const canvas = document.createElement('canvas');
    const scaleX = imgRef.current.naturalWidth / imgRef.current.width;
    const scaleY = imgRef.current.naturalHeight / imgRef.current.height;
    
    canvas.width = completedCrop.width;
    canvas.height = completedCrop.height;
    
    const ctx = canvas.getContext('2d');
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
      completedCrop.height
    );

    canvas.toBlob((blob) => {
      if (blob) {
        const croppedImageUrl = URL.createObjectURL(blob);
        onIconChange(item.id, 'custom', croppedImageUrl);
        setShowCropModal(false);
        setSelectedImage('');
        setCrop({ unit: '%', width: 100, height: 100, x: 0, y: 0 });
        setCompletedCrop(null);
      }
    }, 'image/png');
  };

  return (
    <div className="w-full">
      <div className="py-2 md:py-3">
        <div className={`p-[1px] md:p-[2px] ${isActive ? '' : 'border border-black'}`}>
          <div className="bg-[#FAFAFC] rounded-md p-4 md:p-4 relative">

            {/* ================= TOP ROW ================= */}
            <div className="flex items-center gap-2 md:gap-3">

              {/* Drag dots (desktop only) */}
              <div className="hidden md:flex flex-col gap-1 cursor-grab">
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
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowIconDropdown(!showIconDropdown);
                  }}
                  className="flex items-center gap-1 hover:opacity-80 transition-opacity"
                >
                  <Image
                    src={iconSrc}
                    alt={item.platform}
                    width={28}
                    height={28}
                    className="w-6 h-6 md:w-8 md:h-8 object-contain"
                    draggable={false}
                  />
                  <ChevronDownIcon className="h-3 w-3 text-gray-500" />
                </button>

                {/* Icon Dropdown */}
                {showIconDropdown && (
                  <>
                    <div 
                      className="fixed inset-0 z-40"
                      onClick={() => setShowIconDropdown(false)}
                    />
                    <div className="absolute left-0 top-full mt-2 z-50 bg-white rounded-lg shadow-lg border min-w-[200px]">
                      <div className="p-2">
                        <h3 className="text-xs font-semibold text-gray-500 mb-2 px-2">
                          Platform Icons
                        </h3>
                        <div className="grid grid-cols-3 gap-2 mb-3">
                          {Object.entries(platformIcons)
                            .filter(([key]) => key !== 'custom')
                            .map(([key, { name, icon }]) => (
                            <button
                              key={key}
                              type="button"
                              onClick={(e) => handleIconSelect(e, key)}
                              className="flex flex-col items-center p-2 hover:bg-gray-50 rounded-md transition"
                            >
                              <Image
                                src={icon}
                                alt={name}
                                width={24}
                                height={24}
                                className="w-6 h-6 object-contain mb-1"
                              />
                              <span className="text-[10px] text-gray-600 truncate w-full text-center">
                                {name}
                              </span>
                            </button>
                          ))}
                        </div>
                        
                        <div className="border-t pt-2">
                          <button
                            type="button"
                            onClick={(e) => handleIconSelect(e, 'custom')}
                            className="w-full flex items-center gap-2 p-2 hover:bg-gray-50 rounded-md transition"
                          >
                            <CameraIcon className="h-5 w-5 text-gray-600" />
                            <span className="text-sm">Upload Image</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Hidden file input */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept="image/*"
                className="hidden"
              />

              {/* Text */}
              <div className="flex-1 min-w-0">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(item);
                  }}
                  className="block font-semibold text-[13px] md:text-[16px] truncate hover:text-gray-700 transition-colors"
                >
                  {item.platform}
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(item);
                  }}
                  className="block text-[11px] md:text-[13px] text-gray-600 truncate text-left hover:text-gray-800 transition-colors"
                >
                  {item.url}
                </button>
              </div>
            </div>

            {/* ================= CROP MODAL ================= */}
            {showCropModal && selectedImage && (
              <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Crop Image</h3>
                    <button
                      type="button"
                      onClick={() => {
                        setShowCropModal(false);
                        setSelectedImage('');
                      }}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      ✕
                    </button>
                  </div>
                  
                  <div className="mb-4">
                    <ReactCrop
                      crop={crop}
                      onChange={(_, percentCrop) => setCrop(percentCrop)}
                      onComplete={handleCropComplete}
                      aspect={1}
                      circularCrop
                    >
                      <img
                        ref={imgRef}
                        src={selectedImage}
                        alt="Crop preview"
                        className="max-h-[300px]"
                      />
                    </ReactCrop>
                  </div>
                  
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setShowCropModal(false);
                        setSelectedImage('');
                      }}
                      className="px-4 py-2 text-sm border rounded-md hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveCroppedImage}
                      className="px-4 py-2 text-sm bg-black text-white rounded-md hover:bg-gray-800"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ================= ACTION ROW ================= */}
            <div className="flex items-center justify-between mt-2 md:mt-4">

              {/* Analytics */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowAnalytics(!showAnalytics);
                }}
                className="flex items-center gap-1 text-[10px] md:text-[12px] text-gray-500 hover:text-gray-700 transition-colors"
              >
                <ChartBarIcon className="h-3 w-3 md:h-4 md:w-4" />
                {item.clicks} clicks
              </button>

              {/* Controls */}
              <div className="flex items-center gap-2 md:gap-4">

                {/* Toggle */}
                <button
                  type="button"
                  role="switch"
                  aria-checked={isActive}
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsActive(!isActive);
                  }}
                  className={`relative h-5 w-9 md:h-6 md:w-11 rounded-full transition ${
                    isActive ? 'bg-black' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 h-4 w-4 md:h-5 md:w-5 bg-white rounded-full transition ${
                      isActive ? 'translate-x-4 md:translate-x-5' : ''
                    }`}
                  />
                </button>

                {/* Edit */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(item);
                  }}
                  className="hover:opacity-70 transition-opacity"
                >
                  <PencilIcon className="h-4 w-4 md:h-5 md:w-5 text-gray-600" />
                </button>

                {/* Delete */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(item.id);
                  }}
                  className="hover:opacity-70 transition-opacity"
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