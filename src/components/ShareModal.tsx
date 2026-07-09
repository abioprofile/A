"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { XIcon, CheckIcon, type LucideIcon } from "lucide-react";
import { PLATFORMS as IMPORTED_PLATFORMS } from "@/data";
import Image from "next/image";

// ─── SVG Icons (only custom ones not in your data)

const CopyLinkIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
    <path
      d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const NativeShareIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
    <path
      d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// ─── Types

export type ShareMode = "profile" | "link";

export interface ShareTarget {
  url: string;
  title?: string;
}

interface Platform {
  id: string;
  label: string;
  icon: React.ReactNode;
  build: (encoded: string) => string;
}

// ─── Helper function to render platform icon (same as Platforms page)

const renderPlatformIcon = (platform: typeof IMPORTED_PLATFORMS[number], size: number = 48) => {
  // Check if it's a Lucide icon component
  if (platform.isReactIcon && platform.icon) {
    const IconComponent = platform.icon as LucideIcon;
    // Set colors for specific icons
    let color = "#331400";
    if (platform.id === "gmail") {
      color = "#EA4335";
    } else if (platform.id === "phone") {
      color = "#34A853";
    }
    return <IconComponent size={size} color={color} strokeWidth={1.5} />;
  }

  // For string paths (SVG files)
  if (typeof platform.icon === "string") {
    return (
      <Image
        src={platform.icon}
        alt={platform.name}
        width={size}
        height={size}
        className="object-contain"
      />
    );
  }

  return null;
};

// ─── Map imported platforms to share format

const PLATFORMS: Platform[] = IMPORTED_PLATFORMS.map((p) => {
  // Build share URL based on platform
  const buildShareUrl = (encoded: string) => {
    const shareUrls: Record<string, string> = {
      whatsapp: `https://wa.me/?text=${encoded}`,
      X: `https://twitter.com/intent/tweet?url=${encoded}`,
      telegram: `https://t.me/share/url?url=${encoded}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encoded}`,
      gmail: `mailto:?body=${encoded}`,
      // Add more platforms as needed
    };
    return shareUrls[p.id] || `https://${p.id}.com/share?url=${encoded}`;
  };

  return {
    id: p.id,
    label: p.name,
    icon: renderPlatformIcon(p, 48),
    build: buildShareUrl,
  };
});

// Add the "copy" platform at the beginning
const COPY_PLATFORM: Platform = {
  id: "copy",
  label: "Copy link",
  icon: <CopyLinkIcon />,
  build: () => "",
};

const NATIVE_PLATFORM: Platform = {
  id: "native",
  label: "Share",
  icon: <NativeShareIcon />,
  build: () => "",
};

// ─── Hooks

function useIsMobile(): boolean {
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 1023px)");
    setMobile(mq.matches);
    const h = (e: MediaQueryListEvent) => setMobile(e.matches);
    mq.addEventListener("change", h);
    return () => mq.removeEventListener("change", h);
  }, []);
  return mobile;
}

function useNativeShare(): boolean {
  const [ok, setOk] = useState(false);
  useEffect(() => {
    setOk(typeof navigator !== "undefined" && !!navigator.share);
  }, []);
  return ok;
}

function useClipboard(timeout = 2000) {
  const [copied, setCopied] = useState(false);
  const t = useRef<ReturnType<typeof setTimeout> | null>(null);
  const copy = useCallback(
    async (text: string) => {
      try {
        await navigator.clipboard.writeText(text);
      } catch {
        const el = document.createElement("textarea");
        el.value = text;
        el.style.cssText = "position:fixed;opacity:0";
        document.body.appendChild(el);
        el.select();
        document.execCommand("copy");
        document.body.removeChild(el);
      }
      setCopied(true);
      if (t.current) clearTimeout(t.current);
      t.current = setTimeout(() => setCopied(false), timeout);
    },
    [timeout],
  );
  useEffect(
    () => () => {
      if (t.current) clearTimeout(t.current);
    },
    [],
  );
  return { copied, copy };
}

function useBodyScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [active]);
}

