import React, { useState } from 'react';
import Modal from '@/components/ui/modal';
import { toast } from 'sonner';
import { Button } from './ui/button';
import { CopyIcon, Share2Icon, QrCodeIcon } from 'lucide-react';

const QRCodeButton = ({ link }: { link: string }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const copyToClipboard = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(link);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = link;
        textarea.style.position = 'fixed';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      toast.success('Link copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy:', err);
      toast.error('Failed to copy link');
    }
  };

  const shareLink = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'My A.Bio Link',
          text: 'Check out my A.Bio profile',
          url: link,
        });
      } else {
        await copyToClipboard();
        toast.info('Link copied - paste to share');
      }
    } catch (err) {
      if (typeof err === 'object' && err !== null && 'name' in err && (err as { name?: unknown }).name !== 'AbortError') {
        await copyToClipboard();
      }
    }
  };

  return (
    <>
      <div className="w-full max-w-[400px] -mt-5 mx-auto"> {/* Fixed width container */}
        <div className="flex items-center justify-between p-3 sm:p-4 bg-white  shadow-sm border">
          <div className="flex items-center gap-2 sm:gap-3 overflow-hidden">
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex-shrink-0 flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-[#ff0000] hover:opacity-90 transition-opacity"
              aria-label="Show QR code"
            >
              <QrCodeIcon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </button>
            
            <button
              onClick={copyToClipboard}
              className="flex-shrink-0 p-1 sm:p-2 text-gray-500 hover:text-[#7140EB] hover:bg-gray-50  transition-all"
              title="Copy link"
              aria-label="Copy link"
            >
              <CopyIcon className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            <span className="text-xs sm:text-sm text-gray-600 truncate flex-1 min-w-0">
              {link}
            </span>
          </div>

          <div className="flex-shrink-0 ml-2">
            <Button
              onClick={shareLink}
              className="px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm font-bold  hover:opacity-90 transition-opacity whitespace-nowrap"
              title="Share link"
              aria-label="Share link"
            >
              Share
            </Button>
          </div>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
  <div className="w-full max-w-[280px] sm:max-w-xs p-4 sm:p-6 text-center relative">
    <button
      onClick={() => setIsModalOpen(false)}
      className="absolute top-2 right-2 text-black  focus:outline-none"
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
    
    <h1 className="text-[20px] font-bold ">Here is your code!!!</h1>
    <p className='text-[13px]'>This is your unique code for another 
    person to scan</p>
    <div className="bg-gray-50 p-3 sm:p-4 mb-3 sm:mb-4 flex justify-center">
      <div className="bg-white p-3 sm:p-4  shadow-sm">
        <div className="w-32 h-32 sm:w-40 sm:h-40 flex items-center justify-center border-2 border-dashed border-gray-200 ">
          <span className="text-xs sm:text-sm text-gray-400">QR Code Preview</span>
        </div>
        <div className="mt-2 sm:mt-3 text-xs text-gray-500 break-all px-2">
          {link}
        </div>
      </div>
    </div>

    <div className="">
      <button
        onClick={copyToClipboard}
        className="flex-1 py-1.5 sm:py-2 text-xs sm:text-sm bg-gradient-to-r from-[#7140EB] to-[#FB8E8E] text-white  hover:opacity-90"
      >
        Copy Link
      </button>
    </div>
  </div>
</Modal>
    </>
  );
};

export default function SideDashboard() {
  const profileLink = 'https://abio.example.com/davidosh';

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 text-sm text-gray-800">
      <QRCodeButton link={profileLink} />
    </div>
  );
}