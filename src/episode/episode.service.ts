import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Episode } from './entities/episode.entity';
import { CreateEpisodeDto } from './dto/create-episode.dto';
import { UpdateEpisodeDto } from './dto/update-episode.dto';

@Injectable()
export class EpisodeService {
  constructor(
    @InjectRepository(Episode)
    private episodeRepository: Repository<Episode>,
  ) {}

  // Find all episodes
  findAll() {
    return this.episodeRepository.find();
  }

  // Find one episode by ID
  findOne(id: string) {
    return this.episodeRepository.findOne({ where: { id } });
  }

  // Create a new episode
  async create(createEpisodeDto: CreateEpisodeDto) {
    const newEpisode = this.episodeRepository.create(createEpisodeDto); // Creates an instance of Episode with the DTO
    return await this.episodeRepository.save(newEpisode); // Save to the database
  }

  // Update an existing episode
  async update(id: string, updateEpisodeDto: UpdateEpisodeDto) {
    const episode = await this.episodeRepository.preload({
      id,
      ...updateEpisodeDto, // Preload the episode and apply updates
    });

    if (!episode) {
      return null; // Episode not found
    }

    return this.episodeRepository.save(episode); // Save updated episode to the database
  }

  // Remove an episode by ID
  async remove(id: string) {
    const episode = await this.episodeRepository.findOne({ where: { id } });
    if (!episode) {
      return null; // Episode not found
    }

    await this.episodeRepository.remove(episode); // Remove episode from the database
    return episode; // Return the deleted episode
  }
}
