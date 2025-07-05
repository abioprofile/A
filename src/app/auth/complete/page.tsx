"use client"

import { LinkButton } from '@/components/templates/TemplateButton'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { useTemplateStore } from '@/stores/template.store'
import { useUserStore } from '@/stores/user.store'
import { MapPin } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'

const Complete = () => {
    const { selectedTemplate } = useTemplateStore()
    const router = useRouter()
    const { resetStore } = useUserStore()

    useEffect(() => {
        return () => {
            resetStore()
        }
    }, [resetStore])
    return (
        <main className="min-h-screen container flex flex-col mx-auto py-20">
            <div className="mb-16 flex justify-center items-center flex-col">
                <h1 className="text-3xl lg:text-4xl font-bold mb-2 bg-gradient-to-r from-[#7140EB] to-[#FB8E8E] text-transparent bg-clip-text">
                    Looking good!
                </h1>
                <p className="font-semibold px-16 text-center">Your ABio is off to a  great start. Continue building to make it even better.</p>
            </div>

            <Card
                className="relative overflow-hidden transition-all duration-200 h-[400px] w-sm mx-auto rounded-b-none rounded-t-[30px] py-0"
                style={{
                    boxShadow: `
                      -12px -10px 20px -10px #7140EB,  /* Top-left */
                      12px -0 20px -10px #7140EB,   /* Top-right */
                      0 -5px 20px -10px #7140EB       /* Top-center */
                    `
                }}
            >
                <div className={cn("flex flex-col h-full", selectedTemplate?.style.overlay && "bg-black/20")}>
                    <div className="bg-white p-6 pointer-events-none">
                        <div className="flex items-center gap-4 mb-6">
                            <Avatar className="size-16" style={{ boxShadow: "0 3px 3px rgba(0, 0, 0, 0.25)" }}>
                                <AvatarImage src={selectedTemplate?.profile.avatar || ""} alt={selectedTemplate?.profile.name} />
                                <AvatarFallback>{selectedTemplate?.profile.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                                <h3 className="font-bold text-xl" style={{ fontFamily: selectedTemplate?.style.fontFamily }}>
                                    {selectedTemplate?.profile.name}
                                </h3>
                                <p className="text-sm opacity-80">@{selectedTemplate?.profile.username}</p>
                            </div>
                        </div>

                        <p className="text-sm mb-2 font-semibold" style={{ fontFamily: selectedTemplate?.style.fontFamily }}>
                            {selectedTemplate?.profile.bio}
                        </p>
                        <div className="items-center rounded-full border border-[#989898] gap-1 px-1 inline-flex">
                            <MapPin className="size-3" />
                            <span style={{ fontFamily: selectedTemplate?.style.fontFamily }} className="text-xs text-[#989898]">Lagos, Nigeria</span>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3 h-full px-10 pt-5 space-y-1"
                        style={{
                            backgroundColor: selectedTemplate?.style.backgroundColor,
                            backgroundImage: selectedTemplate?.style.backgroundImage,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            color: selectedTemplate?.style.textColor,
                        }}
                    >
                        {selectedTemplate?.links.map((link, index) => (
                            <LinkButton key={index} text={link.text} style={selectedTemplate?.style} />
                        ))}
                    </div>
                </div>
            </Card>
            <Button onClick={() => router.push("/auth/offer-plans")} className='max-w-sm mx-auto mt-auto'>Continue</Button>
        </main>
    )
}

export default Complete