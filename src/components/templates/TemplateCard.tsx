"use client"

import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { TemplateCardProps } from "@/interfaces/template.interface"
import { LinkButton } from "./TemplateButton"
import { MapPin } from "lucide-react"
import Image from "next/image"
import { motion, type Variants } from "framer-motion"

export function TemplateCard({ template, onClick, isSelected }: TemplateCardProps) {
    const { style, profile, links } = template
    
    // Animation variants
    const cardVariants: Variants = {
        initial: {
            scale: 1,
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        },
        hover: {
            scale: 1.02,
            boxShadow: "0 10px 25px rgba(0, 0, 0, 0.15)",
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
        },
        selected: {
            scale: 1.01,
            boxShadow: "0 0 0 3px rgba(var(--primary), 0.3), 0 10px 30px rgba(0, 0, 0, 0.2)",
            transition: {
                type: "spring",
                stiffness: 200,
                damping: 15
            }
        }
    }

    const avatarVariants: Variants = {
        initial: { scale: 1 },
        hover: { 
            scale: 1.05,
            rotate: [0, -2, 2, -2, 0],
            transition: {
                rotate: {
                    repeat: Infinity,
                    duration: 2,
                    ease: "easeInOut"
                },
                scale: {
                    type: "spring",
                    stiffness: 400,
                    damping: 10
                }
            }
        }
    }

    const linkIconVariants: Variants = {
        initial: { y: 0 },
        hover: {
            y: [0, -3, 0],
            transition: {
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut"
            }
        }
    }

    const contentVariants: Variants = {
        initial: { opacity: 1 },
        hover: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05
            }
        }
    }

    const itemVariants: Variants = {
        initial: { y: 0, opacity: 1 },
        hover: {
            y: -2,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 15
            }
        }
    }

    const borderPulseVariants: Variants = {
        initial: { opacity: 0 },
        selected: {
            opacity: [0.3, 0.6, 0.3],
            transition: {
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
            }
        }
    }

    return (
        <motion.div
            className={cn(
                "ring-1 ring-gray-500 md:ring-0 relative overflow-hidden cursor-pointer h-[20rem] md:h-[35rem] lg:h-fit w-full md:w-[70%] ",
                isSelected && "ring-3 ring-primary"
            )}
            onClick={onClick}
            variants={cardVariants}
            initial="initial"
            whileHover="hover"
            whileTap="tap"
            animate={isSelected ? "selected" : "initial"}
            layout
        >
            {/* Pulsing border effect when selected */}
            {isSelected && (
                <motion.div
                    className="absolute inset-0 ring-4 ring-primary/30 rounded-lg pointer-events-none"
                    variants={borderPulseVariants}
                    initial="initial"
                    animate="selected"
                />
            )}

            {/* Smooth background transition */}
            <motion.div 
                className="flex flex-col h-full"
                style={{
                    backgroundColor: style.overlay ? "rgba(0,0,0,0.2)" : "transparent"
                }}
                transition={{ duration: 0.3 }}
            >
                <motion.div 
                    className="bg-white p-5 md:p-6 pt-5 lg:pt-10 relative h-[7rem] lg:h-[12rem]"
                    variants={contentVariants}
                >
                    {/* Animated link icon */}
                    <motion.div 
                        className="absolute -bottom-[2px] left-5 md:left-10 flex flex-col items-center space-y-1"
                        variants={linkIconVariants}
                        initial="initial"
                        whileHover="hover"
                    >
                        <Image
                            src="/icons/link.svg"
                            alt="link icon"
                            priority
                            width={20}
                            height={20}
                            className="size-3 lg:size-5"
                        />
                        <motion.div 
                            className="w-6 h-1 bg-red-500 shadow-[0_2px_2px_rgba(0,0,0,0.3)] rounded-sm"
                            animate={{
                                width: ["24px", "28px", "24px"]
                            }}
                            transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                        />
                    </motion.div>
                    
                    {/* Profile section with avatar animation */}
                    <motion.div 
                        className="flex items-center gap-2 lg:gap-4 mb- lg:mb-3"
                        variants={itemVariants}
                    >
                        <motion.div
                            variants={avatarVariants}
                            initial="initial"
                            whileHover="hover"
                        >
                            <Avatar className="size-10 md:size-12 lg:size-16 shadow-lg">
                                <AvatarImage src={profile.avatar || ""} alt={profile.name} />
                                <AvatarFallback>
                                    <motion.span
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ type: "spring", stiffness: 200 }}
                                    >
                                        {profile.name.charAt(0)}
                                    </motion.span>
                                </AvatarFallback>
                            </Avatar>
                        </motion.div>
                        <motion.div variants={itemVariants}>
                            <h3 className="font-bold text-[8px] md:text-[16px]" style={{ fontFamily: style.fontFamily }}>
                                {profile.name}
                            </h3>
                            <motion.p 
                                className="text-[6px] md:text-[10px] opacity-80"
                                initial={{ opacity: 0.8 }}
                                whileHover={{ opacity: 1 }}
                                transition={{ duration: 0.2 }}
                            >
                                @{profile.username}
                            </motion.p>
                        </motion.div>
                    </motion.div>
                    
                    <motion.p 
                        className="text-[6px] md:text-[10px] md:mb-2 font-semibold" 
                        style={{ fontFamily: style.fontFamily }}
                        variants={itemVariants}
                    >
                        {profile.bio}
                    </motion.p>

                    <motion.div 
                        className="items-center border-1 border-[#000] gap-1 px-1 inline-flex mb-2 md:mb-0"
                        variants={itemVariants}
                        whileHover={{ 
                            scale: 1.05,
                            backgroundColor: "rgba(0,0,0,0.05)"
                        }}
                    >
                        <MapPin className="size-2 lg:size-3" />
                        <span style={{ fontFamily: style.fontFamily }} className="text-[6px] md:text-[9px] text-[#000] font-medium">
                            {profile.location}
                        </span>
                    </motion.div>
                </motion.div>

                <motion.div 
                    className="flex flex-col gap-3 h-full px-2 md:px-5 lg:px-10 py-7 lg:py-10 space-y-1"
                    style={{
                        backgroundColor: style.backgroundColor,
                        backgroundImage: style.backgroundImage,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        color: style.textColor,
                    }}
                    initial={false}
                    animate={{
                        backgroundPosition: ["center", "center 1%", "center"],
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                >
                    {links.map((link, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                                delay: index * 0.05,
                                type: "spring",
                                stiffness: 200,
                                damping: 15
                            }}
                            whileHover={{ 
                                y: -3,
                                transition: { type: "spring", stiffness: 400 }
                            }}
                        >
                            <LinkButton text={link.text} style={style} />
                        </motion.div>
                    ))}
                </motion.div>
            </motion.div>
        </motion.div>
    )
}