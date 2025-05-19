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
          host: 'auth',
          port: 3001,
        },
      },
    ]),
  ],
  controllers: [AuthProxyController],
  providers: [AuthClientService],
})
export class AuthModule {}
