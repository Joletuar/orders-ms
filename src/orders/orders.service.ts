import {
  HttpStatus,
  Inject,
  Injectable,
  Logger,
  OnModuleInit,
} from '@nestjs/common';

import { PrismaClient } from '@prisma/client';
import { firstValueFrom } from 'rxjs';

import { CreateOrderDto } from './dto/create-order.dto';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { PaginationDto } from './dto/pagination.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { NATS_SERVICE } from 'src/config/services';

@Injectable()
export class OrdersService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger('OrdersService');

  constructor(
    @Inject(NATS_SERVICE)
    private readonly client: ClientProxy,
  ) {
    super();
  }

  async onModuleInit() {
    await this.$connect();

    this.logger.log('Database connected OK');
  }

  async create(createOrderDto: CreateOrderDto) {
    const products: Array<any> = await this.ensureAreValidProducts(
      createOrderDto.items.map(({ productId }) => productId),
    );

    try {
      const order = await this.order.create({
        data: {
          totalItems: createOrderDto.items.reduce(
            (acc: number, orderItem) => acc + orderItem.quantity,
            0,
          ),
          totalAmount: createOrderDto.items.reduce(
            (prev: number, orderItem) => {
              const currentProduct = products.find(
                ({ id }) => id === orderItem.productId,
              );

              return prev + currentProduct.price * orderItem.quantity;
            },
            0,
          ),
          OrderItem: {
            createMany: {
              data: createOrderDto.items.map(({ productId, quantity }) => ({
                productId,
                quantity,
                price: products.find(({ id }) => id === productId).price,
              })),
            },
          },
        },

        // Hacemos que nos retorne las relaciones
        include: {
          // Traer unas columnas especificas del model
          OrderItem: {
            select: {
              price: true,
              quantity: true,
              productId: true,
            },
          },
          // Traer todo el modelo completo
          // OrderItem: true
        },
      });

      return {
        ...order,
        OrderItem: order.OrderItem.map((orderItem) => ({
          ...orderItem,
          productName: products.find(({ id }) => id === orderItem.productId)
            .name,
        })),
      };
    } catch (error) {
      this.logger.error(error);

      throw error;
    }
  }

  private async ensureAreValidProducts(ids: Array<number>) {
    return await firstValueFrom(
      this.client.send({ cmd: 'validateProduct' }, ids),
    );
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, page = 1, status } = paginationDto;

    const skip = (page - 1) * limit;

    try {
      const totalOrders = await this.order.count({
        where: {
          status,
        },
      });

      if (status) {
        const orders = await this.order.findMany({
          skip,
          take: limit,
          where: {
            status,
          },
        });

        return {
          data: orders,
          meta: {
            perPage: limit,
            currentPage: page,
            totalPages: Math.ceil(totalOrders / limit),
            total: orders.length,
          },
        };
      }

      const orders = await this.order.findMany({
        skip,
        take: limit,
      });

      return {
        data: orders,
        meta: {
          perPage: limit,
          currentPage: page,
          totalPages: Math.ceil(totalOrders / limit),
          total: orders.length,
        },
      };
    } catch (error) {
      this.logger.error(error);

      throw error;
    }
  }

  async findOne(id: string) {
    try {
      const { OrderItem, ...order } = await this.order.findFirst({
        where: { id },
        include: {
          OrderItem: {
            select: {
              price: true,
              quantity: true,
              productId: true,
            },
          },
        },
      });

      if (!order)
        throw new RpcException({
          status: HttpStatus.NOT_FOUND,
          message: `Order with id ${id} not found`,
        });

      const productsIds = OrderItem.map(({ productId }) => productId);

      const products: Array<any> =
        await this.ensureAreValidProducts(productsIds);

      return {
        ...order,
        orderItems: OrderItem.map(({ price, productId, quantity }) => ({
          price,
          productId,
          quantity,
          productName: products.find((product) => product.id === productId)
            .name,
        })),
      };
    } catch (error) {
      this.logger.error(error);

      throw error;
    }
  }

  async changeOrderStatus(updateOrderStatusDto: UpdateOrderStatusDto) {
    try {
      const oldOrder = await this.findOne(updateOrderStatusDto.id);

      if (oldOrder.status === updateOrderStatusDto.status) return oldOrder;

      const order = await this.order.update({
        where: {
          id: updateOrderStatusDto.id,
        },
        data: {
          status: updateOrderStatusDto.status,
        },
      });

      return order;
    } catch (error) {
      this.logger.log(error);

      throw error;
    }
  }
}
