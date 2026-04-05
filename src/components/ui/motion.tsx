"use client";

/**
 * Premium motion primitives — Stripe/Linear-grade micro-interactions.
 *
 * All animations use only `opacity` and `transform` so the browser never
 * triggers layout or paint. Duration range: 150–280 ms.
 */

import {
  motion,
  type Variants,
  type HTMLMotionProps,
  type MotionProps,
} from "framer-motion";
import { type ReactNode, forwardRef } from "react";

// ─── Easing constants ──────────────────────────────────────────────────────
/** Fast ease-out (responsive feel — starts instantly, decelerates) */
export const EASE_OUT = [0.25, 0.46, 0.45, 0.94] as const;
/** Expo ease-out (ultra-snappy for micro-interactions) */
export const EASE_EXPO = [0.16, 1, 0.3, 1] as const;
/** Snappy spring — cards, modals */
export const SPRING = {
  type: "spring",
  stiffness: 320,
  damping: 28,
  mass: 0.75,
} as const;
/** Tight spring — icon buttons, toggles */
export const SPRING_TIGHT = {
  type: "spring",
  stiffness: 500,
  damping: 35,
  mass: 0.5,
} as const;

// ─── Reveal ───────────────────────────────────────────────────────────────
/**
 * Fades + slides up when the element enters the viewport.
 * Fires once — no re-animation on scroll-back.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 14,
  duration = 0.4,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  duration?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-48px" }}
      transition={{ duration, ease: EASE_OUT, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── FadeIn ───────────────────────────────────────────────────────────────
/** Fades in on mount — no movement, just opacity. */
export function FadeIn({
  children,
  className,
  delay = 0,
  duration = 0.25,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration, ease: EASE_OUT, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── SlideUp ──────────────────────────────────────────────────────────────
/** Slides up + fades in on mount. Use for page sections and panels. */
export function SlideUp({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...SPRING, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── Pressable ────────────────────────────────────────────────────────────
/**
 * Adds hover-scale (1.02) + press-scale (0.97) to any wrapper.
 * Only uses `transform` — zero layout impact.
 */
export const Pressable = forwardRef<
  HTMLDivElement,
  HTMLMotionProps<"div"> & { hoverScale?: number; tapScale?: number }
>(({ children, hoverScale = 1.02, tapScale = 0.97, ...props }, ref) => (
  <motion.div
    ref={ref}
    whileHover={{
      scale: hoverScale,
      transition: { duration: 0.18, ease: EASE_OUT },
    }}
    whileTap={{
      scale: tapScale,
      transition: { duration: 0.1, ease: EASE_EXPO },
    }}
    {...props}
  >
    {children}
  </motion.div>
));
Pressable.displayName = "Pressable";

// ─── AnimatedCard ─────────────────────────────────────────────────────────
/**
 * Card wrapper with hover-lift + shadow elevation.
 * Perfect for link cards, product cards, panels.
 */
export const AnimatedCard = forwardRef<
  HTMLDivElement,
  HTMLMotionProps<"div">
>(({ children, ...props }, ref) => (
  <motion.div
    ref={ref}
    whileHover={{
      y: -2,
      boxShadow: "0 8px 24px rgba(0,0,0,0.09), 0 2px 8px rgba(0,0,0,0.06)",
      transition: { duration: 0.22, ease: EASE_OUT },
    }}
    whileTap={{
      y: 0,
      scale: 0.995,
      transition: { duration: 0.1, ease: EASE_EXPO },
    }}
    transition={{ duration: 0.22, ease: EASE_OUT }}
    {...props}
  >
    {children}
  </motion.div>
));
AnimatedCard.displayName = "AnimatedCard";

// ─── IconButton ───────────────────────────────────────────────────────────
/**
 * Tiny button wrapper for icon buttons — scale + opacity tap.
 * Wraps a `<motion.button>`.
 */
export const IconButton = forwardRef<
  HTMLButtonElement,
  HTMLMotionProps<"button">
>(({ children, ...props }, ref) => (
  <motion.button
    ref={ref}
    whileHover={{ scale: 1.12, transition: { duration: 0.15, ease: EASE_OUT } }}
    whileTap={{ scale: 0.88, transition: { duration: 0.1, ease: EASE_EXPO } }}
    {...props}
  >
    {children}
  </motion.button>
));
IconButton.displayName = "IconButton";

// ─── StaggerChildren + StaggerItem ────────────────────────────────────────
const staggerContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.04 },
  },
};

const staggerItemVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.24, ease: EASE_OUT },
  },
};

export function StaggerChildren({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      variants={staggerContainerVariants}
      initial="hidden"
      animate="visible"
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div variants={staggerItemVariants} className={className}>
      {children}
    </motion.div>
  );
}

// ─── ScaleIn ─────────────────────────────────────────────────────────────
/** Scale in from 0.95 + fade. Use for modals, dropdowns, popovers. */
export function ScaleIn({
  children,
  className,
  delay = 0,
  origin = "center",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  origin?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ ...SPRING, delay }}
      style={{ transformOrigin: origin }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
