import { cn } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

interface LogoProps {
    className?: string;
    width?: number;
    height?: number;
    showText?: boolean;
}
const Logo = ({ className, width, height, showText = false }: LogoProps) => {
    return (
        <Link href='/' className={cn('cursor-pointer inline-flex gap-2 w-fit items-center', className)}>
            <Image
                src='/assets/icons/logo.svg'
                alt='A logo'
                width={width || 50}
                height={height || 50}
                className='max-[320px]:size-10 size-14 md:size-10'
                priority
            />
            {showText && <span className="text-lg font-bold">A.Bio</span>}
        </Link>
    )
}

export default Logo
