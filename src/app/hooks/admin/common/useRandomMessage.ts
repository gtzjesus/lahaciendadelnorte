// hooks/useRandomMessage.ts

import { useMemo } from 'react';

export function useRandomMessage(messages: string[]) {
  const message = useMemo(() => {
    const index = Math.floor(Math.random() * messages.length);
    return messages[index];
  }, [messages]);

  return message;
}
