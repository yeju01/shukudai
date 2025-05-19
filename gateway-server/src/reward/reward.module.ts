import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { RewardClientService } from './reward.client';
import { RewardProxyController } from './reward.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'REWARD_SERVICE',
        transport: Transport.TCP,
        options: {
          host: 'event', // note: docker-compose에서 정의한 서비스명
          port: 3002,
        },
      },
    ]),
  ],
  controllers: [RewardProxyController],
  providers: [RewardClientService],
  exports: [],
})
export class RewardModule {}
