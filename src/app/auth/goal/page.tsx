"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useUpdateProfile } from "@/hooks/api/useAuth";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { useAppSelector } from "@/stores/hooks";
import { Zap, Users, ShoppingCart, Link2, Compass } from "lucide-react";

const MotionButton = motion(Button);

const SelectGoalPage = () => {
  const router = useRouter();
  const currentUser = useAppSelector((state) => state.auth.user);
  const [isMounted, setIsMounted] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<string | null>(
    currentUser?.profile?.goals?.[0] || null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const updateProfileMutation = useUpdateProfile();

  // Check if selected goal matches existing goal
  const existingGoal = currentUser?.profile?.goals?.[0];
  const isOwnGoal = selectedGoal === existingGoal;

  const goals = [
    {
      id: "grow-brand",
      title: "Creator",
      description: "Grow my following and social media presence.",
      icon: Zap,
    },
    {
      id: "share-links",
      title: "Personal",
      description: "Share links with friends and acquaintances.",
      icon: Users,
    },
    {
      id: "sell-products",
      title: "Business",
      description: "Grow my business and build customer retention.",
      icon: ShoppingCart,
    },
  ];

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleSubmit = async () => {
    if (!selectedGoal) {
      toast.error("Please select a goal.");
      return;
    }

    // Check if the selected goal matches the user's existing goal
    const existingGoal = currentUser?.profile?.goals?.[0];
    const isOwnGoal = selectedGoal === existingGoal;

    // If it's their own goal, just redirect without calling the API
    if (isOwnGoal) {
      toast.success("Continuing with your goal");
      router.push("/auth/platforms");
      return;
    }

    // For new/changed goals, call the mutation
    setIsSubmitting(true);

    try {
      updateProfileMutation.mutate(
        {
          goals: [selectedGoal],
        },
        {
          onSuccess: () => {
            toast.success("Goal saved successfully!");
            router.push("/auth/platforms");
          },
          onError: () => {
            setIsSubmitting(false);
          },
        }
      );
    } catch (error) {
      setIsSubmitting(false);
    }
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

  const goalButtonVariants: Variants = {
    unselected: {
      scale: 1,
      backgroundColor: "#ffffff",
      borderColor: "#d1d5db",
    },
    selected: {
      scale: 1.02,
      backgroundColor: "#D9D9D9",
      borderColor: "#331400",
      transition: {
        duration: 0.2,
        ease: [0.04, 0.62, 0.23, 0.98],
      },
    },
    hover: {
      scale: 1.02,
      backgroundColor: "#f3f4f6",
      transition: {
        duration: 0.2,
        ease: [0.04, 0.62, 0.23, 0.98],
      },
    },
  };

  const checkmarkVariants: Variants = {
    hidden: { scale: 0 },
    visible: {
      scale: 1,
      transition: {
        duration: 0.3,
        ease: [0.34, 1.56, 0.64, 1],
      },
    },
    exit: {
      scale: 0,
      transition: {
        duration: 0.2,
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
        ease: [0.34, 1.56, 0.64, 1],
      },
    },
  };

  const continueButtonVariants: Variants = {
    disabled: {
      scale: 1,
      backgroundColor: "#D9D9D9",
      cursor: "not-allowed",
    },
    enabled: {
      scale: 1,
      backgroundColor: "#FED45C",
      transition: {
        duration: 0.2,
      },
    },
    hover: {
      scale: 1.05,
      boxShadow: "0 4px 12px rgba(254, 212, 92, 0.3)",
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

  if (!isMounted) {
    return null;
  }

  return (
    <ProtectedRoute>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="flex flex-col bg-[#FEF4EA] items-center justify-center min-h-screen p-5 md:p-8 relative"
      >
        {/* Logo - Top Left */}
        <motion.div
          variants={logoVariants}
          className="absolute top-6 left-6 md:top-8 md:left-8"
        >
          <Link href="/" className="flex items-end gap-1 group">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <Image
                src="/icons/A.Bio.png"
                alt="A.Bio Logo"
                width={48}
                height={48}
                priority
                className="cursor-pointer select-none"
              />
            </motion.div>
            <span className="text-[#331400] text-3xl font-bold">bio</span>
          </Link>
        </motion.div>

        {/* Main content */}
        <div className="flex flex-col items-center justify-center w-full max-w-2xl">
          {/* Title Section */}
          <motion.div
            variants={itemVariants}
            className="text-center space-y-3 mb-12 max-w-xl"
          >
            <motion.h1 className="text-3xl md:text-4xl font-bold text-[#1a1a1a] leading-tight">
              What best <br className="hidden" /> describes your goal{" "}
              <br className="hidden" /> for using Abio?
            </motion.h1>
            <motion.p
              variants={itemVariants}
              className="text-[#666666] text-base md:text-lg"
            >
              Helps us personalize your experience.
            </motion.p>
          </motion.div>

          {/* Goal Cards */}
          <motion.div
            variants={itemVariants}
            className="w-full max-w-xl space-y-4 mb-8"
          >
            {goals.map((goal, index) => {
              const isSelected = selectedGoal === goal.title;
              const Icon = goal.icon;

              return (
                <motion.div
                  key={goal.id}
                  custom={index}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: index * 0.1 }}
                >
                  <motion.button
                    onClick={() => setSelectedGoal(goal.title)}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className={cn(
                      "w-full p-6  text-left transition-all duration-200 border-2 flex items-center gap-4",
                      isSelected
                        ? "bg-white border-black shadow-lg"
                        : "bg-white border-white hover:shadow-md"
                    )}
                  >
                    {/* Icon Section */}
                    <div
                      className={cn(
                        "flex-shrink-0 w-12 h-12  flex items-center justify-center text-2xl",
                        isSelected ? "bg-yellow-300" : "bg-gray-100"
                      )}
                    >
                      <Icon size={24} className="text-gray-800" />
                    </div>

                    {/* Text Section */}
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-gray-900">
                        {goal.title}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {goal.description}
                      </p>
                    </div>

                    {/* Checkmark */}
                    <AnimatePresence>
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <div className="w-6 h-6 bg-gray-900 rounded-full flex items-center justify-center flex-shrink-0">
                            <svg
                              className="w-4 h-4 text-white"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="3"
                            >
                              <path d="M5 12l5 5L19 7" />
                            </svg>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.button>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Continue Button */}
          <motion.div variants={itemVariants} className="w-full max-w-xl">
            <MotionButton
              onClick={handleSubmit}
              disabled={!selectedGoal}
              whileHover={selectedGoal ? { scale: 1.02 } : {}}
              whileTap={selectedGoal ? { scale: 0.98 } : {}}
              className={cn(
                "w-full py-4 px-6 font-bold text-lg  transition-all duration-200 flex items-center justify-center gap-2",
                selectedGoal
                  ? "bg-yellow-400 text-black hover:shadow-lg cursor-pointer"
                  : "bg-gray-300 text-gray-600 cursor-not-allowed opacity-50"
              )}
            >
              {(isSubmitting || updateProfileMutation.isPending) &&
              !isOwnGoal ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full" />
                </motion.div>
              ) : (
                <>
                  <span>Next</span>
                  <motion.span
                    animate={{ x: selectedGoal ? 4 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    →
                  </motion.span>
                </>
              )}
            </MotionButton>
          </motion.div>
        </div>

        {/* Footer */}
        <motion.footer
          variants={itemVariants}
          className="absolute bottom-8 right-8"
        >
          <motion.a
            href="/privacy-policy"
            className="text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Privacy Policy
          </motion.a>
        </motion.footer>
      </motion.div>
    </ProtectedRoute>
  );
};

export default SelectGoalPage;
