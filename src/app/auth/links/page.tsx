"use client";

import { useRef, useState, useEffect, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LinkIcon, Phone, Mail, ChevronDown } from "lucide-react";
import { useUserStore } from "@/stores/user.store";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useAddLinks, useCurrentUser } from "@/hooks/api/useAuth";
import { AddLinksRequest } from "@/types/auth.types";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { OnboardingProgressWithSteps } from "@/components/ProgressBar";
import { PLATFORMS } from "@/data";
import { IconType } from "react-icons";

// ============================================================================
// Constants & Configuration
// ============================================================================

const PLATFORM_BASE_URLS: Record<string, string> = {
  instagram: "instagram.com/",
  behance: "behance.net/",
  x: "x.com/",
  snapchat: "snapchat.com/add/",
  tiktok: "tiktok.com/@",
  youtube: "youtube.com/@",
  linkedin: "linkedin.com/in/",
  github: "github.com/",
  pinterest: "pinterest.com/",
  twitter: "x.com/",
  whatsapp: "wa.me/",
  gmail: "mailto:",
};

const AT_PLATFORMS = new Set(["x", "twitter", "snapchat", "tiktok", "instagram"]);

// ============================================================================
// Utility Functions
// ============================================================================

const buildUrl = (platformId: string, value: string): string => {
  const trimmed = value.trim();
  if (!trimmed) return "";
  
  if (platformId === "gmail") {
    return trimmed.includes("@") ? `mailto:${trimmed}` : `mailto:${trimmed}@gmail.com`;
  }
  
  if (platformId === "phone") {
    return `tel:${trimmed.replace(/\s/g, "")}`;
  }
  
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  
  const base = PLATFORM_BASE_URLS[platformId];
  return base ? `https://${base}${trimmed}` : `https://${trimmed}`;
};

const getPlaceholder = (platformId: string, platformName: string): string => {
  if (platformId === "whatsapp") return "WhatsApp phone number";
  if (platformId === "gmail") return "Email address or username";
  if (platformId === "phone") return "Phone number";
  
  const base = PLATFORM_BASE_URLS[platformId];
  if (!base) return `Input your ${platformName} link`;
  if (AT_PLATFORMS.has(platformId)) return "@username";
  
  return `${base}username`;
};

// ============================================================================
// Components
// ============================================================================

const PlatformIcon: React.FC<{ platformId: string; platformName: string; size?: number }> = ({ 
  platformId, 
  platformName, 
  size = 20 
}) => {
  const platformData = PLATFORMS.find((p) => p.id === platformId);
  const iconColor = useMemo(() => {
    if (platformId === "gmail") return "#EA4335";
    if (platformId === "phone") return "#34A853";
    return "#331400";
  }, [platformId]);

  if (platformData?.isReactIcon && platformData.icon) {
    const IconComponent = platformData.icon as IconType;
    return <IconComponent size={size} color={iconColor} />;
  }

  if (platformData?.icon && typeof platformData.icon === "string") {
    return <Image src={platformData.icon} alt={platformName} width={size} height={size} />;
  }

  if (platformId === "phone" || platformName.toLowerCase().includes("phone")) {
    return <Phone size={size} color="#34A853" />;
  }
  
  if (platformId === "gmail" || platformName.toLowerCase().includes("gmail")) {
    return <Mail size={size} color="#EA4335" />;
  }

  return <LinkIcon size={size} color="#331400" />;
};

