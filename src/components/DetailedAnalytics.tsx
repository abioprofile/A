"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";

function useCountUp(target: number, duration: number, active: boolean) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!active) return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setValue(target);
        clearInterval(timer);
      } else {
        setValue(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [active, target, duration]);

  return value;
}

const DetailedAnalytics = () => {
  const statsRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(statsRef, { once: true, amount: 0.5 });

  const views = useCountUp(100, 1400, isInView);
  const clicks = useCountUp(100, 1600, isInView);
  const rate = useCountUp(100, 1800, isInView);

  return (
    <section className="w-full bg-[#FFDCE3] py-16 md:py-24 px-4 sm:px-8 lg:px-16">
      <div className="container mx-auto grid md:grid-cols-2 items-center gap-10 md:gap-16">

        {/* Left — Illustration + sub-text */}
        <motion.div
          initial={{ opacity: 0, x: -28 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="flex flex-col items-center md:items-start gap-5"
        >
          <Image
            src="/images/Group.svg"
            alt="Analytics illustration"
            width={400}
            height={400}
            className="w-[220px] sm:w-[280px] md:w-[380px] h-auto"
          />
          <p className="text-xs sm:text-sm text-[#5D2D2B] max-w-xs leading-relaxed text-center md:text-left">
            Track exactly who clicks and views your A.bio, see when, where, and
            how they visit — gain deeper insights to understand your audience.
          </p>
        </motion.div>

        {/* Right — Heading + stats */}
        <motion.div
          initial={{ opacity: 0, x: 28 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="space-y-5 relative"
        >
          <h2 className="text-[32px] sm:text-4xl md:text-5xl trialheader font-extrabold text-[#5D2D2B] leading-tight">
            Get detailed
            <br />
            Analytics
          </h2>

          <p className="text-[#5D2D2B] text-xs sm:text-sm max-w-sm leading-relaxed">
            See who clicks and views your Abio profile. Track engagement over
            time, measure click rate, and learn what&apos;s converting your
            audience.
          </p>

          {/* Floating badge */}
          <div className="absolute top-0 right-0 sm:top-2 sm:right-4">
            <span className="inline-block bg-lime-300 border border-black text-black px-3 py-1 rounded-full text-xs font-semibold shadow-md">
              Social &amp; NFC
            </span>
          </div>

          {/* Stats */}
          <div ref={statsRef} className="flex flex-row justify-between sm:justify-start sm:gap-14 pt-4">
            {[
              { value: views, suffix: "+", label: "Views" },
              { value: clicks, suffix: "+", label: "Clicks" },
              { value: rate, suffix: "%", label: "Click Rate" },
            ].map(({ value, suffix, label }) => (
              <div key={label} className="text-center">
                <p className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-red-600 leading-none tabular-nums">
                  {value}
                  {suffix}
                </p>
                <p className="text-xs sm:text-sm text-red-600 font-semibold mt-1">{label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default DetailedAnalytics;
