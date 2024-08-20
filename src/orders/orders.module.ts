import { Module } from '@nestjs/common';

import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { RabbitMqModule } from 'src/transports/rabbitmq.module';

@Module({
  controllers: [OrdersController],
  providers: [OrdersService],
  imports: [RabbitMqModule],
})
export class OrdersModule {}
