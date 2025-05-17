import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      useFactory: (config: ConfigService) => {
        const user = config.getOrThrow<string>('MONGODB_USERNAME');
        const password = config.getOrThrow<string>('MONGODB_PASSWORD');
        const db = config.getOrThrow<string>('MONGODB_DB');
        const host = config.getOrThrow<string>('MONGODB_HOST');
        const port = config.getOrThrow<string>('MONGODB_PORT');

        const uri = `mongodb://${user}:${password}@${host}:${port}/${db}?authSource=admin`; //  note: admin
        return { uri };
      },
      inject: [ConfigService],
    }),
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
