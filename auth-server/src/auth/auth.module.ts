import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserService } from 'src/user/user.service';
import { user, UserSchema } from '../user/user.schema';
import { AuthServiceController } from './auth.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: user.name, schema: UserSchema }]),
  ],
  controllers: [AuthServiceController],
  providers: [UserService],
  exports: [],
})
export class AuthModule {}
