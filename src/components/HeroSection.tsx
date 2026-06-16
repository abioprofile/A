"use client";

import Image from "next/image";
import React, { useState, useEffect } from "react";
import { Input } from "./ui/input";
import { motion, AnimatePresence } from "framer-motion";

// ─── TYPES
type ButtonStyle = {
  variant: "outline" | "solid" | "glass" | "brutal" | "pill" | "square" | "tag";
  bg?: string;
  color: string;
  borderColor?: string;
  shadow?: string;
  radius?: string;
};

type Link = {
  label: string;
  icon: string;
  style: ButtonStyle;
};

type Profile = {
  name: string;
  handle: string;
  bio: string;
  avatar: string;
  avatarBg: string;
  avatarImg?: string;
  waveRGB: [number, number, number];
  botBg: string;
  patternColor: string;
  dotColor: string;
  links: Link[];
  verified?: boolean;
};

// ─── PROFILES
const PROFILES: Profile[] = [
  {
    name: "Anslem",
    handle: "stereooo",
    bio: "Currency Enthusiast, Crypto & forex trader",
    avatar: "STEREOOO",
    avatarBg: "#0a0a0a",
    waveRGB: [74, 222, 128],
    verified: true,
    botBg: "linear-gradient(170deg,#c8dfc0 0%,#8db87e 40%,#5a8a4e 100%)",
    patternColor: "rgba(255,255,255,0.22)",
    dotColor: "#1f4015",
    links: [
      {
        label: "Twitter",
        icon: "/assets/platform-icons/black/Social=X ex Twitter,Style=Black.svg",
        style: {
          variant: "pill",
          bg: "transparent",
          color: "#1f4015",
          borderColor: "#1f4015",
          shadow: "0 4px 14px rgba(31,64,21,0.3)",
          radius: "0px",
        },
      },
      {
        label: "Whatsapp",
        icon: "/assets/platform-icons/black/Social=WhatsApp,Style=Black.svg",
        style: {
          variant: "pill",
          bg: "transparent",
          color: "#1f4015",
          borderColor: "#1f4015",
          shadow: "0 4px 14px rgba(31,64,21,0.3)",
          radius: "0px",
        },
      },
    ],
  },
  {
    name: "Amma",
    handle: "ammamusicng",
    bio: "Apple Music Up Next Nigeria ✦ Afrobeats",
    avatar: "AMMA",
    avatarImg: "/images/amma.jpg",
    avatarBg: "linear-gradient(135deg,#7c3aed,#4c1d95)",
    waveRGB: [124, 58, 237],
    verified: true,
    botBg: "linear-gradient(170deg,#1a0535 0%,#3b0764 50%,#6d28d9 100%)",
    patternColor: "rgba(192,132,252,0.22)",
    dotColor: "#7c3aed",
    links: [
      {
        label: "Stream 'Closer'",
        icon: "/assets/platform-icons/black/Social=Spotify,Style=Black.svg",
        style: {
          variant: "solid",
          bg: "linear-gradient(135deg,#a855f7,#7c3aed)",
          color: "#fff",
          shadow: "0 8px 24px rgba(168,85,247,0.55), 0 0 32px rgba(168,85,247,0.3)",
          radius: "14px",
        },
      },
      {
        label: "Apple Music",
        icon: "/assets/platform-icons/black/Social=Apple Music,Style=Black.svg",
        style: {
          variant: "solid",
          bg: "linear-gradient(135deg,#a855f7,#7c3aed)",
          color: "#fff",
          shadow: "0 8px 24px rgba(168,85,247,0.55), 0 0 32px rgba(168,85,247,0.3)",
          radius: "14px",
        },
      },
      {
        label: "Book for shows",
        icon: "/assets/platform-icons/black/Social=Calendar,Style=Black.svg",
        style: {
          variant: "solid",
          bg: "linear-gradient(135deg,#a855f7,#7c3aed)",
          color: "#fff",
          shadow: "4px 4px 0 rgba(168,85,247,0.55), 0 0 32px rgba(168,85,247,0.3)",
          radius: "14px",
        },
      },
    ],
  },
  {
    name: "David Osh",
    handle: "Oshnova",
    bio: "Product Designer · NFC Card Pioneer 🪄",
    avatar: "",
    avatarImg: "/images/Rectangle 1188.png",
    avatarBg: "linear-gradient(135deg,#5D2D2B,#331400)",
    waveRGB: [254, 212, 92],
    verified: true,
    botBg: "linear-gradient(170deg,#FED45C 0%,#FF9A3C 60%,#FF6B1A 100%)",
    patternColor: "rgba(93,45,43,0.18)",
    dotColor: "#5D2D2B",
    links: [
      {
        label: "Portfolio",
        icon: "/assets/platform-icons/black/Social=Behance,Style=Black.svg",
        style: {
          variant: "brutal",
          bg: "#5D2D2B",
          color: "#Fff",
          shadow: "4px 4px 0 #000",
          radius: "0px",
        },
      },
      {
        label: "Telegram",
        icon: "/assets/platform-icons/black/Social=Telegram,Style=Black.svg",
        style: {
          variant: "brutal",
          bg: "#5D2D2B",
          color: "#Fff",
          shadow: "4px 4px 0 #000",
          radius: "0px",
        },
      },
      {
        label: "Snapchat",
        icon: "/assets/platform-icons/black/Social=Snapchat,Style=Black.svg",
        style: {
          variant: "brutal",
          bg: "#5D2D2B",
          color: "#Fff",
          shadow: "4px 4px 0 #000",
          radius: "0px",
        },
      },
    ],
  },
  {
    name: "Eunice",
    handle: "euniceaks",
    bio: "Ceramic artist🏺",
    avatar: "CLAY",
    avatarImg: "/images/Rectangle 1189.png",
    avatarBg: "linear-gradient(135deg,#db2777,#9d174d)",
    waveRGB: [219, 39, 119],
    verified: false,
    botBg: "linear-gradient(170deg,#fce7f3 0%,#fbcfe8 40%,#f9a8d4 100%)",
    patternColor: "rgba(157,23,77,0.2)",
    dotColor: "#db2777",
    links: [
      {
        label: "Follow on IG",
        icon: "/assets/platform-icons/black/Social=Instagram,Style=Black.svg",
        style: {
          variant: "solid",
          bg: "#db2777",
          color: "#fff",
          shadow: "0 8px 24px rgba(219,39,119,0.45)",
          radius: "18px",
        },
      },
      {
        label: "Email me",
        icon: "/assets/platform-icons/black/Social=Gmail,Style=Black.svg",
        style: {
          variant: "solid",
          bg: "#db2777",
          color: "#fff",
          shadow: "0 8px 24px rgba(219,39,119,0.45)",
          radius: "18px",
        },
      },
    ],
  },
];

