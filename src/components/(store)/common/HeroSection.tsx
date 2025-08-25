'use client';

import Link from 'next/link';
import { FC, useEffect, useState } from 'react';

const HeroSection: FC = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrolledDown = window.scrollY > 0;
      setScrolled(scrolledDown);
      console.log('Scrolled:', scrolledDown); // debug
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <div className="absolute top-[25%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 text-center px-4 max-w-[90vw]">
        <h1 className="uppercase font-bold text-5xl  lg:text-10xl text-white leading-tight mb-4">
          build<strong className="mx-1"></strong>your
          <br />
          custom<strong className="mx-1"></strong>storage
        </h1>
      </div>

      <div className="flex gap-1 fixed  left-1/2 transform -translate-x-1/2 bottom-10 z-[10]">
        <Link
          href="/"
          className={`border px-4 py-5 block text-center rounded-3xl text-xs font-bold uppercase transition duration-200 ease-in-out shadow-sm text-white `}
        >
          Qualify<strong className="mx-1"></strong>Here
        </Link>
        <Link
          href="/"
          className={`border px-4 py-5 block text-center rounded-3xl text-xs font-bold uppercase transition duration-200 ease-in-out shadow-sm text-white `}
        >
          Build<strong className="mx-1"></strong>Storage
        </Link>
      </div>
    </>
  );
};

export default HeroSection;
