import { Mail, MapPinIcon, Phone } from 'lucide-react'
import React from 'react'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import Link from 'next/link'
import { Button } from './ui/button'

const ContactUs = () => {
    return (
        <section className='relative overflow-x-clip'>
            <div className="hidden md:flex rounded-full bg-gradient-to-r to-[#7140EB] from-[#FB8E8E] z-0 size-72 opacity-50 absolute -top-28 -right-40 filter blur-2xl" />
            <div className='grid grid-cols-1 md:grid-cols-2 md:items-center gap-10 container mx-auto px-6  md:px-10 lg:px-0 mb-10'>
                <div className='bg-[#E9E0FE] flex flex-col space-y-7 px-10 py-20'>
                    <h1 className='text-[#7140EB] capitalize text-3xl md:text-4xl font-bold tracking-tighter'>Contact Us</h1>
                    <Link href='mailto:abioprofile@gmail.com' className='flex items-center gap-1 hover:underline text-[#7140EB] font-semibold'>
                        <Mail className='size-5' />
                        <span className='text-[13px]'>abioprofile@gmail.com</span>
                    </Link>
                    <div className='flex items-center gap-1 text-[#7140EB] font-semibold'>
                        <MapPinIcon className='size-5' />
                        <span className='text-[13px]'>Lagos, Nigeria</span>
                    </div>
                    <Link href='tel:+2348163746282' className='flex items-center gap-1 hover:underline md:mb-20 text-[#7140EB] font-semibold'>
                        <Phone className='size-5' />
                        <span className='text-[13px]'>+234 816 374 6282</span>
                    </Link>
                </div>
                <div className='space-y-5'>
                    <div className='space-y-1'>
                        <h1 className='text-[#7140EB] capitalize text-3xl md:text-4xl font-bold tracking-tight'>Get in Touch with us</h1>
                        <p className='uppercase text-[#7140EB] text-[16px] md:text-xl tracking-wider font-semibold'>AND WE WILL GET BACK TO YOU</p>
                        <div className='w-[83px] h-[3px] bg-[#7140EB]' />
                    </div>
                    <form action="" className='space-y-4'>
                        <div className='flex gap-4'>
                            <Input placeholder='First Name' />
                            <Input placeholder='Last Name' />
                        </div>
                        <Input className='w-full!' placeholder='Email' />
                        <Input className='w-full!' placeholder='Subject' />
                        <Textarea className='w-full! [field-sizing:initial]!' placeholder='Message' rows={5} />
                        <div className='text-right'>
                            <Button
                                type='submit'
                                className='w-28 font-semibold h-10!'>
                                Submit
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    )
}

export default ContactUs