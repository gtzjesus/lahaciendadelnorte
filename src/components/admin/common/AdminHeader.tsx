'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import clsx from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

const navItems = [
  { name: 'Point of sale', href: '/admin/pos' },
  { name: 'Orders', href: '/admin/orders' },
  { name: 'Inventory', href: '/admin/inventory' },
  { name: 'Settings', href: '/admin/settings' },
];

export default function AdminHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

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
        height: menuOpen ? '100vh' : '8vh',
      }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
      className={clsx(
        'sticky top-0 z-50 dark:bg-gray-800 bg-flag-red text-black dark:text-flag-red p-4 w-full overflow-hidden flex flex-col items-center',
        menuOpen ? 'justify-start' : 'justify-between'
      )}
    >
      {/* Top Row: Mobile Only */}
      <div className="w-full flex justify-between items-center md:hidden">
        <Link href="/" className="relative w-[30px] h-[30px]">
          {/* 🌞 Light mode logo */}
          <Image
            src="/icons/logo-black.webp"
            alt="Logo Light"
            fill
            priority
            className={clsx(
              'dark:hidden object-contain transition-opacity duration-300',
              {
                'opacity-0': menuOpen,
                'opacity-100': !menuOpen,
              }
            )}
          />

          {/* 🌚 Dark mode logo */}
          <Image
            src="/icons/logo-pink.webp"
            alt="Logo Dark"
            fill
            priority
            className={clsx(
              'hidden dark:block object-contain transition-opacity duration-300',
              {
                'opacity-0': menuOpen,
                'opacity-100': !menuOpen,
              }
            )}
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

      {/* Top Row: Desktop Only */}
      <div className="hidden md:flex w-full justify-center items-center">
        <nav className="flex space-x-6">
          {navItems.map(({ name, href }) => (
            <Link
              key={href}
              href={href}
              className={clsx(
                'text-lg transition-colors',
                pathname === href
                  ? 'text-flag-blue'
                  : 'text-black hover:text-flag-blue'
              )}
            >
              {name}
            </Link>
          ))}
        </nav>
      </div>

      {/* Mobile Nav Items - Animated */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="nav-links"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="flex flex-col items-center justify-center  flex-1 space-y-4 w-full md:hidden"
          >
            <div className="relative w-[30px] h-[30px]">
              {/* 🌞 Light mode logo */}
              <Image
                src="/icons/logo-black.webp"
                alt="Logo Light"
                fill
                priority
                className="dark:hidden object-contain"
              />

              {/* 🌚 Dark mode logo */}
              <Image
                src="/icons/logo-pink.webp"
                alt="Logo Dark"
                fill
                priority
                className="hidden dark:block object-contain"
              />
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
                    'text-xl transition-colors ',
                    pathname === href
                      ? 'text-flag-blue'
                      : 'text-black dark:text-flag-red '
                  )}
                >
                  {name}
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
