import { Module } from '@nestjs/common';
import { LikeEpisodeService } from './like-episode.service';
import { LikeEpisodeGateway } from './like-episode.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LikeEpisode } from './entities/like-episode.entity';
import { EpisodeModule } from '../episode/episode.module';
import { UserModule } from '../user/user.module';
import { LikeEpisodeController } from './like-episode.controller';

@Module({
  imports: [TypeOrmModule.forFeature([LikeEpisode]), EpisodeModule, UserModule],
  controllers: [LikeEpisodeController],
  providers: [LikeEpisodeService, LikeEpisodeGateway],
})
export class LikeEpisodeModule {}