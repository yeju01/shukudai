import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/role/role.decorator';

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

  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  async getRewardRequest(@Request() req) {
    const userId = req.user.userId;
    return this.rewardClient.send('reward_request_findByUserId', userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Roles('OPERATOR', 'ADMIN', 'AUDITOR') // note: 순위를 부여해 이상이면 통과하는 것으로 변경
  @Get('all')
  async getAllRewardRequest() {
    return this.rewardClient.send('reward_request_findAll', {});
  }
}
