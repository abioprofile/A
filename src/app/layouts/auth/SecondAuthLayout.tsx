import React from 'react'
import Image from 'next/image'
import { AuthLayoutProps } from '@/types/intex'
import Logo from '@/components/shared/Logo'
import { useRouter } from 'next/navigation'

const SecondAuthLayout = ({
    heading,
    paragraph,
    image,
    imageAlt,
    children
}: AuthLayoutProps) => {
    const router = useRouter()
    return (
        <main className='flex flex-col lg:flex-row justify-center h-screen'>
            <div className="relative w-1/2 hidden md:flex flex-1">
                <Image
                    src={image}
                    alt={imageAlt}
                    width={500}
                    height={500}
                    className='w-full'
                    priority
                />
                {heading === "Reset Password" && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Image
                            src="/assets/icons/succes.svg"
                            alt="success icon"
                            width={300}
                            height={300}
                            priority
                        />
                    </div>
                )}
            </div>
            <div className='flex flex-col-reverse md:flex-col justify-center p-5 md:p-10 w-full md:w-1/2 bg-white h-full'>
                <div
                    className='xl:p-20 flex flex-col justify-center  max-[320px]:space-y-1 space-y-4 md:space-y-10 h-full'
                >
                    <div className='mb-10 lg:mb-20 w-full justify-start'>
                        <button onClick={() => router.back()} className='flex gap-1 cursor-pointer bg-none justify-start items-center bg-transparent hover:bg-transparent'>

                            <Image
                                src={"/assets/icons/auth/arrow-left.svg"}
                                alt={"Back icon"}
                                width={20}
                                height={20}
                                priority
                            />
                            <span className='text-sm'>Back to page</span>
                        </button>
                    </div>
                    <h1
                        className='text-[#7140EB] xs:test-xl text-2xl lg:text-[50px] font-black leading-[100%] tracking-[0]'
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
                <div className="flex justify-start md:justify-end w-full">
                    <Logo />
                </div>
            </div>
        </main>
    )
}

export default SecondAuthLayout
