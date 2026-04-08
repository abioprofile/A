"use client";

import { useMemo, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { getStoreProduct } from "@/lib/store-onboarding";
import Link from "next/link";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.07, delayChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.38, ease: [0.25, 0.1, 0.25, 1] } },
};

export default function StorePaymentPage() {
  const router = useRouter();
  const params = useParams<{ product: string }>();
  const searchParams = useSearchParams();
  const productId = params?.product ?? "";
  const product = useMemo(() => getStoreProduct(productId), [productId]);

  const firstName = searchParams.get("firstName") ?? "";
  const username = searchParams.get("username") ?? "";
  const email = searchParams.get("email") ?? "";
  const street = searchParams.get("street") ?? "";
  const city = searchParams.get("city") ?? "";
  const state = searchParams.get("state") ?? "";
  const phone = searchParams.get("phone") ?? "";
  const linksRaw = searchParams.get("links") ?? "";

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!product) return null;

  const discount = Math.round(product.basePrice * 0.15);
  const discountedPrice = product.basePrice - discount;

  const handlePaystack = () => {
    setLoading(true);
    setError("");
    // @ts-ignore
    const handler = window.PaystackPop?.setup({
      key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
      email,
      amount: discountedPrice * 100,
      currency: "NGN",
      ref: `abio-${product.id}-${Date.now()}`,
      metadata: {
        custom_fields: [
          { display_name: "Name", variable_name: "name", value: firstName },
          { display_name: "Username", variable_name: "username", value: username },
          { display_name: "Phone", variable_name: "phone", value: phone },
          { display_name: "Address", variable_name: "address", value: `${street}, ${city}, ${state}` },
          { display_name: "Product", variable_name: "product", value: product.id },
        ],
      },
      callback: (response: { reference: string }) => {
        const q = new URLSearchParams({ firstName, username, email, ref: response.reference, amount: String(discountedPrice), product: product.id });
        router.push(`/store/onboarding/${product.id}/complete?${q}`);
      },
      onClose: () => setLoading(false),
    });
    if (handler) { handler.openIframe(); } else { setError("Payment service unavailable. Please try again."); setLoading(false); }
  };

  const backUrl = () => {
    const q = new URLSearchParams({ firstName, username, email, street, city, state, phone });
    if (linksRaw) q.set("links", linksRaw);
    return `/store/onboarding/${product.id}/checkout?${q}`;
  };

  return (
    <>
      <script src="https://js.paystack.co/v1/inline.js" async />
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
                  style={{ backgroundColor: n <= 4 ? "#FED45C" : "#33140015" }}
                />
              ))}
            </motion.div>

            <motion.div variants={item} className="flex items-center gap-3 mb-6">
              <Link href={backUrl()} className="text-[#331400]/40 hover:text-[#331400] transition text-sm font-medium">← Back</Link>
              <div>
                <h1 className="text-2xl font-extrabold text-[#1a0800] leading-tight">Payment</h1>
                <p className="text-sm text-[#331400]/50">Secure checkout via Paystack</p>
              </div>
            </motion.div>

            {/* Amount due */}
            <motion.div variants={item} className="border border-[#331400]/15 bg-white p-5 mb-6 shadow-sm">
              <p className="text-[10px] font-bold text-[#331400]/40 uppercase tracking-widest mb-2">Amount Due</p>
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-extrabold text-[#1a0800]">₦{discountedPrice.toLocaleString()}</span>
                <span className="text-[#331400]/30 line-through text-sm">₦{product.basePrice.toLocaleString()}</span>
              </div>
              <div className="mt-2 flex flex-wrap gap-3 text-xs text-[#331400]/50">
                <span>✅ 15% pre-order discount applied</span>
                <span>🚚 Free delivery included</span>
              </div>
            </motion.div>

            {/* Order review */}
            <motion.div variants={item} className="border border-[#331400]/10 bg-white p-4 mb-6 space-y-2 text-sm shadow-sm">
              <p className="text-[10px] font-bold text-[#331400]/40 uppercase tracking-widest mb-3">Order Review</p>
              {[["Product", product.name], ["Delivery to", `${city}, ${state}`], ["Account", `@${username}`]].map(([label, val]) => (
                <div key={label} className="flex justify-between">
                  <span className="text-[#331400]/50">{label}</span>
                  <span className="font-medium text-[#1a0800] text-right max-w-[200px] truncate">{val}</span>
                </div>
              ))}
            </motion.div>

            {error && (
              <motion.div variants={item} className="border border-red-300 bg-red-50 p-3 mb-4">
                <p className="text-red-600 text-xs">{error}</p>
              </motion.div>
            )}

            {/* Pay button */}
            <motion.div variants={item}>
              <motion.button
                onClick={handlePaystack}
                disabled={loading}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-[#FED45C] text-[#331400] text-sm font-extrabold py-5 hover:bg-[#f7c93d] transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-[#331400]/20 border-t-[#331400] rounded-full animate-spin" />
                    Opening payment…
                  </>
                ) : (
                  <>Pay ₦{discountedPrice.toLocaleString()} Securely</>
                )}
              </motion.button>
            </motion.div>

            <motion.p variants={item} className="text-center text-[11px] text-[#331400]/35 mt-3 flex items-center justify-center gap-1">
              <span>🔒</span> Payments are encrypted and processed by Paystack
            </motion.p>
          </motion.div>

          {/* ── Right: summary (desktop) ── */}
          <motion.div
            className="hidden lg:flex flex-col gap-6 sticky top-16"
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <div className="bg-white border border-[#331400]/10 p-6 space-y-4 shadow-sm">
              <p className="text-[10px] font-bold text-[#331400]/40 uppercase tracking-widest">Order Summary</p>
              <div className="flex items-center gap-4 pb-4 border-b border-[#331400]/10">
                <div className="w-14 h-9 bg-gradient-to-br from-[#FED45C] to-[#f5a623] flex items-center justify-center flex-shrink-0">
                  <span className="text-[#331400] font-black text-[10px]">NFC</span>
                </div>
                <div>
                  <p className="font-semibold text-sm text-[#1a0800]">{product.name}</p>
                  <p className="text-[11px] text-[#331400]/40">{product.description}</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-[#331400]/50">Original price</span>
                  <span className="line-through text-[#331400]/30">₦{product.basePrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#331400]/50">Discount (15%)</span>
                  <span className="text-green-600 font-medium">−₦{discount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#331400]/50">Delivery</span>
                  <span className="text-green-600 font-medium">Free</span>
                </div>
                <div className="border-t border-[#331400]/10 pt-3 flex justify-between font-bold text-[#1a0800]">
                  <span>Total</span>
                  <span className="text-lg">₦{discountedPrice.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="bg-white border border-[#331400]/10 p-5 space-y-2 text-sm shadow-sm">
              <p className="text-[10px] font-bold text-[#331400]/40 uppercase tracking-widest mb-3">Shipping To</p>
              <p className="font-medium text-[#1a0800]">{firstName}</p>
              <p className="text-[#331400]/50">{street}</p>
              <p className="text-[#331400]/50">{city}, {state}</p>
              <p className="text-[#331400]/50">{phone}</p>
            </div>

            <div className="space-y-2">
              {[
                { n: 1, label: "Create account" },
                { n: 2, label: "Add your links" },
                { n: 3, label: "Shipping details" },
                { n: 4, label: "Payment" },
                { n: 5, label: "Order confirmed" },
              ].map(({ n, label }) => (
                <div key={n} className={`flex items-center gap-3 text-sm ${n <= 4 ? "text-[#331400]" : "text-[#331400]/25"}`}>
                  <div className={`w-6 h-6 flex items-center justify-center text-[10px] font-bold border transition-colors ${
                    n <= 3 ? "bg-[#FED45C] border-[#FED45C] text-[#331400]"
                    : n === 4 ? "border-[#331400] text-[#331400]"
                    : "border-[#331400]/20 text-[#331400]/25"
                  }`}>
                    {n <= 3 ? "✓" : n}
                  </div>
                  {label}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </main>
    </>
  );
}
