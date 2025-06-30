import React from 'react'
import { Button } from './ui/button'
import Image from 'next/image'

const ManageYourLinks = () => {
    return (
        <section className="mb-10 lg:mb-20 container px-6 md:px-10 lg:px-0 mx-auto overflow-visible">
            <div className="mx-auto lg:max-w-[70%]">
                <div className="grid lg:grid-cols-[1.2fr_1fr] gap-8 lg:gap-16 items-center">
                    <div className="relative space-y-3">
                        <Image
                            src={"/icons/lpl-1.svg"}
                            alt="custom link icon"
                            width={350}
                            height={350}
                            className='w-[75%]'
                        />
                        <div className='flex justify-end'>
                            <Image
                                src={"/icons/lpl-2.svg"}
                                alt="custom link icon"
                                width={350}
                                height={350}
                                className='w-[75%]'
                            />
                        </div>
                        <Image
                            src={"/icons/lpl-3.svg"}
                            alt="custom link icon"
                            width={350}
                            height={350}
                            className='w-[75%]'
                        />
                        <div className='flex justify-end'>
                            <Image
                                src={"/icons/lpl-4.svg"}
                                alt="custom link icon"
                                width={350}
                                height={350}
                                className='w-[75%]'
                            />
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-2">
                            <h4 className="text-[#7140EB] uppercase font-bold">
                                HANDLE LINKS WITH EASE
                            </h4>
                            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                                Manage your links
                                <br />
                                as you wish
                            </h2>
                            <p className="text-[15px] font-semibold">
                                Organize, prioritize, and update links anytime to guide your audience exactly where you want them.
                            </p>
                        </div>

                        <Button className='w-28 font-semibold h-10!'>
                            Sign Up
                        </Button>
                    </div>
                </div>
            </div>
        </section >
    )
}

export default ManageYourLinks