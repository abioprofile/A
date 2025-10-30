import Image from 'next/image'
import React from 'react'
import { Input } from './ui/input'

const HeroSection = () => {
  return (
    <section className="min-h-[75vh] lg:min-h-screen mt-20 lg:mt-4 w-full bg-[#FEF4EA] flex items-center">
      <div className="container mx-auto px-4 lg:mt-16 grid md:grid-cols-2 gap-10 items-center">
        
        {/* Left Side */}
        <div className="space-y-8 text-center md:text-left">
          <h1 className="text-[45px] md:text-[70px] lg:text-[80px] leading-none trialheader font-[900] text-[#5D2D2B]">
            Endless connection
          </h1>

          <div className="relative inline-block">
            <p className="text-[28px] sm:text-[40px] trial md:text-[50px] lg:text-[60px] text-[#5D2D2B] italic mb-3 -mt-5">
              In just A Biography.
            </p>
            <Image
              src="/images/scribble.svg"
              alt="Text blend decoration"
              width={250}
              height={250}
              className="absolute right-10 sm:right-16 md:right-20 -top-5 size-[8rem] sm:size-[10rem] md:size-[12rem]"
            />
          </div>

          <p className="text-[16px]  leading-[26px] md:leading-[30px] font-thin max-w-xl mx-auto md:mx-0 text-[#5D2D2B]">
            With Abio, a simple biography becomes more than just words—it becomes your bridge to endless connections.
            Abio helps you showcase your essential details, achievements, and social links all in a single link and dynamic profile.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto md:mx-0">
            <div className="relative flex w-full max-w-xl">
              <Input
                placeholder="your name"
                className="pl-[77px] pr-[7.5rem] border-[#331400] font-medium text-xs sm:text-sm h-11 sm:h-12 placeholder:font-semibold placeholder:text-[#8B4646] w-full"
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-black font-semibold text-sm">
                abio.site/
              </span>
              <button className="absolute bg-[#FED45C] shadow-[1px_1px_0px_0px_#000000] text-[#FF0000] right-1 top-1/2 -translate-y-1/2 h-9 sm:h-10 w-[6.5rem] sm:w-[7.5rem] md:w-[9rem] font-bold text-xs sm:text-sm">
                Create My Link
              </button>
            </div>
          </div>
        </div>

        {/* Right Side (optional mockup) */}
        {/* <div className="flex justify-center md:justify-end mt-10 md:mt-0">
          <img
            src="/hero-mockup.png"
            alt="App mockup"
            className="w-[250px] sm:w-[320px] md:w-[400px] rounded-2xl shadow-xl"
          />
        </div> */}
      </div>
    </section>
  )
}

export default HeroSection


