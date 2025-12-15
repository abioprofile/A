"use client";

import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LinkIcon } from "lucide-react";
import { useUserStore } from "@/stores/user.store";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { addLink as addLinkApi } from "@/lib/auth";
import { useAuth } from "@/context/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

const LinksScreen = () => {
  const { token, addLinkToCache } = useAuth();
  const { selectedPlatforms, customLinks, updateCustomLink } = useUserStore();
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const router = useRouter();

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

//   const handleSubmit = async () => {
//     if (!token) return toast.error("Session expired. Please login again.");

//     try {
//       // Save platform links
//       for (const platform of platforms) {
//         const inputEl = document.getElementById(`platform-${platform.id}`) as HTMLInputElement;
//         if (!inputEl?.value) continue;

//         const response = await addLinkApi(
//           { title: platform.name, url: inputEl.value, platform: platform.id },
//           { Authorization: `Bearer ${token}` }
//         );

//         // Update AuthContext cache instantly
//         addLinkToCache(response);
//       }

//       // Save custom links
//       for (const link of customLinks) {
//         if (!link.url) continue;

//         const response = await addLinkApi(
//           { title: "Custom Link", url: link.url, platform: "" },
//           { Authorization: `Bearer ${token}` }
//         );

//         addLinkToCache(response);
//       }

//       toast.success("Links saved successfully!");
//       router.push("/auth/profile");
//     } catch (error) {
//       console.error(error);
//       toast.error("Failed to save links");
//     }
//   };

  const handleSubmit = async () => {
  if (!token) return toast.error("Session expired. Please login again.");

  try {
    const linksToSave = [
      ...platforms.map((p) => ({
        title: p.name,
        url: (document.getElementById(`platform-${p.id}`) as HTMLInputElement)?.value,
        platform: p.id,
      })),
      ...customLinks.map((l) => ({
        title: "Custom Link",
        url: l.url,
        platform: "",
      })),
    ].filter((l) => l.url);

    for (const link of linksToSave) {
      try {
        const response = await addLinkApi(link, { Authorization: `Bearer ${token}` });
        addLinkToCache(response);
      } catch (err: any) {
        if (err?.statusCode === 409) {
          console.log(`Link already exists: ${link.url}`);
        } else {
          console.error("Failed to save link:", link.url, err);
        }
      }
    }

    toast.success("Links saved successfully!");
    router.push("/auth/profile"); 
  } catch (error) {
    console.error("Error saving links:", error);
    toast.error("Failed to save links");
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
          className="w-full md:mt-8 bg-[#FED45C] text-black text-[16px] font-medium h-10!"
        >
          Continue
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