// ─── BADGE DATA
const BADGES = [
  { label: "NFC tap ↗",    bg: "#FED45C",  color: "#000",  left: -260, top: 100, delay: 0,   dur: 3.5 },
  { label: "43k views",    bg: "#fff",     color: "#333",  left: -275, top: 280, delay: 0.6, dur: 4.2 },
  { label: "Live",  icon: "🔴", bg: "#FF0000", color: "#fff", left: 200, top: 80,  delay: 0.2, dur: 3.2 },
  { label: "12.8k clicks", bg: "#fff",     color: "#333",  left: 188,  top: 270, delay: 0.9, dur: 4.8 },
  { label: "74% CTR",      bg: "#3EB489",  color: "#fff",  left: 200,  top: 440, delay: 1.1, dur: 3.8 },
] as const;

// ─── RESPONSIVE SIZING
function useCardSize() {
  const [size, setSize] = useState({
    w: 280,
    h: 580,
    rotY: -22,
    rotX: 8,
    rotZ: 2.5,
    ringSm: 480,
    ringLg: 580,
    showBadges: true,
  });

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      if (w < 380)
        setSize({ w: 230, h: 490, rotY: -6,  rotX: 2, rotZ: 0.5, ringSm: 290, ringLg: 350, showBadges: false });
      else if (w < 640)
        setSize({ w: 250, h: 520, rotY: -8,  rotX: 3, rotZ: 1,   ringSm: 320, ringLg: 390, showBadges: false });
      else if (w < 1024)
        setSize({ w: 265, h: 550, rotY: -16, rotX: 6, rotZ: 2,   ringSm: 430, ringLg: 520, showBadges: true  });
      else
        setSize({ w: 280, h: 580, rotY: -22, rotX: 8, rotZ: 2.5, ringSm: 480, ringLg: 580, showBadges: true  });
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return size;
}

