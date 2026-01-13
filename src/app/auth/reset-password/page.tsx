"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { Loader2, ArrowLeft } from "lucide-react";

const ResetPassword = () => {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");


  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!newPassword || !confirmNewPassword) {
      toast.error("Please fill in all fields");
      return;
    }
    
    if (newPassword !== confirmNewPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      toast.success("Password Reset Successful", {
        description: "You have successfully reset your password",
      });
      setIsSubmitting(false);
      router.push("/auth/sign-in");
    }, 1500);
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
      <motion.div
        variants={formVariants}
        className="w-full max-w-md mx-auto"
      >
        
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
            className="text-[#666464] font-medium text-sm lg:text-[14px] md:w-3/4"
          >
            Kindly enter a new password to complete the reset process and secure your account.
          </motion.p>
        </motion.div>
        
        <motion.form
          variants={itemVariants}
          className="space-y-4"
          onSubmit={handleSubmit}
        >
          {/* New Password */}
          <motion.div 
            variants={itemVariants}
            className="space-y-2.5"
          >
            <Label htmlFor="new_password" className="font-semibold">
              New Password
            </Label>
            <motion.div
              variants={inputVariants}
              whileFocus="focus"
              animate="blur"
              className="relative"
            >
              <Input
                id="new_password"
                
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                className="h-12 w-full pr-10 border-1 border-[#331400]"
                disabled={isSubmitting}
              />
              
            </motion.div>
          </motion.div>

          {/* Confirm New Password */}
          <motion.div 
            variants={itemVariants}
            className="space-y-2"
          >
            <Label htmlFor="confirm_new_password" className="font-semibold">
              Confirm New Password
            </Label>
            <motion.div
              variants={inputVariants}
              whileFocus="focus"
              animate="blur"
              className="relative"
            >
              <Input
                id="confirm_new_password"
                
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                placeholder="Re-enter your password"
                className="h-12 w-full pr-10 border-1 border-[#331400]"
                disabled={isSubmitting}
              />
              
            </motion.div>
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
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <motion.div
                    initial={{ rotate: 0 }}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="flex items-center justify-center gap-2"
                  >
                    <Loader2 className="w-4 h-4" />
                    
                  </motion.div>
                ) : "Reset Password"}
              </Button>
            </motion.div>
          </motion.div>
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
                className="flex items-center md:hidden justify-start gap-2 text-[#331400] mt-4 text-[14px] font-semibold cursor-pointer hover:bg-[#4a2c1a] transition-colors w-full md:w-auto"
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