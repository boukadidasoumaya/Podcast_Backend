import { Module } from '@nestjs/common';
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
import { EpisodeModule } from './episode/episode.module';
import { PodcastModule } from './podcast/podcast.module';
import { BookmarkModule } from './bookmark/bookmark.module';
import { EventsModule } from './test/events.module';
import { SubscribeModule } from './subscribe/subscribe.module';
import { LikeEpisodeModule } from './like-episode/like-episode.module';
import { LikeCommentModule } from './like-comment/like-comment.module';
import { topicModule } from './topics/topic.module';
import { SubscriptionModule } from './subscription/subscription.module';
import { WebSocketGateway } from '@nestjs/websockets';
import { EpisodeGateway } from './episode/gateway/episode.gateway';
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
      autoLoadEntities: true,
      entities: ['dist/**/*.entity{.ts,.js}'],
      synchronize: false,
    }),
    AuthModule,
    UserModule,
    EmailModule,
    TypedEventEmitterModule,
    PaymentModule,
    CommentModule,
    LikeCommentModule,
    LikeEpisodeModule,
    EpisodeModule,
    PodcastModule,
    BookmarkModule,
    EventsModule,
    SubscribeModule,
    topicModule,
    SubscriptionModule
  ],
  controllers: [AppController],
  providers: [AppService,EpisodeGateway],
})
export class AppModule {}

