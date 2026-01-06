"use client";

import React, { useState } from "react";
import Modal from "@/components/ui/modal";
import { toast } from "sonner";
import {
  CopyIcon,
  Share2Icon,
  QrCodeIcon,
  MoreHorizontalIcon,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";


export default function SideDashboard() {
  const profileLink = "https://abio.site/user";
  const [isModalOpen, setIsModalOpen] = useState(false);

  const router = useRouter();


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
          title: "David Osh",
          url: profileLink,
        });
      } else {
        copyToClipboard();
      }
    } catch {}
  };

  const formatLink = (url: string) => {
    const parts = url.split("abio.site/");
    return (
      <>
        <span className="text-red-500 font-semibold">abio.site/</span>
        {parts[1]}
      </>
    );
  };

  return (
    <>
      
      {/* ================= MOBILE TOP BAR ================= */}
      <div className="md:hidden  mt-6 ">
        <div className="px-8 py-3  mb-4">
  {/* TOP ROW: Profile image + right icons */}
  <div className="flex items-center justify-between">
    {/* Profile image */}
    <Image
      src="/icons/Profile Picture.png" // ⚠️ renamed (no dot)
      alt="David Osh"
      width={36}
      height={36}
      className="w-16 h-16 object-cover"
      priority
    />

    {/* RIGHT: Icons */}
    <div className="flex items-center gap-3">
      {/* QR */}
      <button onClick={() => setIsModalOpen(true)}>
        <QrCodeIcon className="w-7 h-7 text-[#331400]" />
      </button>

      {/* Share */}
      <button onClick={shareLink}>
        <Share2Icon className="w-7 h-7 text-[#331400]" />
      </button>

      {/* Notifications */}
      <button className="relative">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-7 h-7 text-[#331400]"
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
  <MoreHorizontalIcon className="w-7 h-7 text-[#331400]" />
</button>

    </div>
  </div>

  {/* NAME + LINK (UNDER EVERYTHING) */}
  <div className="mt-3">
    <p className="font-bold text-[25px] leading-tight">
      User
    </p>
    <p className="text-[16px] text-gray-600 truncate">
      {formatLink(profileLink)}
    </p>
  </div>
</div>

      </div>



      {/* ================= DESKTOP QR SECTION ================= */}
      <div className="hidden md:block p-4 sm:p-6 space-y-4 text-gray-800 max-w-[400px] mx-auto">
        <div className="flex items-center justify-between">
          {/* <h1 className="font-semibold md: text-lg">David Osh</h1> */}

          <div className="flex items-center gap-6 mb-6">
            <button onClick={() => setIsModalOpen(true)}>
              <QrCodeIcon className="w-6 h-6 text-[#331400]" />
            </button>

            <button onClick={copyToClipboard}>
              <CopyIcon className="w-6 h-6 text-[#331400]" />
            </button>

            <button onClick={shareLink}>
              <Share2Icon className="w-6 h-6 text-[#331400]" />
            </button>
        <p className="text-sm text-gray-600">{formatLink(profileLink)}</p>
          </div>
        </div>

      </div>

      {/* ================= QR MODAL ================= */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="relative p-6">
          <button
            onClick={() => setIsModalOpen(false)}
            className="absolute top-3 right-3"
          >
            ✕
          </button>

          <div className="text-center space-y-3">
            <h2 className="font-bold text-lg text-[#331400]">
              Scan my QR code
            </h2>

            <div className="flex justify-center">
              <img
                src="/QR-placeholder.png"
                alt="QR Code"
                className="w-40 h-40"
              />
            </div>

            <div className="flex justify-center gap-6 pt-4">
              <button
                onClick={shareLink}
                className="flex flex-col items-center"
              >
                <div className="w-10 h-10 bg-[#331400] text-white rounded-md flex items-center justify-center">
                  <Share2Icon className="w-5 h-5" />
                </div>
                <span className="text-xs mt-1">Share</span>
              </button>

              <button className="flex flex-col items-center">
                <div className="w-10 h-10 bg-[#331400] text-white rounded-md flex items-center justify-center">
                  ⬇
                </div>
                <span className="text-xs mt-1">Download</span>
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}
