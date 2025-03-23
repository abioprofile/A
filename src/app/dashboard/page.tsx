import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const DashboardPage = () => {
    return (
        <div className='flex flex-col flex-1 h-[calc(100vh-60px)] items-center w-full bg-[#F8F9FB]'>
            <div className='relative flex flex-col items-center'>
                <Image
                    src="/assets/icons/dashboard/cover.svg"
                    alt="Cover image"
                    width={100}
                    height={100}
                    className='w-full object-cover'
                />
                <div className='p-5 absolute top-[10rem] bg-white h-[161px] w-[80%] border border-[#9F9F9F99] flex justify-center rounded-[10px] gap-5'>
                    <div className='w-full flex gap-5'>
                        <Image
                            src="/assets/icons/dashboard/profile.svg"
                            alt="Profile image"
                            width={50}
                            height={50}
                            className='relative aspect-squar size-44 -top-14'
                        />
                        <div className='flex flex-col space-y-5'>
                            <div className='rounded-[15px] text-[#666464] bg-[#DFDCDC] max-w-fit px-3 py-0.5 font-semibold text-sm flex gap-1 items-center'>
                                <Image
                                    src="/assets/icons/dashboard/nigeria-flag.svg"
                                    alt="Profile image"
                                    width={15}
                                    height={15}
                                />
                                <span>Nigeria</span>
                            </div>
                            <div>
                                <h1 className='font-bold'>Faruk Saint</h1>
                                <p className='text-[#666464] text-xs font-semibold'>Creative Director /  Cinematographer</p>
                            </div>
                        </div>
                    </div>
                    <Separator orientation='vertical' />
                    <div className='w-full space-y-3 flex flex-col justify-center'>
                        <div className='flex items-center justify-between'>
                            <h1 className='font-bold text-2xl'>A.Bio Link</h1>
                            <Link href="" className='flex gap-1 items-center text-[#7140EB]'>
                                <span className='text-lg font-bold'>A.Bio Link</span>
                                <Image
                                    src="/assets/icons/dashboard/arrow-right.svg"
                                    alt="Right arrow"
                                    width={20}
                                    height={20}
                                />
                            </Link>
                        </div>
                        <div className='flex gap-5 items-center justify-center'>
                            <div className='relative flex-1'>
                                <Input
                                    placeholder=''
                                    value={"https://A.Bio/faruksaint"}
                                    disabled
                                    className='max-h-10 !w-full !max-w-full lg:placeholder:text-sm text-sm !px-10 rounded-[10px] ring-0 focus:ring-0 font-semibold border border-gray-400 focus-visible:border-none focus-visible:ring-0'
                                />
                                <Image
                                    src="/assets/icons/dashboard/link-icon.svg"
                                    alt="Link icon"
                                    width={16}
                                    height={16}
                                    className="absolute left-4 top-1/2 transform -translate-y-1/2"
                                />
                            </div>
                            <Button className='flex gap-2 items-center flex-1 rounded-[10px] max-h-10 max-w-[159px]'>
                                <Image
                                    src="/assets/icons/dashboard/share-icon.svg"
                                    alt="Share icon"
                                    width={16}
                                    height={16}
                                />
                                <span>Share Url</span>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DashboardPage
