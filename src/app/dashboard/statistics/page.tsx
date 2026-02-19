"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import PhoneDisplay from "@/components/PhoneDisplay";
import { useIsMobile } from "@/hooks/use-mobile";
import { usePhoneDisplayProps } from "@/hooks/usePhoneDisplayProps";
import MobileBottomNav from "@/components/MobileBottomNav";

export default function AnalyticsPage() {
  const isMobile = useIsMobile();
  const [activeRange, setActiveRange] = useState("ALL");

  const {
    buttonStyle,
    fontStyle,
    selectedTheme,
    profile,
    links,
    isLoading: phoneDisplayLoading,
  } = usePhoneDisplayProps();

  // MOBILE VIEW
  if (isMobile) {
    return (
      <div className="min-h-screen bg-[#FEF4EA] pt-4 pb-8 px-4">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-[20px] font-bold text-black">Analytics</h1>
          
          {/* FILTERS - Mobile optimized */}
          <div className="flex gap-2">
            {["ALL", "1D", "7D", "30D"].map((range) => (
              <button
                key={range}
                onClick={() => setActiveRange(range)}
                className={`px-3 py-1 text-xs cursor-pointer transition ${
                  activeRange === range
                    ? "bg-[#331400] shadow-[2px_2px_0px_0px_rgba(0,0,0,0.5)] text-white"
                    : "border border-black/30 text-black"
                }`}
              >
                {range}
              </button>
            ))}
            <MobileBottomNav/>
          </div>
        </div>

        {/* METRICS GRID */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <MetricCardMobile 
            label="VIEWS" 
            value="0" 
            className="bg-[#FED45C]" 
          />
          <MetricCardMobile 
            label="CLICKS" 
            value="0" 
            className="bg-[#FED45C]" 
          />
          <MetricCardMobile 
            label="CTR" 
            value="0%" 
            className="bg-[#FED45C] col-span-2" 
            small
          />
        </div>

             {/* ADDITIONAL STATS - Mobile specific */}
        <div className="bg-white mb-4 p-4 shadow-sm border border-black/10">
          <h2 className="text-sm font-semibold text-black mb-3">Performance Summary</h2>
          <div className="space-y-3">
            <StatRow label="Avg. Click Rate" value="0%" />
            <StatRow label="Top Link" value="None" />
            <StatRow label="Peak Time" value="--:--" />
          </div>
        </div>
        {/* PHONE DISPLAY - Mobile centered */}
        <div className="relative z-10 mb-8">
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
            className="w-full max-w-[280px] mx-auto"
          >
            <PhoneDisplay
              buttonStyle={buttonStyle}
              fontStyle={fontStyle}
              selectedTheme={selectedTheme}
              profile={profile}
              links={links}
              phoneDisplayLoading={phoneDisplayLoading}
            />
          </motion.div>
        </div>

       
      </div>
    );
  }

  // DESKTOP VIEW (Original)
  return (
    <div className="min-h-screen bg-[#FEF4EA] relative overflow-hidden">
      {/* HEADER */}
      <div className="absolute top-10 left-16 text-[22px] font-bold">
        Analytics
      </div>

      {/* FILTERS */}
      <div className="absolute top-10 right-16 flex gap-3">
        {["ALL", "1D", "7D", "30D"].map((range) => (
          <button
            key={range}
            onClick={() => setActiveRange(range)}
            className={`px-5 py-1 cursor-pointer text-[13px] transition ${
              activeRange === range
                ? "bg-[#331400] shadow-[3px_3px_0px_0px_rgba(0,0,0,0.5)] text-white"
                : "border border-black/30 text-black"
            }`}
          >
            {range}
          </button>
        ))}
      </div>

      {/* FLOATING METRIC ORBS */}
      <MetricOrb label="VIEWS" value="0" className="left-[22%] top-[45%]" />
      <MetricOrb
        label="CLICKS"
        value="0"
        className="right-[18%] top-[48%]"
        delay={0.2}
      />
      <MetricOrb
        label="CTR"
        value="0%"
        small
        className="right-[30%] bottom-[22%]"
        delay={0.4}
      />

      {/* CENTERED PHONE DISPLAY */}
      <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
          className="pointer-events-auto w-full max-w-[360px] md:max-w-[420px] mx-auto"
        >
          <PhoneDisplay
            buttonStyle={buttonStyle}
            fontStyle={fontStyle}
            selectedTheme={selectedTheme}
            profile={profile}
            links={links}
            phoneDisplayLoading={phoneDisplayLoading}
          />
        </motion.div>
      </div>
    </div>
  );
}

/* ------------------ METRIC ORB (Desktop) ------------------ */
function MetricOrb({
  label,
  value,
  className,
  delay = 0,
  small = false,
}: {
  label: string;
  value: string;
  className: string;
  delay?: number;
  small?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{
        opacity: 1,
        scale: 1,
        y: [0, -10, 0],
      }}
      transition={{
        opacity: { delay },
        scale: { delay },
        y: {
          delay,
          repeat: Infinity,
          duration: 4,
          ease: "easeInOut",
        },
      }}
      className={`absolute ${className} ${
        small ? "w-[90px] h-[90px]" : "w-[120px] h-[120px]"
      } bg-[#FED45C] shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)]
        flex flex-col items-center justify-center text-black`}
    >
      <p className="text-[11px] opacity-60 tracking-wider">{label}</p>
      <p className={`font-bold ${small ? "text-[22px]" : "text-[30px]"}`}>
        {value}
      </p>
    </motion.div>
  );
}

/* ------------------ METRIC CARD (Mobile) ------------------ */
function MetricCardMobile({
  label,
  value,
  className,
  small = false,
}: {
  label: string;
  value: string;
  className: string;
  small?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={`${className} p-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.3)]
        flex flex-col items-center justify-center text-black min-h-[100px]`}
    >
      <p className="text-xs opacity-70 tracking-wider mb-1">{label}</p>
      <p className={`font-bold ${small ? "text-[20px]" : "text-[24px]"}`}>
        {value}
      </p>
    </motion.div>
  );
}

/* ------------------ STAT ROW (Mobile) ------------------ */
function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-black/5 last:border-b-0">
      <span className="text-sm text-black/70">{label}</span>
      <span className="text-sm font-semibold text-black">{value}</span>
    </div>
  );
}