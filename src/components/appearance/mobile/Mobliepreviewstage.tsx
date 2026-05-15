"use client";

import React, { memo } from "react";
import { motion } from "framer-motion";
import MobileFloatingPreview from "./MobileFloatingPreview";
import { ButtonStyle } from "@/types/appearance.types";
import { FontStyle } from "@/components/FontCustomizer";
import { ProfileLink } from "@/types/auth.types";

interface MobilePreviewStageProps {
  isEditing: boolean;
  buttonStyle: ButtonStyle;
  fontStyle: FontStyle;
  selectedTheme: string;
  profile: {
    profileImage: string;
    displayName: string;
    bio: string;
    location: string;
    profileIcon?: string | null;
  };
  links: ProfileLink[];
  phoneDisplayLoading: boolean;
}

/**
 * MobilePreviewStage
 *
 * IDLE    → phone centered on screen at natural size, no transform
 * EDITING → phone shifts upward to sit above the bottom sheet,
 *           slight scale-down, rounded corners, shadow
 *
 * PhoneDisplay is NEVER unmounted.
 */
const MobilePreviewStage: React.FC<MobilePreviewStageProps> = memo(({
  isEditing,
  ...previewProps
}) => {
  return (
    /* Fixed stage fills screen. Content centered. */
    <div className="fixed inset-0 z-0 flex items-center justify-center">
      <motion.div
        animate={
          isEditing
            ? {
                y: "-22%",
                scale: 0.78,
                borderRadius: "24px",
                boxShadow: "0 20px 60px rgba(0,0,0,0.22), 0 6px 18px rgba(0,0,0,0.12)",
              }
            : {
                y: "0%",
                scale: 1,
                borderRadius: "0px",
                boxShadow: "none",
              }
        }
        transition={{
          type: "spring",
          stiffness: 320,
          damping: 36,
          mass: 1.0,
        }}
        style={{
          transformOrigin: "top center",
          overflow: "hidden",
          willChange: "transform",
        }}
      >
        <MobileFloatingPreview {...previewProps} />
      </motion.div>
    </div>
  );
});

MobilePreviewStage.displayName = "MobilePreviewStage";

export default MobilePreviewStage;