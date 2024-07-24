import { OrderStatus } from '@prisma/client';

export interface OrderWithProducts {
  OrderItem: Array<OrderItem>;
  id: string;
  totalAmount: number;
  totalItems: number;
  status: OrderStatus;
  paid: boolean;
  paidAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

type OrderItem = {
  productName: string;
  productId: number;
  quantity: number;
  price: number;
};
