"use client";

import React, { memo } from "react";
import PhoneDisplay from "@/components/PhoneDisplay";
import { ButtonStyle } from "@/types/appearance.types";
import { FontStyle } from "@/components/FontCustomizer";
import { ProfileLink } from "@/types/auth.types";

interface MobileFloatingPreviewProps {
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
 * Memoized PhoneDisplay wrapper.
 * Constrains height so the phone fits within the screen with room
 * for the fixed header above and bottom nav below.
 * Never unmounts — preserves scroll position, active tab, and internal state.
 */
const MobileFloatingPreview: React.FC<MobileFloatingPreviewProps> = memo(
  (props) => {
    return (
      /*
       * Override PhoneDisplay's internal h-[67vh] by capping the wrapper.
       * The phone renders at max-w-[285px] naturally; we just let it sit.
       */
      <div
        style={{
          maxHeight: "calc(100vh - 140px)", // header ~56px + bottom nav ~84px
          overflow: "hidden",
        }}
      >
        <PhoneDisplay
          buttonStyle={props.buttonStyle}
          fontStyle={props.fontStyle}
          selectedTheme={props.selectedTheme}
          profile={props.profile}
          links={props.links}
          phoneDisplayLoading={props.phoneDisplayLoading}
        />
      </div>
    );
  },
  (prev, next) =>
    prev.selectedTheme === next.selectedTheme &&
    prev.phoneDisplayLoading === next.phoneDisplayLoading &&
    prev.buttonStyle === next.buttonStyle &&
    prev.fontStyle === next.fontStyle &&
    prev.profile === next.profile &&
    prev.links === next.links
);

MobileFloatingPreview.displayName = "MobileFloatingPreview";

export default MobileFloatingPreview;