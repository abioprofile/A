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

// ONLY 5 influencer cards - UNIFORM size (all same height and width)
const influencers = [
  { src: "/images/fabs.jpg",     alt: "Fabuloushype", name: "Fabuloushype", link: "#" },
  // { src: "/images/WHite card.png",     alt: "Aplund Company", name: "Aplund Company", link: "#"},
  { src: "/images/dna.jpg", alt: "DNABYGAZA", name: "DNABYGAZA", link: "#" },
  { src: "/images/Rectangle 1188.png", alt: "John Doe", name: "John Decker", link: "#" },
  { src: "/images/mind.jpg",     alt: "Minds GC", name: "Minds GC", link: "#" },
];

// The 5 testimonials matching each influencer
const testimonials = [
  { text: "Abio made networking feel effortless. One tap and every booking link, social page and contact was right there. Clean, fast and perfect for my kind of audience.", author: "Fabuloushype" },
  { text: "Pairing our smart mirrors with Abio's NFC system gave our clients a premium interactive experience. It blended perfectly into the Aplund brand vision.", author: "Aplund Company" },
  { text: "From digital menus to customer retention, Abio helped us simplify the nightlife experience. The Astands and Acard combo works perfectly - DNABYGAZA", author: "DNABYGAZA" },
  { text: "As a creative director, I needed one clean space for my portfolio, bookings and socials. Abio turned my online presence into something people actually remember.", author: "John Doe" },
  { text: "Abio helped us create a more seamless client experience from project consultations to easy brand access. It made access to our construction and interior design expertise a more modern touch.", author: "Minds GC" },
];

const rotatingWords = ["Influencers", "Creators", "Artists", "Leaders", "Innovators", "Web3"];

const Testimonials = () => {
  const [sliderRef] = useKeenSlider<HTMLDivElement>(
    {
      loop: true,
      breakpoints: {
        "(max-width: 480px)":                          { slides: { perView: 1.2, spacing: 10 } },
        "(min-width: 481px) and (max-width: 768px)":   { slides: { perView: 2, spacing: 12 } },
        "(min-width: 769px) and (max-width: 1024px)":  { slides: { perView: 2.5, spacing: 14 } },
        "(min-width: 1025px)":                         { slides: { perView: 3.2, spacing: 16 } },
      },
    },
    [AutoplayPlugin]
  );

  const [text, setText]             = useState("");
  const [wordIndex, setWordIndex]   = useState(0);
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

  // UNIFORM size for all cards
  const uniformHeight = "h-[300px] sm:h-[350px] md:h-[380px]";
  const uniformWidth = "w-full";
  const radiusStyle = "0px"; // Slightly rounded corners for front image

  return (
    <section className="w-full py-16 md:py-20 overflow-hidden bg-[#FEF4EA]">

      {/* Heading */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12 px-4"
      >
        <h2 className="trialheader text-[#5D2D2B] text-[40px] xl:text-[50px] font-[400] leading-snug">
          Abio for all. Trusted by
        </h2>
        <div className="mt-1 h-12 flex items-center justify-center">
          <span className="text-2xl sm:text-3xl md:text-5xl trialheader font-bold text-yellow-500 border-r-4 border-yellow-500 pr-1">
            {text}
          </span>
        </div>
      </motion.div>

      {/* Slider */}
      <div ref={sliderRef} className="keen-slider">
        {influencers.map((item, i) => {
          const testimonial = testimonials[i];

          return (
            <div key={i} className="keen-slider__slide flex items-center justify-center py-4">

              {/* Perspective wrapper - UNIFORM size */}
              <div
                className={`relative ${uniformWidth} ${uniformHeight} group`}
                style={{ perspective: "1200px" }}
              >
                {/* Flip inner */}
                <div
                  className="relative w-full h-full transition-transform duration-700 ease-in-out"
                  style={{
                    transformStyle: "preserve-3d",
                  }}
                >
                  {/* FRONT — image */}
                  <div
                    className="absolute inset-0 w-full h-full [backface-visibility:hidden]
                                group-hover:[transform:rotateY(180deg)] transition-transform duration-700 ease-in-out"
                    style={{
                      borderRadius: radiusStyle,
                      overflow: "hidden",
                      boxShadow: "0 12px 32px rgba(0,0,0,0.18), 0 4px 10px rgba(0,0,0,0.10)",
                    }}
                  >
                    <Image
                      src={item.src}
                      alt={item.alt}
                      fill
                      className="object-cover"
                      sizes="(max-width: 480px) 70vw, (max-width: 768px) 45vw, (max-width: 1024px) 32vw, 22vw"
                    />
                    {/* Bottom fade */}
                    <div className="absolute inset-0 pointer-events-none"
                      style={{
                        background: "linear-gradient(to top, rgba(0,0,0,0.45) 0%, transparent 50%)",
                        borderRadius: radiusStyle,
                      }}
                    />
                    {/* Name on front */}
                    <div className="absolute bottom-0 left-0 right-0 px-4 pb-4">
                      <p className="text-white font-bold text-base leading-tight drop-shadow">
                        {item.name}
                      </p>
                    </div>
                  </div>

                  {/* BACK — Testimonial Card (sharp edges rectangle) - SAME SIZE */}
                  <div
                    className="absolute inset-0 w-full h-full [backface-visibility:hidden]
                                [transform:rotateY(180deg)] group-hover:[transform:rotateY(360deg)]
                                transition-transform duration-700 ease-in-out
                                flex flex-col p-5"
                    style={{
                      borderRadius: 0, // SHARP EDGES - rectangle with no rounding
                      overflow: "auto",
                      background: "#ffffff",
                      boxShadow: "0 12px 32px rgba(0,0,0,0.18), 0 4px 10px rgba(0,0,0,0.10)",
                    }}
                  >
                    {/* Quote icon */}
                    <div className="text-5xl text-[#FED45C] mb-3">"</div>
                    
                    {/* Testimonial text */}
                    <p className="text-[#331400] text-sm leading-relaxed flex-1">
                      {testimonial.text}
                    </p>
                    
                    {/* Author divider and name */}
                    <div className="mt-4 pt-3 border-t-2 border-[#FED45C]">
                      <p className="text-[#5D2D2B] font-bold text-sm">
                        — {testimonial.author}
                      </p>
                    </div>

                    {/* abio watermark */}
                    <div className="mt-3 text-right">
                      <span className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">
                        abio.site
                      </span>
                    </div>
                  </div>

                </div>
              </div>

            </div>
          );
        })}
      </div>

    </section>
  );
};

export default Testimonials;