"use client"
import Footer from '@/components/Footer';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Image from 'next/image'
import React, { useState } from 'react'

const Store = () => {
  const [showSearch, setShowSearch] = useState(false);

  return (
    <main className='pt-34 bg-[#FEF4EA]'>
      <div className='px-4 md:px-10'>
        {/* Header */}
        <div className='flex justify-between items-center mb-5'>
          <h1 className='text-xl md:text-3xl font-extrabold text-center tracking-tight leading-snug capitalize'>
            All Products
          </h1>
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
        
          <div className='flex flex-col sm:flex-col items-center sm:items-center gap-3'>
            {/* On mobile: row layout */}
            <div className='flex flex-row sm:flex-col items-center gap-4 w-full justify-center'>
              <Image src={"/icons/store-card-1.svg"} priority={true} alt='Ap card 5 image' width={200} height={200} className='cursor-pointer sm:w-[350px] sm:h-[350px]' />
              
            <div className='flex flex-col space-y-3 items-start sm:items-center'>
                <h3 className='text-[13px] lg:text-xl font-bold'>Ap Card 5</h3>
                <p className='text-[12px] font-thin'>The last business card you’ll ever need.</p>
                <h3 className='text-[#331400] text-[14px] lg:text-xl font-semibold'>From N35,000</h3>
                <Button className="bg-[#FED45C] text-[#331400] px-2 md:px-4 py-2 font-semibold mt-2 sm:hidden">
                  Explore More
                </Button>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className='flex flex-col sm:flex-col items-center sm:items-center gap-3'>
            <div className='flex flex-row sm:flex-col items-center gap-4 w-full justify-center'>
              <Image src={"/icons/store-card-2.svg"} priority={true} alt='Ap card 5+ image' width={200} height={200} className='cursor-pointer sm:w-[350px] sm:h-[350px]' />
              
              <div className='flex flex-col space-y-3 items-start sm:items-center'>
                <h3 className='text-[13px] lg:text-xl font-bold'>Ap Card 5+ Custom</h3>
                <p className='text-[12px] font-thin'>The last business card you’ll ever need.</p>
                <h3 className='text-[#331400] text-[14px] lg:text-xl font-semibold'>From N50,000</h3>
                <Button className="bg-[#FED45C] text-[#331400] px-2 md:px-4 py-2 font-semibold mt-2 sm:hidden">
                  Explore More
                </Button>
              </div>
            </div>
          </div>

        </div>
      </div>
      <Footer />
    </main>
  )
}

export default Store
