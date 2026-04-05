import type { Variants } from "framer-motion";

// ─── Easing presets ─────────────────────────────────────────────────────────
/** Responsive: starts fast, decelerates (used for most transitions) */
const EASE_OUT = [0.25, 0.46, 0.45, 0.94];
/** Snappy spring for staggered list items */
const SPRING_LIST = { type: "spring", stiffness: 300, damping: 26, mass: 0.8 };
/** Tight spring for modals and overlays */
const SPRING_MODAL = { type: "spring", stiffness: 360, damping: 30, mass: 0.7 };

// ─── List / Container ────────────────────────────────────────────────────────

/** Staggered list container: fades in, then staggers children */
export const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.06,
    },
  },
};

/** List item: fade + slide up, spring-out, smooth exit */
export const itemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 14,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: SPRING_LIST,
  },
  exit: {
    opacity: 0,
    x: -20,
    scale: 0.97,
    transition: {
      duration: 0.18,
      ease: EASE_OUT,
    },
  },
  drag: {
    scale: 1.03,
    boxShadow: "0 12px 32px rgba(0,0,0,0.12)",
    transition: SPRING_MODAL,
  },
};

// ─── Modals / Overlays ───────────────────────────────────────────────────────

/** Modal overlay: fast fade */
export const modalOverlayVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.18, ease: EASE_OUT },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.14, ease: "easeIn" },
  },
};

/** Modal content: scale up + fade + slide */
export const modalContentVariants: Variants = {
  hidden: { scale: 0.96, opacity: 0, y: 12 },
  visible: {
    scale: 1,
    opacity: 1,
    y: 0,
    transition: { ...SPRING_MODAL, delay: 0.05 },
  },
  exit: {
    scale: 0.96,
    opacity: 0,
    y: 8,
    transition: { duration: 0.14, ease: "easeIn" },
  },
};

// ─── Sheets / Drawers ────────────────────────────────────────────────────────

/** Full-screen slide from right (mobile add-link sheet) */
export const slideInVariants: Variants = {
  hidden: { x: "100%", opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 280, damping: 26, mass: 0.8 },
  },
  exit: {
    x: "100%",
    opacity: 0,
    transition: { type: "spring", stiffness: 320, damping: 30, mass: 0.8 },
  },
};

// ─── Drag & Drop ─────────────────────────────────────────────────────────────

/** Sortable drag lift state */
export const sortableItemVariants: Variants = {
  drag: {
    scale: 1.03,
    boxShadow: "0 12px 32px rgba(0,0,0,0.12)",
    zIndex: 999,
  },
  visible: {
    scale: 1,
    boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
    zIndex: 1,
  },
};

// ─── Public profile ([username]) ─────────────────────────────────────────────

/** Page wrapper: clean fade */
export const pageVariants: Variants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { duration: 0.35, ease: EASE_OUT },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.22, ease: "easeIn" },
  },
};

/** Phone frame: scale + fade + subtle slide-up */
export const phoneContainerVariants: Variants = {
  initial: { scale: 0.96, opacity: 0, y: 14 },
  animate: {
    scale: 1,
    opacity: 1,
    y: 0,
    transition: { ...SPRING_LIST, delay: 0.15 },
  },
};

/** Profile card: slide down + fade */
export const profileCardVariants: Variants = {
  initial: { y: -20, opacity: 0 },
  animate: {
    y: 0,
    opacity: 1,
    transition: { ...SPRING_LIST, delay: 0.3 },
  },
};

/** Link item: staggered slide-in from below + hover lift */
export const linkItemVariants: Variants = {
  initial: { y: 12, opacity: 0 },
  animate: (i: number) => ({
    y: 0,
    opacity: 1,
    transition: {
      delay: 0.4 + i * 0.07,
      ...SPRING_LIST,
    },
  }),
  hover: {
    y: -2,
    scale: 1.015,
    transition: { type: "spring", stiffness: 400, damping: 20 },
  },
};

/** Blurred side panels: fade in */
export const blurSideVariants: Variants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { duration: 0.6, delay: 0.2 },
  },
};

// ─── Dropdown ────────────────────────────────────────────────────────────────

/** Dropdown / popover: scale from origin + fade */
export const dropdownVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95, y: 6 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.18, ease: EASE_OUT },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 4,
    transition: { duration: 0.13, ease: "easeIn" },
  },
};

// ─── Reveal (scroll) ─────────────────────────────────────────────────────────

/** Generic scroll-reveal item (use with whileInView) */
export const revealVariants: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.38, ease: EASE_OUT },
  },
};
