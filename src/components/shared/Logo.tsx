import { cn } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const Logo = ({ className, width, height }: { className?: string, width?: number, height?: number }) => {
    return (
        <Link href='/' className={cn('cursor-pointer inline-flex w-fit', className)}>
            <Image
                src='/assets/icons/logo.svg'
                alt='A logo'
                width={width || 50}
                height={height || 50}
                className='max-[320px]:size-10 size-14 md:size-16'
                priority
            />
        </Link>
    )
}

export default Logo
