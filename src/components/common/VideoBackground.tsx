'use client';

import React from 'react';
import Image from 'next/image';

export default function VideoBackground() {
  return (
    <div className="relative w-full h-screen">
      {/* Fallback image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/elpaso.webp"
          alt="Fallback"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </div>

      {/* Mobile video */}
      <video
        className="absolute inset-0 w-full h-full object-cover md:hidden z-0"
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
        <source src="/videos/background-vertical.mp4" type="video/mp4" />
      </video>

      {/* Desktop video */}
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

      {/* Overlay */}
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
