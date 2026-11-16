"use client";

import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1601362840469-51e4d8d58785?auto=format&fit=crop&w=1600&q=80",
    alt: "Hand washing car side mirror with yellow sponge and foam",
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?auto=format&fit=crop&w=1600&q=80",
    alt: "Exterior car detailing and foam wash",
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1507136566006-cfc505b114fc?auto=format&fit=crop&w=1600&q=80",
    alt: "Interior car vacuuming and polishing",
  },
  {
    id: 4,
    image:
      "https://images.unsplash.com/photo-1552930294-6b595f4c2974?auto=format&fit=crop&w=1600&q=80",
    alt: "Luxury car ceramic coating finish",
  },
  {
    id: 5,
    image:
      "https://images.unsplash.com/photo-1605152276897-4f618f831968?auto=format&fit=crop&w=1600&q=80",
    alt: "High pressure car rinse",
  },
];

export default function Banner() {
  const [current, setCurrent] = useState(0);

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="w-full bg-white py-5 px-4 md:px-12">
      <div className="relative w-full h-[260px] sm:h-[360px] md:h-[430px] rounded-lg overflow-hidden shadow-sm group">
        {/* Slide Image */}
        <img
          src={slides[current].image}
          alt={slides[current].alt}
          className="w-full h-full object-cover transition-all duration-500"
        />

        {/* Subtle bottom gradient for pagination visibility */}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />

        {/* Left Arrow */}
        <button
          onClick={prevSlide}
          aria-label="Previous slide"
          className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#FACC15]/85 hover:bg-[#FACC15] text-white flex items-center justify-center shadow transition-all cursor-pointer"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Right Arrow */}
        <button
          onClick={nextSlide}
          aria-label="Next slide"
          className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#FACC15]/85 hover:bg-[#FACC15] text-white flex items-center justify-center shadow transition-all cursor-pointer"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Bottom Pill Pagination Indicators */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrent(index)}
              aria-label={`Go to slide ${index + 1}`}
              className={`h-1 rounded-full transition-all duration-300 cursor-pointer ${
                current === index
                  ? "w-6 bg-[#FACC15]"
                  : "w-4 bg-white/60 hover:bg-white"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}