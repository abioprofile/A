import Image from 'next/image'
import React from 'react'
import { Input } from './ui/input'
import { Button } from './ui/button'

const HeroSection = () => {
    return (
        <section className='relative w-full overflow-x-clip'>
            <div className="xl:hidden rounded-full bg-gradient-to-r from-[#7140EB] to-[#FB8E8E] opacity-30 absolute top-[19rem] md:right-[14rem] lg:-top-40 -right-10 lg:-right-5 z-20 size-[15rem] lg:size-[22rem] filter blur-3xl" />

            <div className="xl:hidden rounded-full bg-gradient-to-r from-[#7140EB] to-[#FB8E8E] opacity-30 absolute -bottom-10 lg:-bottom-16 left-5 md:left-[14rem] lg:left-[40rem] xl:left-[50rem] size-[15rem] lg:size-[22rem] z-20 filter blur-3xl" />

            <div className='mb-10 container mx-auto px-6 md:px-0'>
                <div className="max-w-7xl">
                    <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                        <div className="space-y-6 lg:space-y-8 relative">

                            <div className="space-y-2 mt-5 bg-white z-40">
                                <h4 className="text-[#7140EB] z-40 uppercase font-bold text-center lg:text-start">
                                    JUST ONE LINK, LET&apos;S CREATE!
                                </h4>

                                <div className="space-y-7 relative inline-bloc text-center lg:text-left flex flex-col justify-center lg:justify-start">
                                    <h1 className="text-black text-4xl md:text-5xl lg:text-6xl font-bold text-center lg:text-start flex justify-center lg:justify-start">
                                        The Amazing Link<br />For Everything
                                    </h1>
                                    <h1 className="w-full absolute top-0 left-0 clip text-4xl md:text-5xl lg:text-6xl font-bold text-center lg:text-start flex justify-center lg:justify-start">
                                        The Amazing Link<br />For Everything
                                    </h1>

                                    <div className="relative max-w-md mx-auto lg:mx-0 text-center lg:text-left">
                                        <p className="text-black z-40 text-base font-medium">
                                            Shop Everything, showcase your links, get closer to your audience. Do it all with A.bio.
                                        </p>
                                        <p className="absolute top-0 left-0 w-full clip z-40 text-base font-medium">
                                            Shop Everything, showcase your links, get closer to your audience. Do it all with A.bio.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto lg:mx-0">
                                <div className="flex-1 relative">
                                    <Input
                                        placeholder="your name"
                                        className="pl-[77px] pr-[8.5rem] lg:pr-[9rem] font-medium text-sm h-12 placeholder:font-medium placeholder:text-gray-500"
                                    />
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 font-semibold text-sm">abio.link/</span>
                                    <Button className='absolute right-1 top-1/2 text-sm -translate-y-1/2 w-[7.5rem] lg:w-34 h-10! lg:h-11! font-medium'>
                                        Create My Link
                                    </Button>
                                </div>
                            </div>
                            <p className="text-sm font-medium text-center lg:text-start">It&apos;s free. Your audience - your rules</p>

                            {/* <Image
                            src="/icons/text-blend.png"
                            alt="Text blend decoration"
                            width={300}
                            height={300}
                            className="z-10 pointer-events-non filter blur-xl absolute bg-clip-text opacity-70 right-0 top-5 size-[15rem]"
                        /> */}
                        </div>

                        <div className="relative flex justify-center lg:justify-start mt-8 lg:mt-10">
                            <div className="relative overflow-hidden w-full max-w-[350px] sm:max-w-[400px] size-[400px] lg:max-w-[600px] lg:size-[600px] mx-auto">
                                <Image
                                    src="/icons/hero-icon-1.svg"
                                    alt="Dotted background pattern"
                                    fill
                                    className="object-contain pointer-events-none"
                                    priority={true}
                                />

                                <Image
                                    src="/images/hero-image.svg"
                                    alt="A.bio mobile app interface"
                                    width={500}
                                    height={500}
                                    className="object-contain z-10 w-full h-full relative -top-5"
                                    priority={true}
                                    blurDataURL='/images/hero-image.svg pointer-events-none'
                                />
                            </div>

                            {/* Cloud decorations */}
                            <div className="hidden xl:flex rounded-full bg-gradient-to-r from-[#7140EB] to-[#FB8E8E] opacity-30 absolute -top-[7.5rem] md:-right-20 lg:-top-40 -right-10 lg:-right-5 z-20 size-[15rem] lg:size-[22rem] filter blur-3xl" />
                            <div className="absolute bg-transparent bg-blend-multiply -top-[7.5rem] md:right-[12rem] lg:-top-40 -right-10 lg:-right-5 size-[15rem] lg:size-[22rem] z-20">
                                <Image
                                    src="/icons/cloud.svg"
                                    alt="Cloud decoration"
                                    fill
                                    className="object-contain mix-blend-soft-light opacity-40 pointer-events-none"
                                    priority={true}
                                />
                            </div>

                            <div className="hidden xl:flex rounded-full bg-gradient-to-r from-[#7140EB] to-[#FB8E8E] opacity-30 absolute -bottom-10 lg:-bottom-10 -left-5 md:-left-5 size-[15rem] lg:size-[22rem] z-20 filter blur-3xl" />
                            <div className="absolute -bottom-10 lg:-bottom-16 -left-5 md:left-[12rem] lg:-left-10 xl:left-5 size-[15rem] lg:size-[22rem] z-20">
                                <Image
                                    src="/icons/cloud.svg"
                                    alt="Cloud decoration"
                                    fill
                                    className="object-contain mix-blend-soft-light opacity-40 pointer-events-none"
                                    priority={true}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default HeroSection