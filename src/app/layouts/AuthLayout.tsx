import React from 'react'
import Image from 'next/image'
import { AuthLayoutProps } from '@/types/intex'
import Logo from '@/components/shared/Logo'

const AuthLayout = ({
    heading,
    paragraph,
    image,
    imageAlt,
    children
}: AuthLayoutProps) => {
    return (
        <main className='flex flex-col md:flex-row justify-center h-screen'>
            <div className='flex flex-col justify-center p-5 md:p-10 w-full lg:w-1/2 bg-white h-full'>
                <Logo />
                <div className='lg:p-10 flex flex-col justify-center items-center space-y-4 h-full'>
                    <h1 className='text-[#7140EB] text-2xl lg:text-[64px] font-black leading-[100%] tracking-[0]'>{heading}</h1>
                    <p className='text-[#7140EB] text-md lg:text-2xl font-light'>{paragraph}</p>
                    {children}
                </div>
            </div>
            <Image src={image} alt={imageAlt} width={500} height={500} className='w-1/2 hidden md:flex' />
        </main>
    )
}

export default AuthLayout
