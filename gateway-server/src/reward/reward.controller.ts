import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/role/role.decorator';
import { RolesGuard } from 'src/role/role.guard';
import { RewardClientService } from './reward.client';

@Controller('reward')
export class RewardProxyController {
  constructor(private readonly rewardClient: RewardClientService) {}

  @Post('create')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('OPERATOR', 'ADMIN')
  async createReward(@Body() body: any) {
    try {
      return await this.rewardClient.createReward(body);
    } catch (error) {
      if (error.message === '이벤트 없음') {
        throw new NotFoundException('이벤트 없음');
      }

      throw new BadRequestException('보상 생성 실패');
    }
  }

  @Get('list')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('OPERATOR', 'ADMIN')
  async listRewards() {
    try {
      return await this.rewardClient.listRewards();
    } catch (error) {
      throw new BadRequestException('보상 목록 조회 실패');
    }
  }

  @Post('delete')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('OPERATOR', 'ADMIN')
  async deleteReward(@Body('id') id: string) {
    try {
      return await this.rewardClient.deleteReward(id);
    } catch (error) {
      if (error.message === '보상 없음') {
        throw new NotFoundException('보상 없음');
      }

      throw new BadRequestException('보상 삭제 실패');
    }
  }
}
