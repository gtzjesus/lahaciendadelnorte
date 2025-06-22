// app/error.tsx
'use client'; // Yes — this needs to be a client component

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Server/render error caught:', error);
  }, [error]);

  return (
    <div className="min-h-screen text-white bg-flag-red uppercase flex items-center justify-center text-center p-4">
      <div>
        <h1 className="text-xl font-bold  mb-4">Oops! Something went wrong.</h1>
        <p className="mb-4 text-xs">
          A server-side or rendering error occurred. Try again.
        </p>
        <button
          onClick={() => reset()}
          className="px-4 py-2 bg-flag-blue uppercase text-sm   transition"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
