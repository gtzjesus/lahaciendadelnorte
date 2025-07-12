// components/Footer.tsx

import Image from 'next/image';
import Link from 'next/link';

/**
 * Footer component displays the site’s branding and copyright info.
 *
 * @component
 * @example
 * <Footer />
 */
const Footer: React.FC = () => {
  return (
    <footer className="pt-10 bg-flag-red ">
      <div className="max-w-7xl mx-auto text-center py-4 px-4">
        {/* Logo */}
        <div className="flex flex-col items-center justify-center mb-16 lg:mb-24">
          <Image
            src="/icons/logo-black.webp"
            alt="elpasokaboom"
            width={50}
            height={50}
            priority
          />
          <Link
            href="/"
            className={`uppercase barlow-condensed-regular text-sm`}
          >
            la hacienda del norte
          </Link>
        </div>

        {/* Copyright */}
        <p className="uppercase barlow-condensed-regular text-xs tracking-very-wide font-light text-black">
          &copy; la hacienda del norte {new Date().getFullYear()}.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
