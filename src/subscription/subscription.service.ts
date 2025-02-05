/* eslint-disable prettier/prettier */

import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subscription } from './entities/subscription.entity';
import { NotFoundException } from '@nestjs/common';
import { EmailService } from '../email/email.service';
import { User } from '../user/entities/user.entity';
import { Podcast } from '../podcast/entities/podcast.entity';
import { subscriptionPodcast } from './dto/subscriptionPodcast.dto';
import { Episode } from 'src/episode/entities/episode.entity';


@Injectable()
export class SubscriptionService {


    constructor(
        @InjectRepository(Subscription)
        private readonly subscriptionRepository: Repository<Subscription>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(Podcast)
        private readonly podcastRepository: Repository<Podcast>,
        private readonly emailService: EmailService,
        @InjectRepository(Episode)
        private readonly episodeRepository: Repository<Episode>,
    ){}

    async subscribe(user: User, podcast: subscriptionPodcast): Promise<any> {

       if (!user) {
         throw new NotFoundException('User not found');
       }

       if (!podcast) {
         throw new NotFoundException('Podcast not found');
       }
       const podcastExist= await this.podcastRepository.findOne({
        where: {
           id: podcast.id 
        },
      });
      console.log("podcast exist",podcastExist);

       const existingSubscription = await this.subscriptionRepository.findOne({
        where: {
          user: { id: user.id },
          podcast: { id: podcast.id },
        },
      });
      console.log(existingSubscription)

      if (existingSubscription) {

         return false;//your are already subscribed
       }
       const newsubscription = this.subscriptionRepository.create({
            user: user,
            podcast: podcastExist,
        });
        await this.subscriptionRepository.save(newsubscription);

        console.log("hello");

        await this.emailService.sendSubscriptionEmail({
          name: user.username + ' ' + user.lastName,
          email: user.email,
          podcast: podcast.name,
        });

       return true; // you are not already subscribed+ subscribed successfully
     
  }


  async unsubscribe(user: User, podcast: subscriptionPodcast): Promise<any> {
    
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!podcast) {
      throw new NotFoundException('Podcast not found');
    }

    const existingSubscription= this.subscriptionRepository.findOne({
      where:{
        user: {id:user.id},
        podcast : { id: podcast.id}
      }
    });
    if(!existingSubscription){
      return 'You are not subscribed to this podcast';
    }
    console.log((await existingSubscription).id)

    this.subscriptionRepository.softDelete((await existingSubscription).id)

    return 'Unsubscribed successfully';


  }


async test(){
    return 'connected successfully';
};



async findsubscribedEpisodesByUser(user: User): Promise<Episode[]> {
    const subscribedpodcasts= await this.subscriptionRepository.find({
    where:{user:{id:user.id}},
    relations:['podcast']});
    const subscribedEpisodes = [];
    for (let i = 0; i < subscribedpodcasts.length; i++) {
      const subscribedEpisode= await this.episodeRepository.find({
        where:{podcast: {id: subscribedpodcasts[i].podcast.id}},
      });
      for(let j=0;j<subscribedEpisode.length;j++){
        subscribedEpisodes.push(subscribedEpisode[j]);
      }
    }
    return subscribedEpisodes;
  }
}
