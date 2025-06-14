import React from 'react'
import Logo from '../shared/Logo'
import Link from 'next/link'
import { Separator } from '../ui/separator'
import Image from 'next/image'
import { navLinks, socialLinks } from '@/data'

const Footer = () => {
    return (
        <footer className='px-5 container mx-auto space-y-5 py-10'>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-5 items-center'>
                <Logo showText />
                <div className='flex justify-between font-medium'>
                    {navLinks.map((item) => (
                        <Link href={item.href} key={item.label} className='block'>
                            {item.label}
                        </Link>
                    ))}
                </div>
                <div className='flex justify-end gap-2'>
                    {socialLinks.map((link) => (
                        <Link href={link.url} key={link.alt} target='_blank' rel='noopener noreferrer' className='hover:text-[#7140EB] transition-colors'>
                            <Image src={link.src} width={50} height={50} alt={link.alt} className='size-8 transition-colors' />
                        </Link>
                    ))}
                </div>
            </div>
            <Separator />
            <div className='flex justify-between items-center'>
                <div className='font-medium'>
                    ©{new Date().getFullYear()}  A.bio.Inc
                </div>
                <div className='flex justify-between gap-5 font-medium'>
                    <Link href={"/terms"}>Terms</Link>
                    <Link href={"/terms"}>Cookies</Link>
                    <Link href={"/terms"}>Privacy Policy</Link>
                </div>
            </div>
        </footer>
    )
}

export default Footer