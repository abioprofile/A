"use client";

import { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LinkIcon } from "lucide-react";
import { useUserStore } from "@/stores/user.store";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useAddLinks, useCurrentUser } from "@/hooks/api/useAuth";
import { AddLinksRequest } from "@/types/auth.types";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { OnboardingProgressWithSteps } from "@/components/ProgressBar";

// ─── Platform base-URL map
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
};

// Platforms that use @ symbol prefix visually
const AT_PLATFORMS = new Set([
  "x",
  "twitter",
  "snapchat",
  "tiktok",
  "instagram",
]);

// Builds the final URL from prefix + username
const buildUrl = (platformId: string, value: string): string => {
  const trimmed = value.trim();
  if (!trimmed) return "";
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  const base = PLATFORM_BASE_URLS[platformId];
  if (base) return `https://${base}${trimmed}`;
  return `https://${trimmed}`;
};

// Returns the placeholder text shown when input is unfocused & empty
const getPlaceholder = (platformId: string, platformName: string): string => {
  if (platformId === "whatsapp") return "WhatsApp phone number";
  const base = PLATFORM_BASE_URLS[platformId];
  if (!base) return `Input your ${platformName} link`;
  if (AT_PLATFORMS.has(platformId)) return `@username`;
  return `${base}username`;
};

// ─── SmartLinkInput
interface SmartLinkInputProps {
  platformId: string;
  platformName: string;
  value: string;
  onChange: (val: string) => void;
}

const SmartLinkInput = ({
  platformId,
  platformName,
  value,
  onChange,
}: SmartLinkInputProps) => {
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const base = PLATFORM_BASE_URLS[platformId];

  const isFullUrl = /^https?:\/\//i.test(value);
  const showPrefix = !!base && !isFullUrl && focused;
  const hasValue = value.length > 0;

  // Floating label appears when focused or has a value
  const showFloatingLabel = focused || hasValue;

  const floatingLabel =
    platformId === "whatsapp"
      ? "Phone number"
      : base
        ? "Username"
        : `${platformName} link`;

  return (
    <div
      onClick={() => inputRef.current?.focus()}
      className={`
        relative flex items-center w-full ring-1 ring-[#331400]/20 bg-transparent cursor-text
        transition-all duration-200 overflow-hidden
        ${
          focused
            ? "ring-1 ring-[#331400]"
            : "border-input hover:border-[#331400]/50"
        }
      `}
      style={{ minHeight: "40px" }}
    >
      {/* Floating label */}
      <AnimatePresence>
        {showFloatingLabel && (
          <motion.span
            key="label"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.15 }}
            className="absolute left-3 top-2 text-sm font-semibold  select-none pointer-events-none leading-none"
          >
            {floatingLabel}
          </motion.span>
        )}
      </AnimatePresence>

      {/* Input row */}
      <div
        className={`flex items-center w-full px-3 ${showFloatingLabel ? "pt-5 pb-2" : "py-3"}`}
      >
        {/* Inline URL prefix (shown when focused) */}
        <AnimatePresence>
          {showPrefix && (
            <motion.span
              key="prefix"
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.2 }}
              className=" whitespace-nowrap select-none overflow-hidden text-sm"
            >
              {base}
            </motion.span>
          )}
        </AnimatePresence>

        <input
          ref={inputRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={!focused ? getPlaceholder(platformId, platformName) : ""}
          className="flex-1 bg-transparent outline-none placeholder:text-[#331400]/50 placeholder:text-sm min-w-0 text-sm"
        />
      </div>
    </div>
  );
};

