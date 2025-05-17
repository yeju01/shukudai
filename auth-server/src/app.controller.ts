import { Controller, Get } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @MessagePattern('auth_login')
  handleLogin(@Payload() data: any) {
    console.log('[Auth received login]', data); // note: logging
    return { token: 'test-token', email: data.email };
  }
}
