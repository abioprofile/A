"use client"

import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { TemplateCardProps } from "@/interfaces/template.interface"
import { LinkButton } from "./TemplateButton"
import { MapPin } from "lucide-react"
import Image from "next/image"


export function TemplateCard({ template, onClick, isSelected }: TemplateCardProps) {
    const { style, profile, links } = template
    // style={{ boxShadow: "0 3px 3px rgba(0, 0, 0, 0.25)" }} //avatar former style
    return (
        <div
            className={cn(
                "relative overflow-hidden transition-all duration-200 cursor-pointer h-[700px] w-[80%] md:w-[85%]",
                isSelected ? "ring-2 ring-primary" : "hover:ring-2 hover:ring-primary/50",
            )}
            onClick={onClick}
        >

            <div className={cn("flex flex-col h-full", style.overlay && "bg-black/20")}>
                <div className="bg-white p-10 pt-16 relative">
                    <div className="absolute -bottom-[2px] left-10 flex flex-col items-center space-y-1">
                        <Image src="/icons/link.svg" alt="" width={20} height={20} />
                        <div className="w-6 h-1 bg-red-500 shadow-[0_2px_2px_rgba(0,0,0,0.3)] rounded-sm" />
                    </div>
                    <div className="flex items-center gap-4 mb-6">
                        <Avatar className="size-16">
                            <AvatarImage src={profile.avatar || ""} alt={profile.name} />
                            <AvatarFallback>{profile.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <h3 className="font-bold text-xl" style={{ fontFamily: style.fontFamily }}>
                                {profile.name}
                            </h3>
                            <p className="text-sm opacity-80">@{profile.username}</p>
                        </div>
                    </div>

                    <p className="text-sm mb-2 font-semibold" style={{ fontFamily: style.fontFamily }}>
                        {profile.bio}
                    </p>
                    <div className="items-center rounded-full border border-[#989898] gap-1 px-1 inline-flex">
                        <MapPin className="size-3" />
                        <span style={{ fontFamily: style.fontFamily }} className="text-xs text-[#989898] font-medium">{profile.location}</span>
                    </div>
                </div>

                <div className="flex flex-col gap-3 h-full px-10 pt-5 md:pt-10 space-y-1"
                    style={{
                        backgroundColor: style.backgroundColor,
                        backgroundImage: style.backgroundImage,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        color: style.textColor,
                    }}
                >
                    {links.map((link, index) => (
                        <LinkButton key={index} text={link.text} style={style} />
                    ))}
                </div>
            </div>
        </div>
    )
}
