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

    if (fireworksRef.current) {
      const fireworks = new Fireworks(fireworksRef.current, {
        opacity: 0.6,
        acceleration: 1.05,
        friction: 0.95,
        gravity: 1.5,
        explosion: 6,
        particles: 80,
        traceLength: 4,
        traceSpeed: 8,
        flickering: 40,
        lineStyle: 'round',
        hue: { min: 0, max: 360 },
        delay: { min: 30, max: 60 },
        rocketsPoint: { min: 30, max: 70 },
        brightness: { min: 60, max: 90 },
        autoresize: true,
        sound: { enabled: false },
      });
      fireworks.start();
      return () => {
        fireworks.stop();
      };
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <>
      <div
        ref={fireworksRef}
        className="absolute inset-0 pointer-events-none z-[1]"
      />

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

      <Link
        href="/search?q=*"
        className={`fixed bottom-10 left-1/2 transform -translate-x-1/2 p-4 block uppercase text-xs z-[10] font-light text-center transition ${
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
