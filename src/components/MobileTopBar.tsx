'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

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
          <h1 className="text-xl sm:text-2xl font-bold text-[#331400] leading-tight">
            {name}
          </h1>
          <p className="text-sm text-red-500 mt-0.5">
            abio.site/{username}
          </p>
        </div>

        {/* RIGHT ICONS */}
        <div className="flex items-center gap-3 sm:gap-4">
          {[
            { src: "/icons/qr.svg", alt: "QR" },
            { src: "/icons/share.svg", alt: "Share" },
          ].map(({ src, alt }) => (
            <motion.button
              key={alt}
              whileHover={{ scale: 1.12 }}
              whileTap={{ scale: 0.85, transition: { duration: 0.1 } }}
              transition={{ duration: 0.16, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <Image src={src} alt={alt} width={20} height={20} className="w-5 h-5 sm:w-5 sm:h-5" />
            </motion.button>
          ))}
          <motion.button
            whileHover={{ scale: 1.12 }}
            whileTap={{ scale: 0.85, transition: { duration: 0.1 } }}
            transition={{ duration: 0.16, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="relative"
          >
            <Image src="/icons/bell.svg" alt="Bell" width={20} height={20} className="w-5 h-5" />
            <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-red-500" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.12 }}
            whileTap={{ scale: 0.85, transition: { duration: 0.1 } }}
            transition={{ duration: 0.16, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <Image src="/icons/more.svg" alt="Menu" width={20} height={20} className="w-5 h-5" />
          </motion.button>
        </div>
      </div>
    </header>
  );
}
