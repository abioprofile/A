'use client';

import React, { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FiSearch, FiShoppingCart } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";
import { products } from "@/lib/products";
import { useCart } from "@/context/CartContext";
import MobileBottomNav from "@/components/MobileBottomNav";
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

interface UserProfile {
  username?: string;
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

const StorePage = () => {
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

  const [searchQuery, setSearchQuery] = useState("");
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const { cart } = useCart();

  const toggleFav = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
    <div className="min-h-screen bg-[#F5EDE0] p-4  md:pb-10 md:p-10">
      <div className="max-w-6xl mx-auto">

        {/* Mobile: Analytics-style header (avatar + QR, Share, Settings, More) */}
        <div className="md:hidden flex justify-between items-center px-2 py-3 mb-4">
          <div className="w-[52px] h-[52px] overflow-hidden bg-gray-300 rounded-full shrink-0">
            <div className="bg-gradient-to-br from-[#ff006e] to-[#8338ec] w-full h-full flex items-center justify-center text-white text-xl font-bold">
              👤
            </div>
          </div>
          <div className="flex gap-1 items-center text-gray-900">
            <button onClick={() => setIsModalOpen(true)} className="flex h-9 w-9 items-center justify-center rounded-lg p-0 hover:bg-[#f4f4f4]" aria-label="QR Code">
              <Image src="/assets/icons/dashboard/qrcode.svg" alt="" width={24} height={24} className="h-9 w-9 text-[#331400]" />
            </button>
            <button onClick={() => setIsShareModalOpen(true)} className="flex h-9 w-9 items-center justify-center rounded-lg p-0 hover:bg-[#f4f4f4]" aria-label="Share">
              <Image src="/assets/icons/dashboard/share.svg" alt="" width={24} height={24} className="h-9 w-9 text-[#331400]" />
            </button>
            <Link href="/dashboard/AccountSettings">
              <button type="button" className="flex h-9 w-9 items-center justify-center rounded-lg p-0 hover:bg-[#f4f4f4]">
                <Image src="/assets/icons/dashboard/settings-1.svg" alt="" width={24} height={24} className="h-9 w-9 text-[#331400]" />
              </button>
            </Link>
            <div className="relative">
              <button className="flex h-9 w-9 items-center justify-center rounded-lg p-0 hover:bg-[#f4f4f4]" onClick={() => setShowMenu(!showMenu)} aria-label="More options">
                <MoreHorizontalIcon size={20} color="#331400" />
              </button>
              {showMenu && (
                <>
                  <div className="fixed inset-0 bg-transparent z-40" onClick={() => setShowMenu(false)} />
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-gray-200 backdrop-blur shadow-xl z-50 overflow-hidden rounded-lg">
                    <div className="p-2">
                      {menuItems.map((item) => (
                        <Link key={item.label} href={item.href || "#"} onClick={() => setShowMenu(false)} className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                          <item.icon size={16} />
                          {item.label}
                        </Link>
                      ))}
                    </div>
                    <div className="border-t border-gray-100 p-2">
                      <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg w-full transition-colors">
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

        {/* Header: All Products + Search + Cart (unchanged layout) */}
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-2xl md:text-3xl font-bold text-black">All Products</h1>
          <div className="flex items-center gap-2 md:gap-4">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm" />
              <input
                type="text"
                placeholder="Search products..."
                className="pl-9 pr-4 py-2 border border-gray-300 bg-white text-[12px] w-40 md:w-52 outline-none focus:border-gray-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button
              className="relative p-2 hover:bg-gray-100 "
              onClick={() => router.push("/dashboard/store/cart")}
              aria-label="View Cart"
            >
              <FiShoppingCart className="text-xl" />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-purple-600 text-white text-xs h-5 w-5 flex items-center justify-center rounded-full">
                  {cart.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 justify-items-center">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="relative bg-white w-full max-w-[480px] overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300  md:rounded-none flex flex-row md:flex-col"
            >
              {/* Card-level favorite (mobile: top-right of card) */}
              <button
                onClick={(e) => toggleFav(product.id, e)}
                className="md:hidden absolute top-2 right-2 z-20 bg-white rounded-full h-8 w-8 flex items-center justify-center shadow-md hover:scale-110 transition-transform"
                aria-label="Favourite"
              >
                <FaHeart
                  className={`text-sm ${favorites[product.id] ? "text-red-500" : "text-gray-300"}`}
                />
              </button>

              {/* Image Area */}
              <div
                className="relative bg-[#F6F6F6] w-[45%] md:w-full flex-shrink-0 h-[180px] md:h-[360px] cursor-pointer overflow-hidden  md:rounded-none"
                onClick={() => router.push(`/dashboard/product/${product.id}`)}
              >
                <Image
                  src={product.defaultImage}
                  alt={product.name}
                  fill
                  className="object-contain p-3 md:p-4 hover:scale-105 transition-transform duration-300"
                />
                {/* Image-level Heart */}
                <button
                  onClick={(e) => toggleFav(product.id, e)}
                  className="absolute top-2 right-2 bg-white rounded-full h-8 w-8 hidden md:flex items-center justify-center shadow-md z-10 hover:scale-110 transition-transform"
                  aria-label="Favourite"
                >
                  <FaHeart
                    className={`text-sm ${favorites[product.id] ? "text-red-500" : "text-gray-300"}`}
                  />
                </button>
              </div>

              {/* Card Body */}
              <div className="relative w-[55%] md:w-full flex flex-col justify-between p-3 md:p-5 min-w-0">
                <div>
                  {/* Name + Colors row (desktop: same row; mobile: name only in this block) */}
                  <div className="flex justify-between items-start gap-4 mb-1 md:flex-row flex-col">
                    <h2 className="text-[14px] md:text-[20px] font-bold text-black pr-8 md:pr-0 leading-tight">
                      {product.name}
                    </h2>
                    {product.colors && (
                      <div className="text-right shrink-0 md:block hidden">
                        <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-1">
                          Available Colors
                        </p>
                        <div className="flex gap-1.5 justify-end">
                          {product.colors.map((color) => (
                            <button
                              key={color.code}
                              onClick={(e) => {
                                e.stopPropagation();
                                router.push(
                                  `/dashboard/product/${product.id}?color=${encodeURIComponent(color.code)}`
                                );
                              }}
                              className={`w-5 h-5 border-2 hover:scale-110 transition-transform ${
                                color.code === "#FFFFFF" ? "border-gray-300" : "border-transparent"
                              }`}
                              style={{ backgroundColor: color.code }}
                              title={color.name}
                              aria-label={`Select ${color.name} color`}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  <p className="text-[12px] md:text-[13px] text-gray-400 font-light mt-0.5 mb-1 md:mb-3 line-clamp-2">
                    {product.description}
                  </p>
                  <p className="text-[12px] md:text-[20px] font-bold text-black">
                    ₦{product.basePrice.toLocaleString()}
                  </p>
                </div>
                <div className="mt-2 md:mt-4">
                  {product.colors && (
                    <div className="mb-2 md:hidden">
                      <div className="flex gap-1.5 flex-wrap">
                        {product.colors.map((color) => (
                          <button
                            key={color.code}
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push(
                                `/dashboard/product/${product.id}?color=${encodeURIComponent(color.code)}`
                              );
                            }}
                            className={`w-4 h-4 border-2 hover:scale-110 transition-transform flex-shrink-0  ${
                              color.code === "#FFFFFF" ? "border-gray-300" : "border-transparent"
                            }`}
                            style={{ backgroundColor: color.code }}
                            title={color.name}
                            aria-label={`Select ${color.name} color`}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                  <button
                    onClick={() => router.push(`/dashboard/product/${product.id}`)}
                    className="w-full mt-2 md:mt-4 bg-[#FED45C] text-black font-bold text-[13px] md:text-[15px] py-2.5 md:py-3 hover:bg-[#d4af3a] active:opacity-80 transition-colors shadow-[3px_3px_0_#1a1a1a] "
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>

    <ResponsiveSheet isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
      <QRModalContent />
    </ResponsiveSheet>
    <ResponsiveSheet isOpen={isShareModalOpen} onClose={() => setIsShareModalOpen(false)}>
      <ShareModalContent />
    </ResponsiveSheet>

    <div className="md:hidden">
      <MobileBottomNav />
    </div>
    </>
  );
};

export default StorePage;