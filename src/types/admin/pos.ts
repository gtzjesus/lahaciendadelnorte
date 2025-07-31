// types/admin/pos.ts

import type { SanitySlug } from '../index';

export interface POSProduct {
  _id: string;
  baseName: string;
  name: string;
  slug: SanitySlug;
  price: number;
  stock: number;
  itemNumber?: string;
  imageUrl?: string;
  size: string;
  category?: string;
}

export interface CartItem extends POSProduct {
  cartQty: number;
}

export interface CartListProps {
  cart: CartItem[];
  updateQuantityAction: (index: number, qty: number) => void;
  removeItemAction: (index: number) => void;
}

export type PaymentMethod = 'cash' | 'card' | 'split';

export interface SaleSummaryProps {
  totalItems: number;
  subtotal: number;
  tax: number;
  total: number;
  paymentMethod: PaymentMethod;
  setPaymentMethodAction: (method: PaymentMethod) => void;
  cashReceived: number;
  setCashReceivedAction: (amount: number) => void;
  cardAmount: number;
  setCardAmountAction: (amount: number) => void;
  round2Action: (n: number) => number;
  changeGiven: number;
  showConfirmModal: boolean;
  setShowConfirmModalAction: (v: boolean) => void;
  customerName: string;
  setCustomerNameAction: (name: string) => void;
  loading: boolean;
  handleSaleAction: () => Promise<void>;
  clearCartAction: () => void;
  cartEmpty: boolean;
}
