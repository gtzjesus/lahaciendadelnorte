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
        opacity: 0.5, // slightly more transparent
        acceleration: 1.0, // less acceleration for slower movement
        friction: 0.98, // more friction to slow things down
        gravity: 0.9, // slightly lighter gravity
        explosion: 8, // smaller explosion radius
        particles: 80, // fewer particles = less intense
        traceLength: 5,
        traceSpeed: 2,
        flickering: 10, // less flickering
        lineStyle: 'round',
        hue: { min: 20, max: 35 }, // keep it orange
        brightness: { min: 60, max: 85 }, // reduced brightness
        delay: { min: 100, max: 150 }, // slower launching
        rocketsPoint: { min: 40, max: 80 },
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

      <div className="absolute lg:top-96 top-56 left-5 2xl:left-32 -translate-y-1/2 z-10 max-w-[90vw] lg:max-w-xl">
        <p className="uppercase font-black text-sm lg:text-xl text-white tracking-widest mb-2">
          el paso kaboom
        </p>

        <h1 className="uppercase font-black text-5xl sm:text-6xl lg:text-8xl text-white leading-tight mb-4">
          Light up <br />
          the sky!
        </h1>
        <p className="uppercase font-black text-xs lg:text-xl text-flag-red tracking-widest mb-2">
          Reserve your fireworks now! <br />
        </p>
      </div>

      <Link
        href="/search?q=*"
        className={`fixed bottom-10 left-1/2 transform -translate-x-1/2 p-4 block uppercase text-xs z-[10] font-light text-center transition ${
          scrolled
            ? 'bg-flag-blue text-white hover:bg-blue-600'
            : 'bg-white text-gray-800 hover:bg-gray-200'
        }`}
        aria-label="reserve fireworks"
      >
        reserve fireworks
      </Link>
    </>
  );
};

export default HeroSection;
