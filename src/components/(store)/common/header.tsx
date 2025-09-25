'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import Image from 'next/image';

const navItems = [
  { name: 'Home', href: '/' },
  { name: 'Storages', href: '/storage' },
  { name: 'Qualify', href: '/qualify' },
];

const Header = () => {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const [scrolled, setScrolled] = useState(false);

  const logoSrc = scrolled
    ? '/icons/logo-blacked.webp'
    : '/icons/logo-blacked.webp';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
        height: menuOpen ? '100vh' : '48px',
      }}
      transition={{ duration: 0.4 }}
      className={clsx(
        'fixed top-0 z-30 px-4 py-2.5 w-full overflow-hidden flex flex-col items-center transition-colors duration-300',
        menuOpen
          ? 'bg-flag-red text-white'
          : scrolled
            ? 'bg-flag-red text-white shadow-md '
            : 'bg-transparent text-white ',
        menuOpen ? 'justify-start' : 'justify-between'
      )}
    >
      {/* Top Row - Logo & Menu Button */}
      <div className="w-full flex justify-between items-center md:hidden">
        <Link href="/" className="relative w-[20px] h-[20px]">
          <Image
            src={logoSrc}
            alt="Logo"
            fill
            priority
            className={clsx('object-contain', menuOpen && 'invisible')}
          />
        </Link>

        <h1
          className={clsx(
            '   uppercase font-light text-sm leading-tight text-center',
            scrolled ? ' text-black ' : ' text-black invisible',
            menuOpen ? 'invisible' : 'justify-between'
          )}
        ></h1>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        >
          {menuOpen ? (
            <svg
              className={clsx(
                'h-6 w-6',
                scrolled ? 'text-black' : 'text-black'
              )}
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
              className={clsx(
                'h-6 w-6',
                scrolled ? 'text-black' : 'text-black'
              )}
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
      <div className="hidden md:flex items-center justify-between w-full px-5">
        <div className="flex items-center space-x-4">
          <Link href="/">
            <Image src={logoSrc} alt="Logo" width={25} height={25} />
          </Link>
          <h1
            className={clsx(
              '   mt-1 uppercase font-light text-xs leading-tight text-center',
              scrolled ? ' text-black' : ' text-black',
              menuOpen ? 'invisible' : 'justify-between'
            )}
          >
            La Hacienda del norte
          </h1>
        </div>

        <div className="flex space-x-6 text-md ">
          {navItems.map(({ name, href }) => (
            <Link
              key={href}
              href={href}
              className={clsx(
                'hover:text-gray-200 transition-colors',
                pathname === href ? 'text-black underline' : '',
                scrolled ? ' text-black' : ' text-black'
              )}
            >
              {name}
            </Link>
          ))}
        </div>
      </div>

      {/* Mobile Nav Items - Animated */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ delay: 0.1, duration: 0.1 }}
            className="flex flex-col items-center justify-center flex-1 space-y-6 w-full md:hidden mt-8"
          >
            {navItems.map(({ name, href }) => (
              <div key={href}>
                <Link
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  className={clsx(
                    'text-xl font-semibold transition-colors',
                    pathname === href ? 'text-black' : 'text-black',
                    scrolled ? 'text-black ' : '  text-black'
                  )}
                >
                  {name}
                </Link>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Header;
