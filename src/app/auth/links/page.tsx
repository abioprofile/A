"use client";

import { useRef, useState } from "react";
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

const LinksScreen = () => {
  const { selectedPlatforms, customLinks, updateCustomLink } = useUserStore();
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const router = useRouter();
  const addLinksMutation = useAddLinks();
  const { refetch: refetchCurrentUser } = useCurrentUser();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Use selected platforms from store, or fallback to defaults
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
      // Collect all links to save
      const linksToSave: AddLinksRequest[] = [
        // Platform links - use title (name) and platform (id) from selected platforms
        ...platforms
          .map((p) => {
            const url = (document.getElementById(`platform-${p.id}`) as HTMLInputElement)?.value?.trim();
            return url
              ? {
                  title: p.name, // Use platform name as title
                  url: url,
                  platform: p.id, // Use platform id
                }
              : null;
          })
          .filter((link): link is AddLinksRequest => link !== null),
        // Custom links
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

      // Track results for each link
      const results: Array<{ link: AddLinksRequest; success: boolean; error?: string }> = [];

      // Add all links one by one and track results
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

          // Handle duplicate links (409) - still count as success since link exists
          if (axiosError?.response?.status === 409) {
            results.push({ link, success: true });
            console.log(`Link already exists: ${link.url}`);
          } else {
            // Track failed links with error message
            const errorMessage =
              axiosError?.response?.data?.message ||
              axiosError?.message ||
              "Failed to add link";
            results.push({ link, success: false, error: errorMessage });
            console.error(`Failed to add link ${link.title} (${link.url}):`, error);
          }
        }
      }

      // Check if all links succeeded
      const failedLinks = results.filter((r) => !r.success);

      if (failedLinks.length > 0) {
        // Some links failed - show error and don't redirect
        const failedCount = failedLinks.length;
        const totalCount = linksToSave.length;
        const successCount = totalCount - failedCount;

        // Show detailed error message
        if (successCount > 0) {
          toast.error(
            `${failedCount} link${failedCount > 1 ? "s" : ""} failed to save`,
            {
              description: `Successfully saved ${successCount} link${successCount > 1 ? "s" : ""}, but ${failedCount} link${failedCount > 1 ? "s" : ""} failed. Please check and try again.`,
              duration: 5000,
            }
          );
        } else {
          // All links failed
          toast.error("Failed to save links", {
            description: failedLinks[0]?.error || "Please check your links and try again.",
            duration: 5000,
          });
        }

        // Log failed links for debugging
        failedLinks.forEach(({ link, error }) => {
          console.error(`Failed: ${link.title} (${link.url}) - ${error}`);
        });

        setIsSubmitting(false);
        return; // Don't redirect if any link failed
      }

      // All links succeeded - fetch fresh user data
      try {
        await refetchCurrentUser();
        toast.success("All links saved successfully!", {
          description: `Successfully added ${linksToSave.length} link${linksToSave.length > 1 ? "s" : ""}`,
        });
        router.push("/auth/profile");
      } catch (error) {
        console.error("Error fetching updated user data:", error);
        // Still redirect even if refetch fails, since links were saved
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

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-[#FEF4EA] flex flex-col pt-6 pb-10">
        <div className="flex justify-between px-10 mb-5 w-[90%] md:w-full mx-auto">
          <div
            className="hidden md:flex items-center bg-[#331400] px-3 py-1 cursor-pointer"
            onClick={() => router.push("/auth/platforms")}
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
              className="text-[#FFE4A5]"
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
            <span className="text-[#FFE4A5] text-sm font-semibold">Back</span>
          </div>

          <div
            className="hidden md:flex items-center bg-[#331400] px-3 py-1 cursor-pointer"
            onClick={() => router.push("/auth/profile")}
          >
            <span className="text-[#FFE4A5] text-sm font-semibold">Skip</span>
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
              className="text-[#FFE4A5]"
            >
              <path d="M9 18l6-6-6-6" />
            </svg>
          </div>
        </div>

        <div className="mb-4 md:mb-8 flex justify-center items-center flex-col">
          <h1 className="text-2xl lg:text-4xl font-bold mb-2 text-[#331400]">Add your Links</h1>
          <p className="font-semibold text-[13px] md:text-[16px] px-16 text-center">
            Complete the field below to add your content on your new ABio.
          </p>
        </div>

        <div className="w-[90%] md:max-w-md mx-auto flex flex-col justify-start flex-grow space-y-5 pb-10">
          <div className="space-y-3">
            <h2 className="text-center font-semibold text-lg">Your Selected Platforms</h2>

            {platforms.map((platform) => (
              <div key={platform.id} className="flex items-center gap-2">
                <Image src={platform.icon} alt={platform.name} width={20} height={20} />
                <Input
                  id={`platform-${platform.id}`}
                  placeholder={`Input your ${platform.name} Link`}
                  className="h-10!"
                />
              </div>
            ))}

            <h2 className="font-semibold text-lg pt-4 text-center">Add your own Links</h2>

            {customLinks.map((link, index) => (
              <div key={link.id} className="flex items-center gap-3">
                <div
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
                </div>

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
              </div>
            ))}

          </div>

          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || addLinksMutation.isPending}
            className="w-full md:mt-8 bg-[#FED45C] text-black text-[16px] font-medium h-10! disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting || addLinksMutation.isPending ? "Saving..." : "Continue"}
          </Button>
        </div>

        <footer className="w-full flex items-center md:hidden justify-between gap-2 py-4 px-4 text-sm text-[#331400] mt-8">
          <p>© 2025 Abio</p>
          <a href="/privacy-policy" className="hover:text-[#000000] transition">
            Privacy Policy
          </a>
        </footer>
      </main>
    </ProtectedRoute>
  );
};

export default LinksScreen;
