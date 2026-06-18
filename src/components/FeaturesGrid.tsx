"use client";
import Image from "next/image";
import { motion, type Variants } from "framer-motion";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.05 },
  },
};
const cardVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 80, damping: 16 },
  },
};

const PhoneMockup = () => (
  <div className="mx-auto mt-3 w-[68px] h-[130px] border-[1.5px] border-[#FEF4EA]/20 rounded-[0px] overflow-hidden bg-[#FEF4EA]/[0.07]">
    <div className="my-2 mx-2 flex gap-1 items-center">
      <div className="w-[22px] h-[22px] rounded-full bg-[#FED45C]/65  " />
      <div>
        <div className="h-1 bg-[#FEF4EA]/13  mb-1 " />
        <div className="w-5 h-[3px] bg-[#FEF4EA]/18   " />
      </div>
    </div>

    {[1, 2, 3].map((i) => (
      <div
        key={i}
        className="h-[15px] bg-[#FEF4EA]/10 border border-[#FEF4EA]/8 mx-1.5 mb-1"
      />
    ))}
  </div>
);

// const AnalyticsBars = () => (
//   <div className="flex items-end gap-[3px] h-10 w-full mt-auto">
//     {[30, 50, 38, 70, 45, 88, 62, 95, 72, 100, 82, 92].map((h, i) => (
//       <motion.div
//         key={i}
//         animate={{ scaleY: [1, 1.18, 1] }}
//         transition={{
//           duration: 2.5,
//           repeat: Infinity,
//           delay: i * 0.18,
//           ease: "easeInOut",
//         }}
//         className="flex-1 bg-[#5D2D2B]/18 origin-bottom"
//         style={{ height: `${h}%` }}
//       />
//     ))}
//   </div>
// );

const platforms = [
  "Instagram",
  "TikTok",
  "YouTube",
  "Spotify",
  "Twitter",
  "LinkedIn",
  "Snapchat",
  "WhatsApp",
  "Facebook",
  "Pinterest",
  "Figma",
  "Behance",
  "Twitch",
  "Discord",
  "Reddit",
  "SoundCloud",
];
const allPlatforms = [...platforms, ...platforms];

const themes = [
  { name: "Warm", bg: "#FEF4EA", card: "#5D2D2B", text: "#5D2D2B" },
  { name: "Noir", bg: "#120600", card: "#FED45C", text: "#FEF4EA" },
  { name: "Mint", bg: "#E8F8F2", card: "#3EB489", text: "#0F6E56" },
  { name: "Blaze", bg: "#FFF1EB", card: "#FF854A", text: "#FF854A" },
  { name: "Slate", bg: "#1A1A2E", card: "#4A4A8A", text: "#FFF" },
  { name: "Butter", bg: "#FFFBEA", card: "#FED45C", text: "#5D2D2B" },
];
const allThemes = [...themes, ...themes];

const ThemeCarousel = () => (
  <div className="overflow-hidden mt-4 -mx-1">
    <motion.div
      animate={{ x: ["0%", "-50%"] }}
      transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
      className="flex gap-2 w-max"
    >
      {allThemes.map((t, i) => (
        <div
          key={i}
          className="flex-shrink-0 w-[68px] rounded-[0px] overflow-hidden border border-white/10"
          style={{ background: t.bg }}
        >
          <div className="p-1.5 flex flex-col gap-1">
            <div className="flex items-center gap-1 mt-0.5">
              <div
                className="w-4 h-4 rounded-full flex-shrink-0"
                style={{ background: t.card }}
              />

              {/* <div className="w-full h-1" style={{ background: t.card }} /> */}
              <div className="w-full h-1" style={{ background: t.card }} />

              <div>
                <div
                  className="flex-1 h-1.5 rounded-full opacity-30"
                  style={{ background: t.card }}
                />
                <div
                  className="flex-1 h-1.5 rounded-full opacity-30"
                  style={{ background: t.card }}
                />
              </div>
            </div>
            {[1, 2, 3].map((j) => (
              <div
                key={j}
                className="w-full h-4 rounded-[0px]"
                style={{ background: j === 1 ? t.card : `${t.card}30` }}
              />
            ))}
            {/* <div className="flex justify-center gap-1 mt-0.5 pb-0.5">
              {[1, 2, 3].map((j) => (
                <div
                  key={j}
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ background: `${t.card}40` }}
                />
              ))}
            </div> */}
          </div>
          <div
            className="text-center text-[8px] font-bold py-1 tracking-wide"
            style={{ color: t.text, background: `${t.card}18` }}
          >
            {t.name}
          </div>
        </div>
      ))}
    </motion.div>
  </div>
);

