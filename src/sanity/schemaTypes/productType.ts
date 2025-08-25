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

    // Variants Array without flavor
    defineField({
      name: 'variants',
      title: 'Shed Configuration',
      type: 'array',
      of: [
        defineField({
          type: 'object',
          name: 'shedVariant',
          title: 'Custom Shed',
          fields: [
            { name: 'dimensions', title: 'Dimensions', type: 'string' },
            { name: 'material', title: 'Material', type: 'string' },
            { name: 'windows', title: 'Windows', type: 'number' },
            { name: 'doors', title: 'Doors', type: 'number' },
            { name: 'roof', title: 'Roof Type', type: 'string' },
            { name: 'garage', title: 'Garage Included', type: 'boolean' },
            {
              name: 'addons',
              title: 'Add-ons',
              type: 'array',
              of: [{ type: 'string' }],
            },
            { name: 'price', title: 'Price', type: 'number' },
            { name: 'stock', title: 'Stock', type: 'number' },
          ],
        }),
      ],
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
