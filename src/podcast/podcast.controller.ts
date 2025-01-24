/* eslint-disable prettier/prettier */
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
import { PodcastService } from './podcast.service';
import { CreatePodcastDto } from './dto/create-podcast.dto';
import { UpdatePodcastDto } from './dto/update-podcast.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';

@Controller('podcast')
export class PodcastController { 
  constructor(private readonly podcastService: PodcastService) {}

  //@UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createPodcastDto: CreatePodcastDto) {
    return this.podcastService.create(createPodcastDto);
  }

  @Get()
  findAll() {
    return this.podcastService.findAll();
  }

  
  @Get('withusers')
  getpodswithusers(){
    return this.podcastService.getpodswithusers();
  }

  @Get('withepisodes')
  getpodswithepisodes(){
    return this.podcastService.getpodswithepisodes();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.podcastService.findOne(+id);
  }
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePodcastDto: UpdatePodcastDto) {
    return this.podcastService.update(+id, updatePodcastDto);
  }
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.podcastService.remove(+id);
  }


  @UseGuards(JwtAuthGuard)
  @Post(':p_id/subscribe')
  subscribe(@Param('p_id') p_id: string, @Req() req) {
    const u_id = req.user.id;
    return this.podcastService.subscribe(+u_id,+p_id);
  }
  @UseGuards(JwtAuthGuard)
  @Post(':p_id/unsubscribe')
  unsubscribe(@Param('p_id') p_id: string, @Req() req) {
    const u_id = req.user.id;
    return this.podcastService.unsubscribe(+u_id,+p_id);
  }

  @Get(':id/podcasts')
  getpodsbyuser(@Param('id') id: string) {
    return this.podcastService.getpodsparuser(+id);
  }


}
