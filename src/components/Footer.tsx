"use client";

import Link from "next/link";
import { FaInstagram, FaTiktok, FaPinterest, FaTwitter } from "react-icons/fa";
import Image from "next/image";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#331400] text-white py-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Section */}
          <div className="md:col-span-2">
            <div className="flex items-center">
           <Link href="/" className="flex items-center gap-1 group">
            <Image
              src="/icons/A.Bio.png"
              alt="A.Bio Logo"
              width={28}
              height={28}
              priority
              className="cursor-pointer select-none transition-transform group-hover:scale-105"
            />
            <span className="font-bold text-xl md:text-2xl text-white tracking-wide ">
              bio.site
            </span>
          </Link>

          </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="font-bold trial text-xl mb-4">Product</h3>
            <div className="flex flex-col space-y-4 font-thin text-[13px]">
              <Link href="#">Features</Link>
              <Link href="#">How it works</Link>
              <Link href="#">Setup</Link>
              <Link href="#">FAQ</Link>
            </div>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="font-bold trial text-xl mb-4">Legal</h3>
            <div className="flex flex-col space-y-4 font-thin text-[13px]">
             
              <Link href="#">Privacy Policy</Link>
              
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-[#FED45C] pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-white font-semibold text-sm mb-4 md:mb-0">
              © {currentYear} abio.site One Link Endless Connections
            </p>

            {/* Social Icons */}
            <div className="flex space-x-4 text-lg">
              <a
                href="https://www.instagram.com/abio.site?igsh=MXhjYmtvOWlvbXBpeg%3D%3D&utm_source=qr"
                target="_blank"
                rel="noopener noreferrer"
                className="border-1 border-[#fff] shadow-[1px_1px_0px_0px_#fff] p-2  transition-all"
              >
                <FaInstagram />
              </a>
              <a
                href="https://www.tiktok.com/@abio.site?_t=ZS-90XaM2rHhp4&_r=1"
                target="_blank"
                rel="noopener noreferrer"
                className="border-1 border-[#fff] shadow-[1px_1px_0px_0px_#fff] p-2 transition-all"
              >
                <FaTiktok />
              </a>
              <a
                href="https://pin.it/4rk3x7b28"
                target="_blank"
                rel="noopener noreferrer"
                className="border-1 border-[#fff] shadow-[1px_1px_0px_0px_#fff] p-2 transition-all"
              >
                <FaPinterest />
              </a>
              <a
                href="https://x.com/abioprofile?s=21"
                target="_blank"
                rel="noopener noreferrer"
                className="border-1 border-[#fff] shadow-[1px_1px_0px_0px_#fff] p-2 transition-all"
              >
                <FaTwitter />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
