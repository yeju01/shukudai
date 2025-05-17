import { Injectable } from '@nestjs/common';
import { CreateUserDto } from 'src/dto/user.dto';

@Injectable()
export class UserService {
  private users: CreateUserDto[] = [];

  create(user: CreateUserDto) {
    this.users.push(user);
    return { message: 'User created successfully', user };
  }

  findByEmail(email: string) {
    const user = this.users.find((user) => user.email === email);
    if (!user) {
      return { message: 'User not found' };
    }
    return user;
  }
}
