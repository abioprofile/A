import React from 'react'
import Image from 'next/image'
import { GripVertical, Trash2, Image as ImageIcon, Pencil } from "lucide-react";

const platforms = [
  {
    name: "Instagram",
    link: "https://www.instagram.com/davidosh",
    icon: "/icons/instagram.svg",
  },
  {
    name: "Snapchat",
    link: "https://www.snapchat.com/add/davidosh",
    icon: "/icons/snapchat.svg",
    bg: "bg-[#FFDCE3]",
    offset: "lg:ml-14", // displace to right
  },
  {
    name: "Behance",
    link: "https://www.behance.net/davidosh",
    icon: "/icons/behance.svg",
  },
  {
    name: "X",
    link: "https://x.com/davidosh",
    icon: "/icons/x.svg",
    bg: "bg-[#FFDCE3]",
    offset: "lg:ml-14", // displace to right
  },
];

function SocialLinkCard({
  name,
  link,
  icon,
  bg,
  offset,
}: {
  name: string;
  link: string;
  icon: string;
  bg?: string;
  offset?: string;
}) {
  return (
    <div
      className={`flex flex-col border border-[#5D2D2B] shadow-[4px_4px_0px_0px_#000000] p-2  lg:w-[400px] max-w-lg ${
        bg || "bg-white"
      } ${offset || ""}`}
    >
      {/* Top Row */}
      <div className="flex items-center justify-between gap-3">
        {/* Drag Handle */}
        <GripVertical className="text-gray-500 w-5 h-5 cursor-move" />

        {/* Platform Icon + Info */}
        <div className="flex items-center gap-2 flex-1">
          <img src={icon} alt={name} className="w-5 h-5" />
          <div className="flex flex-col">
            <div className="flex items-center gap-1">
              <p className="text-[14px] font-semibold">{name}</p>
              <Pencil className="w-3 h-3 text-gray-500 cursor-pointer" />
            </div>
            <div className="flex items-center gap-1">
              <a href={link} className="text-[10px] text-gray-600 truncate">
                {link}
              </a>
              <Pencil className="w-3 h-3 text-gray-500 cursor-pointer" />
            </div>
          </div>
        </div>

        {/* Delete Icon */}
        <Trash2 className="w-4 h-4 text-gray-500 cursor-pointer hover:text-red-500" />
      </div>

      {/* Bottom Row: Add Image */}
      <div className="flex mt-1">
        <ImageIcon className="w-4 h-4 text-gray-500" />
      </div>
    </div>
  );
}

const ManageYourLinks = () => {
  return (
    <section className="bg-[#FED45C] mt-20 relative mb-10 lg:mb-0 mx-4 lg:mx-auto px-8 pt-8 pb-20">
      <div className="container mx-auto relative flex flex-col xl:grid lg:grid-cols-[1.2fr_1fr] gap-8 lg:gap-16 items-center">
        {/* Text Section */}
        <div className="space-y-6">
          <div className="space-y-4 max-w-xl">
            <h2 className="text-[35px] xl:text-5xl trialheader text-[#5D2D2B] font-bold tracking-none leading-tight">
              Integrate and Manage your Links
            </h2>
            <p className="text-[13px] w-[90%] xl:w-full xl:text-[15px] font-thin">
              Organize, prioritize, and update links anytime to guide your audience exactly where you want them.
            </p>
          </div>
        </div>
        <Image src="../assets/arrow.svg"
                alt=""
                height="50"
                width="50"
                
                className="w-full hidden lg:block absolute -bottom-8 right-40 h-[250px]"
            />
        {/* Cards Section */}
        <div className="space-y-4">
          {platforms.map((platform, i) => (
            <SocialLinkCard key={i} {...platform} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ManageYourLinks;

