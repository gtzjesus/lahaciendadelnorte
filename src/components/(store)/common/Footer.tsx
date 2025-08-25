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
    <footer className="pt-5 text-flag-blue">
      <div>
        <p className="uppercase text-center text-md tracking-very-wide font-light ">
          Serving El Paso and surrounding areas
        </p>
        <h1
          className="uppercase font-bold text-8xl  text-white leading-tight text-center px-1 
          drop-shadow-[0_4px_6px_rgba(0,0,0,0.9)]"
        >
          Hacienda
        </h1>
      </div>

      {/* Copyright */}
      <p className="uppercase text-center text-xs tracking-very-wide font-light mb-5 ">
        &copy; la hacienda del norte {new Date().getFullYear()}.
      </p>
    </footer>
  );
};

export default Footer;