// ─── Main Screen
const LinksScreen = () => {
  const [isMounted, setIsMounted] = useState(false);
  const { selectedPlatforms, customLinks, updateCustomLink } = useUserStore();
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const router = useRouter();
  const addLinksMutation = useAddLinks();
  const { refetch: refetchCurrentUser } = useCurrentUser();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [visibleCount, setVisibleCount] = useState(1);
  
  const platforms =
    selectedPlatforms.length > 0
      ? selectedPlatforms
      : [
          { id: "instagram", name: "Instagram", icon: "/icons/instagram.svg" },
          { id: "behance", name: "Behance", icon: "/icons/behance.svg" },
          { id: "x", name: "X", icon: "/icons/x.svg" },
          { id: "snapchat", name: "Snapchat", icon: "/icons/snapchat.svg" },
        ];

  // ── Platform link values stored in state
  const [platformValues, setPlatformValues] = useState<Record<string, string>>(
    () => Object.fromEntries(platforms.map((p) => [p.id, ""])),
  );

  const handlePlatformChange = (platformId: string, value: string) => {
    setPlatformValues((prev) => ({ ...prev, [platformId]: value }));
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleIconClick = (index: number) => {
    fileInputRefs.current[index]?.click();
  };

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const iconUrl = e.target?.result as string;
      updateCustomLink(index + 1, customLinks[index].url, iconUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleCustomLinkChange = (value: string, index: number) => {
    updateCustomLink(index + 1, value, customLinks[index].iconUrl);
  };

  // ── Submit
  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      const linksToSave: AddLinksRequest[] = [
        // Platform links
        ...platforms
          .map((p) => {
            const raw = platformValues[p.id] ?? "";
            const url = buildUrl(p.id, raw);
            return url ? { title: p.name, url, platform: p.id } : null;
          })
          .filter((l): l is AddLinksRequest => l !== null),

        // Custom links
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
        setIsSubmitting(false);
        return;
      }

      const results: Array<{
        link: AddLinksRequest;
        success: boolean;
        error?: string;
      }> = [];

      for (const link of linksToSave) {
        try {
          await addLinksMutation.mutateAsync(link);
          results.push({ link, success: true });
        } catch (error: unknown) {
          const axiosError = error as {
            response?: { status?: number; data?: { message?: string } };
            message?: string;
          };
          if (axiosError?.response?.status === 409) {
            results.push({ link, success: true });
          } else {
            results.push({
              link,
              success: false,
              error:
                axiosError?.response?.data?.message ||
                axiosError?.message ||
                "Failed to add link",
            });
          }
        }
      }

      const failedLinks = results.filter((r) => !r.success);

      if (failedLinks.length > 0) {
        const successCount = linksToSave.length - failedLinks.length;
        if (successCount > 0) {
          toast.error(
            `${failedLinks.length} link${failedLinks.length > 1 ? "s" : ""} failed to save`,
            {
              description: `Saved ${successCount}, but ${failedLinks.length} failed. Please check and retry.`,
              duration: 5000,
            },
          );
          router.push("/auth/profile");
        } else {
          toast.error("Failed to save links", {
            description:
              failedLinks[0]?.error || "Please check your links and try again.",
            duration: 5000,
          });
        }
        setIsSubmitting(false);
        return;
      }

      try {
        await refetchCurrentUser();
      } catch (_) {
        // non-critical
      }
      toast.success("All links saved successfully!", {
        description: `Added ${linksToSave.length} link${linksToSave.length > 1 ? "s" : ""}`,
      });
      router.push("/auth/profile");
    } catch (error: unknown) {
      const axiosError = error as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      toast.error("Failed to save links", {
        description:
          axiosError?.response?.data?.message ||
          axiosError?.message ||
          "An unexpected error occurred.",
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Animation variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" },
    },
  };

  const iconVariants: Variants = {
    hover: {
      scale: 1.1,
      backgroundColor: "rgba(209,213,219,0.8)",
      transition: { duration: 0.2 },
    },
    tap: { scale: 0.95, transition: { duration: 0.1 } },
  };

  const buttonVariants: Variants = {
    hover: { scale: 1.02, transition: { duration: 0.2 } },
    tap: { scale: 0.98, transition: { duration: 0.1 } },
  };

  const navButtonVariants: Variants = {
    hover: {
      scale: 1.05,
      backgroundColor: "#4a2c1a",
      transition: { duration: 0.2 },
    },
    tap: { scale: 0.95, transition: { duration: 0.1 } },
  };

  if (!isMounted) return null;

  return (
    <ProtectedRoute>
      <motion.main
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="min-h-screen bg-[#FEF4EA] flex flex-col pt-6 pb-10"
      >
        

        {/* Nav */}
        <motion.div
          variants={itemVariants}
          className="flex justify-between px-4 md:px-10 mb-10 w-[100%] md:w-full mx-auto"
        >
          <motion.div
            variants={navButtonVariants}
            whileHover="hover"
            whileTap="tap"
            onClick={() => router.push("/auth/platforms")}
            className="flex items-center md:bg-[#331400] md:px-3 md:py-1 cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="md:text-[#FFE4A5]"
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
            <span className="md:text-[#FFE4A5] text-sm font-semibold">
              Back
            </span>
          </motion.div>

          <motion.div
            variants={navButtonVariants}
            whileHover="hover"
            whileTap="tap"
            onClick={() => router.push("/auth/profile")}
            className="flex items-center md:bg-[#331400] md:px-3 py-1 cursor-pointer"
          >
            <span className="md:text-[#FFE4A5] text-sm font-semibold">
              Skip
            </span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="md:text-[#FFE4A5]"
            >
              <path d="M9 18l6-6-6-6" />
            </svg>
          </motion.div>
        </motion.div>

          <OnboardingProgressWithSteps currentStep={4} totalSteps={5} />
        {/* Header */}
        <motion.div
          variants={itemVariants}
          className="mb-4 mt-2 md:mb-8 flex justify-center items-center flex-col"
        >
          <motion.h1
            className="text-[20px] md:text-[24px] font-bold mb-2 text-[#331400]"
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.2 }}
          >
            Add your Links
          </motion.h1>
          <motion.p
            variants={itemVariants}
            className=" text-sm text-[#666464] md:text-[14px] md:px-16 text-center"
          >
            Fill the fields below to add content to your Biography
          </motion.p>
        </motion.div>

        {/* Form */}
        <div className="flex justify-center items-start w-full flex-grow">
          <div className="w-[90%] md:max-w-md mx-auto flex flex-col justify-start space-y-5 pb-10">
            <motion.div variants={itemVariants} className="space-y-2 sm:space-y-4">
              <h2 className="text-center font-semibold text-sm md:text-[16px]">
                Selected Platforms
              </h2>

              {platforms.map((platform, index) => (
                <motion.div
                  key={platform.id}
                  custom={index}
                  variants={itemVariants}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center gap-2"
                >
                  <Image
                    src={platform.icon}
                    alt={platform.name}
                    width={20}
                    height={20}
                  />
                  <SmartLinkInput
                    platformId={platform.id}
                    platformName={platform.name}
                    value={platformValues[platform.id] ?? ""}
                    onChange={(val) => handlePlatformChange(platform.id, val)}
                  />
                </motion.div>
              ))}

              <motion.h2
                variants={itemVariants}
                className="font-semibold text-sm md:text-[16px] pt-4 text-center"
              >
                Optional Additions
              </motion.h2>

                   <AnimatePresence>
                {customLinks.slice(0, visibleCount).map((link, index) => (
                  <motion.div
                    key={link.id}
                    custom={index}
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    exit={{ opacity: 0, y: -6, transition: { duration: 0.2 } }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center gap-2"
                  >
                    <motion.div
                      variants={iconVariants}
                      whileHover="hover"
                      whileTap="tap"
                      onClick={() => handleIconClick(index)}
                      className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors relative overflow-hidden cursor-pointer flex-shrink-0"
                    >
                      {link.iconUrl ? (
                        <Image src={link.iconUrl} alt="Custom icon" width={32} height={32} className="rounded-full object-cover" />
                      ) : (
                        <LinkIcon className="text-[#331400] w-4 h-4" />
                      )}
                    </motion.div>

                    <input
                      type="file"
                      ref={(el) => { fileInputRefs.current[index] = el; }}
                      onChange={(e) => handleFileChange(e, index)}
                      accept="image/*"
                      className="hidden"
                    />

                    <Input
                      placeholder="add link"
                      value={link.url}
                      onChange={(e) => handleCustomLinkChange(e.target.value, index)}
                      className="h-10! text-[16px] placeholder:text-[16px]"
                    />
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* + / - controls */}
              <div className="flex items-center justify-between mt-1">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setVisibleCount((c) => Math.max(1, c - 1))}
                  disabled={visibleCount <= 1}
                  className="w-8 h-8 flex items-center justify-center rounded-full border border-[#331400]/30 text-[#331400] text-xl font-light disabled:opacity-20 disabled:cursor-not-allowed transition-opacity"
                  aria-label="Remove link field"
                >
                  −
                </motion.button>

                <span className="text-xs text-[#331400]/40 font-medium">
                  {visibleCount} / {customLinks.length}
                </span>

                <motion.button
                  type="button"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setVisibleCount((c) => Math.min(customLinks.length, c + 1))}
                  disabled={visibleCount >= customLinks.length}
                  className="w-8 h-8 flex items-center justify-center rounded-full border border-[#331400]/30 text-[#331400] text-xl font-light disabled:opacity-20 disabled:cursor-not-allowed transition-opacity"
                  aria-label="Add link field"
                >
                  +
                </motion.button>
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <motion.div
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting || addLinksMutation.isPending}
                  className="w-full md:mt-4 bg-[#FED45C] text-black text-sm font-semibold h-10! disabled:opacity-50 disabled:cursor-not-allowed"
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
            </motion.div>
          </div>
        </div>

        {/* Footer */}
        <motion.footer
          variants={itemVariants}
          className="w-full flex items-center md:hidden justify-between gap-2 pb-2 px-4 text-sm text-[#331400]"
        >
          <motion.p whileHover={{ scale: 1.03 }} transition={{ duration: 0.2 }}>
            © 2025 Abio
          </motion.p>
          <motion.a
            href="/privacy-policy"
            className="hover:text-[#000000] transition"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            Privacy Policy
          </motion.a>
        </motion.footer>
      </motion.main>
    </ProtectedRoute>
  );
};

export default LinksScreen;
