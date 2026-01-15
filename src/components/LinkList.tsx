"use client";

import { useState, useEffect, useCallback } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import LinkCard from "./LinkCard";
import DeleteModal from "./DeleteModal";
import EditModal from "./EditModal";
import { X } from "lucide-react";
import { ProfileLink } from "@/types/auth.types";
import {
  useAddLinks,
  useUpdateLink,
  useDeleteLink,
  useReorderLinks,
  useGetAllLinks,
} from "@/hooks/api/useAuth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

// Suggested platforms
const PLATFORMS = [
  "INSTAGRAM",
  "TIKTOK",
  "PINTEREST",
  "TWITTER",
  "FACEBOOK",
  "SNAPCHAT",
  "YOUTUBE",
  "LINKEDIN",
  "GITHUB",
  "CUSTOM",
] as const;

export default function LinkList({
  linksDataData,
}: {
  linksDataData: ProfileLink[];
}) {
  const [linksData, setLinksData] = useState<ProfileLink[]>(linksDataData);
  const { refetch: refetchLinks } = useGetAllLinks();

  // Update linksData when prop changes (important for when data loads asynchronously)
  useEffect(() => {
    if (linksDataData && linksDataData.length > 0) {
      setLinksData(linksDataData);
    } else if (linksDataData && linksDataData.length === 0) {
      setLinksData([]);
    }
  }, [linksDataData]);

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editItem, setEditItem] = useState<ProfileLink | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  // Add link form state
  const [newLink, setNewLink] = useState({
    title: "",
    url: "",
    platform: "INSTAGRAM",
    isVisible: true,
  });

  const sensors = useSensors(useSensor(PointerSensor));
  
  // Hooks
  const addLinksMutation = useAddLinks();
  const updateLinkMutation = useUpdateLink();
  const deleteLinkMutation = useDeleteLink();
  const reorderLinksMutation = useReorderLinks();

  // Handle drag end - reorder links
  const handleDragEnd = useCallback(
    async ({ active, over }: { active: any; over: any }) => {
      if (active.id !== over?.id) {
        const oldIndex = linksData.findIndex(
          (i: ProfileLink) => i.id === active.id
        );
        const newIndex = linksData.findIndex(
          (i: ProfileLink) => i.id === over?.id
        );

        if (oldIndex === -1 || newIndex === -1) return;

        const newOrder = arrayMove(linksData, oldIndex, newIndex);
        setLinksData(newOrder);

        // Call API to reorder
        try {
          await reorderLinksMutation.mutateAsync({
            links: newOrder.map((link, index) => ({
              id: link.id,
              displayOrder: index + 1,
            })),
          });
        } catch (error) {
          // Revert on error
          setLinksData(linksData);
          console.error("Failed to reorder links:", error);
        }
      }
    },
    [linksData, reorderLinksMutation]
  );

  // Handle delete
  const handleDelete = useCallback(
    async (linkId: string) => {
      try {
        await deleteLinkMutation.mutateAsync({ linkId });
        setDeleteId(null);
        // Refetch to get updated list
        await refetchLinks();
      } catch (error) {
        console.error("Failed to delete link:", error);
      }
    },
    [deleteLinkMutation, refetchLinks]
  );

  // Handle toggle visibility
  const handleToggleVisibility = useCallback(
    async (link: ProfileLink) => {
      try {
        await updateLinkMutation.mutateAsync({
          linkId: link.id,
          isVisible: !link.isVisible,
        });
        // Optimistically update local state
        setLinksData((prev) =>
          prev.map((l) =>
            l.id === link.id ? { ...l, isVisible: !l.isVisible } : l
          )
        );
        await refetchLinks();
      } catch (error) {
        console.error("Failed to toggle visibility:", error);
      }
    },
    [updateLinkMutation, refetchLinks]
  );

  // Handle edit
  const handleEdit = useCallback(
    async (link: ProfileLink, title: string, url: string) => {
      try {
        await updateLinkMutation.mutateAsync({
          linkId: link.id,
          title,
          url,
        });
        setEditItem(null);
        await refetchLinks();
      } catch (error) {
        console.error("Failed to update link:", error);
      }
    },
    [updateLinkMutation, refetchLinks]
  );

  // Handle add link
  const handleAddLink = useCallback(async () => {
    if (!newLink.title.trim() || !newLink.url.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    // Format URL
    const formatUrl = (url: string): string => {
      const trimmed = url.trim();
      if (!trimmed) return trimmed;
      if (
        trimmed.toLowerCase().startsWith("http://") ||
        trimmed.toLowerCase().startsWith("https://")
      ) {
        return trimmed;
      }
      return `https://${trimmed}`;
    };

    try {
      await addLinksMutation.mutateAsync({
        title: newLink.title,
        url: formatUrl(newLink.url),
        platform: newLink.platform,
      });

      // If visibility is false, update it
      if (!newLink.isVisible) {
        // We need to get the newly created link ID
        // For now, refetch and then update the last link
        await refetchLinks();
        const updatedLinks = await refetchLinks();
        if (updatedLinks.data?.data && updatedLinks.data.data.length > 0) {
          const lastLink = updatedLinks.data.data[updatedLinks.data.data.length - 1];
          await updateLinkMutation.mutateAsync({
            linkId: lastLink.id,
            isVisible: false,
          });
        }
      } else {
        await refetchLinks();
      }

      // Reset form
      setNewLink({
        title: "",
        url: "",
        platform: "INSTAGRAM",
        isVisible: true,
      });
      setIsAddModalOpen(false);
    } catch (error) {
      console.error("Failed to add link:", error);
    }
  }, [newLink, addLinksMutation, updateLinkMutation, refetchLinks]);

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <div className="md:max-w-3xl mx-auto px-6 md:px-0 md:bg-white py-[2px] flex flex-col h-[calc(100vh-320px)] md:h-[calc(100vh-290px)]">
          {/* STACK LIST */}
          <div className="flex-1 overflow-y-auto">
            <SortableContext
              items={linksData.map((link: ProfileLink) => link.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="md:space-y-1 md:pr-2">
                {linksData.map((item: ProfileLink) => (
                  <SortableItem
                    key={item.id}
                    item={item}
                    onDelete={() => setDeleteId(item.id)}
                    onEdit={(item: ProfileLink) => setEditItem(item)}
                    onToggleVisibility={() => handleToggleVisibility(item)}
                  />
                ))}
              </div>
            </SortableContext>
          </div>

          {/* ADD BUTTON */}
          <div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsAddModalOpen(true);
              }}
              className="w-full py-3 mt-3 md:mt-6 shadow-md bg-[#331400] text-[#FED45C] font-semibold"
            >
              + Add
            </button>
          </div>
        </div>
      </DndContext>

      {/* DELETE MODAL */}
      <DeleteModal
        isOpen={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={() => {
          if (deleteId) {
            handleDelete(deleteId);
          }
        }}
      />

      {/* EDIT MODAL */}
      <EditModal
        isOpen={editItem !== null}
        onClose={() => setEditItem(null)}
        onSave={(platform: string, url: string) => {
          if (editItem) {
            handleEdit(editItem, platform, url);
          }
        }}
        initialPlatform={editItem?.platform || ""}
        initialUrl={editItem?.url || ""}
      />

      {/* ADD LINK MODAL - MOBILE */}
      {isAddModalOpen && (
        <>
          <div className="fixed inset-0 z-[999] bg-[#FFF7DE] md:hidden flex flex-col">
            <div className="sticky top-0 flex items-center justify-between px-4 py-8 border-b bg-[#FFF7DE]">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsAddModalOpen(false);
                }}
                className="flex items-center gap-2 font-semibold text-[#331400]"
              >
                ← Add Link
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#331400] mb-2">
                  Title
                </label>
                <Input
                  value={newLink.title}
                  onChange={(e) =>
                    setNewLink({ ...newLink, title: e.target.value })
                  }
                  placeholder="e.g., Instagram"
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#331400] mb-2">
                  URL
                </label>
                <Input
                  value={newLink.url}
                  onChange={(e) =>
                    setNewLink({ ...newLink, url: e.target.value })
                  }
                  placeholder="https://instagram.com/username"
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#331400] mb-2">
                  Platform
                </label>
                <select
                  value={newLink.platform}
                  onChange={(e) =>
                    setNewLink({ ...newLink, platform: e.target.value })
                  }
                  className="w-full border border-[#4B2E1E] bg-transparent text-[#4B2E1E] px-3 py-2 rounded"
                >
                  {PLATFORMS.map((platform) => (
                    <option key={platform} value={platform}>
                      {platform}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-[#331400]">
                  Visible
                </label>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setNewLink({ ...newLink, isVisible: !newLink.isVisible });
                  }}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    newLink.isVisible ? "bg-[#331400]" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                      newLink.isVisible ? "translate-x-6" : ""
                    }`}
                  />
                </button>
              </div>

              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddLink();
                }}
                disabled={addLinksMutation.isPending}
                className="w-full bg-[#FED45C] text-[#331400] font-semibold mt-4"
              >
                {addLinksMutation.isPending ? "Adding..." : "Add Link"}
              </Button>
            </div>
          </div>

          {/* ADD LINK MODAL - DESKTOP */}
          <div className="hidden md:flex fixed inset-0 bg-black/40 items-center justify-center z-50">
            <div className="bg-white w-full max-w-lg p-6 shadow-lg relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsAddModalOpen(false);
                }}
                className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>

              <h2 className="text-2xl font-bold mb-6 text-[#331400]">
                Add New Link
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#331400] mb-2">
                    Title
                  </label>
                  <Input
                    value={newLink.title}
                    onChange={(e) =>
                      setNewLink({ ...newLink, title: e.target.value })
                    }
                    placeholder="e.g., Instagram"
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#331400] mb-2">
                    URL
                  </label>
                  <Input
                    value={newLink.url}
                    onChange={(e) =>
                      setNewLink({ ...newLink, url: e.target.value })
                    }
                    placeholder="https://instagram.com/username"
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#331400] mb-2">
                    Platform
                  </label>
                  <select
                    value={newLink.platform}
                    onChange={(e) =>
                      setNewLink({ ...newLink, platform: e.target.value })
                    }
                    className="w-full border border-[#4B2E1E] bg-transparent text-[#4B2E1E] px-3 py-2 rounded"
                  >
                    {PLATFORMS.map((platform) => (
                      <option key={platform} value={platform}>
                        {platform}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-[#331400]">
                    Visible
                  </label>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setNewLink({ ...newLink, isVisible: !newLink.isVisible });
                    }}
                    className={`relative w-12 h-6 rounded-full transition-colors ${
                      newLink.isVisible ? "bg-[#331400]" : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                        newLink.isVisible ? "translate-x-6" : ""
                      }`}
                    />
                  </button>
                </div>

                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddLink();
                  }}
                  disabled={addLinksMutation.isPending}
                  className="w-full bg-[#FED45C] text-[#331400] font-semibold mt-4"
                >
                  {addLinksMutation.isPending ? "Adding..." : "Add Link"}
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

function SortableItem({
  item,
  onDelete,
  onEdit,
  onToggleVisibility,
}: {
  item: ProfileLink;
  onDelete: () => void;
  onEdit: (item: ProfileLink) => void;
  onToggleVisibility: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <LinkCard
        item={{
          id: item.id,
          platform: item.platform,
          url: item.url,
          clicks: item.clickCount || 0,
          customIcon: item.icon_link,
        }}
        onDelete={(id) => {
          onDelete();
        }}
        onEdit={(e, linkItem) => {
          if (linkItem) {
            onEdit(item);
          }
        }}
        onToggleVisibility={(e) => {
          if (e) {
            e.preventDefault();
            e.stopPropagation();
          }
          onToggleVisibility();
        }}
        isVisible={item.isVisible}
        onIconChange={() => {}}
        dragHandleProps={listeners}
        dragHandleId={`drag-handle-${item.id}`}
      />
    </div>
  );
}
