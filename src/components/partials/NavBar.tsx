"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { navLinks } from "@/data"
import Logo from "../shared/Logo"
import { usePathname } from "next/navigation"

const NavBar = () => {
    const pathname = usePathname()

    return (
        <header className={"fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white/90 shadow-lg backdrop-blur-md"}>
            <div className="hidden lg:flex container mx-auto h-16 items-center lg:justify-between px-5">
                <nav className="hidden md:flex items-center space-x-8">
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

                <div className="flex items-center space-x-4">
                    <Link href={"/auth/sign-in"} passHref>
                        <Button variant="ghost" className="font-semibold w-fit! px-10 h-10!">
                            Log In
                        </Button>
                    </Link>
                    <Link href={"/auth/sign-up"} passHref>
                        <Button className="font-semibold rounded-4xl w-fit! px-10 h-10!">
                            Sign Up
                        </Button>
                    </Link>
                </div>
            </div>
        </header>
    )
}
export default NavBar