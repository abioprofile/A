"use client"

import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"

/* ─── Types ──────────────────────────────────────────────────────────────── */
interface MenuItem { name: string; price: number; volume?: string }
interface Section  { label?: string; items: MenuItem[] }
interface Category { id: string; label: string; sections: Section[] }

const fmt = (n: number) => `₦${n.toLocaleString("en-NG")}`

/* ─── Club Six Seven — Red Room Menu ────────────────────────────────────── */
const CATEGORIES: Category[] = [
  {
    id: "champagne",
    label: "Champagne",
    sections: [
      {
        items: [
          { name: "Dom Pérignon Brut",        price: 1_300_000              },
          { name: "Dom Pérignon Brut Magnum",  price: 3_000_000, volume: "1.75LTR" },
          { name: "Dom Pérignon Rose",         price: 1_800_000              },
          { name: "Ace of Spade Brut",         price: 1_300_000              },
          { name: "Ace of Spade Demi Sec",     price: 1_800_000              },
          { name: "Ace of Spade Rose",         price: 2_000_000              },
          { name: "Cristal",                   price: 1_300_000              },
          { name: "Cristal Magnum",            price: 3_000_000, volume: "1.75LTR" },
          { name: "Ruinart Blanc de Blancs",   price: 1_000_000              },
        ],
      },
    ],
  },
  {
    id: "cognac",
    label: "Cognac",
    sections: [
      {
        label: "Hennessy",
        items: [
          { name: "Hennessy X.O",      price: 1_000_000              },
          { name: "Hennessy XO",       price: 1_500_000, volume: "1LTR"    },
          { name: "Hennessy XO",       price: 2_000_000, volume: "1.5LTR"  },
          { name: "Hennessy Paradis",  price: 6_000_000              },
        ],
      },
      {
        label: "Martell",
        items: [
          { name: "Martell X.O",   price: 1_000_000 },
          { name: "Martell X.X.O", price: 2_000_000 },
        ],
      },
      {
        label: "Remy Martin",
        items: [
          { name: "Remy Martin X.O", price: 1_000_000 },
        ],
      },
      {
        label: "Rémy Louis XIII",
        items: [
          { name: "Louis XIII", price: 14_000_000 },
        ],
      },
    ],
  },
  {
    id: "whisky",
    label: "Whisky",
    sections: [
      {
        label: "Blended",
        items: [
          { name: "Blue Label", price: 1_000_000 },
        ],
      },
      {
        label: "Glenfiddich",
        items: [
          { name: "Glenfiddich 21yrs", price:  1_100_000 },
          { name: "Glenfiddich 22yrs", price:  1_350_000 },
          { name: "Glenfiddich 23yrs", price:  1_600_000 },
          { name: "Glenfiddich 26yrs", price:  3_200_000 },
          { name: "Glenfiddich 30yrs", price:  6_000_000 },
          { name: "Glenfiddich 31yrs", price: 10_000_000 },
        ],
      },
    ],
  },
  {
    id: "tequila",
    label: "Tequila",
    sections: [
      {
        label: "Clase Azul",
        items: [
          { name: "Clase Azul Reposado", price: 1_300_000              },
          { name: "Clase Azul Reposado", price: 2_800_000, volume: "1.75LTR" },
          { name: "Clase Azul Gold",     price: 2_500_000              },
          { name: "Clase Azul Anejo",    price: 2_850_000              },
          { name: "Clase Azul Mezcal",   price: 2_000_000              },
        ],
      },
      {
        label: "Don Julio",
        items: [
          { name: "Don Julio 1942", price: 1_300_000, volume: "750ML"    },
          { name: "Don Julio 1942", price: 2_950_000, volume: "1.75LTR"  },
        ],
      },
      {
        label: "Casamigos",
        items: [
          { name: "Casamigos", price: 1_000_000, volume: "750ML"    },
          { name: "Casamigos", price: 1_500_000, volume: "1LTR"     },
          { name: "Casamigos", price: 2_000_000, volume: "1.75LTR"  },
        ],
      },
      {
        label: "Others",
        items: [
          { name: "818 Eight Reserve",   price: 1_300_000 },
          { name: "Esquisito Tequila",   price: 1_300_000 },
          { name: "Komos Rose",          price: 1_000_000 },
          { name: "Komos Anejo",         price: 1_000_000 },
          { name: "Volcan XA",           price: 1_000_000 },
          { name: "Miradiva Reposado",   price: 1_200_000 },
          { name: "Miradiva Rosa",       price: 1_100_000 },
          { name: "Miradiva Blanco",     price: 1_000_000 },
        ],
      },
    ],
  },
  {
    id: "soft-drink",
    label: "Soft Drink",
    sections: [
      {
        items: [
          { name: "Coke",            price:  7_000 },
          { name: "Cranberry",       price:  6_000 },
          { name: "Redbull",         price:  7_000 },
          { name: "Voss Water",      price:  7_000 },
          { name: "Orange Juice",    price: 20_000 },
          { name: "Tropical Juice",  price: 20_000 },
          { name: "Pineapple Juice", price: 20_000 },
        ],
      },
    ],
  },
  {
    id: "smoke",
    label: "Smoke",
    sections: [
      {
        label: "Lounge",
        items: [
          { name: "Shisha (any flavor)", price: 100_000 },
          { name: "Cigar",               price: 100_000 },
          { name: "Azul Vape",           price: 100_000 },
        ],
      },
      {
        label: "Premium Shisha Flavors",
        items: [
          { name: "Orange",                    price: 100_000 },
          { name: "Super Lemon Mint",          price: 100_000 },
          { name: "Grape",                     price: 100_000 },
          { name: "Melon",                     price: 100_000 },
          { name: "Spearmint Heat",            price: 100_000 },
          { name: "White Flash",               price: 100_000 },
          { name: "Orange with Mint",          price: 100_000 },
          { name: "Strawberry and Mint",       price: 100_000 },
          { name: "Mango",                     price: 100_000 },
          { name: "Love 66",                   price: 100_000 },
          { name: "Double Apple with Mint",    price: 100_000 },
          { name: "Spearmint with Mastic",     price: 100_000 },
          { name: "Mint",                      price: 100_000 },
          { name: "Double Apple and Mint",     price: 100_000 },
          { name: "Spearmint with Fresh Mint", price: 100_000 },
          { name: "Blueberry with Mint",       price: 100_000 },
        ],
      },
    ],
  },
]

