"use client"
import React from "react"
import Image from "next/image"

const faqs = [
  {
    question: "Why do I need Abio?",
    answer:
      "Answer the frequently asked question in a simple sentence, a longish paragraph, or even in a list.",
  },
  {
    question: "Do I need an app to use Abio?",
    answer:
      "No, you can use Abio directly from your browser. It’s designed to be simple and accessible.",
  },
  {
    question: "What is a linkinbio tool?",
    answer:
      "It’s a tool that helps you share multiple links with your audience through a single bio link.",
  },
  {
    question: "What kind of content can I put on my Abio profile?",
    answer:
      "You can add videos, social links, blogs, shops, and much more to create a full profile.",
  },
]

const Faq = () => {
  return (
    <section className="container max-auto py-16 px-6 relative">
      {/* Background Logo */}
      <div className="absolute top-80 inset-0 flex justify-center items-center pointer-events-none ">
        <Image
          src="/images/footerlogo.svg"
          alt="Footer Logo"
          width={600}
          height={600}
          className="w-[50rem] h-[50rem] object-contain"
        />
      </div>

      {/* Content on top */}
      <div className="relative z-10">
        {/* Header */}
        <h2 className="text-center trialheader text-5xl mb-2 text-red-600">
          Got Questions ?
        </h2>
        <p className="text-center text-lg text-[#5D2D2B] mb-10">
          Everything you need to know about A
        </p>

        {/* Accordion */}
        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <details key={index} className="group bg-[#FED45C] rounded-none">
              <summary className="flex justify-between items-center cursor-pointer font-semibold text-xl p-4 text-[#5D2D2B]">
                {faq.question}
                <span className="transition-transform duration-300 group-open:rotate-180">
                  ▼
                </span>
              </summary>
              <div className="p-4 pt-0 text-[#5D2D2B]">
                <p>{faq.answer}</p>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Faq

