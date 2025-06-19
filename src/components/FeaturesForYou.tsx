import Image from 'next/image'
import React from 'react'

const FeaturesForYou = () => {
    return (
        <section className='mb-10 lg:mb-20 container mx-auto'>
            <div className='bg-[#E9E0FE] rounded-[50px] p-5 lg:p-10 lg:mx-5 z-50 relative'>
                <h4 className='text-[#7140EB] font-bold text-center lg:mt-10'>MAKE IT EASY</h4>
                <div className='space-y-2 mb-10 lg:mb-16'>
                    <h3 className='text-center font-bold text-xl lg:text-2xl'>Features designed for you</h3>
                    <p className='text-center font-medium'>Combine everything in on link: Shop here, showcase your links <br />
                        and flex it all in.
                    </p>
                </div>

                <div className='grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-20'>
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
        </section>
    )
}

export default FeaturesForYou