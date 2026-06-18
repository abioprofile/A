"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { getPlatformIconUrl } from "@/data/platformIconMap"; 

const Footer = () => {
  const currentYear = new Date().getFullYear();

  // Define social links with platform identifiers
  const socialLinks = [
    { 
      platform: "instagram", 
      href: "https://www.instagram.com/abiosite?utm_source=qr",
      label: "Instagram"
    },
    { 
      platform: "tiktok", 
      href: "https://www.tiktok.com/@abiosite",
      label: "TikTok"
    },
    { 
      platform: "pinterest", 
      href: "https://pin.it/6Vnwtlyth",
      label: "Pinterest"
    },
    { 
      platform: "x", 
      href: "https://x.com/abio_site?s=21",
      label: "X (Twitter)"
    },
    { 
      platform: "linkedin", 
      href: "https://www.linkedin.com/company/abio",
      label: "LinkedIn"
    },
  ];

  return (
    <footer className="bg-[#331400] text-white pt-14 pb-8">
      <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-16">
        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-10 mb-14">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-[1px] group w-fit mb-5">
              <Image
                src="/icons/A.bio.svg"
                alt="A.bio Logo"
                width={24}
                height={24}
                priority
                className="cursor-pointer select-none transition-transform group-hover:scale-105"
              />
              <span className="font-medium tracking-[0em] text-3xl text-white tracking-wide">bio</span>
            </Link>
            <p className="text-xs text-white/60 leading-6 max-w-[200px]">
              One link. Endless connections.
            </p>
          </div>

          {/* Product */}
          <div>
            <h3 className="font-bold trial text-base mb-5 text-white">Product</h3>
            <div className="flex flex-col space-y-3 text-xs text-white/70">
              <Link href="#" className="hover:text-white transition-colors duration-200">Templates</Link>
              <Link href="#" className="hover:text-white transition-colors duration-200">Store</Link>
              <Link href="#" className="hover:text-white transition-colors duration-200">Contact Us</Link>
            </div>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-bold trial text-base mb-5 text-white">Company</h3>
            <div className="flex flex-col space-y-3 text-xs text-white/70">
              <Link href="#" className="hover:text-white transition-colors duration-200">About</Link>
              <Link href="#" className="hover:text-white transition-colors duration-200">FAQ</Link>
              <Link href="#" className="hover:text-white transition-colors duration-200">Careers</Link>
            </div>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-bold trial text-base mb-5 text-white">Legal</h3>
            <div className="flex flex-col space-y-3 text-xs text-white/70">
              <Link href="#" className="hover:text-white transition-colors duration-200">Terms of Service</Link>
              <Link href="#" className="hover:text-white transition-colors duration-200">Privacy Policy</Link>
              <Link href="#" className="hover:text-white transition-colors duration-200">Community Guidelines</Link>
              <Link href="#" className="hover:text-white transition-colors duration-200">Cookie Policy</Link>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-[#FED45C]/30 pt-7 flex flex-col sm:flex-row justify-between items-center gap-5">
          <p className="text-white/60 text-xs">
            © {currentYear} A.Bio — One Link Endless Connections
          </p>

          <div className="flex space-x-3">
            {socialLinks.map(({ platform, href, label }) => {
              // Get the BLACK icon URL
              const iconUrl = getPlatformIconUrl(platform, "black");
              
              // Fallback to a generic icon if the platform doesn't have an icon
              const fallbackIcon = (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
                </svg>
              );

              return (
                <motion.a
                  key={platform}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  whileHover={{ scale: 1.15, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="border border-white/30 p-2 hover:border-white transition-colors duration-200"
                >
                  {iconUrl ? (
                    <Image
                      src={iconUrl}
                      alt={label}
                      width={20}
                      height={20}
                      className="w-5 h-5 invert brightness-0 saturate-0" // Invert to make black icons white
                    />
                  ) : (
                    fallbackIcon
                  )}
                </motion.a>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;