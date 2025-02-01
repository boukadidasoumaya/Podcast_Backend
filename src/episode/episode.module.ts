import { Module } from '@nestjs/common';
import { EpisodeController } from './episode.controller';
import { EpisodeService } from './episode.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EpisodeGateway } from './gateway/episode.gateway';
import { Episode } from './entities/episode.entity';
import { Subscription } from 'src/subscription/entities/subscription.entity';
import { SubscriptionService } from 'src/subscription/subscription.service';
import { SubscriptionModule } from 'src/subscription/subscription.module';
import { UserModule } from 'src/user/user.module';
import { User } from 'src/user/entities/user.entity';
import { Podcast } from 'src/podcast/entities/podcast.entity';
import { PodcastModule } from 'src/podcast/podcast.module';
import { EmailController } from 'src/email/email.controller';
import { EmailModule } from 'src/email/email.module';
import { EmailService } from 'src/email/email.service';
@Module({
  imports: [
    TypeOrmModule.forFeature([Episode, Subscription, User,Podcast]),
    SubscriptionModule,
    UserModule,
    PodcastModule,
    EmailModule
  ], // Add this line to import the repository for Episode
  controllers: [EpisodeController],
  providers: [
    EpisodeService,
    EpisodeGateway,
    SubscriptionService,
    EmailService,
  ],
  exports: [EpisodeService],
})
export class EpisodeModule {}