// Simple Numbers-Only Input (replaces PhoneInput)
const NumbersOnlyInput: React.FC<{
  value: string;
  onChange: (val: string) => void;
  onFocus: () => void;
  onBlur: () => void;
  focused: boolean;
  placeholder?: string;
}> = ({ value, onChange, onFocus, onBlur, focused, placeholder = "Enter numbers only" }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const numbersOnly = e.target.value.replace(/\D/g, "").slice(0, 15);
      onChange(numbersOnly);
    },
    [onChange]
  );

  return (
    <div
      className={`
        relative flex items-center w-full bg-transparent
        ring-1 transition-all duration-200
        ${
          focused
            ? "ring-[#331400] shadow-[0_0_0_3px_rgba(51,20,0,0.06)]"
            : "ring-[#331400]/20 hover:ring-[#331400]/40"
        }
      `}
      style={{ height: "48px" }}
    >
      <input
        ref={inputRef}
        type="tel"
        inputMode="numeric"
        value={value}
        onChange={handleInput}
        onFocus={onFocus}
        onBlur={onBlur}
        placeholder={placeholder}
        className="
          flex-1 h-full px-4 bg-transparent outline-none
          text-[16px] font-medium text-[#331400]
          placeholder:text-[#331400]/25 placeholder:font-normal
        "
      />
    </div>
  );
};

// Standard Link Input for social platforms
const StandardLinkInput: React.FC<{
  platformId: string;
  platformName: string;
  value: string;
  onChange: (val: string) => void;
  focused: boolean;
  onFocus: () => void;
  onBlur: () => void;
}> = ({ platformId, platformName, value, onChange, focused, onFocus, onBlur }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const base = PLATFORM_BASE_URLS[platformId];
  const isFullUrl = /^https?:\/\//i.test(value);
  const showPrefix = !!base && !isFullUrl && focused && platformId !== "gmail";
  const hasValue = value.length > 0;
  const showFloatingLabel = focused || hasValue;

  const floatingLabel = (() => {
    if (platformId === "whatsapp") return "Phone number";
    if (platformId === "gmail") return "Email";
    if (base) return "Username";
    return `${platformName} link`;
  })();

  return (
    <div
      onClick={() => inputRef.current?.focus()}
      className={`
        relative flex items-center w-full ring-1 ring-[#331400]/20 bg-transparent cursor-text
        transition-all duration-200 overflow-hidden
        ${focused ? "ring-1 ring-[#331400]" : "border-input hover:border-[#331400]/50"}
      `}
      style={{ minHeight: "40px" }}
    >
      <AnimatePresence>
        {showFloatingLabel && (
          <motion.span
            key="label"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.15 }}
            className="absolute left-3 top-2 text-[12px] font-semibold text-[#331400]/70 select-none pointer-events-none leading-none"
          >
            {floatingLabel}
          </motion.span>
        )}
      </AnimatePresence>

      <div className={`flex items-center w-full px-3 ${showFloatingLabel ? "pt-5 pb-2" : "py-3"}`}>
        <AnimatePresence>
          {showPrefix && (
            <motion.span
              key="prefix"
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.2 }}
              className="whitespace-nowrap select-none overflow-hidden text-[14px] text-[#331400]/60"
            >
              {base}
            </motion.span>
          )}
        </AnimatePresence>

        <input
          ref={inputRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={onFocus}
          onBlur={onBlur}
          placeholder={!focused ? getPlaceholder(platformId, platformName) : ""}
          className="flex-1 bg-transparent outline-none placeholder:text-[#331400]/40 placeholder:text-sm min-w-0 text-[16px]"
        />
      </div>
    </div>
  );
};

// Smart Link Input - Routes to appropriate input type
const SmartLinkInput: React.FC<{
  platformId: string;
  platformName: string;
  value: string;
  onChange: (val: string) => void;
}> = ({ platformId, platformName, value, onChange }) => {
  const [focused, setFocused] = useState(false);

  if (platformId === "phone") {
    return (
      <NumbersOnlyInput
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        focused={focused}
        placeholder="Enter phone number (numbers only)"
      />
    );
  }

  return (
    <StandardLinkInput
      platformId={platformId}
      platformName={platformName}
      value={value}
      onChange={onChange}
      focused={focused}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    />
  );
};

// Custom Link Item Component
const CustomLinkItem: React.FC<{
  link: { id: number; url: string; iconUrl: string | null };
  index: number;
  onIconClick: (index: number, file: File) => void;
  onUrlChange: (value: string, index: number) => void;
}> = ({ link, index, onIconClick, onUrlChange }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onIconClick(index, file);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
      
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => fileInputRef.current?.click()}
        className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors relative overflow-hidden cursor-pointer flex-shrink-0"
      >
        {link.iconUrl ? (
          <Image
            src={link.iconUrl}
            alt="Custom icon"
            width={32}
            height={32}
            className="rounded-full object-cover"
          />
        ) : (
          <LinkIcon className="text-[#331400] w-4 h-4" />
        )}
      </motion.div>

      <Input
        placeholder="add link"
        value={link.url}
        onChange={(e) => onUrlChange(e.target.value, index)}
        className="h-10! text-[16px] placeholder:text-[16px]"
      />
    </div>
  );
};

// ============================================================================
// Main Component
// ============================================================================

