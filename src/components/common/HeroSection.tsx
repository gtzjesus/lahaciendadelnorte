'use client';

import Link from 'next/link';
import { FC, useEffect, useState } from 'react';

const HeroSection: FC = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <div className="absolute top-24 left-5 lg:left-64 z-10">
        <p className="uppercase font-black barlow-condensed-regular tracking-very-wide text-sm  lg:text-xl  text-white">
          el paso kaboom
        </p>
      </div>
      {/* Title in top-left */}
      <div className="absolute top-32 left-5 lg:left-64 lg:top-40 z-10">
        <p className="uppercase font-black barlow-condensed-regular tracking-very-wide text-6xl  lg:text-9xl  text-white">
          light
          <br /> up <br />
          the
          <br /> sky!
        </p>
      </div>
      <div className="absolute top-96 left-5 lg:left-64 lg:top-32 z-10">
        <p className="uppercase text-flag-red font-black barlow-condensed-regular tracking-very-wide text-sm  lg:text-md lg:top-96  ">
          4th of july sale
        </p>
      </div>

      {/* Fixed CTA button at bottom center */}
      <Link
        href="/search?q=*"
        className={`fixed bottom-10 border-none left-1/2 lg:text-lg lg:p-4 transform -translate-x-1/2 p-4 block border transition-all uppercase text-xs z-[9999] font-light text-center  ${
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
