import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AuthGuard } from '@nestjs/passport';
import { RewardRequestQueryDto } from 'src/dto/rewardRequest.query.dto';
import { Roles } from 'src/role/role.decorator';
import { RolesGuard } from 'src/role/role.guard';
import { User } from 'src/user/user.decorator';
import { UserPayload } from 'src/user/userPayload.interface';

@Controller('reward/request')
export class RewardRequestController {
  constructor(
    @Inject('REWARD_REQUEST_SERVICE')
    private readonly rewardClient: ClientProxy,
  ) {}

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('USER')
  async createRewardRequest(
    @Body('eventId') eventId: string,
    @User() user: UserPayload,
  ) {
    const userId = user.userId;
    return this.rewardClient.send('reward_request_create', {
      userId,
      eventId,
    });
  }

  @Get('me')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('USER')
  async getRewardRequest(@User() user: UserPayload) {
    const userId = user.userId;
    return this.rewardClient.send('reward_request_findByUserId', userId);
  }

  @Get('all')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('OPERATOR', 'ADMIN', 'AUDITOR')
  async getAllRewardRequest(@Query() filter?: RewardRequestQueryDto) {
    return this.rewardClient.send('reward_request_findAll', filter); //note: 연결되는 곳 확인
  }
}
