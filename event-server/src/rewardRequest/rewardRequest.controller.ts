import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateRewardRequestDto } from 'src/dto/createRewardRequest.dto';
import { RewardRequestService } from './rewardRequest.service';

@Controller()
export class RewardRequestController {
  constructor(private readonly rewardRequestService: RewardRequestService) {}

  @MessagePattern('reward_request_create')
  async createRewardRequest(@Payload() dto: CreateRewardRequestDto) {
    try {
      console.log('[RewardRequest received create]', dto);
      return await this.rewardRequestService.createRewardRequest(dto);
    } catch (error) {
      console.error('[RewardRequest create error]', error);
      throw error;
    }
  }

  @MessagePattern('reward_request_findAll')
  async getAllRewardRequest(@Payload() filter: any) {
    console.log('[RewardRequest received getAll]', filter);
    return await this.rewardRequestService.findAll(filter);
  }

  @MessagePattern('reward_request_findByUserId')
  async getRewardRequest(@Payload() userId: string) {
    console.log('[RewardRequest received get]', userId);
    return await this.rewardRequestService.findAllByUserId(userId);
  }
}
