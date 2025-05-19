import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { EventClientService } from './event.client';
import { EventProxyController } from './event.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'EVENT_SERVICE',
        transport: Transport.TCP,
        options: {
          host: 'event', // note: docker-compose에서 정의한 서비스명
          port: 3002,
        },
      },
    ]),
  ],
  controllers: [EventProxyController],
  providers: [EventClientService],
})
export class EventModule {}
