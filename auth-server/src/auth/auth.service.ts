import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { LoginUserDto } from 'src/dto/loginUser.dto';
import { CreateUserDto } from 'src/dto/user.dto';
import { User } from 'src/schema/user.schema';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    private readonly jwtService: JwtService,
  ) {}

  async createUser(dto: CreateUserDto) {
    const { email, password, role } = dto;

    const exists = await this.userModel.exists({ email });
    if (exists) {
      throw new ConflictException('이메일 중복');
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new this.userModel({
      email,
      password: hashedPassword,
      role,
      createdAt: new Date(),
    });

    return await newUser.save();
  }

  async validateUser(email: string, password: string) {
    const user = await this.userModel.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return null;
    }
    return user;
  }

  async login(loginUser: LoginUserDto) {
    try {
      const user = await this.validateUser(loginUser.email, loginUser.password);
      if (!user) {
        throw new UnauthorizedException('등록되지 않은 유저');
      }
      const payload = { email: user.email, sub: user._id, role: user.role };
      const accessToken = this.jwtService.sign(payload);
      return { accessToken };
    } catch (e) {
      throw new UnauthorizedException('등록되지 않은 유저');
    }
  }
}
