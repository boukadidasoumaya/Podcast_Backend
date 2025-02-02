/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { CurrentUser } from 'src/shared/Decorators/user.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { User } from 'src/user/entities/user.entity';
import { Podcast } from 'src/podcast/entities/podcast.entity';

@Controller('subscription')
export class SubscriptionController { 

    constructor(private subscriptionService:SubscriptionService){}
    
    @Get()

    test(){
    return this.subscriptionService.test();
    }

    @Post('subscribe')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('JWT-auth')
    subscribe(@CurrentUser() user:User,@Body() podcast:Podcast){
        console.log("podcast",  podcast);
        return this.subscriptionService.subscribe(user,podcast);
    } 


    @Post('unsubscribe')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('JWT-auth')
    unsubscribe(@CurrentUser() user:User,@Body() podcast:Podcast){
        return this.subscriptionService.unsubscribe(user,podcast);
    }
}
