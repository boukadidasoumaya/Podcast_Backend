/* eslint-disable prettier/prettier */

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePodcastDto } from './dto/create-podcast.dto';
import { UpdatePodcastDto } from './dto/update-podcast.dto';
import { Podcast } from './entities/podcast.entity';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class PodcastService {
  constructor(
    @InjectRepository(Podcast)
    private readonly podcastRepository: Repository<Podcast>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createPodcastDto: CreatePodcastDto): Promise<Podcast> {
    const newPodcast = this.podcastRepository.create(createPodcastDto);
    return await this.podcastRepository.save(newPodcast);
  }

  async findAll(): Promise<Podcast[]> {
    return await this.podcastRepository.find();
  }

  async findOne(id: number): Promise<Podcast> {
    return await this.podcastRepository.findOne({ where: { id } });
  }

  async update(
    id: number,
    updatePodcastDto: UpdatePodcastDto,
  ): Promise<Podcast> {
    const podcast = await this.podcastRepository.findOne({ where: { id } });
    if (!podcast) {
      throw new Error(`Podcast with ID ${id} not found.`);
    }
    const updatedPodcast = this.podcastRepository.merge(
      podcast,
      updatePodcastDto,
    );
    return await this.podcastRepository.save(updatedPodcast);
  }

  async remove(id: number): Promise<void> {
    const podcast = await this.podcastRepository.findOne({ where: { id } });
    if (!podcast) {
      throw new Error(`Podcast with ID ${id} not found.`);
    }
    await this.podcastRepository.delete(id);
  }

  async subscribe(userId: number, podcastId: number): Promise<string> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['subscriptions'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const podcast = await this.podcastRepository.findOne({
      where: { id: podcastId },
    });

    if (!podcast) {
      throw new NotFoundException('Podcast not found');
    }

    if (user.subscriptions.some((p) => p.id === podcast.id)) {
      return 'You are already subscribed to this podcast';
    }

    user.subscriptions.push(podcast);

    await this.userRepository.save(user);

    return 'Subscribed successfully';
  }


}
