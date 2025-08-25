import React from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

function ActionButtons() {
  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-center">
      <Button
        asChild
        className="uppercase text-xs font-light bg-flag-blue transition-all duration-200 shadow-md"
      >
        <Link href="/orders">View Reservation</Link>
      </Button>
      <Button
        asChild
        variant="outline"
        className="transition-all duration-200 uppercase text-xs font-light"
      >
        <Link href="/search?q=*">Continue Shopping</Link>
      </Button>
    </div>
  );
}

export default ActionButtons;
