"use client";

/**
 * App-specific skeleton components.
 * All shapes match their real counterparts 1:1 so the layout doesn't shift
 * when content loads in.
 */

import { Skeleton } from "@/components/ui/skeleton";

// ─── Shared pulse block ────────────────────────────────────────────────────
function S({ className }: { className?: string }) {
  return <Skeleton className={`${className ?? ""}`} />;
}

// ─── Single link-card skeleton ─────────────────────────────────────────────
export function SkeletonLinkCard() {
  return (
    <div className="py-2 md:py-3">
      <div className="p-px md:p-[2px]">
        <div className="bg-[#FAFAFC] shadow-lg p-4">
          {/* Top row */}
          <div className="flex items-center gap-2 md:gap-3">
            {/* Drag dots */}
            <div className="flex flex-col gap-1">
              {[0, 1, 2].map((i) => (
                <div key={i} className="flex gap-1">
                  <span className="w-1 h-1 rounded-full bg-gray-200 animate-pulse" />
                  <span className="w-1 h-1 rounded-full bg-gray-200 animate-pulse" />
                </div>
              ))}
            </div>
            {/* Icon */}
            <S className="w-8 h-8 rounded-full shrink-0" />
            {/* Text */}
            <div className="flex-1 min-w-0 space-y-1.5">
              <S className="h-4 w-36 rounded" />
              <S className="h-3 w-52 rounded" />
            </div>
          </div>
          {/* Bottom row */}
          <div className="flex items-center justify-between mt-3">
            <S className="h-3 w-14 rounded" />
            <div className="flex items-center gap-3">
              <S className="h-5 w-9 rounded-full" />
              <S className="h-4 w-4 rounded" />
              <S className="h-4 w-4 rounded" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── A stack of link-card skeletons ───────────────────────────────────────
export function SkeletonLinkList({ count = 4 }: { count?: number }) {
  return (
    <div>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonLinkCard key={i} />
      ))}
    </div>
  );
}

// ─── Dashboard profile header skeleton ────────────────────────────────────
export function SkeletonDashboardProfile() {
  return (
    <div className="max-w-3xl flex gap-4 items-center px-8">
      <S className="w-24 h-24 rounded-full shrink-0" />
      <div className="space-y-2 flex-1">
        <S className="h-6 w-40 rounded" />
        <S className="h-3 w-24 rounded" />
        <S className="h-4 w-32 rounded" />
        <S className="h-6 w-28 rounded" />
      </div>
    </div>
  );
}

// ─── Public profile page skeleton (full-page) ─────────────────────────────
export function SkeletonPublicProfile() {
  return (
    <div className="min-h-screen bg-neutral-100 flex flex-col items-center pt-8 px-4">
      {/* Avatar */}
      <S className="w-24 h-24 rounded-full mb-4" />
      {/* Name */}
      <S className="h-6 w-36 rounded mb-2" />
      {/* Username */}
      <S className="h-3 w-24 rounded mb-3" />
      {/* Bio */}
      <S className="h-3 w-64 rounded mb-1" />
      <S className="h-3 w-48 rounded mb-4" />
      {/* Location badge */}
      <S className="h-5 w-28 rounded mb-6" />
      {/* Tabs */}
      <div className="flex gap-6 mb-6">
        <S className="h-4 w-12 rounded" />
        <S className="h-4 w-16 rounded" />
      </div>
      {/* Link buttons */}
      <div className="w-full max-w-sm space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <S key={i} className="h-11 w-full rounded-sm" />
        ))}
      </div>
    </div>
  );
}

// ─── Appearance page phone-display skeleton ────────────────────────────────
export function SkeletonPhoneDisplay() {
  return (
    <div className="relative w-full max-w-[285px] md:max-w-[300px] h-[67vh] md:h-[600px] mx-auto border-[2px] border-gray-200 overflow-hidden bg-gray-50 animate-pulse">
      <div className="p-4 space-y-3">
        <div className="flex gap-3 items-center">
          <S className="w-12 h-12 rounded-full" />
          <div className="space-y-1.5 flex-1">
            <S className="h-4 w-24 rounded" />
            <S className="h-3 w-16 rounded" />
          </div>
        </div>
        <S className="h-3 w-48 rounded" />
        <S className="h-4 w-20 rounded" />
      </div>
      <div className="px-6 space-y-3 pt-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <S key={i} className="h-10 w-full rounded-sm" />
        ))}
      </div>
    </div>
  );
}

// ─── Statistics / analytics card skeleton ─────────────────────────────────
export function SkeletonStatCard() {
  return (
    <div className="bg-white border p-4 space-y-3 rounded">
      <S className="h-4 w-24 rounded" />
      <S className="h-8 w-16 rounded" />
      <S className="h-3 w-32 rounded" />
    </div>
  );
}

// ─── Account settings form skeleton ───────────────────────────────────────
export function SkeletonSettingsForm() {
  return (
    <div className="space-y-4 max-w-lg">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="space-y-1.5">
          <S className="h-3 w-20 rounded" />
          <S className="h-10 w-full rounded" />
        </div>
      ))}
      <S className="h-10 w-32 rounded mt-2" />
    </div>
  );
}
