'use client';

import '@/app/globals.css';
import AdminHeader from '@/components/admin/common/AdminHeader';
import { ErrorBoundary } from '@/components/admin/common/ErrorBoundary';
import { ClerkProvider } from '@clerk/nextjs';
import { Toaster } from 'sonner';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <ErrorBoundary>
        <div className="flex flex-col min-h-screen dark:bg-gray-900">
          <AdminHeader />
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
      </ErrorBoundary>
    </ClerkProvider>
  );
}
