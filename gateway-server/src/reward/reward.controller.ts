import { Body, Controller, InternalServerErrorException, NotFoundException, Post, UseGuards } from '@nestjs/common';
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
    try {
    console.log('[Gateway] sending reward_create...', body);
    const res = await this.rewardClient.createReward(body);
    console.log('[Gateway received]', res);
    return res;
    } catch (error) {
      if (error.message === '이벤트 없음') {
        console.error('[Gateway] Event not found', error);
        throw new NotFoundException('이벤트 없음');
      }
      //note: 형식잘못됨

      console.error('[Gateway] Reward creation failed', error);
      throw new InternalServerErrorException('보상 생성 실패');
    }
  }
}
