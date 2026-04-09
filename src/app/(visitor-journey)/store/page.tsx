"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from "framer-motion";

/* ─── Types */
interface Variant { label: string; color: string; image: string; }
interface GalleryItem { src: string; label: string; }
interface Product {
  id: string;
  name: string;
  tagline: string;
  price: number;
  gallery: GalleryItem[];
  variants: Variant[];
  features: string[];
  badge?: string;
}

/* ─── Data ─ */
const PRODUCTS: Product[] = [
  {
    id: "ap-card-5",
    name: "Ap Card 5",
    tagline: "The last business card you'll ever need.",
    price: 35000,
    badge: "BESTSELLER",
    gallery: [
      { src: "/icons/Apcard5.png", label: "Front" },
      { src: "/images/Blackcard1 (1).png", label: "Detail" },
      { src: "/images/Blackcard2.png", label: "Back" },
      { src: "/images/Apcard 5 white 1.png", label: "White" },
    ],
    variants: [
      { label: "Black", color: "#1a1a1a", image: "/icons/Apcard5.png" },
      { label: "White", color: "#f0ece6", image: "/images/Apcard 5 white 1.png" },
    ],
    features: ["Standard NFC chip", "Instant profile sharing", "Tap-to-connect", "Free delivery"],
  },
  {
    id: "ap-card-5-plus-custom",
    name: "Ap Card 5+ Custom",
    tagline: "Fully customised to match your brand.",
    price: 50000,
    badge: "CUSTOM",
    gallery: [
      { src: "/images/Pink card.png", label: "Front" },
      { src: "/images/pink card 2.png", label: "Angle" },
      { src: "/images/pink card 3.png", label: "Detail" },
      { src: "/images/WHite card.png", label: "White" },
    ],
    variants: [
      { label: "Pink", color: "#d97fa0", image: "/images/Pink card.png" },
      { label: "White", color: "#f0ece6", image: "/images/WHite card.png" },
      { label: "Black", color: "#1a1a1a", image: "/icons/Apcard5.png" },
    ],
    features: ["Custom branding", "Premium NFC chip", "Tap-to-connect", "Free delivery"],
  },
];

/* ─── Animated counter */
function Counter({ value, prefix = "" }: { value: number; prefix?: string }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = Math.ceil(value / 40);
    const t = setInterval(() => {
      start += step;
      if (start >= value) { setDisplay(value); clearInterval(t); }
      else setDisplay(start);
    }, 18);
    return () => clearInterval(t);
  }, [value]);
  return <>{prefix}{display.toLocaleString()}</>;
}

/* ─── Scan line  */
function ScanLine() {
  return (
    <motion.div
      className="absolute left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#FED45C]/60 to-transparent pointer-events-none z-10"
      initial={{ top: "0%" }}
      animate={{ top: ["0%", "100%", "0%"] }}
      transition={{ duration: 3.5, ease: "linear", repeat: Infinity, repeatDelay: 1.5 }}
    />
  );
}

/* ─── Corner brackets  */
function Brackets({ size = 12, color = "#FED45C", opacity = 0.6 }: { size?: number; color?: string; opacity?: number }) {
  const s = `${size}px`;
  const style: React.CSSProperties = { position: "absolute", width: s, height: s, opacity };
  return (
    <>
      <span style={{ ...style, top: 0, left: 0, borderTop: `2px solid ${color}`, borderLeft: `2px solid ${color}` }} />
      <span style={{ ...style, top: 0, right: 0, borderTop: `2px solid ${color}`, borderRight: `2px solid ${color}` }} />
      <span style={{ ...style, bottom: 0, left: 0, borderBottom: `2px solid ${color}`, borderLeft: `2px solid ${color}` }} />
      <span style={{ ...style, bottom: 0, right: 0, borderBottom: `2px solid ${color}`, borderRight: `2px solid ${color}` }} />
    </>
  );
}

/* ─── Page loader */
function PageLoader({ onDone }: { onDone: () => void }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let p = 0;
    const t = setInterval(() => {
      p += Math.random() * 18 + 4;
      if (p >= 100) { setProgress(100); clearInterval(t); setTimeout(onDone, 420); }
      else setProgress(Math.min(p, 95));
    }, 60);
    return () => clearInterval(t);
  }, [onDone]);

  return (
    <motion.div
      className="fixed inset-0 z-50 bg-[#FEF4EA] flex flex-col items-center justify-center"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Dot grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, #33140018 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center gap-6"
      >
        

        <div className="w-48 h-[2px] bg-[#331400]/10 relative overflow-hidden">
          <motion.div
            className="absolute left-0 top-0 h-full bg-[#FED45C]"
            style={{ width: `${progress}%` }}
            transition={{ duration: 0.1 }}
          />
        </div>

        <p className="text-[11px] font-bold text-[#331400]/30 tracking-[0.3em] uppercase">
          Loading Store
        </p>
      </motion.div>
    </motion.div>
  );
}

