import React from 'react'
import { Button } from './ui/button'
import Image from 'next/image'

const CustomNfcCardSection = () => {
    return (
        <section className="mb-5 lg:mb-10 container mx-auto px-6 md:px-10 lg:px-0">
            <div className="mx-auto lg:max-w-[70%]">
                <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
                    <Image src={"/icons/custom-cards.svg"} alt="custom NFC card icons" width={500} height={500} />

                    <div className="space-y-6">
                        <div className="space-y-2">
                            <h4 className="text-[#7140EB] uppercase font-bold">
                                MAKE YOUR FIRST IMPRESSION COUNT
                            </h4>
                            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                                Custom A.bio
                                <br />
                                NFC Card
                            </h2>
                            <p className="text-[15px] font-semibold">
                                Personalize your NFC card with your name, logo, and brand style. One tap shares your A.bio, no app
                                needed.
                            </p>
                            <p className="font-semibold">One card. Endless connections.</p>
                        </div>
                        <Button className='w-36 font-semibold h-10!'>
                            Create Yours Now
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default CustomNfcCardSection