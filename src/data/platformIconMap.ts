/**
 * Maps normalized platform IDs → exact SVG filenames in /public/assets/platform-icons/
 * The filenames are exactly as they appear on disk (spaces, commas, etc.)
 */
export const PLATFORM_ICON_FILES: Record<string, { black: string; colored: string }> = {
  instagram:      { black: "Social=Instagram,Style=Black.svg",        colored: "Social=Instagram,Style=Original.svg" },
  tiktok:         { black: "Social=TikTok,Style=Black.svg",           colored: "Social=TikTok,Style=Original.svg" },
  youtube:        { black: "Social=YouTube,Style=Black.svg",          colored: "Social=YouTube,Style=Original.svg" },
  facebook:       { black: "Social=Facebook,Style=Black.svg",         colored: "Social=Facebook,Style=Original.svg" },
  snapchat:       { black: "Social=Snapchat,Style=Black.svg",         colored: "Social=Snapchat,Style=Original.svg" },
  pinterest:      { black: "Social=Pinterest,Style=Black.svg",        colored: "Social=Pinterest,Style=Original.svg" },
  whatsapp:       { black: "Social=WhatsApp,Style=Black.svg",         colored: "Social=WhatsApp,Style=Original.svg" },
  telegram:       { black: "Social=Telegram,Style=Black.svg",         colored: "Social=Telegram,Style=Original.svg" },
  github:         { black: "Social=Github,Style=Black.svg",           colored: "Social=Github,Style=Original.svg" },
  behance:        { black: "Social=Behance,Style=Black.svg",          colored: "Social=Behance,Style=Original.svg" },
  dribbble:       { black: "Social=Dribbble,Style=Black.svg",         colored: "Social=Dribbble,Style=Original.svg" },
  figma:          { black: "Social=Figma,Style=Black.svg",            colored: "Social=Figma,Style=Original.svg" },
  google:         { black: "Social=Google,Style=Black.svg",           colored: "Social=Google,Style=Original.svg" },
  x:              { black: "Social=X ex Twitter,Style=Black.svg",     colored: "Social=X ex Twitter,Style=Original.svg" },
  twitter:        { black: "Social=X ex Twitter,Style=Black.svg",     colored: "Social=X ex Twitter,Style=Original.svg" },
  spotify:        { black: "Social=Spotify,Style=Black.svg",          colored: "Social=Spotify,Style=Original.svg" },
  "apple-music":  { black: "Social=Apple Music,Style=Black.svg",      colored: "Social=Apple Music,Style=Original.svg" },
  soundcloud:     { black: "Social=SoundCloud,Style=Black.svg",       colored: "Social=SoundCloud,Style=Original.svg" },
  discord:        { black: "Social=Discord,Style=Black.svg",          colored: "Social=Discord,Style=Original.svg" },
  reddit:         { black: "Social=Reddit,Style=Black.svg",           colored: "Social=Reddit,Style=Original.svg" },
  threads:        { black: "Social=Threads,Style=Black.svg",          colored: "Social=Threads,Style=Original.svg" },
  twitch:         { black: "Social=Twitch,Style=Black.svg",           colored: "Social=Twitch,Style=Original.svg" },
  medium:         { black: "Social=Medium,Style=Black.svg",           colored: "Social=Medium,Style=Original.svg" },
  notion:         { black: "Social=Notion,Style=Black.svg",           colored: "Social=Notion,Style=Original.svg" },
  signal:         { black: "Social=Signal,Style=Black.svg",           colored: "Social=Signal,Style=Original.svg" },
  skype:          { black: "Social=Skype,Style=Black.svg",            colored: "Social=Skype,Style=Original.svg" },
  // Note: Slack filename has a space before "Style"
  slack:          { black: "Social=Slack, Style=Black.svg",           colored: "Social=Slack, Style=Original.svg" },
  vimeo:          { black: "Social=Vimeo,Style=Black.svg",            colored: "Social=Vimeo,Style=Original.svg" },
  wechat:         { black: "Social=WeChat,Style=Black.svg",           colored: "Social=WeChat,Style=Original.svg" },
  zoom:           { black: "Social=Zoom,Style=Black.svg",             colored: "Social=Zoom,Style=Original.svg" },
  gmail:          { black: "Social=Gmail,Style=Black.svg",            colored: "Social=Gmail,Style=Original.svg" },
  kickstarter:    { black: "Social=Kickstarter,Style=Black.svg",      colored: "Social=Kickstarter,Style=Original.svg" },
  patreon:        { black: "Social=Patreon,Style=Black.svg",          colored: "Social=Patreon,Style=Original.svg" },
  tinder:         { black: "Social=Tinder,Style=Black.svg",           colored: "Social=Tinder,Style=Original.svg" },
  tumblr:         { black: "Social=Tumblr,Style=Black.svg",           colored: "Social=Tumblr,Style=Original.svg" },
  messenger:      { black: "Social=Messenger,Style=Black.svg",        colored: "Social=Messenger,Style=Original.svg" },
  quora:          { black: "Social=Quora,Style=Black.svg",            colored: "Social=Quora,Style=Original.svg" },
  onlyfans:       { black: "Social=OnlyFans,Style=Black.svg",         colored: "Social=OnlyFans,Style=Original.svg" },
  apple:          { black: "Social=Apple,Style=Black.svg",            colored: "Social=Apple,Style=Original.svg" },
  viber:          { black: "Social=Viber,Style=Black.svg",            colored: "Social=Viber,Style=Original.svg" },
  vk:             { black: "Social=VK,Style=Black.svg",               colored: "Social=VK,Style=Original.svg" },
  xing:           { black: "Social=Xing,Style=Black.svg",             colored: "Social=Xing,Style=Original.svg" },
  yelp:           { black: "Social=Yelp,Style=Black.svg",             colored: "Social=Yelp,Style=Original.svg" },
  "youtube-music":{ black: "Social=Youtube Music,Style=Black.svg",    colored: "Social=Youtube Music,Style=Original.svg" },
  "vk-music":     { black: "Social=VK Music,Style=Black.svg",         colored: "Social=VK Music,Style=Original.svg" },
  "google-play":  { black: "Social=Google Play,Style=Black.svg",      colored: "Social=Google Play,Style=Original.svg" },
  "stack-overflow":{ black: "Social=Stack Overflow,Style=Black.svg",  colored: "Social=Stack Overflow,Style=Original.svg" },
};

