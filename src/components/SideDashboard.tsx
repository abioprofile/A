"use client";

import React, { useState } from "react";
import Modal from "@/components/ui/modal";
import { toast } from "sonner";
import {
  CopyIcon,
  Share2Icon,
  QrCodeIcon,
  MoreHorizontalIcon,
  ArrowLeftIcon,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/stores/hooks";


export default function SideDashboard() {
  const router = useRouter();
  const userData = useAppSelector((state) => state.auth.user);

  const getProfileLink = () => {
    if (typeof window === 'undefined') return "/profile";
    const origin = window.location.origin; // e.g., "http://localhost:3000"
    return userData?.profile?.username ? `${origin}/${userData.profile.username}` : `${origin}/profile`; 
  };
  const profileLink = getProfileLink();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showAccountSettings, setShowAccountSettings] = useState(false);
  const [twoStepEnabled, setTwoStepEnabled] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(profileLink);
      toast.success("Link copied");
    } catch {
      toast.error("Failed to copy link");
    }
  };

  const shareLink = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: userData?.name || "User",
          url: profileLink,
        });
      } else {
        copyToClipboard();
      }
    } catch {}
  };

  const formatLink = (url: string) => {
    return (
      <>
        <span className="text-red-500 font-semibold">{url}</span>
      </>
    );
  };

  return (
    <>
      {/* MOBILE TOP BAR */}
      <div className="md:hidden mt-6">
        <div className="px-8 py-3 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-extrabold mb-1 text-[20px]">{userData?.name || "User"}</p>
              <p className="text-[12px] font-semibold text-gray-600 truncate">
                {formatLink(profileLink)}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button onClick={() => setIsModalOpen(true)}>
                <QrCodeIcon className="w-6 h-6 text-[#331400]" />
              </button>

              {/* Share */}
              <button onClick={shareLink}>
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

          {/* NAME + LINK (UNDER EVERYTHING) */}
          {/* <div className="mt-3">
            <p className="font-bold text-[25px] leading-tight">
              {userData?.name || "User"}
            </p>
            <p className="text-[16px] text-gray-600 truncate">
              {formatLink(profileLink)}
            </p>
          </div> */}
        </div>
      </div>

      {/* ================= DESKTOP QR SECTION ================= */}
      <div className="hidden md:block p-4 sm:p-6 space-y-4 text-gray-800 max-w-[400px] mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6 mb-6">
            <button className="cursor-pointer" onClick={() => setIsModalOpen(true)}>
              <QrCodeIcon className="w-6 h-6 text-[#331400]" />
            </button>

            <button className="cursor-pointer" onClick={copyToClipboard}>
              <CopyIcon className="w-6 h-6 text-[#331400]" />
            </button>

            <button className="cursor-pointer" onClick={shareLink}>
              <Share2Icon className="w-6 h-6 text-[#331400]" />
            </button>
            <p className="text-sm text-gray-600">{formatLink(profileLink)}</p>
          </div>
        </div>
      </div>

     
      {/* QR MODAL */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="p-6 text-center">
          <h2 className="font-bold mb-4">Scan my QR code</h2>
          <img src="/QR-placeholder.png" className="w-40 mx-auto" />
        </div>
      </Modal>
    </>
  );
}
