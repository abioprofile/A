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
import { motion, AnimatePresence, type Variants  } from "framer-motion";

const LinksScreen = () => {
  const [isMounted, setIsMounted] = useState(false);
  const { selectedPlatforms, customLinks, updateCustomLink } = useUserStore();
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const router = useRouter();
  const addLinksMutation = useAddLinks();
  const { refetch: refetchCurrentUser } = useCurrentUser();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const platforms =
    selectedPlatforms.length > 0
      ? selectedPlatforms
      : [
          { id: "instagram", name: "Instagram", icon: "/icons/instagram.svg" },
          { id: "behance", name: "Behance", icon: "/icons/behance.svg" },
          { id: "x", name: "X", icon: "/icons/x.svg" },
          { id: "snapchat", name: "Snapchat", icon: "/icons/snapchat.svg" },
        ];

  const handleIconClick = (index: number) => {
    fileInputRefs.current[index]?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const iconUrl = e.target?.result as string;
      updateCustomLink(index + 1, customLinks[index].url, iconUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleLinkChange = (value: string, index: number) => {
    updateCustomLink(index + 1, value, customLinks[index].iconUrl);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      const linksToSave: AddLinksRequest[] = [
        ...platforms
          .map((p) => {
            const url = (document.getElementById(`platform-${p.id}`) as HTMLInputElement)?.value?.trim();
            return url
              ? {
                  title: p.name,
                  url: url,
                  platform: p.id,
                }
              : null;
          })
          .filter((link): link is AddLinksRequest => link !== null),
        ...customLinks
          .filter((l) => l.url.trim())
          .map((l) => ({
            title: "Custom Link",
            url: l.url.trim(),
            platform: "Custom Platform",
          })),
      ];

      if (linksToSave.length === 0) {
        toast.error("Please add at least one link");
        setIsSubmitting(false);
        return;
      }

      const results: Array<{ link: AddLinksRequest; success: boolean; error?: string }> = [];

      for (const link of linksToSave) {
        try {
          await addLinksMutation.mutateAsync(link);
          results.push({ link, success: true });
        } catch (error: unknown) {
          const axiosError = error as {
            response?: {
              status?: number;
              data?: { message?: string };
            };
            message?: string;
          };

          if (axiosError?.response?.status === 409) {
            results.push({ link, success: true });
          } else {
            const errorMessage =
              axiosError?.response?.data?.message ||
              axiosError?.message ||
              "Failed to add link";
            results.push({ link, success: false, error: errorMessage });
          }
        }
      }

      const failedLinks = results.filter((r) => !r.success);

      if (failedLinks.length > 0) {
        const failedCount = failedLinks.length;
        const totalCount = linksToSave.length;
        const successCount = totalCount - failedCount;

        if (successCount > 0) {
          toast.error(
            `${failedCount} link${failedCount > 1 ? "s" : ""} failed to save`,
            {
              description: `Successfully saved ${successCount} link${successCount > 1 ? "s" : ""}, but ${failedCount} link${failedCount > 1 ? "s" : ""} failed. Please check and try again.`,
              duration: 5000,
            }
          );
        } else {
          toast.error("Failed to save links", {
            description: failedLinks[0]?.error || "Please check your links and try again.",
            duration: 5000,
          });
        }

        setIsSubmitting(false);
        return;
      }

      try {
        await refetchCurrentUser();
        toast.success("All links saved successfully!", {
          description: `Successfully added ${linksToSave.length} link${linksToSave.length > 1 ? "s" : ""}`,
        });
        router.push("/auth/profile");
      } catch (error) {
        toast.success("Links saved successfully!", {
          description: "Note: Could not refresh user data, but links were saved.",
        });
        router.push("/auth/profile");
      }
    } catch (error: unknown) {
      console.error("Unexpected error saving links:", error);
      const axiosError = error as { response?: { data?: { message?: string } }; message?: string };
      toast.error("Failed to save links", {
        description: axiosError?.response?.data?.message || axiosError?.message || "An unexpected error occurred. Please try again.",
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Animation variants 
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
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
  };

  const iconVariants: Variants = {
    hover: {
      scale: 1.1,
      backgroundColor: "rgba(209, 213, 219, 0.8)",
      transition: {
        duration: 0.2,
        ease: "easeInOut",
      },
    },
    tap: {
      scale: 0.95,
      transition: {
        duration: 0.1,
      },
    },
  };

  const buttonVariants: Variants = {
    hover: {
      scale: 1.02,
      transition: {
        duration: 0.2,
        ease: "easeInOut",
      },
    },
    tap: {
      scale: 0.98,
      transition: {
        duration: 0.1,
      },
    },
  };

  const navButtonVariants: Variants = {
    hover: {
      scale: 1.05,
      backgroundColor: "#4a2c1a",
      transition: {
        duration: 0.2,
        ease: "easeInOut",
      },
    },
    tap: {
      scale: 0.95,
      transition: {
        duration: 0.1,
      },
    },
  };

  if (!isMounted) {
    return null;
  }

  return (
    <ProtectedRoute>
      <motion.main
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="min-h-screen bg-[#FEF4EA] flex flex-col pt-6 pb-10"
      >
        {/* Navigation Buttons - Original layout preserved */}
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

        {/* Header - Original layout preserved */}
        <motion.div 
          variants={itemVariants}
          className="mb-4 md:mb-8 flex justify-center items-center flex-col"
        >
          <motion.h1 
            className="text-3xl md:text-4xl font-bold mb-2 text-[#331400]"
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.2 }}
          >
            Add your Links
          </motion.h1>
          <motion.p 
            variants={itemVariants}
            className="font-semibold text-[12px] md:text-[14px] px-16 text-center"
          >
            Fill the fields below to add content to your Biography
          </motion.p>
        </motion.div>

        {/* Form Content - CENTERED while maintaining original width */}
        <div className="flex justify-center items-start w-full flex-grow">
          <div className="w-[90%] md:max-w-md mx-auto flex flex-col justify-start space-y-5 pb-10">
            <motion.div variants={itemVariants} className="space-y-3">
              <h2 className="text-center font-semibold text-lg">Selected Platforms form</h2>

              {platforms.map((platform, index) => (
                <motion.div
                  key={platform.id}
                  custom={index}
                  variants={itemVariants}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center gap-2"
                >
                  <Image src={platform.icon} alt={platform.name} width={20} height={20} />
                  <Input
                    id={`platform-${platform.id}`}
                    placeholder={`Input your ${platform.name} Link`}
                    className="h-10!"
                  />
                </motion.div>
              ))}

              <motion.h2 
                variants={itemVariants}
                className="font-semibold text-lg pt-4 text-center"
              >
                Optional Additions form
              </motion.h2>

              {customLinks.map((link, index) => (
                <motion.div
                  key={link.id}
                  custom={index}
                  variants={itemVariants}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center gap-3"
                >
                  <motion.div
                    variants={iconVariants}
                    whileHover="hover"
                    whileTap="tap"
                    onClick={() => handleIconClick(index)}
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors relative overflow-hidden cursor-pointer"
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
                      <LinkIcon className="text-[#331400]" />
                    )}
                  </motion.div>

                  <input
                    type="file"
                    ref={(el) => {
                      fileInputRefs.current[index] = el;
                    }}
                    onChange={(e) => handleFileChange(e, index)}
                    accept="image/*"
                    className="hidden"
                  />

                  <Input
                    placeholder="Add Link"
                    value={link.url}
                    onChange={(e) => handleLinkChange(e.target.value, index)}
                    className="h-10!"
                  />
                </motion.div>
              ))}

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
                  className="w-full md:mt-8 bg-[#FED45C] text-black text-[16px] font-medium h-10! disabled:opacity-50 disabled:cursor-not-allowed"
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

        {/* Footer - Original layout preserved */}
        <motion.footer 
          variants={itemVariants}
          className="w-full flex items-center md:hidden justify-between gap-2 py-4 px-4 text-sm text-[#331400] mt-8"
        >
          <motion.p
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.2 }}
          >
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