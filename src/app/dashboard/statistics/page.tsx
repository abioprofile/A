"use client";

import React, { useState } from "react";
import Image from "next/image";
import { FiEye, FiTrendingUp } from "react-icons/fi";

export default function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState("analytics");

  const lifetimeStats = [
    { icon: <FiEye />, label: "Views", value: 4000 },
    { icon: <FiTrendingUp />, label: "Overall click", value: 4000 },
    { icon: <FiTrendingUp />, label: "Click Rate", value: "40%" },
  ];

  const links = [
    {
      name: "Instagram",
      icon: "/icons/Social.png",
      views: 1000,
      clicks: 1000,
      rate: "10%",
    },
    {
      name: "Behance",
      icon: "/icons/Social 2.png",
      views: 1000,
      clicks: 1000,
      rate: "10%",
    },
    {
      name: "Add on Snapchat",
      icon: "/icons/Social 1.png",
      views: 1000,
      clicks: 1000,
      rate: "10%",
    },
    {
      name: "X",
      icon: "/icons/Social 3.png",
      views: 1000,
      clicks: 1000,
      rate: "10%",
    },
  ];

  const renderAnalyticsContent = () => (
    <>
      {/* Lifetime */}
      <div className="bg-[#f6f6f6] border border-[#ECE7C7] px-6 py-1 flex justify-between items-center mb-4">
        <div>
          <h2 className="text-[18px] font-bold mb-4">Lifetime</h2>
          <div className="flex gap-12">
            {lifetimeStats.map((stat, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#f0eefc] text-[#6b4eff] flex items-center justify-center">
                  {stat.icon}
                </div>
                <div className="flex gap-2 items-center">
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-[12px] text-gray-600">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <img
          src="/Analytics 1.png"
          alt="chart"
          className="w-[120px] h-[120px] object-contain"
        />
      </div>

      {/* Audience */}
      <div className="bg-[#FEF4EA] border border-[#ECE7C7] p-6 space-y-4">
        <h2 className="text-[18px] font-bold">Audience</h2>

        {/* Link Performance */}
        <div className="bg-white p-6 border border-gray-200">
          <h3 className="text-[16px] font-bold mb-4">Link Performance</h3>
          <table className="w-full">
            <thead>
              <tr className="border-b font-bold border-gray-200 text-left">
                <th className="py-3 text-[14px]">Link Name</th>
                <th className="py-3 text-right text-[13px]">Views</th>
                <th className="py-3 text-right text-[13px]">Clicks</th>
                <th className="py-3 text-right text-[13px]">Click Rate</th>
              </tr>
            </thead>
            <tbody>
              {links.map((link, i) => (
                <tr key={i} className="border-b border-[#D6C5FF]">
                  <td className="py-3 text-[13px] flex items-center gap-3">
                    <div className="w-5 h-5 relative">
                      <Image
                        src={link.icon}
                        alt={link.name}
                        fill
                        className="object-contain filter grayscale"
                      />
                    </div>
                    {link.name}
                  </td>
                  <td className="py-3 text-[13px] text-right">{link.views}</td>
                  <td className="py-3 text-[13px] text-right">{link.clicks}</td>
                  <td className="py-3 text-[13px] text-right">{link.rate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-white relative">
      {/* Tabs Header */}
      <div className="sticky top-0 z-50 bg-white/90 backdrop-blur-md">
        <div className="flex justify-center items-center gap-4 pt-6">
          <button
            onClick={() => setActiveTab("analytics")}
            className={`relative px-10 py-1 text-[14px] font-extrabold transition-all ${
              activeTab === "analytics"
                ? "bg-black text-white"
                : "text-black hover:text-gray-700"
            }`}
          >
            Analytics
            {activeTab === "analytics" && (
              <span className="absolute right-[-12px] top-1/2 -translate-y-1/2 w-[1px] h-5 bg-gray-400" />
            )}
          </button>

          <button
            onClick={() => setActiveTab("nfc")}
            className={`relative px-10 py-1 font-extrabold text-[14px] transition-all ${
              activeTab === "nfc"
                ? "bg-black text-white"
                : "text-black hover:text-gray-700"
            }`}
          >
            NFC Analytics
          </button>
        </div>
      </div>

      {/* Shared Analytics Content */}
      <div className="max-w-5xl mx-auto px-6 py-10 relative">
        {renderAnalyticsContent()}

        {/* Overlay for NFC Analytics */}
        {activeTab === "nfc" && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-[4px] flex flex-col items-center justify-center z-20">
            <div className="flex flex-col items-center">
              <div className="text-5xl mb-2">🔒</div>
              <h1 className="text-2xl font-bold text-[#331400] mb-2">Locked</h1>
              <button className="mt-2 bg-[#f5f0ff] text-[#331400] text-[17px] font-semibold px-6 py-1  font-semibold hover:bg-[#ece5ff]">
                Unlock
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}






