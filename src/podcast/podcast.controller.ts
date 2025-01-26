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
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';

@Controller('podcast')
export class PodcastController { 
  constructor(private readonly podcastService: PodcastService) {}

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
  @Get(':id/episodes')
  findAllEpisodesByPodcastId(@Param('id') id: string){
    return this.podcastService.findAllEpisodesByPodcastId(+id);  // +id to convert string to number
  }
}
