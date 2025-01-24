/* eslint-disable prettier/prettier */

import { Module } from '@nestjs/common';
import { PodcastService } from './podcast.service';
import { PodcastController } from './podcast.controller';
import { Podcast } from './entities/podcast.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Episode } from 'src/episode/entities/episode.entity';
import { EmailService } from 'src/email/email.service';
import { UserService } from 'src/user/user.service';
import { Payment } from 'src/payment/entities/payment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Podcast,User,Episode,Payment])],
  controllers: [PodcastController],
  providers: [PodcastService,EmailService,UserService],
  exports: [PodcastService],
})
export class PodcastModule {}
