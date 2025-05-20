import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class EventClientService {
  constructor(
    @Inject('EVENT_SERVICE')
    private readonly client: ClientProxy,
  ) {}

  async createEvent(payload: any) {
    const res = this.client.send('event_create', payload);
    return await lastValueFrom(res);
  }

  async updateEvent(payload: any) {
    const res = this.client.send('event_update', payload);
    return await lastValueFrom(res);
  }

  async listEvents() {
    const res = this.client.send('event_list', {});
    return await lastValueFrom(res);
  }

  async getEventDetail(id: string) {
    const res = this.client.send('event_detail', id);
    return await lastValueFrom(res);
  }
}
