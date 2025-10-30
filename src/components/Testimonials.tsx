"use client"
import { useKeenSlider } from "keen-slider/react"
import "keen-slider/keen-slider.min.css"
import Image from "next/image"
import { useEffect, useState } from "react"

// Autoplay plugin
function AutoplayPlugin(slider: any) {
  let timeout: ReturnType<typeof setTimeout>
  let mouseOver = false

  function clearNextTimeout() {
    clearTimeout(timeout)
  }
  function nextTimeout() {
    clearTimeout(timeout)
    if (mouseOver) return
    timeout = setTimeout(() => {
      slider.next()
    }, 2500)
  }

  slider.on("created", () => {
    slider.container.addEventListener("mouseover", () => {
      mouseOver = true
      clearNextTimeout()
    })
    slider.container.addEventListener("mouseout", () => {
      mouseOver = false
      nextTimeout()
    })
    nextTimeout()
  })
  slider.on("dragStarted", clearNextTimeout)
  slider.on("animationEnded", nextTimeout)
  slider.on("updated", nextTimeout)
}

const influencers = [
  { src: "/images/Ellipse 75.png", alt: "Influencer 1", name: "Influencer 1", link: "https://example.com/1" },
  { src: "/images/WHite card.png", alt: "Influencer 2", name: "Influencer 2", link: "https://example.com/2" },
  { src: "/images/Rectangle 1189.png", alt: "Influencer 3", name: "Influencer 3", link: "https://example.com/3" },
  { src: "/images/Rectangle 1188.png", alt: "Influencer 4", name: "Influencer 4", link: "https://example.com/4" },
  { src: "/images/WHite card.png", alt: "Influencer 5", name: "Influencer 5", link: "https://example.com/5" },
  { src: "/images/Rectangle 1188.png", alt: "Influencer 6", name: "Influencer 6", link: "https://example.com/6" },
]

const rotatingWords = ["Influencers", "Creators", "Artists", "Leaders", "Innovators", "Web3"]

const Testimonials = () => {
  const [sliderRef] = useKeenSlider<HTMLDivElement>(
    {
      loop: true,
      breakpoints: {
        "(max-width: 480px)": {
          slides: { perView: 1, spacing: 10 },
        },
        "(min-width: 481px) and (max-width: 768px)": {
          slides: { perView: 2, spacing: 10 },
        },
        "(min-width: 769px) and (max-width: 1024px)": {
          slides: { perView: 3, spacing: 10 },
        },
        "(min-width: 1025px)": {
          slides: { perView: 4, spacing: 15 },
        },
      },
    },
    [AutoplayPlugin]
  )

  // Typewriter state
  const [text, setText] = useState("")
  const [wordIndex, setWordIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const currentWord = rotatingWords[wordIndex]
    let typingSpeed = isDeleting ? 50 : 120

    const type = () => {
      setText((prev) => {
        if (!isDeleting) {
          const newText = currentWord.substring(0, prev.length + 1)
          if (newText === currentWord) setTimeout(() => setIsDeleting(true), 1000)
          return newText
        } else {
          const newText = currentWord.substring(0, prev.length - 1)
          if (newText === "") {
            setIsDeleting(false)
            setWordIndex((prevIndex) => (prevIndex + 1) % rotatingWords.length)
          }
          return newText
        }
      })
    }

    const timer = setTimeout(type, typingSpeed)
    return () => clearTimeout(timer)
  }, [text, isDeleting, wordIndex])

  return (
    <div className="w-full pb-16 pt-6 px-3 sm:px-6 md:px-10">
      <h2 className="text-center trialheader text-[#5D2D2B] text-2xl sm:text-4xl md:text-5xl font-bold mb-10 leading-snug">
        Abio for all. Trusted by <br />
        <span className="text-yellow-500 border-r-4 border-yellow-500 pr-1 animate-pulse">
          {text}
        </span>
      </h2>

      <div ref={sliderRef} className="keen-slider">
        {influencers.map((item, index) => (
          <div key={index} className="keen-slider__slide flex justify-center">
            <div className="group w-[180px] sm:w-[200px] h-[180px] sm:h-[200px] [perspective:1000px]">
              <div className="relative w-full h-full transition-transform duration-500 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
                {/* Front */}
                <div className="absolute inset-0 [backface-visibility:hidden]">
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    className="rounded-lg shadow-lg object-cover"
                  />
                </div>

                {/* Back */}
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black text-white rounded-lg shadow-lg [transform:rotateY(180deg)] [backface-visibility:hidden]">
                  <p className="mb-2 font-semibold">{item.name}</p>
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-yellow-400 underline"
                  >
                    View Profile
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Testimonials




