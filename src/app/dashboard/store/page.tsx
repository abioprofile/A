"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { FiSearch, FiShoppingCart } from "react-icons/fi";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { products } from "@/lib/products";
import { useCart } from "@/context/CartContext";
import MobileBottomNav from "@/components/MobileBottomNav";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { clearAuth } from "@/stores/slices/auth.slice";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import {
  CopyIcon,
  Share,
  DownloadIcon,
  XIcon,
  MoreHorizontalIcon,
  LogOut,
  CreditCard,
  ChevronLeft,
  ChevronRight,
  ShoppingBagIcon,
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

/* ─── Types ──────────────────────────────────────────────────── */
interface ProductColor {
  code: string;
  name: string;
  mainImage: string;
  gallery: string[];
}

interface Product {
  id: string;
  name: string;
  tagline?: string;
  description?: string;
  price?: number;
  basePrice?: number;
  defaultImage: string;
  defaultGallery?: string[];
  colors?: ProductColor[];
  features?: string[];
  badge?: string;
}

interface UserProfile {
  username?: string;
  avatarUrl?: string;
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

/* ─── Helper Functions ──────────────────────────────────────────────────── */
function getGallery(product: Product, variantIdx: number): string[] {
  if (product.colors?.[variantIdx]) return product.colors[variantIdx].gallery;
  return product.defaultGallery ?? [product.defaultImage];
}

function getActiveImage(
  product: Product,
  variantIdx: number,
  imgIdx: number,
): string {
  return getGallery(product, variantIdx)[imgIdx] ?? product.defaultImage;
}

/* ─── Animated counter ─────────────────────────────────────────────────────────── */
function Counter({ value, prefix = "" }: { value: number; prefix?: string }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = Math.ceil(value / 40);
    const t = setInterval(() => {
      start += step;
      if (start >= value) {
        setDisplay(value);
        clearInterval(t);
      } else setDisplay(Math.min(start, 95));
    }, 18);
    return () => clearInterval(t);
  }, [value]);
  return (
    <>
      {prefix}
      {display.toLocaleString()}
    </>
  );
}

/* ─── Scan line  */
function ScanLine() {
  return (
    <motion.div
      className="absolute left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#FED45C]/60 to-transparent pointer-events-none z-10"
      initial={{ top: "0%" }}
      animate={{ top: ["0%", "100%", "0%"] }}
      transition={{
        duration: 3.5,
        ease: "linear",
        repeat: Infinity,
        repeatDelay: 1.5,
      }}
    />
  );
}

/*  Corner brackets  */
function Brackets({
  size = 12,
  color = "#FED45C",
  opacity = 0.6,
}: {
  size?: number;
  color?: string;
  opacity?: number;
}) {
  const s = `${size}px`;
  const style: React.CSSProperties = {
    position: "absolute",
    width: s,
    height: s,
    opacity,
  };
  return (
    <>
      <span
        style={{
          ...style,
          top: 0,
          left: 0,
          borderTop: `2px solid ${color}`,
          borderLeft: `2px solid ${color}`,
        }}
      />
      <span
        style={{
          ...style,
          top: 0,
          right: 0,
          borderTop: `2px solid ${color}`,
          borderRight: `2px solid ${color}`,
        }}
      />
      <span
        style={{
          ...style,
          bottom: 0,
          left: 0,
          borderBottom: `2px solid ${color}`,
          borderLeft: `2px solid ${color}`,
        }}
      />
      <span
        style={{
          ...style,
          bottom: 0,
          right: 0,
          borderBottom: `2px solid ${color}`,
          borderRight: `2px solid ${color}`,
        }}
      />
    </>
  );
}

