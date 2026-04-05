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
  FaWhatsapp,
  FaInstagram,
  FaPinterest,
} from "react-icons/fa6";
import { QRCodeSVG } from "qrcode.react";
import { toPng } from "html-to-image";

const LockIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-16 h-16">
    <path d="M18 8h-1V6A5 5 0 007 6v2H6a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V10a2 2 0 00-2-2zm-6 9a2 2 0 110-4 2 2 0 010 4zm3.1-9H8.9V6a3.1 3.1 0 016.2 0v2z" />
  </svg>
);

export default function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState("analytics");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const router = useRouter();
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const userData = useAppSelector((state) => state.auth.user);

  const qrCodeRef = useRef<HTMLDivElement>(null);

  const profileLink =
    typeof window !== "undefined"
      ? `${window.location.origin}/${userData?.profile?.username || "profile"}`
      : "";

  const handleLogout = () => {
    dispatch(clearAuth());
    queryClient.clear();
    toast.success("Logged out successfully");
    router.push("/auth/sign-in");
  };

  return (
    <>
      <div className="bg-[#FEF4EA] min-h-screen font-sans max-w-[390px] md:max-w-full mx-auto relative pb-[90px] md:pt-14">
        {/* HEADER */}
        <div className="md:hidden flex justify-between items-center px-5 py-3">
          <div className="w-[52px] h-[52px] bg-gray-300 flex-shrink-0">
            {userData?.profile?.avatarUrl ? (
              <Image
                src={userData.profile.avatarUrl}
                alt="Profile"
                width={52}
                height={52}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white bg-black">
                👤
              </div>
            )}
          </div>

          <button onClick={handleLogout}>
            <LogOut />
          </button>
        </div>

        {/* CONTENT */}
        <div className="px-4 py-10 text-center">
          <h1 className="text-xl font-bold">Analytics Dashboard</h1>
          <p className="text-sm text-gray-500 mt-2">
            Your analytics will appear here
          </p>
        </div>

        {/* 🔥 BOTTOM NAV (FIXED ABOVE OVERLAY) */}
        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[390px] bg-white border-t border-black/10 flex py-2 pb-5 md:hidden z-[999]">
          <MobileBottomNav />
        </div>

        {/* 🔥 GLASS OVERLAY */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className=" fixed 
    top-0 
    right-0 
    bottom-0 
    left-0 
    md:left-[240px]   
    z-[998] 
    flex 
    items-center 
    justify-center 
    backdrop-blur-xl 
    bg-white/30
  "
        >
          <div className="flex flex-col items-center gap-4">
            <div className="text-[#331400]">
              <LockIcon />
            </div>

            <p className="text-lg font-semibold text-gray-900">
              Feature coming soon
            </p>

            <button className="px-8 py-3 bg-[#331400] text-white text-sm font-semibold shadow-xl hover:scale-[1.05] active:scale-[0.96] transition-all duration-200">
              Coming Soon
            </button>
          </div>
        </motion.div>
      </div>
    </>
  );
}
