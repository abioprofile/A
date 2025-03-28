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
        <main className='flex flex-col lg:flex-row justify-center h-screen'>
            <div className='flex flex-col justify-center p-5 md:p-10 w-full lg:w-1/2 bg-white h-full'>
                <Logo className='block' />

                <div className='lg:p-10 flex flex-col justify-center items-center max-[320px]:space-y-1 space-y-4 h-full'>
                    <h1 className={`text-[#7140EB] text-center xs:test-xl text-2xl ${heading === "Input your username" && "lg:text-[45px] w-full"} font-black leading-[100%] tracking-[0]`}>{heading}</h1>
                    <p className='text-[#7140EB] text-md lg:text-2xl font-light md:mb-5'>{paragraph}</p>
                    {children}
                </div>
            </div>
            <Image
                src={image}
                alt={imageAlt}
                width={500}
                height={500}
                className='w-1/2 hidden lg:flex'
                priority
            />
        </main>
    )
}

export default AuthLayout
