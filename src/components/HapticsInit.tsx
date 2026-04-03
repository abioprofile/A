"use client";

import { useEffect } from "react";

/**
 * Mounted once at the root layout. Adds a passive touchstart listener that
 * fires a short 8ms vibration whenever the user taps any enabled button or
 * element with role="button". Works on mobile only (desktop has no vibrate API).
 */
export function HapticsInit() {
  useEffect(() => {
    if (typeof navigator === "undefined" || !("vibrate" in navigator)) return;

    const handler = (e: TouchEvent) => {
      const target = e.target as HTMLElement;
      const interactive =
        target.tagName === "BUTTON"
          ? target
          : target.closest("button") ??
            (target.getAttribute("role") === "button" ? target : null) ??
            target.closest("[role='button']");

      if (interactive && !(interactive as HTMLButtonElement).disabled) {
        navigator.vibrate(8);
      }
    };

    document.addEventListener("touchstart", handler, { passive: true });
    return () => document.removeEventListener("touchstart", handler);
  }, []);

  return null;
}
