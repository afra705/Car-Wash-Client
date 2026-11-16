"use client";

import React from "react";

const announcements = [
  "Exciting New Services and Important Holiday Hours",
  "Important Updates and Special Offers from Cleanify!",
  "Exciting Announcements from Cleanify!",
];

export default function Marquee() {
  return (
    <div className="w-full bg-white py-3 overflow-hidden border-t border-b border-gray-100">
      <style>{`
        @keyframes cleanifyMarquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .cleanify-marquee-track {
          display: flex;
          width: max-content;
          animation: cleanifyMarquee 25s linear infinite;
        }
        .cleanify-marquee-track:hover {
          animation-play-state: paused;
        }
      `}</style>

      <div className="cleanify-marquee-track">
        {[...announcements, ...announcements].map((text, idx) => (
          <div
            key={idx}
            className="flex items-center gap-2 mx-6 text-sm font-semibold text-[#1e293b] whitespace-nowrap"
          >
            <span role="img" aria-label="announcement">
              🎉
            </span>
            <span>{text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}