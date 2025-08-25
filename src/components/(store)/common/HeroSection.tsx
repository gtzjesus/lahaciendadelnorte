'use client';

import Link from 'next/link';
import { FC } from 'react';

const HeroSection: FC = () => {
  return (
    <>
      <div className="absolute top-[25%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 text-center px-4 max-w-[90vw]">
        <h1 className=" font-bold text-5xl  lg:text-8xl text-white leading-tight mb-4">
          Build<strong className="mx-1"></strong>your
          <br />
          Custom<strong className="mx-1"></strong>Storage
        </h1>
      </div>

      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex gap-4 z-10">
        <Link
          href="/"
          className={`border px-4 py-5 block text-center lg:text-lg rounded-3xl text-xs font-bold  transition duration-200 ease-in-out shadow-sm text-white `}
        >
          Qualify<strong className="mx-1"></strong>Here
        </Link>
        <Link
          href="/"
          className={`border px-4 py-5 block text-center lg:text-lg rounded-3xl text-xs font-bold  transition duration-200 ease-in-out shadow-sm text-white `}
        >
          Build<strong className="mx-1"></strong>Storage
        </Link>
      </div>
    </>
  );
};

export default HeroSection;
