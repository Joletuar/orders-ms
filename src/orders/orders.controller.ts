import { Controller, ParseUUIDPipe } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';

import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { PaginationDto } from './dto/pagination.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { PaymentSuccededDto } from './dto/payment-succeded.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @MessagePattern('createOrder')
  async create(@Payload() createOrderDto: CreateOrderDto) {
    const order = await this.ordersService.create(createOrderDto);
    const paymentSession = await this.ordersService.createPaymentSession(order);

    return { order, paymentSession };
  }

  @MessagePattern('findAllOrders')
  async findAll(@Payload() paginationDto: PaginationDto) {
    return this.ordersService.findAll(paginationDto);
  }

  @MessagePattern('findOneOrder')
  findOne(
    @Payload('id', ParseUUIDPipe)
    id: string,
  ) {
    return this.ordersService.findOne(id);
  }

  @MessagePattern('changeOrderStatus')
  changeOrderStatus(@Payload() updateOrderStatusDto: UpdateOrderStatusDto) {
    return this.ordersService.changeOrderStatus(updateOrderStatusDto);
  }

  @EventPattern('payment.succeded') // Event pattern para estar pendiente de eventos
  paidOder(@Payload() paymentSuccededDto: PaymentSuccededDto) {
    this.ordersService.paidOder(paymentSuccededDto);
  }
}
