"use client";

import { useMemo, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { getStoreProduct } from "@/lib/store-onboarding";
import Link from "next/link";

const NIGERIAN_STATES = [
  "Abia","Adamawa","Akwa Ibom","Anambra","Bauchi","Bayelsa","Benue","Borno",
  "Cross River","Delta","Ebonyi","Edo","Ekiti","Enugu","FCT","Gombe","Imo",
  "Jigawa","Kaduna","Kano","Katsina","Kebbi","Kogi","Kwara","Lagos","Nasarawa",
  "Niger","Ogun","Ondo","Osun","Oyo","Plateau","Rivers","Sokoto","Taraba",
  "Yobe","Zamfara",
];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.07, delayChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.38, ease: [0.25, 0.1, 0.25, 1] } },
};

export default function StoreCheckoutPage() {
  const router = useRouter();
  const params = useParams<{ product: string }>();
  const searchParams = useSearchParams();
  const productId = params?.product ?? "";
  const product = useMemo(() => getStoreProduct(productId), [productId]);

  const firstName = searchParams.get("firstName") ?? "";
  const username = searchParams.get("username") ?? "";
  const email = searchParams.get("email") ?? "";
  const linksRaw = searchParams.get("links") ?? "";

  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  if (!product) return null;

  const discount = Math.round(product.basePrice * 0.15);
  const discountedPrice = product.basePrice - discount;

  const clear = (key: string) => setErrors((p) => { const n = {...p}; delete n[key]; return n; });

  const validate = () => {
    const e: Record<string, string> = {};
    if (!street.trim()) e.street = "Street address is required";
    if (!city.trim()) e.city = "City is required";
    if (!state) e.state = "State is required";
    if (!phone.trim()) e.phone = "Phone number is required";
    else if (!/^\+?[\d\s\-()]{7,}$/.test(phone)) e.phone = "Enter a valid phone number";
    return e;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    const q = new URLSearchParams({ firstName, username, email, street, city, state, phone });
    if (linksRaw) q.set("links", linksRaw);
    router.push(`/store/onboarding/${product.id}/payment?${q}`);
  };

  const inputClass = (hasError?: boolean) =>
    `w-full  h-9 border-2 border-[#331400] text-base placeholder:text-sm sm:h-10 md:text-sm  border text-[16px] text-[#331400] placeholder-[#331400]/30 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#FED45C] transition appearance-none ${hasError ? "border-red-400" : ""}`;

  return (
    <main className="min-h-screen bg-[#FEF4EA]">
      <div className="max-w-6xl mx-auto px-4 py-10 lg:py-16 lg:grid lg:grid-cols-2 lg:gap-20 lg:items-start">

        {/* ── Left: shipping form ── */}
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
                style={{ backgroundColor: n <= 3 ? "#FED45C" : "#33140015" }}
              />
            ))}
          </motion.div>

          <motion.div variants={item} className="flex items-center gap-3 mb-6">
            <Link
              href={`/store/onboarding/${product.id}/links?firstName=${firstName}&username=${username}&email=${email}`}
              className="text-[#331400] hover:text-[#331400] transition text-sm font-medium"
            >
              ← Back
            </Link>
            <div>
              <h1 className="text-2xl font-extrabold text-[#1a0800] leading-tight">Shipping Details</h1>
              <p className="text-sm text-[#331400] mt-2">Where should we deliver your card?</p>
            </div>
          </motion.div>

          <form onSubmit={handleSubmit} noValidate>
            <motion.div variants={container} initial="hidden" animate="show" className="space-y-4">

              {/* Street */}
              <motion.div variants={item}>
                <label className="block text-xs font-bold text-[#331400] uppercase tracking-wide mb-1">Street Address</label>
                <input type="text" value={street} onChange={(e) => { setStreet(e.target.value); clear("street"); }}
                  placeholder="12 Victoria Island Way" className={inputClass(!!errors.street)} />
                {errors.street && <p className="text-red-500 text-[11px] mt-1">{errors.street}</p>}
              </motion.div>

              {/* City */}
              <motion.div variants={item}>
                <label className="block text-xs font-bold text-[#331400]/60 uppercase tracking-wide mb-1">City</label>
                <input type="text" value={city} onChange={(e) => { setCity(e.target.value); clear("city"); }}
                  placeholder="Lagos" className={inputClass(!!errors.city)} />
                {errors.city && <p className="text-red-500 text-[11px] mt-1">{errors.city}</p>}
              </motion.div>

              {/* State */}
              <motion.div variants={item}>
                <label className="block text-xs font-bold text-[#331400]/60 uppercase tracking-wide mb-1">State</label>
                <select value={state} onChange={(e) => { setState(e.target.value); clear("state"); }}
                  className={inputClass(!!errors.state)}>
                  <option value="">Select state</option>
                  {NIGERIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
                {errors.state && <p className="text-red-500 text-[11px] mt-1">{errors.state}</p>}
              </motion.div>

              {/* Phone */}
              <motion.div variants={item}>
                <label className="block text-xs font-bold text-[#331400]/60 uppercase tracking-wide mb-1">Phone Number</label>
                <input type="tel" value={phone} onChange={(e) => { setPhone(e.target.value); clear("phone"); }}
                  placeholder="+234 801 234 5678" className={inputClass(!!errors.phone)} />
                {errors.phone ? (
                  <p className="text-red-500 text-[11px] mt-1">{errors.phone}</p>
                ) : (
                  <p className="text-[#331400]/35 text-[11px] mt-1">For delivery coordination</p>
                )}
              </motion.div>

              {/* Mobile order summary */}
              <motion.div variants={item} className="lg:hidden border border-[#331400]/10 bg-white p-4 space-y-3">
                <p className="text-[10px] font-bold text-[#331400]/40 uppercase tracking-widest">Order Summary</p>
                <div className="flex justify-between text-sm text-[#331400]/60">
                  <span>{product.name}</span>
                  <span className="line-through">₦{product.basePrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#331400]/60">Pre-order discount (15%)</span>
                  <span className="text-green-600 font-medium">−₦{discount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#331400]/60">Delivery</span>
                  <span className="text-green-600 font-medium">Free</span>
                </div>
                <div className="border-t border-[#331400]/10 pt-3 flex justify-between font-bold text-[#1a0800]">
                  <span>Total</span>
                  <span>₦{discountedPrice.toLocaleString()}</span>
                </div>
              </motion.div>

              <motion.div variants={item}>
                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-[#331400] text-white text-sm font-bold py-4 mt-2 hover:bg-[#4a2207] transition disabled:opacity-50"
                >
                  {loading ? "Processing…" : "Continue to Payment →"}
                </motion.button>
              </motion.div>
            </motion.div>
          </form>
        </motion.div>

        {/* ── Right: order summary (desktop) ── */}
        <motion.div
          className="hidden lg:flex flex-col gap-6 sticky top-16"
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <div className="bg-white border border-[#331400]/10 p-6 space-y-4 shadow-sm">
            <p className="text-[10px] font-bold text-[#331400] uppercase tracking-widest">Order Summary</p>
            <div className="flex items-center gap-4 pb-4 border-b border-[#331400]/10">
              <div className="w-14 h-9 bg-gradient-to-br from-[#FED45C] to-[#f5a623] flex items-center justify-center flex-shrink-0">
                <span className="text-[#331400] font-black text-[10px]">NFC</span>
              </div>
              <div>
                <p className="font-semibold text-sm text-[#1a0800]">{product.name}</p>
                <p className="text-[11px] text-[#331400]">{product.description}</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-[#331400]">Original price</span>
                <span className="line-through text-[#331400]">₦{product.basePrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#331400]">Pre-order discount (15%)</span>
                <span className="text-green-600 font-medium">−₦{discount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#331400]">Delivery</span>
                <span className="text-green-600 font-medium">Free</span>
              </div>
              <div className="border-t border-[#331400]/10 pt-3 flex justify-between font-bold text-[#1a0800]">
                <span>Total</span>
                <span className="text-lg">₦{discountedPrice.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-[#331400]/10 p-5 space-y-2 shadow-sm">
            <p className="text-[10px] font-bold text-[#331400] uppercase tracking-widest mb-3">Account Details</p>
            {[["Name", firstName || "—"], ["Username", `@${username || "—"}`], ["Email", email || "—"]].map(([label, val]) => (
              <div key={label} className="flex justify-between text-sm">
                <span className="text-[#331400]">{label}</span>
                <span className="font-medium text-[#1a0800] text-right max-w-[180px] truncate">{val}</span>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            {[
              { n: 1, label: "Create account" },
              { n: 2, label: "Add your links" },
              { n: 3, label: "Shipping details" },
              { n: 4, label: "Payment" },
              { n: 5, label: "Order confirmed" },
            ].map(({ n, label }) => (
              <div key={n} className={`flex items-center gap-3 text-sm ${n <= 3 ? "text-[#331400]" : "text-[#331400]/25"}`}>
                <div className={`w-6 h-6 flex items-center justify-center text-[10px] font-bold border transition-colors ${
                  n <= 2 ? "bg-[#FED45C] border-[#FED45C] text-[#331400]"
                  : n === 3 ? "border-[#331400] text-[#331400]"
                  : "border-[#331400]/20 text-[#331400]/25"
                }`}>
                  {n <= 2 ? "✓" : n}
                </div>
                {label}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </main>
  );
}
