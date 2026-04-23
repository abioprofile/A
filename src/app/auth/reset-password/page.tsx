"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useState, useEffect, Suspense } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { Loader2, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ResetPasswordFormData,
  resetPasswordSchema,
} from "@/lib/validations/auth.schema";
import { useResetPassword } from "@/hooks/api/useAuth";

const ResetPassword = () => {
  return (
    <Suspense>
      <ResetPasswordContent />
    </Suspense>
  );
};

const ResetPasswordContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const email = searchParams.get("email") || "";

  const [isMounted, setIsMounted] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const resetPasswordMutation = useResetPassword();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!token) {
      return;
    }
    resetPasswordMutation.mutate({
      token,
      password: data.newPassword,
      passwordConfirm: data.confirmNewPassword,
    });
  };

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
        ease: [0.34, 1.56, 0.64, 1],
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
        ease: [0.34, 1.56, 0.64, 1],
      },
    },
  };

  const buttonHoverVariants: Variants = {
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

  const backButtonVariants: Variants = {
    hover: {
      scale: 1.05,
      backgroundColor: "#4a2c1a",
      transition: {
        duration: 0.2,
        ease: [0.04, 0.62, 0.23, 0.98],
      },
    },
    tap: {
      scale: 0.95,
      transition: {
        duration: 0.1,
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

  if (!isMounted) {
    return null;
  }

  if (!token) {
    return (
      <div className="min-h-screen w-full bg-[#FEF4EA] flex justify-center items-center p-5">
        <div className="w-full max-w-md mx-auto text-center">
          <h1 className="text-2xl font-extrabold mb-4 text-[#331400]">
            Invalid Reset Link
          </h1>
          <p className="text-[#666464] mb-6 text-sm">
            This password reset link is invalid or has expired. Please request a
            new one.
          </p>
          <Button
            onClick={() => router.push("/auth/forgot-password")}
            className="bg-[#FED45C] text-black font-semibold h-12 hover:bg-[#FED45C]/90"
          >
            Request New Link
          </Button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen w-full bg-[#FEF4EA] flex justify-center items-center p-5"
    >
      <motion.div variants={formVariants} className="w-full max-w-md mx-auto">
        <motion.div
          variants={itemVariants}
          className="mb-8 text-center md:text-left"
        >
          <motion.h1
            className="text-2xl lg:text-3xl font-extrabold mb-4 text-[#331400]"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            Reset Password
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-[#666464] font-medium text-sm md:w-3/4"
          >
            {email
              ? `Enter a new password for ${email}`
              : "Kindly enter a new password to complete the reset process and secure your account."}
          </motion.p>
        </motion.div>

        <motion.form
          variants={itemVariants}
          className="space-y-4"
          onSubmit={handleSubmit(onSubmit)}
        >
          {/* New Password */}
          <motion.div variants={itemVariants} className="space-y-2.5">
            <Label htmlFor="new_password" className="font-semibold">
              New Password
            </Label>
            <div className="relative">
              <Input
                id="new_password"
                type={showNewPassword ? "text" : "password"}
                {...register("newPassword")}
                placeholder="Enter new password"
                className="h-12 w-full pr-10 text-base md:text-sm border-1 border-[#331400]"
                disabled={isSubmitting || resetPasswordMutation.isPending}
              />
              <button
                type="button"
                onClick={() => setShowNewPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#666464] hover:text-[#331400]"
                tabIndex={-1}
              >
                {showNewPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            <AnimatePresence mode="wait">
              {errors.newPassword && (
                <motion.p
                  key="new-password-error"
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={errorVariants}
                  className="text-xs text-red-500 overflow-hidden"
                >
                  {errors.newPassword.message}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Confirm New Password */}
          <motion.div variants={itemVariants} className="space-y-2">
            <Label htmlFor="confirm_new_password" className="font-semibold">
              Confirm New Password
            </Label>
            <div className="relative">
              <Input
                id="confirm_new_password"
                type={showConfirmPassword ? "text" : "password"}
                {...register("confirmNewPassword")}
                placeholder="Re-enter your password"
                className="h-12 w-full pr-10 text-base md:text-sm border-1 border-[#331400]"
                disabled={isSubmitting || resetPasswordMutation.isPending}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#666464] hover:text-[#331400]"
                tabIndex={-1}
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            <AnimatePresence mode="wait">
              {errors.confirmNewPassword && (
                <motion.p
                  key="confirm-password-error"
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={errorVariants}
                  className="text-xs text-red-500 overflow-hidden"
                >
                  {errors.confirmNewPassword.message}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>

          <motion.div variants={itemVariants} className="space-y-3">
            <motion.div
              variants={buttonHoverVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <Button
                type="submit"
                className="w-full bg-[#FED45C] text-black font-semibold h-12 hover:bg-[#FED45C]/90"
                disabled={isSubmitting || resetPasswordMutation.isPending}
              >
                {isSubmitting || resetPasswordMutation.isPending ? (
                  <motion.div
                    initial={{ rotate: 0 }}
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="flex items-center justify-center gap-2"
                  >
                    <Loader2 className="w-4 h-4" />
                  </motion.div>
                ) : (
                  "Reset Password"
                )}
              </Button>
            </motion.div>
          </motion.div>
        </motion.form>

        {/* Back Button */}
        <motion.div
          variants={itemVariants}
          className="flex justify-center md:justify-start"
        >
          <motion.button
            variants={backButtonVariants}
            whileHover="hover"
            whileTap="tap"
            onClick={() => router.back()}
            className="flex items-center md:hidden justify-start gap-2 text-[#331400] mt-4 text-sm font-semibold cursor-pointer hover:bg-[#4a2c1a] transition-colors w-full md:w-auto"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </motion.button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default ResetPassword;
