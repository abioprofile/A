"use client";

import Link from "next/link";
import { FaInstagram, FaTiktok, FaPinterest, FaTwitter } from "react-icons/fa";
import Image from "next/image";
import { motion } from "framer-motion";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#331400] text-white pt-14 pb-8">
      <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-16">
        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-10 mb-14">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-1 group w-fit mb-5">
              <Image
                src="/icons/A.Bio.png"
                alt="A.Bio Logo"
                width={28}
                height={28}
                priority
                className="cursor-pointer select-none transition-transform group-hover:scale-105"
              />
              <span className="font-bold text-xl text-white tracking-wide">bio</span>
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
            {[
              { href: "https://www.instagram.com/abio.site?igsh=MXhjYmtvOWlvbXBpeg%3D%3D&utm_source=qr", icon: <FaInstagram /> },
              { href: "https://www.tiktok.com/@abio.site?_t=ZS-90XaM2rHhp4&_r=1", icon: <FaTiktok /> },
              { href: "https://pin.it/4rk3x7b28", icon: <FaPinterest /> },
              { href: "https://x.com/abioprofile?s=21", icon: <FaTwitter /> },
            ].map(({ href, icon }, i) => (
              <motion.a
                key={i}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.15, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="border border-white/30 p-2 text-white/70 hover:text-white hover:border-white transition-colors duration-200"
              >
                {icon}
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
