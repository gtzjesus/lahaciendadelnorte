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
    <footer className="flex flex-col pt-5 text-flag-blue overflow-hidden">
      <div>
        <p
          className="uppercase font-bold text-xs leading-tight text-center my-2 px-1 
          drop-shadow-[0_4px_6px_rgba(0,0,0,0.9)] "
        >
          Serving El Paso <br /> and surrounding areas
        </p>
        <div className="flex justify-center">
          <Image
            src="/icons/logo.webp"
            alt="lahacienda"
            width={25}
            height={25}
            priority
            className="my-3"
          />
        </div>
        <h1
          className="uppercase font-bold text-3xl  text-white leading-tight text-center mb-4 px-1 
          drop-shadow-[0_4px_6px_rgba(0,0,0,0.9)]"
        >
          Hacienda del norte
        </h1>
      </div>

      {/* Copyright */}
      <p className="uppercase text-center text-xs tracking-very-wide font-light mb-2 ">
        &copy; la hacienda del norte {new Date().getFullYear()}.
      </p>
    </footer>
  );
};

export default Footer;
