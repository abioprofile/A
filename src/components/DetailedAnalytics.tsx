"use client";
import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";

function useCountUp(target: number, duration: number, active: boolean) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!active) return;
    let s = 0;
    const step = target / (duration / 16);
    const t = setInterval(() => {
      s += step;
      if (s >= target) {
        setValue(target);
        clearInterval(t);
      } else setValue(Math.floor(s));
    }, 16);
    return () => clearInterval(t);
  }, [active, target, duration]);
  return value;
}

const DAY_DATA = [38, 52, 44, 100, 61, 85, 10];
const DAYS = ["M", "T", "W", "T", "F", "S", "S"];

const LiveDot = () => (
  <motion.span
    animate={{ opacity: [1, 0.2, 1] }}
    transition={{ duration: 1.4, repeat: Infinity }}
    className="inline-block w-2 h-2 rounded-full bg-[#3EB489] mr-2"
  />
);

const DetailedAnalytics = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });

  const views = useCountUp(1000, 1600, inView);
  const clicks = useCountUp(1000, 1800, inView);
  const rate = useCountUp(100, 1400, inView);

  const max = Math.max(...DAY_DATA);

  return (
    <section className="w-full bg-[#FED45C] px-4 sm:px-8 md:px-12 lg:px-20 py-16 md:py-20">
     <div
  ref={ref}
  className="grid md:grid-cols-2 gap-12 md:gap-20 items-center"
>
  {/* Left — headline + chart - NOW ON RIGHT ON DESKTOP */}
  <motion.div
    initial={{ opacity: 0, x: -24 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true, amount: 0.3 }}
    transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
    className="md:order-2"
  >
    {/* <p className="text-[10px] font-black tracking-[0.22em] uppercase text-[#5D2D2B] mb-3">
      
      Always watching. In a good way.
    </p> */}

    <h2 className="text-[35px] sm:text-[48px] md:text-[52px] text-center md:text-left trialheader font-[400] text-[#5D2D2B] leading-[0.92] tracking-tight mb-5">
      Your audience
      <br />
      can&apos;t hide
      <br />
      <span className="text-[]">from you.</span>
    </h2>

    <p className="text-sm text-[#5D2D2B]/55 text-center md:text-left leading-[1.85] font-light max-w-sm mb-8">
      See exactly who&apos;s clicking, where they&apos;re from, and
      what&apos;s making them stay. No guesswork. Just data that actually
      makes sense.
    </p>

    {/* Mini bar chart */}
    <div>
      <p className="text-[10px] font-bold tracking-[0.12em] uppercase text-[#5D2D2B]/30 mb-3">
        This week
      </p>
      <div className="flex items-end gap-2 h-[64px] mb-1.5">
        {DAY_DATA.map((v, i) => (
          <div
            key={i}
            className="flex-1 flex flex-col items-center justify-end h-full"
          >
            <motion.div
              className="w-full rounded-t-[0px]"
              initial={{ height: 0 }}
              animate={inView ? { height: `${(v / max) * 100}%` } : {}}
              transition={{
                duration: 0.6,
                delay: 0.3 + i * 0.06,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
              style={{
                background: i === 3 ? "#ffffff" : "rgba(140, 140, 140, 0.2)",
              }}
            />
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        {DAYS.map((d, i) => (
          <div
            key={i}
            className="flex-1 text-center text-[10px] font-bold"
            style={{ color: i === 3 ? "#5D2D2B" : "rgba(93,45,43,0.28)" }}
          >
            {d}
          </div>
        ))}
      </div>
    </div>
  </motion.div>

  {/* Right — 3 stats stacked - NOW ON LEFT ON DESKTOP */}
  <motion.div
    initial={{ opacity: 0, x: 24 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true, amount: 0.3 }}
    transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
    className="md:order-1 relative flex flex-col divide-y divide-[#5D2D2B]/10 border-y border-[#5D2D2B]/10"
  >
    {/* Left vertical line */}
    <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-[#5D2D2B]/15" />

    {/* Right vertical line */}
    <div className="absolute right-0 top-0 bottom-0 w-[2px] bg-[#5D2D2B]/15" />

    {[
      {
        num: views,
        fmt: (n: number) => n.toLocaleString(),
        suffix: "",
        label: "Views",
        sub: "this month",
        change: "↑ 34%",
      },
      {
        num: clicks,
        fmt: (n: number) => n.toLocaleString(),
        suffix: "",
        label: "Clicks",
        sub: "total",
        change: "↑ 22%",
      },
      {
        num: rate,
        fmt: (n: number) => n,
        suffix: "%",
        label: "Click rate",
        sub: "across all links",
        change: "↑ 8%",
      },
    ].map(({ num, fmt, suffix, label, sub, change }, i) => (
      <motion.div
        key={label}
        initial={{ opacity: 0, y: 12 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.4, delay: 0.2 + i * 0.1 }}
        className="flex items-center justify-between py-6 md:py-7 gap-4 px-6"
      >
        <div>
          <div className="flex items-baseline gap-1 leading-none mb-1.5">
            <span className="text-[44px] md:text-[52px] font-black text-[#5D2D2B] tracking-tight tabular-nums">
              {fmt(num)}
            </span>
            <span className="text-[24px] font-black text-[#5D2D2B]/25">
              {suffix}
            </span>
          </div>
          <p className="text-[12px] font-bold text-[#ff0000]">
            {label}{" "}
            <span className="font-normal opacity-70">— {sub}</span>
          </p>
        </div>
        <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
          <span className="text-[14px] font-bold text-[#3EB489]">
            {change}
          </span>
        </div>
      </motion.div>
    ))}
  </motion.div>
</div>
    </section>
  );
};

export default DetailedAnalytics;
