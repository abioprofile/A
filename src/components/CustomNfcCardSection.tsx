"use client";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

// ─── REALISTIC CARD DESIGNS ───────────────────────────────────────────────────

const ComicalCard1 = () => (
  <div className="w-full h-full rounded-[20px] overflow-hidden relative select-none">
    {/* Sky */}
    <div
      className="absolute inset-0"
      style={{
        background:
          "linear-gradient(180deg,#5bbfff 0%,#2196f3 55%,#1565c0 100%)",
      }}
    />
    {/* Sun */}
    <div
      className="absolute"
      style={{
        top: -20,
        right: 40,
        width: 80,
        height: 80,
        borderRadius: "50%",
        background: "#FFE033",
        boxShadow: "0 0 30px 10px rgba(255,220,50,0.5)",
      }}
    />
    {/* Clouds */}
    {[
      [14, 22, 80],
      [200, 14, 65],
      [290, 28, 50],
    ].map(([x, y, w], i) => (
      <div key={i} className="absolute" style={{ left: x, top: y }}>
        <div
          style={{
            position: "absolute",
            width: w,
            height: w * 0.52,
            bottom: 0,
            left: 0,
            borderRadius: "50% 50% 0 0",
            background: "rgba(255,255,255,0.92)",
          }}
        />
        <div
          style={{
            position: "absolute",
            width: w * 0.62,
            height: w * 0.62,
            bottom: w * 0.18,
            left: w * 0.14,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.92)",
          }}
        />
        <div
          style={{
            position: "absolute",
            width: w * 0.52,
            height: w * 0.44,
            bottom: 0,
            right: 0,
            borderRadius: "50% 50% 0 0",
            background: "rgba(255,255,255,0.92)",
          }}
        />
      </div>
    ))}
    {/* Ground */}
    <div
      className="absolute bottom-0 left-0 right-0 h-[70px]"
      style={{ background: "linear-gradient(180deg,#38a838,#1a6b1a)" }}
    />
    <div
      className="absolute bottom-[68px] left-0 right-0 h-[5px]"
      style={{ background: "#145c14", borderRadius: 3 }}
    />
    {/* Flowers */}
    {[
      [30, 62],
      [120, 58],
      [250, 64],
      [330, 60],
    ].map(([x, y], i) => (
      <div key={i} className="absolute" style={{ left: x, bottom: y }}>
        <div
          style={{
            width: 6,
            height: 20,
            background: "#2d8a2d",
            position: "absolute",
            left: 4,
            bottom: 0,
          }}
        />
        <div
          style={{
            width: 14,
            height: 14,
            borderRadius: "50%",
            background: ["#FF5252", "#FFD740", "#E040FB", "#40C4FF"][i],
            position: "absolute",
            top: 0,
            left: 0,
            boxShadow: `0 0 6px rgba(0,0,0,0.3)`,
          }}
        />
      </div>
    ))}
    {/* Character */}
    <div
      className="absolute"
      style={{ left: "50%", bottom: 58, transform: "translateX(-50%)" }}
    >
      <div className="relative" style={{ width: 96, height: 110 }}>
        {/* Legs */}
        <div
          style={{
            position: "absolute",
            width: 24,
            height: 32,
            background: "#1a237e",
            border: "2.5px solid #0d1642",
            borderRadius: "0 0 10px 10px",
            bottom: -28,
            left: 16,
          }}
        />
        <div
          style={{
            position: "absolute",
            width: 24,
            height: 32,
            background: "#1a237e",
            border: "2.5px solid #0d1642",
            borderRadius: "0 0 10px 10px",
            bottom: -28,
            right: 16,
          }}
        />
        {/* Shoes */}
        <div
          style={{
            position: "absolute",
            width: 30,
            height: 14,
            background: "#333",
            borderRadius: 8,
            bottom: -40,
            left: 11,
          }}
        />
        <div
          style={{
            position: "absolute",
            width: 30,
            height: 14,
            background: "#333",
            borderRadius: 8,
            bottom: -40,
            right: 11,
          }}
        />
        {/* Body */}
        <div
          style={{
            position: "absolute",
            inset: "30px 0 0 0",
            borderRadius: "16px 16px 20px 20px",
            background: "linear-gradient(180deg,#FF7043,#E64A19)",
            border: "3px solid #bf360c",
          }}
        />
        {/* Buttons */}
        {[48, 62, 76].map((y) => (
          <div
            key={y}
            style={{
              position: "absolute",
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "#FFD54F",
              left: "50%",
              top: y,
              marginLeft: -4,
              border: "1.5px solid #F9A825",
            }}
          />
        ))}
        {/* Arms */}
        <div
          style={{
            position: "absolute",
            width: 26,
            height: 52,
            background: "#FF7043",
            border: "2.5px solid #bf360c",
            borderRadius: 14,
            top: 36,
            left: -18,
            transform: "rotate(15deg)",
          }}
        />
        <div
          style={{
            position: "absolute",
            width: 26,
            height: 52,
            background: "#FF7043",
            border: "2.5px solid #bf360c",
            borderRadius: 14,
            top: 36,
            right: -18,
            transform: "rotate(-15deg)",
          }}
        />
        {/* Hands */}
        <div
          style={{
            position: "absolute",
            width: 20,
            height: 20,
            borderRadius: "50%",
            background: "#FFCCBC",
            border: "2px solid #bf360c",
            bottom: -8,
            left: -18,
          }}
        />
        <div
          style={{
            position: "absolute",
            width: 20,
            height: 20,
            borderRadius: "50%",
            background: "#FFCCBC",
            border: "2px solid #bf360c",
            bottom: -8,
            right: -18,
          }}
        />
        {/* Head */}
        <div
          style={{
            position: "absolute",
            width: 68,
            height: 64,
            borderRadius: "50%",
            background: "linear-gradient(160deg,#FFCCBC,#FFAB91)",
            border: "3px solid #bf360c",
            top: -2,
            left: 14,
          }}
        />
        {/* Hat */}
        <div
          style={{
            position: "absolute",
            top: -36,
            left: 20,
            width: 56,
            height: 34,
            background: "#cc0000",
            border: "3px solid #880000",
            borderRadius: "8px 8px 0 0",
          }}
        >
          <div
            style={{
              position: "absolute",
              bottom: -4,
              left: -12,
              right: -12,
              height: 14,
              background: "#cc0000",
              border: "3px solid #880000",
              borderRadius: 8,
            }}
          />
          <div
            style={{
              position: "absolute",
              top: 6,
              left: 6,
              right: 6,
              height: 3,
              background: "rgba(255,255,255,0.35)",
              borderRadius: 4,
            }}
          />
        </div>
        {/* Eyes */}
        <div
          style={{
            position: "absolute",
            width: 20,
            height: 22,
            borderRadius: "50%",
            background: "white",
            border: "2.5px solid #333",
            top: 18,
            left: 20,
          }}
        >
          <div
            style={{
              position: "absolute",
              width: 12,
              height: 14,
              borderRadius: "50%",
              background: "#1a237e",
              top: 3,
              left: 3,
            }}
          >
            <div
              style={{
                position: "absolute",
                width: 5,
                height: 5,
                borderRadius: "50%",
                background: "white",
                top: 1,
                left: 1,
              }}
            />
          </div>
        </div>
        <div
          style={{
            position: "absolute",
            width: 20,
            height: 22,
            borderRadius: "50%",
            background: "white",
            border: "2.5px solid #333",
            top: 18,
            right: 20,
          }}
        >
          <div
            style={{
              position: "absolute",
              width: 12,
              height: 14,
              borderRadius: "50%",
              background: "#1a237e",
              top: 3,
              left: 3,
            }}
          >
            <div
              style={{
                position: "absolute",
                width: 5,
                height: 5,
                borderRadius: "50%",
                background: "white",
                top: 1,
                left: 1,
              }}
            />
          </div>
        </div>
        {/* Eyebrows */}
        <div
          style={{
            position: "absolute",
            width: 20,
            height: 4,
            background: "#5D2D2B",
            borderRadius: 4,
            top: 14,
            left: 20,
            transform: "rotate(-8deg)",
          }}
        />
        <div
          style={{
            position: "absolute",
            width: 20,
            height: 4,
            background: "#5D2D2B",
            borderRadius: 4,
            top: 14,
            right: 20,
            transform: "rotate(8deg)",
          }}
        />
        {/* Cheeks */}
        <div
          style={{
            position: "absolute",
            width: 16,
            height: 10,
            borderRadius: "50%",
            background: "rgba(255,80,80,0.45)",
            top: 36,
            left: 16,
          }}
        />
        <div
          style={{
            position: "absolute",
            width: 16,
            height: 10,
            borderRadius: "50%",
            background: "rgba(255,80,80,0.45)",
            top: 36,
            right: 16,
          }}
        />
        {/* Smile */}
        <div
          style={{
            position: "absolute",
            bottom: 20,
            left: 24,
            width: 36,
            height: 18,
            borderBottom: "3.5px solid #5D2D2B",
            borderRadius: "0 0 24px 24px",
          }}
        />
        {/* Teeth */}
        <div
          style={{
            position: "absolute",
            bottom: 19,
            left: 30,
            width: 24,
            height: 6,
            background: "white",
            borderRadius: "0 0 4px 4px",
          }}
        />
      </div>
    </div>
    {/* Stars */}
    {[
      [22, 38],
      [310, 30],
      [46, 148],
      [318, 140],
    ].map(([x, y], i) => (
      <div
        key={i}
        style={{
          position: "absolute",
          left: x,
          top: y,
          fontSize: 20,
          color: "#FFD740",
          textShadow: "0 0 8px #FFD740",
        }}
      >
        ★
      </div>
    ))}
    {/* Card shine */}
    <div
      className="absolute inset-0 rounded-[20px] pointer-events-none"
      style={{
        background:
          "linear-gradient(135deg,rgba(255,255,255,0.25) 0%,transparent 50%,rgba(0,0,0,0.08) 100%)",
      }}
    />
    <div
      className="absolute top-0 left-0 right-0 h-[2.5px] rounded-t-[20px]"
      style={{ background: "rgba(255,255,255,0.6)" }}
    />
  </div>
);

