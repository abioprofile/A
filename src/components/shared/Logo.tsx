import { cn } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

interface LogoProps {
    className?: string;
    width?: number;
    height?: number;
    showText?: boolean;
    textSize?: string
}
const Logo = ({ className, width, height, showText = false, textSize = "text-lg" }: LogoProps) => {
    return (
        <Link href='/' className={cn('cursor-pointer inline-flex gap-1 w-fit items-center', className)}>
            <Image
                src='/assets/icons/logo.svg'
                alt='A logo'
                width={width || 50}
                height={height || 50}
                className='max-[320px]:size-10 size-9 md:size-10'
                priority
            />
            {showText && <span className={`${textSize} font-extrabold tracking-tight`}>A.Bio</span>}
        </Link>
    )
}

export default Logo
