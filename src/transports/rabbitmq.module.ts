import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { envs, PAYMENTS_SERVICE, PRODUCTS_SERVICE } from 'src/config';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: PAYMENTS_SERVICE,
        transport: Transport.RMQ,
        options: {
          queue: 'payments',
          urls: [envs.RABBITMQ_SERVER],
          noAck: true,
          queueOptions: {
            durable: true,
            autoDelete: false,
          },
        },
      },
      {
        name: PRODUCTS_SERVICE,
        transport: Transport.RMQ,
        options: {
          queue: 'products',
          urls: [envs.RABBITMQ_SERVER],
          noAck: true,
          queueOptions: {
            durable: true,
            autoDelete: false,
          },
        },
      },
    ]),
  ],
  exports: [
    ClientsModule.register([
      {
        name: PAYMENTS_SERVICE,
        transport: Transport.RMQ,
        options: {
          queue: 'payments',
          urls: [envs.RABBITMQ_SERVER],
          noAck: true,
          queueOptions: {
            durable: true,
            autoDelete: false,
          },
        },
      },
      {
        name: PRODUCTS_SERVICE,
        transport: Transport.RMQ,
        options: {
          queue: 'products',
          urls: [envs.RABBITMQ_SERVER],
          noAck: true,
          queueOptions: {
            durable: true,
            autoDelete: false,
          },
        },
      },
    ]),
  ],
})
export class RabbitMqModule {}
