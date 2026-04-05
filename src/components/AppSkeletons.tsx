"use client";

import type React from "react";

/**
 * App-specific skeleton components.
 *
 * Uses the `.skeleton.skeleton--shimmer` CSS classes for the premium
 * left-to-right shimmer effect defined in globals.css.
 * Shapes match their real counterparts 1:1 — zero layout shift on load.
 */

// ─── Atomic shimmer block ─────────────────────────────────────────────────
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

// ─── Public profile page skeleton (full-page) ────────────────────────────
export function SkeletonPublicProfile() {
  return (
    <div className="min-h-screen bg-neutral-100 flex flex-col items-center pt-10 px-4">
      <Bone className="w-24 h-24 mb-4" style={{ borderRadius: "50%" }} />
      <Bone className="h-6 w-36 mb-2" />
      <Bone className="h-3 w-24 mb-3" />
      <Bone className="h-3 w-64 mb-1.5" />
      <Bone className="h-3 w-48 mb-5" />
      <Bone className="h-5 w-28 mb-7" />
      <div className="flex gap-6 mb-6">
        <Bone className="h-4 w-12" />
        <Bone className="h-4 w-16" />
      </div>
      <div className="w-full max-w-sm space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Bone key={i} className="h-11 w-full" />
        ))}
      </div>
    </div>
  );
}

// ─── Phone display skeleton ───────────────────────────────────────────────
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

// ─── Stat card skeleton ───────────────────────────────────────────────────
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

