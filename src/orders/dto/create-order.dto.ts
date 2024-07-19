import { Type } from 'class-transformer';

import { ArrayMinSize, IsArray, ValidateNested } from 'class-validator';
import { OrdenItemDto } from './order-item.dto';

// export class CreateOrderDto {
//   @IsNumber()
//   @IsPositive()
//   totalAmount: number;

//   @IsNumber()
//   @IsPositive()
//   totalItems: number;

//   @IsEnum(OrderStatus, {
//     message: `Possible status values are ${Object.values(OrderStatus)}`,
//   })
//   @IsOptional()
//   status: OrderStatus = OrderStatus.PENDING;

//   @IsBoolean()
//   @IsOptional()
//   paid: boolean = false;
// }

export class CreateOrderDto {
  @IsArray() // Validar que sea un array
  @ArrayMinSize(1) // Validar que tenga mínimo un elemento
  @ValidateNested({ each: true }) // Validamos cada elemento
  @Type(() => OrdenItemDto)
  items: Array<OrdenItemDto>;
}
