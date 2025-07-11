import Link from "next/link";
import { Button } from "./ui/button";
import Image from "next/image";

const DetailedAnalytics = () => {
    return (
        <section className="mb-16 lg:mb-20 container mx-auto px-6 md:px-10 lg:px-0">
            <div className="mx-auto lg:max-w-[70%]">
                <div className="grid lg:grid-cols-2 lg:gap-16 items-center">
                    <Image src={"/icons/social-analytics.svg"} alt="social analytics icon" width={400} height={400} priority={true} />

                    <div className="space-y-6">
                        <div className="space-y-4">
                            <h4 className="text-[#7140EB] uppercase font-bold">
                                INSIGHT FROM AUDIENCE
                            </h4>
                            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                                Get detailed social Analytics
                            </h2>
                            <p className="text-[15px] font-semibold">
                                See who clicks and views your A.bio, when and where they visit, so you can get sharper and gro
                            </p>
                        </div>

                        <Button asChild className='w-28 font-semibold h-10!'>
                            <Link href="/auth/sign-up">Sign Up</Link>
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default DetailedAnalytics