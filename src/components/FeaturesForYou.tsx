import Image from 'next/image'
import React from 'react'
import { motion } from 'framer-motion'

const featureCards = [
  {
    icon: "/icons/archieve.svg",
    title: "Create",
    desc: "Customize your unique A.bio page and showcase your brand exactly how you want it.",
  },
  {
    icon: "/icons/cpu.svg",
    title: "Integrate",
    desc: "Connect all your favorite platforms - from youtube to Tiktok, instagram x, snapchat and more....",
  },
  {
    icon: "/icons/share.svg",
    title: "Share",
    desc: "Promote your A.bio Link everywhere and track the impact with real-time performance tools.",
  },
]

const FeaturesForYou = () => {
    return (
        <section className='w-full relative overflow-x-clip mb-16 lg:mb-20'>
            <div className='mb-10 lg:mb-20 px-6 md:px-10 lg:px-0 container mx-auto'>
                <div className='bg-[#E9E0FE]  px-5 py-10 lg:p-10 xl:mx-20 z-40 relative'>
                    <motion.h4
                      initial={{ opacity: 0, y: 12 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-48px" }}
                      transition={{ duration: 0.28, ease: [0.25, 0.46, 0.45, 0.94] }}
                      className='text-[#7140EB] text-xs font-bold text-center lg:mt-10 uppercase'
                    >
                      MAKE IT EASY
                    </motion.h4>
                    <motion.div
                      initial={{ opacity: 0, y: 14 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-48px" }}
                      transition={{ duration: 0.32, delay: 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
                      className='space-y-4 mb-10 lg:mb-16'
                    >
                        <h3 className='text-3xl xl:text-5xl font-bold tracking-tighter text-center'>Features <br className='lg:hidden' />designed for you</h3>
                        <p className='text-xs xl:text-sm text-center font-thin'>Combine everything in on link: Shop here, showcase your links <br />
                            and flex it all in.
                        </p>
                    </motion.div>

                    <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
                        {featureCards.map((card, i) => (
                          <motion.div
                            key={card.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-32px" }}
                            transition={{ duration: 0.3, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
                            whileHover={{ y: -3, transition: { duration: 0.18 } }}
                            className='bg-[#F5F1FF] p-10 flex flex-col justify-center items-center py-10 space-y-3 aspect-[1/1]'
                          >
                            <div className='p-5 bg-[#B698FF] rounded-full'>
                                <Image src={card.icon} alt='' width={50} height={50} className='size-7' />
                            </div>
                            <div className='text-center mt-2 space-y-2'>
                                <h1 className='font-semibold text-xl'>{card.title}</h1>
                                <p className='text-xs font-thin text-center'>{card.desc}</p>
                            </div>
                          </motion.div>
                        ))}
                    </div>
                </div>
                <div className='z-0 bg-[#B698FF]  h-3 lg:h-5 w-[80%] mx-auto -mt-1' />
            </div>
            <div className="rounded-full bg-gradient-to-r from-[#7140EB] to-[#FB8E8E] z-0 size-72 opacity-50 absolute -top-5 -left-44 filter blur-2xl" />
            <div className="rounded-full bg-gradient-to-r from-[#FB8E8E] to-[#7140EB] z-0 size-32 opacity-50 absolute top-[40%] -right-20 filter blur-2xl" />
        </section>
    )
}

export default FeaturesForYou