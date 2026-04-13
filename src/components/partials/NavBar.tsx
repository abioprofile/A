"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { navLinks } from "@/data"
import { usePathname } from "next/navigation"
import { Sheet, SheetContent } from "../ui/sheet"
import Image from "next/image"
import { DialogTitle } from "@radix-ui/react-dialog"
import { motion } from "framer-motion"

const NavBar = () => {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="fixed bg-[#FED45C] top-[40px] left-1/2 -translate-x-1/2 z-50 w-[95%] md:w-[90%] ">
      <div className=" shadow-sm  transition-all duration-300">
        
        {/* NAVBAR */}
        <div className="container px-5 md:px-10 lg:px-6 mx-auto py-[16px] shadow-xl flex items-center justify-between">
          <div className="flex items-center gap-14">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-1 group">
            <Image
              src="/icons/A.Bio.png"
              alt="A.Bio Logo"
              width={38}
              height={38}
              priority
              className="transition-transform group-hover:scale-105"
            />
            <span className="font-semibold hidden md:block text-3xl text-end text-black tracking-wide">
              bio
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center space-x-12">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`${
                  pathname === link.href ? "text-[#FF0000]" : ""
                } text-sm md:text-[16px] font-semibold transition-colors duration-200 hover:text-[#FF0000]/80`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          </div>

          {/* Right Section */}
          <div className="flex items-center gap-3">

            {/* Desktop Auth */}
            <div className="hidden lg:flex items-center space-x-2">
              <Link href={"/auth/sign-in"}>
                <Button variant="ghost" className="text-base bg-[#ff0000]/10 hover:bg-[#ff0000]/20 font-semibold px-6 h-10">
                  Log In
                </Button>
              </Link>
              <Link href={"/auth/sign-up"}>
                <Button className="text-base font-semibold px-6 h-10">
                  Sign Up
                </Button>
              </Link>
            </div>

            {/* Mobile Auth (INLINE like your reference) */}
            <div className="flex items-center gap-2 lg:hidden">
              <Link href={"/auth/sign-in"}>
                <Button variant="ghost" className="text-[14px] bg-[#ff0000]/10 font-bold h-10 px-4">
                  Log in
                </Button>
              </Link>
              <Link href={"/auth/sign-up"}>
                <Button className="text-xs shadow-[2px_2px_0px_0px_#000000] font-semibold h-10 px-4 bg-[#ff0000] text-[#FED45C] hover:bg-[#ff0000]/80">
                  Sign up
                </Button>
              </Link>
            </div>

            {/* Hamburger / Close (same position) */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg hover:bg-black/5 transition-colors lg:hidden"
            >
              {isOpen ? (
                <span className="text-xl p-2 bg-[#ff0000] text-[#FED45C] h-9">✕</span>
              ) : (
                <Image
                  src="/icons/hamburger.svg"
                  alt="Menu"
                  width={26}
                  height={26}
                />
              )}
            </button>
          </div>
        </div>

        {/* SHEET */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetContent
            side="right"
            className="lg:hidden  w-full max-w-full border-none bg-[#FEF4EA] p-0 top-[118px] h-[calc(100dvh-118px)] [&>button]:hidden"
          >
            <DialogTitle className="sr-only">Mobile Menu</DialogTitle>

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
              className="flex flex-col h-full px-6 pt-6"
            >
              {/* Nav Items */}
              <nav className="flex flex-col">
                {navLinks.map((link, index) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-black/10 py-8"
                  >
                    <Link
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center justify-between text-lg font-semibold text-black"
                    >
                      {link.label}
                      {/* <span className="text-black/40">›</span> */}
                    </Link>
                  </motion.div>
                ))}
              </nav>
            </motion.div>
          </SheetContent>
        </Sheet>

      </div>
    </header>
  )
}

export default NavBar