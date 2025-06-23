// store/store.ts

import { Product, BasketItem } from '@/types';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface BasketState {
  items: BasketItem[];

  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  removeAllOfItem: (productId: string) => void;
  updateItemQuantity: (productId: string, quantity: number) => void;
  clearBasket: () => void;
  getTotalPrice: () => number;
  getItemCount: (productId: string) => number;
  getGroupedItems: () => BasketItem[];
  updateStockLevels: (latestStocks: { _id: string; stock: number }[]) => void;
}

const useBasketStore = create<BasketState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product) =>
        set((state) => {
          const existingItem = state.items.find(
            (item) => item.product._id === product._id
          );

          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.product._id === product._id
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              ),
            };
          }

          return {
            items: [...state.items, { product, quantity: 1 }],
          };
        }),

      removeItem: (productId) =>
        set((state) => ({
          items: state.items.reduce((acc, item) => {
            if (item.product._id === productId) {
              if (item.quantity > 1) {
                acc.push({ ...item, quantity: item.quantity - 1 });
              }
              // skip if quantity is 1
            } else {
              acc.push(item);
            }
            return acc;
          }, [] as BasketItem[]),
        })),

      removeAllOfItem: (productId) =>
        set((state) => ({
          items: state.items.filter((item) => item.product._id !== productId),
        })),

      updateItemQuantity: (productId, quantity) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.product._id === productId
              ? { ...item, quantity: Math.max(1, quantity) }
              : item
          ),
        })),

      clearBasket: () => {
        set({ items: [] });
        localStorage.removeItem('basket-store');
      },

      getTotalPrice: () =>
        get().items.reduce(
          (total, item) => total + (item.product.price ?? 0) * item.quantity,
          0
        ),

      getItemCount: (productId) => {
        const item = get().items.find((item) => item.product._id === productId);
        return item ? item.quantity : 0;
      },

      getGroupedItems: () => get().items,

      updateStockLevels: (latestStocks) =>
        set((state) => ({
          items: state.items.map((item) => {
            const updatedStock = latestStocks.find(
              (prod) => prod._id === item.product._id
            )?.stock;

            if (updatedStock !== undefined) {
              return {
                ...item,
                product: {
                  ...item.product,
                  stock: updatedStock,
                },
                quantity: Math.min(item.quantity, updatedStock),
              };
            }

            return item;
          }),
        })),
    }),
    {
      name: 'basket-store',
    }
  )
);

export default useBasketStore;
