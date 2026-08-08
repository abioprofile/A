"use client";

import type React from "react";
import { motion, AnimatePresence } from "framer-motion";
function Bone({
  className = "",
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return <div className={`skeleton skeleton--shimmer ${className}`} style={style} />;
}

// ─── Single link-card skeleton ────────────────────────────────────────────
export function SkeletonLinkCard() {
  return (
    <div className="py-2 md:py-3">
      <div className="p-px md:p-[2px]">
        <div className="bg-[#FAFAFC] shadow-sm p-4">
          {/* Top row */}
          <div className="flex items-center gap-2 md:gap-3">
            {/* Drag handle dots */}
            <div className="flex flex-col gap-1 shrink-0">
              {[0, 1, 2].map((i) => (
                <div key={i} className="flex gap-1">
                  <span className="w-1 h-1 rounded-full skeleton" />
                  <span className="w-1 h-1 rounded-full skeleton" />
                </div>
              ))}
            </div>
            {/* Icon circle */}
            <Bone className="w-8 h-8 shrink-0" style={{ borderRadius: "50%" }} />
            {/* Text lines */}
            <div className="flex-1 min-w-0 space-y-2">
              <Bone className="h-[14px] w-36" />
              <Bone className="h-[11px] w-52" />
            </div>
          </div>
          {/* Bottom action row */}
          <div className="flex items-center justify-between mt-3">
            <Bone className="h-[11px] w-14" />
            <div className="flex items-center gap-3">
              <Bone className="h-5 w-9" style={{ borderRadius: "9999px" }} />
              <Bone className="h-4 w-4" />
              <Bone className="h-4 w-4" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Stack of link-card skeletons ─────────────────────────────────────────
export function SkeletonLinkList({ count = 4 }: { count?: number }) {
  return (
    <div>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonLinkCard key={i} />
      ))}
    </div>
  );
}

// ─── Dashboard profile header skeleton ───────────────────────────────────
export function SkeletonDashboardProfile() {
  return (
    <div className="max-w-3xl flex gap-4 items-center px-8">
      <Bone className="w-24 h-24 shrink-0" style={{ borderRadius: "50%" }} />
      <div className="space-y-2.5 flex-1">
        <Bone className="h-6 w-40" />
        <Bone className="h-3 w-24" />
        <Bone className="h-4 w-32" />
        <Bone className="h-6 w-28" />
      </div>
    </div>
  );
}

