import type { Variants } from "framer-motion";

/** Staggered list container: hidden → visible with staggerChildren */
export const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

/** List item: hidden → visible with spring, exit slide-left, drag lift */
export const itemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
    },
  },
  exit: {
    opacity: 0,
    x: -50,
    scale: 0.9,
    transition: {
      duration: 0.2,
      ease: "easeIn",
    },
  },
  drag: {
    scale: 1.05,
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.15)",
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 20,
    },
  },
};

/** Modal overlay: fade in/out */
export const modalOverlayVariants: Variants = {
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

/** Modal content: scale + fade + slide up */
export const modalContentVariants: Variants = {
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

/** Full-screen slide from right (e.g. mobile add link sheet) */
export const slideInVariants: Variants = {
  hidden: { x: "100%" },
  visible: {
    x: 0,
    transition: {
      type: "spring",
      stiffness: 80,
      damping: 20,
      mass: 0.8,
    },
  },
  exit: {
    x: "100%",
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 20,
      mass: 0.8,
    },
  },
};

/** Sortable item drag state (use with animate={isDragging ? "drag" : "visible"}) */
export const sortableItemVariants: Variants = {
  drag: {
    scale: 1.05,
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.15)",
    zIndex: 999,
  },
  visible: {
    scale: 1,
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
    zIndex: 1,
  },
};

// --- Profile / [username] page variants ---

/** Page wrapper: fade in/out */
export const pageVariants: Variants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.3,
      ease: "easeIn",
    },
  },
};

/** Phone frame container: scale + fade + slide up */
export const phoneContainerVariants: Variants = {
  initial: {
    scale: 0.9,
    opacity: 0,
    y: 20,
  },
  animate: {
    scale: 1,
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
      delay: 0.2,
    },
  },
};

/** Profile card: slide down + fade */
export const profileCardVariants: Variants = {
  initial: { y: -30, opacity: 0 },
  animate: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
      delay: 0.4,
    },
  },
};

/** Link item: slide in from left with stagger, hover lift */
export const linkItemVariants: Variants = {
  initial: { x: -20, opacity: 0 },
  animate: (i: number) => ({
    x: 0,
    opacity: 1,
    transition: {
      delay: 0.5 + i * 0.1,
      type: "spring",
      stiffness: 100,
      damping: 15,
    },
  }),
  hover: {
    y: -2,
    scale: 1.02,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 15,
    },
  },
};

/** Blurred side panels: fade in */
export const blurSideVariants: Variants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      duration: 0.8,
      delay: 0.3,
    },
  },
};
