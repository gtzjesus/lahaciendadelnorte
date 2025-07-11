'use client';

import { ClerkProvider } from '@clerk/nextjs';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useState } from 'react';
import clsx from 'clsx';
import '../globals.css';
import AdminGuard from '@/components/auth/AdminGuard';
import { Toaster } from 'sonner';

const navItems = [
  { name: 'point of sale', href: '/admin/pos' },
  { name: 'Inventory', href: '/admin/inventory' },
  { name: 'Orders', href: '/admin/orders' },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <ClerkProvider>
      <AdminGuard>
        <div className="flex flex-col min-h-screen ">
          {/* Global header used across all screen sizes */}
          <header className="sticky top-0 z-50 bg-flag-red text-white p-4 flex justify-between items-center shadow-sm">
            <Link
              href="/admin/pos"
              className="uppercase font-light text-md hover:underline"
            >
              la duena
            </Link>

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
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
            </button>
          </header>

          {/* Slide-down menu */}
          {menuOpen && (
            <nav className="fixed top-12 left-0 right-0 z-40 bg-flag-red text-white p-4 shadow-md">
              <div className="flex flex-col space-y-2">
                {navItems.map(({ name, href }) => (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setMenuOpen(false)}
                    className={clsx(
                      'uppercase text-sm px-3 py-2 rounded hover:bg-black-100 transition',
                      pathname === href && 'bg-flag-blue'
                    )}
                  >
                    {name}
                  </Link>
                ))}
              </div>
            </nav>
          )}

          {/* Toasts */}
          <Toaster
            position="top-right"
            richColors
            closeButton
            duration={Infinity}
            offset={64}
            toastOptions={{
              className: 'mb-4 shadow-lg rounded-lg',
            }}
          />

          {/* Page content */}
          <main className="flex-1">{children}</main>
        </div>
      </AdminGuard>
    </ClerkProvider>
  );
}
