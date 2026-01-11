'use client';

import { useState, useEffect } from 'react';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import LinkCard from './LinkCard';
import DeleteModal from './DeleteModal';
import EditModal from './EditModal';
import { X } from "lucide-react";
import { ProfileLink } from '@/types/auth.types';

type LinkItem = {
  id: string;
  platform: string;
  url: string;
  clicks: number;
  customIcon?: string;

  // FORM SUPPORT
  isForm?: boolean;
  form?: {
    fields: {
      name: boolean;
      email: boolean;
      phone: boolean;
    };
    title: string;
    buttonText: string;
    successMessage: string;
  };
};

// Icon mapping - adjust these paths to match where your icons are stored
const platformIcons: Record<string, string> = {
  'Instagram': '/icons/instagram.png',
  'Behance': '/icons/behance.png',
  'Snapchat': '/icons/snapchat.png',
  'X': '/icons/x.png',
  'Twitter': '/icons/twitter.png',
  'YouTube': '/icons/youtube.png',
  'Facebook': '/icons/facebook.png',
  'LinkedIn': '/icons/linkedin.png',
  'GitHub': '/icons/github.png',
  'Figma': '/icons/figma.png',
  'Dribbble': '/icons/dribbble.png',
  'Spotify': '/icons/spotify.png',
  'Apple': '/icons/apple.png',
  'Google': '/icons/google.png',
  'Amazon': '/icons/amazon.png',
  'Website': '/icons/website.png',
  'Form': '/icons/form.png',
  'Link': '/icons/link.png',
  // Add more as needed
};

// Suggested platforms with their icons
const suggestedPlatforms = [
  { name: 'Instagram', icon: '/icons/instagram.png', abbr: 'IG' },
  { name: 'Pinterest', icon: '/icons/pinterest.png', abbr: 'P' },
  { name: 'YouTube', icon: '/icons/youtube (2).png', abbr: 'YT' },
  { name: 'Snapchat', icon: '/icons/snapchat.png', abbr: 'SC' },
  { name: 'X', icon: '/icons/x.png', abbr: 'X' },
  { name: 'Psotify', icon: '/icons/Spotify.png', abbr: 'sp' },
  { name: 'Telegram', icon: '/icons/Telegram.png', abbr: 'FB' },
  { name: 'LinkedIn', icon: '/icons/linkedin-icon.svg', abbr: 'LI' },
  { name: 'TikTok', icon: '/icons/TikTok.png', abbr: 'TT' },
];

