import React from 'react'
import { Input } from '../ui/input'
import Image from 'next/image'

const DashboardTopNav = () => {
    return (
        <div className='hidden md:flex justify-between items-center px-8 py-2 border-l'>
            <h1 className='text-2xl font-bold w-full flex-1'>A.Bio Links</h1>
            <div className='relative flex-1'>
                <Input
                    placeholder='Search..'
                    className='max-h-10 !w-full !max-w-full lg:placeholder:text-sm text-sm !px-9 rounded-[10px] ring-0 focus:ring-0 border border-gray-400 focus-visible:border-none focus-visible:ring-0'
                />
                <Image
                    src="/assets/icons/dashboard/search.svg"
                    alt="Search"
                    width={16}
                    height={16}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2"
                />
            </div>
        </div>
    )
}

export default DashboardTopNav
