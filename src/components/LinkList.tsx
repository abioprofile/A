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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
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
// Import Framer Motion
import { motion, AnimatePresence } from "framer-motion";

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

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 20,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
    exit: {
      opacity: 0,
      x: -50,
      scale: 0.9,
      transition: {
        duration: 0.2,
        ease: "easeIn",
      },
    },
    drag: {
      scale: 1.05,
      boxShadow: "0 10px 30px rgba(0, 0, 0, 0.15)",
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 20,
      },
    },
  };

  const modalOverlayVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.2,
        ease: "easeOut",
      },
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.15,
        ease: "easeIn",
      },
    },
  };

  const modalContentVariants = {
    hidden: {
      scale: 0.9,
      opacity: 0,
      y: 20,
    },
    visible: {
      scale: 1,
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 25,
        delay: 0.1,
      },
    },
    exit: {
      scale: 0.9,
      opacity: 0,
      y: 20,
      transition: {
        duration: 0.15,
        ease: "easeIn",
      },
    },
  };

  const slideInVariants = {
    hidden: { x: "100%" },
    visible: {
      x: 0,
      transition: {
        type: "spring",
        stiffness: 80,
        damping: 20,
        mass: 0.8,
      },
    },
    exit: {
      x: "100%",
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20,
        mass: 0.8,
      },
    },
  };

  // Update linksData when prop changes
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
    platform: "",
    isVisible: false,
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
          (i: ProfileLink) => i.id === active.id,
        );
        const newIndex = linksData.findIndex(
          (i: ProfileLink) => i.id === over?.id,
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
    [linksData, reorderLinksMutation],
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
    [deleteLinkMutation, refetchLinks],
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
            l.id === link.id ? { ...l, isVisible: !l.isVisible } : l,
          ),
        );
        await refetchLinks();
      } catch (error) {
        console.error("Failed to toggle visibility:", error);
      }
    },
    [updateLinkMutation, refetchLinks],
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
    [updateLinkMutation, refetchLinks],
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
        await refetchLinks();
        const updatedLinks = await refetchLinks();
        if (updatedLinks.data?.data && updatedLinks.data.data.length > 0) {
          const lastLink =
            updatedLinks.data.data[updatedLinks.data.data.length - 1];
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
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="md:max-w-3xl mx-auto px-6 md:px-0 md:bg-white py-[2px] flex flex-col h-[calc(100vh-350px)] md:h-[calc(100vh-290px)]"
        >
          {/* STACK LIST */}
          <div className="flex-1 overflow-y-auto">
            <SortableContext
              items={linksData.map((link: ProfileLink) => link.id)}
              strategy={verticalListSortingStrategy}
            >
              <AnimatePresence mode="popLayout">
                <div className="md:space-y-1 md:pr-2">
                  {linksData.map((item: ProfileLink, index) => (
                    <motion.div
                      key={item.id}
                      variants={itemVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      whileHover={{
                        y: -2,
                        transition: { duration: 0.2 },
                      }}
                      layout
                      layoutId={item.id}
                    >
                      <SortableItem
                        item={item}
                        onDelete={() => setDeleteId(item.id)}
                        onEdit={(item: ProfileLink) => setEditItem(item)}
                        onToggleVisibility={() => handleToggleVisibility(item)}
                      />
                    </motion.div>
                  ))}
                </div>
              </AnimatePresence>
            </SortableContext>
          </div>

          {/* ADD BUTTON */}
          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsAddModalOpen(true);
              }}
              className="w-full py-3 mt-3 md:mt-6 shadow-md bg-[#331400] text-[#FED45C] font-semibold"
            >
              + Add
            </button>
          </motion.div>
        </motion.div>
      </DndContext>

      {/* DELETE MODAL */}
      <AnimatePresence>
        {deleteId !== null && (
          <motion.div
            variants={modalOverlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center"
          >
            <DeleteModal
              isOpen={true}
              onClose={() => setDeleteId(null)}
              onConfirm={() => {
                if (deleteId) {
                  handleDelete(deleteId);
                }
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* EDIT MODAL */}
      <AnimatePresence>
        {editItem !== null && (
          <motion.div
            variants={modalOverlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center"
          >
            <motion.div
              variants={modalContentVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <EditModal
                isOpen={true}
                onClose={() => setEditItem(null)}
                onSave={(platform: string, url: string) => {
                  if (editItem) {
                    handleEdit(editItem, platform, url);
                  }
                }}
                initialPlatform={editItem?.platform || ""}
                initialUrl={editItem?.url || ""}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

     {/* ADD LINK SHEET - MOBILE */}
<Sheet open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
  <SheetContent
    side="bottom"
    className="bg-[#FFF7DE] border-none md:hidden flex flex-col p-0 h-auto max-h-[90vh] overflow-y-auto"
  >
    <SheetHeader className="sr-only">
      <SheetTitle>Add Link</SheetTitle>
    </SheetHeader>
    
    {/* Remove the custom sticky header and use Sheet's built-in */}
    <div className="sticky top-0 bg-[#FFF7DE] px-4 pt-6 pb-4 border-b border-[#E6D9B9]">
      <div className="flex items-center gap-2">
        <SheetClose className="flex items-center gap-2 font-bold text-[#331400] text-lg">
          ← Add Link
        </SheetClose>
      </div>
    </div>

    <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
      <div>
        <label className="block text-[14px] font-bold text-[#331400] mb-2">
          Title
        </label>
        <Input
          value={newLink.title}
          onChange={(e) =>
            setNewLink({ ...newLink, title: e.target.value })
          }
          placeholder="e.g., Instagram"
          className="w-full bg-white border-[#4B2E1E]"
        />
      </div>

      <div>
        <label className="block text-[14px] font-bold text-[#331400] mb-2">
          URL
        </label>
        <Input
          value={newLink.url}
          onChange={(e) =>
            setNewLink({ ...newLink, url: e.target.value })
          }
          placeholder="https://instagram.com/username"
          className="w-full bg-white border-[#4B2E1E]"
        />
      </div>

      <div>
        <label className="block text-[14px] font-bold text-[#331400] mb-2">
          Platform
        </label>
        <select
          value={newLink.platform}
          onChange={(e) =>
            setNewLink({ ...newLink, platform: e.target.value })
          }
          className="w-full border border-[#4B2E1E] bg-white text-[12px] text-[#4B2E1E] px-3 py-2 rounded"
        >
          {PLATFORMS.map((platform) => (
            <option key={platform} className="text-[12px]" value={platform}>
              {platform}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center justify-between pt-2">
        <label className="text-[14px] font-bold text-[#331400]">
          Visible
        </label>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setNewLink({ ...newLink, isVisible: !newLink.isVisible });
          }}
          className={`relative w-12 h-6 rounded-full transition-all duration-300 ${
            newLink.isVisible ? "bg-[#331400]" : "bg-gray-300"
          }`}
        >
          <span
            className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-300 ${
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
        className="w-full bg-[#FED45C] text-[#331400] font-semibold mt-4 hover:bg-[#e6c04a]"
      >
        {addLinksMutation.isPending ? (
          <span className="flex items-center gap-2">
            <motion.span
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full"
            />
            Adding...
          </span>
        ) : (
          "Add Link"
        )}
      </Button>
      
      <SheetClose asChild>
        <Button
          variant="outline"
          className="w-full border-[#4B2E1E] text-[#331400] mt-2 hover:bg-[#F5F0E1]"
        >
          Cancel
        </Button>
      </SheetClose>
    </div>
  </SheetContent>
</Sheet>

      {/* ADD LINK MODAL - DESKTOP */}
      <AnimatePresence>
        {isAddModalOpen && (
          <motion.div
            key="desktop-add-modal"
            variants={modalOverlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="hidden md:flex fixed inset-0 bg-black/40 items-center justify-center z-50"
          >
            <motion.div
              variants={modalContentVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-white w-full max-w-lg p-6 shadow-lg relative"
            >
              <motion.button
                whileHover={{ rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsAddModalOpen(false);
                }}
                className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </motion.button>

              <motion.h2
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-2xl font-bold mb-6 text-[#331400]"
              >
                Add New Link
              </motion.h2>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="space-y-4"
              >
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

                <motion.div
                  whileHover={{ x: 5 }}
                  className="flex items-center justify-between"
                >
                  <label className="text-sm font-medium text-[#331400]">
                    Visible
                  </label>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setNewLink({ ...newLink, isVisible: !newLink.isVisible });
                    }}
                    className={`relative w-12 h-6 rounded-full transition-all duration-300 ${
                      newLink.isVisible ? "bg-[#331400]" : "bg-gray-300"
                    }`}
                  >
                    <motion.span
                      animate={{ x: newLink.isVisible ? 24 : 0 }}
                      className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md"
                    />
                  </button>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddLink();
                    }}
                    disabled={addLinksMutation.isPending}
                    className="w-full bg-[#FED45C] text-[#331400] font-semibold mt-4"
                  >
                    {addLinksMutation.isPending ? (
                      <span className="flex items-center gap-2">
                        <motion.span
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                          className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full"
                        />
                        Adding...
                      </span>
                    ) : (
                      "Add Link"
                    )}
                  </Button>
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
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
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      {...attributes}
      animate={isDragging ? "drag" : "visible"}
      variants={{
        drag: {
          scale: 1.05,
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.15)",
          zIndex: 999,
        },
        visible: {
          scale: 1,
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
          zIndex: 1,
        },
      }}
      transition={{
        type: "spring",
        stiffness: 200,
        damping: 20,
      }}
    >
      <LinkCard
        item={{
          id: item.id,
          title: item.title,
          platform: item.platform,
          url: item.url,
          clickCount: item.clickCount || 0,
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
    </motion.div>
  );
}
