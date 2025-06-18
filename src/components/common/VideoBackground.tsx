'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

const VideoBackground: React.FC = () => {
  const [videoReady, setVideoReady] = useState(false);
  const [sourcesLoaded, setSourcesLoaded] = useState(false);

  const mobileRef = useRef<HTMLVideoElement>(null);
  const desktopRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSourcesLoaded(true); // now insert <source> tags
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (mobileRef.current) observer.observe(mobileRef.current);
    if (desktopRef.current) observer.observe(desktopRef.current);

    return () => observer.disconnect();
  }, []);

  const handleVideoReady = () => setVideoReady(true);

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
        ref={mobileRef}
        className={`absolute inset-0 w-full h-full object-cover md:hidden z-0 transition-opacity duration-700 ${
          videoReady ? 'opacity-100' : 'opacity-0'
        }`}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        poster="/images/elpaso.webp"
        disableRemotePlayback
        controlsList="nodownload nofullscreen noremoteplayback"
        aria-hidden="true"
        onCanPlay={handleVideoReady}
      >
        {sourcesLoaded && (
          <>
            <source src="/videos/background-vertical.webm" type="video/webm" />
            <source src="/videos/background-vertical.mp4" type="video/mp4" />
          </>
        )}
        Your browser does not support the video tag.
      </video>

      {/* Desktop Video */}
      <video
        ref={desktopRef}
        className={`absolute inset-0 w-full h-full object-cover hidden md:block z-0 transition-opacity duration-700 ${
          videoReady ? 'opacity-100' : 'opacity-0'
        }`}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        poster="/images/elpaso.webp"
        disableRemotePlayback
        controlsList="nodownload nofullscreen noremoteplayback"
        aria-hidden="true"
        onCanPlay={handleVideoReady}
      >
        {sourcesLoaded && (
          <>
            <source
              src="/videos/background-horizontal.webm"
              type="video/webm"
            />
            <source src="/videos/background-horizontal.mp4" type="video/mp4" />
          </>
        )}
        Your browser does not support the video tag.
      </video>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black opacity-50 z-10" />
    </div>
  );
};

export default VideoBackground;
