import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from 'src/dto/user.dto';
import { user, userDocument } from './user.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(user.name) private readonly userModel: Model<userDocument>,
  ) {}

  async create(user: CreateUserDto) {
    const created = await this.userModel.create({
      ...user,
      createdAt: new Date(),
    });

    return {
      message: 'User created successfully',
      user: created,
    };
  }

  async findByEmail(email: string) {
    return this.userModel.findOne({ email }).exec();
  }
}
