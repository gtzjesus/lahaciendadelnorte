'use client';

import Link from 'next/link';
import { FC } from 'react';

interface HeroSectionProps {
  className?: string;
}

const HeroSection: FC<HeroSectionProps> = ({ className = '' }) => {
  return (
    <div
      className={`absolute inset-0 flex flex-col justify-between items-center py-20 ${className} z-20`}
    >
      {/* Optional red tint behind text, above overlay */}
      {/* <div className="absolute inset-0 bg-flag-red opacity-50 -z-10" /> */}

      {/* Title near the top */}
      <h1 className="uppercase font-bold text-5xl lg:text-8xl text-white leading-tight text-center px-4 mt-20">
        Build your <br /> Custom Storage
      </h1>

      {/* Buttons near the bottom */}
      <div className="flex justify-center gap-2 w-full max-w-lg px-4 mb-20">
        <Link
          href="/"
          className="border px-6 py-5 text-center lg:text-lg rounded-3xl text-xs font-bold transition duration-200 ease-in-out shadow-sm text-white w-full max-w-[180px]"
        >
          Qualify Here
        </Link>
        <Link
          href="/"
          className="border px-6 py-5 text-center lg:text-lg rounded-3xl text-xs font-bold transition duration-200 ease-in-out shadow-sm text-white w-full max-w-[180px]"
        >
          Build Storage
        </Link>
      </div>
    </div>
  );
};

export default HeroSection;
