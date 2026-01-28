// components/EditModal.tsx
"use client";

import { FC } from "react";
import Modal from "@/components/ui/modal";
import { toast } from "sonner";
// Import Framer Motion
import { motion, AnimatePresence } from "framer-motion";

type EditModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (platform: string, url: string) => void;
  initialPlatform: string;
  initialUrl: string;
};

const EditModal: FC<EditModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialPlatform,
  initialUrl,
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const platform = (form.elements.namedItem("platform") as HTMLInputElement)
      .value;
    const url = (form.elements.namedItem("url") as HTMLInputElement).value;

    onSave(platform, url);

  };

  // Animation variants
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.2,
        ease: "easeOut",
      },
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.15,
        ease: "easeIn",
      },
    },
  };

  const modalVariants = {
    hidden: {
      scale: 0.9,
      opacity: 0,
      y: 20,
    },
    visible: {
      scale: 1,
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 25,
        delay: 0.1,
        duration: 0.3,
      },
    },
    exit: {
      scale: 0.9,
      opacity: 0,
      y: 20,
      transition: {
        duration: 0.15,
        ease: "easeIn",
      },
    },
  };

  const formItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: 0.2 + i * 0.1,
        duration: 0.3,
        ease: "easeOut",
      },
    }),
  };

  const buttonVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.4,
        duration: 0.3,
        ease: "easeOut",
      },
    },
    hover: {
      scale: 1.02,
      boxShadow: "0 4px 12px rgba(254, 212, 92, 0.3)",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 15,
      },
    },
    tap: {
      scale: 0.98,
    },
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <AnimatePresence mode="wait">
        {isOpen && (
          <motion.div
            // variants={overlayVariants}
            initial="hidden"
            animate="visible"
            // exit="exit"
            className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="w-full md:w-[400px] bg-white p-6 shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.h2
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="text-base md:text-lg font-bold text-center mb-6 text-[#331400]"
              >
                Edit Link
              </motion.h2>

              <form onSubmit={handleSubmit}>
                <motion.div
                  custom={0}
                  variants={formItemVariants}
                  initial="hidden"
                  animate="visible"
                  className="mb-4 md:mb-5"
                >
                  <motion.label
                    htmlFor="platform"
                    whileHover={{ scale: 1.02 }}
                    className="block text-xs md:text-sm font-bold text-[#331400] mb-2 cursor-pointer"
                  >
                    Title
                  </motion.label>
                  <motion.input
                    id="platform"
                    name="platform"
                    type="text"
                    defaultValue={initialPlatform}
                    className="w-full border border-2 border-[#331400]/20 rounded-md px-3 py-2.5 text-sm md:text-base transition-all duration-200 focus:border-[#331400] focus:outline-none focus:ring-1 focus:ring-[#331400]/20"
                    required
                    whileFocus={{
                      scale: 1.01,
                      boxShadow: "0 0 0 2px rgba(51, 20, 0, 0.1)",
                    }}
                  />
                </motion.div>

                <motion.div
                  custom={1}
                  variants={formItemVariants}
                  initial="hidden"
                  animate="visible"
                  className="mb-6 md:mb-7"
                >
                  <motion.label
                    htmlFor="url"
                    whileHover={{ scale: 1.02 }}
                    className="block text-xs md:text-sm font-bold text-[#331400] mb-2 cursor-pointer"
                  >
                    URL
                  </motion.label>
                  <motion.input
                    id="url"
                    name="url"
                    type="url"
                    defaultValue={initialUrl}
                    className="w-full border border-2 border-[#331400]/20 rounded-md px-3 py-2.5 text-sm md:text-base transition-all duration-200 focus:border-[#331400] focus:outline-none focus:ring-1 focus:ring-[#331400]/20"
                    required
                    whileFocus={{
                      scale: 1.01,
                      boxShadow: "0 0 0 2px rgba(51, 20, 0, 0.1)",
                    }}
                  />
                </motion.div>

                <motion.div
                  variants={buttonVariants}
                  initial="hidden"
                  animate="visible"
                  className="flex justify-center gap-3"
                >
                  <motion.button
                    type="submit"
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                    className="bg-[#FED45C] w-full text-[#331400] px-4 py-3 text-sm md:text-[14px] font-bold rounded-md transition-all duration-200 relative overflow-hidden group"
                  >
                    {/* Button shine effect */}
                    <motion.span
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                      initial={{ x: "-100%" }}
                      whileHover={{ x: "100%" }}
                      transition={{ duration: 0.6 }}
                    />
                    <span className="relative z-10">Save Changes</span>
                  </motion.button>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="mt-4 text-center"
                >
                  <motion.button
                    type="button"
                    onClick={onClose}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="text-xs md:text-sm text-gray-500 hover:text-[#331400] transition-colors duration-200"
                  >
                    Cancel
                  </motion.button>
                </motion.div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Modal>
  );
};

export default EditModal;
