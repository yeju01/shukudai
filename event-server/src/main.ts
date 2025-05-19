import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  console.log('[EventServer] Initializing TCP microservice...');

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.TCP,
      options: {
        port: 3002,
        host: '0.0.0.0',
      },
    },
  );
  await app.listen();
  console.log('[EventServer] TCP microservice is LISTENING on port 3002');
}
bootstrap();
