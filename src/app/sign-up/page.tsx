import { Input } from "@/components/ui/input"
import AuthLayout from "../layouts/AuthLayout"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"

const SignUp = () => {
    return (
        <AuthLayout
            heading="Join Us!"
            paragraph="Signup here and join our users"
            imageAlt="sign up image"
            image="/assets/images/auth/sign-up.png"
        >
            <form action="" className="flex flex-col items-center space-y-3 w-full">
                <Input type='email' name='email' placeholder='Email' />
                <Input type='password' name='password' placeholder='Password' />

                <Button variant="default" className='tex-md lg:text-xl font-bold'>Create Account</Button>

                <p className='text-[14px] text-center px-5 lg:px-20 font-semibold'>
                    By clicking
                    <Link href="/sign-up" className='text-[#7140EB] underline mx-1'>Create Account</Link>, you agree to Privacy Notice
                    <Link href="/privacy-policy" className='text-[#7140EB] underline mx-1'>Privacy Notice</Link>,
                    <Link href="/terms" className='underline mx-1'>T&Cs</Link>, and to receive offers, news, and updates.
                </p>
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
                        <p className='text-[#7D7D7D]'>Already have an account?</p>
                        <Link href='/sign-in' className='text-[#7140EB]'>SignIn</Link>
                    </div>
                </div>
            </form>
        </AuthLayout>

    )
}

export default SignUp