/* ─── Navbar */
function StoreNav({ cartCount }: { cartCount: number }) {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    return scrollY.onChange((v) => setScrolled(v > 20));
  }, [scrollY]);

  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
      className={`fixed top-0 left-0 right-0 z-30 transition-all duration-300 ${
        scrolled
          ? "bg-[#FEF4EA]/90 backdrop-blur-md border-b border-[#331400]/10 shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="relative w-24 h-8"
          >
            <Image src="/icons/logo.svg" alt="Abio" fill className="object-contain object-left" />
          </motion.div>
        </Link>

        {/* Nav links */}
        <div className="hidden md:flex items-center gap-6">
          {[""].map((link) => (
            <motion.a
              key={link}
              href="#"
              whileHover={{ y: -1 }}
              className="text-sm font-semibold text-[#331400]/50 hover:text-[#331400] transition-colors relative group"
            >
              {link}
              <span className="absolute -bottom-0.5 left-0 w-0 h-[1.5px] bg-[#FED45C] group-hover:w-full transition-all duration-200" />
            </motion.a>
          ))}
        </div>

        {/* Cart */}
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          className="relative w-9 h-9 flex items-center justify-center border border-[#331400]/15 hover:border-[#331400]/40 bg-white/60 transition-colors"
        >
          <Image src="/icons/cart.svg" alt="Cart" width={16} height={16} />
          {cartCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-[#FED45C] text-[#331400] text-[9px] font-black flex items-center justify-center"
            >
              {cartCount}
            </motion.span>
          )}
        </motion.button>
      </div>
    </motion.nav>
  );
}

/* ─── Image skeleton  */
function ImageSkeleton() {
  return (
    <div className="absolute inset-0 bg-[#331400]/5 overflow-hidden">
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent"
        animate={{ x: ["-100%", "100%"] }}
        transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
}

/* ─── Main page */
export default function Store() {
  const [loaded, setLoaded] = useState(false);
  const [imgReady, setImgReady] = useState(false);
  const [activeId, setActiveId] = useState(PRODUCTS[0].id);
  const [imgIdx, setImgIdx] = useState(0);
  const [variantIdx, setVariantIdx] = useState(0);
  const [qty, setQty] = useState(1);
  const imgKey = useRef(0);

  const product = PRODUCTS.find((p) => p.id === activeId)!;
  const activeImage = product.variants[variantIdx]?.image ?? product.gallery[imgIdx]?.src;
  const activeLabel = product.gallery[imgIdx]?.label ?? "Front";
  const discount = Math.round(product.price * 0.15);
  const discountedPrice = product.price - discount;

  const switchProduct = (id: string) => {
    setActiveId(id); setImgIdx(0); setVariantIdx(0); setQty(1); setImgReady(false);
    imgKey.current++;
  };

  const changeVariant = (i: number) => {
    setVariantIdx(i); setImgReady(false); imgKey.current++;
  };

  const changeThumb = (i: number) => {
    setImgIdx(i); setImgReady(false); imgKey.current++;
  };

  const prevImg = () => changeThumb((imgIdx - 1 + product.gallery.length) % product.gallery.length);
  const nextImg = () => changeThumb((imgIdx + 1) % product.gallery.length);

  return (
    <>
      <AnimatePresence>{!loaded && <PageLoader onDone={() => setLoaded(true)} />}</AnimatePresence>

      <div
        className="min-h-screen bg-[#FEF4EA] relative overflow-x-hidden"
        style={{
          backgroundImage: "radial-gradient(circle, #33140010 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      >
        <StoreNav cartCount={0} />

        {/* ── Hero band ── */}
        <motion.div
          className="pt-20 pb-0"
          initial={{ opacity: 0 }}
          animate={loaded ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          <div className="max-w-6xl mx-auto px-4 pt-8 pb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-[#331400]/10">
            <div>
              <motion.p
                initial={{ opacity: 0, x: -12 }}
                animate={loaded ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.3 }}
                className="text-[10px] font-bold text-[#331400] uppercase tracking-[0.25em] mb-1"
              >
                ⚡ Pre-order open · Limited spots
              </motion.p>
              <motion.h1
                initial={{ opacity: 0, y: 14 }}
                animate={loaded ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.45, delay: 0.35 }}
                className="text-3xl md:text-4xl font-extrabold text-[#1a0800] tracking-tight"
              >
                NFC Cards
              </motion.h1>
            </div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={loaded ? { opacity: 1 } : {}}
              transition={{ duration: 0.4, delay: 0.5 }}
              className="text-xs text-[#331400] font-medium"
            >
              {PRODUCTS.length} products
            </motion.p>
          </div>
        </motion.div>

        {/* ── Product tab switcher ── */}
        <motion.div
          className="max-w-6xl mx-auto px-4"
          initial={{ opacity: 0 }}
          animate={loaded ? { opacity: 1 } : {}}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          <div className="flex items-center gap-1 pt-4 pb-0">
            {PRODUCTS.map((p) => (
              <button
                key={p.id}
                onClick={() => switchProduct(p.id)}
                className={`relative px-4 py-2 text-sm font-bold transition-colors ${
                  activeId === p.id ? "text-[#331400]" : "text-[#331400]/35 hover:text-[#331400]/65"
                }`}
              >
                {p.name}
                {p.badge && (
                  <span className="ml-2 text-[8px] font-black bg-[#FED45C] text-[#331400] px-1.5 py-0.5 align-middle">
                    {p.badge}
                  </span>
                )}
                {activeId === p.id && (
                  <motion.div layoutId="storeTab" className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#FED45C]" />
                )}
              </button>
            ))}
          </div>
        </motion.div>

        {/* ── Main product area ── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeId}
            initial={{ opacity: 0, y: 20 }}
            animate={loaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.38, ease: [0.25, 0.1, 0.25, 1] }}
            className="max-w-6xl mx-auto px-4 py-10"
          >
            <div className="flex flex-col lg:flex-row gap-10 lg:gap-14 lg:items-start">

              {/* ── Gallery ── */}
              <div className="flex-1 flex gap-3">

                {/* Thumbnails */}
                <div className="hidden sm:flex flex-col gap-2 w-[72px] flex-shrink-0 pt-1">
                  {product.gallery.map((img, i) => (
                    <motion.button
                      key={`${activeId}-thumb-${i}`}
                      onClick={() => changeThumb(i)}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: i * 0.06 }}
                      whileHover={{ scale: 1.06, x: 2 }}
                      whileTap={{ scale: 0.95 }}
                      className={`relative w-[72px] h-[50px] border-2 overflow-hidden flex-shrink-0 transition-all ${
                        imgIdx === i
                          ? "border-[#331400]"
                          : "border-[#331400]/12 hover:border-[#331400]/35"
                      }`}
                    >
                      <Image src={img.src} alt={img.label} fill className="object-cover" sizes="72px" />
                      {imgIdx === i && (
                        <motion.div layoutId="thumbActive" className="absolute inset-0 border-2 border-[#FED45C] pointer-events-none" />
                      )}
                    </motion.button>
                  ))}
                </div>

                {/* Main image */}
                <div className="flex-1 flex flex-col">
                  <div className="relative bg-white border border-[#331400]/10 overflow-hidden" style={{ aspectRatio: "4/3" }}>
                    <Brackets size={14} color="#FED45C" opacity={0.7} />
                    <ScanLine />

                    {/* Image */}
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={`img-${activeId}-${variantIdx}-${imgIdx}`}
                        initial={{ opacity: 0, scale: 1.06 }}
                        animate={{ opacity: imgReady ? 1 : 0, scale: imgReady ? 1 : 1.06 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.35, ease: "easeOut" }}
                        className="absolute inset-0"
                      >
                        {!imgReady && <ImageSkeleton />}
                        <Image
                          src={activeImage}
                          alt={product.name}
                          fill
                          className="object-contain p-8"
                          sizes="(max-width: 1024px) 100vw, 50vw"
                          priority
                          onLoad={() => setImgReady(true)}
                        />
                      </motion.div>
                    </AnimatePresence>

                    {/* Label overlay */}
                    <div className="absolute bottom-3 left-3 z-10">
                      <span className="text-[9px] font-bold text-[#331400]/40 tracking-widest uppercase bg-[#FEF4EA]/80 px-2 py-1">
                        {activeLabel}
                      </span>
                    </div>
                  </div>

                  {/* Nav arrows */}
                  <div className="flex items-center justify-between mt-3 px-0.5">
                    <div className="flex items-center gap-1.5">
                      {product.gallery.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => changeThumb(i)}
                          className={`h-[2px] transition-all duration-300 ${
                            imgIdx === i ? "w-6 bg-[#331400]" : "w-2 bg-[#331400]/20 hover:bg-[#331400]/40"
                          }`}
                        />
                      ))}
                    </div>
                    <div className="flex items-center gap-2">
                      <motion.button
                        onClick={prevImg}
                        whileHover={{ x: -1 }}
                        whileTap={{ scale: 0.9 }}
                        className="w-8 h-8 border-1 border-[#331400] flex items-center justify-center text-[12px] text-[#331400] hover:border-[#331400]/50 hover:text-[#331400] transition-colors"
                      >
                        ←
                      </motion.button>
                      <motion.button
                        onClick={nextImg}
                        whileHover={{ x: 1 }}
                        whileTap={{ scale: 0.9 }}
                        className="w-8 h-8 border-1 border-[#331400] flex items-center justify-center text-[12px] text-[#331400] hover:border-[#331400]/50 hover:text-[#331400] transition-colors"
                      >
                        →
                      </motion.button>
                    </div>
                  </div>

                  {/* Mobile thumbnails */}
                  <div className="sm:hidden flex gap-2 mt-3 overflow-x-auto pb-1">
                    {product.gallery.map((img, i) => (
                      <button
                        key={i}
                        onClick={() => changeThumb(i)}
                        className={`relative w-14 h-10 border-2 overflow-hidden flex-shrink-0 transition-colors ${
                          imgIdx === i ? "border-[#331400]" : "border-[#331400]/12"
                        }`}
                      >
                        <Image src={img.src} alt={img.label} fill className="object-cover" sizes="56px" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* ── Details panel ── */}
              <motion.div
                className="w-full lg:w-[400px] xl:w-[440px] flex-shrink-0"
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.45, delay: 0.15, ease: [0.25, 0.1, 0.25, 1] }}
              >
                {/* Badge + name */}
                <div className="mb-4">
                  {product.badge && (
                    <motion.span
                      initial={{ opacity: 0, scale: 0.85 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.2 }}
                      className="inline-block text-[9px] font-black tracking-[0.2em] bg-[#FED45C] text-[#331400] px-2 py-1 mb-2"
                    >
                      {product.badge}
                    </motion.span>
                  )}
                  <h2 className="text-2xl font-extrabold text-[#1a0800]">{product.name}</h2>
                  <p className="text-sm text-[#331400] mt-1">{product.tagline}</p>
                </div>

                {/* Price */}
                <div className="relative bg-white border border-[#331400]/10 p-4 mb-5">
                  <Brackets size={10} color="#FED45C" opacity={0.5} />
                  <div className="flex items-baseline gap-3 flex-wrap">
                    <span className="text-3xl font-extrabold text-[#1a0800]">
                      ₦<Counter value={discountedPrice} />
                    </span>
                    <span className="text-sm text-[#331400]/30 line-through">₦{product.price.toLocaleString()}</span>
                    <span className="bg-[#FED45C] text-[#331400] text-[9px] font-black px-2 py-0.5 tracking-wide">
                      15% OFF
                    </span>
                  </div>
                  <p className="text-xs text-green-600 font-semibold mt-1">
                    🚚 Free delivery · Save ₦{discount.toLocaleString()}
                  </p>
                </div>

                <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-[#331400]/15 to-transparent mb-5" />

                {/* Colour */}
                <div className="mb-5">
                  <p className="text-[10px] font-bold text-[#331400] uppercase tracking-[0.2em] mb-3">
                    Colour —{" "}
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={product.variants[variantIdx]?.label}
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        transition={{ duration: 0.18 }}
                        className="text-[#331400]"
                      >
                        {product.variants[variantIdx]?.label}
                      </motion.span>
                    </AnimatePresence>
                  </p>
                  <div className="flex items-center gap-2.5">
                    {product.variants.map((v, i) => (
                      <motion.button
                        key={i}
                        onClick={() => changeVariant(i)}
                        whileHover={{ scale: 1.15 }}
                        whileTap={{ scale: 0.9 }}
                        title={v.label}
                        className={`relative w-8 h-8 border-2 transition-all ${
                          variantIdx === i
                            ? "border-[#331400]"
                            : "border-[#331400]/20 hover:border-[#331400]/50"
                        }`}
                        style={{ backgroundColor: v.color }}
                      >
                        {variantIdx === i && (
                          <motion.span
                            layoutId={`swatch-ring-${activeId}`}
                            className="absolute -inset-[3px]  border-2 border-[#FED45C] pointer-events-none"
                          />
                        )}
                        {v.color === "#f0ece6" && (
                          <span className="absolute inset-0 rounded-full border border-[#331400]/10" />
                        )}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Quantity */}
                <div className="mb-5">
                  <p className="text-[10px] font-bold text-[#331400] uppercase tracking-[0.2em] mb-3">Quantity</p>
                  <div className="flex items-center gap-3">
                    <motion.button
                      onClick={() => setQty((q) => Math.max(1, q - 1))}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.85 }}
                      className="w-8 h-8 border border-[#331400] flex items-center justify-center text-[#331400] hover:border-[#331400]/60 hover:bg-[#331400]/5 transition-colors text-lg font-light leading-none"
                    >
                      −
                    </motion.button>
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={qty}
                        initial={{ opacity: 0, scale: 0.7 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.3 }}
                        transition={{ duration: 0.15 }}
                        className="text-base font-extrabold text-[#1a0800] w-8 text-center tabular-nums"
                      >
                        {qty}
                      </motion.span>
                    </AnimatePresence>
                    <motion.button
                      onClick={() => setQty((q) => q + 1)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.85 }}
                      className="w-8 h-8 border border-[#331400] flex items-center justify-center text-[#331400] hover:border-[#331400]/60 hover:bg-[#331400]/5 transition-colors text-lg font-light leading-none"
                    >
                      +
                    </motion.button>
                  </div>
                </div>

                {/* Design option */}
                <div className="space-y-2 mb-6">
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="relative border-2 border-[#331400] bg-white p-4"
                  >
                    <Brackets size={8} color="#FED45C" opacity={0.5} />
                    <p className="text-sm font-bold text-[#1a0800]">Standard</p>
                    <p className="text-xs text-[#331400]/45 mt-0.5">Clean Abio branding.</p>
                  </motion.div>
                  {product.id === "ap-card-5-plus-custom" && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.38 }}
                      className="border border-[#331400]/12 bg-white p-4 flex justify-between items-center"
                    >
                      <div>
                        <p className="text-sm font-bold text-[#1a0800]">Custom Design</p>
                        <p className="text-xs text-[#331400]/45 mt-0.5">Upload your own branding.</p>
                      </div>
                      <span className="text-xs font-bold text-[#331400] bg-[#FED45C]/30 px-2 py-1">Included</span>
                    </motion.div>
                  )}
                </div>

                {/* Features */}
                <ul className="mb-7 space-y-2">
                  {product.features.map((f, i) => (
                    <motion.li
                      key={f}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + i * 0.07 }}
                      className="flex items-center gap-2.5 text-sm text-[#331400]/65"
                    >
                      <motion.span
                        className="w-4 h-4 bg-[#FED45C] flex items-center justify-center text-[#331400] text-[9px] font-black flex-shrink-0"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", delay: 0.35 + i * 0.07 }}
                      >
                        ✓
                      </motion.span>
                      {f}
                    </motion.li>
                  ))}
                </ul>

                {/* CTA */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <Link href={`/store/onboarding/${product.id}`}>
                    <motion.div
                      whileHover={{ scale: 1.015, boxShadow: "6px 6px 0px #FED45C" }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ type: "spring", stiffness: 400, damping: 20 }}
                      className="w-full bg-[#331400] text-white text-sm font-extrabold py-4 text-center shadow-[4px_4px_0px_#FED45C] cursor-pointer select-none"
                    >
                      Buy Now — ₦{discountedPrice.toLocaleString()}
                    </motion.div>
                  </Link>
                </motion.div>

                <p className="text-center text-[10px] text-[#331400] mt-3 tracking-wide">
                  🔒 Secure payment via Paystack · Pre-order ships in 3–5 days
                </p>
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* ── Bottom gradient fade ── */}
        <div className="h-24 bg-gradient-to-b from-transparent to-[#FEF4EA] pointer-events-none" />
      </div>
    </>
  );
}
