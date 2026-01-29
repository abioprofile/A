"use client";

import { useState, useEffect, FormEvent } from "react";
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

// Define types
interface Goal {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

interface UserProfile {
  goals?: string[];
}

interface CurrentUser {
  profile?: UserProfile;
}

interface UpdateProfileData {
  goals: string[];
}

const MotionButton = motion.create(Button);

const SelectGoalPage = () => {
  const router = useRouter();
  const currentUser = useAppSelector((state) => state.auth.user) as CurrentUser | null;
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [selectedGoal, setSelectedGoal] = useState<string | null>(
    currentUser?.profile?.goals?.[0] || null,
  );
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const updateProfileMutation = useUpdateProfile();

  const goals: Goal[] = [
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

  const handleSubmit = async (): Promise<void> => {
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
      const updateData: UpdateProfileData = {
        goals: [selectedGoal],
      };
      
      updateProfileMutation.mutate(updateData, {
        onSuccess: () => {
          toast.success("Goal saved successfully!");
          router.push("/auth/platforms");
        },
        onError: () => {
          setIsSubmitting(false);
        },
      });
    } catch (error) {
      setIsSubmitting(false);
      toast.error("Failed to update goal");
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
        className="bg-[#FEF4EA] min-h-screen w-full flex flex-col relative"
      >
        {/* Logo - Top Left */}
        <motion.div
          variants={logoVariants}
          className="absolute top-0 left-0 px-4 pt-4 md:px-6 md:pt-6 lg:px-8 lg:pt-8"
        >
          <Link href="/" className="flex items-center gap-1 group">
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

        {/* Centered Content */}
        <div className="flex-1 flex flex-col items-center justify-center w-full px-4 sm:px-6 lg:px-8 pt-20 pb-8">
          <div className="w-full max-w-md mx-auto flex flex-col items-center justify-center">
            
            {/* Title Section */}
            <motion.div
              variants={itemVariants}
              className="text-center space-y-4 mb-10 w-full"
            >
              <motion.h1 className="text-2xl md:text-3xl font-bold text-[#1a1a1a] leading-tight">
                What best describes your goal for using Abio?
              </motion.h1>
              <motion.p
                variants={itemVariants}
                className="text-[#666666] text-base md:text-lg"
              >
                Helps us personalize your experience.
              </motion.p>
            </motion.div>

            {/* Goal Cards - Centered */}
            <motion.div
              variants={itemVariants}
              className="w-full space-y-4 mb-8"
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
                    className="w-full"
                  >
                    <motion.button
                      onClick={() => setSelectedGoal(goal.title)}
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      className={cn(
                        "w-full p-5 md:p-6 text-left transition-all duration-200 border-2 flex items-center gap-4",
                        isSelected
                          ? "bg-white border-black shadow-lg"
                          : "bg-white border-white hover:shadow-md",
                      )}
                    >
                      {/* Icon Section */}
                      <div
                        className={cn(
                          "flex-shrink-0 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full",
                          isSelected ? "bg-yellow-300" : "bg-gray-100",
                        )}
                      >
                        <Icon size={20} className="text-gray-800" />
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

            {/* Continue Button - Centered */}
            <motion.div variants={itemVariants} className="w-full">
              <MotionButton
                onClick={handleSubmit}
                disabled={!selectedGoal || isSubmitting || updateProfileMutation.isPending}
                whileHover={selectedGoal && !isSubmitting && !updateProfileMutation.isPending ? { scale: 1.02 } : {}}
                whileTap={selectedGoal && !isSubmitting && !updateProfileMutation.isPending ? { scale: 0.98 } : {}}
                className={cn(
                  "w-full py-4 px-6 font-bold text-lg transition-all duration-200 flex items-center justify-center gap-2",
                  selectedGoal && !isSubmitting && !updateProfileMutation.isPending
                    ? "bg-yellow-400 text-black hover:shadow-lg cursor-pointer"
                    : "bg-gray-300 text-gray-600 cursor-not-allowed opacity-50",
                )}
              >
                {(isSubmitting || updateProfileMutation.isPending) ? (
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
        </div>

        {/* Footer - Centered at bottom */}
        <motion.footer
          variants={itemVariants}
          className="px-4 py-6 text-center"
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