import { Button } from "@/components/ui/button"
import { FaYoutube, FaSpotify, FaFacebook, FaBehance, FaPinterest } from "react-icons/fa";
import { IoLogoWhatsapp } from "react-icons/io";
import { FaXTwitter } from "react-icons/fa6";
import { Separator } from "./ui/separator"
import Image from "next/image";

const ToolsYouUse = () => {
    return (
        <section className='relative w-full overflow-x-clip mb-16 lg:mb-20'>
            <div className="relative mb-10 lg:mb-20 container px-6 md:px-10 lg:px-0 mx-auto">
                <Separator className="bg-black hidden lg:block z-10" />
                <div className="lg:max-w-[70%] mx-auto">
                    <div className="grid lg:grid-cols-[1fr_auto_1fr] gap-8 lg:gap-16 items-center">
                        <div className="grid grid-cols-6 gap-4 w-full lg:max-w-md mx-auto lg:mx-0">
                            {[
                                { icon: FaYoutube, color: "text-red-600" },
                                { icon: FaSpotify, color: "text-green-600 bg-black rounded-full" },
                                { icon: "", color: "", imgSrc: "/icons/insta.svg" },
                                { icon: "", color: "", imgSrc: "/icons/snapchat.svg" },
                                { icon: FaFacebook, color: "text-blue-500" },
                                { icon: FaBehance, color: "text-blue-700" },
                                { icon: FaPinterest, color: "text-red-800" },
                                { icon: IoLogoWhatsapp, color: "text-green-600" },
                                { icon: "", color: "", imgSrc: "/icons/figma.svg" },
                                { icon: "", color: "", imgSrc: "/icons/dribble.svg" },
                                { icon: "", color: "", imgSrc: "/icons/linkedin-icon.svg" },
                                { icon: "", color: "", imgSrc: "/icons/telegram.svg" },
                                { icon: "", color: "", imgSrc: "/icons/tiktok-icon.svg" },
                                { icon: "", color: "", imgSrc: "/icons/gmail.svg" },
                                { icon: FaXTwitter, color: "" },
                                { icon: "", color: "", imgSrc: "/icons/twitch.svg" },
                                { icon: "", color: "", imgSrc: "/icons/discord.svg" },
                                { icon: "", color: "", imgSrc: "/icons/github.svg" },
                            ].map((item, index) =>
                                item.imgSrc ? (
                                    <Image
                                        key={index}
                                        src={item.imgSrc}
                                        alt="custom icon"
                                        className="size-10 mb-2"
                                        height={50}
                                        width={50}
                                    />
                                ) : (
                                    <item.icon key={index} className={`size-10 ${item.color}`} />
                                ))}
                        </div>
                        <Separator orientation="vertical" className="bg-black hidden lg:block" />

                        <div className="space-y-6 lg:pt-10">
                            <div className="space-y-2">
                                <h4 className="text-[#7140EB] uppercase font-bold">
                                    15,000+ INTEGRATION
                                </h4>
                                <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                                    Integrate with the
                                    <br />
                                    tools you already use
                                </h2>
                                <p className="font-semibold text-[15px]">
                                    With Abio, enjoy seamless native integrations with all major platforms automating workflows,
                                    eliminating manual tasks, and accelerating your path to value.
                                </p>
                            </div>
                            <Button className='w-36 font-semibold h-10!'>
                                Get started
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="hidden md:flex rounded-full bg-gradient-to-r from-[#7140EB] to-[#FB8E8E] z-0 size-80 opacity-50 absolute -top-52 -right-40 filter blur-2xl" />
        </section>
    )
}
export default ToolsYouUse