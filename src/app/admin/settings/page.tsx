'use client';

import { useDarkMode } from '@/lib/useDarkMode';

export default function SettingsPage() {
  const { isDark, toggleDarkMode } = useDarkMode();

  return (
    <main className="min-h-screen p-10  transition-colors duration-300 bg-background text-foreground dark:bg-gray-900 dark:text-white">
      <h1 className="text-lg text-center font-bold mb-6 text-black dark:text-white">
        Settings
      </h1>
      <div className="flex justify-center">
        <button
          onClick={toggleDarkMode}
          className="px-6 uppercase  py-2 rounded-full font-light text-xs transition 
          bg-flag-blue dark:bg-flag-red text-black dark:text-black shadow-md hs"
        >
          {isDark ? 'Light' : 'Dark'} Mode
        </button>
      </div>
    </main>
  );
}
