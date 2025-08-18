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
        height: menuOpen ? '100vh' : '3.5vh',
      }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
      className={clsx(
        'z-50 bg-flag-red text-black px-4 py-2 w-full overflow-hidden flex flex-col items-center shadow-md',
        menuOpen ? 'justify-start' : 'justify-between'
      )}
    >
      {/* Top Row: Logo + Hamburger */}
      <div className="w-full flex justify-between items-center">
        <Link href="/">
          <Image
            src="/icons/logo-black.webp"
            alt="worldhello"
            width={30}
            height={30}
            priority
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

      {/* Animate the nav items in */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="nav-links"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="flex flex-col items-center justify-center flex-1 space-y-4 w-full"
          >
            <Image
              src="/icons/logo-black.webp"
              alt="worldhello"
              width={30}
              height={30}
              priority
            />
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
                    'text-2xl transition-colors',
                    pathname === href
                      ? 'text-flag-blue'
                      : 'text-black hover:text-flag-blue'
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