export default function LinkList({linksDataData}: {linksDataData: ProfileLink[]}) { 
  const [linksData, setLinksData] = useState<ProfileLink[]>(linksDataData);
  
  // Update linksData when prop changes (important for when data loads asynchronously)
  useEffect(() => {
    if (linksDataData && linksDataData.length > 0) {
      setLinksData(linksDataData);
    }
  }, [linksDataData]);

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editItem, setEditItem] = useState<ProfileLink | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const sensors = useSensors(useSensor(PointerSensor));



  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={({ active, over }) => {
          if (active.id !== over?.id) {
            const oldIndex = linksData.findIndex((i: ProfileLink) => i.id === active.id);
            const newIndex = linksData.findIndex((i: ProfileLink) => i.id === over?.id);
            setLinksData(arrayMove(linksData, oldIndex, newIndex));   
          }
        }}
      >
        <div className="md:max-w-2xl mx-auto px-6 md:px-0 md:bg-white py-[2px] flex flex-col h-[calc(100vh-320px)] md:h-[calc(100vh-250px)]" >

          {/* STACK LIST */}
          <div className="flex-1 overflow-y-auto">
            <SortableContext items={linksData.map((link: ProfileLink) => link.id)} strategy={verticalListSortingStrategy}>
              <div className="md:space-y-1 md:pr-2">

                {linksData.map((item: ProfileLink) => (
                  <SortableItem
                    key={item.id}
                    item={item}
                    setLinks={setLinksData}
                    onDelete={() => setDeleteId(item.id)}
                    onEdit={(item: ProfileLink) => setEditItem(item)}
                  />
                ))}

              </div>
            </SortableContext>
          </div>

          {/* ADD BUTTON */}
          <div>
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="
                w-full py-3
                mt-3 md:mt-6
                shadow-md
                bg-[#331400]
                text-[#FED45C]
                font-semibold
              "
            >
              + Add
            </button>

          </div>
        </div>
      </DndContext>

      {/* DELETE */}
      <DeleteModal
        isOpen={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={() => {
          setLinksData((prev: ProfileLink[]) => prev.filter((item: ProfileLink) => item.id !== deleteId));
          setDeleteId(null);
        }}
      />

      {/* EDIT */}
      <EditModal
        isOpen={editItem !== null}
        onClose={() => setEditItem(null)}
        onSave={() => {}}
        initialPlatform={editItem?.platform || ''}
        initialUrl={editItem?.url || ''}
      />

      {/* ADD – MOBILE FULL PAGE */}
      {isAddModalOpen && (
        <>
          {/* MOBILE VIEW */}
          <div className="fixed inset-0 z-[999] bg-[#FFF7DE] md:hidden flex flex-col">
            
            {/* HEADER */}
            <div className="sticky top-0 flex items-center justify-between px-4 py-8 border-b bg-[#FFF7DE]">
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="flex items-center gap-2 font-semibold text-[#331400]"
              >
                ← Add Board
              </button>

              
            </div>

            {/* CONTENT */}
            <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">

              {/* SEARCH */}
              <div className="bg-gray-200 px-4 py-3 flex items-center gap-3 text-gray-500 ">
                <img 
                  src="/icons/search.svg" 
                  alt="Search" 
                  className="w-5 h-5 opacity-60"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextElementSibling?.classList.remove('hidden');
                  }}
                />
                <span className="text-sm">Paste or search a link</span>
              </div>

              {/* ADD LINK */}
              <button
                // onClick={handleAddLink}
                className="w-full bg-[#FED45CB2] border-2 border-[#ff0000] p-6 flex items-center justify-between  hover:bg-[#f5c84c] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <img 
                    src="/icons/link.png" 
                    alt="Link" 
                    className="w-6 h-6"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                  <span className="font-medium text-[#331400]">Add Link</span>
                </div>
                <span className="font-semibold text-[#331400]">&gt;&gt;</span>
              </button>

              {/* ADD FORM */}
              {/* <button
                onClick={handleAddForm}
                className="w-full bg-[#FED45CB2] border-2 border-[#ff0000] p-6 flex items-center justify-between  hover:bg-[#f5c84c] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <img 
                    src="/icons/form.png" 
                    alt="Form" 
                    className="w-6 h-6"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                  <span className="font-medium text-[#331400]">Form</span>
                </div>
                <span className="font-semibold text-[#331400]">&gt;&gt;</span>
              </button>  */}

              {/* SUGGESTED */}
              <div className='mb-4'>
  <p className="font-semibold mb-3 text-[#331400]">Suggested</p>
  <div className="relative">
    {/* Gradient fade on the right to indicate more content */}
    <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-[#FFF7DE] to-transparent pointer-events-none z-10"></div>
    
    <div className="flex items-center gap-4 overflow-x-auto pb-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      {suggestedPlatforms.map((platform, index) => (
        <button
          key={index}
          // onClick={() => handleAddSuggested(platform.name)}
          className="flex flex-col items-center gap-2 flex-shrink-0 hover:opacity-80 transition-opacity active:scale-95"
        >
          <div className="flex items-center justify-center shadow-md border border-gray-200 rounded-full overflow-hidden hover:shadow-lg transition-shadow">
            <img 
              src={platform.icon} 
              alt={platform.name}
              className="w-12 h-12 object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.parentElement!.innerHTML = `<div class="w-12 h-12 rounded-full bg-[#FED45C] flex items-center justify-center"><span class="text-[#331400] font-bold text-sm">${platform.abbr}</span></div>`;
              }}
            />
          </div>
        </button>
      ))}
    </div>
  </div>
              </div>
              {/* RECENTLY ADDED PLACEHOLDERS */}
              {/* <div className="space-y-4">
                <div className="bg-gray-100 h-32  p-4">
                  <p className="text-sm text-gray-500 mb-2">Recently Added</p>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                    <div className="text-sm text-gray-700">Instagram</div>
                  </div>
                </div>
                <div className="bg-gray-100 h-32  p-4">
                  <p className="text-sm text-gray-500 mb-2">Popular</p>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                    <div className="text-sm text-gray-700">YouTube</div>
                  </div>
                </div>
              </div> */}

            </div>
          </div>

          {/* DESKTOP MODAL */}
          <div className="hidden md:flex fixed inset-0 bg-black/40 items-center justify-center z-50">
            <div className="bg-white w-full max-w-lg p-6 shadow-lg relative">

              <button 
                onClick={() => setIsAddModalOpen(false)} 
                className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>

              <h2 className="text-2xl font-bold mb-6 text-[#331400]">Add New Item</h2>

              {/* SEARCH BAR */}
              <div className="bg-gray-100  w-full p-4 mb-6 text-sm text-gray-500  flex items-center gap-3">
                <img 
                  src="/icons/search.svg" 
                  alt="Search" 
                  className="w-5 h-5 opacity-60"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
                <span>Paste or search a link</span>
              </div>

              {/* ADD OPTIONS */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <button
                  // onClick={handleAddLink}
                  className="bg-[#FED45CB2] border-2 border-[#ff0000] p-4 text-center  hover:bg-[#f5c84c] transition-colors flex flex-col items-center justify-center gap-3"
                >
                  <img 
                    src="/icons/link.png" 
                    alt="Link" 
                    className="w-10 h-10"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                  <p className="text-[14px] font-medium text-[#331400]">Add Link</p>
                </button>

                {/* <button
                  onClick={handleAddForm}
                  className="bg-[#FED45CB2] border-2 border-[#ff0000] p-4 text-center  hover:bg-[#f5c84c] transition-colors flex flex-col items-center justify-center gap-3"
                >
                  <img 
                    src="/icons/form.png" 
                    alt="Form" 
                    className="w-10 h-10"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                  <p className="text-[14px] font-medium text-[#331400]">Form</p>
                </button>  */}
              </div>

              {/* SUGGESTED ICONS */}
               <div className='mb-4'>
  <p className="font-semibold mb-3 text-[#331400]">Suggested</p>
  <div className="relative">
    {/* Gradient fade on the right to indicate more content */}
    <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-[#FFF7DE] to-transparent pointer-events-none z-10"></div>
    
    <div className="flex items-center gap-4 overflow-x-auto pb-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      {suggestedPlatforms.map((platform, index) => (
        <button
          key={index}
          // onClick={() => handleAddSuggested(platform.name)}
          className="flex flex-col items-center gap-2 flex-shrink-0 hover:opacity-80 transition-opacity active:scale-95"
        >
          <div className="flex items-center justify-center shadow-md border border-gray-200 rounded-full overflow-hidden hover:shadow-lg transition-shadow">
            <img 
              src={platform.icon} 
              alt={platform.name}
              className="w-12 h-12 object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.parentElement!.innerHTML = `<div class="w-12 h-12 rounded-full bg-[#FED45C] flex items-center justify-center"><span class="text-[#331400] font-bold text-sm">${platform.abbr}</span></div>`;
              }}
            />
          </div>
        </button>
      ))}
    </div>
  </div>
              </div>

              {/* RECENTLY ADDED PLACEHOLDERS */}
              {/* <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-100 h-32  p-4">
                  <p className="text-sm text-gray-500 mb-2">Recently Added</p>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                    <div className="text-sm text-gray-700">Instagram</div>
                  </div>
                </div>
                <div className="bg-gray-100 h-32  p-4">
                  <p className="text-sm text-gray-500 mb-2">Popular</p>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                    <div className="text-sm text-gray-700">YouTube</div>
                  </div>
                </div>
              </div> */}

            </div>
          </div>
        </>
      )}
    </>
  );
}

