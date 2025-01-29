/* eslint-disable prettier/prettier */

import { Injectable, NotFoundException, Query } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryBuilder, Repository } from 'typeorm';
import { CreatePodcastDto } from './dto/create-podcast.dto';
import { UpdatePodcastDto } from './dto/update-podcast.dto';
import { Podcast } from './entities/podcast.entity';
import { User } from 'src/user/entities/user.entity';
import { EmailService } from 'src/email/email.service';
import { UserService } from 'src/user/user.service';
import { query } from 'express';

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
      relations: ['subscribers'],
    });

    if (!podcast) {
      throw new NotFoundException('Podcast not found');
    }

    if (user.subscriptions.some((p) => p.id === podcast.id)) {
      return 'You are already subscribed to this podcast';
    }

    user.subscriptions.push(podcast);
    podcast.subscribers.push(user);

    await this.userRepository.save(user);

    await this.mailService.sendSubscriptionEmail({
      name: user.username + ' ' + user.lastName,
      email: user.email,
      podcast: podcast.name,
    });

    return 'Subscribed successfully';
  }


  async unsubscribe(userId: number, podcastId: number): Promise<string> {
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

    if (!user.subscriptions.some((p) => p.id === podcast.id)) {
      return 'You are not subscribed to this podcast';
    }

    user.subscriptions = user.subscriptions.filter((p) => p.id !== podcast.id);

    await this.userRepository.save(user);

    return 'Unsubscribed successfully';


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
        .andWhere('user.username = :username', { username: user });
    }

    if (topic) {
      // querybuilder.andWhere('topic = :topic',{topic});
    }

    return await querybuilder.getMany();
  }



  // async getepisodesbyPodcast(id:number):Promise<Podcast>{

  // }

}
