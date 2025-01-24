import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Episode } from './entities/episode.entity';
import { CreateEpisodeDto } from './dto/create-episode.dto';
import { UpdateEpisodeDto } from './dto/update-episode.dto';
import { Podcast } from 'src/podcast/entities/podcast.entity';

@Injectable()
export class EpisodeService {
  constructor(
    @InjectRepository(Episode)
    private readonly episodeRepository: Repository<Episode>,
    @InjectRepository(Podcast)
    private readonly podcastRepository: Repository<Podcast>,
  ) {}
    

  // Create a new episode
  async create(createEpisodeDto: CreateEpisodeDto): Promise<Episode> {
    // Ensure the podcast exists before creating the episode
    const podcast = await this.podcastRepository.findOne({where: { id: createEpisodeDto.podcastId }});
    
    if (!podcast) {
      throw new Error('Podcast not found');
    }
  
    // Create a new episode and associate it with the podcast
    const episode = this.episodeRepository.create({
      ...createEpisodeDto, // Spread the other properties from the DTO
      podcast, // Associate the found podcast with the episode
    });
  
    // Save the episode to the database
    return await this.episodeRepository.save(episode);
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