function SortableItem({ item, setLinks, onDelete, onEdit }: any) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  // State to track which field inputs are visible
  const [visibleInputs, setVisibleInputs] = useState({
    name: false,
    email: false,
    phone: false
  });

  // Simple toggle for input visibility
  const toggleInputVisibility = (field: 'name' | 'email' | 'phone') => {
    setVisibleInputs(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  // Handle field toggle (existing functionality)
  const handleFieldToggle = (field: 'name' | 'email' | 'phone') => {
    setLinks((prev: any) =>
      prev.map((x: any) =>
        x.id === item.id
          ? {
              ...x,
              form: {
                ...x.form,
                fields: {
                  ...x.form.fields,
                  [field]: !x.form.fields[field],
                },
              },
            }
          : x
      )
    );
  };

  if (item.isForm) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className="bg-[#FAFAFC] p-5 mt-4 shadow-sm rounded-lg"
      >
        {/* COLLECTING */}
        <p className="text-xs font-semibold mb-3 text-gray-500">COLLECTING</p>

        <div className="flex gap-4 mb-6">
          {["name", "email", "phone"].map((f) => (
            <div key={f} className="flex flex-col">
              <button
                onClick={() => {
                  handleFieldToggle(f as 'name' | 'email' | 'phone');
                  toggleInputVisibility(f as 'name' | 'email' | 'phone');
                }}
                className={`px-6 py-3 border  transition-colors ${
                  item.form.fields[f] 
                    ? "bg-[#331400] text-[#FED45C] border-[#331400]" 
                    : "bg-white text-gray-700 border-gray-300 hover:border-[#331400]"
                }`}
              >
                {f[0].toUpperCase() + f.slice(1)}
              </button>
              
              {/* Input stack that appears below when button is clicked */}
              {visibleInputs[f as 'name' | 'email' | 'phone'] && (
                <div className="mt-2 p-4 bg-white border border-gray-300 rounded-lg shadow-sm">
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs text-gray-500 mb-1 block font-medium">
                        {f.toUpperCase()} FIELD LABEL
                      </label>
                      <input
                        type="text"
                        placeholder={`Enter ${f} label`}
                        className="w-full p-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-[#331400]"
                        defaultValue={f[0].toUpperCase() + f.slice(1)}
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 mb-1 block font-medium">
                        PLACEHOLDER TEXT
                      </label>
                      <input
                        type="text"
                        placeholder={`Enter ${f} placeholder`}
                        className="w-full p-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-[#331400]"
                        defaultValue={`Enter your ${f}`}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* TITLE */}
        <div className="bg-gray-100 p-4 mb-4 border border-gray-300 rounded relative">
          <p className="text-xs text-gray-500 mb-1 font-medium">TITLE</p>
          <input
            value={item.form.title}
            onChange={(e) =>
              setLinks((prev: any) =>
                prev.map((x: any) =>
                  x.id === item.id
                    ? { ...x, form: { ...x.form, title: e.target.value } }
                    : x
                )
              )
            }
            className="w-full bg-transparent outline-none font-medium pr-16 text-[#331400]"
            maxLength={24}
          />
          <div className="absolute bottom-2 right-3 text-xs text-gray-500">
            {item.form.title.length}/24
          </div>
        </div>

        {/* BUTTON TEXT */}
        <div className="bg-gray-100 p-4 mb-4 border border-gray-300 rounded relative">
          <p className="text-xs text-gray-500 mb-1 font-medium">BUTTON TEXT</p>
          <input
            value={item.form.buttonText}
            onChange={(e) =>
              setLinks((prev: any) =>
                prev.map((x: any) =>
                  x.id === item.id
                    ? { ...x, form: { ...x.form, buttonText: e.target.value } }
                    : x
                )
              )
            }
            className="w-full bg-transparent outline-none font-medium pr-16 text-[#331400]"
            maxLength={24}
          />
          <div className="absolute bottom-2 right-3 text-xs text-gray-500">
            {item.form.buttonText.length}/24
          </div>
        </div>

        {/* SUCCESS MESSAGE */}
        <div className="bg-gray-100 p-4 border border-gray-300 rounded relative">
          <p className="text-xs text-gray-500 mb-1 font-medium">SUCCESS MESSAGE</p>
          <input
            value={item.form.successMessage}
            onChange={(e) =>
              setLinks((prev: any) =>
                prev.map((x: any) =>
                  x.id === item.id
                    ? {
                        ...x,
                        form: { ...x.form, successMessage: e.target.value },
                      }
                    : x
                )
              )
            }
            className="w-full bg-transparent outline-none font-medium pr-16 text-[#331400]"
            maxLength={24}
          />
          <div className="absolute bottom-2 right-3 text-xs text-gray-500">
            {item.form.successMessage.length}/24
          </div>
        </div>

      </div>
    );
  }

  // NORMAL LINK CARD
  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <LinkCard item={item} onDelete={onDelete} onEdit={onEdit} />
    </div>
  );
}