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
  Query, UploadedFile,
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
import { FileInterceptor } from '@nestjs/platform-express';
import { createFileTypeInterceptor } from '../shared/interceptors/uplaod-file.interceptor';

@Controller('podcast')
export class PodcastController { 
  constructor(private readonly podcastService: PodcastService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  
  @Post()
  async createPodcast(
    @Body() createPodcastDto: CreatePodcastDto,
    @CurrentUser() currentUser: User 
  ): Promise<Podcast> {
    return this.podcastService.createPodcast(currentUser, createPodcastDto);
  }
  @Post('image')
  @UseInterceptors(
    FileInterceptor('image'),
    createFileTypeInterceptor('image'),
  )
  uploadImage(@UploadedFile() file: Express.Multer.File) {
    return { message: 'Image uploadée avec succès', filename: file.originalname };
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


  @Get(':id/podcasts')
  getpodsbyuser(@Param('id') id: string) {
    return this.podcastService.getpodsparuser(+id);
  }


  
  @Get(':id/episodes')
  findAllEpisodesByPodcastId(@Param('id') id: string){
    return this.podcastService.findAllEpisodesByPodcastId(+id);  // +id to convert string to number
  }



}
