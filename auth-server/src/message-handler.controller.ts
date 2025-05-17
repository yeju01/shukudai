import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class MessageHandlerController {
  @MessagePattern('auth_login')
  handleLogin(@Payload() data: any) {
    console.log('[Auth received login]', data); // note: logging
    return { token: 'test-token' };
  }
}
