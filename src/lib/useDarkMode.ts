'use client';

import { useEffect, useState } from 'react';

export const useDarkMode = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const isDarkClassPresent =
      document.documentElement.classList.contains('dark');
    setIsDark(isDarkClassPresent);
  }, []);

  const toggleDarkMode = () => {
    const html = document.documentElement;
    const isCurrentlyDark = html.classList.contains('dark');

    if (isCurrentlyDark) {
      html.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDark(false);
    } else {
      html.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDark(true);
    }
  };

  return { isDark, toggleDarkMode };
};
