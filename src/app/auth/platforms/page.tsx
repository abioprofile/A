"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useUserStore } from "@/stores/user.store";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { PLATFORMS } from "@/data";
import { toast } from "sonner";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { ArrowLeft } from "lucide-react";

const MAX_PLATFORMS = 5;

const Platforms = () => {
  const [isMounted, setIsMounted] = useState(false);
  const { selectedPlatforms, togglePlatform } = useUserStore();
  const router = useRouter();
  

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handlePlatformClick = (platform: (typeof PLATFORMS)[number]) => {
    const alreadySelected = selectedPlatforms.some((p) => p.id === platform.id);

    if (!alreadySelected && selectedPlatforms.length >= MAX_PLATFORMS) {
      toast.error(`You can only select up to ${MAX_PLATFORMS} platforms.`);
      return;
    }

    togglePlatform(platform);
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.05,
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

  const platformVariants: Variants = {
    unselected: {
      scale: 1,
      backgroundColor: "#F7F7F7",
      borderColor: "transparent",
    },
    selected: {
      scale: 1.05,
      backgroundColor: "#F7F7F7",
      borderColor: "#331400",
      transition: {
        duration: 0.2,
        ease: [0.04, 0.62, 0.23, 0.98],
      },
    },
    hover: {
      scale: 1.03,
      backgroundColor: "#f0f0f0",
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
    <ProtectedRoute>
      <motion.main
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="min-h-screen bg-[#FEF4EA] flex flex-col justify-center p-5"
      >
        {/* 🔹 Full-width top bar - Skip button hidden on mobile */}
        <motion.div 
          variants={itemVariants}
          className="flex justify-end items-center px-4 md:px-16 py-8 absolute top-0 right-0"
        >
          <motion.div
            variants={backButtonVariants}
            whileHover="hover"
            whileTap="tap"
            className="bg-[#331400] px-4 py-2 hidden md:flex items-center gap-2 cursor-pointer  hover:bg-[#442000] transition-colors"
            onClick={() => router.push("/auth/links")}
          >
            <span className="text-[#FFE4A5] text-sm font-semibold">Skip</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-[#FFE4A5]"
            >
              <path d="M9 18l6-6-6-6" />
            </svg>
          </motion.div>
        </motion.div>

        {/* 🔹 Centered main content */}
        <section className="flex flex-col items-center justify-center w-full max-w-4xl mx-auto">
          <motion.div 
            variants={itemVariants}
            className="text-center mb-8"
          >
            <motion.h1 
              className="text-3xl md:text-4xl font-bold mb-2 text-[#331400]"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              Select Platforms you are on!
            </motion.h1>
            <motion.p 
              variants={itemVariants}
              className="text-[#331400] text-sm lg:text-[14px] font-semibold max-w-2xl"
            >
              Pick a maximum of 5 platforms to get started. You can update later
            </motion.p>
          </motion.div>

          <motion.div 
            variants={itemVariants}
            className="flex flex-wrap justify-center gap-4 mb-8 max-w-2xl"
          >
            {PLATFORMS.map((platform, index) => {
              const isSelected = selectedPlatforms.some((p) => p.id === platform.id);
              
              return (
                <motion.button
                  key={platform.id}
                  custom={index}
                  variants={platformVariants}
                  initial="unselected"
                  animate={isSelected ? "selected" : "unselected"}
                  whileHover="hover"
                  whileTap="tap"
                  className={`cursor-pointer flex flex-col w-20 md:w-24 items-center justify-center p-4 border-2  ${
                    isSelected ? "border-[#331400]" : "border-transparent"
                  }`}
                  onClick={() => handlePlatformClick(platform)}
                >
                  <Image
                    src={platform.icon}
                    alt={platform.name}
                    width={35}
                    height={35}
                    className="mb-2"
                  />
                  <span className="text-xs md:text-sm font-semibold text-center">
                    {platform.name}
                  </span>
                </motion.button>
              );
            })}
          </motion.div>

          <motion.div 
            variants={itemVariants}
            className="w-full max-w-xs space-y-4 mb-8"
          >
            <motion.div
              variants={buttonHoverVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <Button
                onClick={() => router.push("/auth/links")}
                className="w-full bg-[#FED45C] text-[#331400] py-6 text-base font-medium hover:bg-[#FED45C]/90"
              >
                Continue
              </Button>
            </motion.div>

          </motion.div>
        </section>
            {/* Back button below Continue button */}
            <motion.div
              variants={itemVariants}
              className="flex justify-start "
            >
              <motion.button
                variants={backButtonVariants}
                whileHover="hover"
                whileTap="tap"
                onClick={() => router.back()}
                className="flex items-center gap-2  md:hidden text-sm font-semibold  cursor-pointer hover:bg-[#4a2c1a] transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </motion.button>
            </motion.div>

        {/* Footer - Mobile only */}
        <motion.footer 
          variants={itemVariants}
          className="w-full flex items-center justify-between MD:px-4 md:hidden gap-2 py-4 text-sm text-[#331400] mt-8"
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
      </motion.main>
    </ProtectedRoute>
  );
};

export default Platforms;