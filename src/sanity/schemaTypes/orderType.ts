import { BasketIcon } from '@sanity/icons';
import { defineArrayMember, defineField, defineType } from 'sanity';

export const orderType = defineType({
  name: 'order',
  title: 'Order',
  type: 'document',
  icon: BasketIcon,
  fields: [
    defineField({
      name: 'orderNumber',
      title: 'Order Number',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'clerkUserId',
      title: 'Store User ID',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'customerName',
      title: 'Customer Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'email',
      title: 'Customer Email',
      type: 'string',
      validation: (Rule) => Rule.required().email(),
    }),
    defineField({
      name: 'products',
      title: 'Reserved Products',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'product',
              title: 'Product',
              type: 'reference',
              to: [{ type: 'product' }],
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'quantity',
              title: 'Quantity',
              type: 'number',
              validation: (Rule) => Rule.required().min(1),
            }),
          ],
          preview: {
            select: {
              product: 'product.name',
              quantity: 'quantity',
              image: 'product.image',
              price: 'product.price',
            },
            prepare({ product, quantity, image, price }) {
              return {
                title: `${product} x ${quantity}`,
                subtitle: `$${(price || 0) * quantity}`,
                media: image,
              };
            },
          },
        }),
      ],
    }),
    defineField({
      name: 'totalPrice',
      title: 'Total Price',
      type: 'number',
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: 'tax',
      title: 'Tax',
      type: 'number',
      description: 'Tax amount applied to the order.',
      validation: (Rule) => Rule.min(0),
    }),

    defineField({
      name: 'currency',
      title: 'Currency',
      type: 'string',
      initialValue: 'usd',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'amountDiscount',
      title: 'Amount Discount',
      type: 'number',
      validation: (Rule) => Rule.min(0),
    }),
    defineField({
      name: 'orderType',
      title: 'Order Type',
      type: 'string',
      options: {
        list: [{ title: 'Reservation (Pay at Store)', value: 'reservation' }],
      },
      initialValue: 'reservation',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'paymentStatus',
      title: 'Payment Status',
      type: 'string',
      options: {
        list: [
          { title: 'Unpaid', value: 'unpaid' },
          { title: 'Paid In Store', value: 'paid_in_store' },
          { title: 'Paid Online', value: 'paid_online' },
        ],
      },
      initialValue: 'unpaid',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'pickupStatus',
      title: 'Pickup Status',
      type: 'string',
      options: {
        list: [
          { title: 'Not Picked Up', value: 'not_picked_up' },
          { title: 'Ready for Pickup', value: 'ready_for_pickup' },
          { title: 'Picked Up', value: 'picked_up' },
          { title: 'Cancelled', value: 'cancelled' },
        ],
      },
      initialValue: 'not_picked_up',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'orderDate',
      title: 'Order Date',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
    }),

    // ✅ NEW FIELDS BELOW

    defineField({
      name: 'paymentMethod',
      title: 'Payment Method',
      type: 'string',
      options: {
        list: [
          { title: 'Unpaid (Online Reservation)', value: 'unpaid' },
          { title: 'Cash', value: 'cash' },
          { title: 'Card', value: 'card' },
          { title: 'Split (Cash + Card)', value: 'split' },
        ],
      },
    }),
    defineField({
      name: 'cashReceived',
      title: 'Cash Received',
      type: 'number',
      description: 'Amount of cash received from the customer.',
    }),
    defineField({
      name: 'cardAmount',
      title: 'Card Amount',
      type: 'number',
      description: 'Amount paid by card, if split payment.',
    }),
    defineField({
      name: 'changeGiven',
      title: 'Change Given',
      type: 'number',
      description: 'Change returned to the customer (for cash payments).',
    }),
  ],
  preview: {
    select: {
      name: 'customerName',
      amount: 'totalPrice',
      currency: 'currency',
      orderId: 'orderNumber',
      email: 'email',
      pickupStatus: 'pickupStatus',
      paymentStatus: 'paymentStatus',
    },
    prepare(selection) {
      const {
        name,
        amount,
        currency,
        orderId,
        email,
        pickupStatus,
        paymentStatus,
      } = selection;
      const orderIdSnippet = orderId
        ? orderId.toUpperCase().slice(0, 6)
        : 'Unknown';
      return {
        title: `${name} (${orderIdSnippet})`,
        subtitle: `${amount} ${currency} | ${email} | ${paymentStatus} | ${pickupStatus}`,
        media: BasketIcon,
      };
    },
  },
});
