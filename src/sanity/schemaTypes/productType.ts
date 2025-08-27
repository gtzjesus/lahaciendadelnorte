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

    // Define shed variants
    defineField({
      name: 'variants',
      title: 'Shed Variants',
      type: 'array',
      of: [
        defineField({
          type: 'object',
          name: 'shedVariant',
          title: 'Shed Variant',
          fields: [
            defineField({
              name: 'dimensions',
              title: 'Dimensions',
              type: 'string',
              options: {
                list: [
                  { title: '8x6x6', value: '8x6x6' },
                  { title: '10x8x8', value: '10x8x8' },
                  { title: '12x10x10', value: '12x10x10' },
                  { title: '16x12x12', value: '16x12x12' },
                ],
              },
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'material',
              title: 'Material',
              type: 'string',
              options: {
                list: [
                  { title: 'Wood', value: 'wood' },
                  { title: 'Sheet metal', value: 'sheet' },
                ],
              },
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'windows',
              title: 'Windows',
              type: 'number',
              initialValue: 0,
            }),
            defineField({
              name: 'doors',
              title: 'Doors',
              type: 'number',
              initialValue: 1,
            }),
            defineField({
              name: 'roof',
              title: 'Roof Type',
              type: 'string',
              options: {
                list: [
                  { title: 'Gable', value: 'gable' },
                  { title: 'Gambrel', value: 'gambrel' },
                  { title: 'Flat', value: 'flat' },
                  { title: 'Skillion', value: 'skillion' },
                ],
              },
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'garage',
              title: 'Garage Included',
              type: 'boolean',
              initialValue: false,
            }),
            defineField({
              name: 'addons',
              title: 'Add-ons',
              type: 'array',
              of: [
                {
                  type: 'string',
                  options: {
                    list: [
                      { title: 'Workbench', value: 'workbench' },
                      { title: 'Loft', value: 'loft' },
                      { title: 'Shelving', value: 'shelving' },
                    ],
                  },
                },
              ],
            }),
            defineField({
              name: 'price',
              title: 'Price',
              type: 'number',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'stock',
              title: 'Stock',
              type: 'number',
              initialValue: 0,
              validation: (Rule) => Rule.min(0),
            }),
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
        subtitle: 'Product with predefined variants',
        media,
      };
    },
  },
});
