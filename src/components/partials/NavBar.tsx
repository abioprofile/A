"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { navLinks } from "@/data"
import { usePathname } from "next/navigation"
import { Sheet, SheetContent } from "../ui/sheet"
import Image from "next/image"
import { DialogTitle } from "@radix-ui/react-dialog"
import { motion, AnimatePresence } from "framer-motion"

const NavBar = () => {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  // Prevent body scroll when menu is open for better performance
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  // Faster animation variants for snappy feel
  const sheetVariants = {
    closed: {
      x: "100%",
      transition: {
        type: "tween",
        duration: 0.25,
        ease: [0.4, 0, 0.2, 1] // Custom cubic-bezier for smooth acceleration
      }
    },
    open: {
      x: 0,
      transition: {
        type: "tween",
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1]
      }
    }
  }

  const itemVariants = {
    closed: { 
      opacity: 0, 
      x: 15,
      transition: { duration: 0.15 }
    },
    open: { 
      opacity: 1, 
      x: 0,
      transition: { 
        duration: 0.2,
        ease: "easeOut"
      }
    }
  }

  return (
    <header className="fixed bg-[#FED45C] top-[30px] md:top-[40px] left-1/2 -translate-x-1/2 z-50 w-[95%] md:w-[90%]">
      <div className="shadow-sm transition-all duration-300 shadow-xl">
        
        {/* NAVBAR */}
        <div className="container px-5 md:px-10 lg:px-6 mx-auto py-[16px]  flex items-center justify-between">
          <div className="flex items-center gap-14">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-[1.5px] group">
              <Image
                src="/icons/A.bio.svg"
                alt="A.Bio Logo"
                width={28}
                height={28}
                priority
                className="transition-transform group-hover:scale-105"
              />
              <span className="font-medium tracking-[0em] text-3xl text-end text-black tracking-wide">
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

            {/* Mobile Auth (INLINE) */}
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

            {/* Hamburger / Close button with better animation */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="relative p-2 rounded-lg hover:bg-black/5 transition-colors lg:hidden"
            >
              <AnimatePresence mode="wait" initial={false}>
                {isOpen ? (
                  <motion.span
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-xl flex items-center justify-center bg-[#ff0000] text-[#FED45C] w-9 h-9 rounded-md"
                  >
                    ✕
                  </motion.span>
                ) : (
                  <motion.div
                    key="hamburger"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Image
                      src="/icons/hamburger.svg"
                      alt="Menu"
                      width={26}
                      height={26}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>

        {/* SHEET with improved animation */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetContent
            side="right"
            className="lg:hidden w-full max-w-full border-none bg-[#FEF4EA] p-0 top-[118px] h-[calc(100dvh-118px)] [&>button]:hidden"
          >
            <DialogTitle className="sr-only">Mobile Menu</DialogTitle>

            <AnimatePresence mode="wait">
              {isOpen && (
                <motion.div
                  key="menu-content"
                  initial="closed"
                  animate="open"
                  exit="closed"
                  variants={sheetVariants}
                  className="flex flex-col h-full px-6 pt-6"
                >
                  {/* Nav Items with stagger effect */}
                  <nav className="flex flex-col">
                    {navLinks.map((link, index) => (
                      <motion.div
                        key={link.href}
                        custom={index}
                        variants={itemVariants}
                        initial="closed"
                        animate="open"
                        exit="closed"
                        transition={{ delay: index * 0.03 }}
                        className="border-b border-black/10 py-8"
                      >
                        <Link
                          href={link.href}
                          onClick={() => setIsOpen(false)}
                          className="flex items-center justify-between text-lg font-semibold text-black hover:text-[#FF0000] transition-colors"
                        >
                          {link.label}
                        </Link>
                      </motion.div>
                    ))}
                  </nav>
                </motion.div>
              )}
            </AnimatePresence>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}

export default NavBar