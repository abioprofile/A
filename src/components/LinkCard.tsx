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

// Icon mapping
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

  const handleEdit = (e: MouseEvent | PointerEvent) => {
    stopAll(e);
    onEdit(item);
  };

  const handleDelete = (e: MouseEvent | PointerEvent) => {
    stopAll(e);
    onDelete(item.id);
  };

  const toggleAnalytics = (e: MouseEvent | PointerEvent) => {
    stopAll(e);
    setShowAnalytics((s) => !s);
  };

  const toggleActive = (e: MouseEvent | PointerEvent) => {
    stopAll(e);
    setIsActive((a) => !a);
  };

  return (
    <div className="w-full overflow-hidden">
      {/* Card */}
      <div className="w-full py-4 -mb-4">
        <div
          className={`transition-all duration-200 ${
            isActive
              ? ' p-[2px]'
              : 'border border-[#000] hover:border-[#000] p-[2px]'
          }`}
        >
          <div className="flex items-center bg-[#FAFAFC] p-4 select-none w-full">
            {/* Drag handle (visual only) */}
            <div
              className="flex flex-col justify-center items-center mr-4 cursor-grab space-y-1"
              aria-hidden
            >
              {[0, 1, 2].map((row) => (
                <div key={row} className="flex space-x-1">
                  <span className="w-1 h-1 bg-[#ff0000] rounded-full" />
                  <span className="w-1 h-1 bg-[#ff0000] rounded-full" />
                </div>
              ))}
            </div>

            {/* Icon */}
            <div className="flex justify-center items-center w-5 h-5 rounded-full mr-4">
              <Image
                src={iconSrc}
                alt={`${item.platform} icon`}
                width={30}
                height={30}
                className="object-contain pointer-events-none"
                draggable={false}
              />
            </div>

            {/* Main content */}
            <div className="flex justify-between items-center w-full">
              <div
                className={`space-y-2 transition-opacity duration-300 ${
                  isActive ? 'opacity-100' : 'opacity-50'
                }`}
              >
                {/* Platform (edit) */}
                <div className="flex items-center mb-0">
                  <button
                    type="button"
                    onClick={handleEdit}
                    onPointerDown={stopAll}
                    className="font-bold text-[16px] hover:text-[#ff0000] transition-colors outline-none"
                  >
                    {item.platform}
                  </button>

                  <button
                    type="button"
                    onClick={handleEdit}
                    onPointerDown={stopAll}
                    className="text-gray-500 hover:text-[#ff0000] transition-colors p-1 rounded"
                    aria-label={`Edit ${item.platform}`}
                  >
                    <PencilIcon className="h-3 w-3 pointer-events-none" />
                  </button>
                </div>

                {/* URL (edit) */}
                <div className="flex font-medium mb-1 text-[13px] items-center">
                  <button
                    type="button"
                    onClick={handleEdit}
                    onPointerDown={stopAll}
                    className="text-left hover:text-[#ff0000] transition-colors outline-none"
                    title={item.url}
                  >
                    {item.url}
                  </button>

                  <button
                    type="button"
                    onClick={handleEdit}
                    onPointerDown={stopAll}
                    className="text-gray-500 hover:text-[#ff0000] transition-colors p-1 rounded"
                    aria-label={`Edit URL for ${item.platform}`}
                  >
                    <PencilIcon className="h-3 w-3 pointer-events-none" />
                  </button>
                </div>

                {/* Analytics toggle */}
                <div className="flex items-center text-[10px] text-gray-500 gap-2">
                  <button
                    type="button"
                    onClick={toggleAnalytics}
                    onPointerDown={stopAll}
                    className="flex items-start gap-1 hover:text-[#ff0000] transition-colors"
                    aria-expanded={showAnalytics}
                    aria-controls={`analytics-${item.id}`}
                  >
                    <ChartBarIcon className="h-3 w-3 pointer-events-none" />
                    <span>{item.clicks} clicks</span>
                  </button>
                </div>
              </div>

              {/* Toggle & Delete */}
              <div className="flex items-center gap-4 ml-4">
                {/* Accessible switch (button) */}
                <button
                  type="button"
                  role="switch"
                  aria-checked={isActive}
                  onClick={toggleActive}
                  onPointerDown={stopAll}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${
                    isActive ? 'bg-[#000]' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform duration-300 ${
                      isActive ? 'translate-x-5' : 'translate-x-0.5'
                    }`}
                  />
                </button>

                {/* Delete */}
                <button
                  type="button"
                  onClick={handleDelete}
                  onPointerDown={stopAll}
                  className="text-gray-600 hover:text-red-500 transition-colors p-1 rounded"
                  aria-label={`Delete ${item.platform}`}
                >
                  <TrashIcon className="h-5 w-5 pointer-events-none" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom analytics */}
        <div
          id={`analytics-${item.id}`}
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            showAnalytics ? 'max-h-40 opacity-100 mt-4' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-md">
            <h4 className="font-medium text-gray-700 mb-2">Link Analytics</h4>
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>Last clicked: 2 days ago</span>
              <span>Top location: United States</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LinkCard;