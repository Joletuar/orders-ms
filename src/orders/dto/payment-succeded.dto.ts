import { IsString, IsUrl, IsUUID } from 'class-validator';

export class PaymentSuccededDto {
  @IsString()
  stripePaymentId: string;

  @IsUUID('4')
  orderId: string;

  @IsUrl()
  receiptUrl: string;
}
