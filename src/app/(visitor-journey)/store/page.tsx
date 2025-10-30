"use client"
import Footer from '@/components/Footer';
import { Input } from '@/components/ui/input';
import Image from 'next/image'
import React, { useState } from 'react'

const Store = () => {
  const [showSearch, setShowSearch] = useState(false);
  return (
    <main className='pt-34 bg-[#FEF4EA]'>
      <div className='px-6 sm:px-10'>
        {/* Header */}
        <div className='flex justify-between items-center mb-5'>
          <h1 className='text-xl md:text-3xl font-extrabold text-center tracking-tight leading-snug capitalize'>All Products</h1>
          <div className='flex gap-4'>
            <div className="relative flex items-center">
              <Input
                onBlur={() => setShowSearch(false)}
                type="text"
                placeholder="Search..."
                className={`pl-3 pr-10 py-1 transition-all duration-300 ease-in-out ${showSearch ? "w-[130px] opacity-100" : "w-0 opacity-0"}`}
              />
              <button
                onClick={() => setShowSearch((prev) => !prev)}
                className="absolute right-2 text-gray-400"
              >
                <Image
                  src={"/icons/search.svg"}
                  priority={true}
                  alt='search icon'
                  width={18}
                  height={18}
                  className='cursor-pointer'
                />
              </button>
            </div>
            <Image src={"/icons/cart.svg"} priority={true} alt='cart icon' width={18} height={18} className='cursor-pointer' />
          </div>
        </div>

        {/* Store Grid */}
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-10 lg:gap-40 items-center mb-8'>
          {/* Card 1 */}
          <div className='space-y-3 flex flex-col items-center'>
            <Image src={"/icons/store-card-1.svg"} priority={true} alt='Ap card 5 image' width={350} height={350} className='cursor-pointer' />
            <div className='space-y-2 flex flex-col items-center lg:px-20'>
              <h3 className='text-base lg:text-xl font-semibold'>Ap Card 5</h3>
              <h3 className='text-[#A097B5] text-base lg:text-xl font-semibold'>N35,000</h3>
            </div>
            {/* Mobile-only button */}
            <button className="sm:hidden bg-[#FED45C] text-[#ffffff] px-4 py-2 rounded-md font-semibold mt-2 shadow-md">
              Explore More
            </button>
          </div>

          {/* Card 2 */}
          <div className='space-y-3 flex flex-col items-center'>
            <Image src={"/icons/store-card-2.svg"} priority={true} alt='Ap card 5+ image' width={350} height={350} className='cursor-pointer' />
            <div className='space-y-2 flex flex-col items-center lg:px-20'>
              <h3 className='text-base lg:text-xl font-semibold'>Ap Card 5+ Custom</h3>
              <h3 className='text-[#A097B5] text-base lg:text-xl font-semibold'>N50,000</h3>
            </div>
            {/* Mobile-only button */}
            <button className="sm:hidden bg-[#331400] text-[#ffffff] px-4 py-2 font-semibold mt-2 shadow-md">
              Explore More
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}

export default Store