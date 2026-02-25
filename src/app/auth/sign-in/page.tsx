"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";
import { useState, useEffect } from "react";
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

const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const signInMutation = useSignIn();
  const dispatch = useAppDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
  });

  const onSubmit = async (data: SignInFormData) => {
    signInMutation.mutate(data);
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    // clear the token and user data from the local storage (more like logout function)
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user_data");
    dispatch(clearAuth());
  }, []);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  const logoVariants: Variants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const formVariants: Variants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const buttonHoverVariants: Variants = {
    hover: {
      scale: 1.03,
      transition: {
        duration: 0.2,
        ease: "easeInOut",
      },
    },
    tap: {
      scale: 0.98,
      transition: {
        duration: 0.1,
      },
    },
  };

  const socialButtonHoverVariants: Variants = {
    hover: {
      scale: 1.02,
      backgroundColor: "rgba(0, 0, 0, 0.05)",
      transition: {
        duration: 0.2,
        ease: "easeInOut",
      },
    },
  };

  const errorVariants: Variants = {
    hidden: { opacity: 0, height: 0 },
    visible: {
      opacity: 1,
      height: "auto",
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
  };

  const eyeButtonVariants: Variants = {
    tap: {
      scale: 0.9,
      transition: {
        duration: 0.1,
      },
    },
  };

  if (!isMounted) {
    return null;
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="flex h-screen w-full flex-col overflow-hidden bg-[#FEF4EA]"
    >
      {/* Logo Section - shrink on small screens */}
      <motion.div
        variants={logoVariants}
        className="shrink-0 px-4 pt-3 pb-2 md:px-20 md:pt-8 md:pb-4"
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

      {/* Centered Form Container - fills remaining space, no scroll */}
      <div className="flex min-h-0 flex-1 items-center justify-center overflow-hidden p-3 sm:p-4">
        <motion.div variants={formVariants} className="w-full max-w-md">
          <motion.div variants={itemVariants} className="mb-3 text-center sm:mb-6">
            <motion.h1
              className="mb-1 text-[20px] font-extrabold text-[#331400] md:mb-4 md:text-[24px]"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              Welcome Back!
            </motion.h1>
            <motion.p
              variants={itemVariants}
              className="text-[#666464] text-sm lg:text-[14px] font-medium"
            >
              Enter your biography!
            </motion.p>
          </motion.div>

          <motion.form
            variants={itemVariants}
            onSubmit={handleSubmit(onSubmit)}
            className="w-full space-y-2 sm:space-y-4"
          >
            <motion.div variants={itemVariants} className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="email" className="font-semibold text-sm">
                Email Address
              </Label>
              <div>
                <Input
                  id="email"
                  type="email"
                  placeholder="Email"
                  className="h-9 border-1 border-[#331400] text-base placeholder:text-sm sm:h-10 md:text-sm"
                  {...register("email")}
                />
              </div>
              <AnimatePresence>
                {errors.email && (
                  <motion.p
                    key="email-error"
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    variants={errorVariants}
                    className="text-xs text-red-500 overflow-hidden"
                  >
                    {errors.email.message}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="password" className="font-semibold text-sm">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className="h-9 border-1 border-[#331400] pr-10 text-base placeholder:text-sm sm:h-10 md:text-sm"
                  {...register("password")}
                />
                <motion.button
                  type="button"
                  variants={eyeButtonVariants}
                  whileTap="tap"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={showPassword ? "eye-off" : "eye"}
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </motion.div>
                  </AnimatePresence>
                </motion.button>
              </div>
              <AnimatePresence>
                {errors.password && (
                  <motion.p
                    key="password-error"
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    variants={errorVariants}
                    className="text-xs text-red-500 overflow-hidden"
                  >
                    {errors.password.message}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>

            <motion.div variants={itemVariants} className="text-right">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link
                  href="/auth/forgot-password"
                  className="text-sm text-[#EA2228] font-semibold hover:underline"
                >
                  Forgot Password?
                </Link>
              </motion.div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <motion.div
                variants={buttonHoverVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <Button
                  type="submit"
                  disabled={isSubmitting || signInMutation.isPending}
                  className="w-full h-10 bg-[#FED45C] text-[#331400] text-sm font-semibold hover:bg-[#FED45C]/90"
                >
                  {isSubmitting || signInMutation.isPending
                    ? "Logging in..."
                    : "Login"}
                </Button>
              </motion.div>
            </motion.div>

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
                  variant="outline"
                  className="h-10 text-sm font-medium flex items-center justify-center gap-2 w-full"
                >
                  <Image
                    src="/assets/icons/auth/apple.svg"
                    alt="apple icon"
                    width={20}
                    height={20}
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
                  variant="outline"
                  className="h-10 text-sm font-medium flex items-center justify-center gap-2 w-full"
                >
                  <Image
                    src="/assets/icons/auth/google.svg"
                    alt="google icon"
                    width={20}
                    height={20}
                  />
                  Google
                </Button>
              </motion.div>
            </motion.div>

            {/* <motion.div variants={itemVariants} className="text-center pt-2">
              <motion.p
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
                className="text-sm font-semibold"
              >
                Don&apos;t have an account?{" "}
                <motion.span
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    href="/auth/sign-up"
                    className="text-[#EA2228] font-semibold hover:underline"
                  >
                    Sign Up
                  </Link>
                </motion.span>
              </motion.p>
            </motion.div> */}
          </motion.form>

          {/* Privacy Policy */}
          <motion.div
            variants={itemVariants}
            className="mt-8 pt-4 text-center"
          >
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link
                href="/privacy-policy"
                className="text-[12px] font-semibold hover:underline text-[#666464]"
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

export default SignIn;
