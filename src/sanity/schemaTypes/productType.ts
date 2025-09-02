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

    // Base Dimensions / Sizes
    defineField({
      name: 'baseVariants',
      title: 'Base Dimensions',
      type: 'array',
      of: [
        defineField({
          type: 'object',
          name: 'baseVariant',
          fields: [
            defineField({
              name: 'dimensions',
              title: 'Dimensions',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'basePrice',
              title: 'Base Price',
              type: 'number',
              validation: (Rule) => Rule.required(),
            }),
          ],
        }),
      ],
    }),

    // Material options
    defineField({
      name: 'materials',
      title: 'Material Options',
      type: 'array',
      of: [
        defineField({
          type: 'object',
          name: 'materialOption',
          fields: [
            defineField({ name: 'name', title: 'Material', type: 'string' }),
            defineField({
              name: 'price',
              title: 'Additional Price',
              type: 'number',
            }),
          ],
        }),
      ],
    }),

    // Roof options
    defineField({
      name: 'roofTypes',
      title: 'Roof Options',
      type: 'array',
      of: [
        defineField({
          type: 'object',
          name: 'roofOption',
          fields: [
            defineField({ name: 'name', title: 'Roof Type', type: 'string' }),
            defineField({
              name: 'price',
              title: 'Additional Price',
              type: 'number',
            }),
          ],
        }),
      ],
    }),

    // Add-ons
    defineField({
      name: 'addons',
      title: 'Add-ons',
      type: 'array',
      of: [
        defineField({
          type: 'object',
          name: 'addonOption',
          fields: [
            defineField({ name: 'name', title: 'Add-on', type: 'string' }),
            defineField({
              name: 'price',
              title: 'Additional Price',
              type: 'number',
            }),
          ],
        }),
      ],
    }),

    // Garage option
    defineField({
      name: 'garagePrice',
      title: 'Garage Add-on Price',
      type: 'number',
      initialValue: 0,
    }),

    // Per-door and per-window pricing
    defineField({
      name: 'doorPrice',
      title: 'Price per Door',
      type: 'number',
      initialValue: 0,
    }),
    defineField({
      name: 'windowPrice',
      title: 'Price per Window',
      type: 'number',
      initialValue: 0,
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
        subtitle: 'Customizable Shed Product',
        media,
      };
    },
  },
});
