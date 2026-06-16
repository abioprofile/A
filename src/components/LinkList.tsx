"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  DndContext,
  closestCenter,
  MouseSensor,
  TouchSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
  DragOverlay,
  defaultDropAnimationSideEffects,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { useQueryClient } from "@tanstack/react-query";
import LinkCard from "./LinkCard";
import DeleteModal from "./DeleteModal";
import { X, ChevronDown, Check, GripVertical } from "lucide-react";
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
import { motion, AnimatePresence, Reorder } from "framer-motion";
import {
  containerVariants,
  itemVariants,
  modalOverlayVariants,
  modalContentVariants,
  slideInVariants,
  sortableItemVariants,
} from "@/lib/animations";
import { useLinkBroadcastPublisher } from "@/hooks/useLinkBroadcast";

const SOCIAL_PLATFORMS = [
  "INSTAGRAM",
  "TIKTOK",
  "PINTEREST",
  "TWITTER",
  "FACEBOOK",
  "SNAPCHAT",
  "YOUTUBE",
  "LINKEDIN",
  "GITHUB",
  "WHATSAPP",
  "CUSTOM",
] as const;

const STREAMING_PLATFORMS = [
  "SPOTIFY",
  "APPLE-MUSIC",
  "SOUNDCLOUD",
  "TIDAL",
  "AMAZON-MUSIC",
] as const;

// Helper function to get platform-specific URL placeholder
const getUrlPlaceholder = (platform: string): string => {
  const platformLower = platform.toLowerCase();
  
  const placeholders: Record<string, string> = {
    instagram: "https://instagram.com/username",
    tiktok: "https://tiktok.com/@username",
    pinterest: "https://pinterest.com/username",
    twitter: "https://twitter.com/username",
    facebook: "https://facebook.com/username",
    snapchat: "https://snapchat.com/add/username",
    youtube: "https://youtube.com/@channelname",
    linkedin: "https://linkedin.com/in/username",
    github: "https://github.com/username",
    whatsapp: "https://wa.me/1234567890",
    spotify: "https://open.spotify.com/user/username",
    "apple-music": "https://music.apple.com/profile/username",
    soundcloud: "https://soundcloud.com/username",
    tidal: "https://tidal.com/browse/playlist/ID",
    "amazon-music": "https://music.amazon.com/artist/ID",
    custom: "https://yourwebsite.com"
  };
  
  return placeholders[platformLower] || placeholders.custom;
};

// Helper function to validate URL based on platform
const getUrlValidationHint = (platform: string, url: string): string | null => {
  if (!url) return null;
  
  const platformLower = platform.toLowerCase();
  const validations: Record<string, RegExp> = {
    instagram: /instagram\.com\//i,
    tiktok: /tiktok\.com\/@/i,
    twitter: /twitter\.com\//i,
    youtube: /youtube\.com\/@|youtube\.com\/channel\//i,
    whatsapp: /wa\.me\/|whatsapp\.com\//i,
    snapchat: /snapchat\.com\/add\//i,
    facebook: /facebook\.com\//i,
    linkedin: /linkedin\.com\/in\//i,
    github: /github\.com\//i,
  };
  
  const pattern = validations[platformLower];
  if (pattern && !pattern.test(url)) {
    return `⚠️ URL doesn't look like a valid ${platform} link`;
  }
  
  return null;
};

