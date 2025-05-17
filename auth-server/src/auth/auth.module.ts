import { Module } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { AuthServiceController } from './auth.controller';

@Module({
  controllers: [AuthServiceController],
  providers: [UserService],
  imports: [],
  exports: [],
})
export class AuthModule {}
