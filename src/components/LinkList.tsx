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

type LinkItem = {
  id: string;
  platform: string;
  url: string;
  clicks: number;
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
        <div className="max-w-2xl mx-auto bg-white py-[2px] flex flex-col" style={{ height: 'calc(100vh - 300px)' }}>
        
          
          {/* Scrollable container for links */}
          <div className="flex-1 overflow-y-auto">
            <SortableContext items={links.map((link) => link.id)} strategy={verticalListSortingStrategy}>
              <div className="space-y-1 pr-2"> 
                {links.map((item) => (
                  <SortableItem
                    key={item.id}
                    item={item}
                    onDelete={() => setDeleteId(item.id)}
                    onEdit={(item) => setEditItem(item)}
                  />
                ))}
              </div>
            </SortableContext>
          </div>
          
          {/* Fixed Add Link button */}
          <div className="">
            <button 
              onClick={handleAddLink}
              className="w-full py-3 mt-8 shadow-md bg-gradient-to-r from-[#7140EB] to-[#FB8E8E] text-white font-semibold"
            >
              + Add Link
            </button>
          </div>
        </div>
      </DndContext>

      <DeleteModal
        isOpen={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={() => {
          setLinks((prev) => prev.filter((item) => item.id !== deleteId));
          setDeleteId(null);
        }}
      />

      <EditModal
        isOpen={editItem !== null}
        onClose={() => setEditItem(null)}
        onSave={handleSaveEdit}
        initialPlatform={editItem?.platform || ''}
        initialUrl={editItem?.url || ''}
      />
    </>
  );
}

function SortableItem({
  item,
  onDelete,
  onEdit,
}: {
  item: LinkItem;
  onDelete: (id: string) => void;
  onEdit: (item: LinkItem) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} >
      <LinkCard item={item} onDelete={onDelete} onEdit={onEdit} />
    </div>
  );
}
  