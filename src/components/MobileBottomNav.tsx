"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { sidebarNav } from "@/data";

const MobileBottomNav = () => {
  const pathname = usePathname();

  return (
    /* FULL SCREEN RED BACKGROUND */
    <div className="relative z-50 md:hidden">
      {/* WHITE BOTTOM NAV */}
      <nav className="fixed bottom-1 left-0 right-0 bg-gradient-to-br from-white/40 to-white/80 backdrop-blur-2xl border-t-1 border-black  z-50">
        <div className="flex justify-around items-center py-1 px-2">
          {sidebarNav.map((item) => {
            const isActive = pathname === item.url;

            return (
              <Link
                key={item.url}
                href={item.url}
                className={`flex flex-col items-center justify-center gap-  px-3 rounded-lg transition-all ${
                  isActive
                    ? "text-[#331400]"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <Image
                  src={item.icon}
                  alt={item.title}
                  width={35}
                  height={35}
                  style={{
                    filter: isActive
                      ? "invert(27%) sepia(97%) saturate(7293%) hue-rotate(0deg) brightness(106%) contrast(106%)"
                      : "invert(17%) sepia(31%) saturate(542%) hue-rotate(2deg) brightness(92%) contrast(88%)",
                  }}
                />
                <span className="text-[10px] font-semibold whitespace-nowrap">
                  {item.title}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default MobileBottomNav;