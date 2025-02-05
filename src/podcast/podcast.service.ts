
/* eslint-disable prettier/prettier */

import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdatePodcastDto } from './dto/update-podcast.dto';
import { Podcast } from './entities/podcast.entity';
import { User } from 'src/user/entities/user.entity';
import { EmailService } from '../email/email.service';
import { UserService } from 'src/user/user.service';
import { SubscribeService } from 'src/subscribe/subscribe.service';
import { Episode } from 'src/episode/entities/episode.entity';
import { CreatePodcastDto } from './dto/create-podcast.dto';
import { TopicService } from 'src/topics/topic.service';
import { Subscription } from 'src/subscription/entities/subscription.entity';

@Injectable()
export class PodcastService {
  constructor(
    @InjectRepository(Podcast)
    private readonly podcastRepository: Repository<Podcast>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Episode)
    private episodeRepository: Repository<Episode>,

    private readonly mailService: EmailService,
    private readonly UserService:UserService,
    private readonly subscribeAllService : SubscribeService,
    private readonly topicService:TopicService
  ) {}


  async createPodcast(currentUser: User, createPodcastDto: CreatePodcastDto): Promise<Podcast> {
    const { topic, ...rest } = createPodcastDto;
    const newTopic = await this.topicService.create({
      title: topic,
      image: 'uploads/pod-talk-logo.png' 
    });
    if (!currentUser.isOwner) {
      currentUser.isOwner = true;
      await this.userRepository.save(currentUser);
    }
  
    const podcast = this.podcastRepository.create({
      ...rest,
      user: currentUser,
      topic:newTopic,
    });
  
    // Step 4: Fetch subscribers
    const subscribers = await this.subscribeAllService.findAll();
  
    // Step 5: Notify subscribers
    if (subscribers && subscribers.length > 0) {
      for (const subscriber of subscribers) {
        const { email } = subscriber;
        try {
          await this.mailService.sendSubscribeAllEmail({
            name: createPodcastDto.name, 
            email: email,
          });
          console.log(`Email successfully sent to: ${email}`);
        } catch (error) {
          console.error(`Failed to send email to: ${email}`, error);
        }
      }
    }
  

    return await this.podcastRepository.save(podcast);;
  }
  
  
  
  async findAll(): Promise<Podcast[]> {
    return await this.podcastRepository.find();
  }


  async getsallpods(): Promise<Podcast[]> {
    return await this.podcastRepository.find({
      relations: ['user', 'topic'],
    });
  }


  async findOne(id: number): Promise<Podcast> {
    return await this.podcastRepository.findOne({ where: { id } });
  }
  async findFirstEpisodeByPodcastId(podcastId: number): Promise<Episode | null> {
    const firstEpisode = await this.episodeRepository.findOne({
      where: { podcast: { id: podcastId } },
      relations: ['podcast'],
      order: { createdAt: 'ASC' },
    });

    return firstEpisode || null;
  }

  async update(
    id: number,
    updatePodcastDto: UpdatePodcastDto,
  ): Promise<Podcast> {
    const podcast = await this.podcastRepository.findOne({ where: { id } });
    if (!podcast) {
      throw new Error(`Podcast with ID ${id} not found.`);
    }
    const { topic, ...rest } = updatePodcastDto;
    const newTopic = await this.topicService.create({
      title: topic,
      image: 'uploads/pod-talk-logo.png' 
    });
    const updatedPodcast = this.podcastRepository.merge(
      podcast,
      rest,
      newTopic
    );
    return await this.podcastRepository.save(updatedPodcast);
  }

  async remove(id: number): Promise<void> {
    const podcast = await this.podcastRepository.findOne({ where: { id } });
    if (!podcast) {
      throw new Error(`Podcast with ID ${id} not found.`);
    }
    await this.podcastRepository.softDelete(id);
  }


  async getpodsparuser(id: number): Promise<Subscription[]> {
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
    const querybuilder = this.podcastRepository.createQueryBuilder('podcast')
                .leftJoinAndSelect('podcast.user', 'user')
                .leftJoinAndSelect('podcast.topic', 'topic');

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
        .andWhere('user.username = :user', { user: user });
    }

    if (topic) {
      querybuilder
        .andWhere('topic.title = :topic', { topic: topic });
    }

    return await querybuilder.getMany();
  }


  async findAllEpisodesByPodcastId(podcastId: number): Promise<Episode[]> {
    return this.episodeRepository.find({
      where: { podcast: { id: podcastId } },
<<<<<<< HEAD
      relations: ['podcast'],  
=======
      relations: ['podcast'],  // Ensure the relationship is loaded
      order: { number: 'ASC' } // Sort episodes by number in ascending order
>>>>>>> 08c436e113aaaf02c1b57f7d42d73326de3e712b
    });
  }

  async getPodcastsByUserId(userId: number): Promise<Podcast[]> {
    const podcasts = await this.podcastRepository.find({
      where: { user: { id: userId } },
      relations: ['user'],
    });

    if (!podcasts.length) {
      throw new NotFoundException('Aucun podcast trouvé pour cet utilisateur');
    }

    return podcasts;
  }


}
