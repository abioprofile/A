import { Card } from '@/components/ui/card'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const ShopPage = () => {
    return (
        <main className=''>
            <section className='flex justify-between items-center gap-20 pt-10 pl-6 md:pl-20 bg-[#F3F0EB]'>
                <div className='mb-16 space-y-4'>
                    <h1 className='text-3xl lg:text-5xl font-extrabold'>Shop</h1>
                    <div className='flex gap-2'>
                        <Link href={"/"} className='hover:underline font-medium'>Home</Link>
                        <span>{">"}</span>
                        <Link href={"/shop"} className='hover:underline text-[#00000080] font-medium'>Shop</Link>
                    </div>
                </div>
                <Image src={"/images/shop-hero.svg"} priority alt='' width={500} height={500} className='flex-1' />
            </section>
            <section className='container px-6 mx-auto'>
                <Card>

                </Card>
            </section>
        </main>
    )
}

export default ShopPage