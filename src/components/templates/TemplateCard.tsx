"use client"

import { cn } from "@/lib/utils"
import { TemplateCardProps } from "@/interfaces/template.interface"
import { motion, type Variants } from "framer-motion"
import { themePreviewStyle } from "@/lib/helpers/appearance"

// ─── Lightning bolt SVG badge ──────
const LightningBadge = () => (
  <span
    className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center shadow-md z-10"
    style={{ backgroundColor: "rgba(255,255,255,0.25)", backdropFilter: "blur(4px)" }}
    aria-hidden
  >
    <svg width="11" height="14" viewBox="0 0 11 14" fill="none">
      <path
        d="M6.5 1L1 7.8H5.5L4.5 13L10 6.2H5.5L6.5 1Z"
        fill="white"
        stroke="white"
        strokeWidth="0.5"
        strokeLinejoin="round"
      />
    </svg>
  </span>
)

export function TemplateCard({ template, onClick, isSelected }: TemplateCardProps) {
    const { style, links, isPremium, corner_config, font_config, wallpaper_config } = template
    
    // Animation variants
    const cardVariants: Variants = {
        initial: {
            scale: 1,
            boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
        },
        hover: {
            scale: 1.02,
            boxShadow: "0 8px 24px rgba(0,0,0,0.18)",
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 20
            }
        },
        tap: {
            scale: 0.98,
            transition: {
                type: "spring",
                stiffness: 400,
                damping: 25
            }
        }
    }

    // Get wallpaper style from theme
    const getWallpaperStyle = () => {
        if (wallpaper_config) {
            const preview = themePreviewStyle(wallpaper_config)
            return {
                backgroundImage: preview.backgroundImage,
                backgroundColor: preview.backgroundColor,
                backgroundSize: "cover",
                backgroundPosition: "center",
            }
        }
        return {
            backgroundColor: style?.backgroundColor || "#c4b5d0",
        }
    }

    // Get button bar style from theme
    const getButtonBarStyle = () => {
        const cc = corner_config
        
        if (!cc) {
            return {
                borderRadius: 8,
                backgroundColor: "rgba(255,255,255,0.9)",
                border: "1.5px solid rgba(255,255,255,0.5)",
            }
        }

        const borderRadius = 
            cc.type === "sharp" ? 4 : 
            cc.type === "round" ? 9999 : 10

        const boxShadow = 
            cc.shadowSize === "hard" && cc.shadowColor
                ? `2px 2px 0px 0px ${cc.shadowColor}`
                : cc.shadowColor
                    ? `0 2px 6px ${cc.shadowColor}60`
                    : "none"

        return {
            borderRadius,
            boxShadow,
            border: `1.5px solid ${cc.strokeColor ?? "rgba(255,255,255,0.5)"}`,
            backgroundColor: cc.fillColor ?? "rgba(255,255,255,0.9)",
            opacity: cc.opacity ?? 1,
        }
    }

    // Get font family
    const getFontFamily = () => {
        return font_config?.name 
            ? `'${font_config.name}', sans-serif` 
            : style?.fontFamily || "inherit"
    }

    // Get text color
    const getTextColor = () => {
        return font_config?.fillColor || style?.textColor || "#333333"
    }

    return (
        <motion.button
            className={cn(
                "flex flex-col items-center gap-1.5 focus:outline-none group w-full",
                "transition-all duration-200"
            )}
            onClick={onClick}
            variants={cardVariants}
            initial="initial"
            whileHover="hover"
            whileTap="tap"
            aria-label={`Select theme: ${template.name}`}
            aria-pressed={isSelected}
        >
            {/* Card */}
            <motion.div
                className="relative w-full overflow-hidden transition-all duration-200"
                style={{
                    aspectRatio: "4/4",
                    ...getWallpaperStyle(),
                    // Selection ring
                    outline: isSelected
                        ? "3px solid #000000"
                        : "3px solid transparent",
                    outlineOffset: "2px",
                    boxShadow: isSelected
                        ? "0 0 0 1px #00000020"
                        : "0 2px 8px rgba(0,0,0,0.12)",
                }}
            >
                {/* Lightning badge - only for premium themes */}
                {isPremium && <LightningBadge />}

                {/* Aa font preview */}
                <div className="absolute top-3 left-3 z-10">
                    <span
                        className="text-xl font-bold leading-none drop-shadow-sm"
                        style={{
                            fontFamily: getFontFamily(),
                            color: "#ffffff",
                            textShadow: "0 1px 3px rgba(0,0,0,0.3)",
                        }}
                    >
                        Aa
                    </span>
                </div>

                {/* Button bar preview — pinned to bottom */}
                <div className="absolute bottom-3 shadow-xl left-3 right-3 z-10">
                    <div
                        className="w-full h-8 flex items-center justify-center px-3"
                        style={getButtonBarStyle()}
                    >
                        {/* Preview of links - show first link or placeholder */}
                        <span 
                            className="text-xs font-medium truncate opacity-70"
                            style={{ 
                                fontFamily: getFontFamily(),
                                color: getTextColor()
                            }}
                        >
                            {links?.[0]?.text || "linktr.ee"}
                        </span>
                    </div>
                </div>
            </motion.div>

            {/* Theme name */}
            <p
                className="text-sm font-bold text-center truncate w-full px-1"
                style={{ color: "#6b7280" }}
            >
                {template.name || "Untitled Theme"}
            </p>
        </motion.button>
    )
}