/** Normalize a raw platform string to the lookup key used in PLATFORM_ICON_FILES */
export function normalizePlatformId(platform: string): string {
  return platform.toLowerCase().replace(/\s+/g, "-");
}

/** Get the public URL for a platform icon. Returns null if no icon available. */
export function getPlatformIconUrl(platform: string, variant: "black" | "colored"): string | null {
  const key = normalizePlatformId(platform);
  const entry = PLATFORM_ICON_FILES[key];
  if (!entry) return null;
  const filename = variant === "black" ? entry.black : entry.colored;
  return `/assets/platform-icons/${variant}/${encodeURIComponent(filename)}`;
}

/** Display name for a platform (used in the icon picker) */
export const PLATFORM_DISPLAY_NAMES: Record<string, string> = {
  instagram:       "Instagram",
  tiktok:          "TikTok",
  youtube:         "YouTube",
  facebook:        "Facebook",
  snapchat:        "Snapchat",
  pinterest:       "Pinterest",
  whatsapp:        "WhatsApp",
  telegram:        "Telegram",
  github:          "GitHub",
  behance:         "Behance",
  dribbble:        "Dribbble",
  figma:           "Figma",
  google:          "Google",
  x:               "X (Twitter)",
  twitter:         "X (Twitter)",
  spotify:         "Spotify",
  "apple-music":   "Apple Music",
  soundcloud:      "SoundCloud",
  discord:         "Discord",
  reddit:          "Reddit",
  threads:         "Threads",
  twitch:          "Twitch",
  medium:          "Medium",
  notion:          "Notion",
  signal:          "Signal",
  skype:           "Skype",
  slack:           "Slack",
  vimeo:           "Vimeo",
  wechat:          "WeChat",
  zoom:            "Zoom",
  gmail:           "Gmail",
  kickstarter:     "Kickstarter",
  patreon:         "Patreon",
  tinder:          "Tinder",
  tumblr:          "Tumblr",
  messenger:       "Messenger",
  quora:           "Quora",
  onlyfans:        "OnlyFans",
  apple:           "Apple",
  viber:           "Viber",
  vk:              "VK",
  xing:            "Xing",
  yelp:            "Yelp",
};
