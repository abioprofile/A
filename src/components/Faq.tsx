"use client";
import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

const faqs = [
  {
    question: "What is Abio.site?",
    answer:
      "Abio.site is a link-in-bio tool that lets you create a beautiful profile to showcase your social, contact, business, and other information. We seamlessly combine this with an NFC-enabled card, called an Acard, that allows for one-tap sharing of your profile.",
  },
  {
    question: "How does the NFC card work?",
    answer:
      "The Acard uses NFC (Near Field Communication) technology. Simply tap it against any NFC-enabled smartphone and your Abio profile opens instantly — no app download required.",
  },
  {
    question: "What is the benefit of using an Acard over a traditional business card?",
    answer:
      "Unlike paper cards, your Acard always stays up-to-date. Edit your profile anytime and everyone who taps your card gets your latest info, links, and contact details in real time.",
  },
  {
    question: "What is the benefit of using Abio.site over other link-in-bio tools?",
    answer:
      "Abio combines a powerful digital profile with NFC card technology, giving you both an online presence and a physical sharing tool. It's the bridge between your digital and physical networking.",
  },
];

const Faq = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (i: number) => setOpenIndex(openIndex === i ? null : i);

  return (
    <section className="relative w-full py-16 md:py-24 px-4 sm:px-8 md:px-12 lg:px-20 overflow-hidden bg-[#FEF4EA]">

      {/* Watermark logo */}
      <div className="absolute inset-0 flex justify-center items-center pointer-events-none opacity-[0.04]">
        <Image
          src="/images/footerlogo.svg"
          alt=""
          width={700}
          height={700}
          className="w-[40rem] sm:w-[55rem] h-auto object-contain"
        />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="trialheader text-[40px] xl:text-[50px] text-[#5D2D2B] font-[400] leading-tight mb-3">
            Got Questions?
          </h2>
          <p className="text-base text-[#5D2D2B]/60 font-light">
            Everything you need to know about Abio
          </p>
        </motion.div>

        {/* Accordion */}
        <div className="space-y-4 md:space-y-5">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.35,
                  delay: index * 0.07,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
              >
                <div
                  className=" overflow-hidden transition-all duration-300"
                  style={{
                    background: isOpen ? "#5D2D2B" : "#FED45C",
                    boxShadow: isOpen
                      ? "0 8px 32px rgba(93,45,43,0.18)"
                      : "0 2px 12px rgba(0,0,0,0.06)",
                  }}
                >
                  {/* Question row */}
                  <button
                    onClick={() => toggle(index)}
                    className="w-full flex justify-between items-center px-7 md:px-10 py-7 md:py-9 text-left cursor-pointer"
                    aria-expanded={isOpen}
                  >
                    <span
                      className="pr-6 text-[18px] sm:text-[22px] md:text-[26px] font-bold leading-snug transition-colors duration-300"
                      style={{ color: isOpen ? "#FEF4EA" : "#5D2D2B" }}
                    >
                      {faq.question}
                    </span>

                    {/* Chevron */}
                    <motion.div
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.28, ease: "easeInOut" }}
                      className="flex-shrink-0 w-9 h-9 md:w-11 md:h-11 rounded-full flex items-center justify-center transition-colors duration-300"
                      style={{
                        background: isOpen ? "rgba(254,212,92,0.18)" : "rgba(93,45,43,0.12)",
                      }}
                    >
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 18 18"
                        fill="none"
                      >
                        <path
                          d="M4 6.5L9 11.5L14 6.5"
                          stroke={isOpen ? "#FED45C" : "#5D2D2B"}
                          strokeWidth="2.2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </motion.div>
                  </button>

                  {/* Answer */}
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        key="answer"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.32, ease: [0.25, 0.46, 0.45, 0.94] }}
                        className="overflow-hidden"
                      >
                        {/* Divider */}
                        <div className="mx-7 md:mx-10 h-px bg-[#FEF4EA]/15" />
                        <p className="px-7 md:px-10 py-7 md:py-8 text-[15px] sm:text-[17px] md:text-[18px] text-[#FEF4EA]/80 leading-[1.85] font-light">
                          {faq.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default Faq;