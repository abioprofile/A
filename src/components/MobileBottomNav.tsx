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
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-black/10 shadow-2xl shadow-black/60 z-50">
        <div className="flex justify-around items-center h-14 px-2 py-3">
          {sidebarNav.map((item) => {
            const isActive = pathname === item.url;

            return (
              <Link
                key={item.url}
                href={item.url}
                className={`flex flex-col items-center justify-center gap-1.5 py-2 px-3 rounded-lg transition-all ${
                  isActive
                    ? "text-[#331400]"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <Image
                  src={item.icon}
                  alt={item.title}
                  width={20}
                  height={20}
                  style={{
                    filter: isActive
                      ? "invert(25%) sepia(98%) saturate(7300%) hue-rotate(355deg) brightness(98%) contrast(100%)"
                      : "invert(50%)",
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
