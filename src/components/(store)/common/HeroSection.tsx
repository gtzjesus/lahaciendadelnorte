'use client';

import Link from 'next/link';
import { FC } from 'react';

interface HeroSectionProps {
  className?: string;
}

const HeroSection: FC<HeroSectionProps> = ({ className = '' }) => {
  return (
    <div
      className={`absolute inset-0 flex flex-col justify-between items-center pt-20 pb-10 md:pt-40 ${className} z-20`}
    >
      {/* Title near the top with text shadow */}
      <h1
        className="uppercase font-bold text-5xl lg:text-8xl text-white leading-tight text-center px-1 
          drop-shadow-[0_4px_6px_rgba(0,0,0,0.9)]"
      >
        Make room <br /> for what matters
      </h1>

      {/* Buttons near the bottom with solid background & shadow */}
      <div className=" w-full max-w-lg px-1 mb-20">
        <p
          className="max-w-lg font-bold text-lg mb-10 lg:text-2xl text-white leading-tight text-center px-2
          drop-shadow-[0_4px_6px_rgba(0,0,0,0.9)]"
        >
          The storage you need — built with trusted craftsmanship
        </p>
        <div className="gap-2 flex justify-center">
          <Link
            href="/"
            className=" bg-opacity-90 border border-white px-5 py-4 text-center lg:text-lg rounded-3xl text-xs font-bold transition duration-200 ease-in-out shadow-lg text-white w-full max-w-[180px] hover:bg-opacity-100  drop-shadow-[0_4px_6px_rgba(0,0,0,0.9)]"
          >
            Qualify Here
          </Link>
          <Link
            href="/storage"
            className=" bg-opacity-90 border border-white px-5 py-4 text-center lg:text-lg rounded-3xl text-xs font-bold transition duration-200 ease-in-out shadow-lg text-white w-full max-w-[180px] hover:bg-opacity-100  drop-shadow-[0_4px_6px_rgba(0,0,0,0.9)]"
          >
            View Sheds
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
