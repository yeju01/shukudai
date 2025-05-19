import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Event, EventSchema } from 'src/schema/event.schema';
import {
  RewardRequest,
  RewardRequestSchema,
} from 'src/schema/rewardRequest.schema';
import { UserAction, UserActionSchema } from 'src/schema/userAction.schema';
import { RewardRequestController } from './rewardRequest.controller';
import { RewardRequestService } from './rewardRequest.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: RewardRequest.name, schema: RewardRequestSchema },
      { name: Event.name, schema: EventSchema },
      { name: UserAction.name, schema: UserActionSchema },
    ]),
  ],
  controllers: [RewardRequestController],
  providers: [RewardRequestService],
  exports: [],
})
export class RewardRequestModule {}
