import React from 'react'
import { Button } from './ui/button'
import Link from 'next/link'

const GetStarted = () => {
    return (
        <section className='relative w-full my-10 md:my-20 px-5'>
            <div className='md:px-20 md:w-[80%] md:mx-auto md:max-w-[844px] md:pt-20 md:pb-10 bg-[#E9E0FE] rounded-[30px] p-5'>
                <div
                    className="hidden absolute top-0 left-0 size-28 rounded-tl-[30px]"
                    style={{
                        background: 'linear-gradient(to right, #7140EB, #FB8E8E)',
                        filter: 'blur(40px)',
                        zIndex: 0,
                        transform: 'translate(10px, 10px)',
                    }}
                />
                <div className='relative max-w-96 z-10'>
                    <h1 className='text-2xl md:text-4xl font-bold text-[#7140EB] mb-3 tracking-tighter'>Get started with A.bio</h1>
                    <p className='text-[16px] font-semibold'>Loved by creators, influencers, artists, musicians, coaches, and entrepreneurs worldwide.</p>
                </div>
                <div className='text-right mt-10'>
                    <Link passHref href='/auth/sign-up'>
                        <Button
                            className='rounded-full w-28 font-semibold h-10!'>
                            Sign Up
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    )
}

export default GetStarted