/* ─── Helpers ────────────────────────────────────────────────────────────── */
const totalItems = (cat: Category) =>
  cat.sections.reduce((n, s) => n + s.items.length, 0)

/* ─── Component ──────────────────────────────────────────────────────────── */
export default function ClubSixSevenMenu() {
  const [active, setActive]       = useState(0)
  const [direction, setDirection] = useState(1)
  const tabsRef = useRef<HTMLDivElement>(null)

  const select = (idx: number) => {
    setDirection(idx > active ? 1 : -1)
    setActive(idx)
    const el = tabsRef.current?.children[idx] as HTMLElement
    el?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" })
  }

  const cat = CATEGORIES[active]

  const variants = {
    enter:  (d: number) => ({ opacity: 0, x: d * 18 }),
    center: { opacity: 1, x: 0 },
    exit:   (d: number) => ({ opacity: 0, x: d * -18 }),
  }

  return (
    <div className="flex flex-col min-h-full">

      {/* ── Header ── */}
      <div className="pb-3">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-[7px] tracking-[0.35em] font-semibold uppercase text-[#C9A84C]/60">
              Red Room at
            </p>
            <h2 className="text-[14px] font-black tracking-[0.18em] uppercase text-white leading-tight mt-[1px]">
              Club Six Seven
            </h2>
          </div>
          <div className="text-right pb-[1px]">
            <p className="text-[7px] tracking-[0.2em] uppercase text-[#C9A84C]/50 font-medium">
              Bottle Menu
            </p>
            <p className="text-[9px] text-[#C9A84C] font-bold mt-[1px]">
              {totalItems(cat)}&nbsp;items
            </p>
          </div>
        </div>
        <div className="mt-3 h-px bg-gradient-to-r from-[#C9A84C]/0 via-[#C9A84C]/40 to-[#C9A84C]/0" />
      </div>

      {/* ── Tab bar ── */}
      <div
        ref={tabsRef}
        className="flex overflow-x-auto gap-1.5 pb-3 [&::-webkit-scrollbar]:hidden flex-shrink-0"
        style={{ scrollbarWidth: "none" }}
      >
        {CATEGORIES.map((c, i) => (
          <button
            key={c.id}
            onClick={() => select(i)}
            className={`relative flex-shrink-0 px-3 py-[5px] text-[8px] font-bold uppercase tracking-[0.1em] transition-all duration-200 ${
              active === i
                ? "text-black bg-[#C9A84C]"
                : "text-white/60 bg-black/20 hover:text-white hover:bg-black/30"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div className="h-px bg-white/[0.06]" />

      {/* ── Items ── */}
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={active}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="flex-1 overflow-y-auto pb-8 [&::-webkit-scrollbar]:hidden"
          style={{ scrollbarWidth: "none" }}
        >
          {cat.sections.map((section, si) => (
            <div key={si} className="mt-4">
              {section.label && (
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[7.5px] font-bold uppercase tracking-[0.25em] text-[#C9A84C]/70">
                    {section.label}
                  </span>
                  <div className="flex-1 h-px bg-[#C9A84C]/15" />
                </div>
              )}

              {section.items.map((item, ii) => (
                <motion.div
                  key={ii}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: (si * 0.04) + (ii * 0.02) }}
                  className="flex items-center justify-between py-[10px] border-b border-white/[0.06] group"
                >
                  <div className="flex-1 pr-3 min-w-0">
                    <p className="text-[10.5px] font-medium text-white/85 leading-snug group-hover:text-white transition-colors truncate">
                      {item.name}
                    </p>
                    {item.volume && (
                      <p className="text-[8px] text-[#C9A84C]/50 font-medium mt-[1px]">
                        {item.volume}
                      </p>
                    )}
                  </div>
                  <p className="text-[10.5px] font-bold text-[#C9A84C] tabular-nums flex-shrink-0">
                    {fmt(item.price)}
                  </p>
                </motion.div>
              ))}
            </div>
          ))}

          <div className="h-6" />
        </motion.div>
      </AnimatePresence>

      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-black/40 to-transparent" />
    </div>
  )
}
