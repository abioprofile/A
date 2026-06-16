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
    slider.container.addEventListener("mouseout",  () => { mouseOver = false; scheduleNext(); });
    scheduleNext();
  });
  slider.on("dragStarted",    clearNext);
  slider.on("animationEnded", scheduleNext);
  slider.on("updated",        scheduleNext);
}

const influencers = [
  { src: "/images/fabulous.jpeg", alt: "Fabuloushype", link: "https://fabuloushype.com" },
  { src: "/images/zion.jpeg", alt: "zion", link: "https://zion.com" },
];

const rotatingWords = ["Influencers", "Creators", "Artists", "Leaders", "Innovators", "Web3"];

const Testimonials = () => {
  const [sliderRef] = useKeenSlider<HTMLDivElement>(
    {
      loop: true,
      breakpoints: {
        "(max-width: 480px)": { slides: { perView: 1.2, spacing: 8 } },
        "(min-width: 481px) and (max-width: 768px)": { slides: { perView: 2, spacing: 10 } },
        "(min-width: 769px) and (max-width: 1024px)": { slides: { perView: 2.5, spacing: 12 } },
        "(min-width: 1025px)": { slides: { perView: 3.2, spacing: 12 } },
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
    <section className="w-full py-16 md:py-20 overflow-hidden bg-[#FEF4EA]">

      {/* Heading */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-10 px-4"
      >
        <h2 className="trialheader text-[#5D2D2B] text-[40px] xl:text-[50px] font-[400] leading-snug">
          Abio for all. Trusted by
        </h2>
        <div className="mt-1 h-12 flex items-center justify-center">
          <span className="text-2xl sm:text-3xl md:text-5xl trialheader font-[400] text-yellow-500 border-r-4 border-yellow-500 pr-1">
            {text}
          </span>
        </div>
      </motion.div>

      {/* Slider - SQUARED CARDS with no hover effects */}
      <div ref={sliderRef} className="keen-slider">
        {influencers.map((item, i) => (
          <div key={i} className="keen-slider__slide flex items-center justify-center py-2 px-1">
            
            {/* Square Card - Clickable, no hover effects */}
            <a
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full aspect-square max-w-[340px] relative"
              style={{
                boxShadow: "0 8px 24px rgba(0,0,0,0.15), 0 2px 8px rgba(0,0,0,0.08)",
              }}
            >
              {/* Image - Full square, no overlay, no text */}
              <div className="relative w-full h-full overflow-hidden">
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 480px) 70vw, (max-width: 768px) 45vw, (max-width: 1024px) 32vw, 22vw"
                  priority
                />
              </div>
            </a>

          </div>
        ))}
      </div>

    </section>
  );
};

export default Testimonials;