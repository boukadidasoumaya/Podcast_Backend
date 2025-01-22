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
    private readonly episodeRepository: Repository<Episode>,
  ) {}

  // Create a new episode
  async create(createEpisodeDto: CreateEpisodeDto): Promise<Episode> {
    const episode = this.episodeRepository.create(createEpisodeDto);
    return this.episodeRepository.save(episode);
  }

  // Get all episodes
  async findAll(): Promise<Episode[]> {
    return this.episodeRepository.find();
  }

  // Get a single episode by ID
  async findOne(id: number): Promise<Episode> {
    return this.episodeRepository.findOne({ where: { id } });
  }

  // Update an existing episode
  async update(id: number, updateEpisodeDto: UpdateEpisodeDto): Promise<Episode> {
    const episode = await this.episodeRepository.findOne({ where: { id } });
    if (!episode) {
      throw new Error('Episode not found');
    }

    // Update the episode fields based on the DTO
    const updatedEpisode = Object.assign(episode, updateEpisodeDto);
    await this.episodeRepository.save(updatedEpisode);
    return updatedEpisode;
  }

  // Delete an episode by ID (soft delete)
  async remove(id: number): Promise<void> {
    const episode = await this.episodeRepository.findOne({ where: { id } });
    if (!episode) {
      throw new Error('Episode not found');
    }

    await this.episodeRepository.softDelete(id);  // Soft delete
  }

  // Increment views for an episode
  async incrementViews(id: number): Promise<Episode> {
    const episode = await this.episodeRepository.findOne({ where: { id } });
    if (!episode) {
      throw new Error('Episode not found');
    }

    episode.views += 1;
    await this.episodeRepository.save(episode);
    return episode;
  }
}
