'use client';

import React from 'react';
import Image from 'next/image';

export default function VideoBackground() {
  return (
    <div className="relative w-full h-screen">
      {/* Mobile-only Fallback Image */}
      <div className="absolute inset-0 z-0 md:hidden">
        <Image
          src="/images/elpaso.webp"
          alt="Mobile Background"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </div>

      {/* Desktop-only Background Video */}
      <video
        className="absolute inset-0 w-full h-full object-cover hidden md:block z-0"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        poster="/images/elpaso.webp"
        controls={false}
        disableRemotePlayback
        aria-hidden="true"
      >
        <source src="/videos/background-horizontal.mp4" type="video/mp4" />
      </video>

      {/* Optional dark overlay */}
      <div className="absolute inset-0 bg-black opacity-50 z-10" />

      <style jsx global>{`
        video::-webkit-media-controls,
        video::-webkit-media-controls-start-playback-button {
          display: none !important;
          -webkit-appearance: none;
          opacity: 0 !important;
          pointer-events: none !important;
          height: 0 !important;
          width: 0 !important;
        }
      `}</style>
    </div>
  );
}
