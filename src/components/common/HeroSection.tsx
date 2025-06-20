'use client';

import Link from 'next/link';
import { FC, useEffect, useRef, useState } from 'react';
import { Fireworks } from 'fireworks-js';

const HeroSection: FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const fireworksRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);

    // Init fireworks
    if (fireworksRef.current) {
      const fireworks = new Fireworks(fireworksRef.current, {
        hue: { min: 0, max: 360 },
        delay: { min: 15, max: 30 },
        rocketsPoint: { min: 25, max: 75 }, // CORREGIDO
        speed: 2,
        acceleration: 1.05,
        friction: 0.95,
        gravity: 1.5,
        particles: 90,
        trace: 3,
        explosion: 5,
        autoresize: true,
        brightness: {
          min: 50,
          max: 80,
          decay: { min: 0.015, max: 0.03 },
        },
        sound: {
          enabled: false, // CORREGIDO
        },
      });
      fireworks.start();

      return () => fireworks.stop();
    }

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Fireworks Canvas */}
      <div
        ref={fireworksRef}
        className="absolute inset-0 pointer-events-none z-[1]"
      />

      {/* Hero Content */}
      <div className="absolute top-1/2 left-5 2xl:left-64 -translate-y-1/2 z-10 max-w-[90vw] lg:max-w-xl">
        <p className="uppercase font-black text-sm lg:text-xl text-white tracking-widest mb-2">
          el paso kaboom
        </p>

        <h1 className="uppercase font-black text-5xl sm:text-6xl lg:text-8xl text-white leading-tight mb-4">
          Light up <br />
          the sky!
        </h1>

        <p className="uppercase text-white text-xs sm:text-sm font-semibold tracking-wider bg-flag-red px-3 py-2 inline-block rounded shadow-md">
          Use code <strong>KABOOM</strong> at checkout — 4th of July sale on
          now!
        </p>
      </div>

      {/* Fixed CTA button at bottom center */}
      <Link
        href="/search?q=*"
        className={`fixed bottom-10 border-none left-1/2 lg:text-lg lg:p-4 transform -translate-x-1/2 p-4 block border transition-all uppercase text-xs z-[10] font-light text-center  ${
          scrolled
            ? 'bg-flag-blue text-white hover:bg-blue-600'
            : 'bg-white text-gray-800 hover:bg-gray-200'
        }`}
        aria-label="Start shopping"
      >
        Start shopping
      </Link>
    </>
  );
};

export default HeroSection;
