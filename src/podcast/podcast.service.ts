/* eslint-disable prettier/prettier */

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePodcastDto } from './dto/create-podcast.dto';
import { UpdatePodcastDto } from './dto/update-podcast.dto';
import { Podcast } from './entities/podcast.entity';
import { User } from 'src/user/entities/user.entity';
import { EmailService } from '../email/email.service';
import { UserService } from 'src/user/user.service';
@Injectable()
export class PodcastService {
  constructor(
    @InjectRepository(Podcast)
    private readonly podcastRepository: Repository<Podcast>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly mailService: EmailService,
    private readonly UserService: UserService,
  ) { }

  async create(createPodcastDto: CreatePodcastDto, user: User): Promise<Podcast> {
    const newPodcast = this.podcastRepository.create({
        ...createPodcastDto,
        user: user, 
    });

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


  async getpodsparuser(id: number): Promise<Podcast[]> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['subscriptions'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user.subscriptions;
  }

  async getpodswithusers(): Promise<Podcast[]> {
    const Pods = await this.podcastRepository.find({
      relations: ['subscribers'],
    })
    return Pods

  }

  async getpodswithepisodes(): Promise<Podcast[]> {
    const Pods = await this.podcastRepository.find({
      relations: ['episodes'],
    })
    return Pods

  }
  async filterpodcasts({ title, topic, nbre_episodes, user, minDuration, maxDuration }): Promise<Podcast[]> {
    const querybuilder = this.podcastRepository.createQueryBuilder('podcast');

    if (title) {
      querybuilder.andWhere('podcast.name = :title', { title });
    }

    if (nbre_episodes) {
      querybuilder.andWhere('podcast.nbre_episode = :nbre_episodes', { nbre_episodes });
    }

    if (minDuration) {
      querybuilder.andWhere('podcast.duration >= :minDuration', { minDuration });
    }

    if (maxDuration) {
      querybuilder.andWhere('podcast.duration <= :maxDuration', { maxDuration });
    }

    if (user) {
      querybuilder
        .leftJoinAndSelect('podcast.user', 'user')
        .andWhere('user.username = :user', { user: user });
    }

    if (topic) {
      // querybuilder.andWhere('topic = :topic',{topic});
    }

    return await querybuilder.getMany();
  }



  // async getepisodesbyPodcast(id:number):Promise<Podcast>{

  // }

}
