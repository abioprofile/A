"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { navLinks } from "@/data"
import Logo from "../shared/Logo"

const NavBar = () => {
    const [scrolled, setScrolled] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10)
        }
        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    return (
        <header
            className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
                scrolled ? "bg-white/90 shadow-lg backdrop-blur-md" : "bg-white/80 backdrop-blur-sm",
            )}
        >
            <div className="hidden lg:flex container mx-auto h-16 items-center lg:justify-between px-5">
                <nav className="hidden md:flex items-center space-x-8">
                    <Logo showText className="mr-28" />
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="font-semibold transition-colors duration-200"
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