const MetalCard = () => (
  <div className="w-full h-full rounded-[20px] overflow-hidden relative select-none">
    {/* Base metal */}
    <div
      className="absolute inset-0"
      style={{
        background:
          "linear-gradient(118deg,#c8cdd4 0%,#e8eaed 12%,#a8adb6 24%,#dde0e5 36%,#9ea3ac 48%,#e4e7ec 60%,#b2b7c0 72%,#eaecef 84%,#c0c5ce 100%)",
      }}
    />
    {/* Brushed texture */}
    {[...Array(55)].map((_, i) => (
      <div
        key={i}
        className="absolute left-0 right-0"
        style={{
          top: i * 5.2,
          height: 1,
          background:
            i % 4 === 0
              ? `rgba(255,255,255,${0.28 + Math.sin(i * 0.3) * 0.12})`
              : i % 4 === 1
                ? `rgba(60,65,72,${0.09 + Math.cos(i * 0.5) * 0.04})`
                : `transparent`,
        }}
      />
    ))}
    {/* Diagonal shimmer band */}
    <div
      className="absolute inset-0"
      style={{
        background:
          "linear-gradient(72deg,transparent 30%,rgba(255,255,255,0.18) 45%,rgba(255,255,255,0.35) 50%,rgba(255,255,255,0.18) 55%,transparent 70%)",
      }}
    />
    {/* Engraved outer circle */}
    <div
      className="absolute"
      style={{
        top: "50%",
        left: "50%",
        transform: "translate(-50%,-54%)",
        width: 130,
        height: 130,
        borderRadius: "50%",
        boxShadow:
          "inset 2px 2px 5px rgba(255,255,255,0.65),inset -2px -2px 5px rgba(30,30,35,0.35),3px 3px 8px rgba(0,0,0,0.18)",
      }}
    >
      {/* Second ring */}
      <div
        style={{
          position: "absolute",
          inset: 10,
          borderRadius: "50%",
          border: "1.5px solid rgba(100,105,115,0.35)",
          boxShadow:
            "inset 1px 1px 3px rgba(255,255,255,0.45),inset -1px -1px 3px rgba(0,0,0,0.2)",
        }}
      />
      {/* Engraved A */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span
          style={{
            fontSize: 58,
            fontWeight: 900,
            fontFamily: "'Georgia',serif",
            color: "transparent",
            WebkitTextStroke: "2px rgba(70,72,78,0.55)",
            textShadow:
              "1.5px 1.5px 1px rgba(255,255,255,0.7),-1px -1px 1px rgba(0,0,0,0.25)",
            lineHeight: 1,
          }}
        >
          A
        </span>
      </div>
    </div>
    {/* Engraved text */}
    <div className="absolute bottom-6 left-0 right-0 text-center">
      <span
        style={{
          fontSize: 11.5,
          fontWeight: 700,
          letterSpacing: "0.28em",
          fontFamily: "'Courier New',monospace",
          color: "transparent",
          WebkitTextStroke: "0.8px rgba(70,72,78,0.5)",
          textShadow:
            "0.8px 0.8px 0 rgba(255,255,255,0.6),-0.5px -0.5px 0 rgba(0,0,0,0.18)",
          textTransform: "uppercase",
        }}
      >
        A.bio • Smart Card
      </span>
    </div>
    {/* Corner engravings */}
    {[
      ["4px", "4px", "rotate-0"],
      ["4px", "auto", "rotate-90 -scale-x-100"],
      ["auto", "4px", "-rotate-90 scale-x-100"],
      ["auto", "auto", "rotate-180"],
    ].map(([t, l, cls], i) => (
      <div
        key={i}
        className={`absolute ${cls}`}
        style={{
          top: t === "auto" ? undefined : parseInt(t) + 10,
          bottom: t === "auto" ? 14 : undefined,
          left: l === "auto" ? undefined : parseInt(l) + 10,
          right: l === "auto" ? 14 : undefined,
          width: 22,
          height: 22,
        }}
      >
        <div
          style={{
            borderTop: "2px solid rgba(70,72,78,0.38)",
            borderLeft: "2px solid rgba(70,72,78,0.38)",
            width: "100%",
            height: "100%",
            boxShadow: "1px 1px 0 rgba(255,255,255,0.55)",
          }}
        />
      </div>
    ))}
    {/* Holographic strip */}
    <div
      className="absolute"
      style={{
        top: 16,
        right: 16,
        width: 52,
        height: 34,
        borderRadius: 5,
        background:
          "linear-gradient(45deg,#ff9999 0%,#ffff55 20%,#99ff99 40%,#55ffff 60%,#9999ff 80%,#ff99ff 100%)",
        opacity: 0.6,
        boxShadow: "inset 0 0 4px rgba(255,255,255,0.7)",
      }}
    />
    {/* Top highlight edge */}
    <div
      className="absolute top-0 left-0 right-0 h-[2px] rounded-t-[20px]"
      style={{ background: "rgba(255,255,255,0.75)" }}
    />
    {/* Bottom shadow edge */}
    <div
      className="absolute bottom-0 left-0 right-0 h-[3px] rounded-b-[20px]"
      style={{ background: "rgba(0,0,0,0.2)" }}
    />
    {/* Overall gloss */}
    <div
      className="absolute inset-0 rounded-[20px] pointer-events-none"
      style={{
        background:
          "linear-gradient(150deg,rgba(255,255,255,0.22) 0%,transparent 50%,rgba(0,0,0,0.06) 100%)",
      }}
    />
  </div>
);
const WoodenCard = () => (
  <div
    className="w-full h-full rounded-[20px] overflow-hidden relative select-none"
    style={{ background: "#7a4a2a" }}
  >
    {/* Wood grain */}
    {[...Array(32)].map((_, i) => (
      <div
        key={i}
        className="absolute left-[-10px] right-[-10px]"
        style={{
          top: `${i * 8.5 + Math.sin(i * 0.9) * 4}px`,
          height: `${1.5 + Math.sin(i * 1.4) * 1.2}px`,
          background:
            i % 3 === 0
              ? `rgba(30,12,4,${0.22 + Math.sin(i) * 0.1})`
              : `rgba(180,110,55,${0.12 + Math.cos(i * 0.7) * 0.06})`,
          borderRadius: 6,
          transform: `skewY(${Math.sin(i * 0.6) * 0.5}deg)`,
        }}
      />
    ))}

    {/* Knot 1 */}
    <div className="absolute" style={{ top: 58, left: 72 }}>
      {[...Array(7)].map((_, i) => (
        <div
          key={i}
          style={{
            position: "absolute", borderRadius: "50%",
            width: (i + 1) * 22, height: (i + 1) * 13,
            top: -(i * 6.5), left: -(i * 11),
            border: `1px solid rgba(35,12,2,${0.32 - i * 0.04})`,
          }}
        />
      ))}
    </div>

    {/* Knot 2 */}
    <div className="absolute" style={{ bottom: 62, right: 100 }}>
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          style={{
            position: "absolute", borderRadius: "50%",
            width: (i + 1) * 16, height: (i + 1) * 10,
            top: -(i * 5), left: -(i * 8),
            border: `1px solid rgba(35,12,2,${0.28 - i * 0.04})`,
          }}
        />
      ))}
    </div>

    {/* Varnish overlay */}
    <div
      className="absolute inset-0 rounded-[20px]"
      style={{
        background:
          "linear-gradient(160deg,rgba(255,220,160,0.22) 0%,rgba(255,200,120,0.08) 30%,transparent 60%,rgba(0,0,0,0.22) 100%)",
      }}
    />

    {/* ── Engraved logo — center ── */}
    <div className="absolute inset-0 flex items-center justify-center">
      <div style={{ position: "relative" }}>

        {/* Carved recess pit */}
        <div style={{
          width: 90,
          height: 90,
          borderRadius: 14,
          background: "rgba(18,7,2,0.6)",
          boxShadow: [
            "inset 4px 4px 8px rgba(0,0,0,0.7)",
            "inset -1px -1px 3px rgba(255,190,100,0.1)",
            "2px 2px 5px rgba(255,200,130,0.2)",
            "-1px -1px 3px rgba(0,0,0,0.4)",
          ].join(","),
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
        }}>

          {/* Wood grain bleeds through recess */}
          <div style={{
            position: "absolute", inset: 0,
            background:
              "linear-gradient(160deg,rgba(120,65,20,0.2) 0%,transparent 55%,rgba(0,0,0,0.25) 100%)",
          }} />

          {/* ── The engraved A logo — SVG so we fully control depth ── */}
          <svg
            width="62"
            height="62"
            viewBox="0 0 56 64"
            fill="none"
            style={{ position: "relative", zIndex: 1 }}
          >
            {/* Outer border box — matching the yellow frame in their logo */}
            <rect
              x="2" y="2" width="52" height="60" rx="3"
              stroke="rgba(30,12,2,0.9)"
              strokeWidth="3"
              fill="none"
              /* Light-catch highlight on top-left edge */
              style={{
                filter:
                  "drop-shadow(1.5px 1.5px 0px rgba(255,200,120,0.35)) drop-shadow(-0.5px -0.5px 0px rgba(0,0,0,0.7))",
              }}
            />
            {/* Inner box inset — double-border like the logo */}
            <rect
              x="5" y="5" width="46" height="54" rx="2"
              stroke="rgba(20,8,2,0.7)"
              strokeWidth="1"
              fill="none"
            />

            {/* The A letterform — thick strokes, engraved look */}
            {/* Left leg */}
            <path
              d="M10 54 L26 10 L30 10 L46 54"
              stroke="rgba(18,7,2,0.92)"
              strokeWidth="7"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
              style={{
                filter:
                  "drop-shadow(1px 1px 0px rgba(255,200,120,0.3)) drop-shadow(-0.5px -0.5px 0px rgba(0,0,0,0.8))",
              }}
            />
            {/* Crossbar */}
            <path
              d="M16 38 L40 38"
              stroke="rgba(18,7,2,0.9)"
              strokeWidth="6"
              strokeLinecap="round"
              style={{
                filter:
                  "drop-shadow(0.5px 1px 0px rgba(255,200,120,0.25)) drop-shadow(-0.5px -0.5px 0px rgba(0,0,0,0.7))",
              }}
            />

            {/* Highlight strokes — simulates light catching the carved ridges */}
            {/* Left leg highlight */}
            <path
              d="M11.5 54 L27 11.5"
              stroke="rgba(255,200,120,0.18)"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            {/* Right leg highlight */}
            <path
              d="M44.5 54 L29 11.5"
              stroke="rgba(255,200,120,0.12)"
              strokeWidth="1"
              strokeLinecap="round"
            />
            {/* Crossbar highlight */}
            <path
              d="M16 36.5 L40 36.5"
              stroke="rgba(255,200,120,0.15)"
              strokeWidth="1"
              strokeLinecap="round"
            />

            {/* Border box highlight edge — top and left catch light */}
            <path
              d="M5 58 Q5 62 9 62 L47 62 Q51 62 51 58"
              stroke="rgba(0,0,0,0.45)"
              strokeWidth="1"
              fill="none"
            />
            <path
              d="M3 5 Q3 3 5 3 L51 3 Q53 3 53 5"
              stroke="rgba(255,200,120,0.22)"
              strokeWidth="1"
              fill="none"
            />
          </svg>

        </div>

        {/* Outer bevel ring catching ambient light */}
        <div style={{
          position: "absolute", inset: -2,
          borderRadius: 16,
          border: "1px solid rgba(255,210,120,0.15)",
          boxShadow:
            "1px 1px 3px rgba(255,220,150,0.18), -1px -1px 2px rgba(0,0,0,0.35)",
          pointerEvents: "none",
        }} />

      </div>
    </div>

    {/* Edges */}
    <div
      className="absolute top-0 left-0 right-0 rounded-t-[20px]"
      style={{ height: 3, background: "rgba(255,230,170,0.55)" }}
    />
    <div
      className="absolute bottom-0 left-0 right-0 rounded-b-[20px]"
      style={{ height: 4, background: "rgba(0,0,0,0.38)" }}
    />
    <div
      className="absolute top-0 bottom-0 left-0 rounded-l-[20px]"
      style={{ width: 3, background: "rgba(0,0,0,0.25)" }}
    />
    {/* Specular spot */}
    <div style={{
      position: "absolute", top: 18, left: 28,
      width: 90, height: 50, borderRadius: "50%",
      background: "rgba(255,230,180,0.14)",
      filter: "blur(8px)",
      pointerEvents: "none",
    }} />
  </div>
);

