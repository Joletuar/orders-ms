import { Module } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';

import { OrdersModule } from './orders/orders.module';

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: {
        level: process.env.NODE_ENV !== 'production' ? 'debug' : 'info',
        transport:
          process.env.NODE_ENV !== 'production'
            ? {
                target: 'pino-pretty',
                options: {
                  messageKey: 'message',
                  colorize: true,
                },
              }
            : undefined,
        messageKey: 'message',
      },
    }),
    OrdersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
