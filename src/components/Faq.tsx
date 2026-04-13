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
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (i: number) => setOpenIndex(openIndex === i ? null : i);

  return (
    <section className="relative w-full py-16 md:py-24 px-4 sm:px-6 md:px-8 overflow-hidden">
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

      <div className="relative z-10 max-w-3xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="text-center mb-10"
        >
          <h2 className="trialheader text-3xl sm:text-4xl md:text-5xl text-red-600 mb-2">
            Got Questions?
          </h2>
          <p className="text-sm text-[#5D2D2B]">Everything you need to know about A</p>
        </motion.div>

        {/* Accordion */}
        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{
                  duration: 0.3,
                  delay: index * 0.07,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
              >
                <div className="bg-[#FED45C] border border-[#FED45C] hover:border-[#5D2D2B] transition-colors duration-200">
                  <button
                    onClick={() => toggle(index)}
                    className="w-full flex justify-between items-center p-4 sm:p-5 text-left font-semibold text-sm sm:text-base md:text-lg text-[#5D2D2B] cursor-pointer min-h-[54px]"
                    aria-expanded={isOpen}
                  >
                    <span className="pr-4">{faq.question}</span>
                    <motion.span
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                      className="flex-shrink-0 text-sm"
                    >
                      ▼
                    </motion.span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        key="answer"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                        className="overflow-hidden"
                      >
                        <p className="px-4 sm:px-5 pb-4 sm:pb-5 text-xs sm:text-sm text-[#5D2D2B]/80 leading-6">
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