// ─── DOT PATTERN SVG
const DotPattern = ({ color }: { color: string }) => {
  const dotGrid: { x: number; y: number }[] = [];
  for (let r = 0; r < 10; r++)
    for (let c = 0; c < 10; c++) {
      const x = 140 + c * 13 + (r % 2) * 4;
      const y = 180 + r * 13;
      if (x < 280 && y < 360) dotGrid.push({ x, y });
    }
  const cluster = [
    [20, 240],[35, 255],[50, 240],[25, 270],
    [40, 285],[60, 265],[70, 250],[55, 280],[80, 270],
  ];
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 280 360"
      preserveAspectRatio="none"
      className="absolute inset-0 pointer-events-none"
    >
      <line x1="20" y1="60"  x2="120" y2="280" stroke={color} strokeWidth="1"   />
      <line x1="40" y1="40"  x2="140" y2="260" stroke={color} strokeWidth="1"   />
      <line x1="60" y1="20"  x2="160" y2="240" stroke={color} strokeWidth="1"   />
      <line x1="10" y1="80"  x2="90"  y2="280" stroke={color} strokeWidth="0.7" />
      <polyline
        points="30,300 90,140 130,200 160,80 200,300"
        fill="none"
        stroke={color}
        strokeWidth="1.2"
      />
      {dotGrid.map(({ x, y }, i) => (
        <circle key={`g${i}`} cx={x} cy={y} r="2.5" fill={color} />
      ))}
      {cluster.map(([x, y], i) => (
        <circle key={`c${i}`} cx={x} cy={y} r="2.5" fill={color} />
      ))}
      <line x1="180" y1="290" x2="280" y2="290" stroke={color} strokeWidth="0.8" />
      <line x1="200" y1="270" x2="200" y2="360" stroke={color} strokeWidth="0.8" />
      <line x1="240" y1="270" x2="240" y2="360" stroke={color} strokeWidth="0.8" />
      <line x1="180" y1="320" x2="280" y2="320" stroke={color} strokeWidth="0.8" />
    </svg>
  );
};

// ─── LINK BUTTON
const LinkButton = ({ link }: { link: Link }) => {
  const { style } = link;
  const isLightIcon = ["#fff", "#FED45C", "#e9d5ff"].includes(style.color);
  const baseClass = style.variant === "tag" ? "px-2.5 py-1" : "px-3.5 py-1.5";

  return (
    <div
      className={`relative z-[2] flex items-center justify-start gap-2 w-full cursor-pointer
                  transition-transform hover:-translate-y-0.5 ${baseClass}`}
      style={{
        background: style.bg ?? "transparent",
        color: style.color,
        border: style.borderColor ? `2px solid ${style.borderColor}` : "none",
        borderRadius: style.radius ?? "50px",
        boxShadow: style.shadow ?? "none",
      }}
    >
      <Image
        src={link.icon}
        alt=""
        width={style.variant === "tag" ? 12 : 16}
        height={style.variant === "tag" ? 12 : 16}
        className="flex-shrink-0"
        style={{ filter: isLightIcon ? "brightness(0) invert(1)" : "none" }}
      />
      <span
        className={`font-bold ${style.variant === "tag" ? "text-[10px]" : "text-[11px]"}`}
        style={{ color: style.color }}
      >
        {link.label}
      </span>
    </div>
  );
};

// ─── AVATAR
const Avatar = ({ profile }: { profile: Profile }) => (
  <div
    className="w-[48px] h-[48px] rounded-full flex items-center justify-center
               flex-shrink-0 shadow-[0_4px_12px_rgba(0,0,0,0.15)] overflow-hidden"
    style={{ background: profile.avatarBg }}
  >
    {profile.avatarImg ? (
      <Image
        src={profile.avatarImg}
        alt={profile.name}
        width={48}
        height={48}
        className="w-full h-full object-cover"
      />
    ) : (
      <span className="text-white font-black text-[10px] tracking-[-0.3px] md:text-center leading-tight">
        {profile.avatar}
      </span>
    )}
  </div>
);

