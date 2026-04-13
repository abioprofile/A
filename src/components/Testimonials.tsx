"use client";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import Image from "next/image";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

function AutoplayPlugin(slider: any) {
  let timeout: ReturnType<typeof setTimeout>;
  let mouseOver = false;

  function clearNext() { clearTimeout(timeout); }
  function scheduleNext() {
    clearTimeout(timeout);
    if (mouseOver) return;
    timeout = setTimeout(() => slider.next(), 2500);
  }

  slider.on("created", () => {
    slider.container.addEventListener("mouseover", () => { mouseOver = true; clearNext(); });
    slider.container.addEventListener("mouseout", () => { mouseOver = false; scheduleNext(); });
    scheduleNext();
  });
  slider.on("dragStarted", clearNext);
  slider.on("animationEnded", scheduleNext);
  slider.on("updated", scheduleNext);
}

const influencers = [
  { src: "/images/Ellipse 75.png", alt: "Influencer 1", name: "Influencer 1", link: "https://example.com/1" },
  { src: "/images/WHite card.png", alt: "Influencer 2", name: "Influencer 2", link: "https://example.com/2" },
  { src: "/images/Rectangle 1189.png", alt: "Influencer 3", name: "Influencer 3", link: "https://example.com/3" },
  { src: "/images/Rectangle 1188.png", alt: "Influencer 4", name: "Influencer 4", link: "https://example.com/4" },
  { src: "/images/WHite card.png", alt: "Influencer 5", name: "Influencer 5", link: "https://example.com/5" },
  { src: "/images/Rectangle 1188.png", alt: "Influencer 6", name: "Influencer 6", link: "https://example.com/6" },
];

const rotatingWords = ["Influencers", "Creators", "Artists", "Leaders", "Innovators", "Web3"];

const Testimonials = () => {
  const [sliderRef] = useKeenSlider<HTMLDivElement>(
    {
      loop: true,
      breakpoints: {
        "(max-width: 480px)": { slides: { perView: 1.3, spacing: 10 } },
        "(min-width: 481px) and (max-width: 768px)": { slides: { perView: 2.3, spacing: 12 } },
        "(min-width: 769px) and (max-width: 1024px)": { slides: { perView: 3.2, spacing: 14 } },
        "(min-width: 1025px)": { slides: { perView: 4.5, spacing: 16 } },
      },
    },
    [AutoplayPlugin]
  );

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
    <section className="w-full py-16 md:py-20 px-0 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-10 px-4"
      >
        <h2 className="trialheader text-[#5D2D2B] text-2xl sm:text-3xl md:text-5xl font-bold leading-snug">
          Abio for all. Trusted by
        </h2>
        <div className="mt-1 h-10 flex items-center justify-center">
          <span className="text-2xl sm:text-3xl md:text-5xl trialheader font-bold text-yellow-500 border-r-4 border-yellow-500 pr-1">
            {text}
          </span>
        </div>
      </motion.div>

      <div ref={sliderRef} className="keen-slider px-4">
        {influencers.map((item, index) => (
          <div key={index} className="keen-slider__slide flex justify-center py-2">
            <div className="group w-[160px] sm:w-[180px] h-[160px] sm:h-[180px] [perspective:1000px]">
              <div className="relative w-full h-full transition-transform duration-500 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
                {/* Front */}
                <div className="absolute inset-0 [backface-visibility:hidden] overflow-hidden rounded-xl shadow-md">
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    className="object-cover"
                  />
                </div>
                {/* Back */}
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#331400] text-white rounded-xl shadow-md [transform:rotateY(180deg)] [backface-visibility:hidden]">
                  <p className="mb-2 font-semibold text-sm">{item.name}</p>
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-yellow-400 underline text-xs"
                  >
                    View Profile
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Testimonials;
