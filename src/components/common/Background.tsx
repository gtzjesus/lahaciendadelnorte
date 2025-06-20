'use client';

import React, { useState } from 'react';
import Image from 'next/image';

export default function Background() {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="relative w-full h-screen">
      {/* Imagen móvil */}
      <div className="block md:hidden absolute inset-0 -z-10">
        <Image
          src="/images/elpaso.webp"
          alt="Background mobile"
          fill
          sizes="100vw"
          className={`object-cover transition-opacity duration-700 ${loaded ? 'opacity-100' : 'opacity-0'}`}
          onLoadingComplete={() => setLoaded(true)}
          priority
        />
      </div>

      {/* Imagen desktop */}
      <div className="hidden md:block absolute inset-0 -z-10">
        <Image
          src="/images/elpaso-desktop.webp"
          alt="Background desktop"
          fill
          sizes="100vw"
          className={`object-cover transition-opacity duration-700 ${loaded ? 'opacity-100' : 'opacity-0'}`}
          onLoadingComplete={() => setLoaded(true)}
          priority
        />
      </div>

      {/* Opcional: overlay negro semi-transparente */}
      <div className="absolute inset-0 bg-black opacity-50 z-0" />
    </div>
  );
}
