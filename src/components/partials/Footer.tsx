"use client"

import React from 'react'
import Logo from '../shared/Logo'
import Link from 'next/link'
import { Separator } from '../ui/separator'
import Image from 'next/image'
import { navLinks, socialLinks } from '@/data'
import { usePathname } from 'next/navigation'

const Footer = () => {
    const pathname = usePathname()

    return (
        <footer className='container mx-auto space-y-5 md:px-10 lg:px-0 py-10'>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-5 items-center'>
                <Logo showText className='hidden lg:flex' />
                <div className='justify-between font-medium hidden lg:flex'>
                    {navLinks.map((item) => (
                        <Link
                            href={item.href}
                            key={item.label}
                            className={`${pathname === item.href ? "text-[#7140EB]" : ""} font-semibold transition-colors duration-200`}
                        >
                            {item.label}
                        </Link>
                    ))}
                </div>
                <div className='flex justify-center md:justify-start lg:justify-end gap-2'>
                    {socialLinks.map((link) => (
                        <Link href={link.url} key={link.alt} target='_blank' rel='noopener noreferrer' className='hover:text-[#7140EB] transition-colors'>
                            <Image src={link.src} width={50} height={50} alt={link.alt} className='size-8 transition-colors' />
                        </Link>
                    ))}
                </div>
            </div>
            <Separator />
            <Logo showText textSize='text-sm' className='flex justify-center md:justify-start w-full lg:hidden' />
            <div className='flex flex-col md:flex-row justify-between items-center'>
                <div className='font-medium flex items-center gap-1 -mt-1'>
                    ©{new Date().getFullYear()}  A.bio.Inc. <span className='flex lg:hidden'>All rights reserved</span>
                </div>
                <div className='flex justify-between gap-5 text-sm font-medium mt-2 lg:mt-0'>
                    <Link href={"/terms"}>Terms</Link>
                    <Link href={"/terms"}>Cookies</Link>
                    <Link href={"/terms"}>Privacy Policy</Link>
                </div>
            </div>
        </footer>
    )
}

export default Footer