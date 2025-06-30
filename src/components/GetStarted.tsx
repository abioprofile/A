import React from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'

const GetStarted = ({ showBlur }: { showBlur?: boolean }) => {
    return (
        <section className='relative w-full overflow-x-clip'>
            <div className='my-10 md:my-20 px-6 md:px-10'>
                {showBlur && (
                    <div className="hidden md:block bg-gradient-to-r to-[#7140EB] from-[#FB8E8E] z-0 size-72 opacity-50 absolute -bottom-28 -left-20 filter blur-3xl" />
                )}
                <div className='md:px-20 md:w-[80%] md:mx-auto md:max-w-[844px] md:pt-20 md:pb-10 bg-[#E9E0FE] p-5 relative overflow-hidden'>
                    <div className="rounded-full bg-gradient-to-r from-[#7140EB] to-[#FB8E8E] z-0 size-52 opacity-50 absolute -top-5 -left-5 filter blur-[60px]" />
                    <div className='relative max-w-96 z-10 mix-blend-inherit'>
                        <h1 className='text-3xl md:text-4xl tracking-tighter font-bold text-[#7140EB] mb-3'>Get started with A.bio</h1>
                        <p className='text-[13px] font-semibold'>Loved by creators, influencers, artists, musicians, coaches, and entrepreneurs worldwide.</p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto lg:mx-0 mt-10">
                        <div className="flex-1 relative">
                            <Input placeholder="your name" className="pl-[77px] pr-[6.5rem] lg:pr-[9rem] font-medium text-sm h-12 placeholder:font-medium placeholder:text-gray-500 placeholder:text-sm!" />
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 font-semibold text-sm">abio.link/</span>
                            <Button className='absolute right-1 top-1/2 text-sm -translate-y-1/2 w-[6rem] lg:w-34 h-10! lg:h-11! font-medium'>
                                Get My Bio
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default GetStarted