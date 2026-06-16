"use client";

import { useEffect, useCallback } from "react";

export const LINK_CHANNEL_NAME = "abio-links-sync";

export type LinkBroadcastMessage = {
  type: "LINKS_UPDATED";
  timestamp: number;
};

/**
 * Publish a LINKS_UPDATED broadcast to all other tabs/windows of the same origin.
 * Used by the dashboard whenever a link mutation succeeds.
 */
export function useLinkBroadcastPublisher() {
  const broadcast = useCallback(() => {
    if (typeof window === "undefined") return;
    try {
      const channel = new BroadcastChannel(LINK_CHANNEL_NAME);
      channel.postMessage({ type: "LINKS_UPDATED", timestamp: Date.now() } satisfies LinkBroadcastMessage);
      channel.close();
    } catch {
      // BroadcastChannel not available in some environments – silently skip
    }
  }, []);

  return { broadcast };
}

/**
 * Subscribe to LINKS_UPDATED broadcasts from other tabs.
 * Used by the public profile page to refetch instantly when the owner edits.
 */
export function useLinkBroadcastSubscriber(onUpdate: () => void) {
  useEffect(() => {
    if (typeof window === "undefined") return;
    let channel: BroadcastChannel | null = null;
    try {
      channel = new BroadcastChannel(LINK_CHANNEL_NAME);
      channel.onmessage = (event: MessageEvent<LinkBroadcastMessage>) => {
        if (event.data?.type === "LINKS_UPDATED") {
          onUpdate();
        }
      };
    } catch {
      // BroadcastChannel not available – fall back to polling only
    }
    return () => {
      channel?.close();
    };
  }, [onUpdate]);
}
