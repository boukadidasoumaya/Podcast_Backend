import { Injectable, NotFoundException, UseInterceptors } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Episode } from './entities/episode.entity';
import { CreateEpisodeDto } from './dto/create-episode.dto';
import { UpdateEpisodeDto } from './dto/update-episode.dto';
import { Podcast } from 'src/podcast/entities/podcast.entity';


import { Subscription } from '../subscription/entities/subscription.entity';
import { EmailService } from 'src/email/email.service';
@Injectable()
export class EpisodeService {
  constructor(
    @InjectRepository(Episode)
    private readonly episodeRepository: Repository<Episode>,
    @InjectRepository(Subscription)
    private readonly subscriptionRepository: Repository<Subscription>,
    private readonly emailService: EmailService,
    @InjectRepository(Podcast)
    private readonly podcastRepository: Repository<Podcast>,
  ) {}

  async create(createEpisodeDto: CreateEpisodeDto): Promise<Episode> {
    // Ensure the podcast exists before creating the episode
    const podcast = await this.podcastRepository.findOne({
      where: { id: createEpisodeDto.podcast.id },
    });

    if (!podcast) {
      throw new Error('Podcast not found');
    }
  
    const episode = this.episodeRepository.create({
      ...createEpisodeDto,
      podcast,
    });
    
  
    podcast.nbre_episode++;
    podcast.duration+=episode.duration;
  
    await this.podcastRepository.save(podcast);
  
   const epi = await this.episodeRepository.save(episode);
   const id = episode.id;
   this.notify(id);
   return epi;

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
  async notify(id: number): Promise<any> {
    const episode = await this.episodeRepository.findOne({
      where: { id },
      relations: ['podcast'],
    });

    if (!episode) {
      throw new NotFoundException('Episode not found');
    }
    const podcast = episode.podcast; 
    const subscriptions = await this.subscriptionRepository.find({
      where: { podcast },
      relations: ['user'],
    });
    console.log(subscriptions);
    for (const subscription of subscriptions) {
      await this.emailService.newepisode({
        name: subscription.user.username + ' ' + subscription.user.lastName,
        email: subscription.user.email,
        podcast: episode.podcast.name,
      });
    }
    return subscriptions;
  }
}
