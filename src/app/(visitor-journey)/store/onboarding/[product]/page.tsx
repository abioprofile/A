"use client";

import { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { getStoreProduct } from "@/lib/store-onboarding";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.07, delayChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] } },
};

// ✅ Moved outside — stable reference across renders, no remount on keystroke
const Field = ({
  id,
  label,
  error,
  hint,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}) => (
  <motion.div variants={item}>
    <label
      htmlFor={id}
      className="block text-xs font-bold text-[#331400]/70 mb-1 tracking-wide uppercase"
    >
      {label}
    </label>
    {children}
    {error ? (
      <p className="text-red-500 text-[11px] mt-1">{error}</p>
    ) : hint ? (
      <p className="text-[#331400]/40 text-[11px] mt-1">{hint}</p>
    ) : null}
  </motion.div>
);

export default function StoreOnboardingPage() {
  const router = useRouter();
  const params = useParams<{ product: string }>();
  const productId = params?.product ?? "";
  const product = useMemo(() => getStoreProduct(productId), [productId]);

  const [firstName, setFirstName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  if (!product) {
    return (
      <main className="min-h-screen bg-[#FEF4EA] flex items-center justify-center px-4">
        <div className="text-center text-[#331400]">
          <h1 className="text-xl font-bold mb-4">Product not found</h1>
          <Link href="/store" className="text-[#331400] underline text-sm font-semibold">
            Back to Store
          </Link>
        </div>
      </main>
    );
  }

  const discount = Math.round(product.basePrice * 0.15);
  const discountedPrice = product.basePrice - discount;
  const spotsLeft = 347;

  const validate = () => {
    const e: Record<string, string> = {};
    if (!firstName.trim()) e.firstName = "First name is required";
    if (!username.trim()) e.username = "Username is required";
    else if (!/^[a-z0-9_]+$/i.test(username)) e.username = "Only letters, numbers and underscores";
    if (!email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "Enter a valid email";
    if (!password) e.password = "Password is required";
    else if (password.length < 8) e.password = "At least 8 characters required";
    return e;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setLoading(true);
    const q = new URLSearchParams({ firstName, username, email });
    router.push(`/store/onboarding/${product.id}/links?${q}`);
  };

  const handleUsername = (val: string) => {
    setUsername(val.toLowerCase().replace(/\s+/g, "").replace(/[^a-z0-9_]/g, ""));
    if (errors.username)
      setErrors((prev) => {
        const n = { ...prev };
        delete n.username;
        return n;
      });
  };

  const inputClass = (hasError?: boolean) =>
    `w-full h-9 border-2 border-[#331400] text-base placeholder:text-sm sm:h-10 md:text-sm placeholder-[#331400]/30 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#FED45C] transition ${
      hasError ? "border-red-400" : ""
    }`;

  return (
    <main className="min-h-screen bg-[#FEF4EA]">
      <div className="max-w-6xl mx-auto px-4 py-10 lg:py-16 lg:grid lg:grid-cols-2 lg:gap-20 lg:items-start">

        {/* ── Left: form ── */}
        <motion.div
          className="w-full max-w-md mx-auto lg:mx-0"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {/* Hero */}
          <motion.div variants={item} className="mb-6">
            <motion.span
              className="text-4xl mt-16 mb-4 flex justify-center lg:mt-0 lg:justify-start"
              initial={{ rotate: -10, scale: 0.8 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 15, delay: 0.2 }}
            >
              <img src="/assets/hurray.svg" alt="hurray" width={100} height={100} />
            </motion.span>
            <h1 className="text-3xl font-extrabold mt-2 leading-tight text-[#1a0800]">HURRAY!</h1>
            <p className="text-lg mt-1 font-bold">Welcome to Abio</p>
            <p className="text-sm text-[#331400]/60 mt-1 leading-relaxed">
              You're about to claim your spot and get your{" "}
              <span className="text-[#331400] font-semibold">{product.name}</span> at a special
              pre-order price — before we go live.
            </p>
          </motion.div>

          {/* Flash Pre-order Banner */}
          <motion.div
            variants={item}
            className="mb-7 border border-[#331400]/15 bg-[#331400]/5 p-4"
          >
            <p className="text-[10px] font-bold text-[#331400]/50 uppercase tracking-widest mb-2">
              ⚡ Flash Pre-Order Deal
            </p>
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-[#331400]/40 line-through text-sm">
                ₦{product.basePrice.toLocaleString()}
              </span>
              <span className="text-2xl font-extrabold text-[#1a0800]">
                ₦{discountedPrice.toLocaleString()}
              </span>
              <span className="bg-[#FED45C] text-[#331400] text-[10px] font-black px-2 py-0.5">
                15% OFF
              </span>
            </div>
            <div className="mt-2 flex flex-wrap gap-3 text-xs text-[#331400]/60">
              <span>🚚 Free Delivery</span>
              <span>📦 {spotsLeft} spots left</span>
              <span>💰 Save ₦{discount.toLocaleString()}</span>
            </div>
          </motion.div>

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate>
            <motion.div variants={container} animate="show" className="space-y-4">

              <Field id="firstName" label="First Name" error={errors.firstName}>
                <input
                  id="firstName"
                  type="text"
                  value={firstName}
                  onChange={(e) => {
                    setFirstName(e.target.value);
                    if (errors.firstName)
                      setErrors((p) => { const n = { ...p }; delete n.firstName; return n; });
                  }}
                  placeholder="Your first name"
                  className={inputClass(!!errors.firstName)}
                />
              </Field>

              <Field
                id="username"
                label="Username"
                error={errors.username}
                hint={`Your public link: abio.site/${username || "yourname"}`}
              >
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#331400]/35 text-xs pointer-events-none select-none">
                    abio.site/
                  </span>
                  <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => handleUsername(e.target.value)}
                    placeholder="yourname"
                    className={`${inputClass(!!errors.username)} pl-[72px]`}
                  />
                </div>
              </Field>

              <Field
                id="email"
                label="Email Address"
                error={errors.email}
                hint="We'll notify you when your card ships"
              >
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email)
                      setErrors((p) => { const n = { ...p }; delete n.email; return n; });
                  }}
                  placeholder="you@example.com"
                  className={inputClass(!!errors.email)}
                />
              </Field>

              <Field id="password" label="Password" error={errors.password}>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password)
                      setErrors((p) => { const n = { ...p }; delete n.password; return n; });
                  }}
                  placeholder="Min. 8 characters"
                  className={inputClass(!!errors.password)}
                />
              </Field>

              <motion.div variants={item}>
                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-[#331400] text-white text-sm font-bold shadow-[4px_4px_0px_#FED45C] py-4 mt-2 hover:bg-[#4a2207] transition disabled:opacity-50"
                >
                  {loading ? "Creating account…" : "👈 Claim My 15% Discount"}
                </motion.button>
              </motion.div>
            </motion.div>
          </form>

          <motion.p variants={item} className="text-center text-xs text-[#331400]/40 mt-5">
            Already have an account?{" "}
            <Link href="/login" className="text-red-500 font-semibold hover:underline">
              Login
            </Link>
          </motion.p>
        </motion.div>

        {/* ── Right: product preview (desktop only) ── */}
        <motion.div
          className="hidden lg:flex flex-col items-center justify-start sticky top-16 gap-6"
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <div className="w-full max-w-sm bg-white border border-[#331400]/10 p-6 space-y-3 shadow-sm">
            <p className="text-[10px] font-bold text-[#331400]/40 uppercase tracking-widest">
              Price Breakdown
            </p>
            <div className="flex justify-between text-sm">
              <span className="text-[#331400]/50">Original price</span>
              <span className="line-through text-[#331400]/30">₦{product.basePrice.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[#331400]/50">Pre-order discount (15%)</span>
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

          <div className="w-full max-w-sm space-y-2">
            {[
              { n: 1, label: "Create account", active: true },
              { n: 2, label: "Add your links", active: false },
              { n: 3, label: "Shipping details", active: false },
              { n: 4, label: "Payment", active: false },
              { n: 5, label: "Order confirmed", active: false },
            ].map(({ n, label, active }) => (
              <div
                key={n}
                className={`flex items-center gap-3 text-sm ${active ? "text-[#331400]" : "text-[#331400]/30"}`}
              >
                <div
                  className={`w-6 h-6 flex items-center justify-center text-[10px] font-bold border transition-colors ${
                    active ? "bg-[#FED45C] border-[#FED45C] text-[#331400]" : "border-[#331400]/20 text-[#331400]/30"
                  }`}
                >
                  {n}
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