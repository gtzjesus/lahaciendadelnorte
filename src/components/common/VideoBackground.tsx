'use client';

import React, { useState } from 'react';
import Image from 'next/image';

export default function VideoBackground() {
  const [videoReady, setVideoReady] = useState(false);

  const handleVideoReady = () => setVideoReady(true);

  return (
    <div className="relative w-full h-screen">
      {/* Fallback Image */}
      {!videoReady && (
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/elpaso.webp"
            alt="Loading background"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </div>
      )}

      {/* Mobile Video */}
      <video
        className={`absolute inset-0 w-full h-full object-cover md:hidden transition-opacity duration-700 ${
          videoReady ? 'opacity-100' : 'opacity-0'
        }`}
        autoPlay
        muted
        loop
        playsInline
        poster="/images/elpaso.webp"
        controls={false}
        tabIndex={-1}
        style={{ pointerEvents: 'none' }}
        disableRemotePlayback
        aria-hidden="true"
        onCanPlay={handleVideoReady}
      >
        <source src="/videos/background-vertical.webm" type="video/webm" />
        <source src="/videos/background-vertical.mp4" type="video/mp4" />
      </video>

      {/* Desktop Video */}
      <video
        className={`absolute inset-0 w-full h-full object-cover hidden md:block transition-opacity duration-700 ${
          videoReady ? 'opacity-100' : 'opacity-0'
        }`}
        autoPlay
        muted
        loop
        playsInline
        poster="/images/elpaso.webp"
        controls={false}
        tabIndex={-1}
        style={{ pointerEvents: 'none' }}
        disableRemotePlayback
        aria-hidden="true"
        onCanPlay={handleVideoReady}
      >
        <source src="/videos/background-horizontal.webm" type="video/webm" />
        <source src="/videos/background-horizontal.mp4" type="video/mp4" />
      </video>

      {/* Dark Overlay */}
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
