import {
  Body,
  ConflictException,
  Controller,
  InternalServerErrorException,
  Post,
  Put,
  UnauthorizedException,
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
  async login(@Body() body: any) {
    try {
      return await this.authClient.login({
        email: body.email,
        password: body.password,
        role: body.role,
      });
    } catch (error) {
      throw new UnauthorizedException('등록되지 않은 유저 또는 입력 실패');
    }
  }

  @Post('register')
  async register(@Body() body: any) {
    try {
      return await this.authClient.register(body);
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

  @Put('roleUpdate')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  async roleUpdate(@Body() body: any) {
    console.log('user:', body.user);
    return await this.authClient.roleUpdate(body);
  }
}
