import React from 'react'
import Image from 'next/image'
import { AuthLayoutProps } from '@/types/intex'
import Logo from '@/components/shared/Logo'

const SecondAuthLayout = ({
    heading,
    paragraph,
    image,
    imageAlt,
    children
}: AuthLayoutProps) => {
    return (
        <main className='flex flex-col lg:flex-row justify-center h-screen'>
            <div className="relative w-1/2 hidden lg:flex">
                <Image src={image} alt={imageAlt} width={500} height={500} className='w-full' />
                {heading === "Reset Password" && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Image
                            src="/assets/icons/succes.svg"
                            alt="success icon"
                            width={300}
                            height={300}
                            className="size-16"
                        />
                    </div>
                )}
            </div>
            <div className='flex flex-col justify-center p-5 md:p-10 w-full lg:w-1/2 bg-white h-full'>

                <div
                    className='lg:p-10 flex flex-col justify-center items-center max-[320px]:space-y-1 space-y-4 md:space-y-10 h-full'
                >
                    <h1
                        className='text-[#7140EB] xs:test-xl text-2xl lg:text-[64px] font-black leading-[100%] tracking-[0]'
                    >
                        {heading}
                    </h1>
                    <p
                        className='text-[#7140EB] xs:text-s text-md lg:text-2xl font-light md:mb-5'
                    >
                        {paragraph}
                    </p>
                    {children}
                </div>
                <div className="flex justify-end w-full">

                    <Logo />
                </div>
            </div>
        </main>
    )
}

export default SecondAuthLayout
