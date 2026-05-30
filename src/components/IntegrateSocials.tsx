"use client";
import Image from "next/image";
import { motion, useMotionValue, useAnimationFrame, animate } from "framer-motion";
import { useEffect, useState } from "react";

type Phase = "orbit" | "absorb" | "grow" | "emit";

const ALL_INNER_ICONS = [
  { name: "Instagram", size: 32 },
  { name: "TikTok",    size: 32 },
  { name: "YouTube",   size: 32 },
  { name: "Spotify",   size: 32 },
  { name: "WhatsApp",  size: 32 },
  { name: "Snapchat",  size: 32 },
];

const OUTER_ICONS_ALL = [
  { name: "X ex Twitter", size: 32 },
  { name: "Pinterest",    size: 32 },
  { name: "Figma",        size: 32 },
  { name: "Behance",      size: 32 },
  { name: "Twitch",       size: 32 },
  { name: "Discord",      size: 32 },
  { name: "Reddit",       size: 32 },
  { name: "SoundCloud",   size: 32 },
  { name: "Telegram",     size: 32 },
  { name: "Dribbble",     size: 32 },
  { name: "GitHub",       size: 32 },
  { name: "Slack",        size: 32 },
  { name: "Facebook",     size: 32 },
  { name: "Quora",        size: 32 },
];

const DURATIONS: Record<Phase, number> = {
  orbit: 12000, absorb: 2200, grow: 1000, emit: 900,
};
const NEXT: Record<Phase, Phase> = {
  orbit: "absorb", absorb: "grow", grow: "emit", emit: "orbit",
};

// ─────────────────────────────────────────────
// OrbitIcon
// ─────────────────────────────────────────────

interface OrbitIconProps {
  icon:      { name: string; size: number };
  slotIndex: number;
  total:     number;
  radius:    number;
  phase:     Phase;
  globalRot: ReturnType<typeof useMotionValue<number>>;
  emitSnap:  number;
  bgColor:   string;
  direction?: 1 | -1;
  iconScale: number;
}

