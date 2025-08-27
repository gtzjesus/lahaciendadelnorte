import Image from 'next/image';
import Link from 'next/link';
import imageUrlBuilder from '@sanity/image-url';
import { client } from '@/sanity/lib/client';
import { SanityImage, Category } from '@/types';

/**
 * Initialize Sanity image URL builder.
 */
const builder = imageUrlBuilder(client);

/**
 * Generate image URL from Sanity image source.
 * @param source - SanityImage object
 */
function urlFor(source: SanityImage) {
  return builder.image(source);
}

/**
 * Capitalizes the first word of a string.
 * @param text - The string to capitalize
 * @returns The string with the first word capitalized
 */
function capitalizeFirstWord(text: string): string {
  const words = text.trim().split(' ');
  if (words.length > 0) {
    words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
  }
  return words.join(' ');
}

interface CategoriesProps {
  /**
   * List of category objects to display.
   */
  categories: Category[];
}

/**
 * Categories grid displaying a list of 3D inventory categories.
 * Each category links to its respective product listing.
 *
 * @component
 * @example
 * <Categories categories={categoryList} />
 */
const Categories: React.FC<CategoriesProps> = ({ categories }) => {
  return (
    <div className="w-full mx-auto bg-gradient-to-br from-flag-red to-[#f9fafb] pb-10 ">
      <h2 className="uppercase barlow-condensed-regular text-2xl tracking-very-wide lg:text-3xl font-semibold text-center text-white py-6">
        Explore sizes
      </h2>

      <div className="px-4 lg:px-0 lg:max-w-7xl mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map((category) => (
            <Link
              key={category._id}
              href={`/categories/${category.slug.current}`}
            >
              <div className="flex flex-col items-center shadow-xl transition overflow-hidden">
                <div className="relative w-full h-full pb-[100%]">
                  <Image
                    src={
                      category.image
                        ? urlFor(category.image).url()
                        : '/default-image.jpg'
                    }
                    alt={category.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 25vw"
                    priority
                  />
                </div>
                <h3 className="barlow-condensed-regular text-sm tracking-very-wide font-light text-center text-black py-2">
                  {capitalizeFirstWord(category.title)}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Categories;
