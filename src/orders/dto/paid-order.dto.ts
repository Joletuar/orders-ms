import { IsString, IsUrl, IsUUID } from 'class-validator';

export class PaidOrderDto {
  @IsString()
  stripePaymentId: string;

  @IsUUID('4')
  @IsString()
  orderId: string;

  @IsUrl()
  @IsString()
  receiptUrl: string;
}
