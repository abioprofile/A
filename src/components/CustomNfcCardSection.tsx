import React from "react";
import Image from "next/image";

const CustomNfcCardSection = () => {
  return (
    <section className="relative mx-auto md:mt-16 grid md:grid-cols-2 min-h-[80vh] w-full bg-[#FFF] items-center overflow-hidden px-6 sm:px-10 lg:px-20">
      {/* Decorative Scribbles */}
      <Image
        src="/images/scribble.svg"
        alt="Decoration"
        width={300}
        height={300}
        className="z-0 absolute rotate-45 -left-20 opacity-60 -top-10 w-[10rem] sm:w-[12rem] md:w-[15rem]"
      />
      <Image
        src="/images/scribble.svg"
        alt="Decoration"
        width={300}
        height={300}
        className="z-0 absolute -rotate-45 -right-10 opacity-60 top-10 w-[10rem] sm:w-[12rem] md:w-[15rem]"
      />

      {/* Left Side: Image */}
      <div className="flex justify-start md:justify-center mt-8 md:mt-0 order-1 md:order-none">
        <img
          src="/hero-mockup.png"
          alt="App mockup"
          className="w-[220px] sm:w-[280px] md:w-[380px] rounded-2xl shadow-xl"
        />
      </div>

      {/* Right Side: Text */}
      <div className="mt-12 md:mt-0 flex flex-col justify-center gap-8 text-left md:text-left">
        <p className="text-[#FFD05C] font-semibold text-sm sm:text-base">
          YOU DON’T NEED A DECK OF CARDS.
        </p>

        <div className="relative">
          <h1 className="text-[35px] sm:text-[56px] trialheader md:text-[70px] lg:text-[80px] leading-none font-extrabold text-[#5D2D2B]">
            Get Acard Today!!!
          </h1>
        </div>

        <p className="text-[14px] sm:text-[18px] md:text-[20px] max-w-xl mx-auto md:mx-0 leading-[26px] sm:leading-[30px] font-light text-[#3B3B3B]">
          Personalize your NFC card with your name, logo, and brand style.  
          One tap shares your A.bio — no app needed.
        </p>

        <p className="text-[16px] sm:text-[18px] md:text-[20px] text-[#5D2D2B] trial italic font-light">
          One card. Endless connections...
        </p>

        <div className="flex justify-start">
          <button className="bg-[#FED45C] shadow-[3px_3px_0px_0px_#000000] text-[#FF0000] h-10 px-6 sm:px-8 font-bold text-sm sm:text-base  transition-transform duration-300 hover:scale-105">
            Create My Link
          </button>
        </div>
      </div>
    </section>
  );
};

export default CustomNfcCardSection;

