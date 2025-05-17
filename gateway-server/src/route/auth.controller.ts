import { Body, Controller, Post } from '@nestjs/common';
import { AuthClientService } from './auth.client';

@Controller('auth')
export class AuthProxyController {
  constructor(private readonly authClient: AuthClientService) {}

  @Post('login')
  async login(@Body() body: any) {
    console.log('[Gateway] sending auth_login...', body);
    const res = await this.authClient.login({
      email: body.email,
      password: body.password,
      role: body.role,
    });
    console.log('[Gateway received]', res);
    return res;
  }

  @Post('register')
  async register(@Body() body: any) {
    console.log('[Gateway] sending auth_register...', body);
    const res = await this.authClient.register(body);
    console.log('[Gateway received]', res);
    return res;
  }
}
