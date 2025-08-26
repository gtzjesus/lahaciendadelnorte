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
        <div className="flex justify-center">
          <Image
            src="/icons/logo-blacked.webp"
            alt="lahacienda"
            width={30}
            height={30}
            priority
            className="my-3"
          />
        </div>
        <h1
          className="uppercase font-bold text-2xl  text-flag-blue leading-tight text-center my-4 px-1 
          drop-shadow-[0_4px_6px_rgba(0,0,0,0.5)]"
        >
          La Hacienda del norte
        </h1>
        <p
          className="uppercase font-bold text-xs leading-tight text-center my-4 px-1 
          drop-shadow-[0_4px_6px_rgba(0,0,0,0.5)] "
        >
          Serving El Paso <br /> and surrounding areas
        </p>
      </div>

      {/* Copyright */}
      <p className="uppercase text-center text-xs tracking-very-wide font-light mb-4 ">
        &copy; la hacienda del norte {new Date().getFullYear()}.
      </p>
    </footer>
  );
};

export default Footer;