export default function FeaturesGrid() {
  return (
    <section className="w-full bg-[#FFDCE3] px-4 sm:px-8 md:px-12 lg:px-20 py-10 md:py-16 relative overflow-hidden">
      {/* Spinning stars */}
      {/* <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute top-5 left-5 sm:top-7 sm:left-7"
      >
        <Image
          src="/images/Star 6.svg"
          alt=""
          height={32}
          width={32}
          className="w-7 h-7 sm:w-8 sm:h-8"
        />
      </motion.div>
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 26, repeat: Infinity, ease: "linear" }}
        className="absolute top-5 right-5 sm:top-7 sm:right-7"
      >
        <Image
          src="/images/Star 6.svg"
          alt=""
          height={32}
          width={32}
          className="w-7 h-7 sm:w-8 sm:h-8"
        />
      </motion.div> */}

      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mb-10 md:mb-14 text-center md:text-left"
      >
        {/* <p className="text-[12px] font-black tracking-[0.2em] text-[#5D2D2B]/40 uppercase mb-2">
          What you get
        </p> */}
        {/* <h2 className="text-[35px] xl:text-[50px] trialheader font-[400] text-[#5D2D2B] leading-[1.2] tracking-tight">
          Everything <br /> you need.
          <br />
          <span className="text-[#FF854A]">Nothing you don't.</span>
        </h2> */}
      </motion.div>

      {/* Bento Grid — 2 cols mobile, 3 cols desktop */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.08 }}
        className="grid grid-cols-3 gap-3 md:gap-4"
      >
        {/* 1. Bio Profile — 1 col */}
        <motion.div
          variants={cardVariants}
          className="relative bg-[#5D2D2B] p-4 md:p-6 overflow-hidden flex flex-col items-start text-left
       col-span-1 min-h-[210px] md:min-h-[230px] lg:min-h-[250px]"
        >
          <div className="absolute w-20 h-20 bg-[#4A2422] rounded-full -bottom-6 -right-6" />
          <div className="relative z-10">
            <span className="inline-block bg-[#FED45C] text-[#5D2D2B] text-[8px] md:text-[9px] font-black tracking-[0.15em] uppercase px-2 py-0.5 mb-2">
              Abio Link
            </span>
            <h3 className="text-[16px] md:text-[26px] font-[400] text-[#FEF4EA] leading-tight trialheader">
              Your link.
              <br />
              Your world.
            </h3>
          </div>
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="relative z-10 mt-auto"
          >
            <PhoneMockup />
          </motion.div>
        </motion.div>

        {/* 2. Themes — 2 cols */}
        <motion.div
          variants={cardVariants}
          className="relative bg-[#120600] p-4 md:p-6 overflow-hidden flex flex-col justify-between
               col-span-2 min-h-[210px] md:min-h-[230px] lg:min-h-[250px]"
        >
          <div className="absolute w-24 h-24 bg-[#FED45C]/05 rounded-full -top-8 -right-8" />
          <div>
            <span className="inline-block text-[8px] md:text-[9px] font-black tracking-[0.15em] uppercase px-2 py-0.5 mb-2 bg-[#FED45C]/15 text-[#FED45C]">
              Themes
            </span>
            <h3 className="text-[18px] md:text-[26px] font-[400] text-[#FEF4EA] trialheader leading-tight">
              Make it
              <br />
              yours.
            </h3>
            <p className="text-[#FEF4EA]/35 text-[10px] md:text-[11px] mt-1.5">
              Your brand. Your style.
            </p>
          </div>
          <ThemeCarousel />
        </motion.div>

        {/* 3. Realtime — 2 cols */}
        <motion.div
          variants={cardVariants}
          className="relative bg-[#FF854A] p-4 md:p-6 overflow-hidden flex flex-col justify-between
               col-span-2 min-h-[210px] md:min-h-[230px] lg:min-h-[250px]"
        >
          <div className="absolute w-20 h-20 bg-[#E6703B]/40 rounded-full -bottom-6 -left-6" />
          <div className="relative z-10 flex items-center gap-2">
            <motion.div
              animate={{ scale: [1, 1.4, 1], opacity: [1, 0.4, 1] }}
              transition={{ duration: 1.4, repeat: Infinity }}
              className="w-2 h-2 bg-white rounded-full"
            />
            <span className="text-[8px] md:text-[9px] font-black tracking-[0.15em] uppercase text-white/80">
              Live
            </span>
          </div>
          <div className="relative z-10">
            <h3 className="text-[18px] md:text-[26px] font-[400] text-white trialheader leading-tight">
              Realtime
              <br />
              Updates
            </h3>
            <p className="text-white/60 text-[10px] md:text-[11px] mt-1.5 leading-relaxed">
              Changes go live instantly. No refresh needed.
            </p>
          </div>
        </motion.div>

        {/* 4. Who It's For — 1 col */}
        <motion.div
          variants={cardVariants}
          className="relative bg-[#FED45C] p-4 md:p-6 overflow-hidden flex flex-col
       col-span-1 min-h-[210px] md:min-h-[230px] lg:min-h-[250px]"
        >
          <div className="absolute w-24 h-24 bg-[#F5C840]/40 rounded-full -top-8 -right-8" />
          <div className="relative z-10 mb-2">
            <span className="inline-block text-[8px] md:text-[9px] font-black tracking-[0.15em] uppercase px-2 py-0.5 mb-2 bg-[#5D2D2B] text-[#FED45C]">
              Built for
            </span>
            <h3 className="text-[14px] md:text-[26px] font-[400] text-[#5D2D2B] leading-tight trialheader">
              Everyone
              <br />
              online.
            </h3>
          </div>

          {/* Vertical ticker — fixed height, doesn't stretch the card */}
          <div className="relative h-[90px] overflow-hidden mt-auto">
            <div className="absolute inset-x-0 top-0 h-4 bg-gradient-to-b from-[#FED45C] to-transparent z-10 pointer-events-none" />
            <div className="absolute inset-x-0 bottom-0 h-4 bg-gradient-to-t from-[#FED45C] to-transparent z-10 pointer-events-none" />
            <motion.div
              animate={{ y: ["0%", "-50%"] }}
              transition={{ duration: 9, repeat: Infinity, ease: "linear" }}
              className="flex flex-col gap-1.5"
            >
              {[
                "Musicians",
                "Designers",
                "Creators",
                "Freelancers",
                "Athletes",
                "Podcasters",
                "Sellers",
                "Developers",
                "Influencers",
                "Musicians",
                "Designers",
                "Creators",
                "Freelancers",
                "Athletes",
                "Podcasters",
                "Sellers",
                "Developers",
                "Influencers",
              ].map((label, i) => (
                <div
                  key={i}
                  className="bg-[#5D2D2B]/10 text-[#5D2D2B] text-[9px] md:text-[10px] font-black tracking-wide px-2 py-1 whitespace-nowrap"
                >
                  {label}
                </div>
              ))}
            </motion.div>
          </div>
        </motion.div>

        {/* 5. Integrations — always full width */}
        {/* <motion.div
          variants={cardVariants}
          className="relative bg-[#3EB489] p-4 md:p-6 overflow-hidden
               col-span-3 min-h-[160px]"
        >
          <div className="flex justify-between items-start mb-3">
            <div>
              <span className="inline-block text-[8px] md:text-[9px] font-black tracking-[0.15em] uppercase px-2 py-0.5 mb-2 bg-white/20 text-white">
                Integrations
              </span>
              <h3 className="text-[18px] md:text-[26px] font-[400] text-white trialheader leading-tight">
                50+ Platforms
              </h3>
            </div>
            <p className="text-white/50 text-[10px] font-semibold text-right leading-relaxed hidden sm:block">
              All your socials.
              <br />
              One place.
            </p>
          </div>
          <div className="overflow-hidden">
            <motion.div
              animate={{ x: ["0%", "-50%"] }}
              transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
              className="flex gap-2.5 w-max"
            >
              {allPlatforms.map((name, i) => (
                <div
                  key={`${name}-${i}`}
                  className="w-11 h-11 md:w-12 md:h-12 bg-white/15 flex items-center justify-center flex-shrink-0"
                >
                  <Image
                    src={`/assets/platform-icons/colored/Social=${name},Style=Original.svg`}
                    alt={name}
                    width={28}
                    height={28}
                    className="w-6 h-6 md:w-7 md:h-7 object-contain"
                  />
                </div>
              ))}
            </motion.div>
          </div>
        </motion.div> */}
      </motion.div>
    </section>
  );
}
