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
      return await this.rewardRequestService.createRewardRequest(dto);
    } catch (error) {
      throw error;
    }
  }

  @MessagePattern('reward_request_findAll')
  async getAllRewardRequest(@Payload() filter: any) {
    return await this.rewardRequestService.findAll(filter);
  }

  @MessagePattern('reward_request_findByUserId')
  async getRewardRequest(@Payload() userId: string) {
    return await this.rewardRequestService.findAllByUserId(userId);
  }
}