const ComicalCard2 = () => (
  <div
    className="w-full h-full rounded-[20px] overflow-hidden relative select-none"
    style={{ background: "#080808" }}
  >
    {/* Fine dot grid */}
    <div
      className="absolute inset-0"
      style={{
        backgroundImage:
          "radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)",
        backgroundSize: "20px 20px",
      }}
    />

    {/* Subtle diagonal lines */}
    {[...Array(10)].map((_, i) => (
      <div
        key={i}
        className="absolute"
        style={{
          top: 0,
          bottom: 0,
          left: `${i * 40 - 20}px`,
          width: 1,
          background: "rgba(255,255,255,0.03)",
          transform: "skewX(-20deg)",
        }}
      />
    ))}

    {/* Top accent bar */}
    <div
      className="absolute top-0 left-0 right-0 h-[3px] rounded-t-[20px]"
      style={{
        background:
          "linear-gradient(90deg, #FED45C 0%, #FF854A 50%, #FED45C 100%)",
      }}
    />

    {/* NFC waves top-left */}
    <div className="absolute top-4 left-4">
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <path
          d="M5 16a11 11 0 0 1 11-11"
          stroke="rgba(254,212,92,0.6)"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        <path
          d="M9.5 16a6.5 6.5 0 0 1 6.5-6.5"
          stroke="rgba(254,212,92,0.45)"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        <path
          d="M14 16a2 2 0 0 1 2-2"
          stroke="rgba(254,212,92,0.35)"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
      </svg>
    </div>

    {/* Holographic chip top-right */}
    {/* <div className="absolute" style={{
      top: 16, right: 16, width: 44, height: 32, borderRadius: 5,
      background: "linear-gradient(120deg, #c8a04a 0%, #f0d060 30%, #a07030 50%, #e8c855 70%, #c8a040 100%)",
      boxShadow: "inset 0 1px 0 rgba(255,255,255,0.4), inset 0 -1px 0 rgba(0,0,0,0.3)",
    }}>
      <div className="absolute inset-[4px] rounded-[2px]" style={{ border: "1px solid rgba(0,0,0,0.2)" }} />
      <div className="absolute inset-0" style={{ background: "linear-gradient(45deg,transparent 40%,rgba(255,255,255,0.15) 50%,transparent 60%)" }} />
    </div> */}

    {/* Center — name + title */}
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
      {/* Monogram */}
      {/* <div style={{
        width: 52, height: 52, borderRadius: 10,
        background: "rgba(254,212,92,0.1)",
        border: "1.5px solid rgba(254,212,92,0.3)",
        display: "flex", alignItems: "center", justifyContent: "center",
        marginBottom: 4,
      }}>
        <span style={{
          fontSize: 22, fontWeight: 900,
          fontFamily: "'Courier New', monospace",
          color: "#FED45C",
          letterSpacing: "-0.5px",
        }}>A</span>
      </div> */}
      {/* <p style={{
        fontSize: 15, fontWeight: 800,
        color: "#ffffff",
        letterSpacing: "0.04em",
        fontFamily: "'Courier New', monospace",
      }}>Your Name</p>
      <p style={{
        fontSize: 9.5, fontWeight: 600,
        color: "rgba(254,212,92,0.6)",
        letterSpacing: "0.18em",
        textTransform: "uppercase",
        fontFamily: "'Courier New', monospace",
      }}>Senior Product Designer</p> */}
    </div>

    {/* Bottom row */}
    <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between px-4 pb-3.5">
      <div>
        <p
          style={{
            fontSize: 9,
            fontWeight: 700,
            color: "rgba(255, 255, 255, 0.91)",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            fontFamily: "'Courier New', monospace",
            marginBottom: 2,
          }}
        >
          abio.site/yourname
        </p>
        {/* <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <div style={{ width: 4, height: 4, borderRadius: "50%", background: "#3EB489" }} />
            <p style={{ fontSize: 9, fontWeight: 700, color: "rgba(62,180,137,0.7)", letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "'Courier New', monospace" }}>
              Available for work
            </p>
          </div> */}
      </div>
      {/* Pulse */}
      <div className="relative" style={{ width: 12, height: 12 }}>
        {[0, 0.7].map((delay, i) => (
          <motion.div
            key={i}
            className="absolute inset-0 rounded-full"
            style={{ border: "1.5px solid rgba(254,212,92,0.45)" }}
            animate={{ scale: [1, 3], opacity: [0.7, 0] }}
            transition={{
              duration: 2.2,
              repeat: Infinity,
              delay,
              ease: "easeOut",
            }}
          />
        ))}
        <div
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: "#FED45C",
            position: "absolute",
            top: 2,
            left: 2,
          }}
        />
      </div>
    </div>

    {/* Bottom accent */}
    <div
      className="absolute bottom-0 left-0 right-0 h-[2px] rounded-b-[20px]"
      style={{
        background:
          "linear-gradient(90deg, transparent 0%, rgba(254,212,92,0.3) 50%, transparent 100%)",
      }}
    />

    {/* Overall gloss */}
    <div
      className="absolute inset-0 rounded-[20px] pointer-events-none"
      style={{
        background:
          "linear-gradient(150deg,rgba(255,255,255,0.06) 0%,transparent 50%)",
      }}
    />
  </div>
);

