"use client";

import { useMemo } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { getStoreProduct } from "@/lib/store-onboarding";
import Link from "next/link";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.09, delayChildren: 0.2 } },
};
const item = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.42, ease: [0.25, 0.1, 0.25, 1] } },
};

const NEXT_STEPS = [
  { icon: "📧", title: "Check your email", desc: (email: string) => `Confirmation sent to ${email || "your inbox"}` },
  { icon: "🃏", title: "Card production", desc: () => "Your NFC card will be produced and dispatched within 3–5 business days" },
  { icon: "🚚", title: "Free delivery", desc: () => "Your card will be delivered to your address at no extra cost" },
  { icon: "⚡", title: "Activate your profile", desc: () => "Tap your card to instantly share your Abio profile with anyone" },
];

export default function StoreCompletePage() {
  const params = useParams<{ product: string }>();
  const searchParams = useSearchParams();
  const productId = params?.product ?? "";
  const product = useMemo(() => getStoreProduct(productId), [productId]);

  const firstName = searchParams.get("firstName") ?? "there";
  const username = searchParams.get("username") ?? "";
  const email = searchParams.get("email") ?? "";
  const ref = searchParams.get("ref") ?? "";
  const amountRaw = searchParams.get("amount") ?? "";
  const amount = amountRaw ? Number(amountRaw) : 0;

  return (
    <main className="min-h-screen bg-[#FEF4EA] flex items-center justify-center px-4 py-16">
      <motion.div
        className="w-full max-w-lg text-center"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {/* All steps complete bar */}
        <motion.div variants={item} className="flex justify-center gap-1.5 mb-8">
          {[1, 2, 3, 4, 5].map((n) => (
            <motion.div
              key={n}
              className="h-1 w-10"
              initial={{ scaleX: 0, originX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.4, delay: 0.1 + n * 0.08, ease: "easeOut" }}
              style={{ backgroundColor: "#FED45C" }}
            />
          ))}
        </motion.div>

        {/* Confetti icon */}
        <motion.div
          variants={item}
          className="flex items-center justify-center mb-6"
        >
          <motion.div
            className="w-20 h-20 bg-[#FED45C]/20 border-2 border-[#FED45C] flex items-center justify-center text-4xl"
            initial={{ scale: 0.5, rotate: -15 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.3 }}
          >
            🎉
          </motion.div>
        </motion.div>

        {/* Headline */}
        <motion.div variants={item} className="mb-8">
          <h1 className="text-3xl font-extrabold text-[#1a0800] leading-tight">
            Order Confirmed,{" "}
            <span className="text-[#331400] underline decoration-[#FED45C] decoration-4 underline-offset-4">
              {firstName}!
            </span>
          </h1>
          <p className="text-[#331400]/50 text-sm mt-3 max-w-sm mx-auto leading-relaxed">
            Your {product?.name ?? "card"} is on its way. We'll send shipping updates to{" "}
            <span className="text-[#331400] font-semibold">{email}</span>.
          </p>
        </motion.div>

        {/* Order details */}
        <motion.div variants={item} className="border border-[#331400]/10 bg-white p-6 text-left space-y-3 mb-4 shadow-sm">
          <p className="text-[10px] font-bold text-[#331400]/40 uppercase tracking-widest mb-4">Order Details</p>
          {product && (
            <div className="flex justify-between text-sm">
              <span className="text-[#331400]/50">Product</span>
              <span className="font-medium text-[#1a0800]">{product.name}</span>
            </div>
          )}
          {amount > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-[#331400]/50">Amount paid</span>
              <span className="font-bold text-[#1a0800]">₦{amount.toLocaleString()}</span>
            </div>
          )}
          {username && (
            <div className="flex justify-between text-sm">
              <span className="text-[#331400]/50">Your profile</span>
              <span className="font-medium text-[#1a0800]">abio.site/{username}</span>
            </div>
          )}
          {ref && (
            <div className="flex justify-between text-sm">
              <span className="text-[#331400]/50">Reference</span>
              <span className="font-mono text-xs text-[#331400]/60">{ref}</span>
            </div>
          )}
        </motion.div>

        {/* What's next */}
        <motion.div variants={item} className="border border-[#331400]/10 bg-white p-6 text-left space-y-4 mb-8 shadow-sm">
          <p className="text-[10px] font-bold text-[#331400]/40 uppercase tracking-widest">What Happens Next</p>
          {NEXT_STEPS.map(({ icon, title, desc }, i) => (
            <motion.div
              key={title}
              className="flex gap-3"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.32, delay: 0.55 + i * 0.08 }}
            >
              <span className="text-xl flex-shrink-0">{icon}</span>
              <div>
                <p className="text-sm font-semibold text-[#1a0800]">{title}</p>
                <p className="text-xs text-[#331400]/45 mt-0.5">{desc(email)}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTAs */}
        <motion.div variants={item} className="flex flex-col sm:flex-row gap-3">
          {username ? (
            <motion.div className="flex-1" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link
                href={`/${username}`}
                className="block w-full bg-[#331400] text-white text-sm font-bold py-4 text-center hover:bg-[#4a2207] transition"
              >
                View My Profile →
              </Link>
            </motion.div>
          ) : (
            <motion.div className="flex-1" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link
                href="/login"
                className="block w-full bg-[#331400] text-white text-sm font-bold py-4 text-center hover:bg-[#4a2207] transition"
              >
                Go to Dashboard →
              </Link>
            </motion.div>
          )}
          <motion.div className="flex-1" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Link
              href="/store"
              className="block w-full border border-[#331400]/15 text-[#331400]/60 text-sm py-4 text-center hover:border-[#331400]/30 hover:text-[#331400] transition"
            >
              Back to Store
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>
    </main>
  );
}
