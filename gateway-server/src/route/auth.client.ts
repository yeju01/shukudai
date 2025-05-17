import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class AuthClientService {
  constructor(@Inject('AUTH_SERVICE') private readonly client: ClientProxy) {}

  async login(payload: any) {
    const res = this.client.send('auth_login', payload);
    return await lastValueFrom(res);
  }

  async register(payload: any) {
    const res = this.client.send('auth_register', payload);
    return await lastValueFrom(res);
  }
}
