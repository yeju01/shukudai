import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { RewardClientService } from './reward.client';
import { RewardProxyController } from './reward.controller';
import { RewardRequestController } from './rewardRequest.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'REWARD_SERVICE',
        transport: Transport.TCP,
        options: {
          host: 'event',
          port: 3002,
        },
      },
    ]),
  ],
  controllers: [RewardProxyController, RewardRequestController],
  providers: [
    RewardClientService,
    {
      provide: 'REWARD_REQUEST_SERVICE',
      useExisting: 'REWARD_SERVICE',
    },
  ],
  exports: [],
})
export class RewardModule {}
