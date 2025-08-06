// app/error.tsx
'use client';

import React, { useEffect } from 'react';

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
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-red-50 text-red-900">
      <h1 className="text-xl font-bold mb-4">Oops! Something went wrong.</h1>
      <p className="mb-6 max-w-xl text-center whitespace-pre-wrap">
        {error?.message || 'Unknown error occurred.'}
      </p>
      <button
        onClick={() => reset()}
        className="px-4 py-2 uppercase bg-red-600 hover:bg-red-700 text-white rounded"
      >
        Try Again
      </button>
    </div>
  );
}