const CARDS = [
  { id: "wood", component: WoodenCard },
  { id: "comic1", component: ComicalCard1 },
  { id: "metal", component: MetalCard },
  { id: "comic2", component: ComicalCard2 },
];

// ─── SmartCardStack ───────────────────────────────────────────────────────────
const CARD_W = 300;
const CARD_H = 189;
const STACK_W = 200;
const STACK_H = 126;

const SmartCardStack = () => {
  const [activeIdx, setActiveIdx] = useState(-1);
  const [doneIdxs, setDoneIdxs] = useState<number[]>([]);
  const nextCard = useRef(0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    const run = () => {
      const idx = nextCard.current;
      setActiveIdx(idx);

      const t1 = setTimeout(() => {
        setDoneIdxs((prev) => [...prev, idx]);
        setActiveIdx(-1);

        const t2 = setTimeout(() => {
          nextCard.current = (nextCard.current + 1) % 4;
          if (nextCard.current === 0) setDoneIdxs([]);
          const t3 = setTimeout(run, 500);
          timers.current.push(t3);
        }, 600);
        timers.current.push(t2);
      }, 3500);
      timers.current.push(t1);
    };

    const init = setTimeout(run, 1200);
    timers.current.push(init);
    return () => timers.current.forEach(clearTimeout);
  }, []);

  return (
    <div
      className="relative flex flex-col md:flex-row items-center justify-center gap-6 md:gap-0"
      style={{ width: "100%", maxWidth: 560, height: "auto", minHeight: 280 }}
    >
      {/* Mobile layout: Stack on top, preview below */}

      {/* ── Stack ── */}
      <div
        className="relative flex-shrink-0"
        style={{ width: STACK_W + 20, height: STACK_H + 40, marginTop: 20 }}
      >
        {CARDS.map((card, i) => {
          if (i === activeIdx) return null;
          const isDone = doneIdxs.includes(i);
          const stackRank = isDone
            ? CARDS.length
            : CARDS.length - 1 - i + doneIdxs.filter((d) => d < i).length;
          const offset = stackRank * 4;
          const Component = card.component;

          return (
            <motion.div
              key={card.id}
              animate={{
                x: isDone ? offset + 2 : offset,
                y: isDone ? -offset * 0.3 + 2 : -offset * 0.3,
                rotate: isDone ? offset * 0.5 - 1 : offset * 0.5,
                scale: 1 - stackRank * 0.018,
                zIndex: isDone ? 0 : CARDS.length - stackRank,
              }}
              transition={{ type: "spring", stiffness: 180, damping: 26 }}
              style={{
                position: "absolute",
                width: STACK_W,
                height: STACK_H,
                borderRadius: 12,
                overflow: "hidden",
                boxShadow:
                  "0 8px 24px rgba(0,0,0,0.22), 0 2px 6px rgba(0,0,0,0.14)",
                top: 20,
                left: 0,
              }}
            >
              <Component />
              {/* Depth overlay on stack cards */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: 12,
                  background: "rgba(0,0,0,0.06)",
                  pointerEvents: "none",
                }}
              />
            </motion.div>
          );
        })}
      </div>

      {/* ── Arrow indicator (mobile: horizontal arrows, desktop: vertical) ── */}
      <div className="flex-shrink-0 flex md:flex-col items-center gap-1.5 mx-3 my-4 md:my-0">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            animate={{ opacity: [0.2, 0.9, 0.2], x: [0, 4, 0] }}
            transition={{
              duration: 1.4,
              repeat: Infinity,
              delay: i * 0.22,
              ease: "easeInOut",
            }}
            style={{
              width: 6,
              height: 6,
              borderTop: "2px solid #5D2D2B",
              borderRight: "2px solid #5D2D2B",
              transform: "rotate(45deg)",
            }}
          />
        ))}
      </div>

      {/* ── Preview slot ── */}
      <div
        className="relative flex-shrink-0"
        style={{ width: CARD_W, height: CARD_H + 60 }}
      >
        <AnimatePresence mode="wait">
          {activeIdx >= 0 &&
            (() => {
              const Component = CARDS[activeIdx].component;
              return (
                <motion.div
                  key={`preview-${CARDS[activeIdx].id}`}
                  initial={{ x: -120, opacity: 0, scale: 0.82, rotate: -6 }}
                  animate={{ x: 0, opacity: 1, scale: 1, rotate: 0 }}
                  exit={{ x: -80, opacity: 0, scale: 0.88, rotate: -4 }}
                  transition={{ type: "spring", stiffness: 200, damping: 28 }}
                  style={{
                    position: "absolute",
                    width: CARD_W,
                    height: CARD_H,
                    borderRadius: 20,
                    overflow: "hidden",
                    top: 30,
                    left: 0,
                    boxShadow: [
                      "0 40px 80px rgba(0,0,0,0.38)",
                      "0 16px 32px rgba(0,0,0,0.24)",
                      "0 4px 10px rgba(0,0,0,0.16)",
                      "0 0 0 1px rgba(255,255,255,0.15)",
                    ].join(","),
                  }}
                >
                  <Component />
                  {/* Photo-realistic edge light */}
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      borderRadius: 20,
                      pointerEvents: "none",
                      background:
                        "linear-gradient(150deg,rgba(255,255,255,0.18) 0%,transparent 40%,rgba(0,0,0,0.1) 100%)",
                    }}
                  />
                  {/* Top specular edge */}
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      height: 2,
                      borderRadius: "20px 20px 0 0",
                      background: "rgba(255,255,255,0.55)",
                      pointerEvents: "none",
                    }}
                  />
                  {/* Bottom depth edge */}
                  <div
                    style={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: 3,
                      borderRadius: "0 0 20px 20px",
                      background: "rgba(0,0,0,0.3)",
                      pointerEvents: "none",
                    }}
                  />
                  {/* Left dark edge */}
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      bottom: 0,
                      left: 0,
                      width: 2,
                      borderRadius: "20px 0 0 20px",
                      background: "rgba(0,0,0,0.15)",
                      pointerEvents: "none",
                    }}
                  />
                </motion.div>
              );
            })()}
        </AnimatePresence>

        {/* Ground shadow under preview */}
        <motion.div
          animate={{
            opacity: activeIdx >= 0 ? 1 : 0,
            scaleX: activeIdx >= 0 ? 1 : 0.5,
          }}
          transition={{ duration: 0.5 }}
          style={{
            position: "absolute",
            bottom: 10,
            left: "10%",
            right: "10%",
            height: 18,
            borderRadius: "50%",
            background: "rgba(0,0,0,0.22)",
            filter: "blur(10px)",
            pointerEvents: "none",
          }}
        />
      </div>
    </div>
  );
};

