import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateRewardDto } from 'src/dto/createReward.dto';
import { RewardService } from './reward.service';

@Controller()
export class RewardController {
  constructor(private readonly rewardService: RewardService) {}

  @MessagePattern('reward_create')
  async createReward(@Payload() dto: CreateRewardDto) {
    console.log('[Reward received create]', dto);
    return await this.rewardService.createReward(dto);
  }
  //@MessagePattern('reward_list')
  //async listRewards() {
  //  console.log('[Reward received list]');
  //  return await this.rewardService.listRewards();
  //}
  //@MessagePattern('reward_detail')
  //async getRewardById(@Payload() id: string) {
  //  console.log('[Reward received detail]', id);
  //  return await this.rewardService.getRewardById(id);
  //}
  //@MessagePattern('reward_update')
  //async updateReward(@Payload() dto: UpdateRewardDto) {
  //  console.log('[Reward received update]', dto);
  //  return await this.rewardService.updateReward(dto);
  //}
  //@MessagePattern('reward_delete')
  //async deleteReward(@Payload() id: string) {
  //  console.log('[Reward received delete]', id);
  //  return await this.rewardService.deleteReward(id);
  //}
}
