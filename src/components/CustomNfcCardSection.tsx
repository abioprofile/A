import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const CustomNfcCardSection = () => {
  return (
    <section className="relative w-full bg-white py-20 md:py-28 px-4 sm:px-8 lg:px-16 overflow-hidden">
      {/* Decorative scribbles */}
      <Image
        src="/images/scribble.svg"
        alt=""
        width={240}
        height={240}
        className="pointer-events-none absolute rotate-45 -left-16 opacity-40 top-0 w-[9rem] sm:w-[12rem] md:w-[14rem]"
      />
      <Image
        src="/images/scribble.svg"
        alt=""
        width={240}
        height={240}
        className="pointer-events-none absolute -rotate-45 -right-12 opacity-40 top-8 w-[9rem] sm:w-[12rem] md:w-[14rem]"
      />

      <div className="container mx-auto grid md:grid-cols-2 gap-12 md:gap-16 items-center">
        {/* Left — Mockup image */}
        <motion.div
          initial={{ opacity: 0, x: -32 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="flex justify-center order-2 md:order-1"
        >
          <motion.img
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            src="/hero-mockup.png"
            alt="App mockup"
            className="w-[200px] sm:w-[260px] md:w-[340px] lg:w-[400px] rounded-2xl shadow-2xl"
          />
        </motion.div>

        {/* Right — Text */}
        <motion.div
          initial={{ opacity: 0, x: 32 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="flex flex-col gap-5 text-center md:text-left order-1 md:order-2"
        >
          <p className="text-[#FFD05C] font-bold text-xs sm:text-sm tracking-widest uppercase">
            You don&apos;t need a deck of cards.
          </p>

          <h2 className="text-[32px] sm:text-[48px] md:text-[58px] lg:text-[68px] trialheader leading-none font-extrabold text-[#5D2D2B]">
            Get Acard
            <br />
            Today!!!
          </h2>

          <p className="text-sm sm:text-base max-w-sm mx-auto md:mx-0 leading-7 font-light text-[#3B3B3B]">
            Personalize your NFC card with your name, logo, and brand style.
            One tap shares your A.bio — no app needed.
          </p>

          <p className="text-base sm:text-lg text-[#5D2D2B] trial italic font-light">
            One card. Endless connections...
          </p>

          <div className="flex justify-center md:justify-start">
            <motion.button
              whileHover={{ scale: 1.04, boxShadow: "4px 4px 0px 0px #000000" }}
              whileTap={{ scale: 0.97 }}
              className="bg-[#FED45C] shadow-[3px_3px_0px_0px_#000000] text-[#FF0000] h-11 px-8 font-bold text-sm transition-shadow duration-200"
            >
              Get yours Now!
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CustomNfcCardSection;
