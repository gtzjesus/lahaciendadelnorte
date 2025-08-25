'use client';

import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import Image from 'next/image';
import AuthButtons from '../../auth/AuthButtons';

const navItems = [
  { name: 'Home', href: '/' },
  { name: 'Start Building', href: '/build-storage' },
  { name: 'Qualify With Lender', href: '/qualify' },

  { name: 'Contact', href: '/contact' },
];

const Header = () => {
  const { user } = useUser();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  // Escape key closes menu
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  return (
    <motion.header
      initial={false}
      animate={{
        height: menuOpen ? '100vh' : '64px',
      }}
      transition={{ duration: 0.4 }}
      className={clsx(
        'sticky top-0 z-50 bg-flag-red text-white p-4 w-full overflow-hidden flex flex-col items-center',
        menuOpen ? 'justify-start' : 'justify-between'
      )}
    >
      {/* Top Row - Logo & Menu Button */}
      <div className="w-full flex justify-between items-center md:hidden">
        <Link href="/" className="relative w-[30px] h-[30px]">
          <Image
            src="/icons/logo.webp"
            alt="Logo"
            fill
            priority
            className="object-contain"
          />
        </Link>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        >
          {menuOpen ? (
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </button>
      </div>

      {/* Desktop Nav (optional future use) */}
      <div className="hidden md:flex items-center justify-between w-full px-10">
        <div className="flex items-center space-x-4">
          <Link href="/">
            <Image src="/icons/logo.webp" alt="Logo" width={30} height={30} />
          </Link>
          <span className="text-white uppercase font-bold text-sm tracking-wide">
            La Hacienda Del Norte
          </span>
        </div>

        <div className="flex space-x-6 text-sm">
          {navItems.map(({ name, href }) => (
            <Link
              key={href}
              href={href}
              className={clsx(
                'hover:text-gray-200 transition-colors',
                pathname === href ? 'text-white underline' : ''
              )}
            >
              {name}
            </Link>
          ))}
          <AuthButtons user={user ?? null} />
        </div>
      </div>

      {/* Mobile Nav Items - Animated */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="flex flex-col items-center justify-center flex-1 space-y-6 w-full md:hidden mt-8"
          >
            <div className="relative w-[100px] h-[50px]">
              <h1
                className="uppercase font-bold text-xs  text-white leading-tight text-center 
          drop-shadow-[0_4px_6px_rgba(0,0,0,0.9)]"
              >
                La Hacienda del norte
              </h1>
            </div>

            {navItems.map(({ name, href }, i) => (
              <motion.div
                key={href}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
              >
                <Link
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  className={clsx(
                    'text-xl font-semibold transition-colors',
                    pathname === href ? 'text-white underline' : 'text-white'
                  )}
                >
                  {name}
                </Link>
              </motion.div>
            ))}

            <div className="font-bold">
              <AuthButtons user={user ?? null} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Header;
