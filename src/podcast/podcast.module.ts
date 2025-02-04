import { topicModule } from './../topics/topic.module';
/* eslint-disable prettier/prettier */

import { Module } from '@nestjs/common';
import { PodcastService } from './podcast.service';
import { PodcastController } from './podcast.controller';
import { Podcast } from './entities/podcast.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Episode } from 'src/episode/entities/episode.entity';
import { User } from 'src/user/entities/user.entity';
import { UserService } from '../user/user.service';
import { EmailService } from '../email/email.service';
import { SubscribeModule } from '../subscribe/subscribe.module';
import { Payment } from '../payment/entities/payment.entity';
import { Topic } from 'src/topics/entities/topic.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Podcast,User,Episode,Payment]),SubscribeModule,topicModule],
  controllers: [PodcastController],
  providers: [PodcastService,EmailService,UserService],
  exports: [PodcastService],
})
export class PodcastModule {}
