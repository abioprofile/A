"use client";
import { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import MobileBottomNav from "@/components/MobileBottomNav";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { clearAuth } from "@/stores/slices/auth.slice";
import { useQueryClient } from "@tanstack/react-query";
import {
  CopyIcon,
  Share,
  DownloadIcon,
  XIcon,
  MoreHorizontalIcon,
  LogOut,
  CreditCard,
} from "lucide-react";
import {
  FaFacebook,
  FaXTwitter,
  FaWhatsapp,
  FaInstagram,
  FaPinterest,
} from "react-icons/fa6";
import type { IconType } from "react-icons";
import { QRCodeSVG } from "qrcode.react";
import { toPng } from "html-to-image";

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <circle cx="12" cy="12" r="4"/>
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
  </svg>
);

const BehanceIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M7.5 11.5c1.4 0 2.5-.9 2.5-2.2C10 7.9 9 7 7.6 7H3v10h4.8c1.6 0 2.8-1.1 2.8-2.7 0-1.4-1-2.6-2.6-2.8zM5 9h2.3c.7 0 1.1.4 1.1 1s-.4 1-1.1 1H5V9zm2.4 6H5v-2.2h2.4c.8 0 1.3.4 1.3 1.1 0 .7-.5 1.1-1.3 1.1zM15.5 8c-2.5 0-4.5 1.9-4.5 4.5s1.9 4.5 4.5 4.5c1.9 0 3.4-1 4.1-2.5h-2c-.4.6-1.1.9-2 .9-1.2 0-2.1-.7-2.4-1.9H20v-.7c-.1-2.7-1.9-4.8-4.5-4.8zm-2.3 3.6c.3-1 1.2-1.6 2.2-1.6s1.9.6 2.2 1.6h-4.4zM14 6h4v1h-4V6z"/>
  </svg>
);

const SnapchatIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M12 2C9.2 2 7 4 7 6.8v.4c-.5.2-1.3.3-1.8.3-.3 0-.5.2-.5.5s.2.5.5.6c.8.2 1.4.8 1.7 1.5-1.2.5-2 1.3-2 1.8 0 .3.2.5.5.5.3 0 .8-.1 1.5-.3.1.3.2.7.5 1-.5.2-.9.5-.9.9 0 .3.2.5.5.7 1.2.5 2.1 1.4 2.3 2.3.1.4.4.6.7.6.2 0 .4-.1.6-.1.4-.1.8-.2 1.4-.2s1 .1 1.4.2c.2 0 .4.1.6.1.3 0 .6-.2.7-.6.2-.9 1.1-1.8 2.3-2.3.3-.2.5-.4.5-.7 0-.4-.4-.7-.9-.9.3-.3.4-.7.5-1 .7.2 1.2.3 1.5.3.3 0 .5-.2.5-.5 0-.5-.8-1.3-2-1.8.3-.7.9-1.3 1.7-1.5.3-.1.5-.3.5-.6s-.2-.5-.5-.5c-.5 0-1.3-.1-1.8-.3v-.4C17 4 14.8 2 12 2z"/>
  </svg>
);

const XLogoIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const QRIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
    <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
    <rect x="3" y="14" width="7" height="7"/>
    <rect x="5" y="5" width="3" height="3" fill="currentColor" stroke="none"/>
    <rect x="16" y="5" width="3" height="3" fill="currentColor" stroke="none"/>
    <rect x="5" y="16" width="3" height="3" fill="currentColor" stroke="none"/>
    <path d="M14 14h3v3h-3zM17 17h3v3h-3zM14 20h3"/>
  </svg>
);

const ShareIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
    <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13"/>
  </svg>
);

const BellIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
    <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6V11c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/>
  </svg>
);

const DotsIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
    <circle cx="5" cy="12" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="19" cy="12" r="2"/>
  </svg>
);

const EyeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);

const ClickIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
    <path d="M9 9l3-3 3 3M12 6v12M6 18l3-3 3 3"/>
  </svg>
);

const BarIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
    <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/>
    <line x1="6" y1="20" x2="6" y2="14"/>
  </svg>
);

const HelpIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
    <circle cx="12" cy="12" r="10"/>
    <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/>
    <line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
);

const LockIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-16 h-16">
    <path d="M18 8h-1V6A5 5 0 007 6v2H6a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V10a2 2 0 00-2-2zm-6 9a2 2 0 110-4 2 2 0 010 4zm3.1-9H8.9V6a3.1 3.1 0 016.2 0v2z"/>
  </svg>
);

// Bottom Nav Icons
const LinksNavIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
    <rect x="2" y="7" width="20" height="4" rx="1"/>
    <rect x="2" y="13" width="20" height="4" rx="1"/>
  </svg>
);

const AppearanceNavIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
    <path d="M20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.84 1.83 3.75 3.75 1.84-1.83zM3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25z"/>
  </svg>
);

const AnalyticsNavIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
    <path d="M5 9.5h2v9H5zM11 6.5h2v12h-2zM17 12.5h2v6h-2z"/>
  </svg>
);

const StoreNavIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
    <path d="M20 4H4v2l16 .01V4zM4 20h16v-2H4v2zm16-8H4v-2h16v2zm-7-2H4v-2h9v2z"/>
    <path d="M2 6l1-3h18l1 3H2zm2 14h16v-2H4v2zM3 9h18v10H3z"/>
  </svg>
);

interface UserProfile {
  username?: string;
  avatarUrl?: string | null;
}
interface UserData {
  name?: string;
  profile?: UserProfile;
}
interface SharePlatform {
  platform: string;
  icon: IconType;
  color: string;
  label: string;
  bgColor: string;
}

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
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/20 md:backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed bottom-0 left-0 right-0 z-[999] bg-white shadow-2xl md:hidden"
          >
            {children}
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="hidden md:flex fixed top-1/2 left-1/2 z-50 -translate-x-1/2 -translate-y-1/2 w-full max-w-md px-4"
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

const LINK_STATS = [
  { name: "Instagram", Icon: InstagramIcon, views: "1k", clicks: "1k", clickRate: "10%" },
  { name: "Behance", Icon: BehanceIcon, views: "1k", clicks: "1k", clickRate: "10%" },
  { name: "add on snapchat", Icon: SnapchatIcon, views: "1k", clicks: "1k", clickRate: "10%" },
  { name: "X", Icon: XLogoIcon, views: "1k", clicks: "1k", clickRate: "10%" },
];

const NFC_STATS = [
  { name: "Business Card", location: "Card 1", scans: "2.5k", taps: "1.2k", rate: "48%" },
  { name: "Poster", location: "Event A", scans: "1.8k", taps: "900", rate: "50%" },
  { name: "Sticker", location: "Pack", scans: "800", taps: "400", rate: "50%" },
  { name: "Standee", location: "Booth", scans: "1.2k", taps: "600", rate: "50%" },
];

