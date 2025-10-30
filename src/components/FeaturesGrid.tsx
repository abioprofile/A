"use client";
import Image from "next/image";

export default function FeaturesGrid() {
  return (
    <section className="container relative mx-auto px-4 sm:px-6 md:px-8 py-12 bg-[#FFDCE3] overflow-hidden">
      {/* Decorative Stars */}
      <Image
        src="/images/Star 6.svg"
        alt=""
        height={40}
        width={40}
        className="absolute top-2 left-2 sm:top-4 sm:left-4 w-8 h-8 sm:w-10 sm:h-10"
      />
      <Image
        src="/images/Star 6.svg"
        alt=""
        height={40}
        width={40}
        className="absolute top-2 right-2 sm:top-4 sm:right-4 w-8 h-8 sm:w-10 sm:h-10"
      />

      {/* Heading */}
      <h2 className="text-center trialheader text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-[#4B2C2C]">
        Features
      </h2>

      <div className="flex gap-2 items-center justify-center mb-8">
        <div className="w-3 h-2 bg-[#D9D9D9]" />
        <div className="w-8 h-2 bg-[#FF854A]" />
        <div className="w-3 h-2 bg-[#D9D9D9]" />
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        
        {/* Dynamic Profile */}
        <div className="relative row-span-2 bg-[#FF854A] p-6 sm:p-8 text-white flex flex-col justify-between overflow-hidden ">
          {/* Shape */}
          <svg
            className="absolute top-6 right-0 w-16 sm:w-20 h-16 sm:h-20 opacity-50"
            viewBox="0 0 100 100"
            xmlns="http://www.w3.org/2000/svg"
            fill="#FFB68A"
          >
            <path d="M94.4 57.5c.4-2.4.6-4.9.6-7.5s-.2-5.1-.6-7.5l9.1-7.1c.8-.7 1.1-1.8.5-2.7l-8.6-14.9c-.6-1-1.7-1.3-2.7-.9l-10.7 4.3c-3.9-3-8.2-5.4-12.9-7.1l-1.6-11.3c-.2-1.1-1.1-2-2.2-2h-17c-1.1 0-2 .9-2.2 2l-1.6 11.3c-4.7 1.7-9 4.1-12.9 7.1L7.3 17.9c-1-.4-2.1-.1-2.7.9L-4 33.7c-.6.9-.3 2 .5 2.7l9.1 7.1c-.4 2.4-.6 4.9-.6 7.5s.2 5.1.6 7.5l-9.1 7.1c-.8.7-1.1 1.8-.5 2.7l8.6 14.9c.6 1 1.7 1.3 2.7.9l10.7-4.3c3.9 3 8.2 5.4 12.9 7.1l1.6 11.3c.2 1.1 1.1 2 2.2 2h17c1.1 0 2-.9 2.2-2l1.6-11.3c4.7-1.7 9-4.1 12.9-7.1l10.7 4.3c1 .4 2.1.1 2.7-.9l8.6-14.9c.6-.9.3-2-.5-2.7l-9.1-7.1z"/>
          </svg>

          <div className="absolute bottom-12 right-10 w-20 sm:w-28 h-20 sm:h-28 bg-[#F77F3C] rounded-full opacity-30" />

          <div className="relative z-10">
            <p className="text-[15px] sm:text-2xl trial italic">Dynamic</p>
            <p className="text-3xl sm:text-3xl font-bold italic">Profile</p>
            <p className="text-[15px] trial sm:text-xl italic">in One Link</p>
            <p className="bg-white text-black text-xs sm:text-sm inline-block px-3 py-1 mt-4 italic font-semibold">
              one easy bio link.
            </p>
          </div>

          {/* Phone Image */}
          <div className="relative z-10 flex justify-center mt-6 sm:mt-8">
            <Image
              src="/images/den.svg"
              alt="Phone"
              width={200}
              height={500}
              className="object-contain w-[250px] sm:w-[250px] md:w-[320px] max-h-[400px]"
            />
          </div>
        </div>

        {/* Realtime Updates */}
        <div className="relative bg-[#5C2E2E] col-span-1 sm:col-span-2 p-6 sm:p-8 text-white flex flex-col justify-center overflow-hidden ">
          <svg
            className="absolute -top-4 -left-8 w-16 sm:w-24 h-16 sm:h-24 opacity-40"
            viewBox="0 0 100 100"
            xmlns="http://www.w3.org/2000/svg"
            fill="#875651"
          >
            <path d="M50 5 L57 18 A35 35 0 0 1 74 26 L88 19 L93 32 L81 41 A35 35 0 0 1 81 59 L93 68 L88 81 L74 74 A35 35 0 0 1 57 82 L50 95 L43 82 A35 35 0 0 1 26 74 L12 81 L7 68 L19 59 A35 35 0 0 1 19 41 L7 32 L12 19 L26 26 A35 35 0 0 1 43 18 Z" />
          </svg>

          <div className="absolute bottom-6 right-6 w-24 sm:w-32 h-24 sm:h-32 bg-[#875651] rounded-full opacity-30" />

          <div className="relative z-10">
            <p className="text-xl sm:text-3xl md:text-4xl font-semibold italic">Realtime</p>
            <p className="text-[15px] trial sm:text-xl italic">Content Updates...</p>
          </div>
        </div>

        {/* Multiple Integration */}
        <div className="relative bg-[#3EB489] p-6 sm:p-8 text-white flex flex-col justify-center overflow-hidden ">
          <div className="absolute -top-4 -right-8 w-20 sm:w-28 h-20 sm:h-28 bg-[#63C9A5] rounded-full opacity-40" />
          <div className="relative z-10">
            <p className="text-xl sm:text-3xl font-semibold italic">Multiple</p>
            <p className="text-[15px] trial sm:text-xl italic">Integration...</p>
          </div>
        </div>

        {/* Analytics */}
        <div className="relative bg-[#FFD65A] p-6 sm:p-8 text-[#4B2C2C] flex flex-col justify-center overflow-hidden ">
          <div className="absolute left-6 bottom-6 flex gap-2">
            <div className="w-2 sm:w-3 h-8 sm:h-10 bg-[#FFF3C2] rounded"></div>
            <div className="w-2 sm:w-3 h-10 sm:h-14 bg-[#FFF3C2] rounded"></div>
            <div className="w-2 sm:w-3 h-14 sm:h-20 bg-[#FFF3C2] rounded"></div>
          </div>

          <div className="relative z-10 ml-auto text-right">
            <p className="text-xl sm:text-3xl font-semibold italic">Analytics</p>
            <p className="text-[15px] trial sm:text-xl italic">& Engagements</p>
          </div>
        </div>
      </div>
    </section>
  );
}

