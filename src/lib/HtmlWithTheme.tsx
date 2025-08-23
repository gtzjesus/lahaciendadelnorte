// app/HtmlWithTheme.tsx
'use client';

import { useEffect, useState } from 'react';

export default function HtmlWithTheme({
  children,
}: {
  children: React.ReactNode;
}) {
  const [htmlClass, setHtmlClass] = useState('scroll-smooth antialiased'); // default

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia(
      '(prefers-color-scheme: dark)'
    ).matches;

    const shouldUseDark = savedTheme === 'dark' || (!savedTheme && prefersDark);
    setHtmlClass(`scroll-smooth antialiased${shouldUseDark ? ' dark' : ''}`);
  }, []);

  // Set class on <html> manually since Next doesn't allow dynamic className on <html>
  useEffect(() => {
    document.documentElement.className = htmlClass;
  }, [htmlClass]);

  return <>{children}</>;
}
