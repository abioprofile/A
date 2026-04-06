"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { sidebarNav } from "@/data";
import { motion } from "framer-motion";

const MobileBottomNav = () => {
  const pathname = usePathname();

  return (
    /* FULL SCREEN RED BACKGROUND */
    <div className="relative z-50 md:hidden">
      {/* WHITE BOTTOM NAV */}
      <nav className="fixed bottom-0 left-0 right-0 bg-gradient-to-br from-white/40 to-white/80 backdrop-blur-2xl border-t-1 border-black z-50">
        <div className="flex justify-around items-center py-1 px-2">
          {sidebarNav.map((item) => {
            const isActive = pathname === item.url;
            // Use activeIcon if it exists and is active, otherwise use default icon
            const iconSrc = isActive && item.activeIcon ? item.activeIcon : item.icon;

            return (
              <Link
                key={item.url}
                href={item.url}
                className={`flex flex-col items-center justify-center px-3 rounded-lg ${
                  isActive ? "text-[#331400]" : "text-gray-500"
                }`}
              >
                <motion.div
                  className="flex flex-col items-center gap-0.5"
                  animate={{ scale: isActive ? 1.08 : 1 }}
                  whileTap={{ scale: 0.82 }}
                  transition={{ duration: 0.18, ease: [0.25, 0.46, 0.45, 0.94] }}
                >
                  <Image
                    src={iconSrc}
                    alt={item.title}
                    width={35}
                    height={35}
                    style={!item.activeIcon ? {
                      filter: isActive
                        ? "invert(27%) sepia(97%) saturate(7293%) hue-rotate(0deg) brightness(106%) contrast(106%)"
                        : "invert(17%) sepia(31%) saturate(542%) hue-rotate(2deg) brightness(92%) contrast(88%)",
                    } : undefined}
                  />
                  <motion.span
                    className="text-[10px] sm:text-xs font-semibold whitespace-nowrap"
                    animate={{ opacity: isActive ? 1 : 0.6 }}
                    transition={{ duration: 0.18 }}
                  >
                    {item.title}
                  </motion.span>
                </motion.div>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default MobileBottomNav;