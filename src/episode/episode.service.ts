import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Episode } from './entities/episode.entity';
import { CreateEpisodeDto } from './dto/create-episode.dto';
import { UpdateEpisodeDto } from './dto/update-episode.dto';
import { CrudService } from '../common/common.service';
@Injectable()
export class EpisodeService extends CrudService<Episode> {
  constructor(
    @InjectRepository(Episode)
    private episodeRepository: Repository<Episode>,
  ) {
    super(episodeRepository); // Pass the repository to the CrudService constructor
    
  }
  async incrementViews(id: number): Promise<Episode> {
    const episode = await this.episodeRepository.findOneBy({ id });
    if (!episode) {
      throw new NotFoundException('Episode not found');
    }
    episode.views += 1;
    return await this.episodeRepository.save(episode);
  }
}