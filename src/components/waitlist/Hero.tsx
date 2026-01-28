"use client";

import Image from "next/image";
import { useState, useRef, useEffect, FormEvent, ChangeEvent } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { toast, Toaster } from "sonner";

gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [waitlistCount, setWaitlistCount] = useState(1000);

  // Refs for GSAP
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLHeadingElement>(null);
  const paragraphRef = useRef<HTMLParagraphElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const logoLeftRef = useRef<HTMLDivElement>(null);
  const logoRightRef = useRef<HTMLDivElement>(null);

  // 🔹 Handle form submit
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !name.trim()) {
      return toast.error("Please fill in all fields.");
    }

    setLoading(true);
    // try {
    //   const result = await postFetch("/waitlist", { name, email });

    //   if (typeof result === "string") {
    //     return toast.error(result);
    //   }

    //   toast.success("You've been added to the waitlist 🎉");
    //   console.log("Response:", result);

    //   // ✅ Increment count after successful join
    //   setWaitlistCount((prev) => prev + 1);

    //   setEmail("");
    //   setName("");
    // } catch (error) {
    //   toast.error("Something went wrong. Please try again.");
    // } finally {
    //   setLoading(false);
    // }
    
    // Mock success for now
    setTimeout(() => {
      toast.success("You've been added to the waitlist 🎉");
      setWaitlistCount((prev) => prev + 1);
      setEmail("");
      setName("");
      setLoading(false);
    }, 1000);
  };

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  // 🔹 GSAP animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      if (titleRef.current) {
        gsap.from(titleRef.current, {
          y: 80,
          opacity: 0,
          duration: 1.2,
          ease: "power3.out",
        });
      }
      
      if (subtitleRef.current) {
        gsap.from(subtitleRef.current, {
          y: 60,
          opacity: 0,
          duration: 1,
          ease: "power3.out",
          delay: 0.3,
        });
      }
      
      if (paragraphRef.current) {
        gsap.from(paragraphRef.current, {
          y: 40,
          opacity: 0,
          duration: 1,
          ease: "power3.out",
          delay: 0.5,
        });
      }
      
      if (formRef.current) {
        gsap.from(formRef.current, {
          y: 40,
          opacity: 0,
          duration: 1,
          ease: "power3.out",
          delay: 0.7,
        });
      }
      
      if (logoLeftRef.current) {
        gsap.from(logoLeftRef.current, {
          x: -150,
          opacity: 0,
          duration: 1.5,
          ease: "power3.out",
        });
      }
      
      if (logoRightRef.current) {
        gsap.from(logoRightRef.current, {
          x: 150,
          opacity: 0,
          duration: 1.5,
          ease: "power3.out",
        });
      }
      
      if (sectionRef.current) {
        gsap.to(sectionRef.current, {
          opacity: 0.6,
          scale: 0.95,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      }
    }, sectionRef);
    
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative -mb-24 md:min-h-screen overflow-hidden bg-gradient-to-br from-yellow-50 via-orange-50 to-pink-50"
    >
      {/* Toast notifications */}
      <Toaster
        toastOptions={{
          style: {
            background: "#333",
            color: "#fff",
            fontSize: "10px",
          },
          success: {
            style: {
              background: "#22c55e",
            },
          },
          error: {
            style: {
              background: "#ef4444",
            },
          },
        }}
      />

      {/* Decorative Logo Left */}
      <div ref={logoLeftRef} className="absolute -top-12 left-0">
        <Image
          src="/icons/Vector.svg"
          alt="Decorative logo"
          width={250}
          height={250}
          className="w-[180px] h-[180px] md:w-[250px] md:h-[250px]"
          priority
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center mt-8 justify-center min-h-[100vh] md:min-h-[100vh] px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <h1
            ref={titleRef}
            className="text-[40px] md:text-7xl trialheader font-medium text-[#5D2D2B] -mb-2"
          >
            A New Era
          </h1>

          <div className="relative inline-block">
            <h2
              ref={subtitleRef}
              className="text-5xl md:text-6xl font-light trial2 italic text-[#5D2D2B] mb-4"
            >
              Of Networking is Coming!!!
            </h2>
            <Image
              src="/icons/scribble.svg"
              alt="Underline decoration"
              width={300}
              height={300}
              className="absolute left-35 md:left-130 -translate-x-1/2 top-full mt-[-0.5rem] w-[150px] h-auto"
            />
          </div>

          <p
            ref={paragraphRef}
            className="text-[15px] text-center font-thin text-[#5D2D2B] mt-4 mb-6 max-w-xl mx-auto"
          >
            Tired of juggling multiple links and hoping someone types your name
            correctly? 🅰bio is a new platform that combines the power of a
            link-in-bio tool with NFC tech for seamless sharing.
          </p>

          {/* Waitlist Form */}
          <form
            ref={formRef}
            onSubmit={handleSubmit}
            className="w-full max-w-md mx-auto flex flex-col gap-4"
          >
            {/* Full Name Input */}
            <input
              type="text"
              value={name}
              onChange={handleNameChange}
              placeholder="Full name"
              className="w-full px-4 py-3 border-2 border-black focus:outline-none focus:ring-2 focus:ring-yellow-400"
              required
            />

            {/* Email Input */}
            <input
              type="email"
              value={email}
              onChange={handleEmailChange}
              placeholder="Email"
              className="w-full px-4 py-3 border-2 border-black focus:outline-none focus:ring-2 focus:ring-yellow-400"
              required
            />

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`bg-[#FED45C] shadow-[3px_3px_0px_0px_#000000] text-[#FF0000] px-4 py-3 font-semibold transition-opacity ${
                loading ? "opacity-70 cursor-not-allowed" : "hover:opacity-90"
              }`}
            >
              {loading ? "Joining..." : "Waitlist"}
            </button>
          </form>
          
          <p className="text-[13px] my-4">
            We Promise to protect your information and keep it confidential
          </p>
        </div>
      </div>
    </section>
  );
};

export default Hero;