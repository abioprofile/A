"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useUpdateProfile } from "@/hooks/api/useAuth";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { useAppSelector } from "@/stores/hooks";



const SelectGoalPage = () => {
  const router = useRouter();
  const currentUser = useAppSelector((state) => state.auth.user);
  const [isMounted, setIsMounted] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<string | null>(currentUser?.profile?.goals?.[0] || null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const updateProfileMutation = useUpdateProfile();

  // Check if selected goal matches existing goal
  const existingGoal = currentUser?.profile?.goals?.[0];
  const isOwnGoal = selectedGoal === existingGoal;

  const goals: string[] = [
    "Grow My Brand",
    "Promote My Content",
    "Sell Products/Services",
    "Share all my Links",
    "Just Exploring",
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
        className="flex flex-col bg-[#FEF4EA] items-center justify-between min-h-screen p-5"
      >
        {/* Main content */}
        <div className="flex flex-col items-center justify-center flex-grow w-full max-w-xl">
          <motion.div 
            variants={itemVariants}
            className="text-center space-y-4 mb-8"
          >
            <motion.h1 
              className="text-3xl lg:text-4xl font-bold text-[#331400]"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              What best describes your goal for using Abio?Helps us personalize your experience.
            </motion.h1>
            <motion.p 
              variants={itemVariants}
              className="text-[#666464] text-sm lg:text-[14px] font-semibold"
            >
              What brings you to A.bio?
            </motion.p>
          </motion.div>

          <motion.div 
            variants={itemVariants}
            className="max-w-md w-full mx-auto"
          >
            <div className="space-y-4 mb-8">
              {goals.map((goal, index) => {
                const isSelected = selectedGoal === goal;

                return (
                  <motion.div
                    key={goal}
                    custom={index}
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: index * 0.1 }}
                  >
                    <motion.div
                      variants={goalButtonVariants}
                      initial="unselected"
                      animate={isSelected ? "selected" : "unselected"}
                      whileHover="hover"
                      whileTap="tap"
                      onClick={() => setSelectedGoal(goal)}
                      className={cn(
                        "w-full h-12 md:h-16 px-6 rounded-none flex items-center justify-between cursor-pointer border",
                        isSelected
                          ? "bg-[#D9D9D9] border-[#331400]"
                          : "bg-white border-gray-300"
                      )}
                    >
                      <span className="font-semibold text-[#331400]">
                        {goal}
                      </span>

                      <AnimatePresence>
                        {isSelected && (
                          <motion.div
                            key={`check-${goal}`}
                            variants={checkmarkVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                            >
                              <circle cx="12" cy="12" r="12" fill="#000000" />
                              <path
                                d="M17 8L10.5 14.5L7 11"
                                stroke="white"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  </motion.div>
                );
              })}
            </div>

            <motion.div
              variants={continueButtonVariants}
              initial="disabled"
              animate={selectedGoal ? "enabled" : "disabled"}
              whileHover={selectedGoal ? "hover" : {}}
              whileTap={selectedGoal ? "tap" : {}}
              onClick={handleSubmit}
              className={cn(
                "w-full h-12 text-black shadow-[4px_4px_0px_0px_#000000] font-semibold rounded-none flex items-center justify-center gap-2 cursor-pointer",
                !selectedGoal && "cursor-not-allowed opacity-50"
              )}
            >
              {(isSubmitting || updateProfileMutation.isPending) && !isOwnGoal ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="flex items-center gap-2"
                >
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full" />
                  
                </motion.div>
              ) : (
                <>
                  <span>Continue</span>
                  <motion.div
                    animate={{ x: selectedGoal ? 5 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M5 12h14" />
                      <path d="m12 5 7 7-7 7" />
                    </svg>
                  </motion.div>
                </>
              )}
            </motion.div>
          </motion.div>
        </div>

        {/* Footer */}
        <motion.footer 
          variants={itemVariants}
          className="w-full flex items-center justify-between gap-2 py-4 md:px-20 text-sm text-[#331400] mt-8"
        >
          <motion.p
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            © 2025 Abio
          </motion.p>

          <motion.a
            href="/privacy-policy"
            className="hover:text-[#000000] transition-colors"
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