import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/role/role.decorator';
import { RolesGuard } from 'src/role/role.guard';
import { RewardClientService } from './reward.client';

@Controller('reward')
export class RewardProxyController {
  constructor(private readonly rewardClient: RewardClientService) {}

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('OPERATOR')
  @Post('create')
  async createReward(@Body() body: any) {
    console.log('[Gateway] sending reward_create...', body);
    const res = await this.rewardClient.createReward(body);
    console.log('[Gateway received]', res);
    return res;
  }
}
