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
    <footer className="pt-10 text-flag-blue">
      <div className="max-w-7xl mx-auto text-center py-1 px-4">
        {/* Logo */}
        <div className="flex justify-center mb-10 lg:mb-24">
          <Image
            src="/icons/logo.webp"
            alt="laduena"
            width={50}
            height={50}
            priority
          />
        </div>
        <p className=" barlow-condensed-regular text-sm tracking-very-wide font-light mb-4 ">
          Serving El Paso with custom storage options
        </p>

        {/* Copyright */}
        <p className="uppercase barlow-condensed-regular text-xs tracking-very-wide font-light ">
          &copy; la hacienda del norte {new Date().getFullYear()}.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