// ─── Floating badge ───────────────────────────────────────────────────────────
const FloatingBadge = ({
  label,
  delay,
  className,
}: {
  label: string;
  delay: number;
  className: string;
}) => (
  <motion.div
    animate={{ y: [0, -6, 0] }}
    transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay }}
    className={`absolute flex items-center gap-1.5 bg-white border border-[#5D2D2B]/12
                px-3 py-1.5 shadow-[2px_2px_0px_rgba(0,0,0,0.08)] ${className}`}
  >
    <motion.div
      animate={{ opacity: [1, 0.3, 1] }}
      transition={{ duration: 2, repeat: Infinity, delay }}
      className="w-1.5 h-1.5 rounded-full bg-[#FED45C] flex-shrink-0"
    />
    <span className="text-[10px] font-black text-[#5D2D2B] whitespace-nowrap">
      {label}
    </span>
  </motion.div>
);

const LiveDot = () => (
  <motion.span
    animate={{ opacity: [1, 0.2, 1] }}
    transition={{ duration: 1.6, repeat: Infinity }}
    className="inline-block w-1.5 h-1.5 rounded-full bg-[#FED45C] mr-2 align-middle"
  />
);

const stats = [
  { val: "1.2K+", label: "Cards shipped" },
  { val: "< 1s", label: "Share time" },
  { val: "0", label: "Apps needed" },
];

