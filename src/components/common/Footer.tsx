// components/Footer.tsx

import Image from 'next/image';

/**
 * Footer component displays the site’s branding and copyright info.
 *
 * @component
 * @example
 * <Footer />
 */
const Footer: React.FC = () => {
  return (
    <footer className="pt-10 bg-white ">
      <div className="max-w-7xl mx-auto text-center py-4 px-4">
        {/* Logo */}
        <div className="flex justify-center mb-16 lg:mb-24">
          <Image
            src="/icons/logo-black.webp"
            alt="laduena"
            width={50}
            height={50}
            priority
          />
        </div>

        {/* Copyright */}
        <p className="uppercase barlow-condensed-regular text-xs tracking-very-wide font-light text-flag-blue">
          &copy; laduena {new Date().getFullYear()}.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
