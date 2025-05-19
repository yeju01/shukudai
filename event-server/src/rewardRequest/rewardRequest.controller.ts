import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateRewardRequestDto } from 'src/dto/createRewardRequest.dto';
import { RewardRequestService } from './rewardRequest.service';

@Controller()
export class RewardRequestController {
  constructor(private readonly rewardRequestService: RewardRequestService) {}

  @MessagePattern('reward_request_create')
  async createRewardRequest(@Payload() dto: CreateRewardRequestDto) {
    console.log('[RewardRequest received create]', dto);
    return await this.rewardRequestService.createRewardRequest(dto);
  }

  @MessagePattern('reward_request_findByUserId')
  async getRewardRequest(@Payload() userId: string) {
    console.log('[RewardRequest received get]', userId);
    return await this.rewardRequestService.findByUserId(userId);
  }

  @MessagePattern('reward_request_findAll')
  async getAllRewardRequest() {
    console.log('[RewardRequest received getAll]');
    return await this.rewardRequestService.findAll();
  }
}