// ─── PROFILE CARD
const ProfileCard = ({ profile }: { profile: Profile }) => (
  <div className="absolute inset-0 flex flex-col" style={{ background: "#fff" }}>
    {/* WHITE TOP */}
    <div className="bg-white px-4 pt-6 pb-3 text-left flex-shrink-0">
      <div className="flex items-start gap-2 mb-2.5">
        <Avatar profile={profile} />
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-1.5 mb-0.5">
            <span className="text-[12px] font-extrabold text-[#0a0a0a] leading-tight">
              {profile.name}
            </span>
            {profile.verified && (
              <div
                className="w-[16px] h-[16px] rounded-full bg-[#FF0000] flex items-center
                           justify-center flex-shrink-0 shadow-[0_2px_6px_rgba(255,0,0,0.3)]"
              >
                <svg width="7" height="7" viewBox="0 0 11 9" fill="none">
                  <path
                    d="M1 4.5L4 7.5L10 1.5"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            )}
          </div>
          <div className="text-[9px] text-[#999] font-medium">/{profile.handle}</div>
          <p className="text-[9px] mt-1 text-[#444] leading-[1.5] sm:truncate font-medium mb-3">
            {profile.bio}
          </p>
        </div>
      </div>

      <div className="flex">
        <div className="inline-flex flex-col items-center relative">
          <span className="text-[10px] leading-none font-thin">Links</span>
          <div className="absolute -bottom-3 -left-0.5 -right-0.5 h-[2.5px] bg-[#FF0000] rounded-sm" />
        </div>
      </div>
    </div>

    {/* COLORED BOTTOM */}
    <div
      className="flex-1 px-4 py-4 relative overflow-hidden flex flex-col gap-2"
      style={{ background: profile.botBg }}
    >
      <DotPattern color={profile.patternColor} />
      {profile.links.map((link, i) => (
        <LinkButton key={`${link.label}-${i}`} link={link} />
      ))}
    </div>
  </div>
);

