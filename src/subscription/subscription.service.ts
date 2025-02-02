/* eslint-disable prettier/prettier */

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subscription } from './entities/subscription.entity';
import { NotFoundException } from '@nestjs/common';
import { EmailService } from '../email/email.service';
import { User } from '../user/entities/user.entity';
import { Podcast } from '../podcast/entities/podcast.entity';


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
    ){}

    async subscribe(user: User, podcast: Podcast): Promise<any> {

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

        // await this.emailService.sendSubscriptionEmail({
        //   name: user.username + ' ' + user.lastName,
        //   email: user.email,
        //   podcast: podcast.name,
        // });

       return true; // you are not already subscribed+ subscribed successfully
     
  }


  async unsubscribe(user: User, podcast: Podcast): Promise<string> {
    
    if (!user) {
      throw new NotFoundException('User not found');
    }

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


async test(){
    return 'connected successfully';
}
}
