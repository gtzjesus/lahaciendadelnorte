// components/admin/TestError.tsx
'use client';

export default function BuggyComponent() {
  throw new Error('🔥 Intentional test error to trigger ErrorBoundary');
}
