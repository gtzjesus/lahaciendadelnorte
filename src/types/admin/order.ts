/* eslint-disable  @typescript-eslint/no-explicit-any */

export interface OrderProduct {
  _key?: string;
  quantity: number;
  price: number;
  product: {
    name: string;
    slug?: { current: string };
    image?: any;
    category?: { title: string };
  };
  variant?: {
    size?: string;
  };
}

export interface Order {
  _id: string;
  orderNumber: string;
  customerName: string;
  pickupStatus: 'pending' | 'completed' | string;
  products: OrderProduct[];
  createdAt?: string; // optional timestamp string
  totalPrice?: number;
  tax?: number;
  currency?: string;
  paymentMethod?: string;
  cashReceived?: number;
  changeGiven?: number;
  cardAmount?: number;
  paymentStatus?: string;
  orderDate?: string;
}

export interface OrderListProps {
  orders: Order[];
}

export interface OrderCardProps {
  order: Order;
}

export type OrderFilter = 'all' | 'pending' | 'completed';
