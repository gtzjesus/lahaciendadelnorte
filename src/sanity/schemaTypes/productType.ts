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
    }),

    // Variants Array with size, flavor, price, and stock
    defineField({
      name: 'variants',
      title: 'Variants',
      type: 'array',
      of: [
        defineField({
          type: 'object',
          name: 'variant',
          title: 'Variant',
          fields: [
            {
              name: 'size',
              title: 'Size',
              type: 'string',
              options: {
                list: ['Small', 'Medium', 'Large', 'Extra Large'],
                layout: 'dropdown',
              },
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'flavor',
              title: 'Flavor',
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
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'price',
              title: 'Price',
              type: 'number',
              validation: (Rule) => Rule.required().min(0),
            },
            {
              name: 'stock',
              title: 'Stock',
              type: 'number',
              validation: (Rule) => Rule.required().min(0),
            },
          ],
        }),
      ],
      description:
        'Each variant corresponds to a unique combination of size and flavor, with its own price and stock.',
      validation: (Rule) =>
        Rule.min(1).error('You must add at least one variant'),
    }),

    defineField({
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: [{ type: 'category' }],
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
        subtitle: 'Product with Variants',
        media,
      };
    },
  },
});
