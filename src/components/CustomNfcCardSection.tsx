import React from "react";
import Image from "next/image";

const CustomNfcCardSection = () => {
  return (
    <section className="relative  mx-auto md:mt-16 grid md:grid-cols-2 min-h-[80vh] w-full bg-[#FFF] items-center">
      <Image
                src="/images/scribble.svg"
                alt="Text blend decoration"
                width={300}
                height={300}
                className="z-10 absolute rotate-45 -left-30 opacity-70 -top-20 bottom-2 size-[15rem]"
            />
      <Image
                src="/images/scribble.svg"
                alt="Text blend decoration"
                width={300}
                height={300}
                className="z-10 absolute -rotate-45 -right-20 opacity-70 top-0  size-[15rem]"
            />
      {/* Left Side: Image */}
      <div className="flex justify-center mt-8 md:mt-0">
        <img
          src="/hero-mockup.png"
          alt="App mockup"
          className="w-[250px] sm:w-[300px] md:w-[400px] rounded-2xl shadow-xl"
        />
      </div>

      {/* Right Side: Text */}
      <div className="mt-16 flex flex-col justify-center gap-10">
        <div className="space-y-8">
            <p className="text-[#FFD05C] font-semibold">YOU DON’T NEED A DECK OF CARDS.</p>
          <div className="relative">
            <h1 className="text-[80px] trialheader leading-none font-[900] text-[#5D2D2B]">
           Get Acard Today!!!
          </h1>
            <Image
              src="/images/scribble.svg"
              alt="Text blend decoration"
              width={300}
              height={300}
              className="absolute right-80 top-12 size-[15rem] z-10"
            />
          </div>

          <p className="text-[20px] max-w-xl trial leading-[30px] font-thin">
            Personalize your NFC card with your name, logo, 
            and brand style. One tap shares your A.bio, 
            no app needed.
          </p>
          <p className="text-[20px] text-[#5D2D2B] italic  font-thin">
            One card. Endless connections...
          </p>
          <button className=" bg-[#FED45C] shadow-[3px_3px_0px_0px_#000000] text-[#FF0000] h-10 w-[7.5rem] lg:w-[9rem] font-bold text-sm">
            Create My Link
            </button>
        </div>
      </div>
    </section>
  );
};

export default CustomNfcCardSection;
