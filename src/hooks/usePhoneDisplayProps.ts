"use client";

import { useMemo } from "react";
import { useAppSelector } from "@/stores/hooks";
import { useGetSettings, useGetAllLinks } from "@/hooks/api/useAuth";
import {
  cornerConfigToButtonStyle,
  fontConfigToFontStyle,
  selectedThemeFromWallpaper,
} from "@/lib/helpers/appearance";
import type { ButtonStyle } from "@/types/appearance.types";
import type { FontStyle } from "@/components/FontCustomizer";
import type { ProfileLink } from "@/types/auth.types";

const DEFAULT_BUTTON_STYLE: ButtonStyle = {
  borderRadius: "0px",
  backgroundColor: "#ffffff",
  borderColor: "#000000",
  opacity: 1,
  boxShadow: "2px 2px 6px rgba(0,0,0,0.2)",
};

const DEFAULT_FONT_STYLE: FontStyle = {
  fontFamily: "Poppins",
  fillColor: "#000000",
  strokeColor: "none",
  opacity: 100,
};

const DEFAULT_THEME = "/themes/theme1.png";

export interface PhoneDisplayProfile {
  profileImage: string;
  displayName: string;
  userName?: string;
  bio: string;
  location: string;
}

export interface UsePhoneDisplayPropsResult {
  buttonStyle: ButtonStyle;
  fontStyle: FontStyle;
  selectedTheme: string;
  profile: PhoneDisplayProfile;
  links: ProfileLink[];
  isLoading: boolean;
  /** Refetch settings and links (e.g. after saving elsewhere) */
  refetch: () => void;
}

/**
 * Single source of truth for PhoneDisplay props.
 * Fetches settings + links in one place; both dashboard and appearance use this
 * so the phone preview stays synced with saved appearance.
 */
export function usePhoneDisplayProps(): UsePhoneDisplayPropsResult {
  const userData = useAppSelector((state) => state.auth.user);
  const { data: settingsData, isLoading: settingsLoading, refetch: refetchSettings } = useGetSettings();
  const { data: linksData, isLoading: linksLoading, refetch: refetchLinks } = useGetAllLinks();

  const refetch = () => {
    refetchSettings();
    refetchLinks();
  };

  const computed = useMemo(() => {
    const payload = settingsData?.data;
    const buttonStyle: ButtonStyle = payload?.corner_config
      ? cornerConfigToButtonStyle(payload.corner_config)
      : DEFAULT_BUTTON_STYLE;
    const fontStyle: FontStyle = payload?.font_config
      ? fontConfigToFontStyle(payload.font_config)
      : DEFAULT_FONT_STYLE;
    const themeFromWallpaper = payload?.wallpaper_config
      ? selectedThemeFromWallpaper(payload.wallpaper_config)
      : null;
    const selectedTheme =
      themeFromWallpaper ??
      (payload?.selected_theme ?? undefined) ??
      DEFAULT_THEME;

    const profile: PhoneDisplayProfile = {
      profileImage: userData?.profile?.avatarUrl ?? "/icons/Profile Picture.png",
      displayName: userData?.name ?? "User",
      userName: userData?.username ?? "username",
      bio: userData?.profile?.bio ?? "",
      location: userData?.profile?.location ?? "",
    };

    const rawLinks = linksData?.data;
    const links: ProfileLink[] = Array.isArray(rawLinks)
      ? (rawLinks as ProfileLink[])
      : [];

    return {
      buttonStyle,
      fontStyle,
      selectedTheme,
      profile,
      links,
    };
  }, [settingsData?.data, linksData?.data, userData]);

  return {
    ...computed,
    isLoading: settingsLoading || linksLoading,
    refetch,
  };
}
