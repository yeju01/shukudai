import { BadRequestException, Controller, UseFilters } from '@nestjs/common';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { LoginUserDto } from 'src/dto/loginUser.dto';
import { CreateUserDto } from 'src/dto/user.dto';
import { ExceptionFilter } from 'src/exception/rpc-exception.filter';
import { AuthService } from './auth.service';

@Controller()
export class AuthServiceController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern('auth_login')
  @UseFilters(new ExceptionFilter())
  async login(@Payload() dto: LoginUserDto) {
    try {
      return await this.authService.login(dto);
    } catch (error) {
      if (error.message === '등록되지 않은 유저') {
        throw new RpcException({
          message: '등록되지 않은 유저',
        });
      }

      throw new RpcException({
        message: '로그인 처리 중 오류 발생',
      });
    }
  }

  @MessagePattern('auth_register')
  @UseFilters(new ExceptionFilter())
  async register(@Payload() dto: CreateUserDto) {
    try {
      return await this.authService.createUser(dto);
    } catch (error) {
      console.error('[Auth register error]', error);

      if (error instanceof BadRequestException) {
        throw new RpcException({
          message: '잘못된 이메일 형식',
        });
      }
      if (error.message === '이메일 중복') {
        throw new RpcException({ message: '이메일 중복' });
      }

      console.error('[Auth register error]', error);
      throw new RpcException({
        message: '회원가입 처리 중 오류 발생',
      });
    }
  }
}
