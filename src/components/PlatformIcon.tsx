"use client";

import React, { useState, useEffect } from "react";
import { FaLink } from "react-icons/fa6";
import { getPlatformIconUrl } from "@/data/platformIconMap";

// Module-level cache: key = "platform:variant" → processed SVG string
const svgCache = new Map<string, string>();

interface PlatformSvgIconProps {
  platform: string;
  className?: string;
  /** "black" = uses currentColor (responds to parent color). "colored" = original colors. */
  variant?: "black" | "colored";
}

/**
 * Renders a platform icon as an inline SVG so it responds to CSS `color`
 * (via currentColor) just like text. Black variant is the default — it will
 * follow whatever color you set on the parent element.
 */
export function PlatformSvgIcon({
  platform,
  className = "w-5 h-5",
  variant = "black",
}: PlatformSvgIconProps) {
  const cacheKey = `${platform}:${variant}`;
  const [svgHtml, setSvgHtml] = useState<string>(svgCache.get(cacheKey) ?? "");

  useEffect(() => {
    if (svgCache.has(cacheKey)) {
      setSvgHtml(svgCache.get(cacheKey)!);
      return;
    }
    const url = getPlatformIconUrl(platform, variant);
    if (!url) return;

    fetch(url)
      .then((r) => r.text())
      .then((raw) => {
        let svg = raw;
        if (variant === "black") {
          // Replace all fill/stroke that aren't "none" with currentColor so the
          // icon inherits the CSS color property from its container.
          svg = svg
            .replace(/fill="(?!none\b)[^"]*"/gi, 'fill="currentColor"')
            .replace(/stroke="(?!none\b)[^"]*"/gi, 'stroke="currentColor"');
        }
        // Strip fixed width/height so the SVG scales with the wrapper span
        svg = svg.replace(/(<svg\b[^>]*?)\s+width="[^"]*"/i, "$1");
        svg = svg.replace(/(<svg\b[^>]*?)\s+height="[^"]*"/i, "$1");
        // Set explicit 100% so it fills the container
        svg = svg.replace(/<svg\b/, '<svg width="100%" height="100%"');
        svgCache.set(cacheKey, svg);
        setSvgHtml(svg);
      })
      .catch(() => {
        /* no icon available — fallback renders */
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cacheKey]);

  if (!svgHtml) {
    // Fallback: generic link icon while loading or if platform not in icon pack
    return <FaLink className={className} />;
  }

  return (
    <span
      className={`inline-flex items-center justify-center shrink-0 ${className}`}
      style={{ fontSize: 0, lineHeight: 0 }}
      // SVG is from our own public folder — safe to inject
      dangerouslySetInnerHTML={{ __html: svgHtml }}
    />
  );
}

/**
 * Returns a platform icon node. Used in PhoneDisplay, [username]/page, etc.
 * The icon inherits color from the parent via CSS `color` (currentColor).
 */
export function getPlatformIcon(
  platform: string,
  className: string = "w-5 h-5",
): React.ReactNode {
  return <PlatformSvgIcon platform={platform} className={className} variant="black" />;
}
