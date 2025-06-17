import { testimonials } from '@/data'
import React from 'react'
import { Card } from './ui/card'
import Image from 'next/image'

const Testimonials = () => {
    return (
        <div className='mt-20 container mx-auto px-5'>
            <div className='space-y-1 text-center mb-10'>
                <h6 className='uppercase text-[#7140EB] text-xl font-bold tracking-tight'>share it anywhere</h6>
                <h1 className='text-3xl md:text-4xl font-bold tracking-tighter'>
                    Trusted by some of the best in the business
                </h1>
                <p className='text-xl font-semibold tracking-tight mt-5'>Join 20,000+ creators from around the world.</p>
            </div>
            <div className='grid gris-cols-2 md:grid-cols-2 xl:grid-cols-4 gap-5'>
                {testimonials.map((testimonial, index) => (
                    <Card key={index} className='px-7 py-10 border border-[#9F9F9F] rounded-[50px]'>
                        <Image src={"/stars.png"} alt='stars' width={150} height={150} className="" />
                        <p className='text-md font-bold'>{testimonial.quote}</p>
                        <div className='flex gap-3 items-center ml-5 mt-auto'>
                            <Image src={testimonial.image} alt='avatar image' width={60} height={60} className="rounded-full object-cover" />
                            <div className='-space-y-1'>
                                <p className='text-md font-bold'>{testimonial.name}</p>
                                <p className='text-[13px] text-nowrap'>{testimonial.role}</p>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    )
}

export default Testimonials