const LinksScreen: React.FC = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [visibleCustomLinks, setVisibleCustomLinks] = useState(1);
  
  const { selectedPlatforms, customLinks, updateCustomLink } = useUserStore();
  const router = useRouter();
  const addLinksMutation = useAddLinks();
  const { refetch: refetchCurrentUser } = useCurrentUser();

  // Get platforms with fallback for development
  const platforms = useMemo(() => 
    selectedPlatforms.length > 0 ? selectedPlatforms : [
      { id: "instagram", name: "Instagram", icon: "/icons/instagram.svg" },
      { id: "behance", name: "Behance", icon: "/icons/behance.svg" },
      { id: "x", name: "X", icon: "/icons/x.svg" },
      { id: "snapchat", name: "Snapchat", icon: "/icons/snapchat.svg" },
    ],
    [selectedPlatforms]
  );

  // State for platform link values
  const [platformValues, setPlatformValues] = useState<Record<string, string>>(() => 
    Object.fromEntries(platforms.map((p) => [p.id, ""]))
  );

  const handlePlatformChange = useCallback((platformId: string, value: string) => {
    setPlatformValues(prev => ({ ...prev, [platformId]: value }));
  }, []);

  const handleCustomLinkUrlChange = useCallback((value: string, index: number) => {
    updateCustomLink(index + 1, value, customLinks[index].iconUrl);
  }, [customLinks, updateCustomLink]);

  const handleCustomLinkIconChange = useCallback((index: number, file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const iconUrl = e.target?.result as string;
      updateCustomLink(index + 1, customLinks[index].url, iconUrl);
    };
    reader.readAsDataURL(file);
  }, [customLinks, updateCustomLink]);

  const handleSubmit = useCallback(async () => {
    setIsSubmitting(true);
    
    try {
      const linksToSave: AddLinksRequest[] = [
        ...platforms
          .map((p) => {
            const raw = platformValues[p.id] ?? "";
            const url = buildUrl(p.id, raw);
            return url ? { title: p.name, url, platform: p.id } : null;
          })
          .filter((l): l is AddLinksRequest => l !== null),
        ...customLinks
          .filter((l) => l.url.trim())
          .map((l) => ({
            title: "Custom Link",
            url: buildUrl("", l.url),
            platform: "Custom Platform",
          })),
      ];

      if (linksToSave.length === 0) {
        toast.error("Please add at least one link");
        return;
      }

      // Process each link
      const results = await Promise.allSettled(
        linksToSave.map(async (link) => {
          try {
            await addLinksMutation.mutateAsync(link);
            return { success: true, link };
          } catch (error: any) {
            if (error?.response?.status === 409) {
              return { success: true, link };
            }
            return { 
              success: false, 
              link, 
              error: error?.response?.data?.message || error?.message || "Failed to add link" 
            };
          }
        })
      );

      const failedLinks = results.filter((r) => r.status === "rejected");
      const successfulLinks = results.filter((r) => r.status === "fulfilled" && r.value.success);

      if (failedLinks.length > 0) {
        if (successfulLinks.length > 0) {
          toast.error(`${failedLinks.length} link(s) failed to save`, {
            description: `Saved ${successfulLinks.length}, but ${failedLinks.length} failed.`,
            duration: 5000,
          });
          router.push("/auth/profile");
        } else {
          toast.error("Failed to save links", {
            description: "Please check your links and try again.",
            duration: 5000,
          });
        }
        return;
      }

      await refetchCurrentUser();
      toast.success("All links saved successfully!", {
        description: `Added ${linksToSave.length} link(s)`,
      });
      router.push("/auth/profile");
      
    } catch (error: any) {
      toast.error("Failed to save links", {
        description: error?.message || "An unexpected error occurred.",
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [platforms, platformValues, customLinks, addLinksMutation, refetchCurrentUser, router]);

  // Animation variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { duration: 0.5, when: "beforeChildren", staggerChildren: 0.1 } 
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
  };

  const navButtonVariants: Variants = {
    hover: { scale: 1.05, backgroundColor: "#4a2c1a", transition: { duration: 0.2 } },
    tap: { scale: 0.95, transition: { duration: 0.1 } },
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <ProtectedRoute>
      <motion.main
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="min-h-screen bg-[#FEF4EA] flex flex-col pt-6 pb-10"
      >
        {/* Navigation Bar */}
        <motion.div
          variants={itemVariants}
          className="flex justify-between px-4 md:px-10 mb-10 w-full md:w-full mx-auto"
        >
          <motion.div
            variants={navButtonVariants}
            whileHover="hover"
            whileTap="tap"
            onClick={() => router.push("/auth/platforms")}
            className="flex items-center md:bg-[#331400] md:px-3 md:py-1 cursor-pointer"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M15 18l-6-6 6-6" />
            </svg>
            <span className="md:text-[#FFE4A5] text-sm font-semibold">Back</span>
          </motion.div>

          <motion.div
            variants={navButtonVariants}
            whileHover="hover"
            whileTap="tap"
            onClick={() => router.push("/auth/profile")}
            className="flex items-center md:bg-[#331400] md:px-3 py-1 cursor-pointer"
          >
            <span className="md:text-[#FFE4A5] text-sm font-semibold">Skip</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </motion.div>
        </motion.div>

        <OnboardingProgressWithSteps currentStep={4} totalSteps={5} />

        {/* Header Section */}
        <motion.div variants={itemVariants} className="mb-4 mt-2 md:mb-8 text-center">
          <motion.h1
            className="text-xl md:text-2xl font-bold mb-2 text-[#331400]"
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.2 }}
          >
            Add your Links
          </motion.h1>
          <p className="text-sm text-[#666464] md:px-16">
            Fill the fields below to add content to your Biography
          </p>
        </motion.div>

        {/* Form Section */}
        <div className="flex justify-center w-full flex-grow">
          <div className="w-[90%] md:max-w-md mx-auto space-y-5 pb-10">
            <motion.div variants={itemVariants} className="space-y-4">
              <h2 className="text-center font-semibold text-sm md:text-base">Selected Platforms</h2>

              {platforms.map((platform, index) => (
                <motion.div
                  key={platform.id}
                  variants={itemVariants}
                  custom={index}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center gap-2"
                >
                  <div className="w-5 h-5 flex-shrink-0">
                    <PlatformIcon platformId={platform.id} platformName={platform.name} size={20} />
                  </div>
                  <SmartLinkInput
                    platformId={platform.id}
                    platformName={platform.name}
                    value={platformValues[platform.id] ?? ""}
                    onChange={(val) => handlePlatformChange(platform.id, val)}
                  />
                </motion.div>
              ))}

              <h2 className="font-semibold text-sm md:text-base pt-4 text-center">
                Optional Additions
              </h2>

              <AnimatePresence>
                {customLinks.slice(0, visibleCustomLinks).map((link, index) => (
                  <motion.div
                    key={link.id}
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <CustomLinkItem
                      link={link}
                      index={index}
                      onIconClick={handleCustomLinkIconChange}
                      onUrlChange={handleCustomLinkUrlChange}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Link Counter Controls */}
              <div className="flex items-center justify-between mt-1">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setVisibleCustomLinks(prev => Math.max(1, prev - 1))}
                  disabled={visibleCustomLinks <= 1}
                  className="w-8 h-8 flex items-center justify-center rounded-full border border-[#331400]/30 text-[#331400] text-xl font-light disabled:opacity-20 disabled:cursor-not-allowed"
                >
                  −
                </motion.button>

                <span className="text-xs text-[#331400]/40 font-medium">
                  {visibleCustomLinks} / {customLinks.length}
                </span>

                <motion.button
                  type="button"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setVisibleCustomLinks(prev => Math.min(customLinks.length, prev + 1))}
                  disabled={visibleCustomLinks >= customLinks.length}
                  className="w-8 h-8 flex items-center justify-center rounded-full border border-[#331400]/30 text-[#331400] text-xl font-light disabled:opacity-20 disabled:cursor-not-allowed"
                >
                  +
                </motion.button>
              </div>
            </motion.div>

            {/* Submit Button */}
            <motion.div variants={itemVariants}>
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting || addLinksMutation.isPending}
                className="w-full md:mt-4 bg-[#FED45C] text-black text-sm font-semibold h-10 disabled:opacity-50"
              >
                {isSubmitting || addLinksMutation.isPending ? (
                  <motion.span
                    animate={{ opacity: [0.7, 1, 0.7] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    Saving...
                  </motion.span>
                ) : (
                  "Continue"
                )}
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Mobile Footer */}
        <motion.footer
          variants={itemVariants}
          className="w-full flex items-center md:hidden justify-between gap-2 pb-2 px-4 text-sm text-[#331400]"
        >
          <p>© 2025 Abio</p>
          <a href="/privacy-policy" className="hover:text-[#000000] transition">
            Privacy Policy
          </a>
        </motion.footer>
      </motion.main>
    </ProtectedRoute>
  );
};

export default LinksScreen;