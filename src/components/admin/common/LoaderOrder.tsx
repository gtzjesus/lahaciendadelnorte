'use client';

import { useTypingMessage } from '@/app/hooks/admin/orders/useTypingMessage';

const loadingMessages = [
  'loading! hang tight!',
  'getting it done for you...',
  'warming up the server for you...',
  'loading! ready in a second...',
  'just a moment...',
];

export default function Loader() {
  const typingMessage = useTypingMessage(loadingMessages, true);

  return (
    <div className="flex flex-col gap-2 items-center justify-center min-h-screen">
      <div className="h-20 w-20 animate-spin rounded-full border-4 border-red-300 border-t-primary" />
      <h2 className="uppercase text-center text-md dark:text-flag-red text-black font-semibold select-none">
        {typingMessage}
        <span className="animate-pulse">|</span>
      </h2>
    </div>
  );
}
