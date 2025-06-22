// components/BuggyComponent.tsx
'use client';

import { useEffect } from 'react';

export default function BuggyComponent() {
  useEffect(() => {
    // Simulate an error when component mounts
    throw new Error('💥 Intentional test error');
  }, []);

  return <div>You should not see this message.</div>;
}
