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
        <div className='flex flex-col gap-10 md:gap-14 md:justify-center items-center h-[100dvh] relative py-20'>
            <Logo className='fixed md:absolute top-5 md:top-10 left-5 md:left-10' />
            <div className='md:max-w-[40rem] space-y-5 px-10'>
                <h1 className="text-[#7140EB] text-center xs:test-xl text-2xl font-black leading-[100%] tracking-[0]">Flexible Plans</h1>
                <p className='text-[#7140EB] text-sm lg:text-lg text-center'>Flexible Pricing options tailored to meet your business needs. Explore our
                    transparent plans and find the perfect fit for your project.</p>
            </div>
            <div className='md:flex items-center md:gap-10 space-y-5 md:-space-y-0'>
                {offers.map((offer, index) => (
                    <Card key={index} className={`flex flex-col items-center justify-center rounded-[30px] py-10 px-0 text-white border-4 border-[#7140EB] bg-[#7140EB] w-[300px] ${index === 1 ? "h-[500px] md:h-[550px] py-0 pt-10" : "h-[500px]"}`}>
                        <div className='flex flex-col space-y-3 w-full rounded-t-[28px] justify-center items-center'>
                            <div className="shadow-md shadow-black drop-shadow-md rounded-full w-20 max-w-28 py-0 flex justify-center text-center text-xs">{offer.type}</div>
                            <CardHeader className='w-full flex flex-col space-y-0'>
                                <CardTitle className='flex justify-center text-center w-full text-2xl p-0 m-0'>{offer.plan}</CardTitle>
                                <CardDescription className='flex justify-center text-center text-xs w-full text-white'>{offer.description}</CardDescription>
                            </CardHeader>
                        </div>
                        <div className="bg-white w-[85%]">
                            {index !== 1 ? <Separator /> : null}
                        </div>
                        <CardContent className={`flex flex-col gap-20 items-center rounded-b-[28px] w-full h-full ${index === 1 ? "bg-white text-[#7140EB]" : "bg-[#7140EB] text-white"}`}>
                            <div className={`space-y-3 ${index === 1 && "mt-7"}`}>
                                {offer.benefits.map((item, i) => (
                                    <div key={i} className='flex gap-2 items-center justify-center'>
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
                                        <p className='text-xs'>{item}</p>
                                    </div>
                                ))}
                            </div>
                            <Button onClick={actions[offer.action]} className={`rounded-full text-xs w-20 max-w-28 shadow-3xl p-0 max-h-7 ${index === 1 ? "bg-[#7140EB] hover:bg-[] text-white" : "bg-white hover:bg-gray-1100 text-[#7140EB]"}`}>Get started</Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}

export default OffersPage
