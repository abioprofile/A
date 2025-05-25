"use client"

import Logo from '@/components/shared/Logo';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { offers } from '@/data';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React from 'react'

const OffersPage = () => {
    const router = useRouter()
    const actions: { [key: string]: () => void } = {
        handleButton1: () => {
            router.push("/dashboard")
        },
        handleButton2: () => {

        },
        handleButton3: () => {

        }
    }
    return (
        <main className="min-h-screen container flex flex-col mx-auto py-20 relative">
            <Logo className='fixed md:absolute top-5 md:top-10 left-5 md:left-10' />
            <div className="max-w-2xl mx-auto mb-10 md:mb-14 flex justify-center items-center flex-col">
                <h1 className="text-3xl lg:text-4xl font-bold mb-2 bg-gradient-to-r from-[#7140EB] to-[#FB8E8E] text-transparent bg-clip-text">
                    Find the Plan  for You
                </h1>
                <p className="text-[#666464] font-semibold px-16 text-center">
                    Flexible Pricing options tailored to meet your business needs. Explore our
                    transparent plans and find the perfect fit for your project.
                </p>
            </div>

            <div className='md:flex items-center md:gap-10 space-y-5 md:-space-y-0 mx-auto'>
                {offers.map((offer, index) => (
                    <Card key={index} className={`flex flex-col items-center justify-center rounded-[30px] py-10 px-0 text-white w-[85%] mx-auto md:w-[300px] ${index === 1 ? "p-1 border- h-[720px] md:h-[800px] py-0 pt-10 border-[#7140EB bg-gradient-to-r from-[#7140EB] to-[#FB8E8E]" : "h-[600px] bg-gradient-to-b from-[#7140EB] to-[#FB8E8E]"}`}>
                        <div className='flex flex-col space-y-3 w-full rounded-t-[28px] justify-center items-center'>
                            <div className="shadow-md shadow-black drop-shadow-md rounded-full w-20 max-w-28 py-0 flex justify-center text-center font-medium text-xs">{offer.type}</div>
                            <CardHeader className='w-full flex flex-col space-y-0'>
                                <CardTitle className='flex justify-center text-center w-full font-semibold text-2xl p-0 m-0'>{offer.plan}</CardTitle>
                                <CardDescription className='flex justify-center text-center text-xs w-full text-white font-medium'>{offer.description}</CardDescription>
                            </CardHeader>
                        </div>
                        <div className="bg-white w-[85%]">
                            {index !== 1 ? <Separator /> : null}
                        </div>
                        <CardContent className={`flex flex-col justify-between items-center rounded-b-[28px] w-full h-full ${index === 1 ? "bg-white text-[#7140EB]" : "bg-transparent text-white"}`}>
                            <div className={`space-y-3 ${index === 1 && "mt-7"}`}>
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
                            <Button onClick={actions[offer.action]} className={`rounded-full text-xs w-24 max-w-28 shadow-3xl p-0 max-h-7 font-semibold ${index === 0 ? "bg-white hover:bg-gray-100 text-[#7140EB]" : index === 2 ? "bg-white hover:bg-gray-100 text-[#7140EB]" : "text-white mb-5"}`}>Get started</Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </main>
    )
}

export default OffersPage
