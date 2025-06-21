"use client"
import { Input } from '@/components/ui/input';
import Image from 'next/image'
import React, { useState } from 'react'

const ShopPage = () => {
    const [showSearch, setShowSearch] = useState(false);
    return (
        <main className='px-6 md:px-20'>
            <div className='flex justify-between items-center mb-5'>
                <h1 className='text-3xl lg:text-5xl font-extrabold text-center tracking-tight leading-snug capitalize'>All Products</h1>
                <div className='flex gap-4'>
                    <div className="relative flex items-center">
                        <Input
                            onBlur={() => setShowSearch(false)}
                            type="text"
                            placeholder="Search..."
                            className={`pl-3 pr-10 py-1 rounded-[8px] transition-all duration-300 ease-in-out ${showSearch ? "w-[130px] opacity-100" : "w-0 opacity-0"}`}
                        />

                        <button
                            onClick={() => setShowSearch((prev) => !prev)}
                            className="absolute right-2 text-gray-400"
                        >
                            <Image
                                src={"/icons/search.svg"}
                                priority
                                alt='search icon'
                                width={20}
                                height={20}
                                className='cursor-pointer'
                            />
                        </button>
                    </div>
                    <Image src={"/icons/cart.svg"} priority alt='cart icon' width={20} height={20} className='cursor-pointer' />
                </div>
            </div>

            <div className='grid grid-cols-2 gap-10 lg:gap-40 items-center mb-8'>
                <div className='space-y-3'>
                    <Image src={"/icons/store-card-1.svg"} priority alt='search icon' width={550} height={550} className='cursor-pointer' />
                    <div className='space-y-2 flex flex-col items-center lg:px-20'>
                        <h3 className='text-base lg:text-xl font-semibold'>Ap Card 5</h3>
                        <h3 className='text-[#A097B5] text-base lg:text-xl font-semibold'>N35,000</h3>
                    </div>
                </div>

                <div className='space-y-3'>
                    <Image src={"/icons/store-card-2.svg"} priority alt='search icon' width={550} height={550} className='cursor-pointer' />
                    <div className='space-y-2 flex flex-col items-center lg:px-20'>
                        <h3 className='text-base lg:text-xl font-semibold'>Ap Card 5+ Custom</h3>
                        <h3 className='text-[#A097B5] text-base lg:text-xl font-semibold'>N50,000</h3>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default ShopPage