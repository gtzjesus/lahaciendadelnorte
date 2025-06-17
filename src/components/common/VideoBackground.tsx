'use client';

import React, { useState } from 'react';
import Image from 'next/image';

const VideoBackground: React.FC = () => {
  const [videoReady, setVideoReady] = useState(false);

  const handleVideoReady = () => {
    setVideoReady(true);
  };

  return (
    <div className="relative w-full h-screen">
      {/* Optimized Fallback Image */}
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
        className={`absolute inset-0 w-full h-full object-cover md:hidden z-0 transition-opacity duration-700 ${
          videoReady ? 'opacity-100' : 'opacity-0'
        }`}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        disableRemotePlayback
        controlsList="nodownload nofullscreen noremoteplayback"
        aria-hidden="true"
        onCanPlay={handleVideoReady}
      >
        <source src="/videos/background-vertical.mp4" type="video/mp4" />
        {/* Removed webm for Safari compatibility */}
        Your browser does not support the video tag.
      </video>

      {/* Desktop Video */}
      <video
        className={`absolute inset-0 w-full h-full object-cover hidden md:block z-0 transition-opacity duration-700 ${
          videoReady ? 'opacity-100' : 'opacity-0'
        }`}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        disableRemotePlayback
        controlsList="nodownload nofullscreen noremoteplayback"
        aria-hidden="true"
        onCanPlay={handleVideoReady}
      >
        <source src="/videos/background-horizontal.mp4" type="video/mp4" />
        {/* Removed webm for Safari compatibility */}
        Your browser does not support the video tag.
      </video>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black opacity-50 z-10" />
    </div>
  );
};

export default VideoBackground;
