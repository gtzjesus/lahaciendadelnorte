'use client';

import { useUser } from '@clerk/nextjs';
// import useBasketStore from '../../../../store/store'; // Import custom store for basket items
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import AuthButtons from '../../auth/AuthButtons'; // Import the AuthButtons component
// import CartButton from '../../basket/CartButton'; // Import CartButton
// import SearchButton from '../../search/SearchButton';

const Header = () => {
  const { user } = useUser();
  // const itemCount = useBasketStore((state) =>
  //   state.items.reduce((total, item) => total + item.quantity, 0)
  // );

  const pathname = usePathname();

  // States for managing various UI features
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [windowWidth] = useState<number>(0);

  // Client-side mounting
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Close menu on desktop or when pathname changes
  useEffect(() => {
    if (windowWidth >= 648) setIsMenuOpen(false);
  }, [windowWidth]);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  // Disable body scrolling when the mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  if (!isMounted) return null; // Prevent rendering on server-side

  return (
    <header className=" z-20 flex items-center px-4 py-3 w-full transition-all duration-300 ease-in-out">
      <div className="flex w-full">
        {/* Left side: Logo and Company Name */}
        <div className="flex items-center flex-1">
          <Link href="/" className="font-bold cursor-pointer sm:mx-0 sm:hidden">
            <Image
              src={'/icons/logo.webp'}
              alt="worldhello"
              width={50}
              height={50}
              className="w-7 h-7"
              priority
            />
          </Link>
          <div className="relative left-1/2 transform -translate-x-1/2 ">
            <Link
              href="/"
              className={`text-white  sm:mx-0 sm:hidden uppercase font-bold text-xs leading-tight text-center my-2 px-1 
          drop-shadow-[0_4px_6px_rgba(0,0,0,0.9)] `}
            >
              La Hacienda Del Norte
            </Link>
          </div>

          <div className="uppercase  hidden sm:flex items-center space-x-2">
            <Link href="/">
              <Image
                src={'/icons/logo.webp'}
                alt="worldhello"
                width={30}
                height={30}
                priority
              />
            </Link>
            <Link href="/" className={`uppercase text-sm text-white `}>
              Hacienda del norte
            </Link>
          </div>
        </div>

        {/* Right side: Search, Cart, and Auth Buttons */}
        <div className="flex items-center space-x-5 font-bold px-5">
          {/* <SearchButton scrolled={scrolled} /> */}
          {/* Conditionally render CartButton only if the pathname is not '/basket' */}
          {/* {pathname !== '/basket' && (
            <CartButton itemCount={itemCount} scrolled={scrolled} />
          )} */}
          <div className={`hidden sm:flex items-center ${'text-white'}`}>
            <AuthButtons user={user ?? null} />
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen((prev) => !prev)}
          className="sm:hidden flex flex-col justify-center items-center space-y-1 z-30 relative group"
        >
          {/* Top Bar (first line) */}
          <div
            className={`w-5 h-0.5 ${'bg-white'} transition-all duration-300 ease-in-out transform ${
              isMenuOpen ? 'rotate-45 translate-y-0.5' : ''
            }`}
          />
          {/* Bottom Bar (third line) */}
          <div
            className={`w-5 h-0.5 ${'bg-white'} transition-all duration-300 ease-in-out transform ${
              isMenuOpen ? '-rotate-45 -translate-y-0.5' : ''
            }`}
          />
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={`absolute inset-0 bg-flag-red bg-opacity-100 z-10 transition-opacity duration-300 ${
          isMenuOpen ? 'opacity-75 ' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsMenuOpen(false)}
      />
      {/* Mobile Menu */}
      <div
        className={`absolute right-0 top-0 h-full w-full shadow-xl z-20 transform transition-opacity duration-300 ease-in-out ${
          isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <button
          onClick={() => setIsMenuOpen(false)}
          className="absolute top-3.5 right-8 text-lg text-white"
        >
          {isMenuOpen ? '' : <span className="text-white"></span>}
        </button>
        <div className="flex flex-col items-center  h-full p-20 space-y-6">
          <div className="flex flex-col items-center space-y-4 text-white text-xl">
            <AuthButtons user={user ?? null} />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