// ─── Section ──────────────────────────────────────────────────────────────────
const CustomNfcCardSection = () => (
  <section className="relative w-full bg-white py-12 sm:py-16 md:py-20 lg:py-28 px-4 sm:px-6 md:px-12 lg:px-20 overflow-hidden">
    <Image
      src="/images/scribble.svg"
      alt=""
      width={240}
      height={240}
      className="pointer-events-none absolute rotate-45 -left-16 opacity-40 top-0 w-[7rem] sm:w-[9rem] md:w-[12rem] lg:w-[14rem]"
    />
    <Image
      src="/images/scribble.svg"
      alt=""
      width={240}
      height={240}
      className="pointer-events-none absolute -rotate-45 -right-12 opacity-40 top-8 w-[7rem] sm:w-[9rem] md:w-[12rem] lg:w-[14rem]"
    />

    <div className="container mx-auto">
      <div className="flex flex-col-reverse md:grid md:grid-cols-2 gap-8 md:gap-12 lg:gap-40 items-center">
        {/* Card Stack Column - Shows first on mobile, second on desktop */}
        <motion.div
          initial={{ opacity: 0, x: -32 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="flex justify-center items-center order-1 md:order-1 relative overflow-visible w-full"
        >
          <div className="relative overflow-visible w-full flex justify-center">
            <SmartCardStack />
            {/* Floating badges - repositioned for mobile */}
            <FloatingBadge
              label="Tap to share"
              delay={0}
              className="-top-2 right-2 md:right-0"
            />
            <FloatingBadge
              label="No app needed"
              delay={1}
              className="bottom-2 right-2 md:right-0"
            />
            <FloatingBadge
              label="Fully custom"
              delay={0.5}
              className="bottom-2 -left-2 md:-left-2"
            />
          </div>
        </motion.div>

        {/* Write-up Column - Shows second on mobile, second on desktop */}
        <motion.div
          initial={{ opacity: 0, x: 32 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="flex flex-col gap-4 sm:gap-5 md:text-center md:text-left order-2 md:order-2 w-full"
        >
          <div className="flex items-center gap-3 justify-start">
            <div className="h-0.5 w-5 sm:w-7 bg-[#FED45C]" />
            <p className="text-[9px] sm:text-[10px] font-black tracking-[0.22em] uppercase text-[#FED45C]">
              NFC Smart Card
            </p>
          </div>

          <div>
            <p className="text-[10px] sm:text-[11px] font-bold tracking-[0.1em] uppercase text-[#5D2D2B]/40 mb-2 sm:mb-3">
              <LiveDot />
              You don&apos;t need a deck of cards.
            </p>
            <h2 className="text-[32px] sm:text-[40px] lg:text-[50px] trialheader leading-tight sm:leading-none font-[400] text-[#5D2D2B]">
              Get Acard
              <br />
              Today!!!
            </h2>
          </div>

          <p className="text-xs sm:text-sm font-light leading-5 sm:leading-6 text-[#5D2D2B]/80 max-w-sm mx-auto md:mx-0 px-2 sm:px-0">
            Personalize your NFC card with your name, logo, and brand style. One
            tap shares your A.bio — no app needed.
          </p>

          <p className="text-sm sm:text-base lg:text-lg text-[#5D2D2B]/40 trial italic font-light">
            One card. Endless connections...
          </p>

          <div className="flex justify-start">
            <motion.button
              whileHover={{ scale: 1.04, boxShadow: "4px 4px 0px 0px #000000" }}
              whileTap={{ scale: 0.97 }}
              className="bg-[#FED45C] shadow-[3px_3px_0px_0px_#000000] text-[#FF0000] h-10 sm:h-12 px-6 sm:px-8 font-bold text-xs sm:text-sm transition-shadow duration-200"
            >
              Get yours Now!
            </motion.button>
          </div>

          <div className="flex gap-6 sm:gap-8 pt-4 sm:pt-5 border-t border-[#5D2D2B]/08 justify-center md:justify-start">
            {stats.map(({ val, label }) => (
              <div key={label}>
                <p className="text-[20px] sm:text-[24px] font-black text-[#5D2D2B] leading-none">
                  {val}
                </p>
                <p
                  className="text-[8px] sm:text-[9px] font-bold tracking-[0.12em] uppercase mt-1 whitespace-nowrap"
                  style={{ color: "rgba(93,45,43,0.35)" }}
                >
                  {label}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  </section>
);

export default CustomNfcCardSection;
