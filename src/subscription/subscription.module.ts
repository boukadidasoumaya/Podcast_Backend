import { Module } from '@nestjs/common';
import { SubscriptionController } from './subscription.controller';
import { SubscriptionService } from './subscription.service';
import { Podcast } from 'src/podcast/entities/podcast.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Subscription } from './entities/subscription.entity';
import { EmailService } from 'src/email/email.service';
import { PodcastModule } from '../podcast/podcast.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Podcast, User, Subscription]),
    PodcastModule,
  ],
  controllers: [SubscriptionController],
  providers: [SubscriptionService, EmailService],
})
export class SubscriptionModule {}
