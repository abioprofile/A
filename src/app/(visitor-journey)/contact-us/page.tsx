import GetStarted from '@/components/GetStarted'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import Image from 'next/image'
import React from 'react'

const ContactPage = () => {
    return (
        <main className='container mx-auto px-5'>
            <div className='mb-12 max-w-[50rem] mx-auto'>
                <h1 className='text-3xl lg:text-5xl font-extrabold text-center tracking-tight leading-snug'>Let us know how we can help.</h1>
                <p className='text-center text-lg font-semibold'>Whether you&apos;re curious about features, plans, or need support — just drop us a message and
                    we&apos;ll get back to you soon.
                </p>
            </div>
            <div className='grid gris-cols-1 md:grid-cols-2 rounded-[30px'>
                <div className='p-16 space-y-5 bg-[#E9E0FE] rounded-[30px lg:rounded-none lg:rounded-l-[30px flex flex-col justify-center'>
                    <div className='space-y-1'>
                        <h1 className='text-[#7140EB] capitalize text-3xl md:text-4xl font-bold'>Contact</h1>
                        <p className='text-base md:text-lg font-semibold md:max-w-96'>
                            Questions, feedback, or support we&apos;re just
                            a message away.
                        </p>
                    </div>

                    <form action="" className='space-y-4'>
                        <div className='flex gap-4'>
                            <Input placeholder='First Name' className='bg-white border-none placeholder:text-sm!' />
                            <Input placeholder='Last Name' className='bg-white border-none placeholder:text-sm!' />
                        </div>
                        <Input className='w-full! bg-white border-none placeholder:text-sm!' placeholder='Email' />
                        <Input className='w-full! bg-white border-none placeholder:text-sm!' placeholder='Subject' />
                        <Textarea className='w-full! [field-sizing:initial]! bg-white border-none placeholder:text-sm!' placeholder='Message' rows={5} />
                        <div className='text-left'>
                            <Button
                                type='submit'
                                className='w-28 font-semibold h-10!'>
                                Submit
                            </Button>
                        </div>
                    </form>
                </div>
                <div className="relative w-full h-auto flex">
                    <div className="relative w-full h-full flex-1">
                        <Image
                            src="/images/contact-us-image.svg"
                            alt="contact us image"
                            fill
                            className="object-cover rounded-r-[30px"
                            priority={true}
                        />
                    </div>
                </div>
            </div>
            <GetStarted />
        </main>
    )
}

export default ContactPage