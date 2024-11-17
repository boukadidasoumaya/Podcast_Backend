import { Injectable } from '@nestjs/common';
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
}