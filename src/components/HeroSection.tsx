import Image from 'next/image'
import React from 'react'
import { Input } from './ui/input'
import { Button } from './ui/button'

const HeroSection = () => {
    return (
        <>
   <section className="min-h-[100vh] w-full bg-[#FEF4EA] flex items-center">
  <div className="container mx-auto  mt-16 md:mt-16 grid md:grid-cols-2 gap-10 items-center">
    
    {/* Left Side: Text */}
    <div className="space-y-10">
      <h1 className="text-[80px] mt-[40px] trialheader leading-none font-[900] text-[#5D2D2B] ">
        Endless connection
      </h1>
      <div className='relative'>
        <p className='text-[60px] text-[#5D2D2B] italic mb-[15px] mt-[-40px]'>In just A Biography.</p>
        <Image
          src="/images/scribble.svg"
          alt="Text blend decoration"
          width={300}
          height={300}
          className="z-10 absolute  right-40 -top-7 bottom-2 size-[15rem]"
      />
      </div>
      
      
      <p className="text-[20px] trial   leading-[30px] font-thin ">
        With Abio, a simple biography becomes more than just 
        words, it becomes your bridge to endless connections.
        Abio helps you showcase your essential details, achievements 
        and social links all in a single link and dynamic profile.

      </p>
      
         <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto lg:mx-0">
  <div className="relative flex w-full max-w-xl">
    {/* Input with prefix and room for button */}
    <Input
      placeholder="your name"
      className="pl-[77px] pr-[8rem] border-[#331400] font-medium text-[10px] xl:text-sm h-12 placeholder:font-semibold placeholder:text-[#8B4646] w-full"
    />
    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-black font-semibold text-sm">
      abio.site/
    </span>

    {/* Button inside the input (absolute positioned) */}
    <button className="absolute bg-[#FED45C] shadow-[1px_1px_0px_0px_#000000] text-[#FF0000] right-1 top-1/2 -translate-y-1/2 h-10 w-[7.5rem] lg:w-[9rem] font-bold text-sm">
      Create My Link
    </button>
  </div>
        </div>

      </div> 
    </div>

    {/* Right Side: Image / Visual */}
    {/* <div className="flex justify-center mt-8 md:mt-0">
      <img
        src="/hero-mockup.png"
        alt="App mockup"
        className="w-[250px] sm:w-[300px] md:w-[400px] rounded-2xl shadow-xl"
      />
    </div> */}
    
  
</section>


        </>
       
    )
}

export default HeroSection