// ─── Public profile page skeleton (full-page) 
export function SkeletonPublicProfile() {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="skeleton"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="min-h-screen bg-[#FEF4EA] dark:bg-[#15100C] overflow-hidden"
      >
        {/* Desktop Layout with Blurred Sides */}
        <div className="hidden lg:flex items-center justify-center min-h-screen">
          <div className="fixed left-0 top-0 bottom-0 w-1/4 bg-gradient-to-r from-[#FEF4EA]/70 dark:from-[#15100C]/70 to-transparent backdrop-blur-[2px] z-10" />

          <div className="relative z-20 mx-auto w-[300px]">
            <div className="relative w-full h-[600px] border-[2px] border-black dark:border-[#3a2c20] overflow-hidden bg-white dark:bg-[#1C1611] shadow-2xl">
              <div className="w-full h-full bg-white dark:bg-[#1C1611] overflow-hidden relative flex flex-col">
                {/* Profile Card Skeleton */}
                <div className="relative z-20 bg-white/90 dark:bg-[#1C1611]/90 p-4 backdrop-blur-xl">
                  <div className="flex items-center gap-3">
                    {/* Avatar Skeleton */}
                    <div className="w-[60px] h-[60px] rounded-full bg-gray-200 dark:bg-[#2b2119] animate-pulse" />

                    <div>
                      {/* Name Skeleton */}
                      <div className="flex items-center gap-1">
                        <div className="h-4 w-32 bg-gray-200 dark:bg-[#2b2119] rounded animate-pulse" />
                        <div className="w-4 h-4 bg-gray-200 dark:bg-[#2b2119] rounded-full animate-pulse" />
                      </div>
                      {/* Username Skeleton */}
                      <div className="h-3 w-20 bg-gray-200 dark:bg-[#2b2119] rounded mt-1 animate-pulse" />
                    </div>
                  </div>

                  {/* Bio Skeleton */}
                  <div className="mt-2 space-y-1">
                    <div className="h-3 w-full bg-gray-200 dark:bg-[#2b2119] rounded animate-pulse" />
                    <div className="h-3 w-3/4 bg-gray-200 dark:bg-[#2b2119] rounded animate-pulse" />
                  </div>

                  {/* Location Skeleton */}
                  <div className="inline-flex items-center gap-1 mb-5 mt-2">
                    <div className="w-3 h-3 bg-gray-200 dark:bg-[#2b2119] rounded animate-pulse" />
                    <div className="h-2 w-24 bg-gray-200 dark:bg-[#2b2119] rounded animate-pulse" />
                  </div>

                  {/* Tabs Skeleton */}
                  <div className="mt-4 flex absolute bottom-0 gap-8">
                    <div className="relative flex flex-col items-center pb-2">
                      <div className="h-3 w-8 bg-gray-200 dark:bg-[#2b2119] rounded animate-pulse" />
                    </div>
                    <div className="relative flex flex-col items-center pb-2">
                      <div className="h-3 w-10 bg-gray-200 dark:bg-[#2b2119] rounded animate-pulse" />
                    </div>
                  </div>
                </div>

                {/* Links Content Skeleton */}
                <div className="relative z-20 px-6 pt-4 pb-6 overflow-y-auto flex-1 min-h-0">
                  <div className="space-y-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div
                        key={i}
                        className="w-full flex items-center gap-3 px-4 py-2 rounded-lg bg-gray-100 dark:bg-[#221a14] animate-pulse"
                        style={{ height: "48px" }}
                      >
                        <div className="w-4 h-4 bg-gray-200 dark:bg-[#2b2119] rounded" />
                        <div className="h-4 flex-1 bg-gray-200 dark:bg-[#2b2119] rounded" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="fixed right-0 top-0 bottom-0 w-1/4 bg-gradient-to-l from-[#FEF4EA]/70 dark:from-[#15100C]/70 to-transparent backdrop-blur-[2px] z-10" />
        </div>

        {/* Mobile Layout Skeleton */}
        <div className="lg:hidden w-full min-h-screen bg-[#FEF4EA] dark:bg-[#15100C]">
          <div className="relative z-10 w-full min-h-screen flex flex-col">
            {/* Profile Card Skeleton - Mobile */}
            <div className="bg-white/90 dark:bg-[#1C1611]/90 p-4 backdrop-blur-xl">
              <div className="flex items-center gap-3">
                {/* Avatar Skeleton */}
                <div className="w-[70px] h-[70px] rounded-full bg-gray-200 dark:bg-[#2b2119] animate-pulse" />

                <div>
                  {/* Name Skeleton */}
                  <div className="flex items-center gap-1">
                    <div className="h-5 w-36 bg-gray-200 dark:bg-[#2b2119] rounded animate-pulse" />
                    <div className="w-4 h-4 bg-gray-200 dark:bg-[#2b2119] rounded-full animate-pulse" />
                  </div>
                  {/* Username Skeleton */}
                  <div className="h-4 w-24 bg-gray-200 dark:bg-[#2b2119] rounded mt-1 animate-pulse" />
                </div>
              </div>

              {/* Bio Skeleton */}
              <div className="mt-2 space-y-1">
                <div className="h-3 w-full bg-gray-200 dark:bg-[#2b2119] rounded animate-pulse" />
                <div className="h-3 w-3/4 bg-gray-200 dark:bg-[#2b2119] rounded animate-pulse" />
              </div>

              {/* Location Skeleton */}
              <div className="inline-flex items-center gap-1 mt-3 mb-6">
                <div className="w-3 h-3 bg-gray-200 dark:bg-[#2b2119] rounded animate-pulse" />
                <div className="h-2 w-28 bg-gray-200 dark:bg-[#2b2119] rounded animate-pulse" />
              </div>

              {/* Tabs Skeleton */}
              <div className="mt-4 flex absolute bottom-0 gap-8">
                <div className="relative flex flex-col items-center pb-2">
                  <div className="h-3 w-8 bg-gray-200 dark:bg-[#2b2119] rounded animate-pulse" />
                </div>
                <div className="relative flex flex-col items-center pb-2">
                  <div className="h-3 w-10 bg-gray-200 dark:bg-[#2b2119] rounded animate-pulse" />
                </div>
              </div>
            </div>

            {/* Links Content Skeleton - Mobile */}
            <div className="overflow-y-auto flex-1 min-h-0 px-6 pt-4 pb-6">
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-gray-100 dark:bg-[#221a14] animate-pulse"
                    style={{ height: "52px" }}
                  >
                    <div className="w-4 h-4 bg-gray-200 dark:bg-[#2b2119] rounded" />
                    <div className="h-4 flex-1 bg-gray-200 dark:bg-[#2b2119] rounded" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Join Button Skeleton */}
        <div className="fixed bottom-4 left-1/2 z-[110] -translate-x-1/2">
          <div className="w-32 h-10 bg-gray-200 dark:bg-[#2b2119] rounded animate-pulse" />
        </div>

        {/* QR Code Skeleton */}
        <div className="fixed bottom-4 right-4 z-[100] hidden md:block">
          <div className="border border-gray-200 dark:border-[#3a2c20] bg-white dark:bg-[#1C1611] p-2 shadow-lg">
            <div className="w-[88px] h-[88px] bg-gray-200 dark:bg-[#2b2119] animate-pulse" />
            <div className="h-2 w-20 bg-gray-200 dark:bg-[#2b2119] rounded mt-1 animate-pulse mx-auto" />
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

// ─── Phone display skeleton ─
export function SkeletonPhoneDisplay() {
  return (
    <div className="relative w-full max-w-[285px] md:max-w-[300px] h-[67vh] md:h-[600px] mx-auto border-[2px] border-gray-200 overflow-hidden bg-[#f5f5f5]">
      <div className="p-4 space-y-3">
        <div className="flex gap-3 items-center">
          <Bone className="w-12 h-12 shrink-0" style={{ borderRadius: "50%" }} />
          <div className="space-y-2 flex-1">
            <Bone className="h-4 w-24" />
            <Bone className="h-3 w-16" />
          </div>
        </div>
        <Bone className="h-3 w-48" />
        <Bone className="h-4 w-20" />
        {/* Tabs */}
        <div className="flex gap-4 pt-1">
          <Bone className="h-3 w-10" />
          <Bone className="h-3 w-14" />
        </div>
      </div>
      <div className="px-6 space-y-3 pt-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Bone key={i} className="h-10 w-full" />
        ))}
      </div>
    </div>
  );
}

// ─── Stat card skeleton ─
export function SkeletonStatCard() {
  return (
    <div className="bg-white border p-4 space-y-3">
      <Bone className="h-4 w-24" />
      <Bone className="h-8 w-16" />
      <Bone className="h-3 w-32" />
    </div>
  );
}

// ─── Settings form skeleton ───────────────────────────────────────────────
export function SkeletonSettingsForm() {
  return (
    <div className="space-y-4 max-w-lg">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="space-y-1.5">
          <Bone className="h-3 w-20" />
          <Bone className="h-10 w-full" />
        </div>
      ))}
      <Bone className="h-10 w-32 mt-2" />
    </div>
  );
}

