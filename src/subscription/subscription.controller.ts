/* eslint-disable prettier/prettier */
import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { CurrentUser } from 'src/shared/Decorators/user.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { User } from 'src/user/entities/user.entity';

@Controller('subscription')
export class SubscriptionController { 

    constructor(private subscriptionService:SubscriptionService){}
    
    @Get()

    test(){
    return this.subscriptionService.test();
    }

    @Post('subscribe/:podcastid')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('JWT-auth')
    subscribe(@CurrentUser() user:User,@Param('podcastid') podcastid:number){
        const userid = user.id;
        return this.subscriptionService.subscribe(userid,podcastid);
    }
}
