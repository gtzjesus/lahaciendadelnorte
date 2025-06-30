import { TrolleyIcon } from '@sanity/icons';
import { defineField, defineType } from 'sanity';

export const productType = defineType({
  name: 'product',
  title: 'Products',
  type: 'document',
  icon: TrolleyIcon,

  fields: [
    defineField({
      name: 'itemNumber',
      title: 'Item Number',
      type: 'string',
      description: 'Unique inventory ID, e.g., 1',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      description: 'Auto-generated from name',
      options: { source: 'name', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Main Image',
      type: 'image',
      options: { hotspot: true },
      description: 'Thumbnail or main display image.',
    }),
    defineField({
      name: 'extraImages',
      title: 'Additional Images',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
      validation: (Rule) =>
        Rule.max(4).error('You can upload up to 4 additional images.'),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      description: 'Short description of the product.',
    }),

    // ⬇️ Multi-size price field
    defineField({
      name: 'sizes',
      title: 'Sizes & Prices',
      type: 'array',
      of: [
        defineField({
          type: 'object',
          name: 'sizeOption',
          fields: [
            { name: 'label', title: 'Size', type: 'string' }, // e.g., "Small"
            {
              name: 'price',
              title: 'Price',
              type: 'number',
              validation: (Rule) => Rule.required().min(0),
            },
          ],
        }),
      ],
      description: 'List sizes with corresponding prices (for shaved ice).',
    }),

    // ⬇️ Flavor picker
    defineField({
      name: 'flavors',
      title: 'Available Flavors',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'List of available flavors.',
    }),

    defineField({
      name: 'categories',
      title: 'Categories',
      type: 'array',
      of: [{ type: 'reference', to: { type: 'category' } }],
      description: 'Assign product categories (e.g., shaved ice, snacks).',
    }),

    defineField({
      name: 'stock',
      title: 'Stock',
      type: 'number',
      description: 'Inventory count (if applicable).',
    }),
  ],

  preview: {
    select: {
      title: 'name',
      media: 'image',
      itemNumber: 'itemNumber',
    },
    prepare({ title, media, itemNumber }) {
      return {
        title: `${title} (${itemNumber})`,
        subtitle: 'Shaved Ice or Snack Item',
        media,
      };
    },
  },
});
