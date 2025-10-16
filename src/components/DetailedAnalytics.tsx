"use client";
import { useEffect, useState } from "react";
import Image from "next/image";

const DetailedAnalytics = () => {
  const [views, setViews] = useState(0);
  const [clicks, setClicks] = useState(0);
  const [rate, setRate] = useState(0);

  useEffect(() => {
    let v = 0;
    let c = 0;
    let r = 0;

    const interval = setInterval(() => {
      if (v < 100) setViews((v = v + 1));
      if (c < 100) setClicks((c = c + 1));
      if (r < 100) setRate((r = r + 1));
      if (v >= 100 && c >= 100 && r >= 100) clearInterval(interval);
    }, 20); // speed of counting

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="mb-16 lg:mb-20 bg-[#FFDCE3] ">
      <div className="grid container relative mx-auto py-8 md:grid-cols-2 items-center gap-10">
        {/* Left Side: Illustration + Track Text */}
        <div className="flex flex-col items-center text-center md:items-start md:text-left space-y-4">
          <Image
            src="/images/Group.svg"
            alt="Analytics Illustration"
            width={450}
            height={450}
            className="max-w-[350px] md:max-w-[450px]"
          />
          <p className="text-[14px] mt-2 text-[#5D2D2B] max-w-xs md:max-w-sm">
            Track exactly who clicks and views your A.bio, see when, where, and
            how they visit, so you can gain deeper insights, understand your
            audience better.
          </p>
        </div>

        {/* Right Side: Text Content */}
        <div className="space-y-6 relative">
          <div>
            <h2 className="text-4xl md:text-5xl trialheader font-extrabold text-[#5D2D2B] leading-tight">
              Get detailed <br /> Analytics
            </h2>
          </div>

          <p className="text-[#5D2D2B] text-sm md:text-base max-w-md">
            See who clicks and views your Abio profile. Track your engagement
            overtime, Click rate and learn what’s converting your audience.
          </p>

          {/* Tag */}
          <div className="absolute top-20 right-10 ">
            <span className="inline-block bg-lime-300 border-1 border-black text-black px-4 py-1 rounded-full text-sm font-medium shadow-md">
              Social & Nfc
            </span>
          </div>

          {/* Stats Section */}
          <div className="flex gap-10 mt-6 justify-start">
            <div className="text-center">
              <p className="text-6xl font-extrabold text-red-600">
                {views}+
              </p>
              <p className="text-xl md:text-base text-red-600 font-medium">
                Views
              </p>
            </div>
            <div className="text-center">
              <p className="text-6xl font-extrabold text-red-600">
                {clicks}+
              </p>
              <p className="text-xl md:text-base text-red-600 font-medium">
                Clicks
              </p>
            </div>
            <div className="text-center">
              <p className="text-6xl  font-extrabold text-red-600">
                {rate}%
              </p>
              <p className="text-xl md:text-base text-red-600 font-medium">
                Click Rate
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DetailedAnalytics;


