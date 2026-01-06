'use client';

import { FC, useState, MouseEvent, PointerEvent } from 'react';
import Image from 'next/image';
import { TrashIcon, PencilIcon, ChartBarIcon } from '@heroicons/react/24/outline';

type LinkItem = {
  id: string;
  platform: string;
  url: string;
  clicks: number;
};

type Props = {
  item: LinkItem;
  onDelete: (id: string) => void;
  onEdit: (item: LinkItem) => void;
};

const platformIcons: Record<string, string> = {
  snapchat: '/icons/Social 1.png',
  instagram: '/icons/Social.png',
  behance: '/icons/Social 2.png',
  linkedin: '/icons/linkedin.png',
  tiktok: '/icons/tiktok.png',
  x: '/icons/Social 3.png',
};

const stopAll = (e: MouseEvent | PointerEvent) => {
  e.preventDefault();
  e.stopPropagation();
};

const LinkCard: FC<Props> = ({ item, onDelete, onEdit }) => {
  const [isActive, setIsActive] = useState(true);
  const [showAnalytics, setShowAnalytics] = useState(false);

  const iconSrc =
    platformIcons[item.platform?.toLowerCase?.()] || '/icons/default.png';

  return (
    <div className="w-full">
      <div className="py-2 md:py-3">
        <div className={`p-[1px] md:p-[2px] ${isActive ? '' : 'border border-black'}`}>
          <div className="bg-[#FAFAFC] rounded-md p-3 md:p-4">

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

              {/* Icon */}
              <Image
                src={iconSrc}
                alt={item.platform}
                width={28}
                height={28}
                className="w-6 h-6 md:w-8 md:h-8 object-contain"
                draggable={false}
              />

              {/* Text */}
              <div className="flex-1 min-w-0">
                <button
                  onClick={(e) => {
                    stopAll(e);
                    onEdit(item);
                  }}
                  className="block font-semibold text-[13px] md:text-[16px] truncate"
                >
                  {item.platform}
                </button>

                <button
                  onClick={(e) => {
                    stopAll(e);
                    onEdit(item);
                  }}
                  className="block text-[11px] md:text-[13px] text-gray-600 truncate text-left"
                >
                  {item.url}
                </button>
              </div>
            </div>

            {/* ================= ACTION ROW ================= */}
            <div className="flex items-center justify-between mt-2 md:mt-4">

              {/* Analytics */}
              <button
                onClick={(e) => {
                  stopAll(e);
                  setShowAnalytics(!showAnalytics);
                }}
                className="flex items-center gap-1 text-[10px] md:text-[12px] text-gray-500"
              >
                <ChartBarIcon className="h-3 w-3 md:h-4 md:w-4" />
                {item.clicks} clicks
              </button>

              {/* Controls */}
              <div className="flex items-center gap-2 md:gap-4">

                {/* Toggle */}
                <button
                  role="switch"
                  aria-checked={isActive}
                  onClick={(e) => {
                    stopAll(e);
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
                  onClick={(e) => {
                    stopAll(e);
                    onEdit(item);
                  }}
                >
                  <PencilIcon className="h-4 w-4 md:h-5 md:w-5 text-gray-600" />
                </button>

                {/* Delete */}
                <button
                  onClick={(e) => {
                    stopAll(e);
                    onDelete(item.id);
                  }}
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
