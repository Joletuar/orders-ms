// import { Module } from '@nestjs/common';
// import { ClientsModule, Transport } from '@nestjs/microservices';

// import { envs } from 'src/config/envs';
// import { NATS_SERVICE } from 'src/config/services';

// @Module({
//   imports: [
//     ClientsModule.register([
//       {
//         name: NATS_SERVICE,
//         transport: Transport.NATS,
//         options: {
//           servers: envs.NATS_SERVER,
//         },
//       },
//     ]),
//   ],
//   exports: [
//     ClientsModule.register([
//       {
//         name: NATS_SERVICE,
//         transport: Transport.NATS,
//         options: {
//           servers: envs.NATS_SERVER,
//         },
//       },
//     ]),
//   ],
// })
// export class NatsModule {}
