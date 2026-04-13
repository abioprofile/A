"use client";
import Image from "next/image";
import { motion, useMotionValue, useAnimationFrame, animate } from "framer-motion";
import { useEffect, useState } from "react";

type Phase = "orbit" | "absorb" | "grow" | "emit";

const ALL_ICONS = [
  { name: "Instagram",  size: 38 },
  { name: "TikTok",     size: 34 },
  { name: "YouTube",    size: 42 },
  { name: "Spotify",    size: 34 },
  { name: "Twitter",    size: 38 },
  { name: "LinkedIn",   size: 34 },
  { name: "Snapchat",   size: 36 },
  { name: "WhatsApp",   size: 40 },
  { name: "Facebook",   size: 34 },
  { name: "Pinterest",  size: 38 },
  { name: "Figma",      size: 34 },
  { name: "Behance",    size: 36 },
  { name: "Twitch",     size: 38 },
  { name: "Discord",    size: 34 },
  { name: "Reddit",     size: 40 },
  { name: "SoundCloud", size: 36 },
  { name: "Telegram",   size: 34 },
  { name: "Dribbble",   size: 38 },
  { name: "GitHub",     size: 34 },
  { name: "Slack",      size: 36 },
];

const GROUP_SIZE   = 6;
const ORBIT_RADIUS = 148;

const ICON_BGS = [
  "rgba(255,255,255,0.14)",
  "rgba(254,212,92,0.18)",
  "rgba(255,133,74,0.18)",
  "rgba(255,255,255,0.10)",
  "rgba(254,212,92,0.12)",
  "rgba(255,133,74,0.14)",
];

const DURATIONS: Record<Phase, number> = {
  orbit:  12000,
  absorb: 2400,
  grow:   1200,
  emit:   1000,
};

const NEXT: Record<Phase, Phase> = {
  orbit: "absorb", absorb: "grow", grow: "emit", emit: "orbit",
};

interface OrbitIconProps {
  icon: { name: string; size: number };
  slotIndex: number;
  phase: Phase;
  globalRot: ReturnType<typeof useMotionValue<number>>;
  emitSnap: number;
  bgColor: string;
}

function OrbitIcon({ icon, slotIndex, phase, globalRot, emitSnap, bgColor }: OrbitIconProps) {
  const baseAngle = slotIndex * (360 / GROUP_SIZE);
  const pad       = 14;
  const box       = icon.size + pad;

  const x       = useMotionValue(0);
  const y       = useMotionValue(0);
  const opacity = useMotionValue(0);
  const scale   = useMotionValue(0.1);

  // During orbit — set x/y every frame directly from the global rotation
  useAnimationFrame(() => {
    if (phase === "orbit") {
      const r     = globalRot.get();
      const angle = ((baseAngle + r) * Math.PI) / 180;
      x.set(Math.cos(angle) * ORBIT_RADIUS);
      y.set(Math.sin(angle) * ORBIT_RADIUS);
    }
  });

  // On phase change — imperatively animate to/from center
  useEffect(() => {
    const d = slotIndex * 0.1;

    if (phase === "emit") {
      const angle = ((baseAngle + emitSnap) * Math.PI) / 180;
      const tx    = Math.cos(angle) * ORBIT_RADIUS;
      const ty    = Math.sin(angle) * ORBIT_RADIUS;
      animate(opacity, 1,  { duration: 0.35, delay: d });
      animate(scale,   1,  { type: "spring", stiffness: 85, damping: 12, delay: d });
      animate(x,       tx, { type: "spring", stiffness: 85, damping: 12, delay: d });
      animate(y,       ty, { type: "spring", stiffness: 85, damping: 12, delay: d });
    }

    if (phase === "absorb") {
      const ad = slotIndex * 0.12;
      animate(x,       0,   { duration: 1.0, ease: [0.4, 0, 1, 1], delay: ad });
      animate(y,       0,   { duration: 1.0, ease: [0.4, 0, 1, 1], delay: ad });
      animate(opacity, 0,   { duration: 0.7, delay: ad });
      animate(scale,   0.1, { duration: 0.8, delay: ad });
    }
  }, [phase]);

  return (
    <motion.div
      className="absolute flex items-center justify-center"
      style={{
        width: box,
        height: box,
        marginLeft: -box / 2,
        marginTop:  -box / 2,
        borderRadius: 12,
        background: bgColor,
        x,
        y,
        opacity,
        scale,
      }}
    >
      <Image
        src={`/assets/platform-icons/colored/Social=${icon.name},Style=Original.svg`}
        alt={icon.name}
        width={icon.size}
        height={icon.size}
        className="object-contain w-full h-full p-0.5"
      />
    </motion.div>
  );
}

