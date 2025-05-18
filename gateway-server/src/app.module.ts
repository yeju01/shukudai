import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JwtCheckModule } from './jwt/jwtCheck.module';
import { AuthModule } from './route/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    JwtCheckModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
