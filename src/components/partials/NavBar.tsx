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
        <header className={"fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white/70 shadow-lg backdrop-blur-md"}>
            <Sheet>
                <div className="container px-5 md:px-10 lg:px-0 mx-auto h-16 flex items-center lg:justify-between">
                    <Logo showText textSize="text-base" className="flex-1 lg:hidden" />

                    <nav className="hidden lg:flex items-center space-x-8">
                        <Logo showText className="mr-28" />
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`${pathname === link.href ? "text-[#7140EB]" : ""} font-semibold transition-colors duration-200`}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>
                    <div className="flex justify-between gap-3 items-center">
                        <div className="flex items-center space-x-2 lg:space-x-4">
                            <Link href={"/auth/sign-in"} passHref>
                                <Button variant="ghost" className="text-xs font-semibold w-fit! lg:px-10 h-7! lg:h-10!">
                                    Log In
                                </Button>
                            </Link>
                            <Link href={"/auth/sign-up"} passHref>
                                <Button className="text-xs font-semibold w-fit! lg:px-10 h-7! lg:h-10!">
                                    Sign Up
                                </Button>
                            </Link>
                        </div>
                        <SheetTrigger asChild className="lg:hidden">
                            <Button variant="ghost" size="icon">
                                <Image
                                    src="/icons/hamburger.svg"
                                    alt="Text blend decoration"
                                    width={30}
                                    height={30}
                                    className="size-7"
                                />
                            </Button>
                        </SheetTrigger>
                    </div>

                    {/* Mobile Menu */}
                    <SheetContent side="right" className="p-6 lg:hidden w-64 sm:w-80">
                        <DialogTitle></DialogTitle>
                        <nav className="flex flex-col space-y-4 mt-16">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`${pathname === link.href ? "text-[#7140EB]" : ""} font-semibold text-base`}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </nav>
                    </SheetContent>
                </div>
            </Sheet>
        </header>
    )
}
export default NavBar