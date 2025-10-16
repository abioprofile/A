"use client"
import React from "react"
import Image from "next/image"
import {
  FaLinkedin,
  FaInstagram,
  FaTiktok,
  FaSnapchatGhost,
} from "react-icons/fa"

const Footer = () => {
  return (
    <footer className="bg-[#3C1C0B] text-white pt-12 pb-6">
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Logo + description */}
        <div>
          <div className="flex items-center space-x-2 mb-4">
            <Image src="/images/logo.png" alt="A.Bio" width={30} height={30} />
            <h2 className="text-xl font-bold">A.Bio</h2>
          </div>
          <p className="text-sm text-gray-300 leading-relaxed">
            A.Bio helps you showcase everything you do in one smart link, grow
            your audience effortlessly, and track results to boost your business
            all in a simple, professional way.
          </p>
        </div>

        {/* Product */}
        <div>
          <h3 className="font-semibold text-lg mb-3">Product</h3>
          <ul className="space-y-2 text-gray-300">
            <li>
              <a href="#" className="hover:text-white">
                Template
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white">
                Store
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white">
                Pricing
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white">
                Contact Us
              </a>
            </li>
          </ul>
        </div>

        {/* Company */}
        <div>
          <h3 className="font-semibold text-lg mb-3">Company</h3>
          <ul className="space-y-2 text-gray-300">
            <li>
              <a href="#" className="hover:text-white">
                About
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white">
                Faq
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white">
                Careers
              </a>
            </li>
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h3 className="font-semibold text-lg mb-3">Legal</h3>
          <ul className="space-y-2 text-gray-300">
            <li>
              <a href="#" className="hover:text-white">
                Terms of Service
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white">
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white">
                Community Guidelines
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white">
                Cookie Policy
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-yellow-600 mt-10 pt-6 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
          {/* Copyright */}
          <p className="text-sm text-gray-300 mb-4 md:mb-0">
            © 2025 A.Bio.site. One Link Endless Connections
          </p>

          {/* Socials */}
          <div className="flex space-x-4">
            <a href="#" className="p-2 border border-white rounded hover:bg-white hover:text-black">
              <FaLinkedin />
            </a>
            <a href="#" className="p-2 border border-white rounded hover:bg-white hover:text-black">
              <FaInstagram />
            </a>
            <a href="#" className="p-2 border border-white rounded hover:bg-white hover:text-black">
              <FaTiktok />
            </a>
            <a href="#" className="p-2 border border-white rounded hover:bg-white hover:text-black">
              <FaSnapchatGhost />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
