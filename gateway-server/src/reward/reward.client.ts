import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class RewardClientService {
  constructor(
    @Inject('REWARD_SERVICE')
    private readonly client: ClientProxy,
  ) {}

  async createReward(payload: any) {
    const res = this.client.send('reward_create', payload);
    return await lastValueFrom(res);
  }

  // note: 아래는 아직 테스트 전
  async listRewards() {
    const res = this.client.send('reward_list', {});
    return await lastValueFrom(res);
  }

  async getRewardDetail(id: string) {
    const res = this.client.send('reward_detail', id);
    return await lastValueFrom(res);
  }
}
