import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AuthClientService } from './auth.client';
import { AuthProxyController } from './auth.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'AUTH_SERVICE',
        transport: Transport.TCP,
        options: {
          host: 'auth', // note: docker-compose에서 정의한 서비스명
          port: 3001,
        },
      },
    ]),
  ],
  controllers: [AuthProxyController],
  providers: [AuthClientService],
})
export class AuthModule {}
