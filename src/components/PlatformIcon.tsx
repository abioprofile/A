"use client";

import React from "react";
import {
  FaInstagram,
  FaTiktok,
  FaPinterest,
  FaTwitter,
  FaLinkedinIn,
  FaBehance,
  FaLink,
  FaWhatsapp,
  FaXTwitter,
  FaFacebook,
  FaSnapchat,
  FaYoutube,
  FaGithub,
  FaSpotify,
  FaApple,
  FaGoogle,
  FaAmazon,
  FaFigma,
  FaDribbble,
  FaTelegram,
} from "react-icons/fa6";

const DEFAULT_ICON_CLASS = "w-5 h-5";

/**
 * Returns the platform icon for link buttons. Uses currentColor so the parent
 * can control icon color via fontStyle.fillColor (e.g. in PhoneDisplay and [username] page).
 * Same icon set everywhere for a uniform look.
 */
export function getPlatformIcon(
  platform: string,
  className: string = DEFAULT_ICON_CLASS
): React.ReactNode {
  const platformLower = platform.toLowerCase();

  if (platformLower.includes("instagram"))
    return <FaInstagram className={className} />;
  if (platformLower.includes("behance"))
    return <FaBehance className={className} />;
  if (platformLower.includes("snapchat"))
    return <FaSnapchat className={className} />;
  if (platformLower.includes("x") || platformLower.includes("twitter")) {
    if (platformLower.includes("x")) return <FaXTwitter className={className} />;
    return <FaTwitter className={className} />;
  }
  if (platformLower.includes("linkedin"))
    return <FaLinkedinIn className={className} />;
  if (platformLower.includes("facebook"))
    return <FaFacebook className={className} />;
  if (platformLower.includes("youtube"))
    return <FaYoutube className={className} />;
  if (platformLower.includes("tiktok"))
    return <FaTiktok className={className} />;
  if (platformLower.includes("github"))
    return <FaGithub className={className} />;
  if (platformLower.includes("whatsapp"))
    return <FaWhatsapp className={className} />;
  if (platformLower.includes("pinterest"))
    return <FaPinterest className={className} />;
  if (platformLower.includes("spotify"))
    return <FaSpotify className={className} />;
  if (platformLower.includes("apple"))
    return <FaApple className={className} />;
  if (platformLower.includes("google"))
    return <FaGoogle className={className} />;
  if (platformLower.includes("amazon"))
    return <FaAmazon className={className} />;
  if (platformLower.includes("figma"))
    return <FaFigma className={className} />;
  if (platformLower.includes("dribbble"))
    return <FaDribbble className={className} />;
  if (platformLower.includes("telegram"))
    return <FaTelegram className={className} />;

  return <FaLink className={className} />;
}