function OrbitScene() {
  const [phase, setPhase]           = useState<Phase>("emit");
  const [groupIndex, setGroupIndex] = useState(0);
  const [emitSnap, setEmitSnap]     = useState(0);
  const globalRot                   = useMotionValue(0);
  const totalGroups                 = Math.ceil(ALL_ICONS.length / GROUP_SIZE);

  useAnimationFrame((_, delta) => {
    if (phase === "orbit") {
      globalRot.set((globalRot.get() + delta * 0.006) % 360);
    }
  });

  useEffect(() => {
    if (phase === "absorb") {
      setEmitSnap(globalRot.get());
    }
    const t = setTimeout(() => {
      if (phase === "absorb") {
        setGroupIndex((prev) => (prev + 1) % totalGroups);
      }
      setPhase(NEXT[phase]);
    }, DURATIONS[phase]);
    return () => clearTimeout(t);
  }, [phase]);

  const start        = (groupIndex * GROUP_SIZE) % ALL_ICONS.length;
  const currentGroup = Array.from({ length: GROUP_SIZE }, (_, i) =>
    ALL_ICONS[(start + i) % ALL_ICONS.length]
  );

  return (
    <div className="relative w-[320px] h-[320px] md:w-[400px] md:h-[400px] flex items-center justify-center mx-auto">

      {currentGroup.map((icon, i) => (
        <OrbitIcon
          key={`${icon.name}-${groupIndex}`}
          icon={icon}
          slotIndex={i}
          phase={phase}
          globalRot={globalRot}
          emitSnap={emitSnap}
          bgColor={ICON_BGS[i % ICON_BGS.length]}
        />
      ))}

      {/* Logo */}
      <motion.div
        className="relative z-10 flex items-center justify-center"
        animate={{
          scale: phase === "grow" ? 1.3 : phase === "absorb" ? 1.12 : 1,
        }}
        transition={{ type: "spring", stiffness: 80, damping: 16 }}
      >
        <Image
          src="/icons/A.Bio.png"
          alt="A.Bio Logo"
          width={64}
          height={64}
          priority
          className="w-14 h-14 md:w-16 md:h-16 object-contain"
        />
      </motion.div>

    </div>
  );
}

export default function IntegrationsSection() {
  return (
    <section className="w-full bg-[#3EB489] px-4 sm:px-8 md:px-12 lg:px-20 py-16 md:py-24 overflow-hidden">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">

          <motion.div
            initial={{ opacity: 0, x: -28 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            className="flex flex-col gap-6"
          >
            <div>
              <p className="text-[10px] font-black tracking-[0.2em] text-white/40 uppercase mb-3">
                Works with everything
              </p>
              <h2 className="text-[40px] xl:text-[60px] trialheader font-[400] text-white leading-[0.9] tracking-tight">
                50+ Platforms.<br />
                <span className="text-[#FED45C]">One link.</span>
              </h2>
            </div>
            <p className="text-white/55 text-sm font-light leading-relaxed max-w-xs">
              Connect all your platforms and manage every link from one
              clean dashboard. New integrations added every week.
            </p>
            <motion.button
              whileHover={{ scale: 1.04, boxShadow: "4px 4px 0px 0px #000" }}
              whileTap={{ scale: 0.97 }}
              className="bg-[#FED45C] text-[#5D2D2B] font-black text-sm h-12 px-8
                         shadow-[3px_3px_0px_0px_#000] transition-shadow duration-200 w-fit"
            >
              See all integrations
            </motion.button>
          </motion.div>

          <OrbitScene />

        </div>
      </div>
    </section>
  );
}