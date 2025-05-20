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
        throw new UnauthorizedException('등록되지 않은 유저 또는 입력 실패');
      }

      throw new InternalServerErrorException('로그인 처리 중 요류 발생');
    }
  }

  @Post('register')
  async register(@Body() body: any) {
    try {
      const res = await this.authClient.register(body);
      return res;
    } catch (error) {
      if (error.message === '잘못된 이메일 형식') {
        throw new UnauthorizedException('잘못된 이메일 형식');
      }
      if (error.message === '이메일 중복') {
        throw new ConflictException('이미 등록된 이메일');
      }

      throw new UnauthorizedException('회원가입 처리 중 오류 발생');
    }
  }
}
