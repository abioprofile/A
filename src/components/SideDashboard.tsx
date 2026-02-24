"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import Modal from "@/components/ui/modal";
import { toast } from "sonner";
import {
  CopyIcon,
  Share,
  DownloadIcon,
  QrCodeIcon,
  MoreHorizontalIcon,
  ArrowLeftIcon,
  XIcon,
  MailIcon,
  LinkIcon,
  Settings,
  LogOut,
  Moon,
  CreditCard,
  LucideIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import {
  FaFacebook,
  FaTwitter,
  FaXTwitter,
  FaWhatsapp,
  FaInstagram,
  FaPinterest,
  FaTiktok,
  FaYoutube,
  FaSnapchat,
} from "react-icons/fa6";
import type { IconType } from "react-icons";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

import { clearAuth } from "@/stores/slices/auth.slice";
import { useQueryClient } from "@tanstack/react-query";
import { QRCodeSVG } from "qrcode.react";
import { toPng } from "html-to-image";

// Define types
interface UserProfile {
  username?: string;
}

interface UserData {
  name?: string;
  profile?: UserProfile;
}

interface SharePlatform {
  platform: string;
  icon: IconType | LucideIcon;
  color: string;
  label: string;
  bgColor: string;
}

// ─── Reusable Responsive Modal Shell ────────────────────────────────────────
// On mobile  → slides up from the bottom as a sheet
// On desktop → centered modal (existing behaviour via the Modal component)
function ResponsiveSheet({
  isOpen,
  onClose,
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/20 md:backdrop-blur-sm"
            onClick={onClose}
          />

          {/* ── Mobile: bottom sheet ── */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="
              fixed bottom-0 left-0 right-0 z-[999]
               bg-white shadow-2xl
              md:hidden
            "
          >
            
            {children}
          </motion.div>

          {/* ── Desktop: centred modal ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="
              hidden md:flex
              fixed top-1/2 left-1/2 z-50
              -translate-x-1/2 -translate-y-1/2
              w-full max-w-md px-4
            "
          >
            <div className="w-full bg-white shadow-2xl overflow-hidden">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default function SideDashboard() {
  const router = useRouter();
  const userData = useAppSelector(
    (state) => state.auth.user,
  ) as UserData | null;

  const getProfileLink = (): string => {
    if (typeof window === "undefined") return "/profile";
    const origin = window.location.origin;
    return userData?.profile?.username
      ? `${origin}/${userData.profile.username}`
      : `${origin}/profile`;
  };

  const profileLink = getProfileLink();
  const shareText = `Check out my Abio profile! ${profileLink}`;
  const [showMenu, setShowMenu] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);
  const [showAccountSettings, setShowAccountSettings] =
    useState<boolean>(false);
  const [twoStepEnabled, setTwoStepEnabled] = useState<boolean>(false);
  const menuItems = [
    { icon: CreditCard, label: "Billing", href: "/dashboard/Billing" },
    // {
    //   icon: Settings,
    //   label: "Account Settings",
    //   href: "/dashboard/AccountSettings",
    // },
    // { icon: Moon, label: "Light Mode", action: "toggle-theme" },
  ];

  const dispatch = useAppDispatch();
  const qrCodeRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  const handleLogout = () => {
    dispatch(clearAuth());
    queryClient.clear();
    setShowMenu(false);
    toast.success("Logged out successfully");
    router.push("/auth/sign-in");
  };

  const copyToClipboard = async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(profileLink);
      toast.success("Link copied");
    } catch {
      toast.error("Failed to copy link");
    }
  };

  const shareLink = async (): Promise<void> => {
    try {
      if (navigator.share && window.innerWidth < 768) {
        await navigator.share({
          title: userData?.name || "User",
          text: shareText,
          url: profileLink,
        });
      } else {
        setIsShareModalOpen(true);
      }
    } catch {
      setIsShareModalOpen(true);
    }
  };

  const handleShare = async (platform: string): Promise<void> => {
    const shareUrls: Record<string, string> = {
      whatsapp: `https://wa.me/?text=${encodeURIComponent(shareText)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(profileLink)}&quote=${encodeURIComponent(shareText)}`,
      instagram: `https://www.instagram.com/?url=${encodeURIComponent(profileLink)}`,
      pinterest: `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(profileLink)}&description=${encodeURIComponent(shareText)}`,
      tiktok: `https://www.tiktok.com/share?url=${encodeURIComponent(profileLink)}`,
      email: `mailto:?subject=Check out my Abio profile&body=${encodeURIComponent(shareText)}`,
      copy: profileLink,
    };

    if (platform === "copy") {
      try {
        await navigator.clipboard.writeText(profileLink);
        toast.success("Profile link copied to clipboard!");
        setIsShareModalOpen(false);
      } catch {
        toast.error("Failed to copy profile link to clipboard!");
      }
    } else if (platform === "email") {
      window.open(shareUrls[platform], "_self");
    } else if (shareUrls[platform]) {
      window.open(shareUrls[platform], "_blank", "noopener,noreferrer");
    }
  };

  const downloadQRCode = async (): Promise<void> => {
    if (qrCodeRef.current === null) return;
    try {
      const dataUrl = await toPng(qrCodeRef.current, {
        backgroundColor: "#ffffff",
        width: 400,
        height: 400,
        style: { margin: "0 auto" },
      });
      const link = document.createElement("a");
      link.download = `abio-qr-${userData?.profile?.username || "profile"}.png`;
      link.href = dataUrl;
      link.click();
      toast.success("QR code downloaded!");
    } catch (error) {
      console.error("Error downloading QR code:", error);
      toast.error("Failed to download QR code");
    }
  };

  const formatLink = (url: string): React.ReactElement => {
    try {
      const parsed = new URL(url);
      const base = `${parsed.host}/`;
      const username = parsed.pathname.replace(/^\//, "") || "";
      return (
        <>
          <span className="font-semibold text-red-500">{base}</span>
          <span className="text-gray-900">{username}</span>
        </>
      );
    } catch {
      return <span className="font-semibold text-red-500">{url}</span>;
    }
  };

  const sharePlatforms: SharePlatform[] = [
    {
      platform: "whatsapp",
      icon: FaWhatsapp,
      color: "text-green-600",
      label: "WhatsApp",
      bgColor: "bg-green-50",
    },
    {
      platform: "facebook",
      icon: FaFacebook,
      color: "text-blue-600",
      label: "Facebook",
      bgColor: "bg-blue-50",
    },
    {
      platform: "instagram",
      icon: FaInstagram,
      color: "text-pink-600",
      label: "Instagram",
      bgColor: "bg-pink-50",
    },
    {
      platform: "pinterest",
      icon: FaPinterest,
      color: "text-red-600",
      label: "Pinterest",
      bgColor: "bg-red-50",
    },
  ];

  // ── Shared modal inner content 

  const QRModalContent = () => (
    <div className="relative   text-center w-full z-[999] p-2 md:p-6 ">
      <div className="flex justify-end mb-2">
        <button
          onClick={() => setIsModalOpen(false)}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <XIcon className="w-5 h-5 text-gray-500" />
        </button>
      </div>
      <h2 className="text-[20px] md:text-[24px] font-semibold">Here is your code!!!</h2>
      <p className="text-[12px] md:text-sm text-gray-500 mt-1 mb-2">
        This is your unique code for another <br /> person to scan
      </p>

      <div className="flex justify-center mb-2" ref={qrCodeRef}>
        <QRCodeSVG
          value={profileLink}
          size={160}
          level="H"
          includeMargin={true}
          bgColor="#ffffff"
          fgColor="#000000"
        />
      </div>

      <div className="flex justify-center gap-4 pb-2">
        <button
          onClick={() => {
            setIsModalOpen(false);
            setIsShareModalOpen(true);
          }}
          className="flex flex-col items-center gap-1 text-xs text-gray-700"
        >
          <div className="w-10 h-10 bg-[#3B1F0E] flex items-center justify-center">
            <Share className="w-5 h-5 text-white" />
            {/* <Image
              src="/assets/icons/dashboard/share.svg"
              alt="share"
              width={24}
              height={24}
              className="w-6 h-6 text-white "
            /> */}
          </div>
          Share
        </button>

        <button
          onClick={downloadQRCode}
          className="flex flex-col items-center gap-1 text-xs text-gray-700"
        >
          <div className="w-10 h-10 bg-[#3B1F0E] flex items-center justify-center">
            <DownloadIcon className="w-5 h-5 text-white" />
          </div>
          Download
        </button>
      </div>
    </div>
  );

  const ShareModalContent = () => (
    <div className="w-full">
      {/* Header */}
      <div className="p-4 md:p-6 border-b border-gray-100 bg-white md:rounded-t-2xl">
        <div className="flex justify-end mb-2">
          <button
            onClick={() => setIsShareModalOpen(false)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <XIcon className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <div className="text-center">
          <h2 className="text-[20px] md:text-[24px] font-bold mb-2 text-gray-900">
            Share Your Profile
          </h2>
          <p className="text-[12px] md:text-sm text-gray-500 mt-1">
            Abio is more effective when you <br /> connect with friends!
          </p>
        </div>

        {/* Link Preview */}
        <div className="mt-4">
          <p className="text-sm font-bold text-gray-700 mb-2">
            Share your link
          </p>
          <div className="flex items-center gap-2 bg-[#F7F8FD] border border-gray-200 p-3 ">
            <input
              readOnly
              value={profileLink}
              className="bg-transparent w-full text-sm text-gray-800 outline-none truncate"
            />
            <button
              onClick={() => handleShare("copy")}
              className="flex-shrink-0 p-1 hover:bg-gray-200 transition-colors rounded"
              title="Copy link"
            >
              <CopyIcon className="w-4 h-4 text-red-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Share Options */}
      <div className="p-4 md:p-6 bg-white md:rounded-b-2xl">
        <p className="text-sm font-bold text-gray-700 mb-3">Share to</p>
        <div className="grid grid-cols-4 gap-3 pb-2">
          {sharePlatforms.map(({ platform, icon: Icon, color, label, bgColor }) => (
            <button
              key={platform}
              onClick={() => handleShare(platform)}
              className="flex flex-col items-center gap-2 p-2 md:p-3 hover:bg-gray-50 rounded-xl transition-colors group"
            >
              <div
                className={`w-10 h-10 md:w-12 md:h-12  ${bgColor} flex items-center justify-center group-hover:scale-105 transition-transform`}
              >
                <Icon className={`w-5 h-5 md:w-6 md:h-6 ${color}`} />
              </div>
              <span className="text-xs font-medium text-gray-700 text-center line-clamp-2">
                {label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* MOBILE TOP BAR */}
      <div className="sticky top-0 z-40 mt-2 mb-4 w-full bg-[#Fff7de] md:hidden">
        <div className="px-8 py-2 sm:px-6">
          <div className="flex items-center justify-between gap-3">
            <p className="min-w-0 flex-1 truncate text-left text-[20px] font-extrabold text-black">
              {userData?.name || userData?.profile?.username || "User"}
            </p>
            <div className="flex shrink-0 items-center gap-[0.5px] p-0">
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex h-9 w-9 items-center justify-center rounded-lg p-0 hover:bg-[#f4f4f4]"
                aria-label="QR Code"
              >
                <Image
                  src="/assets/icons/dashboard/qrcode.svg"
                  alt=""
                  width={24}
                  height={24}
                  className="h-9 w-9 text-[#331400]"
                />
              </button>
              <button
                onClick={() => setIsShareModalOpen(true)}
                className="flex h-9 w-9 items-center justify-center rounded-lg p-0 hover:bg-[#f4f4f4]"
                aria-label="Share"
              >
                <Image
                  src="/assets/icons/dashboard/share.svg"
                  alt=""
                  width={24}
                  height={24}
                  className="h-9 w-9 text-[#331400]"
                />
              </button>
              <Link href="/dashboard/AccountSettings">
            <button className="">
             <Image
                  src="/assets/icons/dashboard/settings-1.svg"
                  alt=""
                  width={24}
                  height={24}
                  className="h-9 w-9 text-[#331400]"
                />
            </button>
          </Link>

              {/* More Button with Dropdown */}
              <div className="relative">
               
                <button
                  className="flex h-9 w-9 items-center justify-center rounded-lg p-0 hover:bg-[#f4f4f4]"
                  onClick={() => setShowMenu(!showMenu)}
                  aria-label="More options"
                >
                  <MoreHorizontalIcon size={20} color="#331400" />
                </button>

                {showMenu && (
                  <>
                    <div
                      className="fixed inset-0 bg-transparent z-40"
                      onClick={() => setShowMenu(false)}
                    />
                    <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-gray-200 backdrop-blur shadow-xl z-50 overflow-hidden">
                      <div className="p-2">
                        {menuItems.map((item) => (
                          <Link
                            key={item.label}
                            href={item.href || "#"}
                            onClick={() => setShowMenu(false)}
                            className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                          >
                            <item.icon size={16} />
                            {item.label}
                          </Link>
                        ))}
                      </div>
                      <div className="border-t border-gray-100 p-2">
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg w-full transition-colors"
                        >
                          <LogOut size={16} />
                          Log Out
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
          <p className="mt-0.5 truncate text-left text-[12px] font-semibold text-gray-600">
            {formatLink(profileLink)}
          </p>
        </div>
      </div>

      {/* DESKTOP QR SECTION */}
      <div className="hidden md:block p-4 sm:p-6 space-y-4 text-gray-800 max-w-[400px] mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 mb-6">
            <button className="cursor-pointer" onClick={() => setIsModalOpen(true)}>
              <Image
                src="/assets/icons/dashboard/qrcode.svg"
                alt="QR Code"
                width={24}
                height={24}
                className="w-12 h-12 text-[#331400]"
              />
            </button>
            <button className="cursor-pointer" onClick={copyToClipboard}>
              <Image
                src="/assets/icons/dashboard/copy.svg"
                alt="copy"
                width={24}
                height={24}
                className="w-12 h-12 text-[#331400]"
              />
            </button>
            <button className="cursor-pointer" onClick={() => setIsShareModalOpen(true)}>
              <Image
                src="/assets/icons/dashboard/share.svg"
                alt="Share"
                width={24}
                height={24}
                className="w-12 h-12 text-[#331400]"
              />
            </button>
            <p className="text-sm text-gray-600 cursor-pointer">
              {formatLink(profileLink)}
            </p>
          </div>
        </div>
      </div>

      {/* ── QR Modal (bottom sheet on mobile, centred on desktop) ── */}
      <ResponsiveSheet isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <QRModalContent />
      </ResponsiveSheet>

      {/* ── Share Modal (bottom sheet on mobile, centred on desktop) ── */}
      <ResponsiveSheet isOpen={isShareModalOpen} onClose={() => setIsShareModalOpen(false)}>
        <ShareModalContent />
      </ResponsiveSheet>
    </>
  );
}