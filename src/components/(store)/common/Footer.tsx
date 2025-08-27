// components/Footer.tsx

import Image from 'next/image';

const Footer: React.FC = () => {
  return (
    <footer className="relative overflow-hidden bg-gradient-to-t from-flag-red to-[#f9fafb]  text-white  px-6 pt-10 pb-6">
      {/* Decorative lines or background */}
      <div className="absolute inset-0 opacity-5 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-flag-blue via-transparent to-white "></div>

      <div className="relative z-10 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        {/* Logo + Branding */}
        <div className="flex flex-col items-center md:items-start">
          <Image
            src="/icons/logo-blacked.webp"
            alt="La Hacienda Logo"
            width={40}
            height={40}
            className="mb-2"
            priority
          />
          <h1 className="uppercase font-bold text-lg lg:text-2xl text-center md:text-left drop-shadow">
            La Hacienda del Norte
          </h1>
          <p className="uppercase text-xs font-semibold tracking-wide text-center md:text-left mt-2">
            Serving El Paso & surrounding areas
          </p>
        </div>

        {/* Center callout (only on md+) */}
        <div className="hidden md:flex flex-col items-center justify-center text-center text-sm font-medium">
          <p className="uppercase">Submit a quote today</p>
          <p className="text-xs mt-1 opacity-80">
            Storage solutions built for your lifestyle.
          </p>
        </div>

        {/* Copyright */}
        <div className="flex flex-col items-center md:items-end">
          <p className="uppercase text-xs font-light tracking-wider">
            &copy; {new Date().getFullYear()} La Hacienda Del Norte
          </p>
          <p className="text-xs mt-1 font-light ">All rights reserved</p>
        </div>
      </div>

      {/* Optional decorative border */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-white to-transparent dark:via-flag-red my-1 opacity-50" />
    </footer>
  );
};

export default Footer;
