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

    // Multi-size price field
    defineField({
      name: 'sizes',
      title: 'Sizes & Prices',
      type: 'array',
      of: [
        defineField({
          type: 'object',
          name: 'sizeOption',
          fields: [
            {
              name: 'label',
              title: 'Size',
              type: 'string',
              options: {
                list: ['Small', 'Medium', 'Large', 'Extra Large'], // predefined size labels
                layout: 'dropdown', // render as dropdown
              },
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'price',
              title: 'Price',
              type: 'number',
              validation: (Rule) => Rule.required().min(0),
            },
          ],
        }),
      ],
      description: 'Select size and set price for each.',
    }),

    // Flavor picker
    defineField({
      name: 'flavors',
      title: 'Available Flavors',
      type: 'array',
      of: [
        {
          type: 'string',
          options: {
            list: [
              'hawaiian delight',
              'blue moon',
              'chocolate',
              'velvet rose',
              'yellow rode',
              'pink lady',
              'creamy banana',
              'tamarindo',
              'mango',
              'cantaloupe',
              'natural lime',
              'guava',
              'mazapan',
            ],
          },
        },
      ],
      description: 'Pick available flavors from the list.',
    }),

    // Single category reference (updated from array to single)
    defineField({
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: [{ type: 'category' }],
      description: 'Assign a product category (e.g., shaved ice, snacks).',
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
      categoryTitle: 'category.title',
    },
    prepare({ title, media, itemNumber, categoryTitle }) {
      return {
        title: `${title} (${itemNumber})`,
        subtitle: categoryTitle ? `Category: ${categoryTitle}` : undefined,
        media,
      };
    },
  },
});
