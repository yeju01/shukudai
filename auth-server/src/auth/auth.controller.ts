import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateUserDto } from 'src/dto/user.dto';
import { UserService } from 'src/user/user.service';

@Controller()
export class AuthServiceController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern('auth_register')
  register(@Payload() body: CreateUserDto) {
    console.log('[Auth received register]', body);
    const existing = this.userService.findByEmail(body.email);
    if (existing) {
      return { error: 'Email already exists' };
    }
    return this.userService.create(body);
  }
}
