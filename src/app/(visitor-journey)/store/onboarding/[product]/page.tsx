"use client";

import { useMemo, useState, useRef, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { getStoreProduct } from "@/lib/store-onboarding";
import { signUp, updateProfile, usernameAvailability, verifyEmail, resendOtp } from "@/lib/api/auth.api";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.07, delayChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] } },
};

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

function validate(values: {
  firstName: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}) {
  const e: Record<string, string> = {};
  if (!values.firstName.trim()) e.firstName = "First name is required";
  if (!values.username.trim()) e.username = "Username is required";
  else if (!/^[a-z0-9_]+$/i.test(values.username))
    e.username = "Only letters, numbers and underscores";
  if (!values.email.trim()) e.email = "Email is required";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email))
    e.email = "Enter a valid email";
  if (!values.password) e.password = "Password is required";
  else if (values.password.length < 8) e.password = "At least 8 characters";
  if (values.confirmPassword !== values.password)
    e.confirmPassword = "Passwords do not match";
  return e;
}

export default function StoreOnboardingPage() {
  const router = useRouter();
  const params = useParams<{ product: string }>();
  const productId = params?.product ?? "";
  const product = useMemo(() => getStoreProduct(productId), [productId]);

  const [firstName, setFirstName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState("");

  // OTP modal state
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [otpError, setOtpError] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const otpRefs = useRef<Array<HTMLInputElement | null>>([]);

  // Countdown timer for resend
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [resendCooldown]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate({ firstName, username, email, password, confirmPassword });
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);

    try {
      setLoadingStep("Checking username…");
      const available = await usernameAvailability(username);
      if (!available.data.isAvailable) {
        setErrors({ username: "This username is already taken" });
        setLoading(false);
        setLoadingStep("");
        return;
      }

      setLoadingStep("Creating your account…");
      await signUp({ name: firstName, email, password, passwordConfirm: confirmPassword } as any);

      // Show OTP modal — backend sends verification email
      setLoading(false);
      setLoadingStep("");
      setOtp(["", "", "", "", "", ""]);
      setOtpError("");
      setResendCooldown(60);
      setShowOtp(true);
      return;
    } catch (err: any) {
      const msg: string =
        err?.response?.data?.message ?? err?.message ?? "Something went wrong. Please try again.";

      const lower = msg.toLowerCase();
      if (lower.includes("email")) {
        setErrors({ email: msg });
      } else if (lower.includes("username")) {
        setErrors({ username: msg });
      } else if (lower.includes("password")) {
        setErrors({ password: msg });
      } else {
        setErrors({ firstName: msg });
      }
      setLoading(false);
      setLoadingStep("");
    }
  };

  // Called when user submits the 6-digit OTP
  const handleVerifyOtp = async () => {
    const code = otp.join("");
    if (code.length < 6) { setOtpError("Enter the 6-digit code from your email"); return; }
    setOtpLoading(true);
    setOtpError("");
    try {
      // 1. Verify OTP — get back the auth token
      const res = await verifyEmail(code);
      const token = res?.data?.token;

      if (!token) {
        setOtpError("Verification failed. Please try again.");
        setOtpLoading(false);
        return;
      }

      // 2. Store token so all subsequent API calls are authenticated
      localStorage.setItem("auth_token", token);
      const userData = res?.data?.user;
      if (userData) localStorage.setItem("user_data", JSON.stringify(userData));

      // 3. Set username — best-effort, don't block navigation if it fails
      try {
        await updateProfile({ username, displayName: firstName });
      } catch {
        // profile can be updated later from dashboard
      }

      // 4. Proceed to next onboarding step
      setShowOtp(false);
      const q = new URLSearchParams({ firstName, username, email });
      router.push(`/store/onboarding/${product!.id}/links?${q}`);
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? "Invalid or expired code. Please try again.";
      setOtpError(msg);
      setOtpLoading(false);
    }
  };

  const handleOtpKey = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpChange = (index: number, val: string) => {
    const digit = val.replace(/\D/g, "").slice(-1);
    const next = [...otp];
    next[index] = digit;
    setOtp(next);
    setOtpError("");
    if (digit && index < 5) otpRefs.current[index + 1]?.focus();
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;
    e.preventDefault();
    const next = [...otp];
    pasted.split("").forEach((d, i) => { if (i < 6) next[i] = d; });
    setOtp(next);
    otpRefs.current[Math.min(pasted.length, 5)]?.focus();
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    try {
      await resendOtp(email);
      setResendCooldown(60);
      setOtpError("");
    } catch {
      setOtpError("Failed to resend code. Please try again.");
    }
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

  const clearError = (field: string) =>
    setErrors((prev) => { const n = { ...prev }; delete n[field]; return n; });

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
                  onChange={(e) => { setFirstName(e.target.value); clearError("firstName"); }}
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
                  onChange={(e) => { setEmail(e.target.value); clearError("email"); }}
                  placeholder="you@example.com"
                  className={inputClass(!!errors.email)}
                />
              </Field>

              <Field id="password" label="Password" error={errors.password}>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); clearError("password"); }}
                  placeholder="Min. 8 characters"
                  className={inputClass(!!errors.password)}
                />
              </Field>

              <Field id="confirmPassword" label="Confirm Password" error={errors.confirmPassword}>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => { setConfirmPassword(e.target.value); clearError("confirmPassword"); }}
                  placeholder="Re-enter your password"
                  className={inputClass(!!errors.confirmPassword)}
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
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin flex-shrink-0" />
                      {loadingStep || "Creating account…"}
                    </span>
                  ) : "👈 Claim My 15% Discount"}
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

      {/* ── OTP Verification Modal ── */}
      <AnimatePresence>
        {showOtp && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#1a0800]/50 backdrop-blur-sm px-4"
          >
            <motion.div
              initial={{ opacity: 0, y: 32, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.97 }}
              transition={{ duration: 0.28, ease: [0.25, 0.1, 0.25, 1] }}
              className="relative w-full max-w-sm bg-[#FEF4EA] border border-[#331400]/15 p-7 shadow-2xl"
            >
              {/* Header */}
              <div className="text-center mb-6">
                <div className="text-3xl mb-3">📬</div>
                <h2 className="text-xl font-extrabold text-[#1a0800]">Check your email</h2>
                <p className="text-xs text-[#331400]/50 mt-2 leading-relaxed">
                  We sent a 6-digit verification code to{" "}
                  <span className="font-semibold text-[#331400]">{email}</span>
                </p>
              </div>

              {/* OTP inputs */}
              <div className="flex justify-center gap-2 mb-4" onPaste={handleOtpPaste}>
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    ref={(el) => { otpRefs.current[i] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    onKeyDown={(e) => handleOtpKey(i, e)}
                    className={`w-11 h-12 text-center text-lg font-bold border-2 bg-white text-[#1a0800] focus:outline-none focus:ring-2 focus:ring-[#FED45C] transition ${
                      otpError ? "border-red-400" : digit ? "border-[#331400]" : "border-[#331400]/20"
                    }`}
                  />
                ))}
              </div>

              {otpError && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-500 text-xs text-center mb-3"
                >
                  {otpError}
                </motion.p>
              )}

              {/* Verify button */}
              <motion.button
                onClick={handleVerifyOtp}
                disabled={otpLoading || otp.join("").length < 6}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-[#331400] text-white text-sm font-bold py-3.5 hover:bg-[#4a2207] transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {otpLoading ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Verifying…
                  </>
                ) : "Verify & Continue →"}
              </motion.button>

              {/* Resend */}
              <div className="flex items-center justify-center gap-1 mt-4">
                <p className="text-xs text-[#331400]/40">Didn't receive it?</p>
                <button
                  onClick={handleResend}
                  disabled={resendCooldown > 0}
                  className="text-xs font-semibold text-[#331400] hover:underline disabled:text-[#331400]/30 disabled:no-underline transition"
                >
                  {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend code"}
                </button>
              </div>

              {/* Close */}
              <button
                onClick={() => setShowOtp(false)}
                className="absolute top-4 right-4 text-[#331400]/30 hover:text-[#331400] text-lg transition"
              >
                ✕
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}