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
  { src: "/images/Ellipse 75.png",     alt: "Creator 1", name: "Creator 1", link: "#", shape: "circle",  tall: false },
  { src: "/images/WHite card.png",     alt: "Brand 1",   name: "Brand 1",   link: "#", shape: "rounded", tall: true  },
  { src: "/images/Rectangle 1189.png", alt: "Creator 2", name: "Creator 2", link: "#", shape: "rounded", tall: true  },
  { src: "/images/Rectangle 1188.png", alt: "Brand 2",   name: "Brand 2",   link: "#", shape: "rounded", tall: false },
  { src: "/images/WHite card.png",     alt: "Creator 3", name: "Creator 3", link: "#", shape: "circle",  tall: false },
  { src: "/images/Rectangle 1188.png", alt: "Brand 3",   name: "Brand 3",   link: "#", shape: "rounded", tall: true  },
  { src: "/images/Ellipse 75.png",     alt: "Creator 4", name: "Creator 4", link: "#", shape: "rounded", tall: false },
  { src: "/images/Rectangle 1189.png", alt: "Brand 4",   name: "Brand 4",   link: "#", shape: "circle",  tall: false },
];

const rotatingWords = ["Influencers", "Creators", "Artists", "Leaders", "Innovators", "Web3"];

const Testimonials = () => {
  const [sliderRef] = useKeenSlider<HTMLDivElement>(
    {
      loop: true,
      breakpoints: {
        "(max-width: 480px)":                          { slides: { perView: 1.6, spacing: 10 } },
        "(min-width: 481px) and (max-width: 768px)":   { slides: { perView: 2.5, spacing: 12 } },
        "(min-width: 769px) and (max-width: 1024px)":  { slides: { perView: 3.4, spacing: 14 } },
        "(min-width: 1025px)":                         { slides: { perView: 4.8, spacing: 16 } },
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
          const isCircle    = item.shape === "circle";
          const isTall      = item.tall;
          const heightClass = isCircle
            ? "h-[200px] sm:h-[220px]"
            : isTall
            ? "h-[280px] sm:h-[320px]"
            : "h-[200px] sm:h-[220px]";
          const radiusStyle = isCircle ? "9999px" : "22px";

          return (
            <div key={i} className="keen-slider__slide flex items-end pb-2">

              {/* Perspective wrapper */}
              <div
                className={`relative w-full ${heightClass} group`}
                style={{ perspective: "1200px" }}
              >
                {/* Flip inner */}
                <div
                  className="relative w-full h-full transition-transform duration-700 ease-in-out"
                  style={{
                    transformStyle: "preserve-3d",
                  }}
                >
                  <div
                    className="absolute inset-0 w-full h-full [backface-visibility:hidden]
                                group-hover:[transform:rotateY(180deg)] transition-transform duration-700 ease-in-out"
                    style={{
                      borderRadius: radiusStyle,
                      overflow: "hidden",
                      boxShadow: "0 12px 32px rgba(0,0,0,0.18), 0 4px 10px rgba(0,0,0,0.10)",
                    }}
                  >
                    {/* FRONT — image */}
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
                    <div className="absolute bottom-0 left-0 right-0 px-4 pb-3">
                      <p className="text-white font-bold text-sm leading-tight drop-shadow">
                        {item.name}
                      </p>
                    </div>
                  </div>

                  {/* BACK — dark card with link */}
                  <div
                    className="absolute inset-0 w-full h-full [backface-visibility:hidden]
                                [transform:rotateY(180deg)] group-hover:[transform:rotateY(360deg)]
                                transition-transform duration-700 ease-in-out
                                flex flex-col items-center justify-center gap-3"
                    style={{
                      borderRadius: radiusStyle,
                      overflow: "hidden",
                      background: "#331400",
                      boxShadow: "0 12px 32px rgba(0,0,0,0.18), 0 4px 10px rgba(0,0,0,0.10)",
                    }}
                  >
                    {/* Subtle pattern on back */}
                    <div className="absolute inset-0 pointer-events-none opacity-10"
                      style={{
                        backgroundImage: "radial-gradient(circle, rgba(254,212,92,0.6) 1px, transparent 1px)",
                        backgroundSize: "18px 18px",
                      }}
                    />
                    {/* A logo mark */}
                    <div className="relative z-10 w-12 h-12 rounded-[10px] bg-[#FED45C] flex items-center justify-center mb-1">
                      <span className="text-[#5D2D2B] font-black text-xl" style={{ fontFamily: "'Courier New', monospace" }}>A</span>
                    </div>
                    <p className="relative z-10 text-white font-bold text-sm text-center px-4 leading-tight">
                      {item.name}
                    </p>
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="relative z-10 text-[#FED45C] text-xs font-black underline underline-offset-2
                                 hover:text-white transition-colors duration-200"
                    >
                      View Profile →
                    </a>
                    {/* Bottom url tag */}
                    <div className="absolute bottom-3 left-0 right-0 text-center z-10">
                      <span className="text-[10px] font-bold text-white/30 tracking-widest uppercase">
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