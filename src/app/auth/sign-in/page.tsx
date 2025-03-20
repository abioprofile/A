"use client"

import { Input } from "@/components/ui/input"
import AuthLayout from "../../layouts/auth/AuthLayout"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { toast } from "sonner"

const SignIn = () => {
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        //TODO: handle form submission logic
        toast("Login", {
            description: `You have successfully logged into your account`,
        })
    }
    return (
        <AuthLayout
            heading="Welcome back!"
            paragraph="Login to your A account"
            imageAlt="sign in image"
            image="/assets/images/auth/sign-in.png"
        >
            <form onSubmit={handleSubmit} className="flex flex-col items-center space-y-3 w-full">
                <div className='space-y-3 w-full md:max-w-fit'>
                    <Input type='email' name='email' placeholder='Email' />
                    <Input type='password' name='password' placeholder='Password' />
                    <Link
                        href={'/auth/forgot-password'}
                        className='flex justify-end text-sm lg:text-[15px] hover:underline hover:text-[#7140EB] text-[#7D7D7D] font-semibold'>
                        Forgot Password?
                    </Link>
                </div>

                <Button variant="default" className='text-md lg:text-xl font-bold'>Login</Button>

                <div className='space-y-3 flex flex-col items-center w-full'>
                    <p className='text-[#9F9F9F] font-bold text-sm lg:text-md'>OR</p>
                    <Button variant="outline" className='text-md lg:text-xl font-bold flex items-center gap-2'>
                        <Image src={'/assets/icons/auth/google.svg'} alt='google icon' width={25} height={25} />
                        SignUp with Google
                    </Button>
                    <Button variant="outline" className='text-md lg:text-xl font-bold flex items-center gap-2'>
                        <Image src={'/assets/icons/auth/apple.svg'} alt='apple icon' width={25} height={25} />
                        SignUp with Apple
                    </Button>

                    <div className='flex gap-1 text-sm lg:text-[15px] font-semibold'>
                        <p className='text-[#7D7D7D]'>Don’t have an account?</p>
                        <Link href='/auth/sign-up' className='text-[#7140EB]'>SignUp</Link>
                    </div>
                </div>
            </form>
        </AuthLayout>

    )
}

export default SignIn
