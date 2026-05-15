"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef, useCallback } from "react";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, CheckCircle2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useSignUp } from "@/hooks/api/useAuth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { SignUpFormData, signUpSchema } from "@/lib/validations/auth.schema";
import { motion, AnimatePresence } from "framer-motion";

// Field order for auto-progression
const FIELD_ORDER = ["name", "email", "password", "passwordConfirm"] as const;
type FieldName = typeof FIELD_ORDER[number];

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [focusedField, setFocusedField] = useState<FieldName | null>(null);
  const signUpMutation = useSignUp();

  // Refs for field chaining
  const fieldRefs = useRef<Record<FieldName, HTMLInputElement | null>>({
    name: null,
    email: null,
    password: null,
    passwordConfirm: null,
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    trigger,
    getValues,
    setValue,
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    mode: "onSubmit",
  });

  // Destructure refs
  const { ref: emailRegisterRef, ...emailRegisterRest } = register("email");
  const { ref: passwordRegisterRef, ...passwordRegisterRest } = register("password");
  const { ref: confirmPasswordRegisterRef, ...confirmPasswordRegisterRest } = register("passwordConfirm");

  // Auto-advance to next field when current field is valid (on blur only)
  const advanceToNextField = useCallback(async (currentField: FieldName) => {
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
  }, [trigger, getValues]);

  // Handle backspace on empty field to go to previous
  const handleKeyDown = useCallback((
    e: React.KeyboardEvent<HTMLInputElement>,
    field: FieldName
  ) => {
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
  }, [getValues, handleSubmit]);

  // Handle paste for email field
  const handlePaste = useCallback((
    e: React.ClipboardEvent<HTMLInputElement>,
    field: FieldName
  ) => {
    if (field === "email") {
      const pastedText = e.clipboardData.getData("text");
      if (pastedText.includes("@")) {
        setValue(field, pastedText);
        e.preventDefault();
      }
    }
  }, [setValue]);

  const onSubmit = async (data: SignUpFormData) => {
    signUpMutation.mutate(data);
  };

  useEffect(() => {
    setIsMounted(true);
    // Auto-focus name field on load
    const timer = setTimeout(() => {
      fieldRefs.current.name?.focus();
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Get field status for visual feedback
  const getFieldStatus = (field: FieldName) => {
    const value = getValues(field);
    const error = errors[field];
    
    if (!value) return "default";
    if (error) return "error";
    return "success";
  };

  const containerVariants = {
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

  const itemVariants = {
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

  const logoVariants = {
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

  const formVariants = {
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

  const buttonHoverVariants = {
    hover: {
      scale: 1.02,
      transition: { duration: 0.2, ease: "easeInOut" },
    },
    tap: {
      scale: 0.98,
      transition: { duration: 0.1 },
    },
  };

  const socialButtonHoverVariants = {
    hover: {
      scale: 1.01,
      backgroundColor: "rgba(0, 0, 0, 0.04)",
      transition: { duration: 0.2 },
    },
  };

  const errorVariants = {
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

  const successIconVariants = {
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

  const eyeIconVariants = {
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
      className="bg-gradient-to-br from-[#FEF4EA] via-[#FEF4EA] to-[#FEF0E0] min-h-screen w-full flex flex-col"
    >
      {/* Logo Section */}
      <motion.div
        variants={logoVariants}
        className="px-4 pt-4 md:px-12 lg:px-20 md:pt-8 md:pb-2"
      >
        <Link href="/" className="flex items-center gap-1.5 group w-fit">
          <Image
            src="/icons/A.Bio.png"
            alt="A.Bio Logo"
            width={32}
            height={32}
            priority
            className="cursor-pointer select-none transition-all duration-300 group-hover:scale-105 group-hover:rotate-3"
          />
          <span className="font-bold text-xl md:text-2xl text-[#331400] tracking-tight">
            bio
          </span>
        </Link>
      </motion.div>

      {/* Centered Form Container */}
      <div className="flex-1 flex items-center justify-center px-4 py-6 md:py-8">
        <motion.div 
          variants={formVariants} 
          className="w-full max-w-md"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="mb-8 text-center">
            <motion.h1
              className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-[#331400] to-[#662800] bg-clip-text text-transparent"
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.4 }}
            >
              Create Account
            </motion.h1>
            <motion.p
              variants={itemVariants}
              className="text-[#666464] text-sm font-medium"
            >
              Join the Abio community today
            </motion.p>
          </motion.div>

          <motion.form
            variants={itemVariants}
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5 w-full"
            noValidate
          >
            {/* Name Field */}
            <motion.div variants={itemVariants} className="space-y-1.5">
              <Label 
                htmlFor="name" 
                className="font-semibold text-sm text-[#331400]"
              >
                Full Name
              </Label>
              <div className="relative">
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  autoComplete="name"
                  enterKeyHint="next"
                  className={`h-12 text-base border-2 transition-all duration-200
                    ${getFieldStatus("name") === "error" ? "border-red-400 focus:border-red-500 bg-red-50/30" : ""}
                    ${getFieldStatus("name") === "success" ? "border-green-400 focus:border-green-500" : ""}
                    ${focusedField === "name" ? "ring-2 ring-[#FED45C]/40 border-[#FED45C]" : "border-[#E0D5C8]"}
                    placeholder:text-sm focus:outline-none rounded-none`}
                  style={{ fontSize: "16px" }}
                  onFocus={() => setFocusedField("name")}
                  onBlur={() => {
                    setFocusedField(null);
                    const nameValue = getValues("name");
                    if (nameValue) {
                      trigger("name");
                      if (!errors.name) {
                        advanceToNextField("name");
                      }
                    }
                  }}
                  onKeyDown={(e) => handleKeyDown(e, "name")}
                  {...register("name")}
                  ref={(el) => {
                    register("name").ref(el);
                    fieldRefs.current.name = el;
                  }}
                  disabled={isSubmitting || signUpMutation.isPending}
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? "name-error" : undefined}
                />
                <AnimatePresence mode="wait">
                  {getFieldStatus("name") === "success" && (
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
                {errors.name && (
                  <motion.p
                    key="name-error"
                    id="name-error"
                    variants={errorVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="text-xs text-red-500 font-medium"
                    role="alert"
                  >
                    {errors.name.message}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Email Field */}
            <motion.div variants={itemVariants} className="space-y-1.5">
              <Label 
                htmlFor="email" 
                className="font-semibold text-sm text-[#331400]"
              >
                Email Address
              </Label>
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  enterKeyHint="next"
                  className={`h-12 text-base border-2 transition-all duration-200
                    ${getFieldStatus("email") === "error" ? "border-red-400 focus:border-red-500 bg-red-50/30" : ""}
                    ${getFieldStatus("email") === "success" ? "border-green-400 focus:border-green-500" : ""}
                    ${focusedField === "email" ? "ring-2 ring-[#FED45C]/40 border-[#FED45C]" : "border-[#E0D5C8]"}
                    placeholder:text-sm focus:outline-none rounded-none`}
                  style={{ fontSize: "16px" }}
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => {
                    setFocusedField(null);
                    const emailValue = getValues("email");
                    if (emailValue) {
                      trigger("email");
                      if (!errors.email) {
                        advanceToNextField("email");
                      }
                    }
                  }}
                  onKeyDown={(e) => handleKeyDown(e, "email")}
                  onPaste={(e) => handlePaste(e, "email")}
                  ref={(el) => {
                    emailRegisterRef(el);
                    fieldRefs.current.email = el;
                  }}
                  {...emailRegisterRest}
                  disabled={isSubmitting || signUpMutation.isPending}
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
                    id="email-error"
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
              <Label 
                htmlFor="password" 
                className="font-semibold text-sm text-[#331400]"
              >
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  className={`h-12 pr-12 text-base border-2 transition-all duration-200
                    ${getFieldStatus("password") === "error" ? "border-red-400 focus:border-red-500 bg-red-50/30" : ""}
                    ${getFieldStatus("password") === "success" ? "border-green-400 focus:border-green-500" : ""}
                    ${focusedField === "password" ? "ring-2 ring-[#FED45C]/40 border-[#FED45C]" : "border-[#E0D5C8]"}
                    placeholder:text-sm focus:outline-none rounded-none`}
                  style={{ fontSize: "16px" }}
                  placeholder="Create a strong password"
                  autoComplete="new-password"
                  enterKeyHint="next"
                  onFocus={() => setFocusedField("password")}
                  onBlur={() => {
                    setFocusedField(null);
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
                  disabled={isSubmitting || signUpMutation.isPending}
                  aria-invalid={!!errors.password}
                  aria-describedby={errors.password ? "password-error" : undefined}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isSubmitting || signUpMutation.isPending}
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
                <AnimatePresence mode="wait">
                  {getFieldStatus("password") === "success" && (
                    <motion.div
                      variants={successIconVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="absolute right-12 top-1/2 -translate-y-1/2"
                    >
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <AnimatePresence mode="wait">
                {errors.password && (
                  <motion.p
                    key="password-error"
                    id="password-error"
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
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.6 }}
                className="text-xs text-gray-500"
              >
                • 8+ characters • Uppercase & lowercase • Number & special char
              </motion.p>
            </motion.div>

            {/* Confirm Password Field */}
            <motion.div variants={itemVariants} className="space-y-1.5">
              <Label 
                htmlFor="passwordConfirm" 
                className="font-semibold text-sm text-[#331400]"
              >
                Confirm Password
              </Label>
              <div className="relative">
                <Input
                  id="passwordConfirm"
                  type={showConfirmPassword ? "text" : "password"}
                  className={`h-12 pr-12 text-base border-2 transition-all duration-200
                    ${getFieldStatus("passwordConfirm") === "error" ? "border-red-400 focus:border-red-500 bg-red-50/30" : ""}
                    ${getFieldStatus("passwordConfirm") === "success" ? "border-green-400 focus:border-green-500" : ""}
                    ${focusedField === "passwordConfirm" ? "ring-2 ring-[#FED45C]/40 border-[#FED45C]" : "border-[#E0D5C8]"}
                    placeholder:text-sm focus:outline-none rounded-none`}
                  style={{ fontSize: "16px" }}
                  placeholder="Confirm your password"
                  autoComplete="new-password"
                  enterKeyHint="done"
                  onFocus={() => setFocusedField("passwordConfirm")}
                  onBlur={() => {
                    setFocusedField(null);
                    const confirmValue = getValues("passwordConfirm");
                    if (confirmValue) {
                      trigger("passwordConfirm");
                    }
                  }}
                  onKeyDown={(e) => handleKeyDown(e, "passwordConfirm")}
                  ref={(el) => {
                    confirmPasswordRegisterRef(el);
                    fieldRefs.current.passwordConfirm = el;
                  }}
                  {...confirmPasswordRegisterRest}
                  disabled={isSubmitting || signUpMutation.isPending}
                  aria-invalid={!!errors.passwordConfirm}
                  aria-describedby={errors.passwordConfirm ? "passwordConfirm-error" : undefined}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={isSubmitting || signUpMutation.isPending}
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={showConfirmPassword ? "eye-off" : "eye"}
                      variants={eyeIconVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      transition={{ duration: 0.2 }}
                    >
                      {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </motion.div>
                  </AnimatePresence>
                </button>
                <AnimatePresence mode="wait">
                  {getFieldStatus("passwordConfirm") === "success" && (
                    <motion.div
                      variants={successIconVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="absolute right-12 top-1/2 -translate-y-1/2"
                    >
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <AnimatePresence mode="wait">
                {errors.passwordConfirm && (
                  <motion.p
                    key="passwordConfirm-error"
                    id="passwordConfirm-error"
                    variants={errorVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="text-xs text-red-500 font-medium"
                    role="alert"
                  >
                    {errors.passwordConfirm.message}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Submit Button */}
            <motion.div variants={itemVariants} className="pt-3">
              <motion.div
                variants={buttonHoverVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <Button
                  type="submit"
                  className="w-full h-12 bg-[#FED45C] text-[#331400] text-sm font-semibold rounded-none shadow-md hover:shadow-lg transition-all duration-300"
                  isLoading={isSubmitting || signUpMutation.isPending}
                  aria-label="Create account"
                >
                  Create Account
                </Button>
              </motion.div>
            </motion.div>

            {/* OR Divider */}
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

            {/* Social Sign Up */}
            <motion.div variants={itemVariants}>
              <motion.div
                variants={socialButtonHoverVariants}
                whileHover="hover"
                whileTap={{ scale: 0.99 }}
              >
                <a href="https://api.abio.site/api/v1/auth/google" className="block">
                  <Button
                    type="button"
                    variant="outline"
                    className="h-11 text-sm font-medium flex items-center justify-center gap-3 w-full border-2 border-[#E0D5C8] hover:border-[#FED45C] hover:bg-[#FED45C]/5 transition-all duration-200 rounded-none"
                    disabled={isSubmitting || signUpMutation.isPending}
                    aria-label="Sign up with Google"
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

            {/* Redirect to Sign In */}
            <motion.div variants={itemVariants} className="text-center pt-4">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <Link
                  href="/auth/sign-in"
                  className="text-[#EA2228] font-semibold hover:underline hover:text-[#EA2228]/80 transition-colors"
                >
                  Sign in
                </Link>
              </p>
            </motion.div>
          </motion.form>

          {/* Privacy Policy */}
          <motion.div
            variants={itemVariants}
            className="mt-8 pt-2 text-center"
          >
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

export default SignUp;