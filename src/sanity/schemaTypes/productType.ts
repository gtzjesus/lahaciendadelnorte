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
      description: 'Enter product name.',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Product Image',
      type: 'image',
      options: { hotspot: true },
      description: 'Upload image thumbnail.',
    }),
    defineField({
      name: 'extraImages',
      title: 'Additional Images',
      type: 'array',
      description: 'Upload images displayed in product page.',
      of: [{ type: 'image', options: { hotspot: true } }],
      validation: (Rule) =>
        Rule.min(1)
          .max(4)
          .error('You can upload between 1 and 4 extra images.'),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'string',
      description: 'Enter summary description for the product.',
    }),
    defineField({
      name: 'size',
      title: 'Size Information',
      type: 'string',
      description: 'Enter size information about the product.',
    }),
    defineField({
      name: 'care',
      title: 'Care Instructions',
      type: 'string',
      description: 'Enter care instructions for the product.',
    }),
    defineField({
      name: 'price',
      title: 'Price',
      type: 'number',
      description: 'Enter product price.',
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: 'categories',
      title: 'Categories',
      type: 'array',
      description: 'Choose category that belongs.',
      of: [{ type: 'reference', to: { type: 'category' } }],
    }),
    defineField({
      name: 'stock',
      title: 'Stock',
      type: 'number',
      description: 'Enter how many products in stock.',
      validation: (Rule) => Rule.min(0),
    }),

    // ✅ New Deal Field
    defineField({
      name: 'deal',
      title: 'Deal / BOGO Pricing',
      type: 'object',
      description:
        'Configure special pricing like Buy One Get One or 2 for $3 deals',
      fields: [
        defineField({
          name: 'type',
          title: 'Deal Type',
          type: 'string',
          options: {
            list: [
              { title: 'Buy One Get One Free', value: 'bogo' },
              { title: '2 for $X Price', value: 'twoForX' },
            ],
            layout: 'radio',
          },
        }),
        defineField({
          name: 'quantityRequired',
          title: 'Quantity Required for Deal',
          type: 'number',
          description: 'e.g. 2 if it’s 2 for $3',
          validation: (Rule) => Rule.min(1).max(10),
        }),
        defineField({
          name: 'dealPrice',
          title: 'Deal Price',
          type: 'number',
          description: 'e.g. $3 if the deal is 2 for $3',
          validation: (Rule) => Rule.min(0),
        }),
      ],
    }),
  ],

  preview: {
    select: {
      title: 'name',
      media: 'image',
      price: 'price',
      itemNumber: 'itemNumber',
    },
    prepare(select) {
      return {
        title: `${select.title} (${select.itemNumber})`,
        subtitle: `$${select.price}`,
        media: select.media,
      };
    },
  },
});
