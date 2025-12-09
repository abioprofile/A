'use client';

import { useState } from 'react';
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

type LinkItem = {
  id: string;
  platform: string;
  url: string;
  clicks: number;

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

export default function LinkList() {
  const [links, setLinks] = useState<LinkItem[]>([
    { id: '1', platform: 'Instagram', url: 'https://www.instagram.com/davidosh', clicks: 0 },
    { id: '2', platform: 'Behance', url: 'https://www.behance.net/davidosh', clicks: 0 },
    { id: '3', platform: 'Snapchat', url: 'https://www.snapchat.com/add/davidosh', clicks: 0 },
    { id: '4', platform: 'X', url: 'https://x.com/davidosh', clicks: 0 },
  ]);

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editItem, setEditItem] = useState<LinkItem | null>(null);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const sensors = useSensors(useSensor(PointerSensor));

  const handleSaveEdit = (platform: string, url: string) => {
    if (editItem) {
      setLinks((prev) =>
        prev.map((item) =>
          item.id === editItem.id ? { ...item, platform, url } : item
        )
      );
      setEditItem(null);
    }
  };

  // ADD NORMAL LINK
  const handleAddLink = () => {
    const newId = (links.length + 1).toString();
    setLinks(prev => [
      ...prev,
      {
        id: newId,
        platform: 'New Platform',
        url: 'https://example.com',
        clicks: 0
      }
    ]);
    setIsAddModalOpen(false);
  };

  // ADD FORM BLOCK
  const handleAddForm = () => {
    const newId = (links.length + 1).toString();

    setLinks(prev => [
      ...prev,
      {
        id: newId,
        platform: "Form",
        url: "",
        clicks: 0,
        isForm: true,
        form: {
          fields: { name: true, email: true, phone: false },
          title: "DNA Checkup",
          buttonText: "Submit",
          successMessage: "Submitted"
        }
      }
    ]);

    setIsAddModalOpen(false);
  };

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={({ active, over }) => {
          if (active.id !== over?.id) {
            const oldIndex = links.findIndex((i) => i.id === active.id);
            const newIndex = links.findIndex((i) => i.id === over?.id);
            setLinks(arrayMove(links, oldIndex, newIndex));
          }
        }}
      >
        <div className="max-w-2xl mx-auto bg-white py-[2px] flex flex-col" style={{ height: 'calc(100vh - 250px)' }}>

          {/* STACK LIST */}
          <div className="flex-1 overflow-y-auto">
            <SortableContext items={links.map((link) => link.id)} strategy={verticalListSortingStrategy}>
              <div className="space-y-1 pr-2">

                {links.map((item) => (
                  <SortableItem
                    key={item.id}
                    item={item}
                    setLinks={setLinks}
                    onDelete={() => setDeleteId(item.id)}
                    onEdit={(item: LinkItem) => setEditItem(item)}
                  />
                ))}

              </div>
            </SortableContext>
          </div>

          {/* ADD BUTTON */}
          <div>
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="w-full py-3 mt-6 shadow-md bg-[#331400] text-[#FED45C] font-semibold"
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
          setLinks((prev) => prev.filter((item) => item.id !== deleteId));
          setDeleteId(null);
        }}
      />

      {/* EDIT */}
      <EditModal
        isOpen={editItem !== null}
        onClose={() => setEditItem(null)}
        onSave={handleSaveEdit}
        initialPlatform={editItem?.platform || ''}
        initialUrl={editItem?.url || ''}
      />

      {/* ADD MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-lg p-6 shadow-lg relative">

            <button onClick={() => setIsAddModalOpen(false)} className="absolute right-4 top-4">
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-semibold mb-4">Add</h2>

            <div className="bg-gray-100 w-full p-3 mb-6 text-sm text-gray-500">
              Paste or search a link
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">

              <button
                onClick={handleAddLink}
                className="bg-[#FED45C] border border-red-400 p-6 text-center"
              >
                <p className="text-sm font-medium">Add Link &gt;&gt;</p>
              </button>

              <button
                onClick={handleAddForm}
                className="bg-[#FED45C] border border-red-400 p-6 text-center"
              >
                <p className="text-sm font-medium">Form &gt;&gt;</p>
              </button>

            </div>

            {/* Icons */}
            <p className="font-medium mb-3">Suggested</p>
            <div className="flex items-center gap-3 mb-8">
              {Array(9).fill(0).map((_, i) => (
                <div key={i} className="w-10 h-10 bg-gray-200 rounded-full" />
              ))}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-200 h-32 rounded" />
              <div className="bg-gray-200 h-32 rounded" />
            </div>

          </div>
        </div>
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
        className="bg-[#FAFAFC] p-5 mt-4 shadow-sm"
      >
        {/* COLLECTING */}
        <p className="text-xs font-semibold mb-3">COLLECTING</p>

        <div className="flex gap-4 mb-6">
          {["name", "email", "phone"].map((f) => (
            <div key={f} className="flex flex-col">
              <button
                onClick={() => {
                  handleFieldToggle(f as 'name' | 'email' | 'phone');
                  toggleInputVisibility(f as 'name' | 'email' | 'phone');
                }}
                className={`px-6 py-3 border ${
                  item.form.fields[f] ? "bg-black text-white" : "bg-white"
                }`}
              >
                {f[0].toUpperCase() + f.slice(1)}
              </button>
              
              {/* Input stack that appears below when button is clicked */}
              {visibleInputs[f as 'name' | 'email' | 'phone'] && (
                <div className="mt-2 p-4 bg-white border border-gray-300 rounded shadow-sm">
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">
                        {f.toUpperCase()} FIELD LABEL
                      </label>
                      <input
                        type="text"
                        placeholder={`Enter ${f} label`}
                        className="w-full p-2 border border-gray-300 rounded text-sm"
                        defaultValue={f[0].toUpperCase() + f.slice(1)}
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">
                        PLACEHOLDER TEXT
                      </label>
                      <input
                        type="text"
                        placeholder={`Enter ${f} placeholder`}
                        className="w-full p-2 border border-gray-300 rounded text-sm"
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
        <div className="bg-gray-100 p-4 mb-4 border relative">
          <p className="text-xs text-gray-500 mb-1">TITLE</p>
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
            className="w-full bg-transparent outline-none font-medium pr-16"
            maxLength={24}
          />
          <div className="absolute bottom-2 right-3 text-xs text-gray-500">
            {item.form.title.length}/24
          </div>
        </div>

        {/* BUTTON TEXT */}
        <div className="bg-gray-100 p-4 mb-4 border relative">
          <p className="text-xs text-gray-500 mb-1">BUTTON TEXT</p>
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
            className="w-full bg-transparent outline-none font-medium pr-16"
            maxLength={24}
          />
          <div className="absolute bottom-2 right-3 text-xs text-gray-500">
            {item.form.buttonText.length}/24
          </div>
        </div>

        {/* SUCCESS MESSAGE */}
        <div className="bg-gray-100 p-4 border relative">
          <p className="text-xs text-gray-500 mb-1">SUCCESS MESSAGE</p>
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
            className="w-full bg-transparent outline-none font-medium pr-16"
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