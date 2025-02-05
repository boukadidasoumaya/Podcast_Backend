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
  BadRequestException,
  UseInterceptors, NotFoundException,
  Query,
} from '@nestjs/common';
import { PodcastService } from './podcast.service';
import { CreatePodcastDto } from './dto/create-podcast.dto';
import { UpdatePodcastDto } from './dto/update-podcast.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { Podcast } from './entities/podcast.entity';
import { CurrentUser } from 'src/shared/Decorators/user.decorator';
import { User } from 'src/user/entities/user.entity';
import { createFileUploadInterceptor } from 'src/shared/interceptors/file-upload.interceptor';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('podcast')
export class PodcastController { 
  constructor(private readonly podcastService: PodcastService) {}
  @UseInterceptors(
    createFileUploadInterceptor({
      fieldName: 'image',
      destination: 'articles',
      allowedFileTypes: /\.(png|jpeg|jpg)$/i,
      fileSizeLimit: 1000000,
    }),
  )
  @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('JWT-auth')
  
  @Post()
  async createPodcast(
    @Body() createPodcastDto: CreatePodcastDto,
    @CurrentUser() currentUser: User 
  ): Promise<Podcast> {
    return this.podcastService.createPodcast(currentUser, createPodcastDto);
  }
  
  @Get('filter')
  filterpodcasts(@Query() filtres) {
    return this.podcastService.filterpodcasts(filtres)
  }


  @Get('reset')
  findAll() {
    return this.podcastService.getsallpods();
  }
  @UseGuards(JwtAuthGuard)
  @Get('user')
  async getPodcastsByUser(@CurrentUser() currentUser: User) {
    console.log(currentUser);
    const podcasts = await this.podcastService.getPodcastsByUserId(currentUser.id);
    return podcasts;
  }
  
  @Get('withusers')
  getpodswithusers() {
    return this.podcastService.getpodswithusers();
  }

  @Get('withepisodes')
  getpodswithepisodes() {
    return this.podcastService.getpodswithepisodes();
  }
  @Get(':id/first-episode')
  async getFirstEpisode(@Param('id') podcastId: number) {
    const episode = await this.podcastService.findFirstEpisodeByPodcastId(podcastId);
    if (!episode) {
      throw new NotFoundException('Aucun épisode trouvé pour ce podcast.');
    }
    return episode;
  }


  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.podcastService.findOne(+id);
  }
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePodcastDto: UpdatePodcastDto) {
    return this.podcastService.update(+id, updatePodcastDto);
  }
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.podcastService.remove(+id);
  }


  // @UseGuards(JwtAuthGuard)
  // @ApiBearerAuth('JWT-auth')
  // @Post(':p_id/subscribe')
  // subscribe(@Param('p_id') p_id: string, @Req() req) {
  //   const u_id = req.user.id;
  //   return this.podcastService.subscribe(+u_id, +p_id);
  // }
  // @UseGuards(JwtAuthGuard)
  // @ApiBearerAuth('JWT-auth')
  // @Post(':p_id/unsubscribe')
  // unsubscribe(@Param('p_id') p_id: string, @Req() req) {
  //   const u_id = req.user.id;
  //   return this.podcastService.unsubscribe(+u_id, +p_id);
  // }

  @Get(':id/podcasts')
  getpodsbyuser(@Param('id') id: string) {
    return this.podcastService.getpodsparuser(+id);
  }


  
  @Get(':id/episodes')
  findAllEpisodesByPodcastId(@Param('id') id: string){
    return this.podcastService.findAllEpisodesByPodcastId(+id);  // +id to convert string to number
  }



}
