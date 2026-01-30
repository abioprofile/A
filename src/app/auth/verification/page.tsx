"use client";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { toast } from "sonner";
import { Suspense, useState, useEffect } from "react";
import { maskEmail } from "@/lib/helpers/mask-email";
import Link from "next/link";
import { useResendOtp, useVerifyOtp } from "@/hooks/api/useAuth";
import { useForm, Controller } from "react-hook-form";
import {
  VerifyOtpFormData,
  verifyOtpSchema,
} from "@/lib/validations/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

const OTPVerification = () => {
  return (
    <Suspense>
      <OTPVerificationContent />
    </Suspense>
  );
};

const OTPVerificationContent = () => {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const searchParams = useSearchParams();
  const emailParam = searchParams.get("email");

  const email = emailParam
    ? (() => {
        const decoded = decodeURIComponent(emailParam);
        const atIndex = decoded.indexOf("@");
        if (atIndex > 0) {
          return (
            decoded.substring(0, atIndex).replace(/\s/g, "+") +
            decoded.substring(atIndex)
          );
        }
        return decoded.replace(/\s/g, "+");
      })()
    : null;

  const verifyOtpMutation = useVerifyOtp();
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<VerifyOtpFormData>({
    resolver: zodResolver(verifyOtpSchema),
    defaultValues: {
      token: "",
    },
  });

  const onSubmit = async (data: VerifyOtpFormData) => {
    verifyOtpMutation.mutate(data);
  };

  const resendOtpMutation = useResendOtp();

  const onResendOtp = () => {
    if (!email) {
      toast.error("Email not found", {
        description: "Please sign up again",
      });
      return;
    }
    resendOtpMutation.mutate({ email: email });
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
      className="min-h-screen w-full bg-[#FEF4EA] flex justify-center items-center p-5"
    >
      <motion.div variants={formVariants} className="w-full max-w-md mx-auto">
        <motion.div
          variants={itemVariants}
          className="mb-8 text-center md:text-left"
        >
          <motion.h1
            className="text-2xl md:text-3xl lg:text-3xl font-extrabold mb-4 text-[#331400]"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            Input OTP Code
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-[13px] font-medium text-[#666464]"
          >
            {`We have sent an OTP code to your email ${maskEmail(
              email || ""
            )}. Enter the OTP code below to verify.`}
          </motion.p>
        </motion.div>

        <motion.form
          variants={itemVariants}
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col items-center w-full mt-4"
        >
          <div className="w-full flex flex-col items-center space-y-8">
            {/* OTP Input */}
            <motion.div variants={itemVariants} className="w-full flex justify-center">
              <Controller
                name="token"
                control={control}
                render={({ field }) => (
                  <InputOTP
                    {...field}
                    maxLength={6}
                    pattern={REGEXP_ONLY_DIGITS}
                    className="flex justify-between gap-2 md:gap-3 mx-auto"
                  >
                    {Array.from({ length: 6 }).map((_, index) => (
                      <InputOTPGroup key={index}>
                        <div>
                          <InputOTPSlot
                            index={index}
                            className="border border-[#000] size-10 md:size-12 text-center text-lg font-semibold transition-all duration-200 hover:border-[#331400] focus-within:border-[#331400]"
                          />
                        </div>
                      </InputOTPGroup>
                    ))}
                  </InputOTP>
                )}
              />
              <AnimatePresence mode="wait">
                {errors.token && (
                  <motion.p
                    key="token-error"
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    variants={errorVariants}
                    className="text-sm text-red-500 text-center mt-2 overflow-hidden"
                  >
                    {errors.token.message}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Change Email Link */}
            <motion.div
              variants={itemVariants}
              className="flex text-sm justify-end w-full"
            >
              <p className="font-semibold mr-1 text-[#666464]">
                Using different email address?
              </p>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="#"
                  className="font-semibold text-[#EA2228] hover:underline"
                >
                  Change
                </Link>
              </motion.div>
            </motion.div>

            {/* Confirm Button */}
            <motion.div variants={itemVariants} className="w-full">
              <motion.div
                variants={buttonHoverVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <Button
                  type="submit"
                  className="w-full h-12 text-md bg-[#FED45C] text-black lg:text-[16px] font-semibold hover:bg-[#FED45C]/90"
                  disabled={isSubmitting || verifyOtpMutation.isPending}
                >
                  {isSubmitting || verifyOtpMutation.isPending
                    ? "Verifying..."
                    : "Confirm Code"}
                </Button>
              </motion.div>
            </motion.div>

            {/* Resend OTP Button */}
            <motion.div variants={itemVariants} className="w-full">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-10 text-sm font-semibold hover:bg-gray-50"
                  onClick={onResendOtp}
                  disabled={resendOtpMutation.isPending}
                >
                  {resendOtpMutation.isPending
                    ? "Resending OTP..."
                    : "Resend OTP"}
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </motion.form>

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
            className="flex items-center md:hidden justify-start gap-2 text-[#331400] mt-4 text-[14px] font-semibold cursor-pointer transition-colors w-full md:w-auto"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </motion.button>
        </motion.div>
        {/* Privacy Policy */}
          <motion.div 
            variants={itemVariants}
            className="mt-8  text-center md:text-right"
          >
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link 
                href="/privacy-policy" 
                className="text-[12px] font-semibold hover:underline"
              >
                Privacy Policy
              </Link>
            </motion.div>
          </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default OTPVerification;
