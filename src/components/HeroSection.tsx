"use client";

import Image from "next/image";
import React from "react";
import { Input } from "./ui/input";
import { motion } from "framer-motion";

const HeroSection = () => {
  return (
    <section className="min-h-screen w-full bg-[#FEF4EA] flex items-center overflow-hidden">
      <div className="w-full sm:px-8 md:px-12 lg:px-20 md:container md:mx-auto md:grid md:grid-cols-2 md:gap-8 lg:gap-12 md:items-center md:py-0">
        {/* ── MOBILE layout (below md) ── */}
        <div className="flex flex-col md:hidden px-5 -pt-20 pb-20 space-y-7 items-center text-center">
          {/* Headline */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="space-y-1"
          >
            <h1 className="text-[40px] sm:text-[76px] leading-[0.88] trialheader font-[400] text-[#5D2D2B] tracking-tight">
              Endless
              <br />
              Connection.
            </h1>
            <div className="relative inline-block">
              <p className="text-[38px] sm:text-[32px] -mt-2 trial text-[#5D2D2B] italic">
                In just A Biography.
              </p>
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 220,
                  damping: 18,
                  delay: 0.5,
                }}
              >
                <Image
                  src="/images/scribble.svg"
                  alt=""
                  width={160}
                  height={160}
                  className="absolute right-4 top-14 w-[6.5rem] pointer-events-none"
                />
              </motion.div>
            </div>
          </motion.div>

          {/* Body */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35, duration: 0.6 }}
            className="text-[15px] leading-[1.85] text-[#5D2D2B] max-w-sm"
          >
            With Abio, a simple biography becomes more than just words it
            becomes your bridge to endless connections. Showcase your essential
          </motion.p>

          {/* Input + CTA */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="flex flex-col items-center gap-3 w-full"
          >
            <div className="relative ">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-black font-semibold text-[16px] select-none z-10">
                abio.site/
              </span>
              <Input
                placeholder=""
                className="pl-[84px] border-[#331400] border-0 font-medium text-[14px] h-12 placeholder:text-[14px] placeholder:font-semibold placeholder:text-[#8B4646] w-full rounded-none focus-visible:ring-0 focus-visible:ring-offset-0 bg-[#FED45C]"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="w-4/5 h-12 bg-[#5D2D2B] text-[#FED45C] font-black text-[15px] shadow-[3px_3px_0px_0px_#000000] hover:shadow-[4px_4px_0px_0px_#000000] transition-shadow duration-200"
            >
              Get Abio for free
            </motion.button>
          </motion.div>
        </div>

        {/* ── DESKTOP layout (md+) — original, untouched ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="hidden md:block space-y-8 pt-12 pb-16 md:py-0"
        >
          <div className="space-y-2">
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-[64px] lg:text-[76px] xl:text-[70px] leading-[1] trialheader font-[400] text-[#5D2D2B]"
            >
              Endless
              <br />
              Connection
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.6 }}
              className="relative inline-block"
            >
              <p className="text-4xl lg:text-3xl trial text-[#5D2D2B] italic">
                In just A Biography.
              </p>
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 220,
                  damping: 18,
                  delay: 0.5,
                }}
              >
                <Image
                  src="/images/scribble.svg"
                  alt="decoration"
                  width={160}
                  height={160}
                  className="absolute right-0 top-11 w-[8rem] md:w-[10rem] pointer-events-none"
                />
              </motion.div>
            </motion.div>
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45, duration: 0.6 }}
            className="text-[12px] sm:text-base leading-7 md:max-w-2xl text-[#5D2D2B]"
          >
            With Abio, a simple biography becomes more than just words — it
            becomes your bridge to endless connections. Abio helps you showcase
            your essential details, achievements, and social links all in a
            single link and dynamic profile.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="grid grid-cols-2 gap-2 w-full overflow-hidden"
          >
            <div className="relative min-w-0 overflow-hidden">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-black font-semibold text-[20px] select-none z-10 whitespace-nowrap">
                abio.site/
              </span>
              <Input
                placeholder=""
                className="pl-[85px] w-full border-0 font-medium text-[14px] h-12 placeholder:font-semibold placeholder:text-[#8B4646] rounded-none focus-visible:ring-0 focus-visible:ring-offset-0 bg-[#FED45C] min-w-0"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="h-12 px-2 bg-[#5D2D2B] text-[#FED45C] font-black text-[13px] whitespace-nowrap shadow-[3px_3px_0px_0px_#000000] hover:shadow-[4px_4px_0px_0px_#000000] transition-shadow duration-200 w-full relative z-10"
            >
              Get Abio for free
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Right Side — desktop only */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            duration: 0.8,
            delay: 0.3,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
          className="hidden md:flex items-center justify-center relative"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="relative w-full max-w-md"
          >
            {/* hero image goes here */}
          </motion.div>
          <div className="absolute inset-0 bg-[#FED45C]/10 rounded-full blur-3xl scale-75 pointer-events-none" />
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
