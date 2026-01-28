"use client";
import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { toast, Toaster } from "sonner";
import { useCreateWaitlist, useGetWaitlist } from "@/hooks/api/useAuth";

gsap.registerPlugin(ScrollTrigger);

// Counter Component
interface CounterProps {
  target: number;
  duration?: number;
  suffix?: string;
}

const Counter = ({ target, duration = 2000, suffix = "" }: CounterProps) => {
  const [count, setCount] = useState(0);
  const counterRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let start = 0;
    const end = target;
    const increment = end / (duration / 16); // ~60fps
    let frame: number;

    const animateCount = () => {
      start += increment;
      if (start < end) {
        setCount(Math.floor(start));
        frame = requestAnimationFrame(animateCount);
      } else {
        setCount(end);
        if (frame) cancelAnimationFrame(frame);
      }
    };

    const trigger = ScrollTrigger.create({
      trigger: counterRef.current,
      start: "top 80%",
      once: true,
      onEnter: () => requestAnimationFrame(animateCount),
    });

    return () => {
      if (frame) cancelAnimationFrame(frame);
      trigger.kill();
    };
  }, [target, duration]);

  return (
    <span ref={counterRef}>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
};

const Waitlist = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [waitlistCount, setWaitlistCount] = useState(0); 

  const { data: waitlistData } = useGetWaitlist();
  const { mutate: joinWaitlist, isPending } = useCreateWaitlist();

  useEffect(() => {
    if (waitlistData?.data) {
      setWaitlistCount(waitlistData.data.length);
    }
  }, [waitlistData]);

  const sectionRef = useRef<HTMLElement>(null);
  const stepsRef = useRef<(HTMLDivElement | null)[]>([]);

  const steps = [
    { icon: "📝", title: "Join Waitlist", description: "Sign up with your email" },
    { icon: "🔔", title: "Get Notified", description: "We'll let you know when we launch" },
    { icon: "🚀", title: "Start Connecting", description: "Join 🅰bio and connect seamlessly" },
  ];

  const addToStepsRefs = (el: HTMLDivElement | null) => {
    if (el && !stepsRef.current.includes(el)) {
      stepsRef.current.push(el);
    }
  };

  // ✅ Increment count on success
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !name.trim()) {
      return toast.error("Please fill in all fields.");
    }

    joinWaitlist(
      { name, email },
      {
        onSuccess: () => {
          setEmail("");
          setName("");
        },
      }
    );
  };

  // GSAP animation
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(sectionRef.current, {
        opacity: 0,
        y: 50,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 85%",
        },
      });

      gsap.from(stepsRef.current, {
        opacity: 0,
        y: 40,
        duration: 0.8,
        stagger: 0.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="waitlist" ref={sectionRef} className="py-16">
      <Toaster position="top-center" />
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h2 className="text-[40px] md:text-5xl font-semibold text-[#5D2D2B] mb-2 md:mb-4 italic">
          Join our Waitlist
        </h2>

        <p className="text-[14px] md:text-[15px]">
          Showcase your links, get closer to your audience faster.
        </p>
        <p className="text-[14px] md:text-[15px] mb-4">All possible with 🅰bio</p>

        {/* Statistics */}
        <div className="grid grid-cols-1 bg-[#FFDCE3] md:grid-cols-3 gap-8 mb-12">
          <div className="p-6">
            <div className="text-3xl font-bold text-gray-800 mb-2">
              <Counter target={waitlistCount} />
            </div>
            <div className="text-gray-600">People on Waitlist</div>
          </div>
          <div className="p-6">
            <div className="text-3xl font-bold text-gray-800 mb-2">
              <Counter target={200} />
            </div>
            <div className="text-gray-600">Joined Recently</div>
          </div>
          <div className="p-6">
            <div className="text-3xl font-bold text-gray-800 mb-2">
              <Counter target={50000 - waitlistCount} />
            </div>
            <div className="text-gray-600">to go</div>
          </div>
        </div>

        {/* Email signup */}
        <form
          onSubmit={handleSubmit}
          id="waitlist2"
          className="w-full max-w-md mx-auto flex flex-col gap-4"
        >
          {/* Full Name Input */}
          <input
            type="text"
            value={name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
            placeholder="Full name"
            className="w-full px-4 py-3 border-2 border-black focus:outline-none focus:ring-2 focus:ring-yellow-400"
            required
          />
          {/* Email Input */}
          <input
            type="email"
            value={email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full px-4 py-3 border-2 border-black focus:outline-none focus:ring-2 focus:ring-yellow-400"
            required
          />

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isPending}
            className={`bg-[#FED45C] shadow-[3px_3px_0px_0px_#000000] text-[#FF0000] px-4 py-3 font-semibold transition-opacity ${
              isPending ? "opacity-70 cursor-not-allowed" : "hover:opacity-90"
            }`}
          >
            {isPending ? "Joining..." : "Join Waitlist"}
          </button>
        </form>

        <p className="text-[13px] my-4">
          We Promise to protect your information and keep it confidential
        </p>

        {/* Steps */}
        <div className="grid grid-cols-1 mt-10 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} ref={addToStepsRefs} className="text-center">
              <div className="text-4xl mb-4">{step.icon}</div>
              <h3 className="text-xl font-bold mb-2">{step.title}</h3>
              <p className="text-sm">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Waitlist;