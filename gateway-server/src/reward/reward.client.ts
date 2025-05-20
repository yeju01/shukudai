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

  async listRewards() {
    const res = this.client.send('reward_list', {});
    return await lastValueFrom(res);
  }

  async deleteReward(id: string) {
    const res = this.client.send('reward_delete', id);
    return await lastValueFrom(res);
  }
}