function OrbitIcon({
  icon, slotIndex, total, radius, phase, globalRot,
  emitSnap, bgColor, direction = 1, iconScale,
}: OrbitIconProps) {
  const baseAngle  = slotIndex * (360 / total);
  const scaledSize = Math.round(icon.size * iconScale);
  const pad        = Math.round(12 * iconScale);
  const box        = scaledSize + pad;

  const x       = useMotionValue(0);
  const y       = useMotionValue(0);
  const opacity = useMotionValue(0);
  const scale   = useMotionValue(0.1);

  useAnimationFrame(() => {
    if (phase === "orbit") {
      const r     = globalRot.get() * direction;
      const angle = ((baseAngle + r) * Math.PI) / 180;
      x.set(Math.cos(angle) * radius);
      y.set(Math.sin(angle) * radius);
    }
  });

  useEffect(() => {
    const d = slotIndex * 0.08;

    if (phase === "emit") {
      const snap  = emitSnap * direction;
      const angle = ((baseAngle + snap) * Math.PI) / 180;
      animate(opacity, 1, { duration: 0.3, delay: d });
      animate(scale,   1, { type: "spring", stiffness: 90, damping: 14, delay: d });
      animate(x, Math.cos(angle) * radius, { type: "spring", stiffness: 90, damping: 14, delay: d });
      animate(y, Math.sin(angle) * radius, { type: "spring", stiffness: 90, damping: 14, delay: d });
    }

    if (phase === "absorb") {
      animate(x,       0,   { duration: 0.9, ease: [0.4, 0, 1, 1], delay: d });
      animate(y,       0,   { duration: 0.9, ease: [0.4, 0, 1, 1], delay: d });
      animate(opacity, 0,   { duration: 0.6, delay: d });
      animate(scale,   0.1, { duration: 0.7, delay: d });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  return (
    <motion.div
      className="absolute flex items-center justify-center"
      style={{
        width: box, height: box,
        marginLeft: -box / 2, marginTop: -box / 2,
        borderRadius: "50%",
        background: bgColor,
        backdropFilter: "blur(4px)",
        x, y, opacity, scale,
      }}
    >
      <Image
        src={`/assets/platform-icons/colored/Social=${icon.name},Style=Original.svg`}
        alt={icon.name}
        width={scaledSize}
        height={scaledSize}
        className="object-contain w-full h-full p-1"
      />
    </motion.div>
  );
}

// ─────────────────────────────────────────────
// Responsive config — same 6/8 icon count everywhere
// ─────────────────────────────────────────────

interface ResponsiveConfig {
  inner:      number;
  outer:      number;
  size:       number;
  iconScale:  number;
  innerCount: number;
  outerCount: number;
}

function useResponsiveRadii(): ResponsiveConfig {
  const [cfg, setCfg] = useState<ResponsiveConfig>({
    inner: 110, outer: 195, size: 500,
    iconScale: 1.0,
    innerCount: 6, outerCount: 8,
  });

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      if (w < 380)
        // bump radii slightly vs original to give 6/8 icons breathing room
        setCfg({ inner: 76,  outer: 138, size: 340, iconScale: 0.78, innerCount: 6, outerCount: 8 });
      else if (w < 480)
        setCfg({ inner: 84,  outer: 150, size: 370, iconScale: 0.84, innerCount: 6, outerCount: 8 });
      else if (w < 768)
        setCfg({ inner: 96,  outer: 168, size: 410, iconScale: 0.90, innerCount: 6, outerCount: 8 });
      else
        setCfg({ inner: 110, outer: 195, size: 500, iconScale: 1.0,  innerCount: 6, outerCount: 8 });
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return cfg;
}

// ─────────────────────────────────────────────
// OrbitScene
// ─────────────────────────────────────────────

function OrbitScene() {
  const [phase, setPhase]                = useState<Phase>("emit");
  const [outerGroupIndex, setOuterGroup] = useState(0);
  const [emitSnap, setEmitSnap]          = useState(0);
  const globalRot                        = useMotionValue(0);

  // Ring animation motion values
  const ringScale   = useMotionValue(1);
  const ringOpacity = useMotionValue(1);

  const {
    inner: INNER_RADIUS,
    outer: OUTER_RADIUS,
    size:  SIZE,
    iconScale,
    innerCount,
    outerCount,
  } = useResponsiveRadii();

  const innerIcons       = ALL_INNER_ICONS.slice(0, innerCount);
  const totalOuterGroups = Math.ceil(OUTER_ICONS_ALL.length / outerCount);

  // Spin the globalRot during orbit phase
  useAnimationFrame((_, delta) => {
    if (phase === "orbit") {
      globalRot.set((globalRot.get() + delta * 0.005) % 360);
    }
  });

  // Phase transitions + ring animation
  useEffect(() => {
    if (phase === "absorb") {
      setEmitSnap(globalRot.get());
      // Rings contract and fade with the icons
      animate(ringScale,   0.25, { duration: 0.85, ease: [0.4, 0, 1, 1] });
      animate(ringOpacity, 0,    { duration: 0.6 });
    }

    if (phase === "emit") {
      // Rings spring back out as icons burst outward
      animate(ringScale,   1, { type: "spring", stiffness: 80, damping: 14, delay: 0.05 });
      animate(ringOpacity, 1, { duration: 0.35, delay: 0.05 });
    }

    if (phase === "orbit") {
      animate(ringScale,   1, { duration: 0.3 });
      animate(ringOpacity, 1, { duration: 0.25 });
    }

    // "grow" phase: rings stay invisible (no animate call)

    const t = setTimeout(() => {
      if (phase === "absorb") setOuterGroup((p) => (p + 1) % totalOuterGroups);
      setPhase(NEXT[phase]);
    }, DURATIONS[phase]);

    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, outerCount]);

  const start      = (outerGroupIndex * outerCount) % OUTER_ICONS_ALL.length;
  const outerGroup = Array.from({ length: outerCount }, (_, i) =>
    OUTER_ICONS_ALL[(start + i) % OUTER_ICONS_ALL.length]
  );

  return (
    <div
      className="relative flex items-center justify-center mx-auto flex-shrink-0"
      style={{ width: SIZE, height: SIZE }}
    >
      {/* Dashed orbit rings — animate in/out with icons */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          scale:           ringScale,
          opacity:         ringOpacity,
          transformOrigin: "center center",
        }}
      >
        <svg
          className="absolute inset-0"
          width={SIZE}
          height={SIZE}
          viewBox={`0 0 ${SIZE} ${SIZE}`}
        >
          {/* Inner ring */}
          <circle
            cx={SIZE / 2} cy={SIZE / 2} r={INNER_RADIUS}
            fill="none"
            stroke="rgba(93,45,43,0.55)"
            strokeWidth="1.8"
            strokeDasharray="5 6"
            strokeLinecap="round"
          />
          {/* Outer ring */}
          <circle
            cx={SIZE / 2} cy={SIZE / 2} r={OUTER_RADIUS}
            fill="none"
            stroke="rgba(93,45,43,0.38)"
            strokeWidth="1.8"
            strokeDasharray="5 8"
            strokeLinecap="round"
          />
          {/* Inner ring dots */}
          {innerIcons.map((_, i) => {
            const angle = (i * (360 / innerIcons.length) * Math.PI) / 180;
            return (
              <circle key={i}
                cx={SIZE / 2 + Math.cos(angle) * INNER_RADIUS}
                cy={SIZE / 2 + Math.sin(angle) * INNER_RADIUS}
                r="3" fill="rgba(93,45,43,0.55)"
              />
            );
          })}
          {/* Outer ring dots */}
          {outerGroup.map((_, i) => {
            const angle = (i * (360 / outerCount) * Math.PI) / 180;
            return (
              <circle key={i}
                cx={SIZE / 2 + Math.cos(angle) * OUTER_RADIUS}
                cy={SIZE / 2 + Math.sin(angle) * OUTER_RADIUS}
                r="3" fill="rgba(93,45,43,0.38)"
              />
            );
          })}
        </svg>
      </motion.div>

      {/* Inner ring — clockwise */}
      {innerIcons.map((icon, i) => (
        <OrbitIcon
          key={`inner-${icon.name}-${innerCount}`}
          icon={icon}
          slotIndex={i}
          total={innerIcons.length}
          radius={INNER_RADIUS}
          phase={phase}
          globalRot={globalRot}
          emitSnap={emitSnap}
          direction={1}
          bgColor="rgba(255,255,255,0.22)"
          iconScale={iconScale}
        />
      ))}

      {/* Outer ring — counter-clockwise */}
      {outerGroup.map((icon, i) => (
        <OrbitIcon
          key={`outer-${icon.name}-${outerGroupIndex}-${outerCount}`}
          icon={icon}
          slotIndex={i}
          total={outerCount}
          radius={OUTER_RADIUS}
          phase={phase}
          globalRot={globalRot}
          emitSnap={emitSnap}
          direction={-1}
          bgColor="rgba(254,212,92,0.18)"
          iconScale={iconScale}
        />
      ))}

      {/* Center logo */}
      <motion.div
        className="relative z-10 flex items-center justify-center rounded-2xl"
        animate={{
          scale: phase === "grow" ? 1.28 : phase === "absorb" ? 1.1 : 1,
        }}
        transition={{ type: "spring", stiffness: 80, damping: 16 }}
        style={{ width: 64, height: 64 }}
      >
        <Image
          src="/icons/A.Bio.png"
          alt="A.Bio Logo"
          width={48}
          height={48}
          priority
          className="object-contain w-8 h-8 md:w-11 md:h-11"
        />
      </motion.div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Section
// ─────────────────────────────────────────────

export default function IntegrationsSection() {
  return (
    <section className="w-full px-4 sm:px-8 md:px-12 lg:px-20 py-16 md:py-24 overflow-hidden">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">

          <motion.div
            initial={{ opacity: 0, x: -28 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            className="flex flex-col gap-6 text-left items-start"
          >
            <div>
              <p className="text-[10px] font-black tracking-[0.2em] text-[#5D2D2B]/40 uppercase mb-3">
                Works with everything
              </p>
              <h2 className="text-[36px] sm:text-[44px] xl:text-[60px] trialheader font-[400] text-[#5D2D2B] leading-[0.9] tracking-tight">
                50+ Platforms.<br />
                <span>One link.</span>
              </h2>
            </div>
            <p className="text-[#5D2D2B]/55 text-sm font-light leading-relaxed max-w-xs">
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

          <div className="flex justify-center items-center w-full overflow-visible py-6">
            <OrbitScene />
          </div>

        </div>
      </div>
    </section>
  );
}