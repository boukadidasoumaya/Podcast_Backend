import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LikeEpisode } from './entities/like-episode.entity';
import { CrudService } from '../common/common.service'; // Adjust path as necessary

@Injectable()
export class LikeEpisodeService extends CrudService<LikeEpisode> {
  constructor(
    @InjectRepository(LikeEpisode)
    private readonly likeEpisodeRepository: Repository<LikeEpisode>,
  ) {
    super(likeEpisodeRepository);
  }
}
