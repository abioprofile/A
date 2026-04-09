"use client";

import { useMemo, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { getStoreProduct } from "@/lib/store-onboarding";
import { getPlatformIcon } from "@/components/PlatformIcon";

const PLATFORMS = [
  "Instagram","TikTok","Twitter","YouTube","Facebook",
  "LinkedIn","Snapchat","Pinterest","Twitch","Spotify",
  "Apple Music","SoundCloud","WhatsApp","Telegram","Discord",
  "GitHub","Behance","Dribbble","Website","Other",
];

interface AddedLink { id: string; platform: string; title: string; url: string; }

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.38, ease: [0.25, 0.1, 0.25, 1] } },
};

export default function StoreLinksPage() {
  const router = useRouter();
  const params = useParams<{ product: string }>();
  const searchParams = useSearchParams();
  const productId = params?.product ?? "";
  const product = useMemo(() => getStoreProduct(productId), [productId]);

  const firstName = searchParams.get("firstName") ?? "";
  const username = searchParams.get("username") ?? "";
  const email = searchParams.get("email") ?? "";

  const [links, setLinks] = useState<AddedLink[]>([]);
  const [modal, setModal] = useState<{ platform: string } | null>(null);
  const [linkTitle, setLinkTitle] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [urlError, setUrlError] = useState("");

  if (!product) return null;

  const openModal = (platform: string) => { setModal({ platform }); setLinkTitle(platform); setLinkUrl(""); setUrlError(""); };
  const closeModal = () => { setModal(null); setLinkTitle(""); setLinkUrl(""); setUrlError(""); };

  const addLink = () => {
    if (!linkUrl.trim()) { setUrlError("URL is required"); return; }
    const finalUrl = /^https?:\/\//i.test(linkUrl.trim()) ? linkUrl.trim() : `https://${linkUrl.trim()}`;
    setLinks((prev) => [...prev, { id: Math.random().toString(36).slice(2), platform: modal!.platform, title: linkTitle || modal!.platform, url: finalUrl }]);
    closeModal();
  };

  const removeLink = (id: string) => setLinks((prev) => prev.filter((l) => l.id !== id));

  const proceed = () => {
    const q = new URLSearchParams({ firstName, username, email });
    if (links.length > 0) q.set("links", JSON.stringify(links));
    router.push(`/store/onboarding/${product.id}/checkout?${q}`);
  };

  const skip = () => {
    router.push(`/store/onboarding/${product.id}/checkout?${new URLSearchParams({ firstName, username, email })}`);
  };

  return (
    <main className="min-h-screen bg-[#FEF4EA]">
      <div className="max-w-6xl mx-auto px-4 py-10 lg:py-16 lg:grid lg:grid-cols-2 lg:gap-20 lg:items-start">

        {/* ── Left ── */}
        <motion.div className="w-full max-w-md mx-auto lg:mx-0" variants={container} initial="hidden" animate="show">

          {/* Progress bar */}
          <motion.div variants={item} className="flex items-center gap-1.5 mb-6">
            {[1, 2, 3, 4, 5].map((n) => (
              <motion.div
                key={n}
                className="h-1 flex-1"
                initial={{ scaleX: 0, originX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.4, delay: 0.1 + n * 0.06, ease: "easeOut" }}
                style={{ backgroundColor: n <= 2 ? "#FED45C" : "#33140015" }}
              />
            ))}
          </motion.div>

          <motion.div variants={item}>
            <h1 className="text-2xl font-extrabold text-[#1a0800] mb-1">Add Your Links</h1>
            <p className="text-sm text-[#331400] mb-6">Choose which platforms to show on your Abio profile card.</p>
          </motion.div>

          {/* Added links */}
          <AnimatePresence>
            {links.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mb-6 overflow-hidden"
              >
                <p className="text-[10px] font-bold text-[#331400] uppercase tracking-widest mb-2">Added ({links.length})</p>
                <div className="space-y-2">
                  <AnimatePresence>
                    {links.map((link) => (
                      <motion.div
                        key={link.id}
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 12 }}
                        transition={{ duration: 0.25 }}
                        className="flex items-center gap-3 bg-white border border-[#331400]/10 px-3 py-2 shadow-sm"
                      >
                        <span className="text-[#331400] flex-shrink-0">{getPlatformIcon(link.platform)}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-[#1a0800] truncate">{link.title}</p>
                          <p className="text-[11px] text-[#331400] truncate">{link.url}</p>
                        </div>
                        <button onClick={() => removeLink(link.id)} className="text-[#331400] hover:text-red-500 text-xs transition px-1 flex-shrink-0">✕</button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Platform grid */}
          <motion.div variants={item} className="grid grid-cols-4 gap-2 mb-8">
            {PLATFORMS.map((platform, i) => {
              const already = links.some((l) => l.platform === platform);
              return (
                <motion.button
                  key={platform}
                  onClick={() => !already && openModal(platform)}
                  disabled={already}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.25, delay: 0.15 + i * 0.025 }}
                  whileHover={!already ? { scale: 1.05, y: -1 } : {}}
                  whileTap={!already ? { scale: 0.95 } : {}}
                  className={`flex flex-col items-center justify-center gap-1.5 py-3 border text-[10px] font-medium transition-colors ${
                    already
                      ? "border-[#FED45C] bg-[#FED45C]/20 text-[#331400] cursor-default"
                      : "border-[#331400]/12 bg-white text-[#331400]/60 hover:border-[#331400]/30 hover:text-[#331400]"
                  }`}
                >
                  <span className="text-base">{getPlatformIcon(platform)}</span>
                  <span className="truncate w-full text-center px-0.5">{platform}</span>
                </motion.button>
              );
            })}
          </motion.div>

          <motion.div variants={item} className="flex flex-col gap-3">
            <motion.button
              onClick={proceed}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-[#331400] text-white text-sm font-bold py-4 hover:bg-[#4a2207] transition"
            >
              Continue →
            </motion.button>
            <motion.button
              onClick={skip}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className="w-full border border-[#331400]/15 text-[#331400]/50 text-sm py-3 hover:border-[#331400]/30 hover:text-[#331400] transition"
            >
              Skip for now
            </motion.button>
          </motion.div>
        </motion.div>

        {/* ── Right: profile preview (desktop) ── */}
        <motion.div
          className="hidden lg:block sticky top-16"
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <p className="text-[10px] font-bold text-[#331400] uppercase tracking-widest mb-4">Profile Preview</p>
          <motion.div
            className="max-w-[240px] mx-auto bg-white border border-[#331400]/10 overflow-hidden shadow-sm"
            layout
          >
            <div className="p-4 bg-[#FEF4EA] border-b border-[#331400]/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#FED45C] flex items-center justify-center text-[#331400] font-bold text-sm flex-shrink-0">
                  {firstName ? firstName[0].toUpperCase() : "?"}
                </div>
                <div>
                  <p className="text-sm font-bold text-[#1a0800]">{firstName || "Your Name"}</p>
                  <p className="text-[10px] text-[#331400]/50">@{username || "username"}</p>
                </div>
              </div>
            </div>
            <div className="p-3 space-y-2 min-h-[80px]">
              <AnimatePresence>
                {links.length === 0 ? (
                  <motion.p
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-[10px] text-[#331400]/30 text-center py-4"
                  >
                    No links yet
                  </motion.p>
                ) : (
                  links.slice(0, 6).map((link) => (
                    <motion.div
                      key={link.id}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      className="flex items-center gap-2 bg-[#FEF4EA] border border-[#331400]/10 px-3 py-2 text-[10px] text-[#331400]"
                    >
                      <span>{getPlatformIcon(link.platform)}</span>
                      <span className="truncate">{link.title}</span>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
              {links.length > 6 && (
                <p className="text-[10px] text-[#331400]/30 text-center">+{links.length - 6} more</p>
              )}
            </div>
          </motion.div>

          <div className="mt-8 space-y-2">
            {[
              { n: 1, label: "Create account" },
              { n: 2, label: "Add your links" },
              { n: 3, label: "Shipping details" },
              { n: 4, label: "Payment" },
              { n: 5, label: "Order confirmed" },
            ].map(({ n, label }) => (
              <div key={n} className={`flex items-center gap-3 text-sm ${n <= 2 ? "text-[#331400]" : "text-[#331400]/25"}`}>
                <div className={`w-6 h-6 flex items-center justify-center text-[10px] font-bold border transition-colors ${n <= 2 ? "bg-[#FED45C] border-[#FED45C] text-[#331400]" : "border-[#331400]/20 text-[#331400]/25"}`}>
                  {n <= 1 ? "✓" : n}
                </div>
                {label}
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ── Modal ── */}
      <AnimatePresence>
        {modal && (
          <motion.div
            key="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-[#1a0800]/40 backdrop-blur-sm px-4"
            onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}
          >
            <motion.div
              key="modal-panel"
              initial={{ opacity: 0, y: 40, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.97 }}
              transition={{ duration: 0.28, ease: [0.25, 0.1, 0.25, 1] }}
              className="w-full max-w-sm bg-white border border-[#331400]/10 p-6 space-y-4 shadow-xl"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{getPlatformIcon(modal.platform)}</span>
                  <h2 className="text-base font-bold text-[#1a0800]">{modal.platform}</h2>
                </div>
                <button onClick={closeModal} className="text-[#331400]/30 hover:text-[#331400] text-lg leading-none transition">✕</button>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#331400]/50 uppercase tracking-wide mb-1">Label</label>
                <input
                  type="text"
                  value={linkTitle}
                  onChange={(e) => setLinkTitle(e.target.value)}
                  className="w-full bg-[#FEF4EA] h-8 border border-[#331400]/15 text-[15px] text-[#331400] px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#FED45C] placeholder-[#331400]/30"
                  placeholder="Button label"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#331400]/50 uppercase tracking-wide mb-1">URL</label>
                <input
                  type="url"
                  value={linkUrl}
                  onChange={(e) => { setLinkUrl(e.target.value); if (urlError) setUrlError(""); }}
                  className={`w-full bg-[#FEF4EA] border text-[15px] h-8 text-[#331400] px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#FED45C] placeholder-[#331400]/30 ${urlError ? "border-red-400" : "border-[#331400]/15"}`}
                  placeholder="https://instagram.com/yourname"
                />
                {urlError && <p className="text-red-500 text-[11px] mt-1">{urlError}</p>}
              </div>

              <div className="flex gap-3 pt-1">
                <button onClick={closeModal} className="flex-1 border border-[#331400]/15 text-[#331400] text-sm py-3 hover:border-[#331400]/30 hover:text-[#331400] transition">Cancel</button>
                <button onClick={addLink} className="flex-1 bg-[#331400] text-white text-sm font-bold py-3 hover:bg-[#4a2207] transition">Add Link</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
