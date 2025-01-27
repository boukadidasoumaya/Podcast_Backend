import { Module } from '@nestjs/common';
import { LikeEpisodeService } from './like-episode.service';
import { LikeEpisodeController } from './like-episode.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { UserModule } from '../user/user.module';
import { LikeEpisode } from './entities/like-episode.entity';

@Module({
  imports: [TypeOrmModule.forFeature([LikeEpisode, User])],

  providers: [LikeEpisodeService],
  controllers: [LikeEpisodeController]
})
export class LikeEpisodeModule {}