// Custom Select Component
function CustomSelect({
  value,
  onChange,
  options,
  placeholder = "Select a platform",
}: {
  value: string;
  onChange: (value: string) => void;
  options: { label: string; options: readonly string[] }[];
  placeholder?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedLabel = value || placeholder;

  return (
    <div ref={selectRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-[#331400] text-white px-3 py-2 flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-[#FED45C]"
      >
        <span className={!value ? "text-white/70" : "text-white"}>
          {selectedLabel}
        </span>
        <ChevronDown
          className={`w-4 h-4 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 w-full mt-1 bg-white border border-gray-200 shadow-lg max-h-60 overflow-y-auto"
          >
            {options.map((group, groupIdx) => (
              <div key={groupIdx}>
                <div className="px-3 py-2 text-xs font-semibold text-gray-500 bg-gray-50">
                  {group.label}
                </div>
                {group.options.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => {
                      onChange(option);
                      setIsOpen(false);
                    }}
                    className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-[#FED45C] hover:text-[#331400] transition-colors flex items-center justify-between group"
                  >
                    <span>{option}</span>
                    {value === option && (
                      <Check className="w-4 h-4 text-[#331400]" />
                    )}
                  </button>
                ))}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function LinkList({
  linksDataData,
}: {
  linksDataData: ProfileLink[];
}) {
  const [linksData, setLinksData] = useState<ProfileLink[]>(linksDataData);
  const [activeId, setActiveId] = useState<string | null>(null);
  const { refetch: refetchLinks } = useGetAllLinks();
  const queryClient = useQueryClient();
  
  // Track which link is being edited inline
  const [editingLinkId, setEditingLinkId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [editingUrl, setEditingUrl] = useState("");
  const editInputRef = useRef<HTMLInputElement>(null);

  // Update linksData when prop changes
  useEffect(() => {
    if (linksDataData && linksDataData.length > 0) {
      setLinksData(linksDataData);
    } else if (linksDataData && linksDataData.length === 0) {
      setLinksData([]);
    }
  }, [linksDataData]);

  // Focus input when editing starts
  useEffect(() => {
    if (editingLinkId && editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [editingLinkId]);

  const { broadcast } = useLinkBroadcastPublisher();

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  // Add link form state
  const [newLink, setNewLink] = useState({
    title: "",
    url: "",
    platform: "",
    isVisible: true,
  });

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 150,
        tolerance: 3,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  
  // Hooks
  const addLinksMutation = useAddLinks();
  const updateLinkMutation = useUpdateLink();
  const deleteLinkMutation = useDeleteLink();
  const reorderLinksMutation = useReorderLinks();

  // Handle drag start
  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  }, []);

  // Handle drag end - reorder links
  const handleDragEnd = useCallback(
    async (event: DragEndEvent) => {
      setActiveId(null);
      const { active, over } = event;

      if (active.id !== over?.id) {
        const oldIndex = linksData.findIndex(
          (i: ProfileLink) => i.id === active.id
        );
        const newIndex = linksData.findIndex(
          (i: ProfileLink) => i.id === over?.id
        );

        if (oldIndex === -1 || newIndex === -1) return;

        const previousOrder = linksData;
        const newOrder = arrayMove(linksData, oldIndex, newIndex);

        // Optimistic UI: update local state immediately
        setLinksData(newOrder);

        // Optimistic cache update so PhoneDisplay reflects new order instantly
        queryClient.setQueryData(["links"], (old: any) => {
          if (!old) return old;
          return { ...old, data: newOrder };
        });

        // Call API to persist reorder
        try {
          await reorderLinksMutation.mutateAsync({
            links: newOrder.map((link, index) => ({
              id: link.id,
              displayOrder: index + 1,
            })),
          });
          // Notify other tabs (public profile page) that links changed
          broadcast();
        } catch (error) {
          // Revert both local state and cache on error
          setLinksData(previousOrder);
          queryClient.setQueryData(["links"], (old: any) => {
            if (!old) return old;
            return { ...old, data: previousOrder };
          });
          toast.error("Failed to save order — reverted");
          console.error("Failed to reorder links:", error);
        }
      }
    },
    [linksData, reorderLinksMutation, queryClient, broadcast]
  );

  // Handle drag cancel
  const handleDragCancel = useCallback(() => {
    setActiveId(null);
  }, []);

  // Handle delete
  const handleDelete = useCallback(
  async (linkId: string) => {
    try {
      await deleteLinkMutation.mutateAsync({ linkId });
      setDeleteId(null);
      await refetchLinks();
      queryClient.invalidateQueries({ queryKey: ["user-profile"] });
      broadcast();
    } catch (error) {
      toast.error("Failed to delete link");
      console.error("Failed to delete link:", error);
    }
  },
  [deleteLinkMutation, refetchLinks, queryClient, broadcast]
);

  // Handle toggle visibility
   const handleToggleVisibility = useCallback(
  async (link: ProfileLink) => {
    const newVisibility = !link.isVisible;
    // Optimistic update
    setLinksData((prev) =>
      prev.map((l) => (l.id === link.id ? { ...l, isVisible: newVisibility } : l))
    );
    try {
      await updateLinkMutation.mutateAsync({
        linkId: link.id,
        isVisible: newVisibility,
        platform: link.platform,
      });
      await refetchLinks();
      queryClient.invalidateQueries({ queryKey: ["user-profile"] });
      broadcast();
    } catch (error) {
      // Revert on error
      setLinksData((prev) =>
        prev.map((l) => (l.id === link.id ? { ...l, isVisible: !newVisibility } : l))
      );
      toast.error("Failed to update visibility — reverted");
      console.error("Failed to toggle visibility:", error);
    }
  },
  [updateLinkMutation, refetchLinks, queryClient, broadcast]
);
  
  // Handle inline edit - start editing
  const handleStartEdit = useCallback((link: ProfileLink) => {
    setEditingLinkId(link.id);
    setEditingTitle(link.title);
    setEditingUrl(link.url);
  }, []);

  // Handle inline edit - save on Enter
  const handleSaveEdit = useCallback(async (linkId: string) => {
    const link = linksData.find(l => l.id === linkId);
    if (!link) return;
    
    if (!editingTitle.trim() || !editingUrl.trim()) {
      toast.error("Title and URL cannot be empty");
      return;
    }
    
    try {
      await updateLinkMutation.mutateAsync({
        linkId: link.id,
        title: editingTitle,
        url: editingUrl,
        platform: link.platform,
      });
      
      // Update local state
      setLinksData(prev => prev.map(l => 
        l.id === linkId 
          ? { ...l, title: editingTitle, url: editingUrl }
          : l
      ));
      
      setEditingLinkId(null);
      await refetchLinks();
      queryClient.invalidateQueries({ queryKey: ["user-profile"] });
      broadcast();
    } catch (error) {
      console.error("Failed to update link:", error);
      toast.error("Failed to save changes");
    }
  }, [editingTitle, editingUrl, updateLinkMutation, refetchLinks, queryClient, linksData, broadcast]);

  // Handle cancel edit (Escape key)
  const handleCancelEdit = useCallback(() => {
    setEditingLinkId(null);
  }, []);

  const handleAddLink = useCallback(async () => {
    if (!newLink.title.trim() || !newLink.url.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    if (!newLink.platform) {
      toast.error("Please select a platform");
      return;
    }

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

      await refetchLinks();
      queryClient.invalidateQueries({ queryKey: ["user-profile"] });

      if (!newLink.isVisible) {
        const updatedLinks = await refetchLinks();
        if (updatedLinks.data?.data && updatedLinks.data.data.length > 0) {
          const lastLink = updatedLinks.data.data[updatedLinks.data.data.length - 1];
          await updateLinkMutation.mutateAsync({
            linkId: lastLink.id,
            isVisible: false,
          });
          queryClient.invalidateQueries({ queryKey: ["user-profile"] });
        }
      }

      setNewLink({ title: "", url: "", platform: "", isVisible: true });
      setIsAddModalOpen(false);
      broadcast();
    } catch (error) {
      console.error("Failed to add link:", error);
    }
  }, [newLink, addLinksMutation, updateLinkMutation, refetchLinks, queryClient, broadcast]);   

  const selectOptions = [
    { label: "Social", options: SOCIAL_PLATFORMS },
    { label: "🎵 Streaming", options: STREAMING_PLATFORMS },
  ];

  // Find active link for drag overlay
  const activeLink = activeId ? linksData.find(link => link.id === activeId) : null;

  const dropAnimation = {
    duration: 300,
    easing: "cubic-bezier(0.2, 0.9, 0.4, 1.1)",
    sideEffects: defaultDropAnimationSideEffects({
      styles: {
        active: {
          opacity: '0.5',
        },
      },
    }),
  };

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="md:max-w-3xl mx-auto px-6 md:px-0 md:bg-white py-[2px] flex flex-col h-[calc(100vh-350px)] md:h-[calc(100vh-290px)]"
        >
          {/* STACK LIST */}
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            <SortableContext
              items={linksData.map((link: ProfileLink) => link.id)}
              strategy={verticalListSortingStrategy}
            >
              <AnimatePresence>
                <div className="md:space-y-2 md:pr-2">
                  {linksData.map((item: ProfileLink) => (
                    <SortableItem
                      key={item.id}
                      item={item}
                      onDelete={() => setDeleteId(item.id)}
                      onEdit={() => handleStartEdit(item)}
                      onToggleVisibility={() => handleToggleVisibility(item)}
                      isDragging={activeId === item.id}
                      isEditing={editingLinkId === item.id}
                      editingTitle={editingTitle}
                      editingUrl={editingUrl}
                      onEditingTitleChange={setEditingTitle}
                      onEditingUrlChange={setEditingUrl}
                      onSaveEdit={() => handleSaveEdit(item.id)}
                      onCancelEdit={handleCancelEdit}
                      editInputRef={editInputRef}
                    />
                  ))}
                </div>
              </AnimatePresence>
            </SortableContext>
          </div>

          {/* ADD BUTTON */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="mt-3 md:mt-6"
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsAddModalOpen(true);
              }}
              className="w-full py-3 cursor-pointer shadow-md bg-[#331400] text-[#FED45C] text-sm md:text-base font-semibold tracking-wide transition-all hover:shadow-lg hover:bg-[#442000] active:scale-98"
            >
              + Add new link
            </button>
          </motion.div>
        </motion.div>

        {/* DRAG OVERLAY - Like Notion/Trello floating card */}
        <DragOverlay dropAnimation={dropAnimation}>
          {activeLink ? (
            <motion.div
              initial={{ scale: 1, opacity: 0.9, rotate: 0 }}
              animate={{ 
                scale: 1.05, 
                opacity: 0.95,
                rotate: 1,
                transition: { type: "spring", stiffness: 300, damping: 20 }
              }}
              exit={{ scale: 1, opacity: 0, rotate: 0 }}
              className="cursor-grabbing shadow-2xl"
              style={{
                filter: "drop-shadow(0 20px 13px rgb(0 0 0 / 0.03)) drop-shadow(0 8px 5px rgb(0 0 0 / 0.08))",
              }}
            >
              <LinkCard
                item={{
                  id: activeLink.id,
                  title: activeLink.title,
                  platform: activeLink.platform,
                  url: activeLink.url,
                  clickCount: activeLink.clickCount || 0,
                  customIcon: activeLink.icon_link,
                }}
                onDelete={() => {}}
                onEdit={() => {}}
                onToggleVisibility={() => {}}
                isVisible={activeLink.isVisible}
                onIconChange={() => {}}
                dragHandleProps={{}}
                dragHandleId=""
                isDraggingOverlay={true}
              />
            </motion.div>
          ) : null}
        </DragOverlay>
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

      {/* ADD LINK MODAL - MOBILE */}
      <AnimatePresence>
        {isAddModalOpen && (
          <>
            <div
              className="fixed inset-0 z-[999] bg-[#FFF7DE] md:hidden flex flex-col"
            >
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="sticky top-0 flex items-center justify-between px-4 mb-8 py-8 border-b bg-[#FFF7DE]"
              >
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsAddModalOpen(false);
                  }}
                  className="flex items-center gap-2 font-bold text-[#331400]"
                >
                  ← Add Link
                </motion.button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex-1 overflow-y-auto px-4 py-6 space-y-4"
              >
                <div>
                  <label className="block text-sm font-bold text-[#331400] mb-2">
                    Title
                  </label>
                  <Input
                    value={newLink.title}
                    onChange={(e) =>
                      setNewLink({ ...newLink, title: e.target.value })
                    }
                    placeholder="e.g., Instagram"
                    className="w-full text-[16px] placeholder:text-[16px]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-[#331400] mb-2">
                    URL
                  </label>
                  <Input
                    value={newLink.url}
                    onChange={(e) =>
                      setNewLink({ ...newLink, url: e.target.value })
                    }
                    placeholder={getUrlPlaceholder(newLink.platform)}
                    className="w-full text-[16px] placeholder:text-[16px] placeholder:text-gray-400"
                  />
                  {newLink.platform && newLink.url && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`text-xs mt-1 ${
                        getUrlValidationHint(newLink.platform, newLink.url) 
                          ? 'text-red-500' 
                          : 'text-green-500'
                      }`}
                    >
                      {getUrlValidationHint(newLink.platform, newLink.url) || '✓ Valid URL format'}
                    </motion.p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-bold text-[#331400] mb-2">
                    Platform
                  </label>
                  <CustomSelect
                    value={newLink.platform}
                    onChange={(value) => setNewLink({ ...newLink, platform: value })}
                    options={selectOptions}
                    placeholder="Select a platform"
                  />
                </div>

                <motion.div
                  whileHover={{ x: 5 }}
                  className="flex items-center justify-between"
                >
                  <label className="text-sm font-bold text-[#331400]">
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
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
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
            </div>

            {/* ADD LINK MODAL - DESKTOP */}
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
                  className="text-xl md:text-2xl font-bold mb-5 md:mb-6 text-[#331400]"
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
                      placeholder={getUrlPlaceholder(newLink.platform)}
                      className="w-full"
                    />
                    {newLink.platform && newLink.url && (
                      <motion.p
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`text-xs mt-1 ${
                          getUrlValidationHint(newLink.platform, newLink.url) 
                            ? 'text-red-500' 
                            : 'text-green-500'
                        }`}
                      >
                        {getUrlValidationHint(newLink.platform, newLink.url) || '✓ Valid URL format'}
                      </motion.p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#331400] mb-2">
                      Platform
                    </label>
                    <CustomSelect
                      value={newLink.platform}
                      onChange={(value) => setNewLink({ ...newLink, platform: value })}
                      options={selectOptions}
                      placeholder="Select a platform"
                    />
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
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
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
          </>
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
  isDragging,
  isEditing,
  editingTitle,
  editingUrl,
  onEditingTitleChange,
  onEditingUrlChange,
  onSaveEdit,
  onCancelEdit,
  editInputRef,
}: {
  item: ProfileLink;
  onDelete: () => void;
  onEdit: () => void;
  onToggleVisibility: () => void;
  isDragging: boolean;
  isEditing: boolean;
  editingTitle: string;
  editingUrl: string;
  onEditingTitleChange: (value: string) => void;
  onEditingUrlChange: (value: string) => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  editInputRef: React.RefObject<HTMLInputElement | null>;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging
  } = useSortable({
    id: item.id,
  });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isSortableDragging ? 999 : undefined,
    willChange: isSortableDragging ? "transform" : undefined,
  };

  // Handle Enter key
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onSaveEdit();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onCancelEdit();
    }
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      layout
      layoutId={item.id}
      {...attributes}
      animate={{
        scale: isSortableDragging ? 1.02 : 1,
        opacity: isDragging ? 0.35 : 1,
        boxShadow: isSortableDragging
          ? "0 20px 40px rgba(0,0,0,0.15)"
          : "0 1px 3px rgba(0,0,0,0.06)",
      }}
      transition={{
        layout: { type: "spring", stiffness: 500, damping: 35, mass: 0.6 },
        scale: { type: "spring", stiffness: 500, damping: 30 },
        opacity: { duration: 0.15 },
        boxShadow: { duration: 0.2 },
      }}
      whileHover={!isSortableDragging ? { scale: 1.01 } : undefined}
      className="relative group"
    >
      {/* Drag handle — visible on hover, positioned outside card like Notion */}
      <div
        {...listeners}
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-7 opacity-0 group-hover:opacity-100 transition-opacity duration-150 cursor-grab active:cursor-grabbing p-1.5 hover:bg-gray-100 rounded"
        style={{ touchAction: "none" }}
        aria-label="Drag to reorder"
      >
        <GripVertical className="w-4 h-4 text-gray-400" />
      </div>

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
            onEdit();
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
        isEditing={isEditing}
        editingTitle={editingTitle}
        editingUrl={editingUrl}
        onEditingTitleChange={onEditingTitleChange}
        onEditingUrlChange={onEditingUrlChange}
        onSaveEdit={onSaveEdit}
        onCancelEdit={onCancelEdit}
        onKeyDown={handleKeyDown}
        editInputRef={editInputRef}
      />
    </motion.div>
  );
}