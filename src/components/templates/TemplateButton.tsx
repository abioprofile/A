import { ButtonStyle } from "@/interfaces/template.interface"
import { cn } from "@/lib/utils"
import { JSX } from "react";
import {
    FaInstagram,
    FaFacebook,
    FaLinkedin,
    FaYoutube,
    FaTiktok,
    FaGithub,
    FaGitlab,
    FaDribbble,
    FaBehance,
    FaFigma,
    FaMedium,
    FaPinterest,
    FaReddit,
    FaDiscord,
    FaSlack,
    FaStackOverflow,
    FaGlobe,
    FaLink,
} from "react-icons/fa";
import { FaXTwitter, FaSnapchat } from "react-icons/fa6";

interface LinkButtonProps {
    text: string
    style: ButtonStyle
    iconName?: string;
    url?: string;
}

export const iconMap: Record<string, JSX.Element> = {
    instagram: <FaInstagram size={21} className="size-3 md:size-4 lg:size-5" />,
    facebook: <FaFacebook size={21} className="size-3 md:size-4 lg:size-5" />,
    twitter: <FaXTwitter size={21} className="size-3 md:size-4 lg:size-5" />,
    linkedin: <FaLinkedin size={21} className="size-3 md:size-4 lg:size-5" />,
    youtube: <FaYoutube size={21} className="size-3 md:size-4 lg:size-5" />,
    tiktok: <FaTiktok size={21} className="size-3 md:size-4 lg:size-5" />,
    snapchat: <FaSnapchat size={21} className="size-3 md:size-4 lg:size-5" />,
    github: <FaGithub size={21} className="size-3 md:size-4 lg:size-5" />,
    gitlab: <FaGitlab size={21} className="size-3 md:size-4 lg:size-5" />,
    dribbble: <FaDribbble size={21} className="size-3 md:size-4 lg:size-5" />,
    behance: <FaBehance size={21} className="size-3 md:size-4 lg:size-5" />,
    figma: <FaFigma size={21} className="size-3 md:size-4 lg:size-5" />,
    medium: <FaMedium size={21} className="size-3 md:size-4 lg:size-5" />,
    pinterest: <FaPinterest size={21} className="size-3 md:size-4 lg:size-5" />,
    reddit: <FaReddit size={21} className="size-3 md:size-4 lg:size-5" />,
    discord: <FaDiscord size={21} className="size-3 md:size-4 lg:size-5" />,
    slack: <FaSlack size={21} className="size-3 md:size-4 lg:size-5" />,
    stackoverflow: <FaStackOverflow size={21} className="size-3 md:size-4 lg:size-5" />,
    website: <FaGlobe size={21} className="size-3 md:size-4 lg:size-5" />,
};

export function LinkButton({ text, style }: LinkButtonProps) {
    // Base classes for all buttons
    const baseClasses = cn(
        "py-1 lg:py-2 px-4 text-[8px] md:text-xs lg:text-sm w-[85%] mx-auto lg:w-full transition-all duration-200 font-medium",
        style.buttonStyle === "rounded" && "rounded-full",
        style.buttonStyle === "pill" && "rounded-[3px]",
        style.buttonStyle === "square" && "rounded-none",
        style.buttonStyle === "outline" && "bg-transparent border",
        style.buttonBorder && "border border-current",
    )

    // Effect-specific classes and styles
    const getEffectStyles = () => {
        switch (style.buttonEffect) {
            case "3d":
                return {
                    // className: "transform hover:-translate-y-1 active:translate-y-0",
                    style: {
                        backgroundColor: style.buttonColor,
                        color: style.buttonTextColor,
                        fontFamily: style.fontFamily,
                        boxShadow: `0 4px 0 ${style.accentColor}, 0 8px 10px rgba(0,0,0,0.2)`,
                        transform: "translateY(0)",
                    },
                    hoverStyle: {
                        boxShadow: `0 6px 0 ${style.accentColor}, 0 10px 15px rgba(0,0,0,0.3)`,
                        transform: "translateY(-2px)",
                    },
                    activeStyle: {
                        boxShadow: `0 2px 0 ${style.accentColor}, 0 5px 8px rgba(0,0,0,0.15)`,
                        transform: "translateY(2px)",
                    },
                }
            case "glass":
                return {
                    // className: "backdrop-blur-sm hover:backdrop-blur-md",
                    style: {
                        backgroundColor: style.buttonColor,
                        color: style.buttonTextColor,
                        fontFamily: style.fontFamily,
                        backdropFilter: "blur(4px)",
                        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
                        border: "1px solid rgba(255, 255, 255, 0.2)",
                    },
                }
            case "neon":
                return {
                    // className: "transition-all duration-300",
                    style: {
                        backgroundColor: style.buttonColor,
                        color: style.buttonTextColor,
                        fontFamily: style.fontFamily,
                        textShadow: `0 0 5px ${style.buttonTextColor}, 0 0 10px ${style.buttonTextColor}`,
                        boxShadow: `0 0 5px ${style.accentColor}, 0 0 10px ${style.accentColor}, inset 0 0 5px ${style.accentColor}`,
                        border: `1px solid ${style.accentColor}`,
                    },
                }
            case "shadow":
                return {
                    // className: "hover:translate-x-[2px] hover:translate-y-[2px]",
                    style: {
                        backgroundColor: style.buttonColor,
                        color: style.buttonTextColor,
                        fontFamily: style.fontFamily,
                        boxShadow: `3px 3px 0 ${style.accentColor}`,
                    },
                }
            case "minimal":
                return {
                    // className: "hover:bg-black/5",
                    style: {
                        backgroundColor: style.buttonColor,
                        color: style.buttonTextColor,
                        fontFamily: style.fontFamily,
                        borderBottom: `1px solid ${style.accentColor}`,
                    },
                }
            case "flat":
            default:
                return {
                    // className: "hover:opacity-90 active:opacity-100",
                    style: {
                        backgroundColor: style.buttonStyle !== "outline" ? style.buttonColor : "transparent",
                        color: style.buttonTextColor,
                        fontFamily: style.fontFamily,
                        borderColor: style.buttonBorder ? style.accentColor : "transparent",
                    },
                }
        }
    }

    const effectStyles = getEffectStyles()
    const iconKey = text.toLowerCase().replace(/\s+/g, "");
    const icon = iconMap[iconKey] || <FaLink />;

    return (
        <button className={cn(baseClasses, 'flex items-center h-5 md:h-10 justify-start gap-1 md:gap-2')} style={effectStyles.style}>
            {/* {icon}
            {text} */}
        </button>
    )
}
