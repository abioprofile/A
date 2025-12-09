"use client";

import React, { useState } from "react";
import Modal from "@/components/ui/modal";
import { toast } from "sonner";
import { CopyIcon, Share2Icon, QrCodeIcon } from "lucide-react";

const QRCodeButton = ({ link }: { link: string }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const copyToClipboard = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(link);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = link;
        textarea.style.position = "fixed";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }
      toast.success("Link copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy:", err);
      toast.error("Failed to copy link");
    }
  };

  const shareLink = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: "My A.Bio Link",
          text: "Check out my A.Bio profile",
          url: link,
        });
      } else {
        await copyToClipboard();
        toast.info("Link copied — paste to share");
      }
    } catch (err) {
      if (
        typeof err === "object" &&
        err !== null &&
        "name" in err &&
        (err as { name?: unknown }).name !== "AbortError"
      ) {
        await copyToClipboard();
      }
    }
  };


  const formatLink = (url: string) => {
    const parts = url.split("abio.site/");
    if (parts.length === 2) {
      return (
        <>
          <span className="text-red-500 font-semibold text-[18px]">abio.site/</span>
          {parts[1]}
        </>
      );
    }
    return url;
  };

  return (
    <>
      <div className="w-full max-w-[400px] -mt-5 mx-auto">
        <div className="flex items-center justify-between p-3 sm:p-4">
          <div className="flex items-center gap- overflow-hidden">
            {/* QR Button */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex-shrink-0 flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 hover:opacity-90 transition-opacity"
              aria-label="Show QR code"
            >
              <QrCodeIcon className="w-6 h-6 text-[#331400]" />
            </button>

            {/* Copy Button */}
            <button
              onClick={copyToClipboard}
              className="flex-shrink-0 p-1 sm:p-2 text-[#331400] hover:text-[#ff0000] hover:bg-gray-20 rounded-md transition-all"
              title="Copy link"
              aria-label="Copy link"
            >
              <CopyIcon className="w-6 h-6 " />
            </button>

            {/* Share Button */}
            <button
              onClick={shareLink}
              className="flex-shrink-0 p-1 sm:p-2 text-[#331400] hover:text-[#ff0000] hover:bg-gray-20 rounded-md transition-all"
              title="Share link"
              aria-label="Share link"
            >
              <Share2Icon className="w-6 h-6 " />
            </button>

            {/* Link Display */}
            <span className="text-xs sm:text-sm text-gray-600 truncate flex-1 min-w-0">
              {formatLink(link)}
            </span>
          </div>
        </div>
      </div>

      {/* Modal for QR */}
<Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
  <div className="w">
    {/* Close Button */}
    <button
      onClick={() => setIsModalOpen(false)}
      className="absolute top-3 right-3 text-gray-700 hover:text-black focus:outline-none"
      aria-label="Close"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
          clipRule="evenodd"
        />
      </svg>
    </button>

    {/* Header */}
    <div className="flex flex-col items-center gap-1 mt-2">
      <div className="bg-[#331400]/90 text-white rounded-full w-10 h-10 flex items-center justify-center mb-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="3" width="7" height="7" />
          <rect x="14" y="3" width="7" height="7" />
          <rect x="14" y="14" width="7" height="7" />
          <rect x="3" y="14" width="7" height="7" />
        </svg>
      </div>
      <h1 className="text-[18px] font-bold text-[#331400]">
        Here is your code!!!
      </h1>
      <p className="text-[15px] text-gray-500">
        This is your unique code for another person to scan
      </p>
    </div>

    {/* QR Code Section */}
    <div className="flex justify-center mt-5 mb-6">
      <div className="bg-white shadow-md rounded-xl p-3">
        <img
          src="/QR-placeholder.png"
          alt="QR Code"
          className="w-40 h-40 object-contain"
        />
      </div>
    </div>

    {/* Action Buttons */}
    <div className="flex items-center justify-center gap-6">
      <button
        onClick={shareLink}
        className="flex flex-col items-center text-[#331400] hover:opacity-80"
      >
        <div className="bg-[#331400] text-white w-10 h-10 rounded-md flex items-center justify-center mb-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8" />
            <polyline points="16 6 12 2 8 6" />
            <line x1="12" x2="12" y1="2" y2="15" />
          </svg>
        </div>
        <span className="text-[12px] font-semibold">Share</span>
      </button>

      <button
        onClick={() => toast.info("Downloading QR...")}
        className="flex flex-col items-center text-[#331400] hover:opacity-80"
      >
        <div className="bg-[#331400] text-white w-10 h-10 rounded-md flex items-center justify-center mb-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path d="M4 4v16a2 2 0 002 2h12a2 2 0 002-2V4" />
            <polyline points="16 10 12 14 8 10" />
            <line x1="12" x2="12" y1="14" y2="3" />
          </svg>
        </div>
        <span className="text-[12px] font-semibold">Download</span>
      </button>
    </div>
  </div>
</Modal>

    </>
  );
};

export default function SideDashboard() {
  const profileLink = "https://abio.site/davidosh";

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 text-[18px] text-gray-800">
      <QRCodeButton link={profileLink} />
    </div>
  );
}
