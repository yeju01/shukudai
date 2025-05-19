import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.TCP,
      options: {
        host: '0.0.0.0', // note: 컨테이너 내부에서 모든 인터페이스 수신 허용
        port: 3001,
      },
    },
  );
  await app.listen();
}
bootstrap();
