import type {
  ButtonStyle,
  CornerConfig,
  FillGradientWallpaperConfig,
  FontConfig,
  WallpaperConfig,
} from "@/types/appearance.types";
import type { FontStyle } from "@/components/FontCustomizer";

/** Map UI button style to API CornerConfig for save */
export function buttonStyleToCornerConfig(style: ButtonStyle): CornerConfig {
  const type: CornerConfig["type"] =
    style.borderRadius === "0px"
      ? "sharp"
      : style.borderRadius === "9999px" || style.borderRadius === "50%"
        ? "round"
        : "curved";
  const shadowSize =
    style.boxShadow === "none" || !style.boxShadow
      ? "soft"
      : style.boxShadow.includes("4px 4px 0px")
        ? "hard"
        : "soft";
  return {
    type,
    opacity: style.opacity,
    fillColor: style.backgroundColor,
    shadowSize,
    shadowColor: style.shadowColor ?? "#000000",
    strokeColor: style.borderColor,
  };
}

/** Map API CornerConfig to UI ButtonStyle (for initial load from settings) */
export function cornerConfigToButtonStyle(c: CornerConfig): ButtonStyle {
  const borderRadius =
    c.type === "sharp" ? "0px" : c.type === "round" ? "9999px" : "12px";
  const boxShadow =
    c.shadowSize === "hard"
      ? `4px 4px 0px 0px ${c.shadowColor}`
      : `2px 2px 6px ${c.shadowColor}80`;
  return {
    borderRadius,
    backgroundColor: c.fillColor,
    borderColor: c.strokeColor,
    opacity: c.opacity,
    boxShadow: c.shadowSize === "soft" && !c.shadowColor ? "none" : boxShadow,
    shadowColor: c.shadowColor,
  };
}

/** Map API FontConfig to UI FontStyle (for initial load from settings) */
export function fontConfigToFontStyle(f: FontConfig): FontStyle {
  return {
    fontFamily: f.name || "Poppins",
    fillColor: f.fillColor ?? "#000000",
    strokeColor: (f as { strokeColor?: string }).strokeColor ?? "none",
    opacity: 100,
  };
}

/**
 * Backend expects a single font name (letters, numbers, hyphens only).
 * UI fontFamily can be a CSS stack like "'Merriweather', 'Merriweather Fallback'".
 * Extract the primary name and sanitize for the API.
 */
export function fontFamilyToApiName(fontFamily: string): string {
  const first = fontFamily.split(",")[0].trim().replace(/^['"]|['"]$/g, "");
  return first.replace(/[^a-zA-Z0-9-]/g, "") || "Poppins";
}

/** Backend expects valid color values; UI may use "none" for no stroke. Map to valid hex. */
export function toValidColor(value: string | undefined | null, fallback: string): string {
  const v = (value ?? "").trim().toLowerCase();
  if (!v || v === "none" || v === "transparent") return fallback;
  return value!.trim();
}

/** Map UI FontStyle to API FontConfig for save */
export function fontStyleToFontConfig(s: FontStyle): FontConfig {
  return {
    name: fontFamilyToApiName(s.fontFamily),
    fillColor: toValidColor(s.fillColor, "#000000"),
    strokeColor: toValidColor(s.strokeColor, "#00000000"),
  };
}

/** Default amount for wallpaper backgroundColor when not from backend (design didn't account for it). */
export const WALLPAPER_DEFAULT_AMOUNT = 100;

/** Build FillGradientWallpaperConfig from backend wallpaper_config (for restore/sync). */
export function wallpaperConfigFromBackend(
  w: WallpaperConfig | undefined | null
): FillGradientWallpaperConfig | null {
  if (!w || (w.type !== "fill" && w.type !== "gradient")) return null;
  const bg = (w as { backgroundColor?: Array<{ color: string; amount: number }> }).backgroundColor;
  if (!Array.isArray(bg) || bg.length === 0) return null;
  const withAmount = bg.map((item) => ({
    color: typeof item?.color === "string" ? item.color : "#000000",
    amount:
      typeof item?.amount === "number" && item.amount >= 0
        ? item.amount
        : WALLPAPER_DEFAULT_AMOUNT,
  }));
  return { type: w.type, backgroundColor: withAmount };
}

/** Build selectedTheme string from backend wallpaper_config for preview. */
export function selectedThemeFromWallpaper(
  w: WallpaperConfig | undefined | null
): string | null {
  if (!w) return null;
  const bg = (w as { backgroundColor?: Array<{ color: string }> }).backgroundColor;
  if (w.type === "fill" && Array.isArray(bg) && bg[0]) {
    return `fill:${bg[0].color}`;
  }
  if (w.type === "gradient" && Array.isArray(bg) && bg.length >= 2) {
    return `gradient:${bg[0].color}:${bg[1].color}`;
  }
  const img = (w as { image?: { url: string } }).image;
  if (w.type === "image" && img?.url) return img.url;
  return null;
}