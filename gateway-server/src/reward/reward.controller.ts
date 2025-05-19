import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/role/role.decorator';
import { RolesGuard } from 'src/role/role.guard';
import { RewardClientService } from './reward.client';

@Controller('reward')
export class RewardProxyController {
  constructor(private readonly rewardClient: RewardClientService) {}

  @Post('create')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('OPERATOR')
  async createReward(@Body() body: any) {
    console.log('[Gateway] sending reward_create...', body);
    const res = await this.rewardClient.createReward(body);
    console.log('[Gateway received]', res);
    return res;
  }

  //@Post('request')
  //@UseGuards(AuthGuard('jwt'), RolesGuard)
  //@Roles('USER')
  //async requestReward(@Body() body: any) {
  //  console.log('[Gateway] sending reward_request...', body);
  //  const res = await this.rewardClient.requestReward(body);
  //  console.log('[Gateway received]', res);
  //  return res;
  //}
}
