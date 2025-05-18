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
    //JwtModule.registerAsync({
    //  imports: [ConfigModule],
    //  useFactory: async (config: ConfigService) => {
    //    const secret = config.get<string>('JWT_SECRET');
    //    const expiresIn = config.get<string>('JWT_EXPIRATION');

    //    console.log('[JwtModule config] secret:', secret);
    //    console.log('[JwtModule config] expiresIn:', expiresIn);

    //    return {
    //      secret,
    //      signOptions: {
    //        expiresIn,
    //      },
    //    };
    //  },
    //  inject: [ConfigService],
    //}),
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
