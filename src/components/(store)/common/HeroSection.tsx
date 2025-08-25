'use client';

import Link from 'next/link';
import { FC } from 'react';

interface HeroSectionProps {
  className?: string;
}

const HeroSection: FC<HeroSectionProps> = ({ className = '' }) => {
  return (
    <div className={`relative ${className}`}>
      {/* Title near the top, centered */}
      <div className="absolute bottom-[60vh] left-1/2 transform -translate-x-1/2 z-50 text-center px-4 max-w-[90vw]">
        <h1 className="uppercase font-bold text-7xl lg:text-8xl text-white leading-tight mb-4">
          Build your Custom Storage
        </h1>
      </div>

      {/* Buttons near the bottom, centered */}
      <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 flex gap-4 z-10">
        <Link
          href="/"
          className="border px-4 py-5 block text-center lg:text-lg rounded-3xl text-xs font-bold transition duration-200 ease-in-out shadow-sm text-white"
        >
          Qualify Here
        </Link>
        <Link
          href="/"
          className="border px-4 py-5 block text-center lg:text-lg rounded-3xl text-xs font-bold transition duration-200 ease-in-out shadow-sm text-white"
        >
          Build Storage
        </Link>
      </div>
    </div>
  );
};

export default HeroSection;
