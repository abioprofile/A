"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { XIcon, CheckIcon } from "lucide-react";

// ─── SVG Icons (exact brand colors + shapes like Linktree) ───────────────────

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

const XTwitterIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.259 5.631 5.905-5.631zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const TelegramIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
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
  bgColor: string;
  iconColor: string;
  build: (encoded: string) => string;
}

const PLATFORMS: Platform[] = [
  {
    id: "copy",
    label: "Copy link",
    icon: <CopyLinkIcon />,
    bgColor: "#E8E8E8",
    iconColor: "#1a1a1a",
    build: () => "",
  },
  {
    id: "twitter",
    label: "X",
    icon: <XTwitterIcon />,
    bgColor: "#000000",
    iconColor: "#ffffff",
    build: (e) => `https://twitter.com/intent/tweet?url=${e}`,
  },
  {
    id: "facebook",
    label: "Facebook",
    icon: <FacebookIcon />,
    bgColor: "#1877F2",
    iconColor: "#ffffff",
    build: (e) => `https://www.facebook.com/sharer/sharer.php?u=${e}`,
  },
  {
    id: "whatsapp",
    label: "WhatsApp",
    icon: <WhatsAppIcon />,
    bgColor: "#25D366",
    iconColor: "#ffffff",
    build: (e) => `https://wa.me/?text=${e}`,
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    icon: <LinkedInIcon />,
    bgColor: "#0A66C2",
    iconColor: "#ffffff",
    build: (e) => `https://www.linkedin.com/sharing/share-offsite/?url=${e}`,
  },
  {
    id: "telegram",
    label: "Telegram",
    icon: <TelegramIcon />,
    bgColor: "#229ED9",
    iconColor: "#ffffff",
    build: (e) => `https://t.me/share/url?url=${e}`,
  },
];

const NATIVE_PLATFORM: Platform = {
  id: "native",
  label: "Share",
  icon: <NativeShareIcon />,
  bgColor: "#E8E8E8",
  iconColor: "#1a1a1a",
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

  const platforms = nativeOk ? [NATIVE_PLATFORM, ...PLATFORMS] : PLATFORMS;

  return (
    <div className="px-5 pb-5">
      {/* URL bar */}
      <div className="flex items-center gap-3 bg-gray-50 border border-gray-200  px-4 py-3 mb-5">
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
          className="flex-shrink-0 flex items-center gap-1.5 bg-white border border-gray-200  px-3 py-1.5 text-xs font-semibold hover:bg-gray-50 transition-colors"
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

      {/* Platform row — horizontal scroll, exactly like Linktree */}
      <div
        className="flex gap-5 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden"
        style={{ scrollbarWidth: "none" }}
      >
        {platforms.map((p) => (
          <motion.button
            key={p.id}
            whileTap={{ scale: 0.88 }}
            whileHover={{ scale: 1.07, y: -2 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            onClick={() => handle(p.id)}
            className="flex flex-col items-center gap-2 flex-shrink-0 focus:outline-none"
            aria-label={p.label}
          >
            <div
              className="w-12 h-12  flex items-center justify-center shadow-sm"
              style={{ backgroundColor: p.bgColor, color: p.iconColor }}
            >
              {p.icon}
            </div>
            <span className="text-[10px] font-medium text-gray-500 whitespace-nowrap">
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

// ─── Mobile sheet ─────────────────────────────────────────────────────────────

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

// ─── Main export ─

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

  // 1. Add a mounted state to prevent Next.js hydration errors
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      {/* The trigger stays exactly where it is in your layout */}
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

      {/* 2. Teleport the Modals to the document body so they overlay everything */}
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
// ─── LinkShareButton — lives INSIDE the link button on the right edge ─────────

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
          {/* Vertical three-dot ⋮ — exact Linktree style */}
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
