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
      {/* Title near the top with text shadow */}
      <h1
        className="uppercase font-bold text-5xl lg:text-8xl text-white leading-tight text-center px-1 
          drop-shadow-[0_4px_6px_rgba(0,0,0,0.9)]"
      >
        Build your <br /> Custom Storage
      </h1>

      {/* Buttons near the bottom with solid background & shadow */}
      <div className="flex justify-center gap-2 w-full max-w-lg px-1 mb-20 ">
        <Link
          href="/"
          className=" bg-opacity-90 border border-white px-6 py-5 text-center lg:text-lg rounded-3xl text-xs font-bold transition duration-200 ease-in-out shadow-lg text-white w-full max-w-[180px] hover:bg-opacity-100  drop-shadow-[0_4px_6px_rgba(0,0,0,0.9)]"
        >
          Qualify Here
        </Link>
        <Link
          href="/"
          className=" bg-opacity-90 border border-white px-6 py-5 text-center lg:text-lg rounded-3xl text-xs font-bold transition duration-200 ease-in-out shadow-lg text-white w-full max-w-[180px] hover:bg-opacity-100  drop-shadow-[0_4px_6px_rgba(0,0,0,0.9)]"
        >
          Build Storage
        </Link>
      </div>
    </div>
  );
};

export default HeroSection;
