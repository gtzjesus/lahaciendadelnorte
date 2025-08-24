// app/not-found.tsx

import Link from 'next/link';
import Image from 'next/image';

export const metadata = {
  title: 'Page Not Found | La Dueña',
  description: 'Oops! This page doesn’t exist. Head back to the sweet side.',
};

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-flag-red text-black px-6 py-12 text-center dark:bg-gray-800 dark:text-flag-red">
      <Image
        src="/admin/notfound.gif"
        alt="La Dueña Logo"
        width={120}
        height={120}
        className="mb-6 "
      />

      <h1 className="text-2xl font-bold mb-4">404 - Page Not Found!å</h1>

      <p className="text-sm max-w-md mb-6">
        Oops! Looks like you took a wrong turn!
        <br />
        <br />
        Let’s get you back on track
      </p>

      <Link
        href="/admin/pos"
        className=" py-2 rounded-full text-xs font-bold uppercase transition duration-200 ease-in-out shadow-sm bg-black text-white dark:bg-flag-red dark:text-black w-[50vh]"
      >
        Go Back Home
      </Link>
    </div>
  );
}
