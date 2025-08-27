'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface BackgroundProps {
  className?: string;
  imageSrc?: string;
  imageSrcDesktop?: string; // Add a desktop-specific image
  overlayOpacity?: number;
}

export default function Background({
  className = '',
  imageSrc = '/(store)/lahacienda-preview.webp',
  imageSrcDesktop = '/(store)/lahacienda-preview-desktop.webp', // Desktop image
  overlayOpacity = 90,
}: BackgroundProps) {
  const [loadedMobile, setLoadedMobile] = useState(false);
  const [loadedDesktop, setLoadedDesktop] = useState(false);

  return (
    <div className={`absolute inset-0 w-full h-full ${className}`}>
      {/* Mobile background image */}
      <div className="block lg:hidden">
        <Image
          src={imageSrc}
          alt="Background mobile"
          fill
          sizes="100vw"
          className={`object-cover transition-opacity duration-700 ${
            loadedMobile ? `opacity-${overlayOpacity}` : 'opacity-0'
          }`}
          onLoadingComplete={() => setLoadedMobile(true)}
          priority
        />
      </div>

      {/* Desktop background image */}
      <div className="hidden lg:block">
        <Image
          src={imageSrcDesktop}
          alt="Background desktop"
          fill
          sizes="100vw"
          className={`object-cover transition-opacity duration-700 ${
            loadedDesktop ? `opacity-${overlayOpacity}` : 'opacity-0'
          }`}
          onLoadingComplete={() => setLoadedDesktop(true)}
          priority
        />
      </div>

      {/* Optional black overlay */}
      <div
        className="absolute inset-0 bg-black z-10"
        style={{ opacity: 0.5 }}
      />
    </div>
  );
}
