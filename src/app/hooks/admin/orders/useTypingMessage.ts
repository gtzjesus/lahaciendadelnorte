import { useEffect, useState } from 'react';

export function useTypingMessage(
  messages: string[],
  shouldType: boolean,
  delay = 2000,
  speed = 50
) {
  const [currentMessage, setCurrentMessage] = useState('');
  const [charIndex, setCharIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [selectedMessage] = useState(() => {
    const randIndex = Math.floor(Math.random() * messages.length);
    return messages[randIndex];
  });

  useEffect(() => {
    if (!shouldType) return;

    const startDelay = setTimeout(() => {
      setIsTyping(true);
    }, delay);

    return () => clearTimeout(startDelay);
  }, [shouldType, delay]);

  useEffect(() => {
    if (!isTyping || charIndex >= selectedMessage.length) return;

    const timeout = setTimeout(() => {
      setCurrentMessage((prev) => prev + selectedMessage[charIndex]);
      setCharIndex((prev) => prev + 1);
    }, speed);

    return () => clearTimeout(timeout);
  }, [charIndex, isTyping, selectedMessage, speed]);

  return currentMessage;
}
