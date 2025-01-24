import { Module } from '@nestjs/common';
import { PodcastService } from './podcast.service';
import { PodcastController } from './podcast.controller';
import { Podcast } from './entities/podcast.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Episode } from 'src/episode/entities/episode.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Podcast,Episode])],
  controllers: [PodcastController],
  providers: [PodcastService],
  exports: [PodcastService],
})
export class PodcastModule {}
