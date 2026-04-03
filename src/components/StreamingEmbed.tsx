"use client";

// Minimal shape — compatible with ProfileLink and the local UserLink in [username]/page.tsx
export interface StreamingLinkLike {
  id: string;
  title: string;
  url: string;
  platform: string;
  displayOrder: number;
  isVisible: boolean;
}

const STREAMING_IDS = [
  "spotify",
  "apple-music",
  "soundcloud",
  "tidal",
  "amazon-music",
];

export const STREAMING_PLATFORM_IDS_SET = new Set(STREAMING_IDS);

export function hasStreamingLinks(links: StreamingLinkLike[]): boolean {
  return links.some(
    (l) =>
      l.isVisible !== false &&
      STREAMING_PLATFORM_IDS_SET.has(l.platform.toLowerCase().replace(/\s+/g, "-")),
  );
}

export function getStreamingLinks<T extends StreamingLinkLike>(links: T[]): T[] {
  return links
    .filter(
      (l) =>
        l.isVisible !== false &&
        STREAMING_PLATFORM_IDS_SET.has(l.platform.toLowerCase().replace(/\s+/g, "-")),
    )
    .sort((a, b) => a.displayOrder - b.displayOrder);
}
