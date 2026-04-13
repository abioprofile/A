"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { GripVertical, Trash2, BarChart2, Pencil } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const platforms = [
  { name: "TikTok",    link: "https://www.tiktok.com/@danibush",      icon: "/assets/platform-icons/colored/Social=TikTok,Style=Original.svg",             active: false },
  { name: "Snapchat",  link: "https://www.snapchat.com/add/danibush",  icon: "/assets/platform-icons/colored/Social=Snapchat,Style=Original.svg",           active: true  },
  { name: "Instagram", link: "https://www.instagram.com/danibush",     icon: "/assets/platform-icons/colored/Social=Instagram,Style=Original.svg",          active: true  },
  { name: "WhatsApp",  link: "https://wa.me/2348163746282",            icon: "/assets/platform-icons/colored/Social=WhatsApp,Style=Original.svg",           active: false },
  { name: "Pinterest", link: "https://pin.it/3oCPlWHLV",               icon: "/assets/platform-icons/colored/Social=Pinterest,Style=Original.svg",          active: true  },
  { name: "YouTube",   link: "https://youtube.com/@danibush",          icon: "/assets/platform-icons/colored/Social=YouTube,Style=Original.svg",            active: true  },
  { name: "Twitter",   link: "https://twitter.com/danibush",           icon: "/assets/platform-icons/colored/Social=X ex Twitter,Style=Original.svg",       active: false },
];

const Toggle = ({ active }: { active: boolean }) => (
  <div className={`w-7 h-4 xl:w-9 xl:h-5 rounded-full relative flex-shrink-0 transition-colors duration-200 ${active ? "bg-[#5D2D2B]" : "bg-gray-200"}`}>
    <div className={`absolute top-0.5 w-3 h-3 xl:w-4 xl:h-4 rounded-full bg-white transition-transform duration-200 ${active ? "translate-x-3 xl:translate-x-4" : "translate-x-0.5"}`} />
  </div>
);

function SocialLinkCard({ name, link, icon, active }: { name: string; link: string; icon: string; active: boolean }) {
  return (
    <div className="bg-white border border-[#e5e5e5] shadow-[2px_2px_0px_0px_#000] xl:shadow-[3px_3px_0px_0px_#000] w-full px-2.5 xl:px-4 py-2 xl:py-3 flex flex-col gap-1.5 xl:gap-2">
      <div className="flex items-center gap-1.5 xl:gap-3">
        <GripVertical className="w-3 h-3 xl:w-4 xl:h-4 flex-shrink-0" style={{ color: "#FF0000" }} />
        <Image
          src={icon}
          alt={name}
          width={28}
          height={28}
          className="w-5 h-5 xl:w-7 xl:h-7 flex-shrink-0 object-contain"
        />
        <div className="flex flex-col flex-1 min-w-0">
          <div className="flex items-center gap-1">
            <span className="text-[10px] xl:text-[13px] font-bold text-black leading-none">{name}</span>
            <Pencil className="w-2.5 h-2.5 xl:w-3 xl:h-3 text-gray-400" />
          </div>
          <div className="flex items-center gap-1 min-w-0">
            <span className="text-[8px] xl:text-[11px] text-gray-400 truncate max-w-[80px] xl:max-w-none">{link}</span>
            <Pencil className="w-2 h-2 xl:w-3 xl:h-3 text-gray-400 flex-shrink-0" />
          </div>
        </div>
        <Toggle active={active} />
        <Trash2 className="w-3 h-3 xl:w-4 xl:h-4 flex-shrink-0" style={{ color: "#FF0000" }} />
      </div>
      <div className="flex items-center gap-1 xl:gap-1.5 pt-1 xl:pt-1.5 border-t border-gray-100">
        <BarChart2 className="w-2.5 h-2.5 xl:w-3.5 xl:h-3.5 text-gray-300" />
        <span className="text-[8px] xl:text-[10px] text-gray-400 font-medium">0 clicks</span>
      </div>
    </div>
  );
}

const VISIBLE = 4;

// mobile offsets smaller so cards don't overflow, desktop larger
const mobileOffsets = [8, -8, 8, -8];
const desktopOffsets = [24, -24, 24, -24];

const ManageYourLinks = () => {
  const [startIndex, setStartIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1280);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setStartIndex((prev) => (prev + 1) % platforms.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const offsets = isMobile ? mobileOffsets : desktopOffsets;

  const visible = Array.from({ length: VISIBLE }, (_, i) => ({
    ...platforms[(startIndex + i) % platforms.length],
    slotIndex: i,
  }));

  return (
    <section className="w-full bg-[#FED45C] px-4 sm:px-8 md:px-12 lg:px-20 py-16 md:py-24 relative overflow-hidden">
      <div className="container mx-auto">
        <div className="flex flex-col xl:grid xl:grid-cols-[1fr_1fr] gap-8 xl:gap-16 items-center">

          {/* Left — Text */}
          <motion.div
            initial={{ opacity: 0, x: -28 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="space-y-5 max-w-md relative"
          >
            <h2 className="text-[40px] xl:text-[50px] trialheader text-[#5D2D2B] font-[400] leading-tight">
              Integrate and Manage your Links
            </h2>
            <p className="text-xs sm:text-sm font-light leading-6 text-[#5D2D2B]/80 max-w-xs">
              Organize, prioritize, and update links anytime to keep your
              audience up to speed.
            </p>
          </motion.div>

          {/* Right — Offset animated stack */}
          <div className="w-full flex flex-col gap-1.5 xl:gap-3 xl:pl-8">
            <AnimatePresence mode="popLayout">
              {visible.map((platform) => {
                const xOffset = offsets[platform.slotIndex];
                return (
                  <motion.div
                    key={`${platform.name}-${platform.slotIndex}`}
                    initial={{ opacity: 0, y: -20, x: xOffset, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0,   x: xOffset, scale: 1    }}
                    exit={{    opacity: 0, y: 20,   x: xOffset, scale: 0.96 }}
                    transition={{ duration: 0.65, ease: [0.25, 0.46, 0.45, 0.94] }}
                    layout
                  >
                    <SocialLinkCard
                      name={platform.name}
                      link={platform.link}
                      icon={platform.icon}
                      active={platform.active}
                    />
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

        </div>
      </div>
    </section>
  );
};

export default ManageYourLinks;