import {
  Body,
  Controller,
  Inject,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AuthGuard } from '@nestjs/passport';

@Controller('reward/request')
export class RewardRequestController {
  constructor(
    @Inject('REWARD_REQUEST_SERVICE')
    private readonly rewardClient: ClientProxy,
  ) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async createRewardRequest(@Body('eventId') eventId: string, @Request() req) {
    const userId = req.user.userId;
    return this.rewardClient.send('reward_request_create', {
      userId,
      eventId,
    });
  }
}
