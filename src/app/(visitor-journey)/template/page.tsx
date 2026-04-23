"use client"
import NavBar from '@/components/partials/NavBar'
import Footer from '@/components/Footer'
import { TemplateCard } from '@/components/templates/TemplateCard'
import { useGetThemes } from '@/hooks/api/useAuth'
import { AppearanceTheme } from '@/types/appearance.types'
import { TemplateConfig, ProfileInfo, LinkItem } from '@/interfaces/template.interface'
import { themePreviewStyle } from '@/lib/helpers/appearance'
import { templates as staticTemplates } from '@/data'
import { useRouter } from 'next/navigation'
import React, { useRef, useState, useEffect } from 'react'
import { motion, useInView, useScroll, useTransform } from 'framer-motion'

const defaultProfile: ProfileInfo = {
  name: "Mary Godwin",
  username: "Mayeetee",
  bio: "Unleashing creativity, one link at a time.",
  avatar: "/icons/osh.svg",
  location: "Embu, Kenya",
}

const defaultLinks: LinkItem[] = [
  { text: "Instagram",    url: "#" },
  { text: "Behance",      url: "#" },
  { text: "Snapchat",     url: "#" },
  { text: "Twitter",      url: "#" },
  { text: "My Portfolio", url: "#" },
]

function themeToTemplateConfig(theme: AppearanceTheme, index: number): TemplateConfig {
  const preview = themePreviewStyle(theme.wallpaper_config as Parameters<typeof themePreviewStyle>[0])
  const buttonStyle: TemplateConfig["style"]["buttonStyle"] =
    theme.corner_config?.type === "sharp" ? "square"
    : theme.corner_config?.type === "round" ? "pill"
    : "rounded"
  const hasStroke = !!theme.corner_config?.strokeColor && theme.corner_config.strokeColor !== "#00000000"
  return {
    id: `theme-${index}-${theme.name}`,
    name: theme.name,
    profile: defaultProfile,
    links: defaultLinks,
    style: {
      backgroundColor: preview.backgroundColor as string | undefined,
      backgroundImage: preview.backgroundImage as string | undefined,
      textColor:       theme.font_config?.fillColor    || "#333333",
      buttonColor:     theme.corner_config?.fillColor  || "#ffffff",
      buttonTextColor: theme.font_config?.fillColor    || "#333333",
      accentColor:     theme.corner_config?.strokeColor,
      fontFamily:      theme.font_config?.name ? `'${theme.font_config.name}', sans-serif` : "'Inter', sans-serif",
      buttonStyle,
      buttonBorder: hasStroke,
      buttonEffect: theme.corner_config?.shadowSize === "hard" ? "3d" : "flat",
    },
  }
}

// ── Marquee ticker ─────────────────────────────────────────────────────────
const TICKER_WORDS = [
  "WOODEN","METAL","COMICAL","CUSTOM","BRANDED",
  "MINIMAL","BOLD","VIBRANT","ELEGANT","WILD",
]

const Ticker = () => (
  <div className="overflow-hidden py-3 bg-[#5D2D2B] border-y border-[#5D2D2B]">
    <motion.div
      className="flex gap-8 whitespace-nowrap"
      animate={{ x: ["0%", "-50%"] }}
      transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
    >
      {[...TICKER_WORDS,...TICKER_WORDS,...TICKER_WORDS,...TICKER_WORDS].map((w, i) => (
        <span key={i} className="flex items-center gap-8">
          <span className="text-[11px] font-black tracking-[0.3em] text-[#FED45C] uppercase">{w}</span>
          <span className="text-[#FED45C]/40 text-lg">✦</span>
        </span>
      ))}
    </motion.div>
  </div>
)

const FILTERS = ["All", "Minimal", "Bold", "Dark", "Light", "Colorful"]

const SkeletonCard = ({ delay }: { delay: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay }}
    className="w-full h-[22rem] md:h-[38rem] bg-[#5D2D2B]/06 animate-pulse"
  />
)

