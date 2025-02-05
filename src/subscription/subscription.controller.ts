/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { CurrentUser } from 'src/shared/Decorators/user.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { User } from 'src/user/entities/user.entity';
import { Podcast } from 'src/podcast/entities/podcast.entity';
import { subscriptionPodcast } from './dto/subscriptionPodcast.dto';
import { Episode } from 'src/episode/entities/episode.entity';

@Controller('subscription')
export class SubscriptionController { 

    constructor(private subscriptionService:SubscriptionService){}
    
    

    @Post('subscribe')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('JWT-auth')
    subscribe(@CurrentUser() user:User,@Body() podcast:subscriptionPodcast){
        console.log("podcast",  podcast);
        return this.subscriptionService.subscribe(user,podcast);
    } 


    @Post('unsubscribe')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('JWT-auth')
    unsubscribe(@CurrentUser() user:User,@Body() podcast:subscriptionPodcast){
        return this.subscriptionService.unsubscribe(user,podcast);
    };



    @Get()
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('JWT-auth')
    async getsubscribedEpisodesByUser(@CurrentUser() user: User): Promise<Episode[]> {
      console.log(user);
      return this.subscriptionService.findsubscribedEpisodesByUser(user);
    }
}
