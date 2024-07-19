import { OrderStatus } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, Min } from 'class-validator';

export class PaginationDto {
  @IsOptional()
  @IsNumber({
    maxDecimalPlaces: 0,
  })
  @Min(1)
  @Type(() => Number)
  public page?: number;

  @IsOptional()
  @IsNumber({
    maxDecimalPlaces: 0,
  })
  @Min(1)
  @Type(() => Number)
  public limit?: number;

  @IsOptional()
  @IsEnum(OrderStatus)
  status: OrderStatus;
}
