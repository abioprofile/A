import Image from 'next/image'
import React from 'react'

const FeaturesForYou = () => {
    return (
        <section className='w-full relative overflow-x-clip mb-16'>
            <div className='mb-10 lg:mb-20 px-6 md:px-10 lg:px-0 container mx-auto'>
                <div className='bg-[#E9E0FE] rounded-[50px] px-5 py-10 lg:p-10 lg:mx-5 z-40 relative'>
                    <h4 className='text-[#7140EB] font-bold text-center lg:mt-10 uppercase'>MAKE IT EASY</h4>
                    <div className='space-y-2 mb-10 lg:mb-16'>
                        <h3 className='text-3xl md:text-4xl font-bold tracking-tighter text-center'>Features <br className='lg:hidden' />designed for you</h3>
                        <p className='text-[15px] text-center font-medium'>Combine everything in on link: Shop here, showcase your links <br />
                            and flex it all in.
                        </p>
                    </div>

                    <div className='grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-20'>
                        <div className='bg-[#F5F1FF] p-10 rounded-[50px] flex flex-col justify-center items-center py-10 space-y-3 aspect-[1/1]'>
                            <div className='p-5 bg-[#B698FF] rounded-full'>
                                <Image src={"/icons/archieve.svg"} alt='' width={50} height={50} className='size-7' />
                            </div>
                            <div className='text-center mt-2 space-y-2'>
                                <h1 className='font-bold text-xl'>Create</h1>
                                <p className='text-xs font-semibold text-center'>Customize your unique A.bio pageand
                                    showcase your brand exactly
                                    how you want it.
                                </p>
                            </div>
                        </div>
                        <div className='bg-[#F5F1FF] p-10 rounded-[50px] flex flex-col justify-center items-center py-10 space-y-3 aspect-[1/1]'>
                            <div className='p-5 bg-[#B698FF] rounded-full'>
                                <Image src={"/icons/cpu.svg"} alt='' width={50} height={50} className='size-7' />
                            </div>
                            <div className='text-center mt-2 space-y-2'>
                                <h1 className='font-bold text-xl'>Integrate</h1>
                                <p className='text-xs font-semibold text-center'>Connect all your favorite platforms - from
                                    youtube to Tiktok, instagram
                                    x, snapchat and more....
                                </p>
                            </div>
                        </div>
                        <div className='bg-[#F5F1FF] p-10 rounded-[50px] flex flex-col justify-center items-center py-10 space-y-3 aspect-[1/1]'>
                            <div className='p-5 bg-[#B698FF] rounded-full'>
                                <Image src={"/icons/share.svg"} alt='' width={50} height={50} className='size-7' />
                            </div>
                            <div className='text-center mt-2 space-y-2'>
                                <h1 className='font-bold text-xl'>Share</h1>
                                <p className='text-xs font-semibold text-center'>Promote your A.bio Link everywhere
                                    and track the impact with real-time
                                    performance tools.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='z-0 bg-[#B698FF] rounded-b-[50px] h-3 lg:h-5 w-[80%] mx-auto -mt-1' />
            </div>
            <div className="rounded-full bg-gradient-to-r from-[#7140EB] to-[#FB8E8E] z-0 size-72 opacity-50 absolute -top-5 -left-44 filter blur-2xl" />
            <div className="rounded-full bg-gradient-to-r from-[#FB8E8E] to-[#7140EB] z-0 size-32 opacity-50 absolute top-[40%] -right-20 filter blur-2xl" />
        </section>
    )
}

export default FeaturesForYou