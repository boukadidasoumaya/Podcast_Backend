
/* eslint-disable prettier/prettier */

import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePodcastDto } from './dto/create-podcast.dto';
import { UpdatePodcastDto } from './dto/update-podcast.dto';
import { Podcast } from './entities/podcast.entity';
import { User } from 'src/user/entities/user.entity';
import { EmailService } from 'src/email/email.service';
import { UserService } from 'src/user/user.service';
import { SubscribeService } from 'src/subscribe/subscribe.service';
import { Episode } from 'src/episode/entities/episode.entity';

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
    private readonly subscribeAllService : SubscribeService
  ) {}


 
  async createPodcast(currentUser: User , createPodcastDto :CreatePodcastDto ): Promise<Podcast> {
    const podcast = this.podcastRepository.create({
      ...createPodcastDto,
      user: currentUser,
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
    }}

      if (!currentUser.isOwner) {
      currentUser.isOwner = true;
      await this.userRepository.save(currentUser); 
    }
    // Step 6: Save and return the new podcast
    return await this.podcastRepository.save(podcast);
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

  async getpodsparuser(id:number):Promise<Podcast[]>{
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['subscriptions'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user.subscriptions;
  }

  async getpodswithusers():Promise<Podcast[]>{
    const Pods= await this.podcastRepository.find({
      relations: ['subscribers'],
    })
    return Pods 

  }

  async getpodswithepisodes():Promise<Podcast[]>{
    const Pods= await this.podcastRepository.find({
      relations: ['episodes'],
    })
    return Pods 

  }


  // async getepisodesbyPodcast(id:number):Promise<Podcast>{
    
  // }

}