const AnimatedCard = ({
  template, index, onClick,
}: {
  template: TemplateConfig; index: number; onClick: () => void
}) => {
  const ref    = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.15 })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40, rotate: index % 2 === 0 ? -1.5 : 1.5 }}
      animate={inView ? { opacity: 1, y: 0, rotate: 0 } : {}}
      transition={{ duration: 0.7, delay: (index % 3) * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={{ y: -6, rotate: index % 2 === 0 ? 0.8 : -0.8 }}
      className="group relative cursor-pointer"
    >
      {/* Index label */}
      <div className="absolute -top-3 -left-1 z-20 bg-[#FED45C] px-2 py-0.5
                      shadow-[2px_2px_0px_#000] pointer-events-none">
        <span className="text-[9px] font-black text-[#5D2D2B] tracking-[0.14em]">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>

      {/* Hover glow */}
      <div className="absolute -inset-1 pointer-events-none opacity-0 group-hover:opacity-100
                      transition-opacity duration-300 rounded"
        style={{
          background: "linear-gradient(135deg, rgba(254,212,92,0.15), rgba(93,45,43,0.12))",
          filter: "blur(8px)",
        }}
      />

      <TemplateCard template={template} onClick={onClick} />

      {/* "Use this" overlay */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        whileHover={{ opacity: 1, y: 0 }}
        className="absolute bottom-3 left-0 right-0 flex justify-center
                   pointer-events-none group-hover:pointer-events-auto"
      >
        <button
          onClick={(e) => { e.stopPropagation(); onClick(); }}
          className="bg-[#5D2D2B] text-[#FED45C] text-[10px] font-black
                     tracking-[0.14em] uppercase px-5 py-2
                     shadow-[3px_3px_0px_#000] hover:shadow-[1px_1px_0px_#000]
                     transition-shadow duration-150"
        >
          Use this template →
        </button>
      </motion.div>
    </motion.div>
  )
}

const Counter = ({ count }: { count: number }) => {
  const ref    = useRef(null)
  const inView = useInView(ref, { once: true })
  const [val, setVal] = useState(0)
  useEffect(() => {
    if (!inView) return
    let s = 0
    const step = count / 40
    const t = setInterval(() => {
      s = Math.min(s + step, count)
      setVal(Math.floor(s))
      if (s >= count) clearInterval(t)
    }, 28)
    return () => clearInterval(t)
  }, [inView, count])
  return <span ref={ref} className="tabular-nums">{val}</span>
}

const TemplatePage = () => {
  const router = useRouter()
  const { data, isLoading } = useGetThemes()
  const [activeFilter, setActiveFilter] = useState("All")
  const heroRef = useRef(null)

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  })
  const heroY       = useTransform(scrollYProgress, [0, 1], ["0%", "22%"])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0])

  const apiThemes: AppearanceTheme[]  = Array.isArray(data?.data) ? data.data : []
  const rawCards: TemplateConfig[]    = apiThemes.length > 0 ? apiThemes.map(themeToTemplateConfig) : staticTemplates
  // Always show at least 50 in counts — real count once loaded
  const displayCount = isLoading ? 50 : Math.max(rawCards.length, 50)

  return (
    <>
      <NavBar />

      <main className="min-h-screen bg-[#FEF4EA] overflow-x-hidden">

        {/* ── HERO ── */}
        <section
          ref={heroRef}
          className="relative pt-32 pb-0 overflow-hidden"
          style={{ minHeight: "52vh" }}
        >
          {/* Watermark — bottom-right corner, barely visible */}
          <motion.div
            style={{ y: heroY, opacity: heroOpacity }}
            className="absolute bottom-0 right-0 pointer-events-none select-none overflow-hidden"
          >
            <span
              className="font-black leading-none tracking-tighter block"
              style={{
                fontFamily: "'Georgia', serif",
                fontSize: "38vw",
                lineHeight: 0.78,
                color: "rgba(93,45,43,0.04)",
                transform: "translateX(12%)",
              }}
            >
              A
            </span>
          </motion.div>

          {/* Spinning stars */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
            className="absolute top-36 right-[8%] text-[#FED45C] text-5xl
                       pointer-events-none select-none hidden md:block"
          >
            ✦
          </motion.div>
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-10 left-[6%] text-[#5D2D2B]/18 text-6xl
                       pointer-events-none select-none hidden md:block"
          >
            ✦
          </motion.div>

          <div className="relative z-10 px-4 sm:px-8 md:px-12 lg:px-20">
            <div className="container mx-auto">

              {/* Eyebrow */}
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex items-center gap-3 justify-center mb-6"
              >
                <div className="h-px w-8 bg-[#5D2D2B]/30" />
                <p className="text-[10px] font-black tracking-[0.24em] uppercase text-[#5D2D2B]/45">
                  Template Library
                </p>
                <div className="h-px w-8 bg-[#5D2D2B]/30" />
              </motion.div>

              {/* Main headline */}
              <div className="text-center mb-8">
                <motion.h1
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.65, delay: 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className="trialheader text-[#5D2D2B] leading-[0.88] tracking-tight block"
                  style={{ fontSize: "clamp(48px, 8vw, 96px)" }}
                >
                  Your brand.
                </motion.h1>

                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.65, delay: 0.16, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className="flex items-center justify-center gap-4 flex-wrap"
                >
                  <span
                    className="trialheader text-[#FF0000] leading-[0.88] tracking-tight"
                    style={{ fontSize: "clamp(48px, 8vw, 96px)" }}
                  >
                    Your
                  </span>
                  {/* Badge — between "Your" and "template." */}
                  <span className="bg-[#FED45C] text-[#5D2D2B] font-black text-sm px-4 py-2
                                   shadow-[4px_4px_0px_#000] self-center hidden sm:inline-block
                                   flex-shrink-0">
                    {displayCount}+ templates
                  </span>
                  <span
                    className="trialheader text-[#5D2D2B] leading-[0.88] tracking-tight"
                    style={{ fontSize: "clamp(48px, 8vw, 96px)" }}
                  >
                    template.
                  </span>
                </motion.div>
              </div>

              {/* Sub */}
              <motion.p
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.28 }}
                className="text-center text-sm font-light text-[#5D2D2B]/55
                           leading-relaxed max-w-lg mx-auto mb-10"
              >
                Pick a starting point. Make it yours. No design skills needed.
              </motion.p>

              {/* Stats row */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.36 }}
                className="flex items-center justify-center gap-10 md:gap-16
                           border-t border-b border-[#5D2D2B]/10 py-5"
              >
                {[
                  { n: displayCount, suffix: "+", label: "Templates"    },
                  { n: 12,           suffix: "+", label: "Styles"        },
                  { n: 100,          suffix: "%", label: "Customisable"  },
                ].map(({ n, suffix, label }) => (
                  <div key={label} className="text-center">
                    <p className="text-[32px] md:text-[40px] font-black text-[#5D2D2B]
                                  leading-none tabular-nums">
                      <Counter count={n} />{suffix}
                    </p>
                    <p className="text-[9px] font-black tracking-[0.16em] uppercase
                                  text-[#5D2D2B]/38 mt-1">
                      {label}
                    </p>
                  </div>
                ))}
              </motion.div>

            </div>
          </div>
        </section>

        {/* ── TICKER ── */}
        <Ticker />

        {/* ── FILTER + GRID ── */}
        <div className="px-4 sm:px-8 md:px-12 lg:px-20 pt-12 pb-24">
          <div className="container mx-auto">

            {/* Filter pills */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="flex flex-wrap gap-2 mb-10"
            >
              {FILTERS.map((f) => (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  className="transition-all duration-200 text-[11px] font-black
                             tracking-[0.12em] uppercase px-4 py-2"
                  style={{
                    background:  activeFilter === f ? "#5D2D2B" : "transparent",
                    color:       activeFilter === f ? "#FED45C" : "rgba(93,45,43,0.45)",
                    border:      `1.5px solid ${activeFilter === f ? "#5D2D2B" : "rgba(93,45,43,0.2)"}`,
                    boxShadow:   activeFilter === f ? "3px 3px 0px #000" : "none",
                  }}
                >
                  {f}
                </button>
              ))}
              <div className="ml-auto flex items-center self-center">
                <span className="text-[10px] font-bold text-[#5D2D2B]/35 tracking-[0.1em]">
                  {rawCards.length} results
                </span>
              </div>
            </motion.div>

            {/* Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-3 gap-y-10 md:gap-x-6 md:gap-y-14 w-full">
              {isLoading
                ? Array.from({ length: 6 }).map((_, i) => (
                    <SkeletonCard key={i} delay={i * 0.06} />
                  ))
                : rawCards.map((template, i) => (
                    <AnimatedCard
                      key={template.id}
                      template={template}
                      index={i}
                      onClick={() => router.push("/auth/sign-up")}
                    />
                  ))
              }
            </div>

            {/* Bottom CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="mt-20 pt-12 border-t border-[#5D2D2B]/10
                         flex flex-col md:flex-row items-center
                         justify-between gap-6"
            >
              <div>
                <p className="text-[10px] font-black tracking-[0.2em] uppercase
                              text-[#5D2D2B]/38 mb-2">
                  Can't find what you need?
                </p>
                <h3 className="trialheader text-[28px] md:text-[36px] text-[#5D2D2B]
                               font-[400] leading-tight">
                  Build yours from<br className="hidden md:block" />
                  <span className="text-[#FF0000]">scratch.</span>
                </h3>
              </div>
              <motion.button
                whileHover={{ scale: 1.04, boxShadow: "6px 6px 0px #000" }}
                whileTap={{ scale: 0.97 }}
                onClick={() => router.push("/auth/sign-up")}
                className="bg-[#FED45C] text-[#5D2D2B] font-black text-sm
                           h-14 px-10 shadow-[4px_4px_0px_#000]
                           transition-shadow duration-200 flex-shrink-0"
              >
                Start for free →
              </motion.button>
            </motion.div>

          </div>
        </div>

        <Footer />
      </main>
    </>
  )
}

export default TemplatePage