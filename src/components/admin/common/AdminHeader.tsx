'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import clsx from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

const navItems = [
  { name: 'point of sale', href: '/admin/pos' },
  { name: 'Orders', href: '/admin/orders' },
  { name: 'Inventory', href: '/admin/inventory' },
];

export default function AdminHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  // Optional: ESC to close
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-50 bg-flag-red text-black p-4 flex justify-between items-center shadow-sm">
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
              xmlns="http://www.w3.org/2000/svg"
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
              xmlns="http://www.w3.org/2000/svg"
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
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="admin-menu"
            initial={{ y: '-100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '-100%', opacity: 0 }}
            transition={{ duration: 0.75, ease: 'easeInOut' }}
            className="fixed inset-0 z-40 bg-flag-red text-black flex flex-col justify-center items-center space-y-8 p-6"
            style={{ willChange: 'transform' }}
          >
            {navItems.map(({ name, href }, i) => (
              <motion.div
                key={href}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.1 }}
              >
                <Link
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  className={clsx(
                    'text-xl md:text-2xl uppercase font-bold tracking-wide transition-transform',
                    pathname === href && 'text-flag-blue'
                  )}
                >
                  {name}
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
