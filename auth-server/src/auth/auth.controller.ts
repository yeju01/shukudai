import { Controller } from '@nestjs/common';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { LoginUserDto } from 'src/dto/loginUser.dto';
import { CreateUserDto } from 'src/dto/user.dto';
import { AuthService } from './auth.service';

@Controller()
export class AuthServiceController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern('auth_register')
  async register(@Payload() dto: CreateUserDto) {
    try {
      console.log('[Auth received register]', dto);
      return await this.authService.createUser(dto);
    } catch (e) {
      console.error('[Auth register error]', e);
      throw new RpcException('Login failed');
    }
  }

  @MessagePattern('auth_login')
  async login(@Payload() dto: LoginUserDto) {
    return await this.authService.login(dto);
  }
}
