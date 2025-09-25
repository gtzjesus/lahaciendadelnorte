import React from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

function ActionButtons() {
  return (
    <div className="flex flex-col sm:flex-row justify-center">
      <Button
        asChild
        className="uppercase text-xs font-light bg-flag-light-blue text-white transition-all duration-200 shadow-md"
      >
        <Link href="/storage">browse more storages</Link>
      </Button>
    </div>
  );
}

export default ActionButtons;
