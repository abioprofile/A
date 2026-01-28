"use client"

import Image from "next/image"
import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

const Features = () => {
  const sectionRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const cardsRef = useRef<(HTMLDivElement | null)[]>([])
  const starsRef = useRef<(HTMLImageElement | null)[]>([])

  const addCardRef = (el: HTMLDivElement | null) => {
    if (el && !cardsRef.current.includes(el)) {
      cardsRef.current.push(el)
    }
  }

  const addStarRef = (el: HTMLImageElement | null) => {
    if (el && !starsRef.current.includes(el)) {
      starsRef.current.push(el)
    }
  }

  useEffect(() => {
    const ctx = gsap.context(() => {
      // title
      gsap.fromTo(
        titleRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          ease: "none", // keeps it linear
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            end: "top 30%", // controls how long it animates
            scrub: true, // allows both directions
          },
        }
      )

      // feature cards
      gsap.fromTo(
        cardsRef.current,
        { opacity: 0, y: 60, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          ease: "none",
          stagger: 0.2,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
            end: "top 20%",
            scrub: true, // smooth back-and-forth
          },
        }
      )

      // decorative stars/icons (subtle float)
      starsRef.current.forEach((star, i) => {
        if (star) {
          gsap.to(star, {
            rotation: i % 2 === 0 ? 15 : -15,
            yoyo: true,
            repeat: -1,
            duration: 3 + i,
            ease: "sine.inOut",
          })
        }
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="features"
      ref={sectionRef}
      className="py-10 relative md:py-20 md:-mt-40 mb-30 md:mb-12 md:mx-10"
    >
      <div className="max-w-7xl md:flex items-center justify-between mx-auto px-6">
        <Image
          src="/icons/Group 73.png"
          alt="A logo"
          width={450}
          height={400}
          priority
        />

        <div>
          <div className="relative mt-10 md:mt-0 mb-6 md:mb-10 inline-block">
            <h2
              ref={titleRef}
              className="text-5xl md:text-6xl trial2 font-light italic text-[#5D2D2B] mb-4"
            >
              What is Abio.site?
            </h2>
            <Image
              src="/icons/scribble.svg"
              alt="Text underline decoration"
              width={200}
              height={200}
              className="absolute left-26 md:left-2 md:left-100 -translate-x-1/2 top-full mt-[-0.5rem] w-[200px] h-auto"
            />
          </div>

          <div className="relative">
            <p className="mt-6 text-[15px] max-w-lg mx-auto font-thin text-[#331400]/80 leading-relaxed">
              🅰bio is a next-gen link-in-bio tool that gives you a personalized
              link (abio.site/yourname) and QR code to showcase your
              socials, contact info and portfolio all in one sleek page.
              <br />
              <br />
              Pair it with Acard, our smart NFC card, to instantly share your
              Abio profile with a simple tap, loved by creators, entrepreneurs,
              Web3 professionals, and so many others.
            </p>

            <Image
              ref={addStarRef}
              src="/icons/Vector 99.png"
              alt="Text underline decoration"
              width={200}
              height={200}
              className="absolute hidden md:block right-55 top-39 w-[320px] h-auto"
            />
            <Image
              ref={addStarRef}
              src="/icons/Vector 99.png"
              alt="Text underline decoration"
              width={200}
              height={200}
              className="absolute md:hidden right-12 top-50 w-[230px] h-auto"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export default Features