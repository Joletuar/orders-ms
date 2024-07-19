import { OrderStatus } from '@prisma/client';
import { IsEnum, IsUUID } from 'class-validator';

export class UpdateOrderStatusDto {
  @IsUUID('4')
  id: string;

  @IsEnum(OrderStatus)
  status: OrderStatus;
}