function useFocusTrap(
  ref: React.RefObject<HTMLElement | null>,
  active: boolean,
) {
  useEffect(() => {
    if (!active || !ref.current) return;
    const el = ref.current;
    const sel =
      'button,[href],input,select,textarea,[tabindex]:not([tabindex="-1"])';
    const nodes = el.querySelectorAll<HTMLElement>(sel);
    const first = nodes[0],
      last = nodes[nodes.length - 1];
    first?.focus();
    const h = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };
    el.addEventListener("keydown", h);
    return () => el.removeEventListener("keydown", h);
  }, [active, ref]);
}

// ─── Share content

function ShareContent({
  target,
  mode,
  onClose,
}: {
  target: ShareTarget;
  mode: ShareMode;
  onClose: () => void;
}) {
  const { copied, copy } = useClipboard();
  const nativeOk = useNativeShare();

  const handle = async (id: string) => {
    if (id === "copy") {
      await copy(target.url);
      return;
    }
    if (id === "native") {
      try {
        await navigator.share({ url: target.url, title: target.title });
      } catch {}
      onClose();
      return;
    }
    const p = PLATFORMS.find((x) => x.id === id);
    if (!p) return;
    window.open(
      p.build(encodeURIComponent(target.url)),
      "_blank",
      "noopener,noreferrer",
    );
    onClose();
  };

  const platforms = nativeOk ? [COPY_PLATFORM, NATIVE_PLATFORM, ...PLATFORMS] : [COPY_PLATFORM, ...PLATFORMS];

  return (
    <div className="px-5 pb-5">
      {/* URL bar */}
      <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 px-4 py-3 mb-5">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="w-4 h-4 text-gray-400 flex-shrink-0"
        >
          <path
            d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span className="text-xs text-gray-600 truncate flex-1 font-mono">
          {target.url.replace(/^https?:\/\//, "")}
        </span>
        <motion.button
          whileTap={{ scale: 0.88 }}
          onClick={() => handle("copy")}
          className="flex-shrink-0 flex items-center gap-1.5 bg-white border border-gray-200 px-3 py-1.5 text-xs font-semibold hover:bg-gray-50 transition-colors"
          style={{ minWidth: 64 }}
          aria-label="Copy link"
        >
          <AnimatePresence mode="wait" initial={false}>
            {copied ? (
              <motion.span
                key="y"
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-1 text-green-600"
              >
                <CheckIcon className="w-3 h-3" /> Copied
              </motion.span>
            ) : (
              <motion.span
                key="n"
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="text-gray-700"
              >
                Copy
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      {/* Platform row - No background box, just icons */}
      <div
        className="flex gap-6 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden"
        style={{ scrollbarWidth: "none" }}
      >
        {platforms.map((p) => (
          <motion.button
            key={p.id}
            whileTap={{ scale: 0.88 }}
            whileHover={{ scale: 1.1, y: -2 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            onClick={() => handle(p.id)}
            className="flex flex-col items-center gap-2 flex-shrink-0 focus:outline-none"
            aria-label={p.label}
          >
            <div className="w-12 h-12 flex items-center justify-center">
              {p.icon}
            </div>
            <span className="text-[8px] font-medium text-gray-500 whitespace-nowrap">
              {p.label}
            </span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}

// ─── Desktop modal

function DesktopShareModal({
  target,
  mode,
  isOpen,
  onClose,
}: {
  target: ShareTarget;
  mode: ShareMode;
  isOpen: boolean;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useBodyScrollLock(isOpen);
  useFocusTrap(ref, isOpen);

  useEffect(() => {
    if (!isOpen) return;
    const h = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="bd"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-[400] bg-black/40 backdrop-blur-[6px]"
            onClick={onClose}
            aria-hidden="true"
          />

          <motion.div
            key="md"
            initial={{ opacity: 0, scale: 0.93, y: 14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.93, y: 14 }}
            transition={{
              type: "spring",
              damping: 26,
              stiffness: 380,
              mass: 0.7,
            }}
            className="fixed inset-0 z-[410] flex items-center justify-center pointer-events-none"
          >
            <div
              ref={ref}
              role="dialog"
              aria-modal="true"
              aria-label="Share"
              className="
pointer-events-auto
w-full
bg-white
overflow-hidden
border border-black/[0.04]
shadow-[0_8px_40px_rgba(0,0,0,0.12)]
"
              style={{
                width: "100%",
                maxWidth: 360,
                borderRadius: 0,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-gray-100">
                <h2 className="text-base font-bold text-gray-900">
                  {mode === "link" ? "Share link" : "Share profile"}
                </h2>
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
                  aria-label="Close"
                >
                  <XIcon className="w-4 h-4 text-gray-500" />
                </button>
              </div>

              <div className="pt-4">
                <ShareContent target={target} mode={mode} onClose={onClose} />
              </div>

              {mode === "profile" && (
                <div className="mx-5 mb-5 pt-4 border-t border-gray-100">
                  <p className="text-xs font-semibold text-gray-800 mb-0.5">
                    Share your Abio profile
                  </p>
                  <p className="text-xs text-gray-500">
                    Let others find all your links in one place.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ─── Mobile sheet

function MobileShareSheet({
  target,
  mode,
  isOpen,
  onClose,
}: {
  target: ShareTarget;
  mode: ShareMode;
  isOpen: boolean;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useBodyScrollLock(isOpen);
  useFocusTrap(ref, isOpen);

  useEffect(() => {
    if (!isOpen) return;
    const h = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="bd"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[400] bg-black/45 backdrop-blur-[2px]"
            onClick={onClose}
            aria-hidden="true"
          />

          <motion.div
            ref={ref}
            key="sh"
            role="dialog"
            aria-modal="true"
            aria-label="Share"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{
              type: "spring",
              damping: 32,
              stiffness: 360,
              mass: 0.8,
            }}
            className="fixed bottom-0 left-0 right-0 z-[410] bg-white overflow-hidden"
            style={{
              borderRadius: "0px 0px 0 0",
              paddingBottom: "env(safe-area-inset-bottom, 16px)",
            }}
          >
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-9 h-1 bg-gray-300 rounded-full" />
            </div>

            <div className="flex items-center justify-between px-5 pb-4 border-b border-gray-100">
              <h2 className="text-sm font-bold text-gray-900">
                {mode === "link" ? "Share link" : "Share profile"}
              </h2>
              <button
                onClick={onClose}
                className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Close"
              >
                <XIcon className="w-4 h-4 text-gray-500" />
              </button>
            </div>

            <div className="pt-4">
              <ShareContent target={target} mode={mode} onClose={onClose} />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ─── Main export

export interface ShareModalProps {
  url: string;
  title?: string;
  mode?: ShareMode;
  trigger: React.ReactElement;
}

export default function ShareModal({
  url,
  title,
  mode = "profile",
  trigger,
}: ShareModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useIsMobile();
  const target: ShareTarget = { url, title };
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      <span
        onClick={open}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && open()}
        aria-label={`Share ${mode === "link" ? title || "link" : "profile"}`}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        className="cursor-pointer"
        style={{ display: "contents" }}
      >
        {trigger}
      </span>

      {mounted &&
        createPortal(
          isMobile ? (
            <MobileShareSheet
              target={target}
              mode={mode}
              isOpen={isOpen}
              onClose={close}
            />
          ) : (
            <DesktopShareModal
              target={target}
              mode={mode}
              isOpen={isOpen}
              onClose={close}
            />
          ),
          document.body,
        )}
    </>
  );
}

// ─── LinkShareButton

export function LinkShareButton({
  url,
  title,
  fontColor = "#ffffff",
  isMobile = false,
}: {
  url: string;
  title: string;
  fontColor?: string;
  isMobile?: boolean;
}) {
  return (
    <ShareModal
      url={url}
      title={title}
      mode="link"
      trigger={
        <motion.span
          whileHover={{ opacity: 1 }}
          whileTap={{ scale: 0.85 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
          className={[
            "flex items-center justify-center px-3 self-stretch",
            "transition-opacity duration-150 flex-shrink-0",
          ].join(" ")}
          style={{ color: fontColor }}
          aria-label={`Share ${title}`}
          role="button"
        >
          <svg
            viewBox="0 0 4 18"
            fill="currentColor"
            style={{ width: 3, height: 14 }}
          >
            <circle cx="2" cy="2" r="2" />
            <circle cx="2" cy="9" r="2" />
            <circle cx="2" cy="16" r="2" />
          </svg>
        </motion.span>
      }
    />
  );
}