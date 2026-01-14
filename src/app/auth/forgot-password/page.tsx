"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useForgotPassword } from "@/hooks/api/useAuth";
import {
  ForgotPasswordFormData,
  forgotPasswordSchema,
} from "@/lib/validations/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const ForgotPassword = () => {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const forgotPasswordMutation = useForgotPassword();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    forgotPasswordMutation.mutate(data);
  };

  useEffect(() => {
    setIsMounted(true);
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

  const inputVariants: Variants = {
    focus: {
      scale: 1.02,
      transition: { duration: 0.2 },
    },
    blur: {
      scale: 1,
      transition: { duration: 0.2 },
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

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen w-full flex bg-[#FEF4EA] justify-center items-center p-5"
    >
      <motion.div variants={formVariants} className="w-full max-w-md mx-auto">
        <motion.div
          variants={itemVariants}
          className="mb-8 text-center md:text-left"
        >
          <motion.h1
            className="text-3xl lg:text-3xl font-extrabold mb-2 text-[#331400]"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            Forgot Password?
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-[#666464] text-[12px] font-medium lg:text-[14px]"
          >
            Opps. Enter your registered email to receive password reset instructions.
          </motion.p>
        </motion.div>

        <motion.form
          variants={itemVariants}
          className="space-y-4"
          onSubmit={handleSubmit(onSubmit)}
        >
          <motion.div variants={itemVariants} className="space-y-2.5">
            <Label htmlFor="email" className="font-semibold">
              Email Address
            </Label>
            <motion.div
              variants={inputVariants}
              whileFocus="focus"
              animate="blur"
            >
              <Input
                id="email"
                type="email"
                {...register("email")}
                placeholder="Enter your email address"
                className="h-12 w-full  border-1 border-[#331400] "
              />
            </motion.div>
            <AnimatePresence mode="wait">
              {errors.email && (
                <motion.p
                  key="email-error"
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={errorVariants}
                  className="text-xs text-red-500 overflow-hidden"
                >
                  {errors.email.message}
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
                disabled={isSubmitting || forgotPasswordMutation.isPending}
              >
                {isSubmitting || forgotPasswordMutation.isPending ? (
                  <motion.div
                    initial={{ rotate: 0 }}
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  >
                    <Loader2 className="w-4 h-4" />
                  </motion.div>
                ) : (
                  "Confirm email"
                )}
              </Button>
            </motion.div>

            {/* Back Button - Placed under the confirm button */}
            <motion.div
              variants={itemVariants}
              className="flex justify-center md:justify-start"
            >
              <motion.button
                variants={backButtonVariants}
                whileHover="hover"
                whileTap="tap"
                onClick={() => router.back()}
                className="flex items-center md:hidden justify-start gap-2 text-[#331400] mt-4 text-[14px] font-semibold cursor-pointer hover:bg-[#4a2c1a] transition-colors w-full md:w-auto"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </motion.button>
            </motion.div>
          </motion.div>
        </motion.form>
      </motion.div>
    </motion.div>
  );
};

export default ForgotPassword;
