import { Module } from '@nestjs/common';
import { EpisodeController } from './episode.controller';
import { EpisodeService } from './episode.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EpisodeGateway } from './gateway/episode.gateway';
import { Episode } from './entities/episode.entity';
@Module({
  imports: [TypeOrmModule.forFeature([Episode])], // Add this line to import the repository for Episode
  controllers: [EpisodeController],
  providers: [EpisodeService , EpisodeGateway],
  exports: [EpisodeService],
})
export class EpisodeModule {}
