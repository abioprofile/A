"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

const influencers = [
  {
    src: "/images/fabulous.jpeg",
    alt: "Fabuloushype",
    username: "fabulous",
    link: "https://www.abio.site/fabulous",
  },
  {
    src: "/images/zuo.PNG",
    alt: "Zuo",
    username: "zuo",
    link: "https://www.abio.site/zuo",
  },
  {
    src: "/images/zion.jpeg",
    alt: "Zion",
    username: "zion",
    link: "https://www.abio.site/ziongotlevels",
  },
  {
    src: "/images/samuel zeus.jpeg",
    alt: "Samuel Zeus",
    username: "SamuelXeus",
    link: "https://www.abio.site/SamuelXeus",
  },
  // Add more as needed
];

// Duplicate the array for seamless marquee
const MARQUEE_ITEMS = [...influencers, ...influencers, ...influencers];

const rotatingWords = [
  "Influencers",
  "Creators",
  "Artists",
  "Leaders",
  "Innovators",
  "Web3",
];

const Testimonials = () => {
  const [text, setText] = useState("");
  const [wordIndex, setWordIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentWord = rotatingWords[wordIndex];
    const typingSpeed = isDeleting ? 50 : 120;
    const timer = setTimeout(() => {
      setText((prev) => {
        if (!isDeleting) {
          const next = currentWord.substring(0, prev.length + 1);
          if (next === currentWord) setTimeout(() => setIsDeleting(true), 1000);
          return next;
        } else {
          const next = currentWord.substring(0, prev.length - 1);
          if (next === "") {
            setIsDeleting(false);
            setWordIndex((i) => (i + 1) % rotatingWords.length);
          }
          return next;
        }
      });
    }, typingSpeed);
    return () => clearTimeout(timer);
  }, [text, isDeleting, wordIndex]);

  return (
    <section className="w-full py-10 md:py-20 overflow-hidden bg-[#FEF4EA]">
      {/* Heading */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-10 px-4"
      >
        <h2 className="trialheader text-[#5D2D2B] text-[32px] xl:text-[50px] font-[400] leading-[0.9] ">
          Abio for all. Trusted by
        </h2>
        <div className="mt-1 h-12 flex items-center justify-center">
          <span className="text-[32px] sm:text-3xl md:text-5xl trialheader font-[400] text-yellow-500 border-r-4 border-yellow-500 pr-1">
            {text}
          </span>
        </div>
      </motion.div>

      {/* Marquee Container - NO BLUR */}
      <div className="relative overflow-hidden">
        {/* Marquee Track */}
        <div className="flex gap-4 md:gap-6 animate-marquee whitespace-nowrap">
          {MARQUEE_ITEMS.map((item, i) => (
            <div
              key={`${item.username}-${i}`}
              className="flex-shrink-0 w-[220px] sm:w-[240px] md:w-[250px] lg:w-[280px]" // Increased mobile width from 200px to 220px
            >
              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="block aspect-square relative overflow-hidden group"
                style={{
                  boxShadow:
                    "0 8px 24px rgba(0,0,0,0.15), 0 2px 8px rgba(0,0,0,0.08)",
                }}
              >
                {/* Full-bleed image */}
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 480px) 255px, (max-width: 768px) 240px, (max-width: 1024px) 250px, 280px" // Updated sizes
                  priority={i < 3}
                />

                {/* Username pill — bottom center */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                  <div
                    className="flex items-center gap-1.5 bg-white px-3 py-1.5 text-sm font-semibold text-black whitespace-nowrap"
                    style={{ borderRadius: 0 }}
                  >
                    <Link
                      href="/"
                      className="flex items-center gap-[1.5px] group flex-shrink-0" // Added flex-shrink-0
                    >
                      <Image
                        src="/icons/Abio b&w.svg"
                        alt="A.Bio Logo"
                        width={20}
                        height={20}
                        priority
                        className="transition-transform w-5 h-5 group-hover:scale-105 flex-shrink-0" // Added flex-shrink-0 and fixed size
                      />
                    </Link>
                    <span className="truncate max-w-[120px]">/{item.username}</span> {/* Added truncate and max-width */}
                  </div>
                </div>
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* CSS for marquee animation */}
      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-33.33%);
          }
        }
        
        .animate-marquee {
          animation: marquee 30s linear infinite;
          width: fit-content;
        }
        
        /* Pause animation on hover */
        .animate-marquee:hover {
          animation-play-state: paused;
        }
        
        /* Mobile: faster animation */
        @media (max-width: 640px) {
          .animate-marquee {
            animation-duration: 20s;
          }
        }
      `}</style>
    </section>
  );
};

export default Testimonials;