/*  Image skeleton  */
function ImageSkeleton() {
  return (
    <div className="absolute inset-0 bg-[#331400]/5 overflow-hidden">
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent"
        animate={{ x: ["-100%", "100%"] }}
        transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
}

// Replace the ProductCard component with this updated version:

function ProductCard({
  product,
  onClick,
}: {
  product: any;
  onClick: () => void;
}) {
  // Handle both price and basePrice
  const originalPrice = product.price || product.basePrice || 0;
  const discount = Math.round(originalPrice * 0.15);
  const discountedPrice = originalPrice - discount;

  return (
    <motion.div
      layoutId={`product-card-${product.id}`}
      onClick={onClick}
      className="group cursor-pointer bg-white border border-[#331400]/10 hover:shadow-xl transition-all duration-300 overflow-hidden"
      whileHover={{ y: -4 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Image Container */}
      <div
        className="relative bg-[#FAFAFC] overflow-hidden"
        style={{ aspectRatio: "1/1" }}
      >
        <Image
          src={product.defaultImage}
          alt={product.name}
          fill
          className="object-contain p-6 group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
        {product.badge && (
          <span className="absolute top-3 left-3 text-[8px] font-black bg-[#FED45C] text-[#331400] px-2 py-1 z-10">
            {product.badge}
          </span>
        )}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
      </div>

      {/* Content */}
      <div className="p-3">
        <h3 className="font-bold text-sm text-[#1a0800] truncate">
          {product.name}
        </h3>
        <p className="text-[11px] text-[#331400]/50 mt-0.5 line-clamp-2">
          {product.tagline || product.description || ""}
        </p>

        <div className="mt-2 flex items-baseline gap-2 flex-wrap">
          <span className="text-base font-extrabold text-[#1a0800]">
            ₦{discountedPrice?.toLocaleString() || 0}
          </span>
          <span className="text-[10px] text-[#331400]/30 line-through">
            ₦{originalPrice?.toLocaleString() || 0}
          </span>
          <span className="text-[8px] font-black bg-[#FED45C]/20 text-[#331400] px-1.5 py-0.5">
            -15%
          </span>
        </div>
      </div>
    </motion.div>
  );
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
            className="fixed bottom-0 left-0 right-0 z-[999] bg-white shadow-2xl md:hidden "
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
            <div className="w-full bg-white shadow-2xl overflow-hidden ">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default function DashboardStore() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const userData = useAppSelector(
    (state) => state.auth.user,
  ) as UserData | null;
  const { cart } = useCart();

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const qrCodeRef = useRef<HTMLDivElement>(null);

  // Product modal states
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [imgReady, setImgReady] = useState(false);
  const [imgIdx, setImgIdx] = useState(0);
  const [variantIdx, setVariantIdx] = useState(0);
  const [qty, setQty] = useState(1);
  const imgKey = useRef(0);

  const menuItems: { icon: typeof CreditCard; label: string; href?: string }[] =
    [{ icon: CreditCard, label: "Billing", href: "/dashboard/Billing" }];

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
    <div className="relative text-center w-full z-[999] p-6">
      <div className="flex justify-end mb-2">
        <button
          onClick={() => setIsModalOpen(false)}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <XIcon className="w-5 h-5 text-gray-500" />
        </button>
      </div>
      <h2 className="text-2xl font-semibold text-gray-900">Your QR Code</h2>
      <p className="text-sm text-gray-500 mt-2 mb-6">Scan to view my profile</p>
      <div className="flex justify-center mb-6" ref={qrCodeRef}>
        <QRCodeSVG
          value={profileLink}
          size={200}
          level="H"
          includeMargin
          bgColor="#ffffff"
          fgColor="#000000"
        />
      </div>
      <div className="flex justify-center gap-6 pb-4">
        <button
          onClick={() => {
            setIsModalOpen(false);
            setIsShareModalOpen(true);
          }}
          className="flex flex-col items-center gap-2"
        >
          <div className="w-12 h-12 bg-[#331400] rounded-full flex items-center justify-center hover:scale-105 transition-transform">
            <Share className="w-5 h-5 text-white" />
          </div>
          <span className="text-xs text-gray-600">Share</span>
        </button>
        <button
          onClick={downloadQRCode}
          className="flex flex-col items-center gap-2"
        >
          <div className="w-12 h-12 bg-[#331400] rounded-full flex items-center justify-center hover:scale-105 transition-transform">
            <DownloadIcon className="w-5 h-5 text-white" />
          </div>
          <span className="text-xs text-gray-600">Download</span>
        </button>
      </div>
    </div>
  );

  const ShareModalContent = () => (
    <div className="w-full">
      <div className="p-6 border-b border-gray-100">
        <div className="flex justify-end mb-2">
          <button
            onClick={() => setIsShareModalOpen(false)}
            className="p-2 hover:bg-gray-100  transition-colors"
          >
            <XIcon className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2 text-gray-900">
            Share Your Profile
          </h2>
          <p className="text-sm text-gray-500">Connect with friends on Abio</p>
        </div>
        <div className="mt-6">
          <p className="text-sm font-medium text-gray-700 mb-2">
            Share your link
          </p>
          <div className="flex items-center gap-2 bg-gray-50 border border-gray-200  p-3">
            <input
              readOnly
              value={profileLink}
              className="bg-transparent w-full text-sm text-gray-800 outline-none truncate"
            />
            <button
              onClick={() => handleShare("copy")}
              className="flex-shrink-0 p-2 hover:bg-gray-200  transition-colors"
            >
              <CopyIcon className="w-4 h-4 text-[#331400]" />
            </button>
          </div>
        </div>
      </div>
      <div className="p-6">
        <p className="text-sm font-medium text-gray-700 mb-4">Share to</p>
        <div className="grid grid-cols-4 gap-4">
          {sharePlatforms.map(
            ({ platform, icon: Icon, color, label, bgColor }) => (
              <button
                key={platform}
                onClick={() => handleShare(platform)}
                className="flex flex-col items-center gap-2 group"
              >
                <div
                  className={`w-12 h-12 ${bgColor} rounded-full flex items-center justify-center group-hover:scale-110 transition-transform`}
                >
                  <Icon className={`w-5 h-5 ${color}`} />
                </div>
                <span className="text-xs font-medium text-gray-600">
                  {label}
                </span>
              </button>
            ),
          )}
        </div>
      </div>
    </div>
  );

  // Close detail modal
  const closeDetail = () => {
    setSelectedProduct(null);
    setVariantIdx(0);
    setImgIdx(0);
    setQty(1);
    setImgReady(false);
  };

  // Handle escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape" && selectedProduct) {
        closeDetail();
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [selectedProduct]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (selectedProduct) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [selectedProduct]);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const product = selectedProduct;
  const gallery = product ? getGallery(product, variantIdx) : [];
  const activeImage = product
    ? getActiveImage(product, variantIdx, imgIdx)
    : "";
  const activeColor = product?.colors?.[variantIdx];
  const discount =
    product && product.price ? Math.round(product.price * 0.15) : 0;
  const discountedPrice =
    product && product.price ? product.price - discount : 0;

  const changeVariant = (i: number) => {
    setVariantIdx(i);
    setImgIdx(0);
    setImgReady(false);
    imgKey.current++;
  };

  const changeThumb = (i: number) => {
    setImgIdx(i);
    setImgReady(false);
    imgKey.current++;
  };

  const prevImg = () =>
    changeThumb((imgIdx - 1 + gallery.length) % gallery.length);
  const nextImg = () => changeThumb((imgIdx + 1) % gallery.length);

  const addToCart = () => {
    if (product) {
      // Add to cart logic here
      toast.success(`Added ${qty} × ${product.name} to cart`);
    }
  };

  return (
    <>
      <div
        className="min-h-screen bg-[#FEF4EA] relative overflow-x-hidden"
        style={{
          backgroundImage:
            "radial-gradient(circle, #33140010 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      >
        {/* Mobile: Header with QR, Share, Settings, More */}
        <div className="md:hidden sticky top-0 z-30 bg-[#FEF4EA] border-b border-[#331400]/10">
          <div className="flex justify-between items-center px-4 py-3">
            <div className="w-[40px] h-[40px] overflow-hidden bg-gradient-to-br from-[#ff006e] to-[#8338ec] rounded-full shrink-0 flex items-center justify-center text-white text-lg font-bold">
              <Image
                src={
                  userData?.profile?.avatarUrl || "/icons/Profile Picture.png"
                }
                alt="Profile"
                width={80}
                height={80}
                className="object-cover shadow-md w-28 h-28 rounded-full"
              />
            </div>
            <div className="flex gap-1 items-center">
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-[#331400]/5"
                aria-label="QR Code"
              >
                <Image
                  src="/assets/icons/dashboard/qrcode.svg"
                  alt=""
                  width={40}
                  height={40}
                  className="text-[#331400]"
                />
              </button>
              <button
                onClick={() => setIsShareModalOpen(true)}
                className="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-[#331400]/5"
                aria-label="Share"
              >
                <Image
                  src="/assets/icons/dashboard/share.svg"
                  alt=""
                  width={40}
                  height={40}
                  className="text-[#331400]"
                />
              </button>
              <Link href="/dashboard/AccountSettings">
                <button
                  type="button"
                  className="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-[#331400]/5"
                >
                  <Image
                    src="/assets/icons/dashboard/settings-1.svg"
                    alt=""
                    width={40}
                    height={40}
                    className="text-[#331400]"
                  />
                </button>
              </Link>
              <div className="relative">
                <button
                  className="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-[#331400]/5"
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
                    <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-gray-200 shadow-xl z-50 overflow-hidden rounded-lg">
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
        </div>

        {/* Hero band */}
        <div className="pt-2 md:pt-6 pb-0">
          <div className="max-w-7xl mx-auto px-4 pb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-[#331400]/10">
            <div>
              <Link href="/" className="flex items-center gap-[1.5px] group">
                <Image
                  src="/icons/A.bio.svg"
                  alt="A.Bio Logo"
                  width={28}
                  height={28}
                  priority
                  className="transition-transform group-hover:scale-105"
                />
                <span className="font-medium tracking-[0em] text-3xl text-end text-black tracking-wide">
                  store
                </span>
              </Link>
            </div>
            <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4 w-full md:w-auto">
              <div className="flex items-center justify-between md:justify-start">
                <p className="text-xs text-[#331400] font-medium">
                  {filteredProducts.length} products
                </p>
                {/* Desktop Cart Button */}
                <button
                  className="hidden md:flex relative p-2 hover:bg-[#331400]/5 transition-colors"
                  onClick={() => router.push("/dashboard/store/cart")}
                >
                  <FiShoppingCart className="text-xl text-[#331400]" />
                  {cart.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-[#FED45C] text-[#331400] text-xs font-bold h-5 w-5 flex items-center justify-center rounded-full">
                      {cart.length}
                    </span>
                  )}
                </button>
              </div>
              
              {/* Mobile Search Bar - below the products count */}
              <div className="md:hidden relative w-full">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-full pl-9 pr-4 py-2 bg-white border border-[#331400]/20 text-sm outline-none focus:border-[#331400] focus:ring-1 focus:ring-[#331400]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              {/* Desktop Search */}
              <div className="hidden md:block relative">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                <input
                  type="text"
                  placeholder="Search products..."
                  className="pl-9 pr-4 py-2 bg-white border border-[#331400]/20 text-sm w-64 outline-none focus:border-[#331400] focus:ring-1 focus:ring-[#331400]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Grid Layout */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-[#331400]/5 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingBagIcon className="w-10 h-10 text-[#331400]/30" />
              </div>
              <p className="text-[#331400]/50">No products found</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onClick={() => setSelectedProduct(product as Product)}
                />
              ))}
            </div>
          )}
        </div>

        <div className="h-24 bg-gradient-to-b from-transparent to-[#FEF4EA] pointer-events-none" />
      </div>

      {/* Product Detail Modal */}
      <AnimatePresence>
        {selectedProduct && product && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={closeDetail}
              className="fixed inset-0 bg-black/60 z-[100] backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
              className="fixed inset-4 md:inset-8 lg:inset-12 z-[101] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="min-h-full flex items-center justify-center">
                <div className="bg-[#FEF4EA] w-full max-w-6xl relative shadow-2xl">
                  <motion.button
                    onClick={closeDetail}
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    className="absolute top-4 right-4 z-20 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-[#331400] hover:bg-[#FED45C] transition-colors"
                  >
                    ✕
                  </motion.button>

                  <div className="flex flex-col lg:flex-row gap-10 lg:gap-14 p-6 md:p-8 lg:p-10 lg:items-start">
                    {/* Gallery */}
                    <div className="flex-1 flex gap-3">
                      <div className="hidden sm:flex flex-col gap-2 w-[72px] flex-shrink-0 pt-1">
                        {gallery.map((src, i) => (
                          <motion.button
                            key={`${selectedProduct.id}-${variantIdx}-thumb-${i}`}
                            onClick={() => changeThumb(i)}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: i * 0.06 }}
                            whileHover={{ scale: 1.06, x: 2 }}
                            whileTap={{ scale: 0.95 }}
                            className={`relative w-[72px] h-[50px] border-2 overflow-hidden flex-shrink-0 transition-all ${imgIdx === i ? "border-[#331400]" : "border-[#331400]/12 hover:border-[#331400]/35"}`}
                          >
                            <Image
                              src={src}
                              alt={`${product.name} view ${i + 1}`}
                              fill
                              className="object-cover"
                              sizes="72px"
                            />
                            {imgIdx === i && (
                              <motion.div
                                layoutId="thumbActive"
                                className="absolute inset-0 border-2 border-[#FED45C] pointer-events-none"
                              />
                            )}
                          </motion.button>
                        ))}
                      </div>

                      <div className="flex-1 flex flex-col">
                        <div
                          className="relative bg-white border border-[#331400]/10 overflow-hidden"
                          style={{ aspectRatio: "4/3" }}
                        >
                          <Brackets size={14} color="#FED45C" opacity={0.7} />
                          <ScanLine />

                          <AnimatePresence mode="wait">
                            <motion.div
                              key={`img-${selectedProduct.id}-${variantIdx}-${imgIdx}`}
                              initial={{ opacity: 0, scale: 1.06 }}
                              animate={{
                                opacity: imgReady ? 1 : 0,
                                scale: imgReady ? 1 : 1.06,
                              }}
                              exit={{ opacity: 0, scale: 0.95 }}
                              transition={{ duration: 0.35, ease: "easeOut" }}
                              className="absolute inset-0"
                            >
                              {!imgReady && <ImageSkeleton />}
                              <Image
                                src={activeImage}
                                alt={product.name}
                                fill
                                className="object-contain p-8"
                                sizes="(max-width: 1024px) 100vw, 50vw"
                                priority
                                onLoad={() => setImgReady(true)}
                              />
                            </motion.div>
                          </AnimatePresence>

                          <div className="absolute bottom-3 left-3 z-10">
                            <span className="text-[9px] font-bold text-[#331400]/40 tracking-widest uppercase bg-[#FEF4EA]/80 px-2 py-1">
                              {activeColor?.name ?? "Default"}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between mt-3 px-0.5">
                          <div className="flex items-center gap-1.5">
                            {gallery.map((_, i) => (
                              <button
                                key={i}
                                onClick={() => changeThumb(i)}
                                className={`h-[2px] transition-all duration-300 ${imgIdx === i ? "w-6 bg-[#331400]" : "w-2 bg-[#331400]/20 hover:bg-[#331400]/40"}`}
                              />
                            ))}
                          </div>
                          <div className="flex items-center gap-2">
                            <motion.button
                              onClick={prevImg}
                              whileHover={{ x: -1 }}
                              whileTap={{ scale: 0.9 }}
                              className="w-8 h-8 border border-[#331400] flex items-center justify-center text-[12px] text-[#331400] hover:bg-[#331400]/5 transition-colors"
                            >
                              ←
                            </motion.button>
                            <motion.button
                              onClick={nextImg}
                              whileHover={{ x: 1 }}
                              whileTap={{ scale: 0.9 }}
                              className="w-8 h-8 border border-[#331400] flex items-center justify-center text-[12px] text-[#331400] hover:bg-[#331400]/5 transition-colors"
                            >
                              →
                            </motion.button>
                          </div>
                        </div>

                        <div className="sm:hidden flex gap-2 mt-3 overflow-x-auto pb-1">
                          {gallery.map((src, i) => (
                            <button
                              key={i}
                              onClick={() => changeThumb(i)}
                              className={`relative w-14 h-10 border-2 overflow-hidden flex-shrink-0 transition-colors ${imgIdx === i ? "border-[#331400]" : "border-[#331400]/12"}`}
                            >
                              <Image
                                src={src}
                                alt={`${product.name} ${i + 1}`}
                                fill                                className="object-cover"
                                sizes="56px"
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Details panel */}
                    <motion.div
                      className="w-full lg:w-[400px] xl:w-[440px] flex-shrink-0"
                      initial={{ opacity: 0, x: 24 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        duration: 0.45,
                        delay: 0.15,
                        ease: [0.25, 0.1, 0.25, 1],
                      }}
                    >
                      <div className="mb-4">
                        {product.badge && (
                          <motion.span
                            initial={{ opacity: 0, scale: 0.85 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 }}
                            className="inline-block text-[9px] font-black tracking-[0.2em] bg-[#FED45C] text-[#331400] px-2 py-1 mb-2"
                          >
                            {product.badge}
                          </motion.span>
                        )}
                        <h2 className="text-2xl font-extrabold text-[#1a0800]">
                          {product.name}
                        </h2>
                        <p className="text-sm text-[#331400] mt-1">
                          {product.tagline || product.description}
                        </p>
                      </div>

                      {/* In the modal details panel, update the price section: */}
                      <div className="relative bg-white border border-[#331400]/10 p-4 mb-5">
                        <Brackets size={10} color="#FED45C" opacity={0.5} />
                        <div className="flex items-baseline gap-3 flex-wrap">
                          <span className="text-3xl font-extrabold text-[#1a0800]">
                            ₦
                            <Counter
                              value={product.price || product.basePrice || 0}
                            />
                          </span>
                          <span className="text-sm text-[#331400]/30 line-through">
                            ₦
                            {(
                              product.price ||
                              product.basePrice ||
                              0
                            ).toLocaleString()}
                          </span>
                          <span className="bg-[#FED45C] text-[#331400] text-[9px] font-black px-2 py-0.5 tracking-wide">
                            15% OFF
                          </span>
                        </div>
                        <p className="text-xs text-green-600 font-semibold mt-1">
                          🚚 Free delivery · Save ₦
                          {Math.round(
                            (product.price || product.basePrice || 0) * 0.15,
                          ).toLocaleString()}
                        </p>
                      </div>

                      <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-[#331400]/15 to-transparent mb-5" />

                      {product.colors && product.colors.length > 0 && (
                        <div className="mb-5">
                          <p className="text-[10px] font-bold text-[#331400] uppercase tracking-[0.2em] mb-3">
                            Colour —{" "}
                            <AnimatePresence mode="wait">
                              <motion.span
                                key={activeColor?.name}
                                initial={{ opacity: 0, y: 4 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -4 }}
                                transition={{ duration: 0.18 }}
                                className="text-[#331400]"
                              >
                                {activeColor?.name}
                              </motion.span>
                            </AnimatePresence>
                          </p>
                          <div className="flex items-center gap-2.5">
                            {product.colors.map((c, i) => (
                              <motion.button
                                key={i}
                                onClick={() => changeVariant(i)}
                                whileHover={{ scale: 1.15 }}
                                whileTap={{ scale: 0.9 }}
                                title={c.name}
                                className={`relative w-8 h-8 border-2 transition-all ${variantIdx === i ? "border-[#331400]" : "border-[#331400]/20 hover:border-[#331400]/50"}`}
                                style={{ backgroundColor: c.code }}
                              >
                                {variantIdx === i && (
                                  <motion.span
                                    layoutId={`swatch-ring-${selectedProduct.id}`}
                                    className="absolute -inset-[3px] border-2 border-[#FED45C] pointer-events-none"
                                  />
                                )}
                                {c.code === "#FFFFFF" && (
                                  <span className="absolute inset-0 border border-[#331400]/10" />
                                )}
                              </motion.button>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="mb-5">
                        <p className="text-[10px] font-bold text-[#331400] uppercase tracking-[0.2em] mb-3">
                          Quantity
                        </p>
                        <div className="flex items-center gap-3">
                          <motion.button
                            onClick={() => setQty((q) => Math.max(1, q - 1))}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.85 }}
                            className="w-8 h-8 border border-[#331400] flex items-center justify-center text-[#331400] hover:bg-[#331400]/5 transition-colors text-lg font-light leading-none"
                          >
                            −
                          </motion.button>
                          <AnimatePresence mode="wait">
                            <motion.span
                              key={qty}
                              initial={{ opacity: 0, scale: 0.7 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 1.3 }}
                              transition={{ duration: 0.15 }}
                              className="text-base font-extrabold text-[#1a0800] w-8 text-center tabular-nums"
                            >
                              {qty}
                            </motion.span>
                          </AnimatePresence>
                          <motion.button
                            onClick={() => setQty((q) => q + 1)}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.85 }}
                            className="w-8 h-8 border border-[#331400] flex items-center justify-center text-[#331400] hover:bg-[#331400]/5 transition-colors text-lg font-light leading-none"
                          >
                            +
                          </motion.button>
                        </div>
                      </div>

                      <div className="space-y-2 mb-6">
                        <motion.div
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                          className="relative border-2 border-[#331400] bg-white p-4"
                        >
                          <Brackets size={8} color="#FED45C" opacity={0.5} />
                          <p className="text-sm font-bold text-[#1a0800]">
                            Standard
                          </p>
                          <p className="text-xs text-[#331400]/45 mt-0.5">
                            Clean Abio branding.
                          </p>
                        </motion.div>
                      </div>

                      <ul className="mb-7 space-y-2">
                        {product.features?.map((f, i) => (
                          <motion.li
                            key={f}
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 + i * 0.07 }}
                            className="flex items-center gap-2.5 text-sm text-[#331400]/65"
                          >
                            <motion.span
                              className="w-4 h-4 bg-[#FED45C] flex items-center justify-center text-[#331400] text-[9px] font-black flex-shrink-0"
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{
                                type: "spring",
                                delay: 0.35 + i * 0.07,
                              }}
                            >
                              ✓
                            </motion.span>
                            {f}
                          </motion.li>
                        ))}
                      </ul>

                      <div className="flex gap-3">
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.5 }}
                          className="flex-1"
                        >
                          <button
                            onClick={addToCart}
                            className="w-full bg-white border-2 border-[#331400] text-[#331400] text-sm font-extrabold py-4 text-center hover:bg-[#331400]/5 transition-colors cursor-pointer select-none"
                          >
                            Add to Cart
                          </button>
                        </motion.div>
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.55 }}
                          className="flex-1"
                        >
                          <Link
                            href={`/dashboard/store/onboarding/${product.id}`}
                          >
                            <motion.div
                              whileHover={{
                                scale: 1.015,
                                boxShadow: "6px 6px 0px #FED45C",
                              }}
                              whileTap={{ scale: 0.98 }}
                              transition={{
                                type: "spring",
                                stiffness: 400,
                                damping: 20,
                              }}
                              className="w-full bg-[#331400] text-white text-sm font-extrabold py-4 text-center shadow-[4px_4px_0px_#FED45C] cursor-pointer select-none"
                            >
                              Buy Now
                            </motion.div>
                          </Link>
                        </motion.div>
                      </div>

                      <p className="text-center text-[10px] text-[#331400] mt-3 tracking-wide">
                        🔒 Secure payment via Paystack · Pre-order ships in 3–5
                        days
                      </p>
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* QR & Share Modals */}
      <ResponsiveSheet
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      >
        <QRModalContent />
      </ResponsiveSheet>
      <ResponsiveSheet
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
      >
        <ShareModalContent />
      </ResponsiveSheet>

      <div className="md:hidden">
        <MobileBottomNav />
      </div>
    </>
  );
}