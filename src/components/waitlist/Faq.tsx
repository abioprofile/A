"use client";

import Image  from "next/image";

export default function FAQs() {
  return (
    <section
      className="relative bg-[#FFDCE3] py-16"
      style={{
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 text-center text-[#5D2D2B]">
        <div className="relative md:mb-10 inline-block">
            <h2
              
              className="text-5xl trial2 font-medium italic text-[#5D2D2B] mb-4"
            >
              How does Abio.site work?
            </h2>
            
          </div>
        
        {/* steps wrapper */}
        <div className="relative flex flex-col md:flex-row items-start justify-between gap-6 md:gap-0">

          {/* Step 1 */}
          <div className="flex flex-col items-center md:w-1/3 px-4 relative top-12">
            <div className="relative flex flex-col items-center">
              <div className="w-16 h-16 grid place-items-center">
                <Image src="/icons/link.png" alt="link" width={80} height={80} />
              </div>
            </div>
            <p className="mt-4 mb-8 md:mb-0 text-[14px] leading-relaxed max-w-xl">
              When you sign up on abio.site you get  a unique link (abio.site/yourname) and a personalized QR code that houses all your other links (contact, social, website and portfolio).
            </p>
          </div>

          {/* Arrow 1 (between 1 and 2) */}
          <div className="hidden md:flex justify-center items-center w-[250px] relative top-10">
            <Image src="/icons/Vector 101.svg" alt="arrow 1" width={500} height={500} />
          </div>

          {/* Step 2 */}
          <div className="flex flex-col items-center md:w-1/3 px-4 relative top-6">
            <div className="relative flex flex-col items-center">
              <div className="w-16 h-16 grid place-items-center">
                <Image src="/icons/nfc.png" alt="nfc" width={80} height={80} />
              </div>
            </div>
            <p className="mt-4 mb-8 md:mb-0  text-[14px] leading-relaxed max-w-xs">
              Get your customizable Acard and other NFC enabled accessories (stickers, keyholders and more...) from our store when we launch Astore.
            </p>
          </div>

          {/* Arrow 2 (between 2 and 3) */}
          <div className="hidden md:flex justify-center items-center w-[250px] relative top-4">
            <Image src="/icons/Vector 102.svg" alt="arrow 2" width={500} height={500} />
          </div>

          {/* Step 3 */}
          <div className="flex flex-col items-center md:w-1/3 px-4 relative -top-2">
            <div className="relative flex flex-col items-center">
              <div className="w-16 h-16 grid place-items-center ">
                <Image src="/icons/infinity.png" alt="infinity" width={80} height={80} />
              </div>
            </div>
            <p className="mt-4 text-[14px] leading-relaxed max-w-xs">
              No Apps. No hassle. One Link, One card, Endless connections.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}



