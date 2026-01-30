"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useSignUp } from "@/hooks/api/useAuth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { SignUpFormData, signUpSchema } from "@/lib/validations/auth.schema";
import { motion, AnimatePresence,  } from "framer-motion";

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const signUpMutation = useSignUp();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = async (data: SignUpFormData) => {
    signUpMutation.mutate(data);
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.34, 1.56, 0.64, 1],
      },
    },
  };

  const logoVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6,
        ease: [0.34, 1.56, 0.64, 1],
      },
    },
  };

  const formVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.34, 1.56, 0.64, 1],
      },
    },
  };

  const buttonHoverVariants = {
    hover: {
      scale: 1.03,
      transition: {
        duration: 0.2,
        ease: [0.04, 0.62, 0.23, 0.98],
      },
    },
    tap: {
      scale: 0.98,
      transition: {
        duration: 0.1,
      },
    },
  };

  const socialButtonHoverVariants = {
    hover: {
      scale: 1.02,
      backgroundColor: "rgba(0, 0, 0, 0.05)",
      transition: {
        duration: 0.2,
        ease: [0.04, 0.62, 0.23, 0.98],
      },
    },
  };

  const errorVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: {
      opacity: 1,
      height: "auto",
      transition: {
        duration: 0.3,
        ease: [0.04, 0.62, 0.23, 0.98],
      },
    },
    exit: {
      opacity: 0,
      height: 0,
      transition: {
        duration: 0.2,
        ease: [0.04, 0.62, 0.23, 0.98],
      },
    },
  };

  const eyeButtonVariants = {
    tap: {
      scale: 0.9,
      transition: {
        duration: 0.1,
      },
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
      className="bg-[#FEF4EA] min-h-screen w-full flex flex-col"
    >
      {/* Logo Section */}
      <motion.div
        variants={logoVariants}
        className="px-4 pt-4 md:px-20 md:pt-8 md:pb-4"
      >
        <Link href="/" className="flex items-center mr-20 gap-1 group">
          <Image
            src="/icons/A.Bio.png"
            alt="A.Bio Logo"
            width={28}
            height={28}
            priority
            className="cursor-pointer select-none transition-transform group-hover:scale-105"
          />
          <span className="font-bold text-xl md:text-2xl text-black tracking-wide">
            bio
          </span>
        </Link>
      </motion.div>

      {/* Centered Form Container */}
      <div className="flex-1 flex items-center justify-center p-4">
        <motion.div variants={formVariants} className="w-full max-w-md">
          <motion.div variants={itemVariants} className="mb-6 text-center">
            <motion.h1
              className="text-2xl md:text-3xl font-extrabold mb-2 bg-[#331400] text-transparent bg-clip-text"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              Join Abio
            </motion.h1>
            <motion.p
              variants={itemVariants}
              className="text-[#666464] capitalize text-sm lg:text-[14px] font-medium"
            >
              Sign up for free!
            </motion.p>
          </motion.div>

          <motion.form
            variants={itemVariants}
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4 w-full"
            noValidate
          >
            {/* Name */}
            <motion.div variants={itemVariants} className="space-y-2">
              <Label htmlFor="name" className="font-semibold text-sm">
                Name
              </Label>
              <div>
                <Input
                  id="name"
                  type="text"
                  placeholder="Name"
                  className="h-10 text-base md:text-sm placeholder:text-sm border border-[#000] focus:border-[#FED45C] focus:ring-1 focus:ring-[#FED45C] outline-none"
                  style={{ fontSize: "16px" }}
                  {...register("name")}
                  disabled={isSubmitting || signUpMutation.isPending}
                  aria-invalid={errors.name ? "true" : "false"}
                  aria-describedby={errors.name ? "name-error" : undefined}
                />
              </div>
              <AnimatePresence mode="wait">
                {errors.name && (
                  <motion.p
                    key="name-error"
                    id="name-error"
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    variants={errorVariants}
                    className="text-xs text-red-500 overflow-hidden"
                    role="alert"
                  >
                    {errors.name.message}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Email */}
            <motion.div variants={itemVariants} className="space-y-2">
              <Label htmlFor="email" className="font-semibold text-sm">
                Email Address
              </Label>
              <div>
                <Input
                  id="email"
                  type="email"
                  placeholder="Email"
                  className="h-10 text-sm placeholder:text-sm border border-[#000] focus:border-[#FED45C] focus:ring-1 focus:ring-[#FED45C] outline-none"
                  style={{ fontSize: "16px" }}
                  {...register("email")}
                  disabled={isSubmitting || signUpMutation.isPending}
                  aria-invalid={errors.email ? "true" : "false"}
                  aria-describedby={errors.email ? "email-error" : undefined}
                />
              </div>
              <AnimatePresence mode="wait">
                {errors.email && (
                  <motion.p
                    key="email-error"
                    id="email-error"
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    variants={errorVariants}
                    className="text-xs text-red-500 overflow-hidden"
                    role="alert"
                  >
                    {errors.email.message}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Password */}
            <motion.div variants={itemVariants} className="space-y-2">
              <Label htmlFor="password" className="font-semibold text-sm">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  className="h-10 pr-10 text-base md:text-sm placeholder:text-sm border border-[#000] focus:border-[#FED45C] focus:ring-1 focus:ring-[#FED45C] outline-none"
                  style={{ fontSize: "16px" }}
                  placeholder="Password"
                  {...register("password")}
                  disabled={isSubmitting || signUpMutation.isPending}
                  aria-invalid={errors.password ? "true" : "false"}
                  aria-describedby={errors.password ? "password-error" : undefined}
                />
                <motion.button
                  type="button"
                  variants={eyeButtonVariants}
                  whileTap="tap"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isSubmitting || signUpMutation.isPending}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={showPassword ? "eye-off" : "eye"}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      variants={eyeIconVariants}
                      transition={{ duration: 0.2 }}
                    >
                      {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                    </motion.div>
                  </AnimatePresence>
                </motion.button>
              </div>
              <AnimatePresence mode="wait">
                {errors.password && (
                  <motion.p
                    key="password-error"
                    id="password-error"
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    variants={errorVariants}
                    className="text-xs text-red-500 overflow-hidden"
                    role="alert"
                  >
                    {errors.password.message}
                  </motion.p>
                )}
              </AnimatePresence>
              <motion.p
                variants={itemVariants}
                className="text-xs text-gray-600"
              >
                Must be at least 8 characters with uppercase, lowercase, number,
                and special character
              </motion.p>
            </motion.div>

            {/* Confirm Password */}
            <motion.div variants={itemVariants} className="space-y-2">
              <Label
                htmlFor="passwordConfirm"
                className="font-semibold text-sm"
              >
                Confirm Password
              </Label>
              <div className="relative">
                <Input
                  id="passwordConfirm"
                  type={showConfirmPassword ? "text" : "password"}
                  className="h-10 pr-10 text-base md:text-sm placeholder:text-sm border border-[#000] focus:border-[#FED45C] focus:ring-1 focus:ring-[#FED45C] outline-none"
                  style={{ fontSize: "16px" }}
                  placeholder="Confirm Password"
                  {...register("passwordConfirm")}
                  disabled={isSubmitting || signUpMutation.isPending}
                  aria-invalid={errors.passwordConfirm ? "true" : "false"}
                  aria-describedby={errors.passwordConfirm ? "passwordConfirm-error" : undefined}
                />
                <motion.button
                  type="button"
                  variants={eyeButtonVariants}
                  whileTap="tap"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={isSubmitting || signUpMutation.isPending}
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={showConfirmPassword ? "eye-off" : "eye"}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      variants={eyeIconVariants}
                      transition={{ duration: 0.2 }}
                    >
                      {showConfirmPassword ? (
                        <Eye size={18} />
                      ) : (
                        <EyeOff size={18} />
                      )}
                    </motion.div>
                  </AnimatePresence>
                </motion.button>
              </div>
              <AnimatePresence mode="wait">
                {errors.passwordConfirm && (
                  <motion.p
                    key="passwordConfirm-error"
                    id="passwordConfirm-error"
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    variants={errorVariants}
                    className="text-xs text-red-500 overflow-hidden"
                    role="alert"
                  >
                    {errors.passwordConfirm.message}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Submit Button */}
            <motion.div variants={itemVariants}>
              <motion.div
                variants={buttonHoverVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <Button
                  type="submit"
                  className="w-full h-10 bg-[#FED45C] text-[#331400] text-sm font-semibold hover:bg-[#fecf4a] transition-colors"
                  disabled={isSubmitting || signUpMutation.isPending}
                  aria-label="Create account"
                >
                  {isSubmitting || signUpMutation.isPending
                    ? "Creating Account..."
                    : "Create Account"}
                </Button>
              </motion.div>
            </motion.div>

            {/* OR Divider */}
            <motion.div
              variants={itemVariants}
              className="flex items-center gap-3"
            >
              <Separator className="flex-1" />
              <motion.span
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, duration: 0.3 }}
                className="text-gray-500 text-xs"
              >
                or
              </motion.span>
              <Separator className="flex-1" />
            </motion.div>

            {/* Social Buttons */}
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-2 gap-3"
            >
              <motion.div
                variants={socialButtonHoverVariants}
                whileHover="hover"
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  type="button"
                  variant="outline"
                  className="h-10 text-sm font-medium flex items-center justify-center gap-2 w-full"
                  disabled={isSubmitting || signUpMutation.isPending}
                  aria-label="Sign up with Apple"
                >
                  <Image
                    src="/assets/icons/auth/apple.svg"
                    alt="Apple icon"
                    width={16}
                    height={16}
                    priority
                    className="select-none"
                  />
                  Apple
                </Button>
              </motion.div>
              <motion.div
                variants={socialButtonHoverVariants}
                whileHover="hover"
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  type="button"
                  variant="outline"
                  className="h-10 text-sm font-medium flex items-center justify-center gap-2 w-full"
                  disabled={isSubmitting || signUpMutation.isPending}
                  aria-label="Sign up with Google"
                >
                  <Image
                    src="/assets/icons/auth/google.svg"
                    alt="Google icon"
                    width={16}
                    height={16}
                    priority
                    className="select-none"
                  />
                  Google
                </Button>
              </motion.div>
            </motion.div>

            {/* Redirect to Sign In */}
            <motion.div variants={itemVariants} className="text-center pt-2">
              <motion.p
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
                className="text-sm font-semibold"
              >
                Already a user?{" "}
                <motion.span
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    href="/auth/sign-in"
                    className="text-[#EA2228] font-semibold hover:underline focus:outline-none focus:ring-2 focus:ring-[#EA2228] focus:ring-offset-2 rounded px-1"
                    tabIndex={0}
                  >
                    Sign In
                  </Link>
                </motion.span>
              </motion.p>
            </motion.div>
          </motion.form>

          {/* Privacy Policy */}
          <motion.div
            variants={itemVariants}
            className="mt-8 pt-4 text-center md:text-right"
          >
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link
                href="/privacy-policy"
                className="text-xs font-medium text-gray-600 hover:text-gray-900 hover:underline transition-colors focus:outline-none focus:ring-2 focus:ring-[#331400] focus:ring-offset-2 rounded px-1"
                tabIndex={0}
              >
                Privacy Policy
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default SignUp;