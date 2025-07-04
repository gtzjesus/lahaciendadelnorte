'use client';

import React from 'react';

// import { SignInButton, useUser } from '@clerk/nextjs';
// import { useRouter } from 'next/navigation';
// import { useEffect, useState } from 'react';

// const ADMIN_EMAILS = ['elpasokaboom@gmail.com'];

// const AdminGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const { user, isLoaded, isSignedIn } = useUser();
//   const router = useRouter();
//   const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

//   useEffect(() => {
//     if (!isLoaded) return;

//     if (!isSignedIn) return;

//     const email = user?.primaryEmailAddress?.emailAddress;

//     if (!email || !ADMIN_EMAILS.includes(email)) {
//       router.push('/');
//     } else {
//       setIsAuthorized(true);
//     }
//   }, [isLoaded, isSignedIn, user, router]);

//   if (!isLoaded || isAuthorized === null) {
//     return (
//       <div>
//         {!isSignedIn ? (
//           <SignInButton mode="modal">
//             <button>admin sign in</button>
//           </SignInButton>
//         ) : null}
//       </div>
//     );
//   }

//   return <>{children}</>;
// };

const AdminGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 🔓 Public mode: all users allowed
  return <>{children}</>;
};

export default AdminGuard;
