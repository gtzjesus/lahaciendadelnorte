'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface BackgroundProps {
  className?: string;
  imageSrc?: string; // Custom image per page
  overlayOpacity?: number; // Optional overlay intensity (default 50%)
}

export default function Background({
  className = '',
  imageSrc = '/(store)/lahacienda-preview.webp',
  overlayOpacity = 90,
}: BackgroundProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className={`absolute inset-0 w-full h-full ${className}`}>
      <Image
        src={imageSrc}
        alt="Background"
        fill
        sizes="100vw"
        className={`object-cover transition-opacity duration-700 ${
          loaded ? `opacity-${overlayOpacity}` : 'opacity-0'
        }`}
        onLoadingComplete={() => setLoaded(true)}
        priority
      />

      {/* Optional black overlay */}
      <div
        className="absolute inset-0 bg-black z-10"
        style={{ opacity: 0.5 }}
      />
    </div>
  );
}
