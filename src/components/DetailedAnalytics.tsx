"use client";
import { useEffect, useState } from "react";
import Image from "next/image";

const DetailedAnalytics = () => {
  const [views, setViews] = useState(0);
  const [clicks, setClicks] = useState(0);
  const [rate, setRate] = useState(0);

  useEffect(() => {
    let v = 0, c = 0, r = 0;
    const interval = setInterval(() => {
      if (v < 100) setViews(++v);
      if (c < 100) setClicks(++c);
      if (r < 100) setRate(++r);
      if (v >= 100 && c >= 100 && r >= 100) clearInterval(interval);
    }, 20);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="bg-[#FFDCE3] py-12 md:py-16 px-5 md:px-8 lg:px-16">
      <div className="container mx-auto grid md:grid-cols-2 items-center gap-12">
        
        {/* Left Side: Image + Text */}
        <div className="flex flex-col items-center text-center md:items-start md:text-left space-y-5">
          <Image
            src="/images/Group.svg"
            alt="Analytics Illustration"
            width={400}
            height={400}
            className="w-[250px] sm:w-[300px] md:w-[400px] h-auto"
          />
          <p className="text-[13px] text-left sm:text-[14px] text-[#5D2D2B] max-w-md leading-relaxed">
            Track exactly who clicks and views your A.bio, see when, where, and
            how they visit — gain deeper insights and understand your audience better.
          </p>
        </div>

        {/* Right Side: Text + Stats */}
        <div className="space-y-6 relative text-left">
          <h2 className="text-[35px] sm:text-4xl md:text-5xl trialheader font-extrabold text-[#5D2D2B] leading-tight">
            Get detailed <br className="hidden sm:block" /> Analytics
          </h2>

          <p className="text-[#5D2D2B] text-[13px] sm:text-base max-w-md mx-auto md:mx-0 leading-relaxed">
            See who clicks and views your Abio profile. Track engagement over time,
            measure click rate, and learn what’s converting your audience.
          </p>

          {/* Floating Tag */}
          <div className="absolute top-12 right-0 sm:top-5 sm:right-10">
            <span className="inline-block bg-lime-300 border border-black text-black px-3 py-1 rounded-full text-xs sm:text-sm font-semibold shadow-md">
              Social & NFC
            </span>
          </div>

          {/* Stats Section */}
          <div className="flex flex-row sm:justify-start justify-between sm:gap-10 mt-6">
            <div className="text-center">
              <p className="text-2xl sm:text-6xl font-extrabold text-red-600">{views}+</p>
              <p className="text-[13px] sm:text-lg text-red-600 font-medium">Views</p>
            </div>
            <div className="text-center">
              <p className="text-2xl sm:text-6xl font-extrabold text-red-600">{clicks}+</p>
              <p className="text-[13px] sm:text-lg text-red-600 font-medium">Clicks</p>
            </div>
            <div className="text-center">
              <p className="text-2xl sm:text-6xl font-extrabold text-red-600">{rate}%</p>
              <p className="text-[13px] sm:text-lg text-red-600 font-medium">Click Rate</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DetailedAnalytics;



