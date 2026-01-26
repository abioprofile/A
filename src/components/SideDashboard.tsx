"use client";

import React, { useState, useRef } from "react";
import Modal from "@/components/ui/modal";
import { toast } from "sonner";
import {
  CopyIcon,
  Share2Icon,
  DownloadIcon,
  QrCodeIcon,
  MoreHorizontalIcon,
  ArrowLeftIcon,
  XIcon,
  MailIcon,
  LinkIcon,
  LucideIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/stores/hooks";
import {
  FaFacebook,
  FaTwitter,
  FaWhatsapp,
  FaInstagram,
  FaPinterest,
  FaTiktok,
  FaYoutube,
  FaSnapchat,
  IconType,
} from "react-icons/fa6";
import { motion, AnimatePresence } from "framer-motion";

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

export default function SideDashboard() {
  const router = useRouter();
  const userData = useAppSelector(
    (state) => state.auth.user
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

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);
  const [showAccountSettings, setShowAccountSettings] =
    useState<boolean>(false);
  const [twoStepEnabled, setTwoStepEnabled] = useState<boolean>(false);

  // Ref for QR code download
  const qrCodeRef = useRef<HTMLDivElement>(null);

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
        // Use native share on mobile
        await navigator.share({
          title: userData?.name || "User",
          text: shareText,
          url: profileLink,
        });
      } else {
        // Open custom share modal for desktop and mobile when native share not available
        setIsShareModalOpen(true);
      }
    } catch (error) {
      // If native share fails or is cancelled, open custom modal
      setIsShareModalOpen(true);
    }
  };

  const handleShare = async (platform: string): Promise<void> => {
    const shareUrls: Record<string, string> = {
      whatsapp: `https://wa.me/?text=${encodeURIComponent(shareText)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        shareText
      )}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        profileLink
      )}&quote=${encodeURIComponent(shareText)}`,
      instagram: `https://www.instagram.com/?url=${encodeURIComponent(
        profileLink
      )}`,
      pinterest: `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(
        profileLink
      )}&description=${encodeURIComponent(shareText)}`,
      tiktok: `https://www.tiktok.com/share?url=${encodeURIComponent(
        profileLink
      )}`,
      email: `mailto:?subject=Check out my Abio profile&body=${encodeURIComponent(
        shareText
      )}`,
      copy: profileLink,
    };

    if (platform === "copy") {
      try {
        await navigator.clipboard.writeText(profileLink);
        toast.success("Profile link copied to clipboard!");
        setIsShareModalOpen(false);
      } catch (err) {
        toast.error("Failed to copy profile link to clipboard!");
      }
    } else if (platform === "email") {
      window.open(shareUrls[platform], "_self");
    } else if (shareUrls[platform]) {
      window.open(shareUrls[platform], "_blank", "noopener,noreferrer");
    }
  };

  // Download QR code as PNG
  const downloadQRCode = async (): Promise<void> => {
    if (qrCodeRef.current === null) {
      return;
    }

    try {
      const dataUrl = await toPng(qrCodeRef.current, {
        backgroundColor: "#ffffff",
        width: 400,
        height: 400,
        style: {
          margin: "0 auto",
        },
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

  const formatLink = (url: string): JSX.Element => {
    return (
      <>
        <span className="text-red-500 font-semibold">{url}</span>
      </>
    );
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

  return (
    <>
      {/* MOBILE TOP BAR */}
      <div className="md:hidden sticky top-0 z-10 bg-[#Fff7de] w-full">
        <div className="px-8 py-3 mb-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-extrabold mb-1 text-[20px]">
               Hi, {userData?.name || "User"}
              </p>
              <p className="text-[12px] font-semibold text-gray-600 truncate">
                {formatLink(profileLink)}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button onClick={() => setIsModalOpen(true)}>
                <QrCodeIcon className="w-6 h-6 text-[#331400]" />
              </button>

              {/* Share - Opens modal on mobile */}
              <button onClick={() => setIsShareModalOpen(true)}>
                <Share2Icon className="w-6 h-6 text-[#331400]" />
              </button>

              {/* Notifications */}
              <button className="relative">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6 text-[#331400]"
                  viewBox="0 0 24 24"
                  fill="fill"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.73 21a2 2 0 01-3.46 0"
                  />
                </svg>

                {/* Notification dot */}
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
              </button>

              {/* More */}
              <button onClick={() => router.push("/dashboard/AccountSettings")}>
                <MoreHorizontalIcon className="w-6 h-6 text-[#331400]" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ================= DESKTOP QR SECTION ================= */}
      <div className="hidden md:block p-4 sm:p-6 space-y-4 text-gray-800 max-w-[400px] mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6 mb-6">
            <button
              className="cursor-pointer"
              onClick={() => setIsModalOpen(true)}
            >
              <QrCodeIcon className="w-6 h-6 text-[#331400]" />
            </button>

            <button className="cursor-pointer" onClick={copyToClipboard}>
              <CopyIcon className="w-6 h-6 text-[#331400]" />
            </button>

            <button
              className="cursor-pointer"
              onClick={() => setIsShareModalOpen(true)}
            >
              <Share2Icon className="w-6 h-6 text-[#331400]" />
            </button>
            <p className="text-sm text-gray-600">{formatLink(profileLink)}</p>
          </div>
        </div>
      </div>

      {/* QR MODAL */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="relative bg-white rounded-2xl p-6 pt-12 text-center w-[320px] mx-auto">
          {/* Title */}
          <h2 className="text-lg font-bold">Here is your code!!!</h2>

          {/* Subtitle */}
          <p className="text-sm text-gray-500 mt-1 mb-4">
            This is your unique code for another person to scan
          </p>

          {/* QR Code with logo in center */}
          <div className="flex justify-center mb-6" ref={qrCodeRef}>
            <div className="relative">
              <QRCodeSVG
                value={profileLink}
                size={160}
                level="H" // High error correction (30%)
                includeMargin={true}
                bgColor="#ffffff"
                fgColor="#000000"
                // renderAs="canvas" // Use canvas for better download quality
              />

              {/* Logo overlay in center */}
            </div>
          </div>

          {/* Profile link below QR */}
          <div className="mb-6 p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500 mb-1">Profile Link</p>
            <p className="text-sm font-medium text-gray-800 truncate">
              {profileLink}
            </p>
          </div>

          {/* Actions */}
          <div className="flex justify-center gap-10">
            {/* Share */}
            <button
              onClick={() => {
                setIsModalOpen(false);
                setIsShareModalOpen(true);
              }}
              className="flex flex-col items-center gap-1 text-xs text-gray-700"
            >
              <div className="w-10 h-10 bg-[#3B1F0E] rounded-lg flex items-center justify-center">
                <Share2Icon className="w-5 h-5 text-white" />
              </div>
              Share
            </button>

            {/* Download */}
            <button
              onClick={downloadQRCode}
              className="flex flex-col items-center gap-1 text-xs text-gray-700"
            >
              <div className="w-10 h-10 bg-[#3B1F0E] rounded-lg flex items-center justify-center">
                <DownloadIcon className="w-5 h-5 text-white" />
              </div>
              Download
            </button>
          </div>
        </div>
      </Modal>

      {/* SHARE MODAL */}
      <AnimatePresence>
        {isShareModalOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
              onClick={() => setIsShareModalOpen(false)}
            />

            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, y: -100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -100 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md px-4"
            >
              <div className="bg-white shadow-2xl h-auto max-h-[85vh] overflow-y-auto ">
                {/* Header */}
                <div className="p-4 md:p-6 border-b border-gray-100 sticky top-0 bg-white z-10 rounded-t-lg">
                  <div className="flex justify-end mb-2">
                    <button
                      onClick={() => setIsShareModalOpen(false)}
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0 ml-2"
                    >
                      <XIcon className="w-5 h-5 text-gray-500" />
                    </button>
                  </div>
                  <div className="flex items-center text-center justify-between">
                    <div className="flex-1">
                      <h2 className="text-xl font-bold mb-2 text-gray-900">
                        Share Your Profile
                      </h2>
                      <p className="text-[14px] text-gray-500 mt-1">
                        Abio is more effective when you <br /> connect with
                        friends!
                      </p>
                    </div>
                  </div>

                  {/* Link Preview */}
                  <div className="mt-4">
                    <p className="text-sm font-bold text-gray-700 mb-2">
                      Share your link
                    </p>
                    <div className="flex items-center gap-2 bg-[#F7F8FD] border border-gray-200 p-3 rounded-lg">
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
                <div className="p-4 md:p-6">
                  <p className="text-sm font-bold text-gray-700 mb-1">
                    Share to
                  </p>
                  <div className="grid grid-cols-4 md:grid-cols-4 gap-3">
                    {sharePlatforms.map(
                      ({ platform, icon: Icon, color, label, bgColor }) => (
                        <button
                          key={platform}
                          onClick={() => handleShare(platform)}
                          className="flex flex-col items-center gap-2 p-2 md:p-3 hover:bg-gray-50 rounded-xl transition-colors group"
                        >
                          <div
                            className={`w-10 h-10 md:w-12 md:h-12 rounded-full ${bgColor} flex items-center justify-center group-hover:scale-105 transition-transform`}
                          >
                            <Icon
                              className={`w-5 h-5 md:w-6 md-h-6 ${color}`}
                            />
                          </div>
                          <span className="text-xs font-medium text-gray-700 text-center line-clamp-2">
                            {label}
                          </span>
                        </button>
                      )
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