// ─── 3D TILTED CARD
const TiltedCard = () => {
  const [idx, setIdx] = useState(0);
  const [hovering, setHovering] = useState(false);
  const { w, h, rotY, rotX, rotZ, ringSm, ringLg, showBadges } = useCardSize();

  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % PROFILES.length), 4500);
    return () => clearInterval(t);
  }, []);

  const profile = PROFILES[idx];

  return (
    <div
      className="relative flex flex-col items-center"
      style={{ perspective: 1400, perspectiveOrigin: "50% 45%" }}
    >
      {/* Orbit rings */}
      <motion.div
        className="absolute rounded-full border border-dashed border-[#5D2D2B]/10 pointer-events-none"
        style={{
          width: ringSm, height: ringSm,
          top: "50%", left: "50%",
          marginLeft: -ringSm / 2, marginTop: -ringSm / 2,
          zIndex: 1,
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
      >
        <div
          className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-[#FED45C]"
          style={{ boxShadow: "0 0 12px #FED45C" }}
        />
      </motion.div>
      <motion.div
        className="absolute rounded-full border border-dashed border-[#5D2D2B]/[0.06] pointer-events-none"
        style={{
          width: ringLg, height: ringLg,
          top: "50%", left: "50%",
          marginLeft: -ringLg / 2, marginTop: -ringLg / 2,
          zIndex: 1,
        }}
        animate={{ rotate: -360 }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
      />

      {/* ── DESKTOP: floating positioned badges ── */}
      {showBadges &&
        BADGES.map((b) => (
          <motion.div
            key={b.label}
            className="absolute flex items-center gap-1.5 px-2 py-1.5 z-[5]
                       pointer-events-none whitespace-nowrap"
            style={{
              background: b.bg,
              color: b.color,
              left: `calc(50% + ${b.left}px)`,
              top: b.top,
              fontSize: 9,
              fontWeight: 800,
              boxShadow: "0 8px 28px rgba(0,0,0,0.18), 0 2px 8px rgba(0,0,0,0.1)",
            }}
            animate={{ y: [0, -9, 0] }}
            transition={{ duration: b.dur, repeat: Infinity, ease: "easeInOut", delay: b.delay }}
          >
            {"icon" in b && <span>{b.icon}</span>}
            <span>{b.label}</span>
          </motion.div>
        ))}

      {/* ── MOBILE: marquee strip below card ── */}
      {!showBadges && (
        <div
          className="absolute bottom-[-36px] left-0 right-0 overflow-hidden z-[5] pointer-events-none"
          style={{
            WebkitMaskImage:
              "linear-gradient(to right, transparent, black 12%, black 88%, transparent)",
            maskImage:
              "linear-gradient(to right, transparent, black 12%, black 88%, transparent)",
          }}
        >
          <motion.div
            className="flex gap-2 w-max"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
          >
            {[...BADGES, ...BADGES].map((b, i) => (
              <div
                key={i}
                className="flex items-center gap-1 px-2.5 py-1 whitespace-nowrap"
                style={{
                  background: b.bg,
                  color: b.color,
                  fontSize: 9,
                  fontWeight: 800,
                  boxShadow: "0 4px 14px rgba(0,0,0,0.15)",
                }}
              >
                {"icon" in b && <span>{b.icon}</span>}
                <span>{b.label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      )}

      {/* Card */}
      <motion.div
        className="relative"
        style={{ transformStyle: "preserve-3d", zIndex: 3 }}
        animate={{
          rotateY: hovering ? rotY / 2 : rotY,
          rotateX: hovering ? rotX / 2 : rotX,
          rotateZ: hovering ? rotZ / 2 : rotZ,
          scale: hovering ? 1.02 : 1,
        }}
        transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
        onHoverStart={() => setHovering(true)}
        onHoverEnd={() => setHovering(false)}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={profile.handle}
            initial={{ rotateY: 90, opacity: 0, scale: 0.88 }}
            animate={{ rotateY: 0, opacity: 1, scale: 1 }}
            exit={{ rotateY: -90, opacity: 0, scale: 0.88 }}
            transition={{ duration: 0.85, ease: [0.645, 0.045, 0.355, 1.0] }}
            className="relative overflow-hidden"
            style={{
              width: w,
              height: h,
              transformStyle: "preserve-3d",
              backfaceVisibility: "hidden",
              boxShadow: [
                "0 30px 60px rgba(0,0,0,0.3)",
                "0 16px 32px rgba(0,0,0,0.18)",
                "0 6px 12px rgba(0,0,0,0.1)",
              ].join(","),
            }}
          >
            <ProfileCard profile={profile} />
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* Dots */}
      <div className="flex justify-center gap-1.5 mt-5 relative z-10">
        {PROFILES.map((p, i) => (
          <motion.button
            key={i}
            onClick={() => setIdx(i)}
            animate={{ width: i === idx ? 20 : 5, opacity: i === idx ? 1 : 0.25 }}
            transition={{ duration: 0.3 }}
            className="h-[5px] rounded-full cursor-pointer"
            style={{ background: p.dotColor }}
          />
        ))}
      </div>
    </div>
  );
};

// ─── HERO SECTION
const HeroSection = () => {
  return (
    <section
      className="min-h-screen w-full bg-[#FEF4EA] flex items-center px-4 sm:px-8 md:px-12 lg:px-20
                 overflow-hidden pt-24 sm:pt-28 md:pt-28 pb-8 md:pb-0"
    >
      <div
        className="w-full
                   md:container md:mx-auto
                   md:grid md:grid-cols-2 md:gap-6 lg:gap-12 md:items-center md:py-0"
      >
        {/* ── MOBILE (< md) ── */}
        <div className="flex flex-col mt-20 md:hidden items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="w-full"
          >
            <h1
              className="text-[40px] leading-[0.88] trialheader font-[400]
                         text-[#5D2D2B] tracking-tight"
            >
              Endless
              <br />
              Connection
            </h1>

            <div className="relative inline-block mt-1">
              <p className="text-[28px] trial text-[#5D2D2B] italic leading-tight">
                In just A Biography.
              </p>
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 220, damping: 18, delay: 0.5 }}
              >
                <Image
                  src="/images/scribble.svg"
                  alt=""
                  width={160}
                  height={160}
                  className="absolute right-2 -bottom-2 w-[4.5rem] xs:w-[5rem] sm:w-[6rem] pointer-events-none"
                />
              </motion.div>
            </div>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35, duration: 0.6 }}
            className="text-center md:text-left text-[14px] leading-[1.65] text-[#5D2D2B]/80 mt-5"
          >
            With Abio, a simple biography becomes more than just words it
            becomes your bridge to endless connections. Abio helps you showcase
            your social links all in a single link and dynamic profile.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="flex flex-col items-center gap-2.5 w-full mt-6"
          >
            <div className="relative w-full max-w-[310px]">
              <span
                className="absolute left-3.5 top-1/2  -translate-y-1/2 text-black
                           font-semibold text-[15px] select-none z-10"
              >
                abio.site/
              </span>
              <Input
                placeholder=""
                className="pl-[81px] border-0 font-medium text-[13px] h-11
                           placeholder:font-semibold placeholder:text-[#8B4646]
                           w-full rounded-none focus-visible:ring-0
                           focus-visible:ring-offset-0 bg-[#FED45C]"
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="w-full h-11 bg-[#5D2D2B] max-w-[290px] text-[#FED45C] font-black
                         text-[13px] shadow-[3px_3px_0px_0px_#000000]
                         hover:shadow-[4px_4px_0px_0px_#000000]
                         transition-shadow duration-200"
            >
              Get Abio for free
            </motion.button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.7 }}
            className="mt-10 mb-6"
          >
            <TiltedCard />
          </motion.div>
        </div>

        {/* ── TABLET/DESKTOP LEFT — text ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="hidden md:block space-y-6 lg:space-y-8 pt-8 pb-10 md:py-0 relative z-10"
        >
          <div className="space-y-2">
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-[48px] md:text-[54px] lg:text-[70px] xl:text-[86px]
                         leading-[1] trialheader font-[400] text-[#5D2D2B]"
            >
              Endless
              <br />
              Connection
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.6 }}
              className="relative inline-block"
            >
              <p className="text-2xl md:text-3xl lg:text-5xl trial text-[#5D2D2B] italic">
                In just A Biography.
              </p>
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 220, damping: 18, delay: 0.5 }}
              >
                <Image
                  src="/images/scribble.svg"
                  alt="decoration"
                  width={160}
                  height={160}
                  className="absolute right-0 top-9 md:top-10 lg:top-11
                             w-[6rem] md:w-[8rem] lg:w-[10rem] pointer-events-none"
                />
              </motion.div>
            </motion.div>
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45, duration: 0.6 }}
            className="text-[13px] md:text-sm lg:text-base leading-[1.7]
                       md:max-w-xl lg:max-w-2xl text-[#5D2D2B]"
          >
            With Abio, a simple biography becomes more than just words — it
            becomes your bridge to endless connections. Abio helps you showcase
            your essential details, achievements, and social links all in a
            single link and dynamic profile.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="grid grid-cols-2 gap-2 w-full overflow-hidden"
          >
            <div className="relative min-w-0 overflow-hidden">
              <span
                className="absolute left-3 top-1/2 -translate-y-1/2 text-black
                           font-semibold text-[15px] md:text-[16px] lg:text-[20px]
                           select-none z-10 whitespace-nowrap"
              >
                abio.site/
              </span>
              <Input
                placeholder=""
                className="pl-[70px] md:pl-[75px] lg:pl-[85px] w-full border-0
                           font-medium text-[13px] md:text-[14px] h-11 md:h-12
                           placeholder:font-semibold placeholder:text-[#8B4646]
                           rounded-none focus-visible:ring-0
                           focus-visible:ring-offset-0 bg-[#FED45C] min-w-0"
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="h-11 md:h-12 px-2 bg-[#5D2D2B] text-[#FED45C] font-black
                         text-[12px] md:text-[13px] whitespace-nowrap
                         shadow-[3px_3px_0px_0px_#000000]
                         hover:shadow-[4px_4px_0px_0px_#000000]
                         transition-shadow duration-200 w-full relative z-10"
            >
              Get Abio for free
            </motion.button>
          </motion.div>
        </motion.div>

        {/* ── TABLET/DESKTOP RIGHT — card ── */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="hidden md:flex items-center justify-center relative py-4 lg:py-8"
        >
          <TiltedCard />
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;