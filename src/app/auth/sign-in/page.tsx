"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import Image from "next/image";
import { Eye, EyeOff, CheckCircle2 } from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  signInSchema,
  type SignInFormData,
} from "@/lib/validations/auth.schema";
import { useSignIn } from "@/hooks/api/useAuth";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { clearAuth } from "@/stores/slices/auth.slice";
import { useAppDispatch } from "@/stores/hooks";

// Field order for auto-progression
const FIELD_ORDER = ["email", "password"] as const;
type FieldName = (typeof FIELD_ORDER)[number];

const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [focusedField, setFocusedField] = useState<FieldName | null>(null);
  const signInMutation = useSignIn();
  const dispatch = useAppDispatch();

  // Refs for field chaining
  const fieldRefs = useRef<Record<FieldName, HTMLInputElement | null>>({
    email: null,
    password: null,
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    trigger,
    getValues,
    setValue,
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    // Keep original mode - don't validate on change
    mode: "onSubmit",
  });

  const { ref: passwordRegisterRef, ...passwordRegisterRest } =
    register("password");

  // Auto-advance to password field when email is valid (on blur only)
  const advanceToNextField = useCallback(
    async (currentField: FieldName) => {
      const currentIndex = FIELD_ORDER.indexOf(currentField);
      const nextField = FIELD_ORDER[currentIndex + 1];

      if (!nextField) return;

      // Only validate and advance if field has value
      const currentValue = getValues(currentField);
      if (currentValue?.trim()) {
        const isValid = await trigger(currentField);
        if (isValid) {
          setTimeout(() => {
            fieldRefs.current[nextField]?.focus();
          }, 50);
        }
      }
    },
    [trigger, getValues],
  );

  // Handle backspace on empty field to go to previous
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>, field: FieldName) => {
      const currentValue = getValues(field);

      if (e.key === "Backspace" && !currentValue) {
        const currentIndex = FIELD_ORDER.indexOf(field);
        const prevField = FIELD_ORDER[currentIndex - 1];

        if (prevField) {
          e.preventDefault();
          fieldRefs.current[prevField]?.focus();
        }
      }

      if (e.key === "Enter") {
        e.preventDefault();
        const currentIndex = FIELD_ORDER.indexOf(field);
        const nextField = FIELD_ORDER[currentIndex + 1];

        if (nextField) {
          fieldRefs.current[nextField]?.focus();
        } else {
          handleSubmit(onSubmit)();
        }
      }
    },
    [getValues, handleSubmit],
  );

  // Handle paste for email field
  const handlePaste = useCallback(
    (e: React.ClipboardEvent<HTMLInputElement>, field: FieldName) => {
      if (field === "email") {
        const pastedText = e.clipboardData.getData("text");
        if (pastedText.includes("@")) {
          setValue(field, pastedText);
          e.preventDefault();
        }
      }
    },
    [setValue],
  );

  const onSubmit = async (data: SignInFormData) => {
    signInMutation.mutate(data);
  };

  useEffect(() => {
    setIsMounted(true);
    // Auto-focus email field on load
    const timer = setTimeout(() => {
      fieldRefs.current.email?.focus();
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user_data");
    dispatch(clearAuth());
  }, [dispatch]);

  // Get field status for visual feedback (only show success if valid and has value, never show error on typing)
  const getFieldStatus = (field: FieldName) => {
    const value = getValues(field);
    const error = errors[field];

    if (!value) return "default";
    if (error) return "error";
    return "success";
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.4,
        when: "beforeChildren",
        staggerChildren: 0.06,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: [0.25, 0.1, 0.25, 1],
      },
    },
  };

  const logoVariants: Variants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.1, 0.25, 1],
      },
    },
  };

  const formVariants: Variants = {
    hidden: { opacity: 0, scale: 0.96 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.1, 0.25, 1],
      },
    },
  };

  const buttonHoverVariants: Variants = {
    hover: {
      scale: 1.02,
      transition: { duration: 0.2, ease: "easeInOut" },
    },
    tap: {
      scale: 0.98,
      transition: { duration: 0.1 },
    },
  };

  const socialButtonHoverVariants: Variants = {
    hover: {
      scale: 1.01,
      backgroundColor: "rgba(0, 0, 0, 0.04)",
      transition: { duration: 0.2 },
    },
  };

  const errorVariants: Variants = {
    hidden: { opacity: 0, height: 0, marginTop: 0 },
    visible: {
      opacity: 1,
      height: "auto",
      marginTop: 4,
      transition: { duration: 0.2, ease: "easeOut" },
    },
    exit: {
      opacity: 0,
      height: 0,
      marginTop: 0,
      transition: { duration: 0.15, ease: "easeIn" },
    },
  };

  const successIconVariants: Variants = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { type: "spring", stiffness: 500, damping: 30 },
    },
    exit: {
      scale: 0,
      opacity: 0,
      transition: { duration: 0.15 },
    },
  };

  const eyeIconVariants: Variants = {
    hidden: { rotate: -90, opacity: 0 },
    visible: { rotate: 0, opacity: 1 },
    exit: { rotate: 90, opacity: 0 },
  };

  if (!isMounted) {
    return null;
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="flex h-screen w-full flex-col overflow-hidden bg-gradient-to-br from-[#FEF4EA] via-[#FEF4EA] to-[#FEF0E0]"
    >
      {/* Logo Section */}
      <motion.div
        variants={logoVariants}
        className="shrink-0 px-4 pt-4 pb-2 md:px-12 lg:px-20 md:pt-8 md:pb-3"
      >
        <Link href="/" className="flex items-center gap-[1.5px] group">
          <Image
            src="/icons/A.bio.svg"
            alt="A.Bio Logo"
            width={24}
            height={24}
            priority
            className="transition-transform group-hover:scale-105"
          />
          <span className="font-medium tracking-[0em] text-3xl text-end text-black tracking-wide">
            bio
          </span>
        </Link>
      </motion.div>

      {/* Centered Form Container */}
      <div className="flex min-h-0 flex-1 items-center justify-center overflow-hidden p-4 sm:p-6">
        <motion.div variants={formVariants} className="w-full max-w-md">
          <motion.div variants={itemVariants} className="mb-8 text-center">
            <motion.h1
              className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-[#331400] to-[#662800] bg-clip-text text-transparent"
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.4 }}
            >
              Welcome Back!
            </motion.h1>
            <motion.p
              variants={itemVariants}
              className="text-[#666464] text-sm font-medium"
            >
              Enter your credentials to continue
            </motion.p>
          </motion.div>

          <motion.form
            variants={itemVariants}
            onSubmit={handleSubmit(onSubmit)}
            className="w-full space-y-5"
          >
            {/* Email Field */}
            <motion.div variants={itemVariants} className="space-y-1.5">
              {/* <Label
                htmlFor="email"
                className="font-semibold text-sm text-[#331400]"
              >
                Email Address
              </Label> */}
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email address"
                  autoComplete="email"
                  enterKeyHint="next"
                  className={`h-12 text-base  border-1 transition-all duration-200
                    ${getFieldStatus("email") === "error" ? "border-red-400 focus:border-red-500 bg-red-50/30" : ""}
                    ${getFieldStatus("email") === "success" ? "border-green-400 focus:border-green-500" : ""}
                    ${focusedField === "email" ? "ring-2 ring-[#FED45C]/40 border-[#FED45C]" : "border-[#E0D5C8]"}
                    placeholder:text-sm focus:outline-none`}
                  style={{ fontSize: "16px" }}
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => {
                    setFocusedField(null);
                    // Only validate on blur for email (original behavior)
                    const emailValue = getValues("email");
                    if (emailValue) {
                      trigger("email");
                      // Auto-advance if email is valid
                      if (!errors.email) {
                        advanceToNextField("email");
                      }
                    }
                  }}
                  onKeyDown={(e) => handleKeyDown(e, "email")}
                  onPaste={(e) => handlePaste(e, "email")}
                  {...register("email")}
                  ref={(el) => {
                    register("email").ref(el);
                    fieldRefs.current.email = el;
                  }}
                  disabled={isSubmitting || signInMutation.isPending}
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? "email-error" : undefined}
                />
                <AnimatePresence mode="wait">
                  {getFieldStatus("email") === "success" && (
                    <motion.div
                      variants={successIconVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                    >
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <AnimatePresence mode="wait">
                {errors.email && (
                  <motion.p
                    key="email-error"
                    variants={errorVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="text-xs text-red-500 font-medium"
                    role="alert"
                  >
                    {errors.email.message}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Password Field */}
            <motion.div variants={itemVariants} className="space-y-1.5">
              {/* <Label
                htmlFor="password"
                className="font-semibold text-sm text-[#331400]"
              >
                Password
              </Label> */}
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  enterKeyHint="done"
                  className={`h-12 pr-12 text-base  border-1 transition-all duration-200
                    ${getFieldStatus("password") === "error" ? "border-red-400 focus:border-red-500 bg-red-50/30" : ""}
                    ${getFieldStatus("password") === "success" ? "border-green-400 focus:border-green-500" : ""}
                    ${focusedField === "password" ? "ring-2 ring-[#FED45C]/40 border-[#FED45C]" : "border-[#E0D5C8]"}
                    placeholder:text-sm focus:outline-none`}
                  style={{ fontSize: "16px" }}
                  onFocus={() => setFocusedField("password")}
                  onBlur={() => {
                    setFocusedField(null);
                    // Validate password on blur
                    const passwordValue = getValues("password");
                    if (passwordValue) {
                      trigger("password");
                    }
                  }}
                  onKeyDown={(e) => handleKeyDown(e, "password")}
                  ref={(el) => {
                    passwordRegisterRef(el);
                    fieldRefs.current.password = el;
                  }}
                  {...passwordRegisterRest}
                  disabled={isSubmitting || signInMutation.isPending}
                  aria-invalid={!!errors.password}
                  aria-describedby={
                    errors.password ? "password-error" : undefined
                  }
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isSubmitting || signInMutation.isPending}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={showPassword ? "eye-off" : "eye"}
                      variants={eyeIconVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      transition={{ duration: 0.2 }}
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </motion.div>
                  </AnimatePresence>
                </button>
              </div>
              <AnimatePresence mode="wait">
                {errors.password && (
                  <motion.p
                    key="password-error"
                    variants={errorVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="text-xs text-red-500 font-medium"
                    role="alert"
                  >
                    {errors.password.message}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Forgot Password */}
            <motion.div variants={itemVariants} className="text-right">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-block"
              >
                <Link
                  href="/auth/forgot-password"
                  className="text-sm text-[#EA2228] font-semibold hover:underline transition-colors"
                >
                  Forgot Password?
                </Link>
              </motion.div>
            </motion.div>

            {/* Submit Button */}
            <motion.div variants={itemVariants} className="pt-2">
              <motion.div
                variants={buttonHoverVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <Button
                  type="submit"
                  isLoading={isSubmitting || signInMutation.isPending}
                  className="w-full h-12 bg-[#FED45C] text-[#331400] text-sm font-semibold   hover:shadow-lg transition-all duration-300"
                >
                  Sign In
                </Button>
              </motion.div>
            </motion.div>

            {/* Divider */}
            <motion.div
              variants={itemVariants}
              className="flex items-center gap-3 my-6"
            >
              <Separator className="flex-1 bg-[#E0D5C8]" />
              <motion.span
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4, duration: 0.3 }}
                className="text-gray-400 text-xs font-medium"
              >
                OR
              </motion.span>
              <Separator className="flex-1 bg-[#E0D5C8]" />
            </motion.div>

            {/* Google Sign In */}
            <motion.div variants={itemVariants}>
              <motion.div
                variants={socialButtonHoverVariants}
                whileHover="hover"
                whileTap={{ scale: 0.99 }}
              >
                <a
                  href="https://api.abio.site/api/v1/auth/google"
                  className="block"
                >
                  <Button
                    variant="outline"
                    className="h-11 text-sm font-medium flex items-center justify-center gap-3 w-full  border-1 border-[#E0D5C8] hover:border-[#FED45C] hover:bg-[#FED45C]/5 transition-all duration-200"
                    type="button"
                    disabled={isSubmitting || signInMutation.isPending}
                  >
                    <Image
                      src="/assets/icons/auth/google.svg"
                      alt="Google icon"
                      width={18}
                      height={18}
                      priority
                      className="select-none"
                    />
                    Continue with Google
                  </Button>
                </a>
              </motion.div>
            </motion.div>

            {/* Sign Up Link */}
            <motion.div variants={itemVariants} className="text-center pt-4">
              <p className="text-sm text-gray-600">
                Don't have an account?{" "}
                <Link
                  href="/auth/sign-up"
                  className="text-[#EA2228] font-semibold hover:underline hover:text-[#EA2228]/80 transition-colors"
                >
                  Sign up
                </Link>
              </p>
            </motion.div>
          </motion.form>

          {/* Privacy Policy */}
          <motion.div variants={itemVariants} className="mt-8 pt-2 text-center">
            <Link
              href="/privacy-policy"
              className="text-xs text-gray-400 hover:text-gray-600 hover:underline transition-colors"
            >
              Privacy Policy
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default SignIn;
