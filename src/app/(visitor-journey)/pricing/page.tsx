"use client"
import { Button } from '@/components/ui/button'
import { CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { offers } from '@/data'
import Image from 'next/image'
import React from 'react'

const PricingPage = () => {
    //py-0 pt-10 
    return (
        <main className="min-h-screen container flex flex-col mx-auto relative mb-20">
            <div className="mx-auto gap-5 mb-10 md:mb-8 flex justify-center items-center flex-col">
                <h1 className="text-3xl lg:text-5xl text-center font-extrabold">
                    One plan, endless possibilities.
                </h1>
                <p className="font-semibold px-16 text-center text-lg">
                    Powerful features. Simple choice. Freedom included.
                </p>
            </div>

            <div className='flex gap-x-5 mx-aut overflow-x-auto no-scrollbar px-6'>
                {offers.map((offer, index) => (
                    <div key={index} className={`flex-shrink-0 flex flex-col items-center justify-center rounded-none p-0 text-white w-[90%] mx-auto h-[650px] md:w-[350px] ${index === 1 ? "p-1 bg-gradient-to-r from-[#7140EB] to-[#FB8E8E]" : "bg-gradient-to-b from-[#7140EB] to-[#FB8E8E]"}`}>
                        <div className='h-56 w-full mx-auto'>
                            <div className='flex flex-col space-y-3 w-full h-full justify-center items-center'>
                                <div className="shadow-md shadow-black drop-shadow-md rounded-full w-20 max-w-28 py-0 flex justify-center text-center font-medium text-xs">{offer.type}</div>
                                <CardHeader className='w-full flex flex-col space-y-0 py-0'>
                                    <CardTitle className='flex justify-center text-center w-full font-semibold text-2xl p-0 m-0'>{offer.plan}</CardTitle>
                                    <CardDescription className='flex justify-center text-center text-xs w-full text-white font-medium'>{offer.description}</CardDescription>
                                </CardHeader>
                            </div>
                        </div>
                        <div className="bg-white w-[85%] py-0">
                            {index !== 1 ? <Separator className='py-0' /> : null}
                        </div>
                        <div className={`p-5 flex flex-col justify-between items-center w-full h-full ${index === 1 ? "bg-white text-[#7140EB]" : "bg-transparent text-white"}`}>
                            <div className={`space-y-1.5`}>
                                {offer.benefits.map((item, i) => (
                                    <div key={i} className='flex gap-2 items-center'>
                                        {index === 1 ? (
                                            <Image
                                                src={'/assets/icons/dashboard/blue-check.svg'}
                                                alt='check icon'
                                                width={15}
                                                height={15}
                                                priority
                                            />
                                        ) : (
                                            <Image
                                                src={'/assets/icons/dashboard/white-check.svg'}
                                                alt='check icon'
                                                width={15}
                                                height={15}
                                                priority
                                            />
                                        )}
                                        <p className='text-xs font-semibold'>{item}</p>
                                    </div>
                                ))}
                            </div>
                            <Button onClick={() => { }} className={`text-xs w-24 max-w-28 shadow-3xl p-0 max-h-7 font-semibold ${index === 0 ? "bg-white hover:bg-gray-100 text-[#7140EB]" : index === 2 ? "bg-white hover:bg-gray-100 text-[#7140EB]" : "text-white mb-"}`}>Get started</Button>
                        </div>
                    </div>
                ))}
            </div>
        </main>
    )
}

export default PricingPage