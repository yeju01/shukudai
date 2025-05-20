import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateRewardDto } from 'src/dto/createReward.dto';
import { RewardService } from './reward.service';

@Controller()
export class RewardController {
  constructor(private readonly rewardService: RewardService) {}

  @MessagePattern('reward_create')
  async createReward(@Payload() dto: CreateRewardDto) {
    return await this.rewardService.createReward(dto);
  }
  @MessagePattern('reward_list')
  async listRewards() {
    return await this.rewardService.listRewards();
  }

  @MessagePattern('reward_delete')
  async deleteReward(@Payload() id: string) {
    return await this.rewardService.deleteReward(id);
  }
}
