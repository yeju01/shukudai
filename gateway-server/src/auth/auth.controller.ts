import {
  Body,
  ConflictException,
  Controller,
  InternalServerErrorException,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthClientService } from './auth.client';

@Controller('auth')
export class AuthProxyController {
  constructor(private readonly authClient: AuthClientService) {}

  @Post('login')
  async login(@Body() body: any) {
    try {
      return await this.authClient.login({
        email: body.email,
        password: body.password,
        role: body.role,
      });
    } catch (error) {
      if (error.message === '등록되지 않은 유저 또는 입력 실패') {
        console.error('[Gateway] Email not found', error);
        throw new UnauthorizedException('등록되지 않은 유저 또는 입력 실패');
      }

      console.error('[Gateway] Login failed', error);
      throw new InternalServerErrorException('로그인 처리 중 요류 발생');
    }
  }

  @Post('register')
  async register(@Body() body: any) {
    try {
      console.log('[Gateway] sending auth_register...', body);
      const res = await this.authClient.register(body);
      console.log('[Gateway received]', res);
      return res;
    } catch (error) {
      if (error.message === '잘못된 이메일 형식') {
        console.error('[Gateway] Invalid email format', error);
        throw new UnauthorizedException('잘못된 이메일 형식');
      }
      if (error.message === '이메일 중복') {
        console.error('[Gateway] Email already exists', error);
        throw new ConflictException('이미 등록된 이메일');
      }

      console.error('[Gateway] Registration failed', error);
      throw new UnauthorizedException('회원가입 처리 중 오류 발생');
    }
  }
}
