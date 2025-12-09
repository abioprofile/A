"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { navLinks } from "@/data"
import Logo from "../shared/Logo"
import { usePathname } from "next/navigation"
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet"
import Image from "next/image"
import { DialogTitle } from "@radix-ui/react-dialog"

const NavBar = () => {
  const pathname = usePathname()

  return (
    <header className="fixed  top-[40px] left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-7xl">
      <div className=" bg-[#FED45C] shadow-sm backdrop-blur-md transition-all duration-300">
        <Sheet>
          <div className="container px-5 md:px-10 lg:px-6 mx-auto py-[16px] shadow-xl flex items-center lg:justify-between">
            {/* Logo (mobile) */}
          
            <Link href="/" className="flex flex-1 lg:hidden items-center mr-20 gap-1 group">
              <Image
                src="/icons/A.Bio.png"
                alt="A.Bio Logo"
                width={28}
                height={28}
                priority
                className="cursor-pointer select-none transition-transform group-hover:scale-105"
              />
              <span className="font-bold text-xl md:text-2xl text-black tracking-wide ">
                bio
              </span>
              </Link>
            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center space-x-8">
               <Link href="/" className="flex items-center mr-20 gap-1 group">
                          <Image
                            src="/icons/A.Bio.png"
                            alt="A.Bio Logo"
                            width={28}
                            height={28}
                            priority
                            className="cursor-pointer select-none transition-transform group-hover:scale-105"
                          />
                          <span className="font-bold text-xl md:text-2xl text-black tracking-wide ">
                            bio
                          </span>
              </Link>
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`${
                    pathname === link.href ? "text-[#FF0000]" : ""
                  } text-[15px] font-medium transition-colors duration-200`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Auth + Hamburger */}
            <div className="flex justify-between gap-3 items-center">
              <div className="flex items-center space-x-2 lg:space-x-2">
                <Link href={"/auth/sign-in"} passHref>
                  <Button
                    variant="ghost"
                    className="text-xs hidden lg:block lg:text-base font-semibold lg:px-10 h-7 lg:h-10"
                  >
                    Log In
                  </Button>
                </Link>
                <Link href={"/auth/sign-up"} passHref>
                  <Button className="text-xs hidden lg:block lg:text-base font-semibold lg:px-8 h-7 lg:h-10">
                    Sign Up
                  </Button>
                </Link>
              </div>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="ghost" size="icon">
                  <Image
                    src="/icons/hamburger.svg"
                    alt="Menu"
                    width={30}
                    height={30}
                    className="size-7"
                  />
                </Button>
              </SheetTrigger>
            </div>

           
            {/* Mobile Menu */}
            <SheetContent
              side="top"
              className="lg:hidden p-4  max-h-[350px] w-full overflow-auto bg-[#FED45C]"
            >
              <DialogTitle className="sr-only">Mobile Menu</DialogTitle>
              <nav className="flex flex-col space-y-6 mt-5">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`${
                      pathname === link.href ? "text-[#ff0000]" : "text-gray-800"
                    } font-thin text-[14px]`}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>

              {/* Auth buttons */}
              <div className="flex space-x-4 mt-4">
                <Link href={"/auth/sign-in"}>
                  <Button className="w-full text-[14px] font-semibold bg-[#ff0000] text-[#FED45C] ">Log In</Button>
                </Link>
                <Link href={"/auth/sign-up"}>
                  <Button className="w-full text-[14px] font-semibold bg-[#ff0000] text-[#FED45C]">
                    Sign Up
                  </Button>
                </Link>
              </div>
            </SheetContent>

          </div>
        </Sheet>
      </div>
    </header>
  )
}

export default NavBar
