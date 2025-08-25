'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface BackgroundProps {
  className?: string; // Accept className so parent can position
}

export default function Background({ className = '' }: BackgroundProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className={`relative w-full h-screen ${className}`}>
      {/* Imagen móvil */}
      <div className="block absolute inset-0 z-10">
        <Image
          src="/(store)/lahacienda-preview.webp"
          alt="Background mobile"
          fill
          sizes="100vw"
          className={`object-cover transition-opacity duration-700 ${loaded ? 'opacity-80' : 'opacity-0'}`}
          onLoadingComplete={() => setLoaded(true)}
          priority
        />
      </div>

      {/* Imagen desktop */}
      <div className="hidden absolute inset-0 z-10">
        <Image
          src="/(store)/lahacienda-preview.webp"
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
