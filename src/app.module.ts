import {  Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
dotenv.config();
import * as process from 'node:process';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { TypedEventEmitterModule } from './shared/event-emitter/typed-event-emitter.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { EmailModule } from './email/email.module';
import { PaymentModule } from './payment/payment.module';
import { CommentModule } from './comment/comment.module';
import { LikeModule } from './like/like.module';
import { EpisodeModule } from './episode/episode.module';
@Module({
  imports: [
    EventEmitterModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: ['dist/**/*.entity{.ts,.js}'],
      autoLoadEntities: true,
      synchronize: true,
    }),
    AuthModule,
    UserModule,
    EmailModule,
    TypedEventEmitterModule,
    PaymentModule,
    CommentModule,
    LikeModule,
    EpisodeModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