export default function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState("analytics");
  const router = useRouter();
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const userData = useAppSelector((state) => state.auth.user) as UserData | null;

  const getProfileLink = (): string => {
    if (typeof window === "undefined") return "/profile";
    const origin = window.location.origin;
    return userData?.profile?.username ? `${origin}/${userData.profile.username}` : `${origin}/profile`;
  };
  const profileLink = getProfileLink();
  const shareText = `Check out my Abio profile! ${profileLink}`;

  const [showMenu, setShowMenu] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const qrCodeRef = useRef<HTMLDivElement>(null);

  const menuItems: { icon: typeof CreditCard; label: string; href?: string }[] = [
    { icon: CreditCard, label: "Billing", href: "/dashboard/Billing" },
  ];

  const sharePlatforms: SharePlatform[] = [
    { platform: "whatsapp", icon: FaWhatsapp, color: "text-green-600", label: "WhatsApp", bgColor: "bg-green-50" },
    { platform: "facebook", icon: FaFacebook, color: "text-blue-600", label: "Facebook", bgColor: "bg-blue-50" },
    { platform: "instagram", icon: FaInstagram, color: "text-pink-600", label: "Instagram", bgColor: "bg-pink-50" },
    { platform: "pinterest", icon: FaPinterest, color: "text-red-600", label: "Pinterest", bgColor: "bg-red-50" },
  ];

  const handleLogout = () => {
    dispatch(clearAuth());
    queryClient.clear();
    setShowMenu(false);
    toast.success("Logged out successfully");
    router.push("/auth/sign-in");
  };

  const handleShare = async (platform: string): Promise<void> => {
    const shareUrls: Record<string, string> = {
      whatsapp: `https://wa.me/?text=${encodeURIComponent(shareText)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(profileLink)}&quote=${encodeURIComponent(shareText)}`,
      instagram: `https://www.instagram.com/?url=${encodeURIComponent(profileLink)}`,
      pinterest: `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(profileLink)}&description=${encodeURIComponent(shareText)}`,
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
    } else if (shareUrls[platform]) {
      window.open(shareUrls[platform], "_blank", "noopener,noreferrer");
    }
  };

  const downloadQRCode = async (): Promise<void> => {
    if (!qrCodeRef.current) return;
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
    } catch (e) {
      console.error(e);
      toast.error("Failed to download QR code");
    }
  };

  const QRModalContent = () => (
    <div className="relative text-center w-full z-[999] p-2 md:p-6">
      <div className="flex justify-end mb-2">
        <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <XIcon className="w-5 h-5 text-gray-500" />
        </button>
      </div>
      <h2 className="text-[20px] md:text-[24px] font-semibold">Here is your code!!!</h2>
      <p className="text-[12px] md:text-sm text-gray-500 mt-1 mb-2">This is your unique code for another <br /> person to scan</p>
      <div className="flex justify-center mb-2" ref={qrCodeRef}>
        <QRCodeSVG value={profileLink} size={160} level="H" includeMargin bgColor="#ffffff" fgColor="#000000" />
      </div>
      <div className="flex justify-center gap-4 pb-2">
        <button onClick={() => { setIsModalOpen(false); setIsShareModalOpen(true); }} className="flex flex-col items-center gap-1 text-xs text-gray-700">
          <div className="w-10 h-10 bg-[#3B1F0E] flex items-center justify-center"><Share className="w-5 h-5 text-white" /></div>
          Share
        </button>
        <button onClick={downloadQRCode} className="flex flex-col items-center gap-1 text-xs text-gray-700">
          <div className="w-10 h-10 bg-[#3B1F0E] flex items-center justify-center"><DownloadIcon className="w-5 h-5 text-white" /></div>
          Download
        </button>
      </div>
    </div>
  );

  const ShareModalContent = () => (
    <div className="w-full">
      <div className="p-4 md:p-6 border-b border-gray-100 bg-white md:rounded-t-2xl">
        <div className="flex justify-end mb-2">
          <button onClick={() => setIsShareModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <XIcon className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <div className="text-center">
          <h2 className="text-[20px] md:text-[24px] font-bold mb-2 text-gray-900">Share Your Profile</h2>
          <p className="text-[12px] md:text-sm text-gray-500 mt-1">Abio is more effective when you <br /> connect with friends!</p>
        </div>
        <div className="mt-4">
          <p className="text-sm font-bold text-gray-700 mb-2">Share your link</p>
          <div className="flex items-center gap-2 bg-[#F7F8FD] border border-gray-200 p-3">
            <input readOnly value={profileLink} className="bg-transparent w-full text-sm text-gray-800 outline-none truncate" />
            <button onClick={() => handleShare("copy")} className="flex-shrink-0 p-1 hover:bg-gray-200 transition-colors rounded" title="Copy link">
              <CopyIcon className="w-4 h-4 text-red-600" />
            </button>
          </div>
        </div>
      </div>
      <div className="p-4 md:p-6 bg-white md:rounded-b-2xl">
        <p className="text-sm font-bold text-gray-700 mb-3">Share to</p>
        <div className="grid grid-cols-4 gap-3 pb-2">
          {sharePlatforms.map(({ platform, icon: Icon, color, label, bgColor }) => (
            <button key={platform} onClick={() => handleShare(platform)} className="flex flex-col items-center gap-2 p-2 md:p-3 hover:bg-gray-50 rounded-xl transition-colors group">
              <div className={`w-10 h-10 md:w-12 md:h-12 ${bgColor} flex items-center justify-center group-hover:scale-105 transition-transform`}>
                <Icon className={`w-5 h-5 md:w-6 md:h-6 ${color}`} />
              </div>
              <span className="text-xs font-medium text-gray-700 text-center line-clamp-2">{label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="bg-[#FEF4EA] min-h-screen font-sans max-w-[390px] md:max-w-full mx-auto relative pb-[90px] md:pt-14">
        {/* Header */}
        <div className="md:hidden flex justify-between items-center px-5 py-3 md:px-10 md:py-5">
          <div className="w-[52px] h-[52px] overflow-hidden  bg-gray-300 flex-shrink-0">
            {userData?.profile?.avatarUrl ? (
              <Image
                src={userData.profile.avatarUrl}
                alt="Profile"
                width={52}
                height={52}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="bg-gradient-to-br from-[#ff006e] to-[#8338ec] w-full h-full flex items-center justify-center text-white text-xl font-bold">
                👤
              </div>
            )}
          </div>
          <div className="flex gap-[2px] items-center text-gray-900">
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex h-9 w-9 items-center justify-center rounded-lg p-0 hover:bg-[#f4f4f4]"
              aria-label="QR Code"
            >
              <Image src="/assets/icons/dashboard/qrcode.svg" alt="" width={24} height={24} className="h-9 w-9 text-[#331400]" />
            </button>
            <button
              onClick={() => setIsShareModalOpen(true)}
              className="flex h-9 w-9 items-center justify-center rounded-lg p-0 hover:bg-[#f4f4f4]"
              aria-label="Share"
            >
              <Image src="/assets/icons/dashboard/share.svg" alt="" width={24} height={24} className="h-9 w-9 text-[#331400]" />
            </button>
            <Link href="/dashboard/AccountSettings">
              <button type="button" className="flex h-9 w-9 items-center justify-center rounded-lg p-0 hover:bg-[#f4f4f4]">
                <Image src="/assets/icons/dashboard/settings-1.svg" alt="" width={24} height={24} className="h-9 w-9 text-[#331400]" />
              </button>
            </Link>
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
                  <div className="fixed inset-0 bg-transparent z-40" onClick={() => setShowMenu(false)} />
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

        {/* Tab Switcher */}
        <div className="mx-4 mb-8 flex border-1 border-black/25 overflow-hidden bg-white md:mx-auto md:max-w-[500px]">
          <button
            onClick={() => setActiveTab("analytics")}
            className={`flex-1 py-2 text-[12px] md:text-sm font-medium transition-all duration-200 ${
              activeTab === "analytics"
                ? "bg-[#331400]   text-white shadow-[inset_3px_3px_0_rgba(0,0,0,0.4)]"
                : "bg-white text-gray-900"
            }`}
          >
            Analytics
          </button>
          <div className="w-px bg-black/15" />
          <button
            onClick={() => setActiveTab("nfc")}
            className={`flex-1 py-2 text-[12px] md:text-sm  font-medium transition-all duration-200 ${
              activeTab === "nfc"
                ? "bg-[#331400] text-white shadow-[inset_3px_3px_0_rgba(0,0,0,0.4)]"
                : "bg-white text-gray-900"
            }`}
          >
            NFC Analytics
          </button>
        </div>

        {/* Analytics Tab */}
        {activeTab === "analytics" && (
          <div className="px-4 flex flex-col gap-4 md:gap-8 md:px-10 md:max-w-[800px] md:mx-auto md:pb-10">
            {/* Lifetime Card */}
            <div className="bg-white overflow-hidden shadow-[0_1px_4px_rgba(0,0,0,0.06)] md:flex md:flex-row md:items-stretch md:p-0">
              {/* Stats section */}
              <div className="p-5 md:flex-1 md:p-8">
                <div className="flex items-center gap-1.5 mb-3.5">
                  <span className="text-lg font-bold">Lifetime</span>
                  <span className="text-black/45 flex">
                    <HelpIcon />
                  </span>
                </div>

                {/* Stats rows */}
                <div className="flex flex-col gap-2.5 mb-5 md:flex-row md:gap-8">
                  <div className="flex gap-6 flex-wrap">
                    <div className="flex items-center gap-2">
                      <div className="bg-[#ede9fe]  p-1 flex text-[#7c3aed]">
                        <EyeIcon />
                      </div>
                      <span className="text-sm">
                        <strong className="text-[#7c3aed]">4000</strong>{" "}
                        <span className="text-gray-900">Views</span>
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="bg-[#ede9fe]  p-1 flex text-[#7c3aed]">
                        <ClickIcon />
                      </div>
                      <span className="text-sm">
                        <strong className="text-[#7c3aed]">4000</strong>{" "}
                        <span className="text-gray-900">Overall click</span>
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="bg-[#ede9fe] p-1 flex text-[#7c3aed]">
                      <BarIcon />
                    </div>
                    <span className="text-sm">
                      <strong className="text-[#7c3aed]">40%</strong>{" "}
                      <span className="text-gray-900">Click Rate</span>
                    </span>
                  </div>
                </div>

                {/* Mobile wave */}
                {/* <div className="h-[60px] opacity-[0.08] -mx-5 md:hidden">
                  <svg viewBox="0 0 400 60" className="w-full h-full" preserveAspectRatio="none">
                    <path fill="#1a1a1a" d="M0 60 Q60 20 120 35 Q180 50 240 25 Q300 5 360 30 L400 20 L400 60 Z" />
                    <path fill="#1a1a1a" d="M0 60 Q80 25 160 40 Q240 55 320 30 Q360 15 400 35 L400 60 Z" opacity="0.7" />
                  </svg>
                </div> */}
              </div>

              {/* Desktop chart panel */}
              <div className="hidden md:block w-[220px] flex-shrink-0 relative overflow-hidden bg-gradient-to-br from-[#ede9fe] to-[#c4b5fd30]">
                <svg viewBox="0 0 220 120" className="w-full h-full absolute inset-0" preserveAspectRatio="none">
                  <path fill="#c4b5fd" opacity="0.35" d="M0 120 Q40 70 80 85 Q120 100 160 55 Q190 28 220 60 L220 120 Z" />
                  <path fill="#a78bfa" opacity="0.25" d="M0 120 Q55 45 110 65 Q165 85 220 38 L220 120 Z" />
                  <path fill="none" stroke="#7c3aed" strokeWidth="2" opacity="0.7"
                    d="M0 90 Q40 68 80 80 Q120 95 160 50 Q190 26 220 58" />
                  <path fill="none" stroke="#f0abfc" strokeWidth="2" opacity="0.55"
                    d="M0 100 Q55 52 110 68 Q165 82 220 36" />
                </svg>
              </div>
            </div>

            {/* Audience / Link Performance Card */}
            <div className="bg-white overflow-hidden shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
              <div className="px-5 py-5 pb-3 border-b border-black/6">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="text-lg font-bold">Audience</span>
                  <span className="text-black/45 flex">
                    <HelpIcon />
                  </span>
                </div>
                <p className="text-sm font-semibold text-gray-900 m-0">Link Performance</p>
              </div>

              <table className="w-full border-collapse text-xs md:text-sm">
                <thead>
                  <tr className="border-b border-black/8 bg-black/2">
                    <th className="text-left px-5 py-2.5 font-semibold text-gray-900">Link Name</th>
                    <th className="text-left px-2 py-2.5 font-semibold text-gray-900">Views</th>
                    <th className="text-left px-2 py-2.5 font-semibold text-gray-900">Clicks</th>
                    <th className="text-left px-5 py-2.5 pl-2 font-semibold text-gray-900">Click Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {LINK_STATS.map((row, i) => (
                    <tr key={row.name} className={i < LINK_STATS.length - 1 ? "border-b border-black/5" : ""}>
                      <td className="px-5 py-5 flex items-center gap-2.5 text-gray-900">
                        <row.Icon />
                        <span className="text-xs md:text-sm">{row.name}</span>
                      </td>
                      <td className="px-2 py-3.5 text-gray-900">{row.views}</td>
                      <td className="px-2 py-3.5 text-gray-900">{row.clicks}</td>
                      <td className="px-5 py-3.5 pl-2 font-semibold text-red-500">{row.clickRate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* NFC Analytics Tab - Locked */}
        {activeTab === "nfc" && (
          <div className="px-4 relative md:px-10 md:max-w-[800px] md:mx-auto">
            {/* Blurred background content */}
            <div className="filter blur-[6px] select-none pointer-events-none">
              {/* NFC Lifetime Card */}
              <div className="bg-white  p-5 pt-5 overflow-hidden mb-4">
                <div className="flex items-center gap-1.5 mb-3.5">
                  <span className="text-lg font-bold">NFC Lifetime</span>
                  <span className="text-black/45 flex">
                    <HelpIcon />
                  </span>
                </div>
                <div className="flex flex-col gap-2.5 mb-5">
                  <div className="flex gap-6">
                    <div className="flex items-center gap-2">
                      <div className="bg-[#ede9fe]  p-1 flex text-[#7c3aed]">
                        <EyeIcon />
                      </div>
                      <span className="text-sm">
                        <strong className="text-[#7c3aed]">6.3k</strong> <span>Scans</span>
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="bg-[#ede9fe]  p-1 flex text-[#7c3aed]">
                        <ClickIcon />
                      </div>
                      <span className="text-sm">
                        <strong className="text-[#7c3aed]">3.1k</strong> <span>NFC Taps</span>
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="bg-[#ede9fe]  p-1 flex text-[#7c3aed]">
                      <BarIcon />
                    </div>
                    <span className="text-sm">
                      <strong className="text-[#7c3aed]">49%</strong> <span>Tap Rate</span>
                    </span>
                  </div>
                </div>
                <div className="h-[60px] opacity-[0.08]">
                  <svg viewBox="0 0 400 60" className="w-full h-full" preserveAspectRatio="none">
                    <path fill="#1a1a1a" d="M0 60 Q60 20 120 35 Q180 50 240 25 Q300 5 360 30 L400 20 L400 60 Z" />
                  </svg>
                </div>
              </div>

              {/* NFC Performance Table */}
              <div className="bg-white  overflow-hidden">
                <div className="px-5 py-5 pb-3 border-b border-black/6">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-lg font-bold">NFC Touchpoints</span>
                    <span className="text-black/45 flex">
                      <HelpIcon />
                    </span>
                  </div>
                  <p className="text-sm font-semibold m-0">Performance by location</p>
                </div>
                <table className="w-full border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-black/8 bg-black/2">
                      <th className="text-left px-4 py-2.5 font-semibold">Touchpoint</th>
                      <th className="text-left px-2 py-2.5 font-semibold">Location</th>
                      <th className="text-left px-2 py-2.5 font-semibold">Scans</th>
                      <th className="text-left px-2 py-2.5 font-semibold">Taps</th>
                      <th className="text-left px-4 py-2.5 pl-2 font-semibold">Tap Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {NFC_STATS.map((row, i) => (
                      <tr key={row.name} className={i < NFC_STATS.length - 1 ? "border-b border-black/5" : ""}>
                        <td className="px-4 py-3 font-medium">{row.name}</td>
                        <td className="px-2 py-3">{row.location}</td>
                        <td className="px-2 py-3">{row.scans}</td>
                        <td className="px-2 py-3">{row.taps}</td>
                        <td className="px-4 py-3 pl-2 font-semibold text-red-500">{row.rate}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Lock overlay */}
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/45">
              <div className="flex flex-col items-center gap-3 md:gap-4 md:p-16">
                <div className="text-[#331400]">
                  <LockIcon />
                </div>
                <p className="text-2xl font-bold m-0 text-gray-900 md:text-[22px]">Locked</p>
                <button className="bg-[#a78bfa] text-white border-none  px-10 py-2.5 text-sm font-semibold cursor-pointer shadow-[0_2px_8px_rgba(167,139,250,0.4)]">
                  Unlock
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Navigation */}
        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[390px] bg-white border-t border-black/10 flex py-2 pb-5 md:hidden">
          <MobileBottomNav />
        </div>
      </div>

      {/* QR Modal (bottom sheet on mobile, centred on desktop) */}
      <ResponsiveSheet isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <QRModalContent />
      </ResponsiveSheet>

      {/* Share Modal (bottom sheet on mobile, centred on desktop) */}
      <ResponsiveSheet isOpen={isShareModalOpen} onClose={() => setIsShareModalOpen(false)}>
        <ShareModalContent />
      </ResponsiveSheet>
    </>
  );
}