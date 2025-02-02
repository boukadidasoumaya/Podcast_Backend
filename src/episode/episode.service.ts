import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Episode } from './entities/episode.entity';
import { CreateEpisodeDto } from './dto/create-episode.dto';
import { UpdateEpisodeDto } from './dto/update-episode.dto';
import { Podcast } from 'src/podcast/entities/podcast.entity';
import { User } from '../user/entities/user.entity';

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
    const podcast = await this.podcastRepository.findOne({
      where: { id: createEpisodeDto.podcast.id },
    });

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
    const episodes = await this.episodeRepository.find({
      relations: ['podcast', 'likes', 'comments', 'podcast.user'],
    });
    return episodes.map((episode) => ({
      ...episode,
      numberOfLikes: episode.likes?.length || 0, // Compte le nombre de likes
      numberOfComments: episode.comments?.length || 0, // Compte le nombre de commentaires
    }));
  }
  // Get trending episodes (sorted by views in descending order)
  async findAllTrending(): Promise<Episode[]> {
    const episodes = await this.episodeRepository.find({
      order: { views: 'DESC' },
      relations: ['podcast', 'likes', 'likes.user', 'comments', 'podcast.user'],
      where: { deletedAt: null },
    });

    return episodes.map((episode) => {
      return {
        ...episode,
        numberOfLikes: episode.likes?.length || 0,
        numberOfComments: episode.comments?.length || 0,
      };
    });
  }

  // Get the latest 4 episodes (sorted by createdAt in descending order)
  async findAllLatest(): Promise<Episode[]> {
    const episodes = await this.episodeRepository.find({
      order: { createdAt: 'DESC' },
      relations: ['podcast', 'likes', 'comments', 'podcast.user'],
      where: { deletedAt: null },
    });
    return episodes.map((episode) => ({
      ...episode,
      numberOfLikes: episode.likes?.length || 0,
      numberOfComments: episode.comments?.length || 0,
    }));
  }

  // Get a single episode by ID
  async findOne(id: number): Promise<Episode> {
    const episode = await this.episodeRepository.findOne({
      where: { id },
      relations: ['podcast', 'likes', 'comments', 'podcast.user'],
    });
    console.log('fghjkl');

    if (!episode) {
      throw new NotFoundException('Episode not found');
    }
    return episode;
  }

  // Update an existing episode
  async update(
    id: number,
    updateEpisodeDto: UpdateEpisodeDto,
  ): Promise<Episode> {
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

    await this.episodeRepository.softDelete(id); // Soft delete
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
