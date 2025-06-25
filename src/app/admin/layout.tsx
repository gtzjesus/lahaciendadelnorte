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
  { name: 'Dashboard', href: '/admin/dashboard' },
  { name: 'Pos', href: '/admin/pos' },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <ClerkProvider>
      <AdminGuard>
        <div
          className="flex min-h-screen"
          style={{ backgroundColor: '#101015' }}
        >
          {/* Sidebar */}
          <aside
            className={clsx(
              'mt-10 fixed inset-y-0 left-0 z-30 w-64  bg-flag-red text-white p-6 transform transition-transform duration-300 ease-in-out',
              {
                '-translate-x-full': !sidebarOpen,
                'translate-x-0': sidebarOpen,
                'md:translate-x-0 md:static md:inset-auto': true,
              }
            )}
          >
            <nav className="space-y-4">
              {navItems.map(({ name, href }) => (
                <Link
                  key={href}
                  href={href}
                  className={clsx(
                    'block px-3 py-2 uppercase text-md  hover:bg-black-100',
                    pathname === href && 'bg-gray-900'
                  )}
                  onClick={() => setSidebarOpen(false)}
                >
                  {name}
                </Link>
              ))}
            </nav>
          </aside>

          {/* Overlay */}
          {sidebarOpen && (
            <div
              className="fixed inset-0 bg-flag-red opacity-50 z-20 md:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          {/* Main content area */}
          <div className="flex-1 flex flex-col">
            {/* Mobile header */}
            <header className="md:hidden sticky top-0 z-[99999] flex justify-between items-center bg-flag-red text-white p-4 shadow-sm">
              <Link
                href="/admin/dashboard"
                className="uppercase font-light text-md hover:underline"
              >
                kaboom HQ
              </Link>

              {/* Hamburger Button */}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
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

            <main className="flex-1 ">{children}</main>
          </div>
        </div>
      </AdminGuard>
    </ClerkProvider>
  );
}
