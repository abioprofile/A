import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const Logo = () => {
    return (
        <Link href='/' className='cursor-pointer'>
            <Image src={'/assets/icons/logo.svg'} alt='' width={50} height={50} />
        </Link>
    )
}

export default Logo
