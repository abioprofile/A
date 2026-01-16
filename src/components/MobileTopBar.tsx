'use client';

import Image from 'next/image';

interface MobileTopBarProps {
  name: string;
  username: string;
}

export default function MobileTopBar({
  name,
  username,
}: MobileTopBarProps) {
  return (
    <header className="sticky top-0 z-40 bg-[#FFF7DE] px-4 pt-6 pb-4">
      <div className="flex items-start justify-between">
        {/* LEFT */}
        <div>
          <h1 className="text-[22px] font-bold text-[#331400]">
            {name}
          </h1>
          <p className="text-[14px] text-red-500">
            abio.site/{username}
          </p>
        </div>

        {/* RIGHT ICONS */}
        <div className="flex items-center gap-4">
          <button>
            <Image src="/icons/qr.svg" alt="QR" width={20} height={20} />
          </button>
          <button>
            <Image src="/icons/share.svg" alt="Share" width={20} height={20} />
          </button>
          <button className="relative">
            <Image src="/icons/bell.svg" alt="Bell" width={20} height={20} />
            <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-red-500" />
          </button>
          <button>
            <Image src="/icons/more.svg" alt="Menu" width={20} height={20} />
          </button>
        </div>
      </div>
    </header>
  );
}
