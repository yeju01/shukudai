import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/role/role.decorator';
import { RolesGuard } from 'src/role/role.guard';
import { AuthClientService } from './auth.client';

@Controller('auth')
export class AuthProxyController {
  constructor(private readonly authClient: AuthClientService) {}

  @Post('login')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('USER', 'OPERATOR', 'AUDITOR', 'ADMIN')
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
