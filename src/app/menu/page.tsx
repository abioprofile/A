"use client";

import { useRef, useState } from "react";
import { MENU } from "@/data/index"; 

type MenuItem = {
  name: string;
  price: string;
};

type MenuData = Record<string, MenuItem[]>;


export default function MenuAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const entries = Object.entries(MENU as MenuData);

  return (
    <div className="space-y-3">
      {entries.map(([title, items], index) => (
        <Accordion
          key={title}
          title={title}
          items={items}
          isOpen={openIndex === index}
          onToggle={() =>
            setOpenIndex(openIndex === index ? null : index)
          }
        />
      ))}
    </div>
  );
}

/* =======================
   Accordion (internal)
======================= */
function Accordion({
  title,
  items,
  isOpen,
  onToggle,
}: {
  title: string;
  items: MenuItem[];
  isOpen: boolean;
  onToggle: () => void;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const height = ref.current?.scrollHeight ?? 0;

  return (
    <div className="overflow-hidden border border-white/10 backdrop-blur-sm">
      {/* Header */}
      <button
        onClick={onToggle}
        aria-expanded={isOpen}
        className="w-full flex justify-between items-center px-4 py-2 bg-black/35 transition-all duration-300"
      >
        <span className="text-[13px] font-semibold uppercase text-white">
          {title}
        </span>

        <svg
          className={`w-5 h-5 text-white transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M7 10l5 5 5-5H7z" />
        </svg>
      </button>

      {/* Content */}
      <div
        className="overflow-hidden transition-[max-height] duration-500 ease-in-out bg-[#500019]"
        style={{ maxHeight: isOpen ? `${height}px` : "0" }}
      >
        <div ref={ref} className="p-4 space-y-2">
          {items.map((item, i) => (
            <div
              key={i}
              className="flex justify-between items-center px-4 py-3"
            >
              <span className="text-[13px] font-semibold text-white">
                {item.name}
              </span>
              <span className="text-[#FFD700] font-semibold text-sm">
                {item.price}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
